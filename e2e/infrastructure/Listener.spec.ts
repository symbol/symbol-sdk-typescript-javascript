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
import { ChronoUnit } from '@js-joda/core';
import { assert, expect } from 'chai';
import { filter, mergeMap } from 'rxjs/operators';
import { TransactionSearchCriteria } from '../../src/infrastructure/searchCriteria/TransactionSearchCriteria';
import { TransactionGroup } from '../../src/infrastructure/TransactionGroup';
import { TransactionRepository } from '../../src/infrastructure/TransactionRepository';
import { Account, UnresolvedAddress } from '../../src/model/account';
import { PlainMessage } from '../../src/model/message/PlainMessage';
import { Currency } from '../../src/model/mosaic';
import { NamespaceId } from '../../src/model/namespace';
import { NetworkType } from '../../src/model/network/NetworkType';
import { AggregateTransaction } from '../../src/model/transaction/AggregateTransaction';
import { CosignatureTransaction } from '../../src/model/transaction/CosignatureTransaction';
import { Deadline } from '../../src/model/transaction/Deadline';
import { LockFundsTransaction } from '../../src/model/transaction/LockFundsTransaction';
import { MultisigAccountModificationTransaction } from '../../src/model/transaction/MultisigAccountModificationTransaction';
import { SignedTransaction } from '../../src/model/transaction/SignedTransaction';
import { TransferTransaction } from '../../src/model/transaction/TransferTransaction';
import { UInt64 } from '../../src/model/UInt64';
import { IntegrationTestHelper } from './IntegrationTestHelper';

describe('Listener', () => {
    const helper = new IntegrationTestHelper();
    let account: Account;
    let account2: Account;
    let multisigAccount: Account;
    let cosignAccount1: Account;
    let cosignAccount2: Account;
    let cosignAccount3: Account;
    let generationHash: string;
    let networkType: NetworkType;
    let transactionRepository: TransactionRepository;
    const unresolvedAddress = new NamespaceId('address');

    before(() => {
        return helper.start({ openListener: true }).then(() => {
            account = helper.account;
            account2 = helper.account2;
            multisigAccount = helper.multisigAccount;
            cosignAccount1 = helper.cosignAccount1;
            cosignAccount2 = helper.cosignAccount2;
            cosignAccount3 = helper.cosignAccount3;
            generationHash = helper.generationHash;
            networkType = helper.networkType;
            transactionRepository = helper.repositoryFactory.createTransactionRepository();
        });
    });

    after(() => {
        return helper.close();
    });
    afterEach((done) => {
        // cold down
        setTimeout(done, 200);
    });

    const createSignedAggregatedBondTransaction = (
        aggregatedTo: Account,
        signer: Account,
        recipient: UnresolvedAddress,
    ): SignedTransaction => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(helper.epochAdjustment),
            recipient,
            [],
            PlainMessage.create('test-message'),
            networkType,
            helper.maxFee,
        );

        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(helper.epochAdjustment, 2, ChronoUnit.MINUTES),
            [transferTransaction.toAggregate(aggregatedTo.publicAccount)],
            networkType,
            [],
            helper.maxFee,
        );
        return signer.sign(aggregateTransaction, generationHash);
    };

    const createHashLockTransactionAndAnnounce = (
        signedAggregatedTransaction: SignedTransaction,
        signer: Account,
        networkCurrency: Currency,
    ): void => {
        const lockFundsTransaction = LockFundsTransaction.create(
            Deadline.create(helper.epochAdjustment),
            networkCurrency.createRelative(10),
            UInt64.fromUint(1000),
            signedAggregatedTransaction,
            networkType,
            helper.maxFee,
        );
        const signedLockFundsTransaction = signer.sign(lockFundsTransaction, generationHash);
        transactionRepository.announce(signedLockFundsTransaction);
    };

    describe('Confirmed', () => {
        it('confirmedTransactionsGiven address signer', () => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(helper.epochAdjustment),
                account.address,
                [],
                PlainMessage.create('test-message'),
                networkType,
                helper.maxFee,
            );
            const signedTransaction = account.sign(transferTransaction, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('Confirmed', () => {
        it('confirmedTransactionsGiven address recipient', () => {
            const recipientAddress = account2.address;
            const transferTransaction = TransferTransaction.create(
                Deadline.create(helper.epochAdjustment),
                recipientAddress,
                [],
                PlainMessage.create('test-message'),
                networkType,
                helper.maxFee,
            );
            const signedTransaction = account.sign(transferTransaction, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('UnConfirmed', () => {
        it('unconfirmedTransactionsAdded', (done) => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(helper.epochAdjustment),
                account.address,
                [],
                PlainMessage.create('test-message'),
                networkType,
                helper.maxFee,
            );
            const signedTransaction = account.sign(transferTransaction, generationHash);
            helper.listener
                .unconfirmedAdded(account.address)
                .pipe(filter((_) => _.transactionInfo!.hash === signedTransaction.hash))
                .subscribe(() => {
                    done();
                });
            transactionRepository.announce(signedTransaction);
        });

        it('unconfirmedTransactionsRemoved', (done) => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(helper.epochAdjustment),
                account.address,
                [],
                PlainMessage.create('test-message'),
                networkType,
                helper.maxFee,
            );
            const signedTransaction = account.sign(transferTransaction, generationHash);
            helper.listener
                .unconfirmedRemoved(account.address)
                .pipe(filter((hash) => hash === signedTransaction.hash))
                .subscribe(() => {
                    done();
                });
            transactionRepository.announce(signedTransaction);
        });
    });

    describe('UnConfirmed', () => {
        it('unconfirmedTransactionsAdded with unresolved address', (done) => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(helper.epochAdjustment),
                unresolvedAddress,
                [],
                PlainMessage.create('test-message'),
                networkType,
                helper.maxFee,
            );
            const signedTransaction = account.sign(transferTransaction, generationHash);
            helper.listener
                .unconfirmedAdded(unresolvedAddress)
                .pipe(filter((_) => _.transactionInfo!.hash === signedTransaction.hash))
                .subscribe(() => {
                    done();
                });
            transactionRepository.announce(signedTransaction);
        });

        it('unconfirmedTransactionsRemoved with unresolved address', (done) => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(helper.epochAdjustment),
                unresolvedAddress,
                [],
                PlainMessage.create('test-message'),
                networkType,
                helper.maxFee,
            );
            const signedTransaction = account.sign(transferTransaction, generationHash);
            helper.listener
                .unconfirmedRemoved(unresolvedAddress)
                .pipe(filter((hash) => hash === signedTransaction.hash))
                .subscribe(() => {
                    done();
                });
            transactionRepository.announce(signedTransaction);
        });
    });

    describe('TransferTransaction', () => {
        it('standalone', () => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(helper.epochAdjustment),
                cosignAccount1.address,
                [helper.createCurrency(10, true)],
                PlainMessage.create('test-message'),
                networkType,
                helper.maxFee,
            );
            const signedTransaction = transferTransaction.signWith(account, generationHash);

            return helper.announce(signedTransaction);
        });
    });

    describe('MultisigAccountModificationTransaction - Create multisig account', () => {
        it('MultisigAccountModificationTransaction', () => {
            const modifyMultisigAccountTransaction = MultisigAccountModificationTransaction.create(
                Deadline.create(helper.epochAdjustment),
                2,
                1,
                [cosignAccount1.address, cosignAccount2.address, cosignAccount3.address],
                [],
                networkType,
                helper.maxFee,
            );

            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(helper.epochAdjustment),
                [modifyMultisigAccountTransaction.toAggregate(multisigAccount.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signTransactionWithCosignatories(
                multisigAccount,
                [cosignAccount1, cosignAccount2, cosignAccount3],
                generationHash,
            );

            return helper.announce(signedTransaction);
        });
    });

    describe('Aggregate Bonded Transactions', () => {
        it('aggregateBondedTransactionsAdded', (done) => {
            const signedAggregatedTx = createSignedAggregatedBondTransaction(multisigAccount, account, account2.address);
            createHashLockTransactionAndAnnounce(signedAggregatedTx, account, helper.networkCurrency);
            helper.listener.aggregateBondedAdded(account.address).subscribe(() => {
                done();
            });
            helper.listener.confirmed(account.address).subscribe(() => {
                transactionRepository.announceAggregateBonded(signedAggregatedTx);
            });
            helper.listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
        });
    });

    describe('Aggregate Bonded Transactions', () => {
        it('aggregateBondedTransactionsRemoved', (done) => {
            const signedAggregatedTx = createSignedAggregatedBondTransaction(multisigAccount, cosignAccount1, account2.address);
            createHashLockTransactionAndAnnounce(signedAggregatedTx, cosignAccount1, helper.networkCurrency);
            helper.listener.aggregateBondedRemoved(cosignAccount1.address, signedAggregatedTx.hash).subscribe(() => {
                done();
            });
            helper.listener.confirmed(cosignAccount1.address).subscribe(() => {
                helper.listener.aggregateBondedAdded(cosignAccount1.address).subscribe(() => {
                    const criteria: TransactionSearchCriteria = {
                        address: cosignAccount1.address,
                        group: TransactionGroup.Partial,
                        embedded: true,
                    };
                    transactionRepository
                        .search(criteria)
                        .pipe(
                            mergeMap((page) => {
                                const hash = page.data[0].transactionInfo?.hash;
                                if (!hash) {
                                    throw new Error('Hash must be defined!');
                                }
                                return transactionRepository.getTransaction(hash, TransactionGroup.Partial);
                            }),
                        )
                        .subscribe((transactions) => {
                            const transactionToCosign = transactions as AggregateTransaction;
                            const cosignatureTransaction = CosignatureTransaction.create(transactionToCosign);
                            const cosignatureSignedTransaction = cosignAccount2.signCosignatureTransaction(cosignatureTransaction);
                            transactionRepository.announceAggregateBondedCosignature(cosignatureSignedTransaction);
                        });
                });
                helper.listener.status(cosignAccount1.address).subscribe((error) => {
                    console.log('Error:', error);
                    assert(false);
                    done();
                });
                transactionRepository.announceAggregateBonded(signedAggregatedTx);
            });
            helper.listener.status(cosignAccount1.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
        });
    });

    describe('Aggregate Bonded Transactions', () => {
        it('cosignatureAdded', (done) => {
            const signedAggregatedTx = createSignedAggregatedBondTransaction(multisigAccount, cosignAccount1, account2.address);

            createHashLockTransactionAndAnnounce(signedAggregatedTx, cosignAccount1, helper.networkCurrency);
            helper.listener.cosignatureAdded(cosignAccount1.address).subscribe(() => {
                done();
            });
            helper.listener.aggregateBondedAdded(cosignAccount1.address).subscribe(() => {
                const criteria: TransactionSearchCriteria = {
                    address: cosignAccount1.publicAccount.address,
                    group: TransactionGroup.Partial,
                };
                transactionRepository.search(criteria).subscribe((transactions) => {
                    const transactionToCosign = transactions.data[0] as AggregateTransaction;
                    const cosignatureTransaction = CosignatureTransaction.create(transactionToCosign);
                    const cosignatureSignedTransaction = cosignAccount2.signCosignatureTransaction(cosignatureTransaction);
                    transactionRepository.announceAggregateBondedCosignature(cosignatureSignedTransaction);
                });
            });
            helper.listener.confirmed(cosignAccount1.address).subscribe(() => {
                transactionRepository.announceAggregateBonded(signedAggregatedTx);
            });
            helper.listener.status(cosignAccount1.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
        });
    });

    describe('Aggregate Bonded Transactions', () => {
        it('aggregateBondedTransactionsAdded', (done) => {
            const signedAggregatedTx = createSignedAggregatedBondTransaction(multisigAccount, account, account2.address);
            createHashLockTransactionAndAnnounce(signedAggregatedTx, account, helper.networkCurrency);
            helper.listener.aggregateBondedAdded(unresolvedAddress).subscribe(() => {
                done();
            });
            helper.listener.confirmed(unresolvedAddress).subscribe(() => {
                transactionRepository.announceAggregateBonded(signedAggregatedTx);
            });
            helper.listener.status(unresolvedAddress).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
        });
    });

    describe('Aggregate Bonded Transactions - multisig other cosigner', () => {
        it('aggregateBondedTransactionsAdded', (done) => {
            const signedAggregatedTx = createSignedAggregatedBondTransaction(multisigAccount, account, account2.address);
            createHashLockTransactionAndAnnounce(signedAggregatedTx, account, helper.networkCurrency);
            helper.listener.aggregateBondedAdded(account2.address).subscribe(() => {
                done();
            });
            helper.listener.confirmed(unresolvedAddress).subscribe(() => {
                transactionRepository.announceAggregateBonded(signedAggregatedTx);
            });
            helper.listener.status(unresolvedAddress).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
        });
    });

    describe('MultisigAccountModificationTransaction - Restore multisig Accounts', () => {
        it('Restore Multisig Account', () => {
            const removeCosigner1 = MultisigAccountModificationTransaction.create(
                Deadline.create(helper.epochAdjustment),
                -1,
                0,
                [],
                [cosignAccount1.address],
                networkType,
            );
            const removeCosigner2 = MultisigAccountModificationTransaction.create(
                Deadline.create(helper.epochAdjustment),
                0,
                0,
                [],
                [cosignAccount2.address],
                networkType,
            );

            const removeCosigner3 = MultisigAccountModificationTransaction.create(
                Deadline.create(helper.epochAdjustment),
                -1,
                -1,
                [],
                [cosignAccount3.address],
                networkType,
            );

            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(helper.epochAdjustment),
                [
                    removeCosigner1.toAggregate(multisigAccount.publicAccount),
                    removeCosigner2.toAggregate(multisigAccount.publicAccount),
                    removeCosigner3.toAggregate(multisigAccount.publicAccount),
                ],
                networkType,
                [],
                helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signTransactionWithCosignatories(
                cosignAccount1,
                [cosignAccount2, cosignAccount3],
                generationHash,
            );
            return helper.announce(signedTransaction);
        });
    });

    describe('Transactions Status', () => {
        it('transactionStatusGiven', () => {
            const mosaics = [helper.createCurrency(1000000000000)];
            const transferTransaction = TransferTransaction.create(
                Deadline.create(helper.epochAdjustment),
                account2.address,
                mosaics,
                PlainMessage.create('test-message'),
                networkType,
                helper.maxFee,
            );

            return helper.announce(transferTransaction.signWith(account, generationHash)).then(
                () => {
                    throw new Error('Transaction should have failed!!');
                },
                (error) => {
                    expect(error.message).to.be.equal('Failure_Core_Insufficient_Balance');
                },
            );
        });
    });

    describe('New Block', () => {
        it('newBlock', (done) => {
            helper.listener.newBlock().subscribe(() => {
                done();
            });
        });
    });

    describe('Finalized Block', () => {
        it('finalizedBlock', (done) => {
            helper.listener.finalizedBlock().subscribe(() => {
                done();
            });
        });
    });
});
