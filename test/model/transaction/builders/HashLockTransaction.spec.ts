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

const  uint64 =require('../../../../src/core/format/uint64').default;
const  HashLockTransaction = require('../../../../src/model/transaction/builders/HashLockTransaction').default;

describe('HashLockTransaction', () => {
	const keyPair = {
		publicKey: '9a49366406aca952b88badf5f1e9be6ce4968141035a60be503273ea65456b24',
		privateKey: '041e2ce90c31cd65620ed16ab7a5a485e5b335d7e61c75cd9b3a2fed3e091728'
	};

	it('should create hash lock transaction', () => {
		const hashLockTransaction = {
			deadline: deadline(),
			mosaicId: [3646934825, 3576016193],
			mosaicAmount: uint64.fromUint(10000000),
			duration: uint64.fromUint(100),
			hash: '8498B38D89C1DC8A448EA5824938FF828926CD9F7747B1844B59B4B6807E878B'
		};
		const verifiableTransaction = new HashLockTransaction.Builder()
			.addDeadline(hashLockTransaction.deadline)
			.addMosaicId(hashLockTransaction.mosaicId)
			.addMosaicAmount(hashLockTransaction.mosaicAmount)
			.addDuration(hashLockTransaction.duration)
			.addHash(hashLockTransaction.hash)
			.build();

		const transactionPayload = verifiableTransaction.signTransaction(keyPair);

		expect(transactionPayload.payload.substring(
			240,
			transactionPayload.payload.length
		)).to.be.equal('29CF5FD941AD25D580969800000000006400000000000000' +
			'8498B38D89C1DC8A448EA5824938FF828926CD9F7747B1844B59B4B6807E878B');
	});
});
