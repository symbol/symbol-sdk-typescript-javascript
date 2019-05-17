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
const  TransferTransaction = require('../../../../src/model/transaction/builders/TransferTransaction').default;

describe('TransferTransaction', () => {
	const keyPair = {
		publicKey: '9a49366406aca952b88badf5f1e9be6ce4968141035a60be503273ea65456b24',
		privateKey: '041e2ce90c31cd65620ed16ab7a5a485e5b335d7e61c75cd9b3a2fed3e091728'
	};

	it('should create transfer transaction', () => {
		const transferTransaction = {
			deadline: deadline(),
			recipient: 'SDUP5PLHDXKBX3UU5Q52LAY4WYEKGEWC6IB3VBFM',
			message: {
				type: 0,
				payload: '00'
			},
			mosaics: [{
				id: [3646934825, 3576016193],
				amount: [100, 0]
			}, {
				id: [4194316032, 148499725],
				amount: [100, 0]
			}, {
				id: [2154643268, 978584940],
				amount: [100, 0]
			}]
		};
		const verifiableTransaction = new TransferTransaction.Builder()
			.addDeadline(transferTransaction.deadline)
			.addRecipient(transferTransaction.recipient)
			.addMessage(transferTransaction.message)
			.addMosaics(transferTransaction.mosaics)
			.build();

		const transactionPayload = verifiableTransaction.signTransaction(keyPair);

		expect(transactionPayload.payload.substring(
			240,
			transactionPayload.payload.length
		)).to.be.equal('90E8FEBD671DD41BEE94EC3BA5831CB608A312C2F203BA84AC030003003' +
			'030002F00FA0DEDD9086400000000000000443F6D806C05543A640000000000000029C' +
			'F5FD941AD25D56400000000000000');
	});

	it('should create transfer transaction with void', () => {
		const transferTransaction = {
			deadline: deadline(),
			recipient: 'SDUP5PLHDXKBX3UU5Q52LAY4WYEKGEWC6IB3VBFM',
			message: {
				type: 0,
				payload: ''
			},
			mosaics: [{
				id: [3646934825, 3576016193],
				amount: [100, 0]
			}, {
				id: [4194316032, 148499725],
				amount: [100, 0]
			}, {
				id: [2154643268, 978584940],
				amount: [100, 0]
			}]
		};
		const verifiableTransaction = new TransferTransaction.Builder()
			.addDeadline(transferTransaction.deadline)
			.addRecipient(transferTransaction.recipient)
			.addMessage(transferTransaction.message)
			.addMosaics(transferTransaction.mosaics)
			.build();

		const transactionPayload = verifiableTransaction.signTransaction(keyPair);

		expect(transactionPayload.payload.substring(
			240,
			transactionPayload.payload.length
		)).to.be.equal('90E8FEBD671DD41BEE94EC3BA5831CB608A312C2F203BA84AC01000300002F0' +
			'0FA0DEDD9086400000000000000443F6D806C05543A640000000000000029CF5FD941AD25D' +
			'56400000000000000');
	});

	it('should create transfer transaction with alias recipient padded on 25 bytes', () => {
		const transferTransaction = {
			deadline: deadline(),
			recipient: '85bbea6cc462b244',
			message: {
				type: 0,
				payload: '00'
			},
			mosaics: [{
				id: [3646934825, 3576016193],
				amount: [100, 0]
			}, {
				id: [4194316032, 148499725],
				amount: [100, 0]
			}, {
				id: [2154643268, 978584940],
				amount: [100, 0]
			}]
		};
		const verifiableTransaction = new TransferTransaction.Builder()
			.addDeadline(transferTransaction.deadline)
			.addRecipient(transferTransaction.recipient)
			.addMessage(transferTransaction.message)
			.addMosaics(transferTransaction.mosaics)
			.build();

		const transactionPayload = verifiableTransaction.signTransaction(keyPair);

		expect(transactionPayload.payload.substring(
			240,
			transactionPayload.payload.length
		)).to.be.equal('9144B262C46CEABB8500000000000000000000000000000000030003003030002F00FA' +
			'0DEDD9086400000000000000443F6D806C05543A640000000000000029CF5FD941AD25' +
			'D56400000000000000');
	});
});
