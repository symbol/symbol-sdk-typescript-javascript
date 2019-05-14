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
 * @module transactions/MosaicCreationTransaction
 */
import VerifiableTransaction from './VerifiableTransaction';
import { schema as MosaicCreationTransactionSchema,
	schemaNoDuration as MosaicCreationTransactionSchemaNoDuration } from '../schema/MosaicCreationTransactionSchema';
import MosaicCreationTransactionBufferPackage from '../buffers/MosaicCreationTransactionBuffer';

const { flatbuffers } = require('flatbuffers');

const { MosaicCreationTransactionBuffer } = MosaicCreationTransactionBufferPackage.Buffers;

export default class MosaicCreationTransaction extends VerifiableTransaction {
	static get Builder() {
		class Builder {
			constructor() {
				this.flags = 0;
				this.fee = [0, 0];
				this.version = 36867;
				this.type = 0x414d;
				this.nonce = 0;
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

			addNonce(nonce) {
				this.nonce = nonce;
				return this;
			}

			addDeadline(deadline) {
				this.deadline = deadline;
				return this;
			}

			addDuration(duration) {
				this.duration = duration;
				return this;
			}

			addDivisibility(divisibility) {
				this.divisibility = divisibility;
				return this;
			}

			addSupplyMutable() {
				this.flags += 1;
				return this;
			}

			addTransferability() {
				this.flags += 2;
				return this;
			}

			addLevyMutable() {
				this.flags += 4;
				return this;
			}

			addMosaicId(mosaicId) {
				this.mosaicId = mosaicId;
				return this;
			}

			build() {
				const builder = new flatbuffers.Builder(1);

				// Create vectors
				const signatureVector = MosaicCreationTransactionBuffer
					.createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
				const signerVector = MosaicCreationTransactionBuffer
					.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
				const deadlineVector = MosaicCreationTransactionBuffer
					.createDeadlineVector(builder, this.deadline);
				const feeVector = MosaicCreationTransactionBuffer
					.createFeeVector(builder, this.fee);
				const nonceVector = MosaicCreationTransactionBuffer
					.createNonceVector(builder, this.nonce);
				const mosaicIdVector = MosaicCreationTransactionBuffer
					.createMosaicIdVector(builder, this.mosaicId);

				const durationVector = MosaicCreationTransactionBuffer
					.createDurationVector(builder, this.duration);

				const durationProvided = 0 < this.duration.length;

				MosaicCreationTransactionBuffer.startMosaicCreationTransactionBuffer(builder);
				MosaicCreationTransactionBuffer.addSize(builder, durationProvided ? 144 : 135);
				MosaicCreationTransactionBuffer.addSignature(builder, signatureVector);
				MosaicCreationTransactionBuffer.addSigner(builder, signerVector);
				MosaicCreationTransactionBuffer.addVersion(builder, this.version);
				MosaicCreationTransactionBuffer.addType(builder, this.type);
				MosaicCreationTransactionBuffer.addFee(builder, feeVector);
				MosaicCreationTransactionBuffer.addDeadline(builder, deadlineVector);
				MosaicCreationTransactionBuffer.addNonce(builder, nonceVector);
				MosaicCreationTransactionBuffer.addMosaicId(builder, mosaicIdVector);
				MosaicCreationTransactionBuffer.addNumOptionalProperties(builder, durationProvided ? 1 : 0);
				MosaicCreationTransactionBuffer.addFlags(builder, this.flags);

				MosaicCreationTransactionBuffer.addDivisibility(builder, this.divisibility);

				if (durationProvided) {
					MosaicCreationTransactionBuffer.addIndicateDuration(builder, 2);
					MosaicCreationTransactionBuffer.addDuration(builder, durationVector);
				}

				// Calculate size

				const codedMosaicCreation = MosaicCreationTransactionBuffer.endMosaicCreationTransactionBuffer(builder);
				builder.finish(codedMosaicCreation);

				const bytes = builder.asUint8Array();

				const schema = durationProvided ? MosaicCreationTransactionSchema : MosaicCreationTransactionSchemaNoDuration;
				return new MosaicCreationTransaction(bytes, schema);
			}
		}

		return Builder;
	}
}
