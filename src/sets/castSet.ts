import { Result, ok, err } from 'neverthrow';
import { Cast, CastRemove, CastRecast, CastShort } from '~/types';
import { isCastRemove, isCastRecast, isCastShort } from '~/types/typeguards';
import { sanitizeSigner } from '~/utils';

class CastSet {
  private _adds: Map<string, CastShort | CastRecast>;
  private _removes: Map<string, CastRemove>;

  constructor() {
    this._adds = new Map();
    this._removes = new Map();
  }

  /** Get a cast by its hash */
  get(hash: string): CastShort | CastRecast | CastRemove | undefined {
    return this._adds.get(hash) || this._removes.get(hash);
  }

  // TODO: add query API

  merge(cast: Cast): Result<void, string> {
    if (isCastRemove(cast)) {
      return this.remove(cast);
    }

    if (isCastRecast(cast) || isCastShort(cast)) {
      return this.add(cast);
    }
    return err('CastSet.merge: invalid message format');
  }

  revokeSigner(signer: string): Result<void, string> {
    // Look through adds
    for (const [hash, cast] of this._adds) {
      if (sanitizeSigner(cast.signer) === signer) {
        this._adds.delete(hash);
      }
    }

    // Look through removes
    for (const [hash, cast] of this._removes) {
      if (sanitizeSigner(cast.signer) === signer) {
        this._removes.delete(hash);
      }
    }

    return ok(undefined);
  }

  static replacer(key: any, value: any) {
    if (value instanceof CastSet) {
      return {
        $class: 'CastSet',
        $props: {
          _adds: Array.from(value._adds.entries()),
          _removes: Array.from(value._removes.entries()),
        },
      };
    }
    return value;
  }

  static reviver(key: any, value: any) {
    if (value && value.$class === 'CastSet') {
      const obj = new CastSet();
      obj._adds = new Map(value.$props._adds);
      obj._removes = new Map(value.$props._removes);
      return obj;
    }
  }

  /**
   * Private Methods
   */

  private add(message: CastShort | CastRecast): Result<void, string> {
    /** If message has already been removed, no-op */
    if (this._removes.has(message.hash)) return ok(undefined);

    /** If message has already been added, no-op */
    if (this._adds.has(message.hash)) return ok(undefined);

    this._adds.set(message.hash, message);
    return ok(undefined);
  }

  private remove(message: CastRemove): Result<void, string> {
    const { targetHash } = message.data.body;

    /** If message has already been removed, no-op */
    if (this._removes.has(targetHash)) return ok(undefined);

    /** If message has been added, drop it from adds set */
    if (this._adds.has(targetHash)) {
      this._adds.delete(targetHash);
    }

    this._removes.set(targetHash, message);
    return ok(undefined);
  }

  /**
   * Testing Methods
   */

  _getAdds(): Set<CastShort | CastRecast> {
    return new Set([...this._adds.values()]);
  }

  _getRemoves(): Set<CastRemove> {
    return new Set([...this._removes.values()]);
  }

  _reset(): void {
    this._adds = new Map();
    this._removes = new Map();
  }
}

export default CastSet;
