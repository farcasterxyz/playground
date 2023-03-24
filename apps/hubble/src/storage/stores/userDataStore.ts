import * as protobufs from '@farcaster/protobufs';
import { bytesCompare, HubAsyncResult, HubError, isHubError } from '@farcaster/utils';
import AsyncLock from 'async-lock';
import { err, ok, ResultAsync } from 'neverthrow';
import { getIdRegistryEventByCustodyAddress } from '~/storage/db/idRegistryEvent';
import {
  deleteMessageTransaction,
  getMessage,
  getMessagesPageByPrefix,
  getMessagesPruneIterator,
  getNextMessageFromIterator,
  makeMessagePrimaryKey,
  makeTsHash,
  makeUserKey,
  putMessageTransaction,
} from '~/storage/db/message';
import { getNameRegistryEvent, putNameRegistryEventTransaction } from '~/storage/db/nameRegistryEvent';
import RocksDB, { Transaction } from '~/storage/db/rocksdb';
import { UserPostfix } from '~/storage/db/types';
import StoreEventHandler, { HubEventArgs } from '~/storage/stores/storeEventHandler';
import { MERGE_TIMEOUT_DEFAULT, MessagesPage, PageOptions, StorePruneOptions } from '~/storage/stores/types';
import { eventCompare } from '~/storage/stores/utils';

const PRUNE_SIZE_LIMIT_DEFAULT = 100;

/**
 * Generates unique keys used to store or fetch UserDataAdd messages in the UserDataAdd set index
 *
 * @param fid farcaster id of the user who created the message
 * @param dataType type of data being added
 * @returns RocksDB key of the form <root_prefix>:<fid>:<user_postfix>:<dataType?>
 */
const makeUserDataAddsKey = (fid: number, dataType?: protobufs.UserDataType): Buffer => {
  return Buffer.concat([
    makeUserKey(fid),
    Buffer.from([UserPostfix.UserDataAdds]),
    dataType ? Buffer.from([dataType]) : Buffer.from(''),
  ]);
};

/**
 * UserDataStore persists UserData messages in RocksDB using a grow-only CRDT set to guarantee
 * eventual consistency.
 *
 * A UserData entry is a key-value pair where the key can be one of a few defined types. They are
 * added and updated with UserDataAdd messages. They cannot be deleted but can be reset to a null
 * value with another UserData add message. UserDataAdd messages collide if the dataType is
 * identical for the same user. Collisions are handled with LWW rules as follows:
 *
 * 1. Highest timestamp wins
 * 2. Highest lexicographic hash wins
 *
 * UserData messages are stored ordinally in RocksDB indexed by a unique key `fid:tsHash` which
 * makes truncating a user's earliest messages easy. Indices are built to look up user data entries
 * in each user's add set. The key value entries created are:
 *
 * 1. fid:tsHash -> cast message
 * 2. fid:set:datatype -> fid:tsHash (adds set index)
 */
class UserDataStore {
  private _db: RocksDB;
  private _eventHandler: StoreEventHandler;
  private _pruneSizeLimit: number;
  private _mergeLock: AsyncLock;

  constructor(db: RocksDB, eventHandler: StoreEventHandler, options: StorePruneOptions = {}) {
    this._db = db;
    this._eventHandler = eventHandler;
    this._pruneSizeLimit = options.pruneSizeLimit ?? PRUNE_SIZE_LIMIT_DEFAULT;
    this._mergeLock = new AsyncLock();
  }

  /**
   * Finds a UserDataAdd Message by checking the adds set index
   *
   * @param fid fid of the user who created the user data add
   * @param dataType type of UserData that was added
   * @returns the UserDataAdd Model if it exists, undefined otherwise
   */
  async getUserDataAdd(fid: number, dataType: protobufs.UserDataType): Promise<protobufs.UserDataAddMessage> {
    const addsKey = makeUserDataAddsKey(fid, dataType);
    const messageTsHash = await this._db.get(addsKey);
    return getMessage(this._db, fid, UserPostfix.UserDataMessage, messageTsHash);
  }

  /** Finds all UserDataAdd messages for an fid */
  async getUserDataAddsByFid(
    fid: number,
    pageOptions: PageOptions = {}
  ): Promise<MessagesPage<protobufs.UserDataAddMessage>> {
    const prefix = makeMessagePrimaryKey(fid, UserPostfix.UserDataMessage);
    return getMessagesPageByPrefix(this._db, prefix, protobufs.isUserDataAddMessage, pageOptions);
  }

  /** Returns the most recent event from the NameEventRegistry contract for an fname */
  async getNameRegistryEvent(fname: Uint8Array): Promise<protobufs.NameRegistryEvent> {
    return getNameRegistryEvent(this._db, fname);
  }

  /**
   * Merges a NameRegistryEvent storing the causally latest event at the key:
   * <name registry root prefix byte, fname>
   */
  async mergeNameRegistryEvent(event: protobufs.NameRegistryEvent): Promise<number> {
    const existingEvent = await ResultAsync.fromPromise(this.getNameRegistryEvent(event.fname), () => undefined);
    if (existingEvent.isOk() && eventCompare(existingEvent.value, event) >= 0) {
      throw new HubError('bad_request.conflict', 'event conflicts with a more recent NameRegistryEvent');
    }

    let txn = this._db.transaction();
    txn = putNameRegistryEventTransaction(txn, event);

    const events: Omit<protobufs.MergeNameRegistryEventHubEvent | protobufs.RevokeMessageHubEvent, 'id'>[] = [];
    events.push({
      type: protobufs.HubEventType.MERGE_NAME_REGISTRY_EVENT,
      mergeNameRegistryEventBody: { nameRegistryEvent: event },
    });

    // When there is a NameRegistryEvent, we need to check if we need to revoke UserDataAdd messages from the
    // previous owner of the name.
    if (event.type === protobufs.NameRegistryEventType.TRANSFER && event.from) {
      // Check to see if the from address has an fid
      const idRegistryEvent = await ResultAsync.fromPromise(
        getIdRegistryEventByCustodyAddress(this._db, event.from),
        () => undefined
      );
      if (idRegistryEvent.isOk()) {
        const fid = idRegistryEvent.value.fid;

        // Check if this fid assigned the fname with a UserDataAdd message
        const fnameAdd = await ResultAsync.fromPromise(
          this.getUserDataAdd(fid, protobufs.UserDataType.FNAME),
          () => undefined
        );
        if (fnameAdd.isOk()) {
          const revokedMessage = fnameAdd.value;
          txn = this.deleteUserDataAddTransaction(txn, revokedMessage);
          events.push({ type: protobufs.HubEventType.REVOKE_MESSAGE, revokeMessageBody: { message: revokedMessage } });
        }
      }
    }

    // TODO
    const result = await this._eventHandler.commitTransaction(txn, events[0] as any);
    if (result.isErr()) {
      throw result.error;
    }
    return result.value;
  }

  /** Merges a UserDataAdd message into the set */
  async merge(message: protobufs.Message): Promise<number> {
    if (!protobufs.isUserDataAddMessage(message)) {
      throw new HubError('bad_request.validation_failure', 'invalid message type');
    }

    return this._mergeLock
      .acquire(
        message.data.fid.toString(),
        async () => {
          return this.mergeDataAdd(message);
        },
        { timeout: MERGE_TIMEOUT_DEFAULT }
      )
      .catch((e: any) => {
        throw isHubError(e) ? e : new HubError('unavailable.storage_failure', 'merge timed out');
      });
  }

  async revoke(message: protobufs.Message): HubAsyncResult<number> {
    let txn = this._db.transaction();
    if (protobufs.isUserDataAddMessage(message)) {
      txn = this.deleteUserDataAddTransaction(txn, message);
    } else {
      return err(new HubError('bad_request.invalid_param', 'invalid message type'));
    }

    return this._eventHandler.commitTransaction(txn, {
      type: protobufs.HubEventType.REVOKE_MESSAGE,
      revokeMessageBody: { message },
    });
  }

  async pruneMessages(fid: number): HubAsyncResult<number[]> {
    const commits: number[] = [];

    const cachedCount = this._eventHandler.getCacheMessageCount(fid, UserPostfix.UserDataMessage);

    // Require storage cache to be synced to prune
    if (cachedCount.isErr()) {
      return err(cachedCount.error);
    }

    // Return immediately if there are no messages to prune
    if (cachedCount.value === 0) {
      return ok(commits);
    }

    // Create a rocksdb iterator for all messages with the given prefix
    const pruneIterator = getMessagesPruneIterator(this._db, fid, UserPostfix.UserDataMessage);

    const pruneNextMessage = async (): HubAsyncResult<number | undefined> => {
      const nextMessage = await ResultAsync.fromPromise(getNextMessageFromIterator(pruneIterator), () => undefined);
      if (nextMessage.isErr()) {
        return ok(undefined); // Nothing left to prune
      }

      const count = this._eventHandler.getCacheMessageCount(fid, UserPostfix.UserDataMessage);
      if (count.isErr()) {
        return err(count.error);
      }

      if (count.value <= this._pruneSizeLimit) {
        return ok(undefined);
      }

      let txn = this._db.transaction();

      if (protobufs.isUserDataAddMessage(nextMessage.value)) {
        txn = this.deleteUserDataAddTransaction(txn, nextMessage.value);
      } else {
        return err(new HubError('unknown', 'invalid message type'));
      }

      return this._eventHandler.commitTransaction(txn, {
        type: protobufs.HubEventType.PRUNE_MESSAGE,
        pruneMessageBody: { message: nextMessage.value },
      });
    };

    let pruneResult = await pruneNextMessage();
    while (pruneResult.isOk() && pruneResult.value !== undefined) {
      commits.push(pruneResult.value);
      pruneResult = await pruneNextMessage();
    }

    await pruneIterator.end();

    if (pruneResult.isErr()) {
      return err(pruneResult.error);
    }

    return ok(commits);
  }

  /* -------------------------------------------------------------------------- */
  /*                               Private Methods                              */
  /* -------------------------------------------------------------------------- */

  private async mergeDataAdd(message: protobufs.UserDataAddMessage): Promise<number> {
    const mergeConflicts = await this.getMergeConflicts(message);
    if (mergeConflicts.isErr()) {
      throw mergeConflicts.error;
    }

    // Create rocksdb transaction to delete the merge conflicts
    let txn = this.deleteManyTransaction(this._db.transaction(), mergeConflicts.value);

    // Add putUserDataAdd operations to the RocksDB transaction
    txn = this.putUserDataAddTransaction(txn, message);

    const hubEvent: HubEventArgs = {
      type: protobufs.HubEventType.MERGE_MESSAGE,
      mergeMessageBody: { message, deletedMessages: mergeConflicts.value },
    };

    // Commit the RocksDB transaction
    const result = await this._eventHandler.commitTransaction(txn, hubEvent);
    if (result.isErr()) {
      throw result.error;
    }
    return result.value;
  }

  private userDataMessageCompare(aTimestampHash: Uint8Array, bTimestampHash: Uint8Array): number {
    return bytesCompare(aTimestampHash, bTimestampHash);
  }

  private async getMergeConflicts(
    message: protobufs.UserDataAddMessage
  ): HubAsyncResult<protobufs.UserDataAddMessage[]> {
    const conflicts: protobufs.UserDataAddMessage[] = [];

    const tsHash = makeTsHash(message.data.timestamp, message.hash);
    if (tsHash.isErr()) {
      throw tsHash.error;
    }

    // Look up the current add timestampHash for this dataType
    const addTimestampHash = await ResultAsync.fromPromise(
      this._db.get(makeUserDataAddsKey(message.data.fid, message.data.userDataBody.type)),
      () => undefined
    );

    if (addTimestampHash.isOk()) {
      const addCompare = this.userDataMessageCompare(addTimestampHash.value, tsHash.value);
      if (addCompare > 0) {
        return err(new HubError('bad_request.conflict', 'message conflicts with a more recent UserDataAdd'));
      } else if (addCompare === 0) {
        return err(new HubError('bad_request.duplicate', 'message has already been merged'));
      } else {
        // If the existing add has a lower order than the new message, retrieve the full
        // UserDataAdd message and delete it as part of the RocksDB transaction
        const existingAdd = await getMessage<protobufs.UserDataAddMessage>(
          this._db,
          message.data.fid,
          UserPostfix.UserDataMessage,
          addTimestampHash.value
        );
        conflicts.push(existingAdd);
      }
    }

    return ok(conflicts);
  }

  private deleteManyTransaction(txn: Transaction, messages: protobufs.UserDataAddMessage[]): Transaction {
    for (const message of messages) {
      if (protobufs.isUserDataAddMessage(message)) {
        txn = this.deleteUserDataAddTransaction(txn, message);
      }
    }
    return txn;
  }

  /* Builds a RocksDB transaction to insert a UserDataAdd message and construct its indices */
  private putUserDataAddTransaction(txn: Transaction, message: protobufs.UserDataAddMessage): Transaction {
    const tsHash = makeTsHash(message.data.timestamp, message.hash);
    if (tsHash.isErr()) {
      throw tsHash.error;
    }

    // Puts the message into the database
    txn = putMessageTransaction(txn, message);

    // Puts the message key into the adds set index
    txn = txn.put(makeUserDataAddsKey(message.data.fid, message.data.userDataBody.type), Buffer.from(tsHash.value));

    return txn;
  }

  /* Builds a RocksDB transaction to remove a UserDataAdd message and delete its indices */
  private deleteUserDataAddTransaction(txn: Transaction, message: protobufs.UserDataAddMessage): Transaction {
    // Delete message key from userData adds set index
    txn = txn.del(makeUserDataAddsKey(message.data.fid, message.data.userDataBody.type));

    // Delete the message
    return deleteMessageTransaction(txn, message);
  }
}

export default UserDataStore;
