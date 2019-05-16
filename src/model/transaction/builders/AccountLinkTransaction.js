/*
 * Copyright 2019 NEM
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
 * @module transactions/AccountLinkTransaction
 */
import VerifiableTransaction from './VerifiableTransaction';
import AccountLinkTransactionBufferPackage from '../AccountLinkTransactionBuffer';
import AccountLinkTransactionSchema from '../AccountLinkTransactionSchema';
import {convert} from "../../../core/format/convert";
const { flatbuffers } = require('flatbuffers');

const { AccountLinkTransactionBuffer } = AccountLinkTransactionBufferPackage.Buffers;

export default class AccountLinkTransaction extends VerifiableTransaction {
	static get Builder() {
		class Builder {
			constructor() {
				this.fee = [0, 0];
				this.version = 36867;
				this.type = 0x414C;
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

			addRemoteAccountKey(remoteAccountKey) {
				this.remoteAccountKey = convert.hexToUint8(remoteAccountKey);
				return this;
			}

			addLinkAction(linkAction) {
				this.linkAction = linkAction;
				return this;
			}
			build() {
				const builder = new flatbuffers.Builder(1);

				// Create vectors
				const signatureVector = AccountLinkTransactionBuffer
					.createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
				const signerVector = AccountLinkTransactionBuffer.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
				const deadlineVector = AccountLinkTransactionBuffer.createDeadlineVector(builder, this.deadline);
				const feeVector = AccountLinkTransactionBuffer.createFeeVector(builder, this.fee);
				const remoteAccountKeyVector = AccountLinkTransactionBuffer.createRemoteAccountKeyVector(builder, this.remoteAccountKey);


				AccountLinkTransactionBuffer.startAccountLinkTransactionBuffer(builder);
				AccountLinkTransactionBuffer.addSize(builder, 154);
				AccountLinkTransactionBuffer.addSignature(builder, signatureVector);
				AccountLinkTransactionBuffer.addSigner(builder, signerVector);
				AccountLinkTransactionBuffer.addVersion(builder, this.version);
				AccountLinkTransactionBuffer.addType(builder, this.type);
				AccountLinkTransactionBuffer.addFee(builder, feeVector);
				AccountLinkTransactionBuffer.addDeadline(builder, deadlineVector);
				AccountLinkTransactionBuffer.addRemoteAccountKey(builder, remoteAccountKeyVector);
				AccountLinkTransactionBuffer.addLinkAction(builder, this.linkAction);


				// Calculate size

				const codedTransfer = AccountLinkTransactionBuffer.endAccountLinkTransactionBuffer(builder);
				builder.finish(codedTransfer);

				const bytes = builder.asUint8Array();
				return new AccountLinkTransaction(bytes, AccountLinkTransactionSchema);
			}
		}

		return Builder;
	}
}
