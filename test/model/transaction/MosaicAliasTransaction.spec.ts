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

import { deepEqual } from 'assert';
import { EmbeddedTransactionBuilder } from 'catbuffer-typescript';
import { expect } from 'chai';
import { Convert } from '../../../src/core/format';
import { UInt64 } from '../../../src/model';
import { Account } from '../../../src/model/account';
import { MosaicId } from '../../../src/model/mosaic';
import { AliasAction, NamespaceId } from '../../../src/model/namespace';
import { AliasTransaction, Deadline, MosaicAliasTransaction, TransactionType } from '../../../src/model/transaction';
import { TestingAccount, TestNetworkType } from '../../conf/conf.spec';

describe('MosaicAliasTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    const epochAdjustment = 1573430400;
    before(() => {
        account = TestingAccount;
    });

    it('should default maxFee field be set to 0', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicAliasTransaction = MosaicAliasTransaction.create(
            Deadline.create(epochAdjustment),
            AliasAction.Link,
            namespaceId,
            mosaicId,
            TestNetworkType,
        );

        expect(mosaicAliasTransaction.maxFee.higher).to.be.equal(0);
        expect(mosaicAliasTransaction.maxFee.lower).to.be.equal(0);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicAliasTransaction = MosaicAliasTransaction.create(
            Deadline.create(epochAdjustment),
            AliasAction.Link,
            namespaceId,
            mosaicId,
            TestNetworkType,
            new UInt64([1, 0]),
        );

        expect(mosaicAliasTransaction.maxFee.higher).to.be.equal(0);
        expect(mosaicAliasTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should createComplete an MosaicAliasTransaction object and sign it', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicAliasTransaction = MosaicAliasTransaction.create(
            Deadline.create(epochAdjustment),
            AliasAction.Link,
            namespaceId,
            mosaicId,
            TestNetworkType,
        );

        expect(mosaicAliasTransaction.aliasAction).to.be.equal(AliasAction.Link);
        expect(mosaicAliasTransaction.namespaceId.id.lower).to.be.equal(33347626);
        expect(mosaicAliasTransaction.namespaceId.id.higher).to.be.equal(3779697293);
        expect(mosaicAliasTransaction.mosaicId.id.lower).to.be.equal(2262289484);
        expect(mosaicAliasTransaction.mosaicId.id.higher).to.be.equal(3405110546);

        const signedTransaction = mosaicAliasTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '2AD8FC018D9A49E14CCCD78612DDF5CA01',
        );
    });

    it('should createComplete an MosaicAliasTransaction using abstract', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicAliasTransaction = AliasTransaction.createForMosaic(
            Deadline.create(epochAdjustment),
            AliasAction.Link,
            namespaceId,
            mosaicId,
            TestNetworkType,
        ) as MosaicAliasTransaction;

        expect(mosaicAliasTransaction.aliasAction).to.be.equal(AliasAction.Link);
        expect(mosaicAliasTransaction.namespaceId.id.lower).to.be.equal(33347626);
        expect(mosaicAliasTransaction.namespaceId.id.higher).to.be.equal(3779697293);
        expect(mosaicAliasTransaction.mosaicId.id.lower).to.be.equal(2262289484);
        expect(mosaicAliasTransaction.mosaicId.id.higher).to.be.equal(3405110546);

        const signedTransaction = mosaicAliasTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '2AD8FC018D9A49E14CCCD78612DDF5CA01',
        );
    });

    describe('size', () => {
        it('should return 145 for MosaicAliasTransaction transaction byte size', () => {
            const namespaceId = new NamespaceId([33347626, 3779697293]);
            const mosaicId = new MosaicId([2262289484, 3405110546]);
            const mosaicAliasTransaction = MosaicAliasTransaction.create(
                Deadline.create(epochAdjustment),
                AliasAction.Link,
                namespaceId,
                mosaicId,
                TestNetworkType,
            );
            expect(mosaicAliasTransaction.size).to.be.equal(145);
            expect(Convert.hexToUint8(mosaicAliasTransaction.serialize()).length).to.be.equal(mosaicAliasTransaction.size);
        });
        it('should set payload size', () => {
            const namespaceId = new NamespaceId([33347626, 3779697293]);
            const mosaicId = new MosaicId([2262289484, 3405110546]);
            const mosaicAliasTransaction = MosaicAliasTransaction.create(
                Deadline.create(epochAdjustment),
                AliasAction.Link,
                namespaceId,
                mosaicId,
                TestNetworkType,
            );
            expect(mosaicAliasTransaction.size).to.be.equal(145);
            expect(Convert.hexToUint8(mosaicAliasTransaction.serialize()).length).to.be.equal(mosaicAliasTransaction.size);
            expect(mosaicAliasTransaction.setPayloadSize(10).size).to.be.equal(10);
        });
    });

    it('Test set maxFee using multiplier', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicAliasTransaction = MosaicAliasTransaction.create(
            Deadline.create(epochAdjustment),
            AliasAction.Link,
            namespaceId,
            mosaicId,
            TestNetworkType,
        ).setMaxFee(2);
        expect(mosaicAliasTransaction.maxFee.compact()).to.be.equal(290);

        const signedTransaction = mosaicAliasTransaction.signWith(account, generationHash);
        expect(signedTransaction.hash).not.to.be.undefined;
    });

    it('Test resolveAlias can resolve', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicAliasTransaction = MosaicAliasTransaction.create(
            Deadline.create(epochAdjustment),
            AliasAction.Link,
            namespaceId,
            mosaicId,
            TestNetworkType,
        );
        const resolved = mosaicAliasTransaction.resolveAliases();
        deepEqual(mosaicAliasTransaction, resolved);
    });

    it('should create EmbeddedTransactionBuilder', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicAliasTransaction = MosaicAliasTransaction.create(
            Deadline.create(epochAdjustment),
            AliasAction.Link,
            namespaceId,
            mosaicId,
            TestNetworkType,
        );

        Object.assign(mosaicAliasTransaction, { signer: account.publicAccount });

        const embedded = mosaicAliasTransaction.toEmbeddedTransaction();

        expect(embedded).to.be.instanceOf(EmbeddedTransactionBuilder);
        expect(Convert.uint8ToHex(embedded.signerPublicKey.publicKey)).to.be.equal(account.publicKey);
        expect(embedded.type.valueOf()).to.be.equal(TransactionType.MOSAIC_ALIAS.valueOf());
    });

    it('Notify Account', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const tx = MosaicAliasTransaction.create(
            Deadline.create(epochAdjustment),
            AliasAction.Link,
            namespaceId,
            mosaicId,
            TestNetworkType,
        );

        Object.assign(tx, { signer: account.publicAccount });
        expect(tx.shouldNotifyAccount(account.address)).to.be.true;
    });
});
