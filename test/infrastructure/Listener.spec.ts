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

import { deepEqual } from 'assert';
import { expect } from 'chai';
import { Observable, of as observableOf } from 'rxjs';
import { deepEqual as deepEqualParam, instance, mock, verify, when } from 'ts-mockito';
import { Listener, ListenerChannelName } from '../../src/infrastructure/Listener';
import { NamespaceRepository } from '../../src/infrastructure/NamespaceRepository';
import { Account } from '../../src/model/account/Account';
import { AccountNames } from '../../src/model/account/AccountNames';
import { Address } from '../../src/model/account/Address';
import { Deadline, NamespaceId, NamespaceName, PlainMessage, Transaction, TransferTransaction } from '../../src/model/model';
import { NetworkType } from '../../src/model/network/NetworkType';
import { TransactionStatusError } from '../../src/model/transaction/TransactionStatusError';
import { UInt64 } from '../../src/model/UInt64';

describe('Listener', () => {
    const account = Account.createFromPrivateKey(
        '26b64cb10f005e5988a36744ca19e20d835ccc7c105aaa5f3b212da593180930',
        NetworkType.MIJIN_TEST,
    );

    let namespaceRepoMock: NamespaceRepository;
    let namespaceRepo: NamespaceRepository;
    beforeEach(() => {
        namespaceRepoMock = mock();
        namespaceRepo = instance(namespaceRepoMock);
    });

    it('should createComplete a WebSocket instance given url parameter', () => {
        const listener = new Listener('http://localhost:3000', namespaceRepo);
        expect('http://localhost:3000/ws').to.be.equal(listener.url);
        listener.close();
    });

    describe('isOpen', () => {
        it('should return false when listener is created and not opened', () => {
            const listener = new Listener('http://localhost:3000', namespaceRepo);
            expect(listener.isOpen()).to.be.false;
            listener.close();
        });
    });

    describe('onStatusWhenAddressIsTheSame', () => {
        it('Should forward status', () => {
            const errorEncodedAddress = '906415867F121D037AF447E711B0F5E4D52EBBF066D96860EB';

            const errorAddress = Address.createFromEncoded(errorEncodedAddress);

            class WebSocketMock {
                constructor(public readonly url: string) {}

                send(payload: string): void {
                    expect(payload).to.be.eq(`{"subscribe":"status/${errorAddress.plain()}"}`);
                }
            }

            const statusInfoErrorDTO = {
                address: errorEncodedAddress,
                deadline: '1010',
                hash: 'transaction-hash',
                code: 'error-message',
            };

            const listener = new Listener('http://localhost:3000', namespaceRepo, WebSocketMock);

            listener.open();

            const reportedStatus: TransactionStatusError[] = [];

            listener.status(errorAddress).subscribe((error) => {
                reportedStatus.push(error);
            });

            listener.handleMessage(statusInfoErrorDTO, null);

            expect(reportedStatus.length).to.be.equal(1);
            const transactionStatusError = reportedStatus[0];
            expect(transactionStatusError.address).to.deep.equal(errorAddress);
            expect(transactionStatusError.hash).to.be.equal(statusInfoErrorDTO.hash);
            expect(transactionStatusError.code).to.be.equal(statusInfoErrorDTO.code);
            deepEqual(transactionStatusError.deadline.toDTO(), UInt64.fromNumericString(statusInfoErrorDTO.deadline).toDTO());
        });
    });

    describe('onConfirmed', () => {
        it('Should forward status', () => {
            const errorEncodedAddress = '906415867F121D037AF447E711B0F5E4D52EBBF066D96860EB';

            const errorAddress = Address.createFromEncoded(errorEncodedAddress);

            class WebSocketMock {
                constructor(public readonly url: string) {}

                send(payload: string): void {
                    expect(payload).to.be.eq(`{"subscribe":"status/${errorAddress.plain()}"}`);
                }
            }

            const statusInfoErrorDTO = {
                address: errorEncodedAddress,
                deadline: '1010',
                hash: 'transaction-hash',
                code: 'error-message',
            };

            const listener = new Listener('http://localhost:3000', namespaceRepo, WebSocketMock);

            listener.open();

            const reportedStatus = new Array<TransactionStatusError>();

            listener.status(errorAddress).subscribe((error) => {
                reportedStatus.push(error);
            });

            listener.handleMessage(statusInfoErrorDTO, null);

            expect(reportedStatus.length).to.be.equal(1);
            const transactionStatusError = reportedStatus[0];
            expect(transactionStatusError.address).to.deep.equal(errorAddress);
            expect(transactionStatusError.hash).to.be.equal(statusInfoErrorDTO.hash);
            expect(transactionStatusError.code).to.be.equal(statusInfoErrorDTO.code);
            deepEqual(transactionStatusError.deadline.toDTO(), UInt64.fromNumericString(statusInfoErrorDTO.deadline).toDTO());
        });
    });

    describe('onerror', () => {
        it('should reject because of wrong server url', async () => {
            const listener = new Listener('https://notcorrecturl:0000', namespaceRepo);
            await listener
                .open()
                .then(() => {
                    throw new Error('This should not be called when expecting error');
                })
                .catch((error) => {
                    expect(error.message.toString()).not.to.be.equal('');
                });
        });
    });

    [ListenerChannelName.confirmedAdded, ListenerChannelName.partialAdded, ListenerChannelName.unconfirmedAdded].forEach((name) => {
        const subscribedAddress = account.address;
        class WebSocketMock {
            constructor(public readonly url: string) {}
            send(payload: string): void {
                expect(payload).to.be.eq(`{"subscribe":"${name}/${subscribedAddress.plain()}"}`);
            }
        }

        const subscriptionMethod = (listener: Listener, address: Address, hash?: string): Observable<Transaction> => {
            switch (name) {
                case ListenerChannelName.confirmedAdded: {
                    return listener.confirmed(address, hash);
                }
                case ListenerChannelName.unconfirmedAdded: {
                    return listener.unconfirmedAdded(address, hash);
                }
                default: {
                    return listener.aggregateBondedAdded(address, hash);
                }
            }
        };

        describe(`${name} transaction subscription`, () => {
            it('Using alias', () => {
                const alias = new NamespaceId('test');
                when(namespaceRepoMock.getAccountsNames(deepEqualParam([subscribedAddress]))).thenReturn(
                    observableOf([new AccountNames(subscribedAddress, [new NamespaceName(alias, 'test')])]),
                );

                const transferTransaction = TransferTransaction.create(
                    Deadline.create(),
                    alias,
                    [],
                    PlainMessage.create('test-message'),
                    NetworkType.MIJIN_TEST,
                );
                const transferTransactionDTO = transferTransaction.toJSON();
                const hash = 'abc';
                transferTransactionDTO.meta = { channelName: name, height: '1', hash: hash };

                const reportedTransactions: Transaction[] = [];
                const listener = new Listener('http://localhost:3000', namespaceRepo, WebSocketMock);
                listener.open();
                subscriptionMethod(listener, subscribedAddress, hash).subscribe((confirmedTransaction) => {
                    reportedTransactions.push(confirmedTransaction);
                });

                listener.handleMessage(transferTransactionDTO, null);
                listener.handleMessage(transferTransactionDTO, null);

                verify(namespaceRepoMock.getAccountsNames(deepEqualParam([subscribedAddress]))).times(2);
                expect(reportedTransactions.length).to.be.equal(2);
            });

            it('Using invalid hash', () => {
                const subscribedAddress = account.address;

                const alias = new NamespaceId('test');
                when(namespaceRepoMock.getAccountsNames(deepEqualParam([account.address]))).thenReturn(
                    observableOf([new AccountNames(account.address, [new NamespaceName(alias, 'test')])]),
                );
                const transferTransaction = TransferTransaction.create(
                    Deadline.create(),
                    alias,
                    [],
                    PlainMessage.create('test-message'),
                    NetworkType.MIJIN_TEST,
                );
                const transferTransactionDTO = transferTransaction.toJSON();
                const hash = 'abc';
                const hash2 = 'abc2';
                transferTransactionDTO.meta = { channelName: name, height: '1', hash: hash };

                const reportedTransactions: Transaction[] = [];
                const listener = new Listener('http://localhost:3000', namespaceRepo, WebSocketMock);
                listener.open();
                subscriptionMethod(listener, subscribedAddress, hash2).subscribe((confirmedTransaction) => {
                    reportedTransactions.push(confirmedTransaction);
                });

                listener.handleMessage(transferTransactionDTO, null);
                listener.handleMessage(transferTransactionDTO, null);

                expect(reportedTransactions.length).to.be.equal(0);
                verify(namespaceRepoMock.getAccountsNames(deepEqualParam([account.address]))).times(0);
            });

            it('Using invalid no hash', () => {
                const subscribedAddress = account.address;

                const alias = new NamespaceId('test');
                when(namespaceRepoMock.getAccountsNames(deepEqualParam([account.address]))).thenReturn(
                    observableOf([new AccountNames(account.address, [new NamespaceName(alias, 'test')])]),
                );
                const transferTransaction = TransferTransaction.create(
                    Deadline.create(),
                    alias,
                    [],
                    PlainMessage.create('test-message'),
                    NetworkType.MIJIN_TEST,
                );
                const transferTransactionDTO = transferTransaction.toJSON();
                const hash = 'abc';
                transferTransactionDTO.meta = { channelName: name, height: '1', hash: hash };

                const reportedTransactions: Transaction[] = [];
                const listener = new Listener('http://localhost:3000', namespaceRepo, WebSocketMock);
                listener.open();
                subscriptionMethod(listener, subscribedAddress).subscribe((confirmedTransaction) => {
                    reportedTransactions.push(confirmedTransaction);
                });

                listener.handleMessage(transferTransactionDTO, null);
                listener.handleMessage(transferTransactionDTO, null);

                expect(reportedTransactions.length).to.be.equal(2);
                verify(namespaceRepoMock.getAccountsNames(deepEqualParam([account.address]))).times(2);
            });

            it('Using alias invalid', () => {
                const subscribedAddress = account.address;

                const alias = new NamespaceId('test');
                const alias2 = new NamespaceId('test2');
                when(namespaceRepoMock.getAccountsNames(deepEqualParam([account.address]))).thenReturn(
                    observableOf([new AccountNames(account.address, [new NamespaceName(alias, 'test')])]),
                );
                const transferTransaction = TransferTransaction.create(
                    Deadline.create(),
                    alias2,
                    [],
                    PlainMessage.create('test-message'),
                    NetworkType.MIJIN_TEST,
                );
                const transferTransactionDTO = transferTransaction.toJSON();
                const hash = 'abc';
                transferTransactionDTO.meta = { channelName: name, height: '1', hash: hash };

                const reportedTransactions: Transaction[] = [];

                const listener = new Listener('http://localhost:3000', namespaceRepo, WebSocketMock);
                listener.open();
                subscriptionMethod(listener, subscribedAddress, hash).subscribe((unconfirmedTransaction) => {
                    reportedTransactions.push(unconfirmedTransaction);
                });

                listener.handleMessage(transferTransactionDTO, null);
                listener.handleMessage(transferTransactionDTO, null);

                expect(reportedTransactions.length).to.be.equal(0);
                verify(namespaceRepoMock.getAccountsNames(deepEqualParam([account.address]))).times(2);
            });

            it('Using signer', () => {
                const subscribedAddress = account.address;

                const alias = new NamespaceId('test');
                const alias2 = new NamespaceId('test2');
                when(namespaceRepoMock.getAccountsNames(deepEqualParam([account.address]))).thenReturn(
                    observableOf([new AccountNames(account.address, [new NamespaceName(alias, 'test')])]),
                );
                const transferTransaction = TransferTransaction.create(
                    Deadline.create(),
                    alias2,
                    [],
                    PlainMessage.create('test-message'),
                    NetworkType.MIJIN_TEST,
                    undefined,
                    undefined,
                    account.publicAccount,
                );
                const transferTransactionDTO = transferTransaction.toJSON();
                const hash = 'abc';
                transferTransactionDTO.meta = { channelName: name, height: '1', hash: hash };

                const reportedTransactions: Transaction[] = [];

                const listener = new Listener('http://localhost:3000', namespaceRepo, WebSocketMock);
                listener.open();
                subscriptionMethod(listener, subscribedAddress, hash).subscribe((confirmedTransaction) => {
                    reportedTransactions.push(confirmedTransaction);
                });

                listener.handleMessage(transferTransactionDTO, null);
                listener.handleMessage(transferTransactionDTO, null);

                expect(reportedTransactions.length).to.be.equal(2);
                //There is no need for the extra call, it finish when the signer is finer
                verify(namespaceRepoMock.getAccountsNames(deepEqualParam([account.address]))).times(0);
            });
        });
    });

    [ListenerChannelName.unconfirmedRemoved, ListenerChannelName.partialRemoved].forEach((name) => {
        const subscribedAddress = account.address;
        class WebSocketMock {
            constructor(public readonly url: string) {}
            send(payload: string): void {
                expect(payload).to.be.eq(`{"subscribe":"${name}/${subscribedAddress.plain()}"}`);
            }
        }

        const subscriptionMethod = (listener: Listener, address: Address, hash?: string): Observable<string> => {
            switch (name) {
                case ListenerChannelName.unconfirmedRemoved: {
                    return listener.unconfirmedRemoved(address, hash);
                }
                default: {
                    return listener.aggregateBondedRemoved(address, hash);
                }
            }
        };

        describe(`${name} transaction hash subscription`, () => {
            it('Using valid hash', () => {
                const hash = 'abc';
                const message = { meta: { channelName: name, height: '1', hash: hash } };

                const reportedTransactions: string[] = [];
                const listener = new Listener('http://localhost:3000', namespaceRepo, WebSocketMock);
                listener.open();
                subscriptionMethod(listener, subscribedAddress, hash).subscribe((confirmedHash) => {
                    reportedTransactions.push(confirmedHash);
                });

                listener.handleMessage(message, null);
                listener.handleMessage(message, null);

                expect(reportedTransactions.length).to.be.equal(2);
            });

            it('Using valid no hash', () => {
                const hash = 'abc';
                const message = { meta: { channelName: name, height: '1', hash: hash } };

                const reportedTransactions: string[] = [];
                const listener = new Listener('http://localhost:3000', namespaceRepo, WebSocketMock);
                listener.open();
                subscriptionMethod(listener, subscribedAddress).subscribe((confirmedHash) => {
                    reportedTransactions.push(confirmedHash);
                });

                listener.handleMessage(message, null);
                listener.handleMessage(message, null);

                expect(reportedTransactions.length).to.be.equal(2);
            });

            it('Using invalid hash', () => {
                const hash = 'abc';
                const message = { meta: { channelName: name, height: '1', hash: hash } };

                const reportedTransactions: string[] = [];
                const listener = new Listener('http://localhost:3000', namespaceRepo, WebSocketMock);
                listener.open();
                subscriptionMethod(listener, subscribedAddress, 'invalid!').subscribe((confirmedHash) => {
                    reportedTransactions.push(confirmedHash);
                });

                listener.handleMessage(message, null);
                listener.handleMessage(message, null);

                expect(reportedTransactions.length).to.be.equal(0);
            });
        });
    });
});
