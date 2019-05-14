/*
 * Copyright 2018 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// automatically generated by the FlatBuffers compiler, do not modify

/**
 * @const
 * @namespace
 */
var Catapult = Catapult || {};

/**
 * @const
 * @namespace
 */
Catapult.Buffers = Catapult.Buffers || {};

/**
 * @constructor
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer = function () {
	/**
	 * @type {flatbuffers.ByteBuffer}
	 */
	this.bb = null;

	/**
	 * @type {number}
	 */
	this.bb_pos = 0;
};

/**
 * @param {number} i
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {Catapult.Buffers.MosaicSupplyChangeTransactionBuffer}
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.prototype.__init = function (i, bb) {
	this.bb_pos = i;
	this.bb = bb;
	return this;
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {Catapult.Buffers.MosaicSupplyChangeTransactionBuffer=} obj
 * @returns {Catapult.Buffers.MosaicSupplyChangeTransactionBuffer}
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.getRootAsMosaicSupplyChangeTransactionBuffer = function (bb, obj) {
	return (obj || new Catapult.Buffers.MosaicSupplyChangeTransactionBuffer).__init(bb.readInt32(bb.position()) + bb.position(), bb);
};

/**
 * @returns {number}
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.prototype.size = function () {
	var offset = this.bb.__offset(this.bb_pos, 4);
	return offset ? this.bb.readUint32(this.bb_pos + offset) : 0;
};

/**
 * @param {number} index
 * @returns {number}
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.prototype.signature = function (index) {
	var offset = this.bb.__offset(this.bb_pos, 6);
	return offset ? this.bb.readUint8(this.bb.__vector(this.bb_pos + offset) + index) : 0;
};

/**
 * @returns {number}
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.prototype.signatureLength = function () {
	var offset = this.bb.__offset(this.bb_pos, 6);
	return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
};

/**
 * @returns {Uint8Array}
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.prototype.signatureArray = function () {
	var offset = this.bb.__offset(this.bb_pos, 6);
	return offset ? new Uint8Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
};

/**
 * @param {number} index
 * @returns {number}
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.prototype.signer = function (index) {
	var offset = this.bb.__offset(this.bb_pos, 8);
	return offset ? this.bb.readUint8(this.bb.__vector(this.bb_pos + offset) + index) : 0;
};

/**
 * @returns {number}
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.prototype.signerLength = function () {
	var offset = this.bb.__offset(this.bb_pos, 8);
	return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
};

/**
 * @returns {Uint8Array}
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.prototype.signerArray = function () {
	var offset = this.bb.__offset(this.bb_pos, 8);
	return offset ? new Uint8Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
};

/**
 * @returns {number}
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.prototype.version = function () {
	var offset = this.bb.__offset(this.bb_pos, 10);
	return offset ? this.bb.readUint16(this.bb_pos + offset) : 0;
};

/**
 * @returns {number}
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.prototype.type = function () {
	var offset = this.bb.__offset(this.bb_pos, 12);
	return offset ? this.bb.readUint16(this.bb_pos + offset) : 0;
};

/**
 * @param {number} index
 * @returns {number}
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.prototype.fee = function (index) {
	var offset = this.bb.__offset(this.bb_pos, 14);
	return offset ? this.bb.readUint32(this.bb.__vector(this.bb_pos + offset) + index * 4) : 0;
};

/**
 * @returns {number}
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.prototype.feeLength = function () {
	var offset = this.bb.__offset(this.bb_pos, 14);
	return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
};

/**
 * @returns {Uint32Array}
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.prototype.feeArray = function () {
	var offset = this.bb.__offset(this.bb_pos, 14);
	return offset ? new Uint32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
};

/**
 * @param {number} index
 * @returns {number}
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.prototype.deadline = function (index) {
	var offset = this.bb.__offset(this.bb_pos, 16);
	return offset ? this.bb.readUint32(this.bb.__vector(this.bb_pos + offset) + index * 4) : 0;
};

/**
 * @returns {number}
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.prototype.deadlineLength = function () {
	var offset = this.bb.__offset(this.bb_pos, 16);
	return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
};

/**
 * @returns {Uint32Array}
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.prototype.deadlineArray = function () {
	var offset = this.bb.__offset(this.bb_pos, 16);
	return offset ? new Uint32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
};

/**
 * @param {number} index
 * @returns {number}
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.prototype.mosaicId = function (index) {
	var offset = this.bb.__offset(this.bb_pos, 18);
	return offset ? this.bb.readUint32(this.bb.__vector(this.bb_pos + offset) + index * 4) : 0;
};

/**
 * @returns {number}
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.prototype.mosaicIdLength = function () {
	var offset = this.bb.__offset(this.bb_pos, 18);
	return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
};

/**
 * @returns {Uint32Array}
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.prototype.mosaicIdArray = function () {
	var offset = this.bb.__offset(this.bb_pos, 18);
	return offset ? new Uint32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
};

/**
 * @returns {number}
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.prototype.direction = function () {
	var offset = this.bb.__offset(this.bb_pos, 20);
	return offset ? this.bb.readUint8(this.bb_pos + offset) : 0;
};

/**
 * @param {number} index
 * @returns {number}
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.prototype.delta = function (index) {
	var offset = this.bb.__offset(this.bb_pos, 22);
	return offset ? this.bb.readUint32(this.bb.__vector(this.bb_pos + offset) + index * 4) : 0;
};

/**
 * @returns {number}
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.prototype.deltaLength = function () {
	var offset = this.bb.__offset(this.bb_pos, 22);
	return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
};

/**
 * @returns {Uint32Array}
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.prototype.deltaArray = function () {
	var offset = this.bb.__offset(this.bb_pos, 22);
	return offset ? new Uint32Array(this.bb.bytes().buffer, this.bb.bytes().byteOffset + this.bb.__vector(this.bb_pos + offset), this.bb.__vector_len(this.bb_pos + offset)) : null;
};

/**
 * @param {flatbuffers.Builder} builder
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.startMosaicSupplyChangeTransactionBuffer = function (builder) {
	builder.startObject(10);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} size
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.addSize = function (builder, size) {
	builder.addFieldInt32(0, size, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} signatureOffset
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.addSignature = function (builder, signatureOffset) {
	builder.addFieldOffset(1, signatureOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {Array.<number>} data
 * @returns {flatbuffers.Offset}
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.createSignatureVector = function (builder, data) {
	builder.startVector(1, data.length, 1);
	for (var i = data.length - 1; i >= 0; i--) {
		builder.addInt8(data[i]);
	}
	return builder.endVector();
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} numElems
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.startSignatureVector = function (builder, numElems) {
	builder.startVector(1, numElems, 1);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} signerOffset
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.addSigner = function (builder, signerOffset) {
	builder.addFieldOffset(2, signerOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {Array.<number>} data
 * @returns {flatbuffers.Offset}
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.createSignerVector = function (builder, data) {
	builder.startVector(1, data.length, 1);
	for (var i = data.length - 1; i >= 0; i--) {
		builder.addInt8(data[i]);
	}
	return builder.endVector();
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} numElems
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.startSignerVector = function (builder, numElems) {
	builder.startVector(1, numElems, 1);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} version
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.addVersion = function (builder, version) {
	builder.addFieldInt16(3, version, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} type
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.addType = function (builder, type) {
	builder.addFieldInt16(4, type, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} feeOffset
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.addFee = function (builder, feeOffset) {
	builder.addFieldOffset(5, feeOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {Array.<number>} data
 * @returns {flatbuffers.Offset}
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.createFeeVector = function (builder, data) {
	builder.startVector(4, data.length, 4);
	for (var i = data.length - 1; i >= 0; i--) {
		builder.addInt32(data[i]);
	}
	return builder.endVector();
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} numElems
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.startFeeVector = function (builder, numElems) {
	builder.startVector(4, numElems, 4);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} deadlineOffset
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.addDeadline = function (builder, deadlineOffset) {
	builder.addFieldOffset(6, deadlineOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {Array.<number>} data
 * @returns {flatbuffers.Offset}
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.createDeadlineVector = function (builder, data) {
	builder.startVector(4, data.length, 4);
	for (var i = data.length - 1; i >= 0; i--) {
		builder.addInt32(data[i]);
	}
	return builder.endVector();
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} numElems
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.startDeadlineVector = function (builder, numElems) {
	builder.startVector(4, numElems, 4);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} mosaicIdOffset
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.addMosaicId = function (builder, mosaicIdOffset) {
	builder.addFieldOffset(7, mosaicIdOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {Array.<number>} data
 * @returns {flatbuffers.Offset}
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.createMosaicIdVector = function (builder, data) {
	builder.startVector(4, data.length, 4);
	for (var i = data.length - 1; i >= 0; i--) {
		builder.addInt32(data[i]);
	}
	return builder.endVector();
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} numElems
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.startMosaicIdVector = function (builder, numElems) {
	builder.startVector(4, numElems, 4);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} direction
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.addDirection = function (builder, direction) {
	builder.addFieldInt8(8, direction, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} deltaOffset
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.addDelta = function (builder, deltaOffset) {
	builder.addFieldOffset(9, deltaOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {Array.<number>} data
 * @returns {flatbuffers.Offset}
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.createDeltaVector = function (builder, data) {
	builder.startVector(4, data.length, 4);
	for (var i = data.length - 1; i >= 0; i--) {
		builder.addInt32(data[i]);
	}
	return builder.endVector();
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {number} numElems
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.startDeltaVector = function (builder, numElems) {
	builder.startVector(4, numElems, 4);
};

/**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.endMosaicSupplyChangeTransactionBuffer = function (builder) {
	var offset = builder.endObject();
	return offset;
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} offset
 */
Catapult.Buffers.MosaicSupplyChangeTransactionBuffer.finishMosaicSupplyChangeTransactionBufferBuffer = function (builder, offset) {
	builder.finish(offset);
};

// Exports for Node.js and RequireJS
export default Catapult;