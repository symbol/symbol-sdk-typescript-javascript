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

import {convert} from '../../../../src/core/format/convert';
import {uint64} from '../../../../src/core/format/uint64';
import {expect} from 'chai';
import deadline from '../../../../src/model/transaction/builders/Deadline';
import { mosaicId } from '../../../../src/model/transaction/builders/NamespaceMosaicId';

const  MosaicCreationTransaction = require('../../../../src/model/transaction/builders/MosaicCreationTransaction').default;

describe('MosaicCreationTransaction', () => {
	const keyPair = {
		publicKey: '9a49366406aca952b88badf5f1e9be6ce4968141035a60be503273ea65456b24',
		privateKey: '041e2ce90c31cd65620ed16ab7a5a485e5b335d7e61c75cd9b3a2fed3e091728'
	};

	it('should create mosaic definition transaction', () => {
		const nonce = new Uint8Array([0xE6, 0xDE, 0x84, 0xB8]);
		const mosaicCreationTransaction = {
			deadline: deadline(),
			duration: uint64.fromUint(10000),
			divisibility: 4,
			nonce,
			mosaicId: mosaicId(nonce, convert.hexToUint8(keyPair.publicKey))
		};

		const verifiableTransaction = new MosaicCreationTransaction.Builder()
			.addDeadline(mosaicCreationTransaction.deadline)
			.addSupplyMutable()
			.addDivisibility(mosaicCreationTransaction.divisibility)
			.addDuration(mosaicCreationTransaction.duration)
			.addNonce(mosaicCreationTransaction.nonce)
			.addMosaicId(mosaicCreationTransaction.mosaicId)
			.build();

		const transactionPayload = verifiableTransaction.signTransaction(keyPair);

		expect(transactionPayload.payload.substring(240, transactionPayload.payload.length))
			.to.be.equal('E6DE84B88675F65ED72E4B43010104021027000000000000');
	});

	it('should create mosaic definition transaction without duration', () => {
		const nonce = new Uint8Array([0xE6, 0xDE, 0x84, 0xB8]);
		const mosaicCreationTransaction = {
			deadline: deadline(),
			duration: [],
			divisibility: 4,
			nonce,
			mosaicId: mosaicId(nonce, convert.hexToUint8(keyPair.publicKey))
		};

		const verifiableTransaction = new MosaicCreationTransaction.Builder()
			.addDeadline(mosaicCreationTransaction.deadline)
			.addSupplyMutable()
			.addDivisibility(mosaicCreationTransaction.divisibility)
			.addDuration(mosaicCreationTransaction.duration)
			.addNonce(mosaicCreationTransaction.nonce)
			.addMosaicId(mosaicCreationTransaction.mosaicId)
			.build();

		const transactionPayload = verifiableTransaction.signTransaction(keyPair);

		/**
		 * If no duration provided, the new tx size changed to 135.
		 * as indicatorDuration and Duration attribute get removed from the buffer schema
		 */
		expect(transactionPayload.payload.substring(0, 8)).to.be.equal('87000000');
		expect(transactionPayload.payload.substring(240, transactionPayload.payload.length))
			.to.be.equal('E6DE84B88675F65ED72E4B43000104');
	});
});
