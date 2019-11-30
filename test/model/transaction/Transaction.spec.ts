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
import { Observable } from 'rxjs/internal/Observable';
import { Convert } from '../../../src/core/format/Convert';
import { ReceiptHttp } from '../../../src/infrastructure/ReceiptHttp';
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

        const knownAggregatePayload = (
            '0801000000000000AC1F3E0EE2C16F465CDC2E091DC44D6EB55F7FE3988A5F21'
          + '309DF479BE6D3F0033E155695FB1133EA0EA64A67C1EDC2B430CFAF9722AF36B'
          + 'AE84DBDB1C8F1509C2F93346E27CE6AD1A9F8F5E3066F8326593A406BDF357AC'
          + 'B041E2F9AB402EFE000000000190414200000000000000006BA50FB91A000000'
          + 'EA8F8301E7EDFD701F62E1DC1601ABDE22E5FCD11C9C7E7A01B87F8DFB6B62B0'
          + '60000000000000005D00000000000000C2F93346E27CE6AD1A9F8F5E3066F832'
          + '6593A406BDF357ACB041E2F9AB402EFE00000000019054419050B9837EFAB4BB'
          + 'E8A4B9BB32D812F9885C00D8FC1650E142000D000000000000746573742D6D65'
          + '7373616765000000'
        );

        // expected values
        const knownHash_sha3 = '709373248659274C5933BEA2920942D6C7B48B9C2DA4BAEE233510E71495931F';
        const generationHashBytes = Array.from(Convert.hexToUint8('988C4CDCE4D188013C13DE7914C7FD4D626169EF256722F61C52EFBE06BD5A2C'));
        const generationHashBytes_mt = Array.from(Convert.hexToUint8('17FA4747F5014B50413CCF968749604D728D7065DC504291EEE556899A534CBB'));

        it ('create different hash given different signatures', () => {
            const hash1 = Transaction.createTransactionHash(
                knownPayload,
                generationHashBytes,
                NetworkType.MIJIN_TEST,
            );

            // modify signature part of the payload ; this must affect produced hash
            const tamperedSig = knownPayload.substr(0, 16) + '12' + knownPayload.substr(18);
            const hash2 = Transaction.createTransactionHash(
                tamperedSig, // replaced two first bytes of signature
                generationHashBytes,
                NetworkType.MIJIN_TEST,
            );

            expect(hash1).to.not.equal(hash2);
        });

        it ('create different hash given different signer public key', () => {
            const hash1 = Transaction.createTransactionHash(
                knownPayload,
                generationHashBytes,
                NetworkType.MIJIN_TEST,
            );

            // modify signer public key part of the payload ; this must affect produced hash
            const tamperedSigner = knownPayload.substr(0, 16 + 128) + '12' + knownPayload.substr(16 + 128 + 2);
            const hash2 = Transaction.createTransactionHash(
                tamperedSigner, // replaced two first bytes of signer public key
                generationHashBytes,
                NetworkType.MIJIN_TEST,
            );

            expect(hash1).to.not.equal(hash2);
        });

        it ('create different hash given different generation hash', () => {
            const hash1 = Transaction.createTransactionHash(
                knownPayload,
                generationHashBytes,
                NetworkType.MIJIN_TEST,
            );

            const hash2 = Transaction.createTransactionHash(
                knownPayload,
                generationHashBytes_mt, // uses different generation hash
                NetworkType.MIJIN_TEST,
            );

            expect(hash1).to.not.equal(hash2);
        });

        it ('create different hash given different transaction body', () => {
            const hash1 = Transaction.createTransactionHash(
                knownPayload,
                generationHashBytes,
                NetworkType.MIJIN_TEST,
            );

            // modify "transaction body" part of payload ; this must affect produced transaction hash
            const tamperedBody = knownAggregatePayload.substr(0, Transaction.Body_Index * 2)
                                  + '12' + knownAggregatePayload.substr(Transaction.Body_Index * 2 + 2);
            const hash2 = Transaction.createTransactionHash(
                tamperedBody,
                generationHashBytes, // uses different generation hash
                NetworkType.MIJIN_TEST,
            );

            expect(hash1).to.not.equal(hash2);
        });

        it ('create same hash given same payloads', () => {
            const hash1 = Transaction.createTransactionHash(
                knownPayload,
                generationHashBytes,
                NetworkType.MIJIN_TEST,
            );
            const hash2 = Transaction.createTransactionHash(
                knownPayload,
                generationHashBytes,
                NetworkType.MIJIN_TEST,
            );

            expect(hash1).to.equal(hash2);
        });

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

        it('hash only merkle transaction hash for aggregate transactions', () => {
            const hash1 = Transaction.createTransactionHash(
                knownAggregatePayload,
                generationHashBytes,
                NetworkType.MIJIN_TEST,
            );

            // modify end of payload ; this must not affect produced transaction hash
            // this test is valid only for Aggregate Transactions
            const tamperedSize = '12' + knownAggregatePayload.substr(2);
            const hashTamperedBody = Transaction.createTransactionHash(
                tamperedSize, // replace in size (header change should not affect hash)
                generationHashBytes,
                NetworkType.MIJIN_TEST,
            );

            // modify "merkle hash" part of payload ; this must affect produced transaction hash
            const tamperedPayload = knownAggregatePayload.substr(0, Transaction.Body_Index * 2)
                                  + '12' + knownAggregatePayload.substr(Transaction.Body_Index * 2 + 2);
            const hashTamperedMerkle = Transaction.createTransactionHash(
                tamperedPayload, // replace in merkle hash (will affect hash)
                generationHashBytes,
                NetworkType.MIJIN_TEST,
            );

            expect(hash1).to.equal(hashTamperedBody);
            expect(hash1).to.not.equal(hashTamperedMerkle);
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
    resolveAliases(receiptHttp: ReceiptHttp): Observable<TransferTransaction> {
        throw new Error('Not implemented');
    }
}
