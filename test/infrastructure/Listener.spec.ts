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
import { NewBlock } from '../../src/model/blockchain/NewBlock';
import { PlainMessage } from '../../src/model/message/PlainMessage';
import { NamespaceId } from '../../src/model/namespace/NamespaceId';
import { NamespaceName } from '../../src/model/namespace/NamespaceName';
import { NetworkType } from '../../src/model/network/NetworkType';
import { Deadline } from '../../src/model/transaction/Deadline';
import { Transaction } from '../../src/model/transaction/Transaction';
import { TransactionStatusError } from '../../src/model/transaction/TransactionStatusError';
import { TransferTransaction } from '../../src/model/transaction/TransferTransaction';
import { UInt64 } from '../../src/model/UInt64';
import { FinalizedBlock } from '../../src/model/blockchain/FinalizedBlock';

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
        const listener = new Listener('http://localhost:3000/ws', namespaceRepo);
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

    describe('Invalid Channel', () => {
        it('should throw error if channel is not supported', () => {
            const errorEncodedAddress = '6026D27E1D0A26CA4E316F901E23E55C8711DB20DF300144';

            const errorAddress = Address.createFromEncoded(errorEncodedAddress);

            class WebSocketMock {
                constructor(public readonly url: string) {}

                send(payload: string): void {
                    expect(payload).to.be.eq(`{"subscribe":"status/${errorAddress.plain()}"}`);
                }
            }

            const statusInfoErrorDTO = {
                topic: 'invalidChannel',
                data: {
                    address: errorEncodedAddress,
                    deadline: '1010',
                    hash: 'transaction-hash',
                    code: 'error-message',
                },
            };
            const listener = new Listener('http://localhost:3000', namespaceRepo, WebSocketMock);

            listener.open();

            const reportedStatus: TransactionStatusError[] = [];

            listener.status(errorAddress).subscribe((error) => {
                reportedStatus.push(error);
            });

            expect(() => {
                listener.handleMessage(statusInfoErrorDTO, null);
            }).throw();
        });
    });

    describe('onStatusWhenAddressIsTheSame', () => {
        it('Should forward status', () => {
            const errorEncodedAddress = '6026D27E1D0A26CA4E316F901E23E55C8711DB20DF300144';

            const errorAddress = Address.createFromEncoded(errorEncodedAddress);

            class WebSocketMock {
                constructor(public readonly url: string) {}

                send(payload: string): void {
                    expect(payload).to.be.eq(`{"subscribe":"status/${errorAddress.plain()}"}`);
                }
            }

            const statusInfoErrorDTO = {
                topic: `status/${errorAddress.plain()}`,
                data: {
                    address: errorEncodedAddress,
                    deadline: '1010',
                    hash: 'transaction-hash',
                    code: 'error-message',
                },
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
            expect(transactionStatusError.hash).to.be.equal(statusInfoErrorDTO.data.hash);
            expect(transactionStatusError.code).to.be.equal(statusInfoErrorDTO.data.code);
            deepEqual(transactionStatusError.deadline.toDTO(), UInt64.fromNumericString(statusInfoErrorDTO.data.deadline).toDTO());
        });
    });

    describe('onConfirmed', () => {
        it('Should forward status', () => {
            const errorEncodedAddress = '6026D27E1D0A26CA4E316F901E23E55C8711DB20DF300144';

            const errorAddress = Address.createFromEncoded(errorEncodedAddress);

            class WebSocketMock {
                constructor(public readonly url: string) {}

                send(payload: string): void {
                    expect(payload).to.be.eq(`{"subscribe":"status/${errorAddress.plain()}"}`);
                }
            }

            const statusInfoErrorDTO = {
                topic: `status/${errorAddress.plain()}`,
                data: {
                    address: errorEncodedAddress,
                    deadline: '1010',
                    hash: 'transaction-hash',
                    code: 'error-message',
                },
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
            expect(transactionStatusError.hash).to.be.equal(statusInfoErrorDTO.data.hash);
            expect(transactionStatusError.code).to.be.equal(statusInfoErrorDTO.data.code);
            deepEqual(transactionStatusError.deadline.toDTO(), UInt64.fromNumericString(statusInfoErrorDTO.data.deadline).toDTO());
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
                transferTransactionDTO.meta = { height: '1', hash: hash };

                const reportedTransactions: Transaction[] = [];
                const listener = new Listener('http://localhost:3000', namespaceRepo, WebSocketMock);
                listener.open();
                subscriptionMethod(listener, subscribedAddress, hash).subscribe((confirmedTransaction) => {
                    reportedTransactions.push(confirmedTransaction);
                });

                listener.handleMessage(
                    {
                        topic: name.toString(),
                        data: { meta: transferTransactionDTO.meta, transaction: transferTransactionDTO.transaction },
                    },
                    null,
                );
                listener.handleMessage(
                    {
                        topic: name.toString(),
                        data: { meta: transferTransactionDTO.meta, transaction: transferTransactionDTO.transaction },
                    },
                    null,
                );

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
                transferTransactionDTO.meta = { height: '1', hash: hash };

                const reportedTransactions: Transaction[] = [];
                const listener = new Listener('http://localhost:3000', namespaceRepo, WebSocketMock);
                listener.open();
                subscriptionMethod(listener, subscribedAddress, hash2).subscribe((confirmedTransaction) => {
                    reportedTransactions.push(confirmedTransaction);
                });

                listener.handleMessage(
                    {
                        topic: name.toString(),
                        data: { meta: transferTransactionDTO.meta, transaction: transferTransactionDTO.transaction },
                    },
                    null,
                );
                listener.handleMessage(
                    {
                        topic: name.toString(),
                        data: { meta: transferTransactionDTO.meta, transaction: transferTransactionDTO.transaction },
                    },
                    null,
                );

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
                transferTransactionDTO.meta = { height: '1', hash: hash };

                const reportedTransactions: Transaction[] = [];
                const listener = new Listener('http://localhost:3000', namespaceRepo, WebSocketMock);
                listener.open();
                subscriptionMethod(listener, subscribedAddress).subscribe((confirmedTransaction) => {
                    reportedTransactions.push(confirmedTransaction);
                });

                listener.handleMessage(
                    {
                        topic: name.toString(),
                        data: { meta: transferTransactionDTO.meta, transaction: transferTransactionDTO.transaction },
                    },
                    null,
                );
                listener.handleMessage(
                    {
                        topic: name.toString(),
                        data: { meta: transferTransactionDTO.meta, transaction: transferTransactionDTO.transaction },
                    },
                    null,
                );
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
                transferTransactionDTO.meta = { height: '1', hash: hash };

                const reportedTransactions: Transaction[] = [];

                const listener = new Listener('http://localhost:3000', namespaceRepo, WebSocketMock);
                listener.open();
                subscriptionMethod(listener, subscribedAddress, hash).subscribe((unconfirmedTransaction) => {
                    reportedTransactions.push(unconfirmedTransaction);
                });

                listener.handleMessage(
                    {
                        topic: name.toString(),
                        data: { meta: transferTransactionDTO.meta, transaction: transferTransactionDTO.transaction },
                    },
                    null,
                );
                listener.handleMessage(
                    {
                        topic: name.toString(),
                        data: { meta: transferTransactionDTO.meta, transaction: transferTransactionDTO.transaction },
                    },
                    null,
                );

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
                transferTransactionDTO.meta = { height: '1', hash: hash };

                const reportedTransactions: Transaction[] = [];

                const listener = new Listener('http://localhost:3000', namespaceRepo, WebSocketMock);
                listener.open();
                subscriptionMethod(listener, subscribedAddress, hash).subscribe((confirmedTransaction) => {
                    reportedTransactions.push(confirmedTransaction);
                });

                listener.handleMessage(
                    {
                        topic: name.toString(),
                        data: { meta: transferTransactionDTO.meta, transaction: transferTransactionDTO.transaction },
                    },
                    null,
                );
                listener.handleMessage(
                    {
                        topic: name.toString(),
                        data: { meta: transferTransactionDTO.meta, transaction: transferTransactionDTO.transaction },
                    },
                    null,
                );

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
                const message = {
                    topic: `${name.toString()}/${subscribedAddress.plain()}`,
                    data: { meta: { height: '1', hash: hash } },
                };

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
                const message = {
                    topic: `${name.toString()}/${subscribedAddress.plain()}`,
                    data: { meta: { height: '1', hash: hash } },
                };

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
                const message = {
                    topic: `${name.toString()}/${subscribedAddress.plain()}`,
                    data: { meta: { height: '1', hash: hash } },
                };

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

    describe('newBlock', () => {
        it('Should forward newblock message', () => {
            class WebSocketMock {
                constructor(public readonly url: string) {}

                send(payload: string): void {
                    expect(payload).to.be.eq(`{"subscribe":"block"}`);
                }
            }

            const blockDTO = {
                topic: 'block',
                data: {
                    block: {
                        transactionsHash: '702090BA31CEF9E90C62BBDECC0CCCC0F88192B6625839382850357F70DD68A0',
                        receiptsHash: '702090BA31CEF9E90C62BBDECC0CCCC0F88192B6625839382850357F70DD68A0',
                        stateHash: '702090BA31CEF9E90C62BBDECC0CCCC0F88192B6625839382850357F70DD68A0',
                        difficulty: '1',
                        proofGamma: 'AC1A6E1D8DE5B17D2C6B1293F1CAD3829EEACF38D09311BB3C8E5A880092DE26',
                        proofScalar: 'AC1A6E1D8DE5B17D2C6B1293F1CAD3829EEACF38D09311BB3C8E5A880092DE26',
                        proofVerificationHash: 'AC1A6E1D8DE5B17D2C6B1293F1CAD382',
                        feeMultiplier: 1,
                        height: '100',
                        previousBlockHash: '0000000000000000000000000000000000000000000000000000000000000000',
                        signature:
                            '37351C8244AC166BE6664E3FA954E99A3239AC46E51E2B32CEA1C72DD0851100A7731868' +
                            'E932E1A9BEF8A27D48E1FFEE401E933EB801824373E7537E51733E0F',
                        signerPublicKey: 'B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF',
                        beneficiaryAddress: '6026D27E1D0A26CA4E316F901E23E55C8711DB20DF300144',
                        timestamp: '0',
                        type: 32768,
                        version: 1,
                        network: 144,
                        generationHash: '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6',
                        hash: '24E92B511B54EDB48A4850F9B42485FDD1A30589D92C775632DDDD71D7D1D691',
                    },
                    meta: {
                        generationHash: '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6',
                        hash: '24E92B511B54EDB48A4850F9B42485FDD1A30589D92C775632DDDD71D7D1D691',
                    },
                },
            };

            const listener = new Listener('http://localhost:3000', namespaceRepo, WebSocketMock);

            listener.open();

            const reportedStatus: NewBlock[] = [];

            listener.newBlock().subscribe((msg) => {
                reportedStatus.push(msg);
            });

            listener.handleMessage(blockDTO, null);

            expect(reportedStatus.length).to.be.equal(1);
            expect(reportedStatus[0].hash).to.be.equal(blockDTO.data.meta.hash);
            expect(reportedStatus[0].generationHash).to.be.equal(blockDTO.data.meta.generationHash);
            expect(reportedStatus[0].signature).to.be.equal(blockDTO.data.block.signature);
            expect(reportedStatus[0].signer.publicKey).to.be.equal(blockDTO.data.block.signerPublicKey);
            expect(reportedStatus[0].networkType).to.be.equal(blockDTO.data.block.network);
            expect(reportedStatus[0].version).to.be.equal(blockDTO.data.block.version);
            expect(reportedStatus[0].type).to.be.equal(blockDTO.data.block.type);
            deepEqual(reportedStatus[0].height.toString(), blockDTO.data.block.height);
            deepEqual(reportedStatus[0].timestamp.toString(), blockDTO.data.block.timestamp);
            deepEqual(reportedStatus[0].difficulty.toString(), blockDTO.data.block.difficulty);
            expect(reportedStatus[0].feeMultiplier).to.be.equal(blockDTO.data.block.feeMultiplier);
            expect(reportedStatus[0].previousBlockHash).to.be.equal(blockDTO.data.block.previousBlockHash);
            expect(reportedStatus[0].blockTransactionsHash).to.be.equal(blockDTO.data.block.transactionsHash);
            expect(reportedStatus[0].blockReceiptsHash).to.be.equal(blockDTO.data.block.receiptsHash);
            expect(reportedStatus[0].stateHash).to.be.equal(blockDTO.data.block.stateHash);
            expect(reportedStatus[0].beneficiaryAddress?.encoded()).to.be.equal(blockDTO.data.block.beneficiaryAddress);
            expect(reportedStatus[0].proofGamma).to.be.equal(blockDTO.data.block.proofGamma);
            expect(reportedStatus[0].proofScalar).to.be.equal(blockDTO.data.block.proofScalar);
            expect(reportedStatus[0].proofVerificationHash).to.be.equal(blockDTO.data.block.proofVerificationHash);
        });
    });

    describe('finalizedBlock', () => {
        it('Should forward finalizedBlock message', () => {
            class WebSocketMock {
                constructor(public readonly url: string) {}

                send(payload: string): void {
                    expect(payload).to.be.eq(`{"subscribe":"finalizedBlock"}`);
                }
            }

            const finalizedBlockDTO = {
                topic: 'finalizedBlock',
                data: {
                    height: '100',
                    hash: '24E92B511B54EDB48A4850F9B42485FDD1A30589D92C775632DDDD71D7D1D691',
                    finalizationPoint: '1',
                },
            };

            const listener = new Listener('http://localhost:3000', namespaceRepo, WebSocketMock);

            listener.open();

            const reportedStatus: FinalizedBlock[] = [];

            listener.finalizedBlock().subscribe((msg) => {
                reportedStatus.push(msg);
            });

            listener.handleMessage(finalizedBlockDTO, null);

            expect(reportedStatus.length).to.be.equal(1);
            expect(reportedStatus[0].hash).to.be.equal(finalizedBlockDTO.data.hash);
            deepEqual(reportedStatus[0].height.toString(), finalizedBlockDTO.data.height);
            deepEqual(reportedStatus[0].finalizationPoint.toString(), finalizedBlockDTO.data.finalizationPoint);
        });
    });
});
