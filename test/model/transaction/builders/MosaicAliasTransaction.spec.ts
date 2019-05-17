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

import {expect} from 'chai';
import deadline from '../../../../src/model/transaction/builders/Deadline';

const  MosaicAliasTransaction = require('../../../../src/model/transaction/builders/MosaicAliasTransaction').default;

describe('MosaicAliasTransaction', () => {
	const keyPair = {
		publicKey: '9a49366406aca952b88badf5f1e9be6ce4968141035a60be503273ea65456b24',
		privateKey: '041e2ce90c31cd65620ed16ab7a5a485e5b335d7e61c75cd9b3a2fed3e091728'
	};

	it('should create mosaic alias transaction', () => {
		const mosaicAliasTransaction = {
			deadline: deadline(),
			actionType: 0, // 0=Link, 1=Unlink
			namespaceId: [0xBA651B4F, 0xB1497F5F],
			mosaicId: [0xC0AFC518, 0x3AD842A8]
		};

		const transaction = new MosaicAliasTransaction.Builder()
			.addDeadline(mosaicAliasTransaction.deadline)
			.addActionType(mosaicAliasTransaction.actionType)
			.addNamespaceId(mosaicAliasTransaction.namespaceId)
			.addMosaicId(mosaicAliasTransaction.mosaicId)
			.build();

		const transactionPayload = transaction.signTransaction(keyPair);
		expect(transactionPayload.payload.substring(240, transactionPayload.payload.length))
			.to.be.equal('004F1B65BA5F7F49B118C5AFC0A842D83A');
	});
});
