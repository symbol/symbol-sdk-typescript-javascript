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
import {deepEqual} from 'assert';
import {expect} from 'chai';
import {Convert} from '../../../src/core/format';
import {Account} from '../../../src/model/account/Account';
import {NetworkType} from '../../../src/model/blockchain/NetworkType';
import { Mosaic } from '../../../src/model/mosaic/Mosaic';
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import {NetworkCurrencyMosaic} from '../../../src/model/mosaic/NetworkCurrencyMosaic';
import { NamespaceId } from '../../../src/model/namespace/NamespaceId';
import { ReceiptSource } from '../../../src/model/receipt/ReceiptSource';
import { ResolutionEntry } from '../../../src/model/receipt/ResolutionEntry';
import { ResolutionStatement } from '../../../src/model/receipt/ResolutionStatement';
import { ResolutionType } from '../../../src/model/receipt/ResolutionType';
import { Statement } from '../../../src/model/receipt/Statement';
import {AggregateTransaction} from '../../../src/model/transaction/AggregateTransaction';
import {Deadline} from '../../../src/model/transaction/Deadline';
import {LockFundsTransaction} from '../../../src/model/transaction/LockFundsTransaction';
import { TransactionInfo } from '../../../src/model/transaction/TransactionInfo';
import {UInt64} from '../../../src/model/UInt64';
import {TestingAccount} from '../../conf/conf.spec';

describe('LockFundsTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    let statement: Statement;
    const unresolvedMosaicId = new NamespaceId('mosaic');
    const resolvedMosaicId = new MosaicId('0DC67FBE1CAD29E5');
    before(() => {
        account = TestingAccount;
        statement = new Statement([],
            [],
            [new ResolutionStatement(ResolutionType.Mosaic, UInt64.fromUint(2), unresolvedMosaicId,
                [new ResolutionEntry(resolvedMosaicId, new ReceiptSource(1, 0))])],
        );
    });

    it('should default maxFee field be set to 0', () => {
        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(),
            [],
            NetworkType.MIJIN_TEST,
            [],
        );
        const signedTransaction = account.sign(aggregateTransaction, generationHash);
        const lockFundsTransaction = LockFundsTransaction.create(Deadline.create(),
            NetworkCurrencyMosaic.createRelative(10),
            UInt64.fromUint(10),
            signedTransaction,
            NetworkType.MIJIN_TEST,
        );

        expect(lockFundsTransaction.maxFee.higher).to.be.equal(0);
        expect(lockFundsTransaction.maxFee.lower).to.be.equal(0);
        expect(Convert.hexToUint8(lockFundsTransaction.serialize()).length).to.be.equal(lockFundsTransaction.size);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(),
            [],
            NetworkType.MIJIN_TEST,
            [],
        );
        const signedTransaction = account.sign(aggregateTransaction, generationHash);
        const lockFundsTransaction = LockFundsTransaction.create(Deadline.create(),
            NetworkCurrencyMosaic.createRelative(10),
            UInt64.fromUint(10),
            signedTransaction,
            NetworkType.MIJIN_TEST,
            new UInt64([1, 0]),
        );

        expect(lockFundsTransaction.maxFee.higher).to.be.equal(0);
        expect(lockFundsTransaction.maxFee.lower).to.be.equal(1);
    });

    it('creation with an aggregate bonded tx', () => {
        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(),
            [],
            NetworkType.MIJIN_TEST,
            [],
        );
        const signedTransaction = account.sign(aggregateTransaction, generationHash);
        const transaction = LockFundsTransaction.create(Deadline.create(),
            NetworkCurrencyMosaic.createRelative(10),
            UInt64.fromUint(10),
            signedTransaction,
            NetworkType.MIJIN_TEST);
        deepEqual(transaction.mosaic.id.id, NetworkCurrencyMosaic.NAMESPACE_ID.id);
        expect(transaction.mosaic.amount.compact()).to.be.equal(10000000);
        expect(transaction.hash).to.be.equal(signedTransaction.hash);
    });

    it('should throw exception if it is not a aggregate bonded tx', () => {
        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [],
            NetworkType.MIJIN_TEST,
            [],
        );
        const signedTransaction = account.sign(aggregateTransaction, generationHash);
        expect(() => {
            LockFundsTransaction.create(Deadline.create(),
                NetworkCurrencyMosaic.createRelative(10),
                UInt64.fromUint(10),
                signedTransaction,
                NetworkType.MIJIN_TEST);
        }).to.throw(Error);
    });

    it('should create and sign LockFundsTransaction', () => {
        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(),
            [],
            NetworkType.MIJIN_TEST,
            [],
        );
        const signedTransaction = account.sign(aggregateTransaction, generationHash);
        const lockFundsTransaction = LockFundsTransaction.create(Deadline.create(),
            NetworkCurrencyMosaic.createRelative(10),
            UInt64.fromUint(10),
            signedTransaction,
            NetworkType.MIJIN_TEST,
        );
        const signedTx = lockFundsTransaction.signWith(account, generationHash);

        expect(signedTx.payload.substring(
            144,
            signedTransaction.payload.length - 104,
        )).to.be.equal('9801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B6000000000190484100000000');
    });

    describe('size', () => {
        it('should return 184 for LockFundsTransaction transaction byte size', () => {
            const aggregateTransaction = AggregateTransaction.createBonded(
                Deadline.create(),
                [],
                NetworkType.MIJIN_TEST,
                [],
            );
            const signedTransaction = account.sign(aggregateTransaction, generationHash);
            const lockFundsTransaction = LockFundsTransaction.create(Deadline.create(),
                NetworkCurrencyMosaic.createRelative(10),
                UInt64.fromUint(10),
                signedTransaction,
                NetworkType.MIJIN_TEST,
            );
            expect(lockFundsTransaction.size).to.be.equal(184);
        });
    });

    it('Test set maxFee using multiplier', () => {
        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(),
            [],
            NetworkType.MIJIN_TEST,
            [],
        );
        const signedTransaction = account.sign(aggregateTransaction, generationHash);
        const lockFundsTransaction = LockFundsTransaction.create(Deadline.create(),
            NetworkCurrencyMosaic.createRelative(10),
            UInt64.fromUint(10),
            signedTransaction,
            NetworkType.MIJIN_TEST,
        ).setMaxFee(2);
​
        expect(lockFundsTransaction.maxFee.compact()).to.be.equal(368);

        const signedTransactionTest = lockFundsTransaction.signWith(account, generationHash);
        expect(signedTransactionTest.hash).not.to.be.undefined;
    });

    it('Test resolveAlias can resolve', () => {
        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(),
            [],
            NetworkType.MIJIN_TEST,
            [],
        );
        const signedTransaction = account.sign(aggregateTransaction, generationHash);
        const transaction = new LockFundsTransaction(
            NetworkType.MIJIN_TEST,
            1,
            Deadline.createFromDTO('1'),
            UInt64.fromUint(0),
            new Mosaic(unresolvedMosaicId, UInt64.fromUint(1)),
            UInt64.fromUint(10),
            signedTransaction,
            '',
            account.publicAccount,
            new TransactionInfo(UInt64.fromUint(2), 0, '')).resolveAliases(statement);
​
        expect(transaction.mosaic.id instanceof MosaicId).to.be.true;
        expect((transaction.mosaic.id as MosaicId).equals(resolvedMosaicId)).to.be.true;

        const signedTransactionTest = transaction.signWith(account, generationHash);
        expect(signedTransactionTest.hash).not.to.be.undefined;
    });
});
