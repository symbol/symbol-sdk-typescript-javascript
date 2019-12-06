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

import { expect } from 'chai';
import { Listener } from '../../src/infrastructure/Listener';
import { NamespaceHttp } from '../../src/infrastructure/NamespaceHttp';
import { TransactionHttp } from '../../src/infrastructure/TransactionHttp';
import { Account } from '../../src/model/account/Account';
import { Address } from '../../src/model/account/Address';
import { NetworkType } from '../../src/model/blockchain/NetworkType';
import { PlainMessage } from '../../src/model/message/PlainMessage';
import { Mosaic } from '../../src/model/mosaic/Mosaic';
import { MosaicId } from '../../src/model/mosaic/MosaicId';
import { NetworkCurrencyMosaic } from '../../src/model/mosaic/NetworkCurrencyMosaic';
import { NamespaceId } from '../../src/model/namespace/NamespaceId';
import { AggregateTransaction } from '../../src/model/transaction/AggregateTransaction';
import { Deadline } from '../../src/model/transaction/Deadline';
import { LockFundsTransaction } from '../../src/model/transaction/LockFundsTransaction';
import { MultisigAccountModificationTransaction } from '../../src/model/transaction/MultisigAccountModificationTransaction';
import { TransactionType } from '../../src/model/transaction/TransactionType';
import { TransferTransaction } from '../../src/model/transaction/TransferTransaction';
import { UInt64 } from '../../src/model/UInt64';
import { TransactionService } from '../../src/service/TransactionService';
import { TransactionUtils } from '../infrastructure/TransactionUtils';

describe('TransactionService', () => {
    let account: Account;
    let account2: Account;
    let multisigAccount: Account;
    let cosignAccount1: Account;
    let cosignAccount2: Account;
    let cosignAccount3: Account;
    let networkCurrencyMosaicId: MosaicId;
    let url: string;
    let generationHash: string;
    let transactionHttp: TransactionHttp;
    let transactionService: TransactionService;
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
            account = Account.createFromPrivateKey(json.testAccount.privateKey, NetworkType.MIJIN_TEST);
            account2 = Account.createFromPrivateKey(json.testAccount2.privateKey, NetworkType.MIJIN_TEST);
            multisigAccount = Account.createFromPrivateKey(json.multisigAccount.privateKey, NetworkType.MIJIN_TEST);
            cosignAccount1 = Account.createFromPrivateKey(json.cosignatoryAccount.privateKey, NetworkType.MIJIN_TEST);
            cosignAccount2 = Account.createFromPrivateKey(json.cosignatory2Account.privateKey, NetworkType.MIJIN_TEST);
            cosignAccount3 = Account.createFromPrivateKey(json.cosignatory3Account.privateKey, NetworkType.MIJIN_TEST);
            url = json.apiUrl;
            generationHash = json.generationHash;
            transactionHttp = new TransactionHttp(url);
            namespaceHttp = new NamespaceHttp(url);
            transactionService = new TransactionService(url);
            done();
        });
    });

    /**
     * =========================
     * Setup test data
     * =========================
     */
    describe('Get network currency mosaic id', () => {
        it('get mosaicId', (done) => {
            namespaceHttp.getLinkedMosaicId(new NamespaceId('cat.currency')).subscribe((networkMosaicId) => {
                networkCurrencyMosaicId = networkMosaicId;
                done();
            });
        });
    });

    describe('Setup test multisig account', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('Announce MultisigAccountModificationTransaction', (done) => {
            const modifyMultisigAccountTransaction = MultisigAccountModificationTransaction.create(
                Deadline.create(),
                2,
                1,
                [
                    cosignAccount1.publicAccount,
                    cosignAccount2.publicAccount,
                    cosignAccount3.publicAccount,
                ],
                [],
                NetworkType.MIJIN_TEST,
            );

            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [modifyMultisigAccountTransaction.toAggregate(multisigAccount.publicAccount)],
                NetworkType.MIJIN_TEST,
                []);
            const signedTransaction = aggregateTransaction
                .signTransactionWithCosignatories(multisigAccount, [cosignAccount1, cosignAccount2, cosignAccount3], generationHash);

            listener.confirmed(multisigAccount.address).subscribe(() => {
                done();
            });
            listener.status(multisigAccount.address).subscribe((error) => {
                console.log('Error:', error);
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });

    /**
     * =========================
     * Test
     * =========================
     */

    describe('should announce transaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('announce', (done) => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(),
                account2.address,
                [
                    NetworkCurrencyMosaic.createAbsolute(1),
                ],
                PlainMessage.create('test-message'),
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = transferTransaction.signWith(account, generationHash);
            transactionService.announce(signedTransaction, listener).subscribe((tx: TransferTransaction) => {
                expect(tx.signer!.publicKey).to.be.equal(account.publicKey);
                expect((tx.recipientAddress as Address).equals(account2.address)).to.be.true;
                expect(tx.message.payload).to.be.equal('test-message');
                done();
            });
        });
    });

    describe('should announce aggregate bonded with hashlock', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('announce', (done) => {
            const signedAggregatedTransaction =
                TransactionUtils.createSignedAggregatedBondTransaction(multisigAccount, account, account2.address, generationHash);
            const lockFundsTransaction = LockFundsTransaction.create(
                Deadline.create(),
                new Mosaic(networkCurrencyMosaicId, UInt64.fromUint(10 * Math.pow(10, NetworkCurrencyMosaic.DIVISIBILITY))),
                UInt64.fromUint(1000),
                signedAggregatedTransaction,
                NetworkType.MIJIN_TEST,
            );
            const signedLockFundsTransaction = lockFundsTransaction.signWith(account, generationHash);
            transactionService
                .announceHashLockAggregateBonded(signedLockFundsTransaction, signedAggregatedTransaction, listener).subscribe((tx) => {
                expect(tx.signer!.publicKey).to.be.equal(account.publicKey);
                expect(tx.type).to.be.equal(TransactionType.AGGREGATE_BONDED);
                done();
            });
        });
    });

    describe('should announce aggregate bonded transaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('announce', (done) => {
            const signedAggregatedTransaction =
                TransactionUtils.createSignedAggregatedBondTransaction(multisigAccount, account, account2.address, generationHash);
            const lockFundsTransaction = LockFundsTransaction.create(
                Deadline.create(),
                new Mosaic(networkCurrencyMosaicId, UInt64.fromUint(10 * Math.pow(10, NetworkCurrencyMosaic.DIVISIBILITY))),
                UInt64.fromUint(1000),
                signedAggregatedTransaction,
                NetworkType.MIJIN_TEST,
            );
            const signedLockFundsTransaction = lockFundsTransaction.signWith(account, generationHash);
            transactionService.announce(signedLockFundsTransaction, listener).subscribe(() => {
                transactionService.announceAggregateBonded(signedAggregatedTransaction, listener).subscribe((tx) => {
                    expect(tx.signer!.publicKey).to.be.equal(account.publicKey);
                    expect(tx.type).to.be.equal(TransactionType.AGGREGATE_BONDED);
                    done();
                });
            });
        });
    });

    /**
     * =========================
     * House Keeping
     * =========================
     */

    describe('Restore test multisig Accounts', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('Announce MultisigAccountModificationTransaction', (done) => {
            const removeCosigner1 = MultisigAccountModificationTransaction.create(
                Deadline.create(),
                -1,
                0,
                [],
                [   cosignAccount1.publicAccount,
                ],
                NetworkType.MIJIN_TEST,
            );
            const removeCosigner2 = MultisigAccountModificationTransaction.create(
                Deadline.create(),
                0,
                0,
                [],
                [
                    cosignAccount2.publicAccount,
                ],
                NetworkType.MIJIN_TEST,
            );

            const removeCosigner3 = MultisigAccountModificationTransaction.create(
                Deadline.create(),
                -1,
                -1,
                [],
                [
                    cosignAccount3.publicAccount,
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
                .signTransactionWithCosignatories(cosignAccount1, [cosignAccount2, cosignAccount3], generationHash);

            listener.confirmed(cosignAccount1.address).subscribe(() => {
                done();
            });
            listener.status(cosignAccount1.address).subscribe((error) => {
                console.log('Error:', error);
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });
});
