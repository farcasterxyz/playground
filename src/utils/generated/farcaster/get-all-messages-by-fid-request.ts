// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';



export class GetAllMessagesByFidRequest {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):GetAllMessagesByFidRequest {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsGetAllMessagesByFidRequest(bb:flatbuffers.ByteBuffer, obj?:GetAllMessagesByFidRequest):GetAllMessagesByFidRequest {
  return (obj || new GetAllMessagesByFidRequest()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsGetAllMessagesByFidRequest(bb:flatbuffers.ByteBuffer, obj?:GetAllMessagesByFidRequest):GetAllMessagesByFidRequest {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new GetAllMessagesByFidRequest()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

fid(index: number):number|null {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.readUint8(this.bb!.__vector(this.bb_pos + offset) + index) : 0;
}

fidLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

fidArray():Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? new Uint8Array(this.bb!.bytes().buffer, this.bb!.bytes().byteOffset + this.bb!.__vector(this.bb_pos + offset), this.bb!.__vector_len(this.bb_pos + offset)) : null;
}

static startGetAllMessagesByFidRequest(builder:flatbuffers.Builder) {
  builder.startObject(1);
}

static addFid(builder:flatbuffers.Builder, fidOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, fidOffset, 0);
}

static createFidVector(builder:flatbuffers.Builder, data:number[]|Uint8Array):flatbuffers.Offset {
  builder.startVector(1, data.length, 1);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addInt8(data[i]!);
  }
  return builder.endVector();
}

static startFidVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(1, numElems, 1);
}

static endGetAllMessagesByFidRequest(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  builder.requiredField(offset, 4) // fid
  return offset;
}

static createGetAllMessagesByFidRequest(builder:flatbuffers.Builder, fidOffset:flatbuffers.Offset):flatbuffers.Offset {
  GetAllMessagesByFidRequest.startGetAllMessagesByFidRequest(builder);
  GetAllMessagesByFidRequest.addFid(builder, fidOffset);
  return GetAllMessagesByFidRequest.endGetAllMessagesByFidRequest(builder);
}

unpack(): GetAllMessagesByFidRequestT {
  return new GetAllMessagesByFidRequestT(
    this.bb!.createScalarList(this.fid.bind(this), this.fidLength())
  );
}


unpackTo(_o: GetAllMessagesByFidRequestT): void {
  _o.fid = this.bb!.createScalarList(this.fid.bind(this), this.fidLength());
}
}

export class GetAllMessagesByFidRequestT {
constructor(
  public fid: (number)[] = []
){}


pack(builder:flatbuffers.Builder): flatbuffers.Offset {
  const fid = GetAllMessagesByFidRequest.createFidVector(builder, this.fid);

  return GetAllMessagesByFidRequest.createGetAllMessagesByFidRequest(builder,
    fid
  );
}
}
