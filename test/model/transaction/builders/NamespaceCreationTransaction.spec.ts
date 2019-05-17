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

import { namespaceId, subnamespaceNamespaceId, subnamespaceParentId } from '../../../../src/model/transaction/builders/NamespaceMosaicId';
import {expect} from 'chai';
import deadline from '../../../../src/model/transaction/builders/Deadline';

const  uint64 =require('../../../../src/core/format/uint64').default;
const  NamespaceCreationTransaction = require('../../../../src/model/transaction/builders/NamespaceCreationTransaction').default;

describe('NamespaceCreationTransaction', () => {
	const keyPair = {
		publicKey: '9a49366406aca952b88badf5f1e9be6ce4968141035a60be503273ea65456b24',
		privateKey: '041e2ce90c31cd65620ed16ab7a5a485e5b335d7e61c75cd9b3a2fed3e091728'
	};

	it('should create provision namespace transaction', () => {
		const namespaceCreationTransaction = {
			deadline: deadline(),
			namespaceType: 0,
			duration: uint64.fromUint(10000),
			namespaceId: namespaceId('newnamespace'),
			namespaceName: 'newnamespace'
		};

		const verifiableTransaction = new NamespaceCreationTransaction.Builder()
			.addDeadline(namespaceCreationTransaction.deadline)
			.addNamespaceType(namespaceCreationTransaction.namespaceType)
			.addDuration(namespaceCreationTransaction.duration)
			.addNamespaceId(namespaceCreationTransaction.namespaceId)
			.addNamespaceName(namespaceCreationTransaction.namespaceName)
			.build();

		const transactionPayload = verifiableTransaction.signTransaction(keyPair);
		expect(transactionPayload.payload.substring(240, transactionPayload.payload.length))
			.to.be.equal('0010270000000000007EE9B3B8AFDF53C00C6E65776E616D657370616365');
	});

	it('should create provision subnamespace transaction', () => {
		const namespaceCreationTransaction = {
			deadline: deadline(),
			namespaceType: 1,
			namespaceId: subnamespaceNamespaceId('newnamespace', 'sub2'),
			parentId: subnamespaceParentId('newnamespace', 'sub2'),
			namespaceName: 'sub2'
		};

		const verifiableTransaction = new NamespaceCreationTransaction.Builder()
			.addDeadline(namespaceCreationTransaction.deadline)
			.addNamespaceType(namespaceCreationTransaction.namespaceType)
			.addParentId(namespaceCreationTransaction.parentId)
			.addNamespaceId(namespaceCreationTransaction.namespaceId)
			.addNamespaceName(namespaceCreationTransaction.namespaceName)
			.addParentId(namespaceCreationTransaction.parentId)
			.build();

		const transactionPayload = verifiableTransaction.signTransaction(keyPair);

		expect(transactionPayload.payload.substring(240, transactionPayload.payload.length))
			.to.be.equal('017EE9B3B8AFDF53C028ED7825B972AC9D0473756232');
	});
});
