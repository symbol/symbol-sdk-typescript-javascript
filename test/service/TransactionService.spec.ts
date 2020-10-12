/*
 * Copyright 2020 NEM
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
import { ChronoUnit, Duration } from 'js-joda';
import { EMPTY, of as observableOf } from 'rxjs';
import { deepEqual, instance, mock, when } from 'ts-mockito';
import { IListener } from '../../src/infrastructure/IListener';
import { ReceiptRepository } from '../../src/infrastructure/ReceiptRepository';
import { TransactionRepository } from '../../src/infrastructure/TransactionRepository';

import { Account } from '../../src/model/account/Account';
import { Address } from '../../src/model/account/Address';
import { PlainMessage } from '../../src/model/message/PlainMessage';
import { Mosaic } from '../../src/model/mosaic/Mosaic';
import { NetworkCurrencyLocal } from '../../src/model/mosaic/NetworkCurrencyLocal';
import { NamespaceId } from '../../src/model/namespace/NamespaceId';
import { NetworkType } from '../../src/model/network/NetworkType';
import { AggregateTransaction } from '../../src/model/transaction/AggregateTransaction';
import { Deadline } from '../../src/model/transaction/Deadline';
import { HashLockTransaction } from '../../src/model/transaction/HashLockTransaction';
import { TransactionAnnounceResponse } from '../../src/model/transaction/TransactionAnnounceResponse';
import { TransactionStatusError } from '../../src/model/transaction/TransactionStatusError';
import { TransferTransaction } from '../../src/model/transaction/TransferTransaction';
import { UInt64 } from '../../src/model/UInt64';
import { TransactionService } from '../../src/service/TransactionService';

/**
 * Unit test of TransactionService
 */
describe('TransactionService', () => {
    const generationHash = '82DB2528834C9926F0FCCE042466B24A266F5B685CB66D2869AF6648C043E950';
    const account = Account.generateNewAccount(NetworkType.PRIVATE_TEST);
    const epochAdjustment = Duration.ofSeconds(1573430400);
    const transferTransaction = TransferTransaction.create(
        Deadline.create(epochAdjustment, 1, ChronoUnit.HOURS),
        Address.createFromRawAddress('SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMQ'),
        [],
        PlainMessage.create('test-message'),
        NetworkType.PRIVATE_TEST,
    );

    const aggregateCompleteTransaction = AggregateTransaction.createComplete(
        Deadline.create(epochAdjustment),
        [transferTransaction.toAggregate(account.publicAccount)],
        NetworkType.PRIVATE_TEST,
        [],
    );

    const aggregateBondedTransaction = AggregateTransaction.createBonded(
        Deadline.create(epochAdjustment),
        [transferTransaction.toAggregate(account.publicAccount)],
        NetworkType.PRIVATE_TEST,
        [],
    );

    const hashLockTransaction = HashLockTransaction.create(
        Deadline.create(epochAdjustment),
        new Mosaic(new NamespaceId('cat.currency'), UInt64.fromUint(10 * Math.pow(10, NetworkCurrencyLocal.DIVISIBILITY))),
        UInt64.fromUint(10000),
        account.sign(aggregateBondedTransaction, generationHash),
        NetworkType.PRIVATE_TEST,
    );

    let transactionRepositoryMock: TransactionRepository;
    let mockedReceiptRepository: ReceiptRepository;
    let listener: IListener;

    before(() => {
        transactionRepositoryMock = mock();
        mockedReceiptRepository = mock();
        listener = mock();
    });

    it('announce when valid transaction', async () => {
        const signedTransaction = account.sign(transferTransaction, generationHash);

        const transactionAnnounceResponse = new TransactionAnnounceResponse('Some Message');

        when(transactionRepositoryMock.announce(deepEqual(signedTransaction))).thenReturn(observableOf(transactionAnnounceResponse));

        when(listener.confirmed(deepEqual(account.address), deepEqual(signedTransaction.hash))).thenReturn(
            observableOf(transferTransaction),
        );

        when(listener.status(deepEqual(account.address), signedTransaction.hash)).thenReturn(EMPTY);

        const service = new TransactionService(instance(transactionRepositoryMock), instance(mockedReceiptRepository));

        const announcedTransaction = service.announce(signedTransaction, instance(listener));

        const transaction = await announcedTransaction.toPromise();
        expect(transaction).to.be.equal(transferTransaction);
    });

    it('announce when status error', async () => {
        const signedTransaction = account.sign(transferTransaction, generationHash);

        const transactionAnnounceResponse = new TransactionAnnounceResponse('Some Message');

        when(transactionRepositoryMock.announce(deepEqual(signedTransaction))).thenReturn(observableOf(transactionAnnounceResponse));

        when(listener.confirmed(deepEqual(account.address), deepEqual(signedTransaction.hash))).thenReturn(EMPTY);
        const statusError = new TransactionStatusError(
            account.address,
            signedTransaction.hash,
            'Some Error',
            Deadline.create(epochAdjustment),
        );
        when(listener.status(deepEqual(account.address), signedTransaction.hash)).thenReturn(observableOf(statusError));

        const service = new TransactionService(instance(transactionRepositoryMock), instance(mockedReceiptRepository));

        const announcedTransaction = service.announce(signedTransaction, instance(listener));

        try {
            await announcedTransaction.toPromise();
        } catch (e) {
            expect(e.message).to.be.equal('Some Error');
        }
    });

    it('Basic announceAggregateBonded when valid transaction', async () => {
        const signedTransaction = account.sign(aggregateCompleteTransaction, generationHash);

        const transactionAnnounceResponse = new TransactionAnnounceResponse('Some Message');

        when(transactionRepositoryMock.announceAggregateBonded(deepEqual(signedTransaction))).thenReturn(
            observableOf(transactionAnnounceResponse),
        );

        when(listener.aggregateBondedAdded(deepEqual(account.address), deepEqual(signedTransaction.hash))).thenReturn(
            observableOf(aggregateCompleteTransaction),
        );
        when(listener.status(deepEqual(account.address), signedTransaction.hash)).thenReturn(EMPTY);

        const service = new TransactionService(instance(transactionRepositoryMock), instance(mockedReceiptRepository));

        const announcedTransaction = service.announceAggregateBonded(signedTransaction, instance(listener));

        const transaction = await announcedTransaction.toPromise();
        expect(transaction).to.be.equal(aggregateCompleteTransaction);
    });

    it('announceAggregateBonded when status error', async () => {
        const signedTransaction = account.sign(aggregateCompleteTransaction, generationHash);

        const transactionAnnounceResponse = new TransactionAnnounceResponse('Some Message');

        when(transactionRepositoryMock.announceAggregateBonded(deepEqual(signedTransaction))).thenReturn(
            observableOf(transactionAnnounceResponse),
        );

        when(listener.aggregateBondedAdded(deepEqual(account.address), deepEqual(signedTransaction.hash))).thenReturn(EMPTY);
        const statusError = new TransactionStatusError(
            account.address,
            signedTransaction.hash,
            'Some Error',
            Deadline.create(epochAdjustment),
        );
        when(listener.status(deepEqual(account.address), signedTransaction.hash)).thenReturn(observableOf(statusError));

        const service = new TransactionService(instance(transactionRepositoryMock), instance(mockedReceiptRepository));

        const announcedTransaction = service.announceAggregateBonded(signedTransaction, instance(listener));

        try {
            await announcedTransaction.toPromise();
        } catch (e) {
            expect(e.message).to.be.equal('Some Error');
        }
    });

    it('announceHashLockAggregateBonded when ok', async () => {
        const aggregateBondedSignedTransaction = account.sign(aggregateBondedTransaction, generationHash);

        const hashLockSignedTransaction = account.sign(hashLockTransaction, generationHash);

        const transactionAnnounceResponse = new TransactionAnnounceResponse('Some Message');

        when(transactionRepositoryMock.announceAggregateBonded(deepEqual(aggregateBondedSignedTransaction))).thenReturn(
            observableOf(transactionAnnounceResponse),
        );

        when(transactionRepositoryMock.announce(deepEqual(hashLockSignedTransaction))).thenReturn(
            observableOf(transactionAnnounceResponse),
        );

        when(listener.confirmed(deepEqual(account.address), deepEqual(hashLockSignedTransaction.hash))).thenReturn(
            observableOf(hashLockTransaction),
        );

        when(listener.aggregateBondedAdded(deepEqual(account.address), deepEqual(aggregateBondedSignedTransaction.hash))).thenReturn(
            observableOf(aggregateBondedTransaction),
        );

        when(listener.status(deepEqual(account.address), hashLockSignedTransaction.hash)).thenReturn(EMPTY);

        const service = new TransactionService(instance(transactionRepositoryMock), instance(mockedReceiptRepository));

        const announcedTransaction = service.announceHashLockAggregateBonded(
            hashLockSignedTransaction,
            aggregateBondedSignedTransaction,
            instance(listener),
        );

        const transaction = await announcedTransaction.toPromise();
        expect(transaction).to.be.equal(aggregateBondedTransaction);
    });
});
