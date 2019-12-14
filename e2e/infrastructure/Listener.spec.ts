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
import { AccountRepository } from '../../src/infrastructure/AccountRepository';
import { Listener } from '../../src/infrastructure/Listener';
import { TransactionRepository } from '../../src/infrastructure/TransactionRepository';
import { Account } from '../../src/model/account/Account';
import { NetworkType } from '../../src/model/blockchain/NetworkType';
import { PlainMessage } from '../../src/model/message/PlainMessage';
import { Mosaic, UInt64 } from '../../src/model/model';
import { MosaicId } from '../../src/model/mosaic/MosaicId';
import { NetworkCurrencyMosaic } from '../../src/model/mosaic/NetworkCurrencyMosaic';
import { NamespaceId } from '../../src/model/namespace/NamespaceId';
import { AggregateTransaction } from '../../src/model/transaction/AggregateTransaction';
import { Deadline } from '../../src/model/transaction/Deadline';
import { MultisigAccountModificationTransaction } from '../../src/model/transaction/MultisigAccountModificationTransaction';
import { TransferTransaction } from '../../src/model/transaction/TransferTransaction';
import { TransactionUtils } from './TransactionUtils';
import { IntegrationTestHelper } from "./IntegrationTestHelper";
import { NamespaceRepository } from "../../src/infrastructure/NamespaceRepository";
import { filter } from "rxjs/operators";

describe('Listener', () => {

    let helper = new IntegrationTestHelper();
    let account: Account;
    let account2: Account;
    let multisigAccount: Account;
    let cosignAccount1: Account;
    let cosignAccount2: Account;
    let cosignAccount3: Account;
    let accountRepository: AccountRepository;
    let namespaceRepository: NamespaceRepository;
    let generationHash: string;
    let networkType: NetworkType;
    let networkCurrencyMosaicId: MosaicId;
    let transactionRepository: TransactionRepository;

    before(() => {
        return helper.start().then(() => {
            account = helper.account;
            account2 = helper.account2;
            multisigAccount = helper.multisigAccount;
            cosignAccount1 = helper.cosignAccount1;
            cosignAccount2 = helper.cosignAccount2;
            cosignAccount3 = helper.cosignAccount3;
            generationHash = helper.generationHash;
            networkType = helper.networkType;
            accountRepository = helper.repositoryFactory.createAccountRepository();
            namespaceRepository = helper.repositoryFactory.createNamespaceRepository();
            transactionRepository = helper.repositoryFactory.createTransactionRepository();
        });
    });
    before(() => {
        return helper.listener.open();
    });

    after(() => {
        helper.listener.close();
    });
    afterEach((done) => {
        // cold down
        setTimeout(done, 200);
    });
    describe('Confirmed', () => {

        it('confirmedTransactionsGiven address signer', () => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(),
                account.address,
                [],
                PlainMessage.create('test-message'),
                networkType, helper.maxFee
            );
            const signedTransaction = account.sign(transferTransaction, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('Confirmed', () => {

        it('confirmedTransactionsGiven address recipient', () => {
            const recipientAddress = account2.address;
            const transferTransaction = TransferTransaction.create(
                Deadline.create(),
                recipientAddress,
                [],
                PlainMessage.create('test-message'),
                networkType, helper.maxFee
            );
            const signedTransaction = account.sign(transferTransaction, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('UnConfirmed', () => {

        it('unconfirmedTransactionsAdded', (done) => {

            const transferTransaction = TransferTransaction.create(
                Deadline.create(),
                account.address,
                [],
                PlainMessage.create('test-message'),
                networkType, helper.maxFee
            );
            const signedTransaction = account.sign(transferTransaction, generationHash);
            helper.listener.unconfirmedAdded(account.address).pipe(filter((_) => _.transactionInfo!.hash === signedTransaction.hash)).subscribe(() => {
                done();
            });
            helper.announce(signedTransaction);
        });

        it('unconfirmedTransactionsRemoved', (done) => {

            const transferTransaction = TransferTransaction.create(
                Deadline.create(),
                account.address,
                [],
                PlainMessage.create('test-message'),
                networkType, helper.maxFee
            );
            const signedTransaction = account.sign(transferTransaction, generationHash);
            helper.listener.unconfirmedRemoved(account.address).pipe(filter(hash => hash === signedTransaction.hash)).subscribe(() => {
                done();
            });
            helper.announce(signedTransaction);
        });
    });
    describe('Get network currency mosaic id', () => {
        it('get mosaicId', (done) => {
            namespaceRepository.getLinkedMosaicId(new NamespaceId('cat.currency')).subscribe((networkMosaicId: MosaicId) => {
                networkCurrencyMosaicId = networkMosaicId;
                done();
            });
        });
    });

    describe('TransferTransaction', () => {


        it('standalone', () => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(),
                cosignAccount1.address,
                [new Mosaic(networkCurrencyMosaicId, UInt64.fromUint(10 * Math.pow(10, NetworkCurrencyMosaic.DIVISIBILITY)))],
                PlainMessage.create('test-message'),
                networkType, helper.maxFee
            );
            const signedTransaction = transferTransaction.signWith(account, generationHash);

            return helper.announce(signedTransaction);
        });
    });

    describe('MultisigAccountModificationTransaction - Create multisig account', () => {

        it('MultisigAccountModificationTransaction', () => {
            const modifyMultisigAccountTransaction = MultisigAccountModificationTransaction.create(
                Deadline.create(),
                2,
                1,
                [cosignAccount1.publicAccount,
                    cosignAccount2.publicAccount,
                    cosignAccount3.publicAccount,
                ],
                [],
                networkType, helper.maxFee
            );

            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [modifyMultisigAccountTransaction.toAggregate(multisigAccount.publicAccount)],
                networkType,
                [], helper.maxFee);
            const signedTransaction = aggregateTransaction
            .signTransactionWithCosignatories(multisigAccount, [cosignAccount1, cosignAccount2, cosignAccount3], generationHash);


            return helper.announce(signedTransaction);
        });
    });

    describe('Aggregate Bonded Transactions', () => {

        it('aggregateBondedTransactionsAdded', (done) => {
            helper.listener.aggregateBondedAdded(account.address).subscribe(() => {
                done();
            });
            helper.listener.confirmed(account.address).subscribe(() => {
                TransactionUtils.announceAggregateBoundedTransaction(signedAggregatedTx, transactionRepository);
            });
            helper.listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            const signedAggregatedTx = TransactionUtils.createSignedAggregatedBondTransaction(multisigAccount, account,
                account2.address, generationHash);

            TransactionUtils.createHashLockTransactionAndAnnounce(signedAggregatedTx, account, networkCurrencyMosaicId,
                transactionRepository, generationHash);
        });
    });
    describe('Aggregate Bonded Transactions', () => {
        it('aggregateBondedTransactionsRemoved', (done) => {
            helper.listener.confirmed(cosignAccount1.address).subscribe(() => {
                helper.listener.aggregateBondedRemoved(cosignAccount1.address).subscribe(() => {
                    done();
                });
                helper.listener.aggregateBondedAdded(cosignAccount1.address).subscribe(() => {
                    accountRepository.getAccountPartialTransactions(cosignAccount1.publicAccount.address).subscribe((transactions) => {
                        const transactionToCosign = transactions[0];
                        TransactionUtils.cosignTransaction(transactionToCosign, cosignAccount2, transactionRepository);
                    });
                });
                helper.listener.status(cosignAccount1.address).subscribe((error) => {
                    console.log('Error:', error);
                    assert(false);
                    done();
                });
                TransactionUtils.announceAggregateBoundedTransaction(signedAggregatedTx, transactionRepository);
            });
            helper.listener.status(cosignAccount1.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            const signedAggregatedTx =
                TransactionUtils.createSignedAggregatedBondTransaction(multisigAccount, cosignAccount1, account2.address, generationHash);

            TransactionUtils.createHashLockTransactionAndAnnounce(signedAggregatedTx, cosignAccount1,
                networkCurrencyMosaicId, transactionRepository, generationHash);
        });
    });

    describe('Aggregate Bonded Transactions', () => {

        it('cosignatureAdded', (done) => {
            helper.listener.cosignatureAdded(cosignAccount1.address).subscribe(() => {
                done();
            });
            helper.listener.aggregateBondedAdded(cosignAccount1.address).subscribe(() => {
                accountRepository.getAccountPartialTransactions(cosignAccount1.publicAccount.address).subscribe((transactions) => {
                    const transactionToCosign = transactions[0];
                    TransactionUtils.cosignTransaction(transactionToCosign, cosignAccount2, transactionRepository);
                });
            });
            helper.listener.confirmed(cosignAccount1.address).subscribe(() => {
                TransactionUtils.announceAggregateBoundedTransaction(signedAggregatedTx, transactionRepository);
            });
            helper.listener.status(cosignAccount1.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            const signedAggregatedTx =
                TransactionUtils.createSignedAggregatedBondTransaction(multisigAccount, cosignAccount1, account2.address, generationHash);

            TransactionUtils.createHashLockTransactionAndAnnounce(signedAggregatedTx, cosignAccount1,
                networkCurrencyMosaicId, transactionRepository, generationHash);
        });
    });

    describe('MultisigAccountModificationTransaction - Restore multisig Accounts', () => {

        it('Restore Multisig Account', () => {
            const removeCosigner1 = MultisigAccountModificationTransaction.create(
                Deadline.create(),
                -1,
                0,
                [],
                [cosignAccount1.publicAccount],
                networkType,
            );
            const removeCosigner2 = MultisigAccountModificationTransaction.create(
                Deadline.create(),
                0,
                0,
                [],
                [cosignAccount2.publicAccount],
                networkType,
            );

            const removeCosigner3 = MultisigAccountModificationTransaction.create(
                Deadline.create(),
                -1,
                -1,
                [],
                [cosignAccount3.publicAccount],
                networkType,
            );

            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [removeCosigner1.toAggregate(multisigAccount.publicAccount),
                    removeCosigner2.toAggregate(multisigAccount.publicAccount),
                    removeCosigner3.toAggregate(multisigAccount.publicAccount)],
                networkType,
                []);
            const signedTransaction = aggregateTransaction
            .signTransactionWithCosignatories(cosignAccount1, [cosignAccount2, cosignAccount3], generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('Transactions Status', () => {

        it('transactionStatusGiven', (done) => {
            helper.listener.status(account.address).subscribe((error) => {
                expect(error.status).to.be.equal('Failure_Core_Insufficient_Balance');
                done();
            });
            const mosaics = [NetworkCurrencyMosaic.createRelative(1000000000000)];
            TransactionUtils.createAndAnnounce(account, account2.address, transactionRepository, mosaics, generationHash);
        });
    });

    describe('New Block', () => {

        it('newBlock', (done) => {
            helper.listener.newBlock().subscribe(() => {
                done();
            });
            TransactionUtils.createAndAnnounce(account, account.address, transactionRepository, undefined, generationHash);
        });
    });
});
