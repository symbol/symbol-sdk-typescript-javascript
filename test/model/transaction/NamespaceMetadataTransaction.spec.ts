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
import { Account, Address } from '../../../src/model/account';
import { NamespaceId } from '../../../src/model/namespace';
import { Deadline, NamespaceMetadataTransaction, TransactionType } from '../../../src/model/transaction';
import { TestingAccount, TestNetworkType } from '../../conf/conf.spec';

describe('NamespaceMetadataTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    const epochAdjustment = 1573430400;
    before(() => {
        account = TestingAccount;
    });

    it('should default maxFee field be set to 0', () => {
        const namespaceMetadataTransaction = NamespaceMetadataTransaction.create(
            Deadline.create(epochAdjustment),
            account.address,
            UInt64.fromUint(1000),
            new NamespaceId([2262289484, 3405110546]),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            TestNetworkType,
        );

        expect(namespaceMetadataTransaction.maxFee.higher).to.be.equal(0);
        expect(namespaceMetadataTransaction.maxFee.lower).to.be.equal(0);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const namespaceMetadataTransaction = NamespaceMetadataTransaction.create(
            Deadline.create(epochAdjustment),
            account.address,
            UInt64.fromUint(1000),
            new NamespaceId([2262289484, 3405110546]),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            TestNetworkType,
            new UInt64([1, 0]),
        );

        expect(namespaceMetadataTransaction.maxFee.higher).to.be.equal(0);
        expect(namespaceMetadataTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should create and sign an NamespaceMetadataTransaction object', () => {
        const namespaceMetadataTransaction = NamespaceMetadataTransaction.create(
            Deadline.create(epochAdjustment),
            account.address,
            UInt64.fromUint(1000),
            new NamespaceId([2262289484, 3405110546]),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            TestNetworkType,
        );

        const signedTransaction = namespaceMetadataTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '9826D27E1D0A26CA4E316F901E23E55C8711DB20DFD26776E8030000000000004CCCD78612DDF5CA01000A0000000000000000000000',
        );
    });

    describe('size', () => {
        it('should return 182 for NamespaceMetadataTransaction byte size', () => {
            const namespaceMetadataTransaction = NamespaceMetadataTransaction.create(
                Deadline.create(epochAdjustment),
                account.address,
                UInt64.fromUint(1000),
                new NamespaceId([2262289484, 3405110546]),
                1,
                Convert.uint8ToUtf8(new Uint8Array(10)),
                TestNetworkType,
            );
            expect(namespaceMetadataTransaction.size).to.be.equal(182);
            expect(Convert.hexToUint8(namespaceMetadataTransaction.serialize()).length).to.be.equal(namespaceMetadataTransaction.size);
        });

        it('should set payload size', () => {
            const namespaceMetadataTransaction = NamespaceMetadataTransaction.create(
                Deadline.create(epochAdjustment),
                account.address,
                UInt64.fromUint(1000),
                new NamespaceId([2262289484, 3405110546]),
                1,
                Convert.uint8ToUtf8(new Uint8Array(10)),
                TestNetworkType,
            );
            expect(namespaceMetadataTransaction.size).to.be.equal(182);
            expect(Convert.hexToUint8(namespaceMetadataTransaction.serialize()).length).to.be.equal(namespaceMetadataTransaction.size);
            expect(namespaceMetadataTransaction.setPayloadSize(10).size).to.be.equal(10);
        });
    });

    it('Test set maxFee using multiplier', () => {
        const namespaceMetadataTransaction = NamespaceMetadataTransaction.create(
            Deadline.create(epochAdjustment),
            account.address,
            UInt64.fromUint(1000),
            new NamespaceId([2262289484, 3405110546]),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            TestNetworkType,
        ).setMaxFee(2);
        expect(namespaceMetadataTransaction.maxFee.compact()).to.be.equal(364);

        const signedTransaction = namespaceMetadataTransaction.signWith(account, generationHash);
        expect(signedTransaction.hash).not.to.be.undefined;
    });

    it('should create EmbeddedTransactionBuilder', () => {
        const namespaceMetadataTransaction = NamespaceMetadataTransaction.create(
            Deadline.create(epochAdjustment),
            account.address,
            UInt64.fromUint(1000),
            new NamespaceId([2262289484, 3405110546]),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            TestNetworkType,
        );

        Object.assign(namespaceMetadataTransaction, { signer: account.publicAccount });

        const embedded = namespaceMetadataTransaction.toEmbeddedTransaction();

        expect(embedded).to.be.instanceOf(EmbeddedTransactionBuilder);
        expect(Convert.uint8ToHex(embedded.signerPublicKey.key)).to.be.equal(account.publicKey);
        expect(embedded.type.valueOf()).to.be.equal(TransactionType.NAMESPACE_METADATA.valueOf());
    });

    it('should resolve alias', () => {
        const namespaceMetadataTransaction = NamespaceMetadataTransaction.create(
            Deadline.create(epochAdjustment),
            account.address,
            UInt64.fromUint(1000),
            new NamespaceId([2262289484, 3405110546]),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            TestNetworkType,
        );
        const resolved = namespaceMetadataTransaction.resolveAliases();

        expect(resolved).to.be.instanceOf(NamespaceMetadataTransaction);
        deepEqual(namespaceMetadataTransaction, resolved);
    });

    it('Notify Account', () => {
        const tx = NamespaceMetadataTransaction.create(
            Deadline.create(epochAdjustment),
            account.address,
            UInt64.fromUint(1000),
            new NamespaceId([2262289484, 3405110546]),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            TestNetworkType,
        );
        let canNotify = tx.shouldNotifyAccount(account.address);
        expect(canNotify).to.be.true;

        canNotify = tx.shouldNotifyAccount(Address.createFromRawAddress('TAMJCSC2BEW52LVAULFRRJJTSRHLI7ABRHFJZ5I'));
        expect(canNotify).to.be.false;

        Object.assign(tx, { signer: account.publicAccount });
        expect(tx.shouldNotifyAccount(account.address)).to.be.true;
    });

    it('Notify Account with alias', () => {
        const alias = new NamespaceId('test');
        const wrongAlias = new NamespaceId('wrong');
        const tx = NamespaceMetadataTransaction.create(
            Deadline.create(epochAdjustment),
            alias,
            UInt64.fromUint(1000),
            new NamespaceId([2262289484, 3405110546]),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            TestNetworkType,
        );
        let canNotify = tx.shouldNotifyAccount(alias);
        expect(canNotify).to.be.true;

        canNotify = tx.shouldNotifyAccount(wrongAlias);
        expect(canNotify).to.be.false;

        Object.assign(tx, { signer: account.publicAccount });
        expect(tx.shouldNotifyAccount(wrongAlias)).to.be.false;
    });
});
