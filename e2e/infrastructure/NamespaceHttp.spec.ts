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
import { take, toArray } from 'rxjs/operators';
import { NamespaceRepository, Order } from '../../src/infrastructure';
import { NamespacePaginationStreamer } from '../../src/infrastructure/paginationStreamer';
import { UInt64 } from '../../src/model';
import { Account, Address } from '../../src/model/account';
import { AliasAction, NamespaceId } from '../../src/model/namespace';
import { AddressAliasTransaction, Deadline, NamespaceRegistrationTransaction } from '../../src/model/transaction';
import { IntegrationTestHelper } from './IntegrationTestHelper';

describe('NamespaceHttp', () => {
    let defaultNamespaceId: NamespaceId;
    let namespaceId: NamespaceId;
    let namespaceRepository: NamespaceRepository;
    let account: Account;
    let generationHash: string;
    const helper = new IntegrationTestHelper();

    before(() => {
        return helper.start({ openListener: true }).then(() => {
            account = helper.account;
            generationHash = helper.generationHash;
            namespaceRepository = helper.repositoryFactory.createNamespaceRepository();
            defaultNamespaceId = helper.networkCurrency.namespaceId!;
        });
    });

    after(() => {
        return helper.close();
    });

    const validateMerkle = async (namespaceId: NamespaceId): Promise<void> => {
        const merkleInfo = await namespaceRepository.getNamespaceMerkle(namespaceId).toPromise();
        expect(merkleInfo.raw).to.not.be.undefined;
    };

    describe('NamespaceRegistrationTransaction', () => {
        it('standalone', () => {
            const namespaceName = 'root-test-namespace-' + Math.floor(Math.random() * 10000);
            const registerNamespaceTransaction = NamespaceRegistrationTransaction.createRootNamespace(
                Deadline.create(helper.epochAdjustment),
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
                Deadline.create(helper.epochAdjustment),
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
            await validateMerkle(namespace.id);
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
            const info = await namespaceRepository.search({ ownerAddress: account.address }).toPromise();
            expect(info.data.length).to.be.greaterThan(0);
            validateMerkle(info.data[0].id);
        });
    });

    describe('searchNamespace with streamer', () => {
        it('should return namespace info', async () => {
            const streamer = new NamespacePaginationStreamer(namespaceRepository);
            const infoStreamer = await streamer
                .search({ ownerAddress: account.address, pageSize: 20, order: Order.Desc })
                .pipe(take(20), toArray())
                .toPromise();
            const info = await namespaceRepository.search({ pageSize: 20, order: Order.Desc }).toPromise();
            expect(infoStreamer.length).to.be.greaterThan(0);
            deepEqual(infoStreamer[0], info.data[0]);
        });
    });
});
