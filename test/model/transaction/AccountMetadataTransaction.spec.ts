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
import { Convert } from '../../../src/core/format/Convert';
import { Account } from '../../../src/model/account/Account';
import { Address } from '../../../src/model/account/Address';
import { NamespaceId } from '../../../src/model/namespace/NamespaceId';
import { AccountMetadataTransaction } from '../../../src/model/transaction/AccountMetadataTransaction';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { TransactionType } from '../../../src/model/transaction/TransactionType';
import { UInt64 } from '../../../src/model/UInt64';
import { TestingAccount, TestNetworkType } from '../../conf/conf.spec';

describe('AccountMetadataTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    const epochAdjustment = 1573430400;
    before(() => {
        account = TestingAccount;
    });

    it('should default maxFee field be set to 0', () => {
        const accountMetadataTransaction = AccountMetadataTransaction.create(
            Deadline.create(epochAdjustment),
            account.address,
            UInt64.fromUint(1000),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            TestNetworkType,
        );

        expect(accountMetadataTransaction.maxFee.higher).to.be.equal(0);
        expect(accountMetadataTransaction.maxFee.lower).to.be.equal(0);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const accountMetadataTransaction = AccountMetadataTransaction.create(
            Deadline.create(epochAdjustment),
            account.address,
            UInt64.fromUint(1000),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            TestNetworkType,
            new UInt64([1, 0]),
        );

        expect(accountMetadataTransaction.maxFee.higher).to.be.equal(0);
        expect(accountMetadataTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should create and sign an AccountMetadataTransaction object', () => {
        const accountMetadataTransaction = AccountMetadataTransaction.create(
            Deadline.create(epochAdjustment),
            account.address,
            UInt64.fromUint(1000),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            TestNetworkType,
        );

        const signedTransaction = accountMetadataTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '9826D27E1D0A26CA4E316F901E23E55C8711DB20DFD26776E80300000000000001000A0000000000000000000000',
        );
    });

    describe('size', () => {
        it('should return 174 for AccountMetadataTransaction byte size', () => {
            const accountMetadataTransaction = AccountMetadataTransaction.create(
                Deadline.create(epochAdjustment),
                account.address,
                UInt64.fromUint(1000),
                1,
                Convert.uint8ToUtf8(new Uint8Array(10)),
                TestNetworkType,
            );

            expect(Convert.hexToUint8(accountMetadataTransaction.serialize()).length).to.be.equal(accountMetadataTransaction.size);
            expect(accountMetadataTransaction.size).to.be.equal(174);

            const signedTransaction = accountMetadataTransaction.signWith(account, generationHash);
            expect(signedTransaction.hash).not.to.be.undefined;
        });

        it('should set payload size', () => {
            const accountMetadataTransaction = AccountMetadataTransaction.create(
                Deadline.create(epochAdjustment),
                account.address,
                UInt64.fromUint(1000),
                1,
                Convert.uint8ToUtf8(new Uint8Array(10)),
                TestNetworkType,
            );

            expect(Convert.hexToUint8(accountMetadataTransaction.serialize()).length).to.be.equal(accountMetadataTransaction.size);
            expect(accountMetadataTransaction.size).to.be.equal(174);

            expect(accountMetadataTransaction.setPayloadSize(10).size).to.be.equal(10);
        });
    });

    it('should create EmbeddedTransactionBuilder', () => {
        const accountMetadataTransaction = AccountMetadataTransaction.create(
            Deadline.create(epochAdjustment),
            account.address,
            UInt64.fromUint(1000),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            TestNetworkType,
        );

        Object.assign(accountMetadataTransaction, { signer: account.publicAccount });

        const embedded = accountMetadataTransaction.toEmbeddedTransaction();

        expect(embedded).to.be.instanceOf(EmbeddedTransactionBuilder);
        expect(Convert.uint8ToHex(embedded.signerPublicKey.publicKey)).to.be.equal(account.publicKey);
        expect(embedded.type.valueOf()).to.be.equal(TransactionType.ACCOUNT_METADATA.valueOf());
    });

    it('should resolve alias', () => {
        const accountMetadataTransaction = AccountMetadataTransaction.create(
            Deadline.create(epochAdjustment),
            account.address,
            UInt64.fromUint(1000),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            TestNetworkType,
        );

        const resolved = accountMetadataTransaction.resolveAliases();

        expect(resolved).to.be.instanceOf(AccountMetadataTransaction);
        deepEqual(accountMetadataTransaction, resolved);
    });

    it('Notify Account', () => {
        const tx = AccountMetadataTransaction.create(
            Deadline.create(epochAdjustment),
            account.address,
            UInt64.fromUint(1000),
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
        const tx = AccountMetadataTransaction.create(
            Deadline.create(epochAdjustment),
            alias,
            UInt64.fromUint(1000),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            TestNetworkType,
        );

        let canNotify = tx.shouldNotifyAccount(alias);
        expect(canNotify).to.be.true;

        canNotify = tx.shouldNotifyAccount(wrongAlias);
        expect(canNotify).to.be.false;

        Object.assign(tx, { signer: account.publicAccount });
        expect(tx.shouldNotifyAccount(account.address)).to.be.true;
    });
});
