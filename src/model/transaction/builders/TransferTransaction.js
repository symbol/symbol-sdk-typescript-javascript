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

/**
 * @module transactions/TransferTransaction
 */
import VerifiableTransaction from './VerifiableTransaction';
import * as TransferTransactionBufferPackage from '../TransferTransactionBuffer';
const convert = require('../../../core/format/convert').default;
import TransferTransactionSchema from '../TransferTransactionSchema';

const { flatbuffers } = require('flatbuffers');
const address = require('../../../core/format/address').default;

const { TransferTransactionBuffer, MessageBuffer, MosaicBuffer } = TransferTransactionBufferPackage.default.Buffers;

export default class TransferTransaction extends VerifiableTransaction {
	static get Builder() {
		class Builder {
			constructor() {
				this.fee = [0, 0];
				this.version = 36867;
				this.type = 0x4154;
			}

			addFee(fee) {
				this.fee = fee;
				return this;
			}

			addVersion(version) {
				this.version = version;
				return this;
			}

			addType(type) {
				this.type = type;
				return this;
			}

			addDeadline(deadline) {
				this.deadline = deadline;
				return this;
			}

			addRecipient(recipient) {
				if (/^[0-9a-fA-F]{16}$/.test(recipient)) {
					// received hexadecimal notation of namespaceId (alias)
					this.recipient = address.aliasToRecipient(convert.hexToUint8(recipient));
				} else {
					// received recipient address
					this.recipient = address.stringToAddress(recipient);
				}
				return this;
			}

			addMessage(message) {
				this.message = message;
				return this;
			}

			addMosaics(mosaics) {
				this.mosaics = mosaics.sort((a, b) => {
					if (Number(a.id[1]) > b.id[1]) return 1;
					else if (a.id[1] < b.id[1]) return -1;
					return 0;
				});
				return this;
			}

			build() {
				const builder = new flatbuffers.Builder(1);
				// Constants

				// Create message
				const bytePayload = convert.hexToUint8(convert.utf8ToHex(this.message.payload));
				const payload = MessageBuffer.createPayloadVector(builder, bytePayload);
				MessageBuffer.startMessageBuffer(builder);
				MessageBuffer.addType(builder, this.message.type);
				MessageBuffer.addPayload(builder, payload);
				const message = MessageBuffer.endMessageBuffer(builder);

				// Create mosaics
				const mosaics = [];
				this.mosaics.forEach(mosaic => {
					const id = MosaicBuffer.createIdVector(builder, mosaic.id);
					const amount = MosaicBuffer.createAmountVector(builder, mosaic.amount);
					MosaicBuffer.startMosaicBuffer(builder);
					MosaicBuffer.addId(builder, id);
					MosaicBuffer.addAmount(builder, amount);
					mosaics.push(MosaicBuffer.endMosaicBuffer(builder));
				});

				// Create vectors
				const signatureVector = TransferTransactionBuffer
					.createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
				const signerVector = TransferTransactionBuffer.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
				const deadlineVector = TransferTransactionBuffer.createDeadlineVector(builder, this.deadline);
				const feeVector = TransferTransactionBuffer.createFeeVector(builder, this.fee);
				const recipientVector = TransferTransactionBuffer.createRecipientVector(builder, this.recipient);
				const mosaicsVector = TransferTransactionBuffer.createMosaicsVector(builder, mosaics);


				TransferTransactionBuffer.startTransferTransactionBuffer(builder);
				TransferTransactionBuffer.addSize(builder, 149 + (16 * this.mosaics.length) + bytePayload.length);
				TransferTransactionBuffer.addSignature(builder, signatureVector);
				TransferTransactionBuffer.addSigner(builder, signerVector);
				TransferTransactionBuffer.addVersion(builder, this.version);
				TransferTransactionBuffer.addType(builder, this.type);
				TransferTransactionBuffer.addFee(builder, feeVector);
				TransferTransactionBuffer.addDeadline(builder, deadlineVector);
				TransferTransactionBuffer.addRecipient(builder, recipientVector);
				TransferTransactionBuffer.addNumMosaics(builder, this.mosaics.length);
				TransferTransactionBuffer.addMessageSize(builder, bytePayload.length + 1);
				TransferTransactionBuffer.addMessage(builder, message);
				TransferTransactionBuffer.addMosaics(builder, mosaicsVector);


				// Calculate size

				const codedTransfer = TransferTransactionBuffer.endTransferTransactionBuffer(builder);
				builder.finish(codedTransfer);

				const bytes = builder.asUint8Array();
				return new TransferTransaction(bytes, TransferTransactionSchema);
			}
		}

		return Builder;
	}
}

