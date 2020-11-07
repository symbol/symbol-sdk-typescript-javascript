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
import { MosaicRepository } from '../../src/infrastructure/MosaicRepository';
import { NamespaceRepository } from '../../src/infrastructure/NamespaceRepository';
import { MosaicPaginationStreamer } from '../../src/infrastructure/paginationStreamer/MosaicPaginationStreamer';
import { TransactionGroup } from '../../src/infrastructure/TransactionGroup';
import { Account } from '../../src/model/account/Account';
import { MosaicFlags } from '../../src/model/mosaic/MosaicFlags';
import { MosaicId } from '../../src/model/mosaic/MosaicId';
import { MosaicNonce } from '../../src/model/mosaic/MosaicNonce';
import { AliasAction } from '../../src/model/namespace/AliasAction';
import { NamespaceId } from '../../src/model/namespace/NamespaceId';
import { NetworkType } from '../../src/model/network/NetworkType';
import { Deadline } from '../../src/model/transaction/Deadline';
import { MosaicAliasTransaction } from '../../src/model/transaction/MosaicAliasTransaction';
import { MosaicDefinitionTransaction } from '../../src/model/transaction/MosaicDefinitionTransaction';
import { NamespaceRegistrationTransaction } from '../../src/model/transaction/NamespaceRegistrationTransaction';
import { UInt64 } from '../../src/model/UInt64';
import { IntegrationTestHelper } from './IntegrationTestHelper';

describe('MosaicHttp', () => {
    let mosaicId: MosaicId;
    let mosaicRepository: MosaicRepository;
    let account: Account;
    let namespaceId: NamespaceId;
    let namespaceRepository: NamespaceRepository;
    let generationHash: string;
    const helper = new IntegrationTestHelper();
    let networkType: NetworkType;

    const epochAdjustment = 1573430400;

    before(() => {
        return helper.start({ openListener: true }).then(() => {
            account = helper.account;
            generationHash = helper.generationHash;
            networkType = helper.networkType;
            namespaceRepository = helper.repositoryFactory.createNamespaceRepository();
            mosaicRepository = helper.repositoryFactory.createMosaicRepository();
        });
    });

    after(() => {
        return helper.close();
    });

    /**
     * =========================
     * Setup Test Data
     * =========================
     */
    describe('Setup test MosaicId', () => {
        it('Announce MosaicDefinitionTransaction', async () => {
            const nonce = MosaicNonce.createFromNumber(-1501238750);
            expect(nonce.toDTO()).to.be.equals(2793728546);
            expect(nonce.toHex()).to.be.equals('22EA84A6');
            mosaicId = MosaicId.createFromNonce(nonce, account.address);
            const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
                Deadline.create(epochAdjustment),
                nonce,
                mosaicId,
                MosaicFlags.create(true, true, false),
                3,
                UInt64.fromUint(100),
                networkType,
                helper.maxFee,
            );
            const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);

            const listenedTransaction = (await helper.announce(signedTransaction)) as MosaicDefinitionTransaction;
            expect(mosaicDefinitionTransaction.nonce.toHex()).to.be.equal(listenedTransaction.nonce.toHex());
            expect(mosaicDefinitionTransaction.nonce).to.deep.equal(listenedTransaction.nonce);
            expect(mosaicDefinitionTransaction.getMosaicNonceIntValue()).to.be.equal(listenedTransaction.getMosaicNonceIntValue());

            const savedTransaction = (await helper.repositoryFactory
                .createTransactionRepository()
                .getTransaction(signedTransaction.hash, TransactionGroup.Confirmed)
                .toPromise()) as MosaicDefinitionTransaction;
            expect(mosaicDefinitionTransaction.nonce.toHex()).to.be.equal(savedTransaction.nonce.toHex());
            expect(mosaicDefinitionTransaction.nonce).to.deep.equal(savedTransaction.nonce);
            expect(mosaicDefinitionTransaction.getMosaicNonceIntValue()).to.be.equal(savedTransaction.getMosaicNonceIntValue());
        });
    });

    describe('Setup test NamespaceId', () => {
        it('Announce NamespaceRegistrationTransaction', () => {
            const namespaceName = 'root-test-namespace-' + Math.floor(Math.random() * 10000);
            const registerNamespaceTransaction = NamespaceRegistrationTransaction.createRootNamespace(
                Deadline.create(epochAdjustment),
                namespaceName,
                UInt64.fromUint(1000),
                networkType,
                helper.maxFee,
            );
            namespaceId = new NamespaceId(namespaceName);
            const signedTransaction = registerNamespaceTransaction.signWith(account, generationHash);

            return helper.announce(signedTransaction);
        });
    });
    describe('Setup test MosaicAlias', () => {
        it('Announce MosaicAliasTransaction', () => {
            const mosaicAliasTransaction = MosaicAliasTransaction.create(
                Deadline.create(epochAdjustment),
                AliasAction.Link,
                namespaceId,
                mosaicId,
                networkType,
                helper.maxFee,
            );
            const signedTransaction = mosaicAliasTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    /**
     * =========================
     * Test
     * =========================
     */
    describe('getMosaic', () => {
        it('should return mosaic given mosaicId', async () => {
            const mosaicInfo = await mosaicRepository.getMosaic(mosaicId).toPromise();
            expect(mosaicInfo.startHeight.lower).not.to.be.null;
            expect(mosaicInfo.divisibility).to.be.equal(3);
            expect(mosaicInfo.isSupplyMutable()).to.be.equal(true);
            expect(mosaicInfo.isTransferable()).to.be.equal(true);
        });
    });

    describe('getMosaics', () => {
        it('should return mosaics given array of mosaicIds', async () => {
            const mosaicInfos = await mosaicRepository.getMosaics([mosaicId]).toPromise();
            expect(mosaicInfos[0].startHeight.lower).not.to.be.null;
            expect(mosaicInfos[0].divisibility).to.be.equal(3);
            expect(mosaicInfos[0].isSupplyMutable()).to.be.equal(true);
            expect(mosaicInfos[0].isTransferable()).to.be.equal(true);
        });
    });

    describe('getMosaicsNames', () => {
        it('should call getMosaicsNames successfully', async () => {
            const mosaicNames = await namespaceRepository.getMosaicsNames([mosaicId]).toPromise();
            expect(mosaicNames.length).to.be.greaterThan(0);
        });
    });

    describe('searchMosaics', () => {
        it('should call searchMosaics successfully', async () => {
            const mosaics = await mosaicRepository.search({ ownerAddress: account.address }).toPromise();
            expect(mosaics.data.length).to.be.greaterThan(0);
            expect(mosaics.data.find((m) => m.id.toHex() === mosaicId.toHex()) !== undefined).to.be.true;
        });
    });

    describe('searchMosaics with streamer', () => {
        it('should call searchMosaics successfully', async () => {
            const streamer = new MosaicPaginationStreamer(mosaicRepository);
            const mosaicsStreamer = await streamer
                .search({ ownerAddress: account.address, pageSize: 100 })
                .pipe(take(100), toArray())
                .toPromise();
            const mosaics = await mosaicRepository.search({ ownerAddress: account.address, pageSize: 100 }).toPromise();
            expect(mosaicsStreamer.length).to.be.greaterThan(0);
            expect(mosaicsStreamer.find((m) => m.id.toHex() === mosaicId.toHex()) !== undefined).to.be.true;
            deepEqual(mosaics.data, mosaicsStreamer);
        });
    });

    /**
     * =========================
     * House Keeping
     * =========================
     */
    describe('Remove test MosaicAlias', () => {
        it('Announce MosaicAliasTransaction', () => {
            const mosaicAliasTransaction = MosaicAliasTransaction.create(
                Deadline.create(epochAdjustment),
                AliasAction.Unlink,
                namespaceId,
                mosaicId,
                networkType,
                helper.maxFee,
            );
            const signedTransaction = mosaicAliasTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });
});
