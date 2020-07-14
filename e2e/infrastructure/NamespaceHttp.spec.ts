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
import { deepEqual } from 'assert';
import { expect } from 'chai';
import { NamespaceRepository } from '../../src/infrastructure/NamespaceRepository';
import { Account } from '../../src/model/account/Account';
import { Address } from '../../src/model/account/Address';
import { AliasAction } from '../../src/model/namespace/AliasAction';
import { NamespaceId } from '../../src/model/namespace/NamespaceId';
import { AddressAliasTransaction } from '../../src/model/transaction/AddressAliasTransaction';
import { Deadline } from '../../src/model/transaction/Deadline';
import { NamespaceRegistrationTransaction } from '../../src/model/transaction/NamespaceRegistrationTransaction';
import { UInt64 } from '../../src/model/UInt64';
import { IntegrationTestHelper } from './IntegrationTestHelper';
import { NamespacePaginationStreamer } from '../../src/infrastructure/paginationStreamer/NamespacePaginationStreamer';
import { take, toArray } from 'rxjs/operators';

describe('NamespaceHttp', () => {
    let defaultNamespaceId: NamespaceId;
    let namespaceId: NamespaceId;
    let namespaceRepository: NamespaceRepository;
    let account: Account;
    let generationHash: string;
    const helper = new IntegrationTestHelper();

    before(() => {
        return helper.start().then(() => {
            account = helper.account;
            generationHash = helper.generationHash;
            namespaceRepository = helper.repositoryFactory.createNamespaceRepository();
            defaultNamespaceId = helper.networkCurrencyNamespaceId;
        });
    });

    before(() => {
        return helper.listener.open();
    });

    after(() => {
        helper.listener.close();
    });

    describe('NamespaceRegistrationTransaction', () => {
        it('standalone', () => {
            const namespaceName = 'root-test-namespace-' + Math.floor(Math.random() * 10000);
            const registerNamespaceTransaction = NamespaceRegistrationTransaction.createRootNamespace(
                Deadline.create(),
                namespaceName,
                UInt64.fromUint(1000),
                helper.networkType,
                helper.maxFee,
            );
            namespaceId = new NamespaceId(namespaceName);
            const signedTransaction = registerNamespaceTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });
    describe('AddressAliasTransaction', () => {
        it('standalone', () => {
            const addressAliasTransaction = AddressAliasTransaction.create(
                Deadline.create(),
                AliasAction.Link,
                namespaceId,
                account.address,
                helper.networkType,
                helper.maxFee,
            );
            const signedTransaction = addressAliasTransaction.signWith(account, generationHash);

            return helper.announce(signedTransaction);
        });
    });

    describe('getNamespace', () => {
        it('should return namespace data given namepsaceId', async () => {
            const namespace = await namespaceRepository.getNamespace(defaultNamespaceId).toPromise();
            expect(namespace.startHeight.lower).to.be.equal(1);
            expect(namespace.startHeight.higher).to.be.equal(0);
        });
    });

    describe('getNamespacesName', () => {
        it('should return namespace name given array of namespaceIds', async () => {
            const namespaceNames = await namespaceRepository.getNamespacesNames([defaultNamespaceId]).toPromise();
            expect(namespaceNames[0].name).to.be.equal('currency');
        });
    });

    describe('getLinkedMosaicId', () => {
        it('should return mosaicId given currency namespaceId', async () => {
            const mosaicId = await namespaceRepository.getLinkedMosaicId(defaultNamespaceId).toPromise();
            expect(mosaicId).to.not.be.null;
        });
    });

    describe('getLinkedAddress', () => {
        it('should return address given namespaceId', async () => {
            const address = (await namespaceRepository.getLinkedAddress(namespaceId).toPromise()) as Address;
            expect(address.plain()).to.be.equal(account.address.plain());
        });
    });

    describe('searchNamespace', () => {
        it('should return namespace info', async () => {
            const info = await namespaceRepository.search({}).toPromise();
            expect(info.data.length).to.be.greaterThan(0);
        });
    });

    describe('searchNamespace with streamer', () => {
        it('should return namespace info', async () => {
            const streamer = new NamespacePaginationStreamer(namespaceRepository);
            const infoStreamer = await streamer.search({ pageSize: 20 }).pipe(take(20), toArray()).toPromise();
            const info = await namespaceRepository.search({ pageSize: 20 }).toPromise();
            expect(infoStreamer.length).to.be.greaterThan(0);
            deepEqual(infoStreamer, info.data);
        });
    });
});
