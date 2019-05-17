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
import { address } from '../../../../src/core/format/address';
import deadline from '../../../../src/model/transaction/builders/Deadline';

const  AddressAliasTransaction = require('../../../../src/model/transaction/builders/AddressAliasTransaction').default;

describe('AddressAliasTransaction', () => {
	const keyPair = {
		publicKey:'9a49366406aca952b88badf5f1e9be6ce4968141035a60be503273ea65456b24',
		address: 'SAAYCQNRFXW5KTKOOS4A6XCFEZUYGEY6AO25PVKP',
		privateKey: '041e2ce90c31cd65620ed16ab7a5a485e5b335d7e61c75cd9b3a2fed3e091728'
	};

	it('should create address alias transaction', () => {
		const addressAliasTransaction = {
			deadline: deadline(),
			actionType: 0, // 0=Link, 1=Unlink
			namespaceId: [0xBA651B4F, 0xB1497F5F],
			address: address.addressToString(address.publicKeyToAddress(address.stringToAddress(keyPair.address), 0x90))
		};

		const transaction = new AddressAliasTransaction.Builder()
			.addDeadline(addressAliasTransaction.deadline)
			.addActionType(addressAliasTransaction.actionType)
			.addNamespaceId(addressAliasTransaction.namespaceId)
			.addAddress(addressAliasTransaction.address)
			.build();

		const transactionPayload = transaction.signTransaction(keyPair);
		expect(transactionPayload.payload.substring(240, transactionPayload.payload.length))
			.to.be.equal('004F1B65BA5F7F49B1900CAAC0F38BA6621D2DC499A1DEAE90A52394D249C55420E9');
	});
});
