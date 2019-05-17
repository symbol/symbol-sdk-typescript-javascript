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
const  CosignatureTransaction = require('../../../../src/model/transaction/builders/CosignatureTransaction').default;

describe('CosignatureTransaction', () => {
	const keyPair = {
		publicKey: 'cf893ffcc47c33e7f68ab1db56365c156b0736824a0c1e273f9e00b8df8f01eb',
		privateKey: '2a2b1f5d366a5dd5dc56c3c757cf4fe6c66e2787087692cf329d7a49a594658b'
	};

	it('should create aggregate signature transaction', () => {
		const parentHash = '32A99C6B62A78F8A377558348C762725E9683964EB4FAE21EB5F6CA78BD31A32';
		const verifiableTransaction = new CosignatureTransaction(parentHash);

		const transactionPayload = verifiableTransaction.signCosignatoriesTransaction(keyPair);

		expect(transactionPayload.signature)
			.to.be.equal('096D9BE0755CD8FCAAFD69D7B7F10F8F8B37F3A6B471099D2F4D4810CC39E289A75' +
			'CD8F85CFC0E723D3D45CEB2BE56C32624AD53E98E03E59C194EA50FED0506');
	});
});
