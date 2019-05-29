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
import { assert, expect } from 'chai';
import { AccountHttp } from '../../src/infrastructure/AccountHttp';
import { NamespaceHttp } from '../../src/infrastructure/infrastructure';
import { Listener } from '../../src/infrastructure/Listener';
import { TransactionHttp } from '../../src/infrastructure/TransactionHttp';
import { Account } from '../../src/model/account/Account';
import { NetworkType } from '../../src/model/blockchain/NetworkType';
import { MosaicId } from '../../src/model/mosaic/MosaicId';
import { NetworkCurrencyMosaic } from '../../src/model/mosaic/NetworkCurrencyMosaic';
import { NamespaceId } from '../../src/model/namespace/NamespaceId';
import { AggregateTransaction } from '../../src/model/transaction/AggregateTransaction';
import { Deadline } from '../../src/model/transaction/Deadline';
import { ModifyMultisigAccountTransaction } from '../../src/model/transaction/ModifyMultisigAccountTransaction';
import { MultisigCosignatoryModification } from '../../src/model/transaction/MultisigCosignatoryModification';
import { MultisigCosignatoryModificationType } from '../../src/model/transaction/MultisigCosignatoryModificationType';
import { TransactionUtils } from './TransactionUtils';
import { TransferTransaction } from '../../src/model/transaction/TransferTransaction';
import { PlainMessage } from '../../src/model/transaction/PlainMessage';
import { Mosaic, UInt64 } from '../../src/model/model';

describe('Listener', () => {

    let accountHttp: AccountHttp;
    let apiUrl: string;
    let transactionHttp: TransactionHttp;
    let account: Account;
    let account2: Account;
    let cosignAccount1: Account;
    let cosignAccount2: Account;
    let cosignAccount3: Account;
    let cosignAccount4: Account;
    let multisigAccount: Account;
    let networkCurrencyMosaicId: MosaicId;
    let namespaceHttp: NamespaceHttp;
    let config;

    before((done) => {
        const path = require('path');
        require('fs').readFile(path.resolve(__dirname, '../conf/network.conf'), (err, data) => {
            if (err) {
                throw err;
            }
            const json = JSON.parse(data);
            config = json;
            apiUrl = json.apiUrl;
            account = Account.createFromPrivateKey(json.testAccount.privateKey, NetworkType.MIJIN_TEST);
            account2 = Account.createFromPrivateKey(json.testAccount2.privateKey, NetworkType.MIJIN_TEST);
            multisigAccount = Account.createFromPrivateKey(json.multisigAccount.privateKey, NetworkType.MIJIN_TEST);
            cosignAccount1 = Account.createFromPrivateKey(json.cosignatoryAccount.privateKey, NetworkType.MIJIN_TEST);
            cosignAccount2 = Account.createFromPrivateKey(json.cosignatory2Account.privateKey, NetworkType.MIJIN_TEST);
            cosignAccount3 = Account.createFromPrivateKey(json.cosignatory3Account.privateKey, NetworkType.MIJIN_TEST);
            cosignAccount4 = Account.createFromPrivateKey(json.cosignatory4Account.privateKey, NetworkType.MIJIN_TEST);
            transactionHttp = new TransactionHttp(json.apiUrl);
            accountHttp = new AccountHttp(json.apiUrl);
            namespaceHttp = new NamespaceHttp(json.apiUrl);
            done();
        });
    });

    describe('Confirmed', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('confirmedTransactionsGiven address signer', (done) => {
            listener.confirmed(account.address).subscribe((res) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            TransactionUtils.createAndAnnounce(account, account.address, transactionHttp);
        });
    });

    describe('Confirmed', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('confirmedTransactionsGiven address recipient', (done) => {
            const recipientAddress = account2.address;
            listener.confirmed(recipientAddress).subscribe((res) => {
                done();
            });
            listener.status(recipientAddress).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            TransactionUtils.createAndAnnounce(account, recipientAddress, transactionHttp);
        });
    });

    describe('UnConfirmed', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('unconfirmedTransactionsAdded', (done) => {
            listener.unconfirmedAdded(account.address).subscribe((res) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            TransactionUtils.createAndAnnounce(account, account.address, transactionHttp);
        });
    });

    describe('UnConfirmed', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('unconfirmedTransactionsRemoved', (done) => {
            listener.unconfirmedAdded(account.address).subscribe((res) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            TransactionUtils.createAndAnnounce(account, account.address, transactionHttp);
        });
    });
    describe('Get network currency mosaic id', () => {
        it('get mosaicId', (done) => {
            namespaceHttp.getLinkedMosaicId(new NamespaceId('cat.currency')).subscribe((networkMosaicId) => {
                networkCurrencyMosaicId = networkMosaicId;
                done();
            });
        });
    });

    describe('TransferTransaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });

        it('standalone', (done) => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(),
                cosignAccount1.address,
                [new Mosaic(networkCurrencyMosaicId, UInt64.fromUint(10 * Math.pow(10, NetworkCurrencyMosaic.DIVISIBILITY)))],
                PlainMessage.create('test-message'),
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = transferTransaction.signWith(account);

            listener.confirmed(account.address).subscribe((transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });

    describe('ModifyMultisigAccountTransaction - Create multisig account', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('ModifyMultisigAccountTransaction', (done) => {
            const modifyMultisigAccountTransaction = ModifyMultisigAccountTransaction.create(
                Deadline.create(),
                2,
                1,
                [   new MultisigCosignatoryModification(MultisigCosignatoryModificationType.Add, cosignAccount1.publicAccount),
                    new MultisigCosignatoryModification(MultisigCosignatoryModificationType.Add, cosignAccount2.publicAccount),
                    new MultisigCosignatoryModification(MultisigCosignatoryModificationType.Add, cosignAccount3.publicAccount),
                ],
                NetworkType.MIJIN_TEST,
            );

            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [modifyMultisigAccountTransaction.toAggregate(multisigAccount.publicAccount)],
                NetworkType.MIJIN_TEST,
                []);
            const signedTransaction = aggregateTransaction
                .signTransactionWithCosignatories(multisigAccount, [cosignAccount1, cosignAccount2, cosignAccount3]);

            listener.confirmed(multisigAccount.address).subscribe((transaction) => {
                done();
            });
            listener.status(multisigAccount.address).subscribe((error) => {
                console.log('Error:', error);
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });

    describe('Aggregate Bonded Transactions', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregateBondedTransactionsAdded', (done) => {
            listener.aggregateBondedAdded(account.address).subscribe((res) => {
                done();
            });
            listener.confirmed(account.address).subscribe((res) => {
                TransactionUtils.announceAggregateBoundedTransaction(signedAggregatedTx, transactionHttp);
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            const signedAggregatedTx = TransactionUtils.createSignedAggregatedBondTransaction(multisigAccount, account, account2.address);

            TransactionUtils.createHashLockTransactionAndAnnounce(signedAggregatedTx, account, networkCurrencyMosaicId, transactionHttp );
        });
    });
    describe('Aggregate Bonded Transactions', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregateBondedTransactionsRemoved', (done) => {
            listener.confirmed(cosignAccount1.address).subscribe((res) => {
                listener.aggregateBondedRemoved(cosignAccount1.address).subscribe((res) => {
                    done();
                });
                listener.aggregateBondedAdded(cosignAccount1.address).subscribe((res) => {
                    accountHttp.aggregateBondedTransactions(cosignAccount1.publicAccount).subscribe((transactions) => {
                        const transactionToCosign = transactions[0];
                        TransactionUtils.cosignTransaction(transactionToCosign, cosignAccount2, transactionHttp);
                    });
                });
                listener.status(cosignAccount1.address).subscribe((error) => {
                    console.log('Error:', error);
                    assert(false);
                    done();
                });
                TransactionUtils.announceAggregateBoundedTransaction(signedAggregatedTx, transactionHttp);
            });
            listener.status(cosignAccount1.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            const signedAggregatedTx =
                TransactionUtils.createSignedAggregatedBondTransaction(multisigAccount, cosignAccount1, account2.address);

            TransactionUtils.
                createHashLockTransactionAndAnnounce(signedAggregatedTx, cosignAccount1, networkCurrencyMosaicId, transactionHttp );
        });
    });

    describe('Aggregate Bonded Transactions', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('cosignatureAdded', (done) => {
            listener.cosignatureAdded(cosignAccount1.address).subscribe((res) => {
                done();
            });
            listener.aggregateBondedAdded(cosignAccount1.address).subscribe((res) => {
                accountHttp.aggregateBondedTransactions(cosignAccount1.publicAccount).subscribe((transactions) => {
                    const transactionToCosign = transactions[0];
                    TransactionUtils.cosignTransaction(transactionToCosign, cosignAccount2, transactionHttp);
                });
            });
            listener.confirmed(cosignAccount1.address).subscribe((res) => {
                TransactionUtils.announceAggregateBoundedTransaction(signedAggregatedTx, transactionHttp);
            });
            listener.status(cosignAccount1.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            const signedAggregatedTx =
                TransactionUtils.createSignedAggregatedBondTransaction(multisigAccount, cosignAccount1, account2.address);

            TransactionUtils.
                createHashLockTransactionAndAnnounce(signedAggregatedTx, cosignAccount1, networkCurrencyMosaicId, transactionHttp );
        });
    });

    describe('ModifyMultisigAccountTransaction - Restore multisig Accounts', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('Restore Multisig Account', (done) => {
            const removeCosigner1 = ModifyMultisigAccountTransaction.create(
                Deadline.create(),
                -1,
                0,
                [   new MultisigCosignatoryModification(MultisigCosignatoryModificationType.Remove, cosignAccount1.publicAccount),
                ],
                NetworkType.MIJIN_TEST,
            );
            const removeCosigner2 = ModifyMultisigAccountTransaction.create(
                Deadline.create(),
                0,
                0,
                [   new MultisigCosignatoryModification(MultisigCosignatoryModificationType.Remove, cosignAccount2.publicAccount),
                ],
                NetworkType.MIJIN_TEST,
            );

            const removeCosigner3 = ModifyMultisigAccountTransaction.create(
                Deadline.create(),
                -1,
                -1,
                [   new MultisigCosignatoryModification(MultisigCosignatoryModificationType.Remove, cosignAccount3.publicAccount),
                ],
                NetworkType.MIJIN_TEST,
            );

            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [removeCosigner1.toAggregate(multisigAccount.publicAccount),
                 removeCosigner2.toAggregate(multisigAccount.publicAccount),
                 removeCosigner3.toAggregate(multisigAccount.publicAccount)],
                NetworkType.MIJIN_TEST,
                []);
            const signedTransaction = aggregateTransaction
                .signTransactionWithCosignatories(cosignAccount1, [cosignAccount2, cosignAccount3]);

            listener.confirmed(cosignAccount1.address).subscribe((transaction) => {
                done();
            });
            listener.status(cosignAccount1.address).subscribe((error) => {
                console.log('Error:', error);
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });

    describe('Transactions Status', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('transactionStatusGiven', (done) => {
            listener.status(account.address).subscribe((error) => {
                expect(error.status).to.be.equal('Failure_Core_Insufficient_Balance');
                done();
            });
            const mosaics = [NetworkCurrencyMosaic.createRelative(1000000000000)];
            TransactionUtils.createAndAnnounce(account, account2.address, transactionHttp, mosaics);
        });
    });

    describe('New Block', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('newBlock', (done) => {
            listener.newBlock().subscribe((res) => {
                    done();
            });
            TransactionUtils.createAndAnnounce(account, account.address, transactionHttp);
        });
    });
});
