import Server from '~/network/rpc/flatbuffers/server';
import { jestBinaryRocksDB } from '~/storage/db/jestUtils';
import Client from '~/network/rpc/flatbuffers/client';
import MessageModel from '~/storage/flatbuffers/messageModel';
import Factories from '~/test/factories/flatbuffer';
import Engine from '~/storage/engine/flatbuffers';
import { AmpAddModel, SignerAddModel } from '~/storage/flatbuffers/types';
import { Wallet, utils } from 'ethers';
import { generateEd25519KeyPair } from '~/utils/crypto';
import IdRegistryEventModel from '~/storage/flatbuffers/idRegistryEventModel';
import { KeyPair } from '~/types';
import { UserId } from '~/utils/generated/message_generated';
import { HubError } from '~/utils/hubErrors';
import { addressInfoFromParts } from '~/utils/p2p';

const db = jestBinaryRocksDB('flatbuffers.rpc.ampService.test');
const engine = new Engine(db);

let server: Server;
let client: Client;

beforeAll(async () => {
  server = new Server(engine);
  const port = await server.start();
  client = new Client(addressInfoFromParts('127.0.0.1', port)._unsafeUnwrap());
});

afterAll(async () => {
  client.close();
  await server.stop();
});

const fid = Factories.FID.build();
const wallet = new Wallet(utils.randomBytes(32));
let custodyEvent: IdRegistryEventModel;
let signer: KeyPair;
let signerAdd: SignerAddModel;
let ampAdd: AmpAddModel;

beforeAll(async () => {
  custodyEvent = new IdRegistryEventModel(
    await Factories.IdRegistryEvent.create(
      { to: Array.from(utils.arrayify(wallet.address)), fid: Array.from(fid) },
      { transient: { wallet } }
    )
  );

  signer = await generateEd25519KeyPair();
  const signerAddData = await Factories.SignerAddData.create({
    body: Factories.SignerBody.build({ signer: Array.from(signer.publicKey) }),
    fid: Array.from(fid),
  });
  signerAdd = new MessageModel(
    await Factories.Message.create({ data: Array.from(signerAddData.bb?.bytes() ?? []) }, { transient: { wallet } })
  ) as SignerAddModel;

  const ampAddData = await Factories.AmpAddData.create({
    fid: Array.from(fid),
  });
  ampAdd = new MessageModel(
    await Factories.Message.create({ data: Array.from(ampAddData.bb?.bytes() ?? []) }, { transient: { signer } })
  ) as AmpAddModel;
});

describe('getAmp', () => {
  beforeEach(async () => {
    await engine.mergeIdRegistryEvent(custodyEvent);
    await engine.mergeMessage(signerAdd);
  });

  test('succeeds', async () => {
    await engine.mergeMessage(ampAdd);
    const result = await client.getAmp(fid, ampAdd.body().user() ?? new UserId());
    expect(result._unsafeUnwrap()).toEqual(ampAdd);
  });

  test('fails if amp is missing', async () => {
    const result = await client.getAmp(fid, ampAdd.body().user() ?? new UserId());
    expect(result._unsafeUnwrapErr().errCode).toEqual('not_found');
  });

  test('fails without user', async () => {
    const user = await Factories.UserId.create({ fid: [] });
    const result = await client.getAmp(fid, user);
    // TODO: improve error messages so we know this is user.fid is missing
    expect(result._unsafeUnwrapErr()).toEqual(new HubError('bad_request.validation_failure', 'fid is missing'));
  });

  test('fails without fid', async () => {
    const result = await client.getAmp(new Uint8Array(), ampAdd.body().user() ?? new UserId());
    expect(result._unsafeUnwrapErr()).toEqual(new HubError('bad_request.validation_failure', 'fid is missing'));
  });
});

describe('getAmpsByFid', () => {
  beforeEach(async () => {
    await engine.mergeIdRegistryEvent(custodyEvent);
    await engine.mergeMessage(signerAdd);
  });

  test('succeeds', async () => {
    await engine.mergeMessage(ampAdd);
    const amps = await client.getAmpsByFid(fid);
    // The underlying buffers are different, so we can't compare full messages directly
    expect(amps._unsafeUnwrap().map((msg) => msg.hash())).toEqual([ampAdd.hash()]);
  });

  test('returns empty array without messages', async () => {
    const amps = await client.getAmpsByFid(fid);
    expect(amps._unsafeUnwrap()).toEqual([]);
  });
});

describe('getAmpsByUser', () => {
  beforeEach(async () => {
    await engine.mergeIdRegistryEvent(custodyEvent);
    await engine.mergeMessage(signerAdd);
  });

  test('succeeds', async () => {
    await engine.mergeMessage(ampAdd);
    const amps = await client.getAmpsByUser(ampAdd.body().user() ?? new UserId());
    // The underlying buffers are different, so we can't compare full messages directly
    expect(amps._unsafeUnwrap().map((msg) => msg.hash())).toEqual([ampAdd.hash()]);
  });

  test('returns empty array without messages', async () => {
    const amps = await client.getAmpsByUser(ampAdd.body().user() ?? new UserId());
    expect(amps._unsafeUnwrap()).toEqual([]);
  });
});
