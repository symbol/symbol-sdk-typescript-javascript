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

import { expect } from 'chai';
import { MetadataRepository } from '../../src/infrastructure/MetadataRepository';
import { Account } from '../../src/model/account/Account';
import { Address } from '../../src/model/account/Address';
import { MosaicFlags } from '../../src/model/mosaic/MosaicFlags';
import { MosaicId } from '../../src/model/mosaic/MosaicId';
import { MosaicNonce } from '../../src/model/mosaic/MosaicNonce';
import { NamespaceId } from '../../src/model/namespace/NamespaceId';
import { NetworkType } from '../../src/model/network/NetworkType';
import { AccountMetadataTransaction } from '../../src/model/transaction/AccountMetadataTransaction';
import { AggregateTransaction } from '../../src/model/transaction/AggregateTransaction';
import { Deadline } from '../../src/model/transaction/Deadline';
import { MosaicDefinitionTransaction } from '../../src/model/transaction/MosaicDefinitionTransaction';
import { MosaicMetadataTransaction } from '../../src/model/transaction/MosaicMetadataTransaction';
import { NamespaceMetadataTransaction } from '../../src/model/transaction/NamespaceMetadataTransaction';
import { NamespaceRegistrationTransaction } from '../../src/model/transaction/NamespaceRegistrationTransaction';
import { UInt64 } from '../../src/model/UInt64';
import { IntegrationTestHelper } from './IntegrationTestHelper';

describe('MetadataHttp', () => {
    const helper = new IntegrationTestHelper();
    let account: Account;
    let accountAddress: Address;
    let mosaicId: MosaicId;
    let namespaceId: NamespaceId;
    let generationHash: string;
    let networkType: NetworkType;
    let metadataRepository: MetadataRepository;

    before(() => {
        return helper.start().then(() => {
            account = helper.account;
            accountAddress = helper.account.address;
            generationHash = helper.generationHash;
            networkType = helper.networkType;
            metadataRepository = helper.repositoryFactory.createMetadataRepository();
        });
    });

    before(() => {
        return helper.listener.open();
    });

    after(() => {
        helper.listener.close();
    });

    /**
     * =========================
     * Setup test data
     * =========================
     */

    describe('MosaicDefinitionTransaction', () => {
        it('standalone', () => {
            const nonce = MosaicNonce.createRandom();
            mosaicId = MosaicId.createFromNonce(nonce, account.publicAccount);
            const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
                Deadline.create(),
                nonce,
                mosaicId,
                MosaicFlags.create(true, true, true),
                3,
                UInt64.fromUint(1000),
                networkType,
                helper.maxFee,
            );
            const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('Setup test NamespaceId', () => {
        it('Announce NamespaceRegistrationTransaction', () => {
            const namespaceName = `root-test-namespace-${Math.floor(Math.random() * 10000)}`;
            const registerNamespaceTransaction = NamespaceRegistrationTransaction.createRootNamespace(
                Deadline.create(),
                namespaceName,
                UInt64.fromUint(9),
                networkType,
                helper.maxFee,
            );
            namespaceId = new NamespaceId(namespaceName);
            const signedTransaction = registerNamespaceTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('AccountMetadataTransaction', () => {
        it('aggregate', () => {
            const accountMetadataTransaction = AccountMetadataTransaction.create(
                Deadline.create(),
                account.publicKey,
                UInt64.fromUint(5),
                23,
                `Test account meta value`,
                networkType,
                helper.maxFee,
            );

            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(),
                [accountMetadataTransaction.toAggregate(account.publicAccount)],
                networkType,
                [],
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('MosaicMetadataTransaction', () => {
        it('aggregate', () => {
            const mosaicMetadataTransaction = MosaicMetadataTransaction.create(
                Deadline.create(),
                account.publicKey,
                UInt64.fromUint(5),
                mosaicId,
                22,
                `Test mosaic meta value`,
                networkType,
                helper.maxFee,
            );

            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(),
                [mosaicMetadataTransaction.toAggregate(account.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('NamespaceMetadataTransaction', () => {
        it('aggregate', () => {
            const namespaceMetadataTransaction = NamespaceMetadataTransaction.create(
                Deadline.create(),
                account.publicKey,
                UInt64.fromUint(5),
                namespaceId,
                25,
                `Test namespace meta value`,
                networkType,
                helper.maxFee,
            );

            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(),
                [namespaceMetadataTransaction.toAggregate(account.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    /**
     * =========================
     * Tests
     * =========================
     */

    describe('getAccountMetadata', () => {
        it('should return metadata given a NEM Address', async () => {
            const metadata = await metadataRepository.getAccountMetadata(accountAddress).toPromise();
            expect(metadata.length).to.be.greaterThan(0);
            expect(metadata[0].metadataEntry.scopedMetadataKey.toString()).to.be.equal('5');
            expect(metadata[0].metadataEntry.senderPublicKey).to.be.equal(account.publicKey);
            expect(metadata[0].metadataEntry.targetPublicKey).to.be.equal(account.publicKey);
            expect(metadata[0].metadataEntry.targetId).to.be.undefined;
            expect(metadata[0].metadataEntry.value).to.be.equal('Test account meta value');
            expect(metadata[0].metadataEntry.value.length).to.be.equal(23);
        });
    });

    describe('getAccountMetadataByKey', () => {
        it('should return metadata given a NEM Address and metadata key', async () => {
            const metadata = await metadataRepository.getAccountMetadataByKey(accountAddress, UInt64.fromUint(5).toHex()).toPromise();
            expect(metadata.length).to.be.greaterThan(0);
            expect(metadata[0].metadataEntry.scopedMetadataKey.toString()).to.be.equal('5');
            expect(metadata[0].metadataEntry.senderPublicKey).to.be.equal(account.publicKey);
            expect(metadata[0].metadataEntry.targetPublicKey).to.be.equal(account.publicKey);
            expect(metadata[0].metadataEntry.targetId).to.be.undefined;
            expect(metadata[0].metadataEntry.value).to.be.equal('Test account meta value');
            expect(metadata[0].metadataEntry.value.length).to.be.equal(23);
        });
    });

    describe('getAccountMetadataByKeyAndSender', () => {
        it('should return metadata given a NEM Address and metadata key and sender public key', async () => {
            const metadata = await metadataRepository
                .getAccountMetadataByKeyAndSender(accountAddress, UInt64.fromUint(5).toHex(), account.publicKey)
                .toPromise();
            expect(metadata.metadataEntry.scopedMetadataKey.toString()).to.be.equal('5');
            expect(metadata.metadataEntry.senderPublicKey).to.be.equal(account.publicKey);
            expect(metadata.metadataEntry.targetPublicKey).to.be.equal(account.publicKey);
            expect(metadata.metadataEntry.targetId).to.be.undefined;
            expect(metadata.metadataEntry.value).to.be.equal('Test account meta value');
            expect(metadata.metadataEntry.value.length).to.be.equal(23);
        });
    });

    describe('getMosaicMetadata', () => {
        it('should return metadata given a mosaicId', async () => {
            const metadata = await metadataRepository.getMosaicMetadata(mosaicId).toPromise();
            expect(metadata.length).to.be.greaterThan(0);
            expect(metadata[0].metadataEntry.scopedMetadataKey.toString()).to.be.equal('5');
            expect(metadata[0].metadataEntry.senderPublicKey).to.be.equal(account.publicKey);
            expect(metadata[0].metadataEntry.targetPublicKey).to.be.equal(account.publicKey);
            expect((metadata[0].metadataEntry.targetId as MosaicId).toHex()).to.be.equal(mosaicId.toHex());
            expect(metadata[0].metadataEntry.value).to.be.equal('Test mosaic meta value');
            expect(metadata[0].metadataEntry.value.length).to.be.equal(22);
        });
    });

    describe('getMosaicMetadataByKey', () => {
        it('should return metadata given a mosaicId and metadata key', async () => {
            const metadata = await metadataRepository.getMosaicMetadataByKey(mosaicId, UInt64.fromUint(5).toHex()).toPromise();
            expect(metadata.length).to.be.greaterThan(0);
            expect(metadata[0].metadataEntry.scopedMetadataKey.toString()).to.be.equal('5');
            expect(metadata[0].metadataEntry.senderPublicKey).to.be.equal(account.publicKey);
            expect(metadata[0].metadataEntry.targetPublicKey).to.be.equal(account.publicKey);
            expect((metadata[0].metadataEntry.targetId as MosaicId).toHex()).to.be.equal(mosaicId.toHex());
            expect(metadata[0].metadataEntry.value).to.be.equal('Test mosaic meta value');
            expect(metadata[0].metadataEntry.value.length).to.be.equal(22);
        });
    });

    describe('getMosaicMetadataByKeyAndSender', () => {
        it('should return metadata given a mosaicId and metadata key and sender public key', async () => {
            const metadata = await metadataRepository
                .getMosaicMetadataByKeyAndSender(mosaicId, UInt64.fromUint(5).toHex(), account.publicKey)
                .toPromise();
            expect(metadata.metadataEntry.scopedMetadataKey.toString()).to.be.equal('5');
            expect(metadata.metadataEntry.senderPublicKey).to.be.equal(account.publicKey);
            expect(metadata.metadataEntry.targetPublicKey).to.be.equal(account.publicKey);
            expect((metadata.metadataEntry.targetId as MosaicId).toHex()).to.be.equal(mosaicId.toHex());
            expect(metadata.metadataEntry.value).to.be.equal('Test mosaic meta value');
            expect(metadata.metadataEntry.value.length).to.be.equal(22);
        });
    });

    describe('getNamespaceMetadata', () => {
        it('should return metadata given a namespaceId', async () => {
            const metadata = await metadataRepository.getNamespaceMetadata(namespaceId).toPromise();
            expect(metadata.length).to.be.greaterThan(0);
            expect(metadata[0].metadataEntry.scopedMetadataKey.toString()).to.be.equal('5');
            expect(metadata[0].metadataEntry.senderPublicKey).to.be.equal(account.publicKey);
            expect(metadata[0].metadataEntry.targetPublicKey).to.be.equal(account.publicKey);
            expect((metadata[0].metadataEntry.targetId as NamespaceId).toHex()).to.be.equal(namespaceId.toHex());
            expect(metadata[0].metadataEntry.value).to.be.equal('Test namespace meta value');
            expect(metadata[0].metadataEntry.value.length).to.be.equal(25);
        });
    });

    describe('getNamespaceMetadataByKey', () => {
        it('should return metadata given a namespaceId and metadata key', async () => {
            const metadata = await metadataRepository.getNamespaceMetadataByKey(namespaceId, UInt64.fromUint(5).toHex()).toPromise();
            expect(metadata.length).to.be.greaterThan(0);
            expect(metadata[0].metadataEntry.scopedMetadataKey.toString()).to.be.equal('5');
            expect(metadata[0].metadataEntry.senderPublicKey).to.be.equal(account.publicKey);
            expect(metadata[0].metadataEntry.targetPublicKey).to.be.equal(account.publicKey);
            expect((metadata[0].metadataEntry.targetId as NamespaceId).toHex()).to.be.equal(namespaceId.toHex());
            expect(metadata[0].metadataEntry.value).to.be.equal('Test namespace meta value');
            expect(metadata[0].metadataEntry.value.length).to.be.equal(25);
        });
    });

    describe('getNamespaceMetadataByKeyAndSender', () => {
        it('should return metadata given a namespaceId and metadata key and sender public key', async () => {
            const metadata = await metadataRepository
                .getNamespaceMetadataByKeyAndSender(namespaceId, UInt64.fromUint(5).toHex(), account.publicKey)
                .toPromise();
            expect(metadata.metadataEntry.scopedMetadataKey.toString()).to.be.equal('5');
            expect(metadata.metadataEntry.senderPublicKey).to.be.equal(account.publicKey);
            expect(metadata.metadataEntry.targetPublicKey).to.be.equal(account.publicKey);
            expect((metadata.metadataEntry.targetId as NamespaceId).toHex()).to.be.equal(namespaceId.toHex());
            expect(metadata.metadataEntry.value).to.be.equal('Test namespace meta value');
            expect(metadata.metadataEntry.value.length).to.be.equal(25);
        });
    });
});
