// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

import {IdRegistryEvent as IdRegistryEvent} from './id_registry_event_generated.js';
import {MessageBytes as MessageBytes} from './message_generated.js';

export enum GossipVersion {
  V1 = 1
}

export enum GossipContent {
  NONE = 0,
  MessageBytes = 1,
  IdRegistryEvent = 2,
  ContactInfoContent = 3
}

export function unionToGossipContent(
  type: GossipContent,
  accessor: (obj:ContactInfoContent|IdRegistryEvent|MessageBytes) => ContactInfoContent|IdRegistryEvent|MessageBytes|null
): ContactInfoContent|IdRegistryEvent|MessageBytes|null {
  switch(GossipContent[type]) {
    case 'NONE': return null; 
    case 'MessageBytes': return accessor(new MessageBytes())! as MessageBytes;
    case 'IdRegistryEvent': return accessor(new IdRegistryEvent())! as IdRegistryEvent;
    case 'ContactInfoContent': return accessor(new ContactInfoContent())! as ContactInfoContent;
    default: return null;
  }
}

export function unionListToGossipContent(
  type: GossipContent, 
  accessor: (index: number, obj:ContactInfoContent|IdRegistryEvent|MessageBytes) => ContactInfoContent|IdRegistryEvent|MessageBytes|null, 
  index: number
): ContactInfoContent|IdRegistryEvent|MessageBytes|null {
  switch(GossipContent[type]) {
    case 'NONE': return null; 
    case 'MessageBytes': return accessor(index, new MessageBytes())! as MessageBytes;
    case 'IdRegistryEvent': return accessor(index, new IdRegistryEvent())! as IdRegistryEvent;
    case 'ContactInfoContent': return accessor(index, new ContactInfoContent())! as ContactInfoContent;
    default: return null;
  }
}

export class GossipAddressInfo {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):GossipAddressInfo {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsGossipAddressInfo(bb:flatbuffers.ByteBuffer, obj?:GossipAddressInfo):GossipAddressInfo {
  return (obj || new GossipAddressInfo()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsGossipAddressInfo(bb:flatbuffers.ByteBuffer, obj?:GossipAddressInfo):GossipAddressInfo {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new GossipAddressInfo()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

address():string|null
address(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
address(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

family():number {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.readUint8(this.bb_pos + offset) : 0;
}

port():number {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? this.bb!.readUint16(this.bb_pos + offset) : 0;
}

static startGossipAddressInfo(builder:flatbuffers.Builder) {
  builder.startObject(3);
}

static addAddress(builder:flatbuffers.Builder, addressOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, addressOffset, 0);
}

static addFamily(builder:flatbuffers.Builder, family:number) {
  builder.addFieldInt8(1, family, 0);
}

static addPort(builder:flatbuffers.Builder, port:number) {
  builder.addFieldInt16(2, port, 0);
}

static endGossipAddressInfo(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  builder.requiredField(offset, 4) // address
  return offset;
}

static createGossipAddressInfo(builder:flatbuffers.Builder, addressOffset:flatbuffers.Offset, family:number, port:number):flatbuffers.Offset {
  GossipAddressInfo.startGossipAddressInfo(builder);
  GossipAddressInfo.addAddress(builder, addressOffset);
  GossipAddressInfo.addFamily(builder, family);
  GossipAddressInfo.addPort(builder, port);
  return GossipAddressInfo.endGossipAddressInfo(builder);
}
}

export class ContactInfoContent {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):ContactInfoContent {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsContactInfoContent(bb:flatbuffers.ByteBuffer, obj?:ContactInfoContent):ContactInfoContent {
  return (obj || new ContactInfoContent()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsContactInfoContent(bb:flatbuffers.ByteBuffer, obj?:ContactInfoContent):ContactInfoContent {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new ContactInfoContent()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

gossipAddress(obj?:GossipAddressInfo):GossipAddressInfo|null {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? (obj || new GossipAddressInfo()).__init(this.bb!.__indirect(this.bb_pos + offset), this.bb!) : null;
}

rpcAddress(obj?:GossipAddressInfo):GossipAddressInfo|null {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? (obj || new GossipAddressInfo()).__init(this.bb!.__indirect(this.bb_pos + offset), this.bb!) : null;
}

excludedHashes(index: number):string
excludedHashes(index: number,optionalEncoding:flatbuffers.Encoding):string|Uint8Array
excludedHashes(index: number,optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? this.bb!.__string(this.bb!.__vector(this.bb_pos + offset) + index * 4, optionalEncoding) : null;
}

excludedHashesLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

count():bigint {
  const offset = this.bb!.__offset(this.bb_pos, 10);
  return offset ? this.bb!.readUint64(this.bb_pos + offset) : BigInt('0');
}

static startContactInfoContent(builder:flatbuffers.Builder) {
  builder.startObject(4);
}

static addGossipAddress(builder:flatbuffers.Builder, gossipAddressOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, gossipAddressOffset, 0);
}

static addRpcAddress(builder:flatbuffers.Builder, rpcAddressOffset:flatbuffers.Offset) {
  builder.addFieldOffset(1, rpcAddressOffset, 0);
}

static addExcludedHashes(builder:flatbuffers.Builder, excludedHashesOffset:flatbuffers.Offset) {
  builder.addFieldOffset(2, excludedHashesOffset, 0);
}

static createExcludedHashesVector(builder:flatbuffers.Builder, data:flatbuffers.Offset[]):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]!);
  }
  return builder.endVector();
}

static startExcludedHashesVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static addCount(builder:flatbuffers.Builder, count:bigint) {
  builder.addFieldInt64(3, count, BigInt('0'));
}

static endContactInfoContent(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

}

export class GossipMessage {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):GossipMessage {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsGossipMessage(bb:flatbuffers.ByteBuffer, obj?:GossipMessage):GossipMessage {
  return (obj || new GossipMessage()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsGossipMessage(bb:flatbuffers.ByteBuffer, obj?:GossipMessage):GossipMessage {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new GossipMessage()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

contentType():GossipContent {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.readUint8(this.bb_pos + offset) : GossipContent.NONE;
}

content<T extends flatbuffers.Table>(obj:any):any|null {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.__union(obj, this.bb_pos + offset) : null;
}

topics(index: number):string
topics(index: number,optionalEncoding:flatbuffers.Encoding):string|Uint8Array
topics(index: number,optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? this.bb!.__string(this.bb!.__vector(this.bb_pos + offset) + index * 4, optionalEncoding) : null;
}

topicsLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

peerId(index: number):number|null {
  const offset = this.bb!.__offset(this.bb_pos, 10);
  return offset ? this.bb!.readUint8(this.bb!.__vector(this.bb_pos + offset) + index) : 0;
}

peerIdLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 10);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

peerIdArray():Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 10);
  return offset ? new Uint8Array(this.bb!.bytes().buffer, this.bb!.bytes().byteOffset + this.bb!.__vector(this.bb_pos + offset), this.bb!.__vector_len(this.bb_pos + offset)) : null;
}

version():GossipVersion {
  const offset = this.bb!.__offset(this.bb_pos, 12);
  return offset ? this.bb!.readUint16(this.bb_pos + offset) : GossipVersion.V1;
}

static startGossipMessage(builder:flatbuffers.Builder) {
  builder.startObject(5);
}

static addContentType(builder:flatbuffers.Builder, contentType:GossipContent) {
  builder.addFieldInt8(0, contentType, GossipContent.NONE);
}

static addContent(builder:flatbuffers.Builder, contentOffset:flatbuffers.Offset) {
  builder.addFieldOffset(1, contentOffset, 0);
}

static addTopics(builder:flatbuffers.Builder, topicsOffset:flatbuffers.Offset) {
  builder.addFieldOffset(2, topicsOffset, 0);
}

static createTopicsVector(builder:flatbuffers.Builder, data:flatbuffers.Offset[]):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]!);
  }
  return builder.endVector();
}

static startTopicsVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static addPeerId(builder:flatbuffers.Builder, peerIdOffset:flatbuffers.Offset) {
  builder.addFieldOffset(3, peerIdOffset, 0);
}

static createPeerIdVector(builder:flatbuffers.Builder, data:number[]|Uint8Array):flatbuffers.Offset {
  builder.startVector(1, data.length, 1);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addInt8(data[i]!);
  }
  return builder.endVector();
}

static startPeerIdVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(1, numElems, 1);
}

static addVersion(builder:flatbuffers.Builder, version:GossipVersion) {
  builder.addFieldInt16(4, version, GossipVersion.V1);
}

static endGossipMessage(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  builder.requiredField(offset, 6) // content
  builder.requiredField(offset, 8) // topics
  builder.requiredField(offset, 10) // peer_id
  return offset;
}

static finishGossipMessageBuffer(builder:flatbuffers.Builder, offset:flatbuffers.Offset) {
  builder.finish(offset);
}

static finishSizePrefixedGossipMessageBuffer(builder:flatbuffers.Builder, offset:flatbuffers.Offset) {
  builder.finish(offset, undefined, true);
}

static createGossipMessage(builder:flatbuffers.Builder, contentType:GossipContent, contentOffset:flatbuffers.Offset, topicsOffset:flatbuffers.Offset, peerIdOffset:flatbuffers.Offset, version:GossipVersion):flatbuffers.Offset {
  GossipMessage.startGossipMessage(builder);
  GossipMessage.addContentType(builder, contentType);
  GossipMessage.addContent(builder, contentOffset);
  GossipMessage.addTopics(builder, topicsOffset);
  GossipMessage.addPeerId(builder, peerIdOffset);
  GossipMessage.addVersion(builder, version);
  return GossipMessage.endGossipMessage(builder);
}
}

