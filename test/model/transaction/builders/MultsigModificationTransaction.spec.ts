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
import deadline from '../../../../src/model/transaction/builders/Deadline';
const  MultisigModificationTransaction = require('../../../../src/model/transaction/builders/MultisigModificationTransaction').default;

describe('MultisigModificationTransaction', () => {
	const keyPair = {
		publicKey: 'cf893ffcc47c33e7f68ab1db56365c156b0736824a0c1e273f9e00b8df8f01eb',
		privateKey: '2a2b1f5d366a5dd5dc56c3c757cf4fe6c66e2787087692cf329d7a49a594658b'
	};

	it('should create multisig aggregate transaction', () => {
		const multisigAggregateTransaction = {
			deadline: deadline(),
			minRemovalDelta: 1,
			minApprovalDelta: 2,
			modifications: [{
				type: 0,
				cosignatoryPublicKey: '68b3fbb18729c1fde225c57f8ce080fa828f0067e451a3fd81fa628842b0b763'
			}, {
				type: 0,
				cosignatoryPublicKey: 'cf893ffcc47c33e7f68ab1db56365c156b0736824a0c1e273f9e00b8df8f01eb'
			}]
		};
		const verifiableTransaction = new MultisigModificationTransaction.Builder()
			.addDeadline(multisigAggregateTransaction.deadline)
			.addMinRemovalDelta(multisigAggregateTransaction.minRemovalDelta)
			.addMinApprovalDelta(multisigAggregateTransaction.minApprovalDelta)
			.addModifications(multisigAggregateTransaction.modifications)
			.build();

		const transactionPayload = verifiableTransaction.signTransaction(keyPair);
		expect(transactionPayload.payload.substring(240, transactionPayload.payload.length))
			.to.be.equal('0102020068B3FBB18729C1FDE225C57F8CE080FA828F0067E451A3FD81FA628842B' +
			'0B76300CF893FFCC47C33E7F68AB1DB56365C156B0736824A0C1E273F9E00B8DF8F01EB');
	});
});
