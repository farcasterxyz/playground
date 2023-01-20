// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';


export enum NameRegistryEventType {
  NameRegistryTransfer = 1,
  NameRegistryRenew = 2
}

export class NameRegistryEvent {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):NameRegistryEvent {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsNameRegistryEvent(bb:flatbuffers.ByteBuffer, obj?:NameRegistryEvent):NameRegistryEvent {
  return (obj || new NameRegistryEvent()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsNameRegistryEvent(bb:flatbuffers.ByteBuffer, obj?:NameRegistryEvent):NameRegistryEvent {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new NameRegistryEvent()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

blockNumber():number {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.readUint32(this.bb_pos + offset) : 0;
}

blockHash(index: number):number|null {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.readUint8(this.bb!.__vector(this.bb_pos + offset) + index) : 0;
}

blockHashLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

blockHashArray():Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? new Uint8Array(this.bb!.bytes().buffer, this.bb!.bytes().byteOffset + this.bb!.__vector(this.bb_pos + offset), this.bb!.__vector_len(this.bb_pos + offset)) : null;
}

transactionHash(index: number):number|null {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? this.bb!.readUint8(this.bb!.__vector(this.bb_pos + offset) + index) : 0;
}

transactionHashLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

transactionHashArray():Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? new Uint8Array(this.bb!.bytes().buffer, this.bb!.bytes().byteOffset + this.bb!.__vector(this.bb_pos + offset), this.bb!.__vector_len(this.bb_pos + offset)) : null;
}

logIndex():number {
  const offset = this.bb!.__offset(this.bb_pos, 10);
  return offset ? this.bb!.readUint16(this.bb_pos + offset) : 0;
}

fname(index: number):number|null {
  const offset = this.bb!.__offset(this.bb_pos, 12);
  return offset ? this.bb!.readUint8(this.bb!.__vector(this.bb_pos + offset) + index) : 0;
}

fnameLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 12);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

fnameArray():Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 12);
  return offset ? new Uint8Array(this.bb!.bytes().buffer, this.bb!.bytes().byteOffset + this.bb!.__vector(this.bb_pos + offset), this.bb!.__vector_len(this.bb_pos + offset)) : null;
}

from(index: number):number|null {
  const offset = this.bb!.__offset(this.bb_pos, 14);
  return offset ? this.bb!.readUint8(this.bb!.__vector(this.bb_pos + offset) + index) : 0;
}

fromLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 14);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

fromArray():Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 14);
  return offset ? new Uint8Array(this.bb!.bytes().buffer, this.bb!.bytes().byteOffset + this.bb!.__vector(this.bb_pos + offset), this.bb!.__vector_len(this.bb_pos + offset)) : null;
}

to(index: number):number|null {
  const offset = this.bb!.__offset(this.bb_pos, 16);
  return offset ? this.bb!.readUint8(this.bb!.__vector(this.bb_pos + offset) + index) : 0;
}

toLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 16);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

toArray():Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 16);
  return offset ? new Uint8Array(this.bb!.bytes().buffer, this.bb!.bytes().byteOffset + this.bb!.__vector(this.bb_pos + offset), this.bb!.__vector_len(this.bb_pos + offset)) : null;
}

type():NameRegistryEventType {
  const offset = this.bb!.__offset(this.bb_pos, 18);
  return offset ? this.bb!.readUint8(this.bb_pos + offset) : NameRegistryEventType.NameRegistryTransfer;
}

expiry(index: number):number|null {
  const offset = this.bb!.__offset(this.bb_pos, 20);
  return offset ? this.bb!.readUint8(this.bb!.__vector(this.bb_pos + offset) + index) : 0;
}

expiryLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 20);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

expiryArray():Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 20);
  return offset ? new Uint8Array(this.bb!.bytes().buffer, this.bb!.bytes().byteOffset + this.bb!.__vector(this.bb_pos + offset), this.bb!.__vector_len(this.bb_pos + offset)) : null;
}

static startNameRegistryEvent(builder:flatbuffers.Builder) {
  builder.startObject(9);
}

static addBlockNumber(builder:flatbuffers.Builder, blockNumber:number) {
  builder.addFieldInt32(0, blockNumber, 0);
}

static addBlockHash(builder:flatbuffers.Builder, blockHashOffset:flatbuffers.Offset) {
  builder.addFieldOffset(1, blockHashOffset, 0);
}

static createBlockHashVector(builder:flatbuffers.Builder, data:number[]|Uint8Array):flatbuffers.Offset {
  builder.startVector(1, data.length, 1);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addInt8(data[i]!);
  }
  return builder.endVector();
}

static startBlockHashVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(1, numElems, 1);
}

static addTransactionHash(builder:flatbuffers.Builder, transactionHashOffset:flatbuffers.Offset) {
  builder.addFieldOffset(2, transactionHashOffset, 0);
}

static createTransactionHashVector(builder:flatbuffers.Builder, data:number[]|Uint8Array):flatbuffers.Offset {
  builder.startVector(1, data.length, 1);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addInt8(data[i]!);
  }
  return builder.endVector();
}

static startTransactionHashVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(1, numElems, 1);
}

static addLogIndex(builder:flatbuffers.Builder, logIndex:number) {
  builder.addFieldInt16(3, logIndex, 0);
}

static addFname(builder:flatbuffers.Builder, fnameOffset:flatbuffers.Offset) {
  builder.addFieldOffset(4, fnameOffset, 0);
}

static createFnameVector(builder:flatbuffers.Builder, data:number[]|Uint8Array):flatbuffers.Offset {
  builder.startVector(1, data.length, 1);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addInt8(data[i]!);
  }
  return builder.endVector();
}

static startFnameVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(1, numElems, 1);
}

static addFrom(builder:flatbuffers.Builder, fromOffset:flatbuffers.Offset) {
  builder.addFieldOffset(5, fromOffset, 0);
}

static createFromVector(builder:flatbuffers.Builder, data:number[]|Uint8Array):flatbuffers.Offset {
  builder.startVector(1, data.length, 1);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addInt8(data[i]!);
  }
  return builder.endVector();
}

static startFromVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(1, numElems, 1);
}

static addTo(builder:flatbuffers.Builder, toOffset:flatbuffers.Offset) {
  builder.addFieldOffset(6, toOffset, 0);
}

static createToVector(builder:flatbuffers.Builder, data:number[]|Uint8Array):flatbuffers.Offset {
  builder.startVector(1, data.length, 1);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addInt8(data[i]!);
  }
  return builder.endVector();
}

static startToVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(1, numElems, 1);
}

static addType(builder:flatbuffers.Builder, type:NameRegistryEventType) {
  builder.addFieldInt8(7, type, NameRegistryEventType.NameRegistryTransfer);
}

static addExpiry(builder:flatbuffers.Builder, expiryOffset:flatbuffers.Offset) {
  builder.addFieldOffset(8, expiryOffset, 0);
}

static createExpiryVector(builder:flatbuffers.Builder, data:number[]|Uint8Array):flatbuffers.Offset {
  builder.startVector(1, data.length, 1);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addInt8(data[i]!);
  }
  return builder.endVector();
}

static startExpiryVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(1, numElems, 1);
}

static endNameRegistryEvent(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  builder.requiredField(offset, 6) // block_hash
  builder.requiredField(offset, 8) // transaction_hash
  return offset;
}

static finishNameRegistryEventBuffer(builder:flatbuffers.Builder, offset:flatbuffers.Offset) {
  builder.finish(offset);
}

static finishSizePrefixedNameRegistryEventBuffer(builder:flatbuffers.Builder, offset:flatbuffers.Offset) {
  builder.finish(offset, undefined, true);
}

static createNameRegistryEvent(builder:flatbuffers.Builder, blockNumber:number, blockHashOffset:flatbuffers.Offset, transactionHashOffset:flatbuffers.Offset, logIndex:number, fnameOffset:flatbuffers.Offset, fromOffset:flatbuffers.Offset, toOffset:flatbuffers.Offset, type:NameRegistryEventType, expiryOffset:flatbuffers.Offset):flatbuffers.Offset {
  NameRegistryEvent.startNameRegistryEvent(builder);
  NameRegistryEvent.addBlockNumber(builder, blockNumber);
  NameRegistryEvent.addBlockHash(builder, blockHashOffset);
  NameRegistryEvent.addTransactionHash(builder, transactionHashOffset);
  NameRegistryEvent.addLogIndex(builder, logIndex);
  NameRegistryEvent.addFname(builder, fnameOffset);
  NameRegistryEvent.addFrom(builder, fromOffset);
  NameRegistryEvent.addTo(builder, toOffset);
  NameRegistryEvent.addType(builder, type);
  NameRegistryEvent.addExpiry(builder, expiryOffset);
  return NameRegistryEvent.endNameRegistryEvent(builder);
}
}

