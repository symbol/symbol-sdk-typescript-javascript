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
import { VerifiableTransaction } from 'nem2-library';
import { Account } from '../../../src/model/account/Account';
import { NetworkType } from '../../../src/model/blockchain/NetworkType';
import { AggregateTransaction } from '../../../src/model/transaction/AggregateTransaction';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { PlainMessage } from '../../../src/model/transaction/PlainMessage';
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
                240,
                serialized.length,
            )).to.be.equal('9050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E1420D000000746573742D6D657373616765');
        });
    });
});

class FakeTransaction extends Transaction {
    public signWith(account: Account): SignedTransaction {
        throw new Error('Method not implemented.');
    }

    protected buildTransaction(): VerifiableTransaction {
        throw new Error('Method not implemented.');
    }
}
