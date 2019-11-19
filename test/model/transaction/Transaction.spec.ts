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

import { expect } from 'chai';
import { Account } from '../../../src/model/account/Account';
import { Address } from '../../../src/model/account/Address';
import { NetworkType } from '../../../src/model/blockchain/NetworkType';
import { PlainMessage } from '../../../src/model/message/PlainMessage';
import { AggregateTransaction } from '../../../src/model/transaction/AggregateTransaction';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { SignedTransaction } from '../../../src/model/transaction/SignedTransaction';
import { Transaction } from '../../../src/model/transaction/Transaction';
import { TransactionInfo } from '../../../src/model/transaction/TransactionInfo';
import { TransactionType } from '../../../src/model/transaction/TransactionType';
import { TransferTransaction } from '../../../src/model/transaction/TransferTransaction';
import { UInt64 } from '../../../src/model/UInt64';
import { TestingAccount } from '../../conf/conf.spec';
import { Convert } from '../../../src/core/format/Convert';

describe('Transaction', () => {
    let account: Account;

    before(() => {
        account = TestingAccount;
    });

    describe('isUnannounced', () => {
        it('should return true when there is no Transaction Info', () => {
            const transaction = new FakeTransaction(TransactionType.TRANSFER,
                NetworkType.MIJIN_TEST,
                1,
                Deadline.create(),
                UInt64.fromUint(0),
                undefined,
                undefined,
                undefined,
            );
            expect(transaction.isUnannounced()).to.be.equal(true);
        });
    });

    describe('isUnconfirmed', () => {
        it('should return true when height is 0', () => {
            const transaction = new FakeTransaction(TransactionType.TRANSFER,
                NetworkType.MIJIN_TEST,
                1,
                Deadline.create(),
                UInt64.fromUint(0),
                undefined,
                undefined,
                new TransactionInfo(UInt64.fromUint(0), 1, 'id_hash', 'hash', 'hash'),
            );
            expect(transaction.isUnconfirmed()).to.be.equal(true);
        });

        it('should return false when height is not 0', () => {
            const transaction = new FakeTransaction(TransactionType.TRANSFER,
                NetworkType.MIJIN_TEST,
                1,
                Deadline.create(),
                UInt64.fromUint(0),
                undefined,
                undefined,
                new TransactionInfo(UInt64.fromUint(100), 1, 'id_hash', 'hash', 'hash'),
            );
            expect(transaction.isUnconfirmed()).to.be.equal(false);
        });
    });

    describe('isConfirmed', () => {
        it('should return true when height is not 0', () => {
            const transaction = new FakeTransaction(TransactionType.TRANSFER,
                NetworkType.MIJIN_TEST,
                1,
                Deadline.create(),
                UInt64.fromUint(0),
                undefined,
                undefined,
                new TransactionInfo(UInt64.fromUint(100), 1, 'id_hash', 'hash', 'hash'),
            );
            expect(transaction.isConfirmed()).to.be.equal(true);
        });
    });

    describe('hasMissingSignatures', () => {
        it('should return false when height is 0 and hash and markehash are different', () => {
            const transaction = new FakeTransaction(TransactionType.TRANSFER,
                NetworkType.MIJIN_TEST,
                1,
                Deadline.create(),
                UInt64.fromUint(0),
                undefined,
                undefined,
                new TransactionInfo(UInt64.fromUint(0), 1, 'id_hash', 'hash', 'hash_2'),
            );
            expect(transaction.hasMissingSignatures()).to.be.equal(true);
        });
    });

    describe('reapplyGiven', () => {
        it('should throw an error if the transaction is announced', () => {
            const transaction = new FakeTransaction(TransactionType.TRANSFER,
                NetworkType.MIJIN_TEST,
                1,
                Deadline.create(),
                UInt64.fromUint(0),
                undefined,
                undefined,
                new TransactionInfo(UInt64.fromUint(100), 1, 'id_hash', 'hash', 'hash'),
            );
            expect(() => {
                transaction.reapplyGiven(Deadline.create());
            }).to.throws('an Announced transaction can\'t be modified');
        });
        it('should return a new transaction', () => {
            const transaction = new FakeTransaction(TransactionType.TRANSFER,
                NetworkType.MIJIN_TEST,
                1,
                Deadline.create(),
                UInt64.fromUint(0),
                undefined,
                undefined,
            );

            const newTransaction = transaction.reapplyGiven(Deadline.create());
            expect(newTransaction).to.not.equal(transaction);
        });
        it('should overide deadline properly', () => {
            const transaction = new FakeTransaction(TransactionType.TRANSFER,
                NetworkType.MIJIN_TEST,
                1,
                Deadline.create(),
                UInt64.fromUint(0),
                undefined,
                undefined,
            );

            const newDeadline = Deadline.create(3);
            const newTransaction = transaction.reapplyGiven(newDeadline);
            const equal = newTransaction.deadline.value.equals(transaction.deadline.value);
            const after = newTransaction.deadline.value.isAfter(transaction.deadline.value);
            expect(newTransaction.deadline).to.be.equal(newDeadline);
            expect(equal).to.be.equal(false);
            expect(after).to.be.equal(true);
        });
    });

    describe('toAggregate', () => {
        it('should throw exception when adding an aggregated transaction as inner transaction', () => {
            const transaction = new FakeTransaction(TransactionType.TRANSFER,
                NetworkType.MIJIN_TEST,
                1,
                Deadline.create(),
                UInt64.fromUint(0),
                undefined,
                undefined,
            );

            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(),
                [transaction.toAggregate(account.publicAccount)],
                NetworkType.MIJIN_TEST,
                []);

            expect(() => {
                aggregateTransaction.toAggregate(account.publicAccount);
            }).to.throw(Error, 'Inner transaction cannot be an aggregated transaction.');
        });
    });

    describe('Transaction serialize', () => {
        it('Should return serialized payload', () => {
            const transaction = TransferTransaction.create(
                Deadline.create(),
                Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
                [],
                PlainMessage.create('test-message'),
                NetworkType.MIJIN_TEST,
            );
            const serialized = transaction.serialize();

            expect(serialized.substring(
                256,
                serialized.length,
            )).to.be.equal('9050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142000D000000000000746573742D6D657373616765');
        });
    });

    describe('size', () => {
        it('should return 128 for base transaction size', () => {
            const transaction = new FakeTransaction(TransactionType.TRANSFER,
                NetworkType.MIJIN_TEST,
                1,
                Deadline.create(),
                UInt64.fromUint(0),
                undefined,
                undefined,
                new TransactionInfo(UInt64.fromUint(100), 1, 'id_hash', 'hash', 'hash'),
            );
            expect(transaction.size).to.be.equal(128);
        });
    });

    describe('version', () => {
        it('should return version in hex format', () => {
            const transaction = new FakeTransaction(TransactionType.TRANSFER,
                NetworkType.MIJIN_TEST,
                1,
                Deadline.create(),
                UInt64.fromUint(0),
                undefined,
                undefined,
                new TransactionInfo(UInt64.fromUint(100), 1, 'id_hash', 'hash', 'hash'),
            );
            expect(transaction.versionToHex()).to.be.equal('0x9001');
        });
    });

    describe('createTransactionHash() should', () => {

        // shortcut
        const knownPayload = (
            '970000000000000075DAC796D500CEFDFBD582BC6E0580401FE6DB02FBEA9367'
          + '3DF47844246CDEA93715EB700F295A459E59D96A2BC6B7E36C79016A96B9FA38'
          + '7E8B8937342FE30C6BE37B726EEE24C4B0E3C943E09A44691553759A89E92C4A'
          + '84BBC4AD9AF5D49C0000000001984E4140420F0000000000E4B580B11A000000'
          + 'A0860100000000002AD8FC018D9A49E100056576696173'
        );

        // expected values
        const knownHash_sha3 = '709373248659274C5933BEA2920942D6C7B48B9C2DA4BAEE233510E71495931F';
        const knownHash_keccak = '787423372BEC0CB2BE3EEA58E773074E121989AF29E5E5BD9EE660C1E3A0AF93';
        const generationHashBytes = Array.from(Convert.hexToUint8('988C4CDCE4D188013C13DE7914C7FD4D626169EF256722F61C52EFBE06BD5A2C'));

        it('create correct SHA3 transaction hash given network type MIJIN or MIJIN_TEST', () => {
            const hash1 = Transaction.createTransactionHash(
                knownPayload,
                generationHashBytes,
                NetworkType.MIJIN_TEST,
            );
            const hash2 = Transaction.createTransactionHash(
                knownPayload,
                generationHashBytes,
                NetworkType.MIJIN,
            );

            expect(hash1).to.equal(knownHash_sha3);
            expect(hash2).to.equal(knownHash_sha3);
        });

        it('create correct KECCAK transaction hash given network type MAIN_NET or TEST_NET', () => {
            const hash1 = Transaction.createTransactionHash(
                knownPayload,
                generationHashBytes,
                NetworkType.TEST_NET,
            );
            const hash2 = Transaction.createTransactionHash(
                knownPayload,
                generationHashBytes,
                NetworkType.MAIN_NET,
            );

            expect(hash1).to.equal(knownHash_keccak);
            expect(hash2).to.equal(knownHash_keccak);
        });
    });
});

class FakeTransaction extends Transaction {
    public signWith(account: Account): SignedTransaction {
        throw new Error('Method not implemented.');
    }

    protected generateBytes(): Uint8Array {
        throw new Error('Not implemented');
    }

    protected generateEmbeddedBytes(): Uint8Array {
        throw new Error('Not implemented');
    }
}
