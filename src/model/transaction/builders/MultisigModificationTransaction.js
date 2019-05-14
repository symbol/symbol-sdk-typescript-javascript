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

import VerifiableTransaction from './VerifiableTransaction';
import MultisigModificationTransactionSchema from '../schema/MultisigModificationTransactionSchema';
import convert from '../coders/convert';
import MultisigModificationTransactionBufferPackage from '../buffers/MultisigModificationTransactionBuffer';

const { flatbuffers } = require('flatbuffers');

const {
	MultisigModificationTransactionBuffer,
	CosignatoryModificationBuffer
} = MultisigModificationTransactionBufferPackage.Buffers;

/**
 * @module transactions/MultisigModificationTransaction
 */
export default class MultisigModificationTransaction extends VerifiableTransaction {
	static get Builder() {
		class Builder {
			constructor() {
				this.fee = [0, 0];
				this.version = 36867;
				this.type = 0x4155;
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

			addMinRemovalDelta(minRemovalDelta) {
				this.minRemovalDelta = minRemovalDelta;
				return this;
			}

			addMinApprovalDelta(minApprovalDelta) {
				this.minApprovalDelta = minApprovalDelta;
				return this;
			}

			addModifications(modifications) {
				this.modifications = modifications;
				return this;
			}

			build() {
				const builder = new flatbuffers.Builder(1);

				// Create modifications
				const modificationsArray = [];
				this.modifications.forEach(modification => {
					const cosignatoryPublicKeyVector = CosignatoryModificationBuffer
						.createCosignatoryPublicKeyVector(builder, convert.hexToUint8(modification.cosignatoryPublicKey));
					CosignatoryModificationBuffer.startCosignatoryModificationBuffer(builder);
					CosignatoryModificationBuffer.addType(builder, modification.type);
					CosignatoryModificationBuffer.addCosignatoryPublicKey(builder, cosignatoryPublicKeyVector);
					modificationsArray.push(CosignatoryModificationBuffer.endCosignatoryModificationBuffer(builder));
				});

				// Create vectors
				const signatureVector = MultisigModificationTransactionBuffer
					.createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
				const signerVector = MultisigModificationTransactionBuffer
					.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
				const deadlineVector = MultisigModificationTransactionBuffer
					.createDeadlineVector(builder, this.deadline);
				const feeVector = MultisigModificationTransactionBuffer
					.createFeeVector(builder, this.fee);
				const modificationsVector = MultisigModificationTransactionBuffer
					.createModificationsVector(builder, modificationsArray);

				MultisigModificationTransactionBuffer.startMultisigModificationTransactionBuffer(builder);
				MultisigModificationTransactionBuffer.addSize(builder, 123 + (33 * this.modifications.length));
				MultisigModificationTransactionBuffer.addSignature(builder, signatureVector);
				MultisigModificationTransactionBuffer.addSigner(builder, signerVector);
				MultisigModificationTransactionBuffer.addVersion(builder, this.version);
				MultisigModificationTransactionBuffer.addType(builder, this.type);
				MultisigModificationTransactionBuffer.addFee(builder, feeVector);
				MultisigModificationTransactionBuffer.addDeadline(builder, deadlineVector);
				MultisigModificationTransactionBuffer.addMinRemovalDelta(builder, this.minRemovalDelta);
				MultisigModificationTransactionBuffer.addMinApprovalDelta(builder, this.minApprovalDelta);
				MultisigModificationTransactionBuffer.addNumModifications(builder, this.modifications.length);
				MultisigModificationTransactionBuffer.addModifications(builder, modificationsVector);


				// Calculate size
				const codedMultisigAggregate = MultisigModificationTransactionBuffer
					.endMultisigModificationTransactionBuffer(builder);
				builder.finish(codedMultisigAggregate);

				const bytes = builder.asUint8Array();
				return new MultisigModificationTransaction(bytes, MultisigModificationTransactionSchema);
			}
		}

		return Builder;
	}
}
