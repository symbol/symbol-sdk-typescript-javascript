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
 * @module transactions/SecretProofTransaction
 */
import VerifiableTransaction from './VerifiableTransaction';
import * as SecretProofTransactionBufferPackage from '../buffers/SecretProofTransactionBuffer';
import SecretProofTransactionSchema from '../schema/SecretProofTransactionSchema';
import convert from '../coders/convert';

const { flatbuffers } = require('flatbuffers');

const { SecretProofTransactionBuffer } = SecretProofTransactionBufferPackage.default.Buffers;

export default class SecretProofTransaction extends VerifiableTransaction {
	static get Builder() {
		class Builder {
			constructor() {
				this.fee = [0, 0];
				this.version = 36865;
				this.type = 0x434C;
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

			addHashAlgorithm(hashAlgorithm) {
				this.hashAlgorithm = hashAlgorithm;
				return this;
			}

			addSecret(secret) {
				this.secret = secret;
				return this;
			}

			addProof(proof) {
				this.proof = proof;
				return this;
			}

			build() {
				const builder = new flatbuffers.Builder(1);

				// Create vectors
				const signatureVector = SecretProofTransactionBuffer
					.createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
				const signerVector = SecretProofTransactionBuffer.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
				const deadlineVector = SecretProofTransactionBuffer.createDeadlineVector(builder, this.deadline);
				const feeVector = SecretProofTransactionBuffer.createFeeVector(builder, this.fee);
				const byteSecret = convert.hexToUint8(this.secret);
				const secretVector = SecretProofTransactionBuffer.createSecretVector(builder, byteSecret);
				const byteProof = convert.hexToUint8(this.proof);
				const proofVector = SecretProofTransactionBuffer.createProofVector(builder, byteProof);

				SecretProofTransactionBuffer.startSecretProofTransactionBuffer(builder);
				SecretProofTransactionBuffer.addSize(builder, 155 + byteProof.length);
				SecretProofTransactionBuffer.addSignature(builder, signatureVector);
				SecretProofTransactionBuffer.addSigner(builder, signerVector);
				SecretProofTransactionBuffer.addVersion(builder, this.version);
				SecretProofTransactionBuffer.addType(builder, this.type);
				SecretProofTransactionBuffer.addFee(builder, feeVector);
				SecretProofTransactionBuffer.addDeadline(builder, deadlineVector);
				SecretProofTransactionBuffer.addHashAlgorithm(builder, this.hashAlgorithm);
				SecretProofTransactionBuffer.addSecret(builder, secretVector);
				SecretProofTransactionBuffer.addProofSize(builder, byteProof.length);
				SecretProofTransactionBuffer.addProof(builder, proofVector);

				const codedSecretProof = SecretProofTransactionBuffer.endSecretProofTransactionBuffer(builder);
				builder.finish(codedSecretProof);

				const bytes = builder.asUint8Array();
				return new SecretProofTransaction(bytes, SecretProofTransactionSchema);
			}
		}

		return Builder;
	}
}
