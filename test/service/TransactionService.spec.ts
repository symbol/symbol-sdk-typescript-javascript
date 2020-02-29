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
import { ChronoUnit } from 'js-joda';
import { EMPTY, of as observableOf } from 'rxjs';
import { deepEqual, instance, mock, when } from 'ts-mockito';
import { IListener } from '../../src/infrastructure/IListener';
import { ReceiptRepository } from '../../src/infrastructure/ReceiptRepository';
import { TransactionRepository } from '../../src/infrastructure/TransactionRepository';

import { Account } from '../../src/model/account/Account';
import { Address } from '../../src/model/account/Address';
import { NetworkType } from '../../src/model/blockchain/NetworkType';
import { PlainMessage } from '../../src/model/message/PlainMessage';
import { AggregateTransaction } from '../../src/model/transaction/AggregateTransaction';
import { Deadline } from '../../src/model/transaction/Deadline';
import { TransactionAnnounceResponse } from '../../src/model/transaction/TransactionAnnounceResponse';
import { TransactionStatusError } from '../../src/model/transaction/TransactionStatusError';
import { TransferTransaction } from '../../src/model/transaction/TransferTransaction';
import { TransactionService } from '../../src/service/TransactionService';

/**
 * Unit test of TransactionService
 */
describe('TransactionService', () => {

    const account = Account.generateNewAccount(NetworkType.MIJIN_TEST);
    const transferTransaction = TransferTransaction.create(
        Deadline.create(1, ChronoUnit.HOURS),
        Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
        [],
        PlainMessage.create('test-message'),
        NetworkType.MIJIN_TEST,
    );

    const aggregateTransaction = AggregateTransaction.createComplete(
        Deadline.create(),
        [transferTransaction.toAggregate(account.publicAccount)],
        NetworkType.MIJIN_TEST,
        []);

    let transactionRepositoryMock: TransactionRepository;
    let mockedReceiptRepository: ReceiptRepository;
    let listener: IListener;

    before(() => {
        transactionRepositoryMock = mock();
        mockedReceiptRepository = mock();
        listener = mock();

    });

    it('announce when valid transaction', async () => {

        const signedTransaction = account.sign(transferTransaction, '82DB2528834C9926F0FCCE042466B24A266F5B685CB66D2869AF6648C043E950');

        const transactionAnnounceResponse = new TransactionAnnounceResponse('Some Message');

        when(transactionRepositoryMock.announce(deepEqual(signedTransaction))).thenReturn(observableOf(transactionAnnounceResponse));

        when(listener.confirmed(deepEqual(account.address), deepEqual(signedTransaction.hash)))
        .thenReturn(observableOf(transferTransaction));

        when(listener.status(deepEqual(account.address))).thenReturn(EMPTY);

        const service = new TransactionService(instance(transactionRepositoryMock), instance(mockedReceiptRepository));

        const announcedTransaction = service.announce(signedTransaction, instance(listener));

        const transaction = await announcedTransaction.toPromise();
        expect(transaction).to.be.equal(transferTransaction);

    });

    it('announce when status error', async () => {

        const signedTransaction = account.sign(transferTransaction, '82DB2528834C9926F0FCCE042466B24A266F5B685CB66D2869AF6648C043E950');

        const transactionAnnounceResponse = new TransactionAnnounceResponse('Some Message');

        when(transactionRepositoryMock.announce(deepEqual(signedTransaction))).thenReturn(observableOf(transactionAnnounceResponse));

        when(listener.confirmed(deepEqual(account.address), deepEqual(signedTransaction.hash))).thenReturn(EMPTY);
        const statusError = new TransactionStatusError(account.address, signedTransaction.hash, 'Some Error', Deadline.create());
        when(listener.status(deepEqual(account.address))).thenReturn(observableOf(statusError));

        const service = new TransactionService(instance(transactionRepositoryMock), instance(mockedReceiptRepository));

        const announcedTransaction = service.announce(signedTransaction, instance(listener));

        try {
            await announcedTransaction.toPromise();
        } catch (e) {
            expect(e.message).to.be.equal('Some Error');
        }

    });

    it('Basic announceAggregateBonded when valid transaction', async () => {

        const signedTransaction = account.sign(aggregateTransaction, '82DB2528834C9926F0FCCE042466B24A266F5B685CB66D2869AF6648C043E950');

        const transactionAnnounceResponse = new TransactionAnnounceResponse('Some Message');

        when(transactionRepositoryMock.announceAggregateBonded(deepEqual(signedTransaction)))
        .thenReturn(observableOf(transactionAnnounceResponse));

        when(listener.aggregateBondedAdded(deepEqual(account.address), deepEqual(signedTransaction.hash)))
        .thenReturn(observableOf(aggregateTransaction));
        when(listener.status(deepEqual(account.address))).thenReturn(EMPTY);

        const service = new TransactionService(instance(transactionRepositoryMock), instance(mockedReceiptRepository));

        const announcedTransaction = service.announceAggregateBonded(signedTransaction, instance(listener));

        const transaction = await announcedTransaction.toPromise();
        expect(transaction).to.be.equal(aggregateTransaction);
    });

    it('announceAggregateBonded when status error', async () => {

        const signedTransaction = account.sign(aggregateTransaction,
            '82DB2528834C9926F0FCCE042466B24A266F5B685CB66D2869AF6648C043E950');

        const transactionAnnounceResponse = new TransactionAnnounceResponse('Some Message');

        when(transactionRepositoryMock.announceAggregateBonded(deepEqual(signedTransaction)))
        .thenReturn(observableOf(transactionAnnounceResponse));

        when(listener.aggregateBondedAdded(deepEqual(account.address), deepEqual(signedTransaction.hash))).thenReturn(EMPTY);
        const statusError = new TransactionStatusError(account.address, signedTransaction.hash, 'Some Error', Deadline.create());
        when(listener.status(deepEqual(account.address))).thenReturn(observableOf(statusError));

        const service = new TransactionService(instance(transactionRepositoryMock), instance(mockedReceiptRepository));

        const announcedTransaction = service.announceAggregateBonded(signedTransaction, instance(listener));

        try {
            await announcedTransaction.toPromise();
        } catch (e) {
            expect(e.message).to.be.equal('Some Error');
        }

    });

});
