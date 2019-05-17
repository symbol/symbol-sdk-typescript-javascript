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
const  AccountPropertiesMosaicTransaction = require('../../../../src/model/transaction/builders/AccountPropertiesMosaicTransaction').default;

describe('AccountPropertiesMosaicTransaction', () => {
	const keyPair = {
		publicKey: '9a49366406aca952b88badf5f1e9be6ce4968141035a60be503273ea65456b24',
		privateKey: '041e2ce90c31cd65620ed16ab7a5a485e5b335d7e61c75cd9b3a2fed3e091728'
	};

	it('should create account property mosaic transaction', () => {
		const model = {
			deadline: deadline(),
			propertyType: 0x02,
			modificationCount: 1,
			modifications: [{ modificationType: 0, value: [0xC0AFC518, 0x3AD842A8] }]
		};

		const transaction = new AccountPropertiesMosaicTransaction.Builder()
			.addDeadline(model.deadline)
			.addPropertyType(model.propertyType)
			.addModifications(model.modifications)
			.build();

		const transactionPayload = transaction.signTransaction(keyPair);
		expect(transactionPayload.payload.substring(240, transactionPayload.payload.length))
			.to.be.equal('02010018C5AFC0A842D83A');
	});
});
