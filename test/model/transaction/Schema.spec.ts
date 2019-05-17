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

import {expect} from 'chai';
import {convert} from '../../../src/core/format/convert';
import * as TransferTransactionBufferPackage from '../../../src/model/transaction/TransferTransactionBuffer';

const { array, Schema, table, tableArray, TypeSize, ubyte, uint, ushort } = require('../../../src/model/transaction/Schema');
const { flatbuffers } = require('flatbuffers');
const transfer = require ('../../../../resources/request_before_sign.json');
const { TransferTransactionBuffer, MessageBuffer, MosaicBuffer } = TransferTransactionBufferPackage.default.Buffers;

describe('Schema', () => {
	let bytes;

	before(() => {
		const builder = new flatbuffers.Builder(1);

		// Create message
		const payload = MessageBuffer.createPayloadVector(builder, transfer.message.payload);
		MessageBuffer.startMessageBuffer(builder);
		MessageBuffer.addType(builder, transfer.message.type);
		MessageBuffer.addPayload(builder, payload);
		const message = MessageBuffer.endMessageBuffer(builder);

		// Create mosaics
		const mosaics = [null];
		transfer.mosaics.forEach(mosaic => {
			const id = MosaicBuffer.createAmountVector(builder, mosaic.id);
			const amount = MosaicBuffer.createAmountVector(builder, mosaic.amount);
			MosaicBuffer.startMosaicBuffer(builder);
			MosaicBuffer.addId(builder, id);
			MosaicBuffer.addAmount(builder, amount);
			mosaics.push(MosaicBuffer.endMosaicBuffer(builder));
		});

		// Create vectors
		const signatureVector = TransferTransactionBuffer.createSignatureVector(builder, transfer.signature);
		const signerVector = TransferTransactionBuffer.createSignerVector(builder, transfer.signer);
		const deadlineVector = TransferTransactionBuffer.createDeadlineVector(builder, transfer.deadline);
		const feeVector = TransferTransactionBuffer.createFeeVector(builder, transfer.fee);
		const recipientVector = TransferTransactionBuffer.createRecipientVector(builder, transfer.recipient);
		const mosaicsVector = TransferTransactionBuffer.createMosaicsVector(builder, mosaics);


		TransferTransactionBuffer.startTransferTransactionBuffer(builder);
		TransferTransactionBuffer.addSize(builder, 149 + (16 * transfer.mosaics.length) + transfer.message.payload.length);
		TransferTransactionBuffer.addSignature(builder, signatureVector);
		TransferTransactionBuffer.addSigner(builder, signerVector);
		TransferTransactionBuffer.addVersion(builder, transfer.version);
		TransferTransactionBuffer.addType(builder, transfer.type);
		TransferTransactionBuffer.addFee(builder, feeVector);
		TransferTransactionBuffer.addDeadline(builder, deadlineVector);
		TransferTransactionBuffer.addRecipient(builder, recipientVector);
		TransferTransactionBuffer.addNumMosaics(builder, transfer.mosaics.length);
		TransferTransactionBuffer.addMessageSize(builder, transfer.message.payload.length + 1);
		TransferTransactionBuffer.addMessage(builder, message);
		TransferTransactionBuffer.addMosaics(builder, mosaicsVector);


		// Calculate size

		const codedTransfer = TransferTransactionBuffer.endTransferTransactionBuffer(builder);


		builder.finish(codedTransfer);
		bytes = builder.asUint8Array();
	});

	it('should serialize correctly the FlatBuffers result', () => {
		// Load transfer transaction

		const transferTransactionSchema = new Schema([
			uint('size'),
			array('signature'),
			array('signer'),
			ushort('version'),
			ushort('type'),
			array('fee', TypeSize.INT),
			array('deadline', TypeSize.INT),
			array('recipient'),
			ushort('messageSize'),
			ubyte('numMosaics'),
			table('message', [
				ubyte('type'),
				array('payload')
			]),
			tableArray('mosaics', [
				array('id', TypeSize.INT),
				array('amount', TypeSize.INT)
			])
		]);

		const result = transferTransactionSchema.serialize(Array.from(bytes));
		const resPayload = convert.uint8ToHex(result);

		// expect(resPayload).to.be.equal('A600000026A7C1D2071EFB95EC0F5BE949AE4F561485A1A770662A' +
		// 	'F4F6EF4E1D6896BE30E66F81A4421DF44B2E9644F24C1A45CDCD7AFDDB8EAB1CD98B1C85F73B64A10' +
		// 	'E9A49366406ACA952B88BADF5F1E9BE6CE4968141035A60BE503273EA65456B240390014100000000' +
		// 	'0000000045A40ECB0A00000090E8FEBD671DD41BEE94EC3BA5831CB608A312C2F203BA84AC0200010' +
		// 	'00029CF5FD941AD25D58096980000000000');
	});
});
