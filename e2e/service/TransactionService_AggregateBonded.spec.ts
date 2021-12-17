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

import { ChronoUnit } from '@js-joda/core';
import { expect } from 'chai';
import { firstValueFrom } from 'rxjs';
import { Account, Address } from '../../src/model/account';
import { PlainMessage } from '../../src/model/message/PlainMessage';
import { NetworkType } from '../../src/model/network/NetworkType';
import { AggregateTransaction } from '../../src/model/transaction/AggregateTransaction';
import { Deadline } from '../../src/model/transaction/Deadline';
import { LockFundsTransaction } from '../../src/model/transaction/LockFundsTransaction';
import { MultisigAccountModificationTransaction } from '../../src/model/transaction/MultisigAccountModificationTransaction';
import { SignedTransaction } from '../../src/model/transaction/SignedTransaction';
import { TransactionType } from '../../src/model/transaction/TransactionType';
import { TransferTransaction } from '../../src/model/transaction/TransferTransaction';
import { UInt64 } from '../../src/model/UInt64';
import { TransactionService } from '../../src/service/TransactionService';
import { NetworkCurrencyLocal } from '../../test/model/mosaic/Currency.spec';
import { IntegrationTestHelper } from '../infrastructure/IntegrationTestHelper';

describe('TransactionService - AggregateBonded', () => {
    const helper = new IntegrationTestHelper();
    let account: Account;
    let account2: Account;
    let multisigAccount: Account;
    let cosignAccount1: Account;
    let cosignAccount2: Account;
    let cosignAccount3: Account;
    let generationHash: string;
    let networkType: NetworkType;
    let transactionService: TransactionService;

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
            transactionService = new TransactionService(
                helper.repositoryFactory.createTransactionRepository(),
                helper.repositoryFactory.createReceiptRepository(),
            );
        });
    });

    after(() => {
        return helper.close();
    });

    const createSignedAggregatedBondTransaction = (aggregatedTo: Account, signer: Account, recipient: Address): SignedTransaction => {
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

    describe('Setup test multisig account', () => {
        it('Announce MultisigAccountModificationTransaction', () => {
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

    /**
     * =========================
     * Test
     * =========================
     */

    describe('should announce transaction', () => {
        it('announce', () => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(helper.epochAdjustment),
                account2.address,
                [NetworkCurrencyLocal.createAbsolute(1)],
                PlainMessage.create('test-message'),
                networkType,
                helper.maxFee,
            );
            const signedTransaction = transferTransaction.signWith(account, generationHash);
            return firstValueFrom(transactionService.announce(signedTransaction, helper.listener)).then((tx: TransferTransaction) => {
                expect(tx.signer!.publicKey).to.be.equal(account.publicKey);
                expect((tx.recipientAddress as Address).equals(account2.address)).to.be.true;
                expect(tx.message.payload).to.be.equal('test-message');
            });
        });
    });

    describe('should announce aggregate bonded with hashlock', () => {
        it('announce', async () => {
            const signedAggregatedTransaction = createSignedAggregatedBondTransaction(multisigAccount, account, account2.address);
            const lockFundsTransaction = LockFundsTransaction.create(
                Deadline.create(helper.epochAdjustment),
                helper.networkCurrency.createRelative(10),
                UInt64.fromUint(1000),
                signedAggregatedTransaction,
                networkType,
                helper.maxFee,
            );
            const signedLockFundsTransaction = lockFundsTransaction.signWith(account, generationHash);
            const tx = await firstValueFrom(
                transactionService.announceHashLockAggregateBonded(
                    signedLockFundsTransaction,
                    signedAggregatedTransaction,
                    helper.listener,
                ),
            );
            expect(tx.signer!.publicKey).to.be.equal(account.publicKey);
            expect(tx.type).to.be.equal(TransactionType.AGGREGATE_BONDED);
        });
    });

    describe('should announce aggregate bonded transaction', () => {
        it('announce', async () => {
            const signedAggregatedTransaction = createSignedAggregatedBondTransaction(multisigAccount, account, account2.address);
            const lockFundsTransaction = LockFundsTransaction.create(
                Deadline.create(helper.epochAdjustment),
                helper.networkCurrency.createRelative(10),
                UInt64.fromUint(1000),
                signedAggregatedTransaction,
                networkType,
                helper.maxFee,
            );
            const signedLockFundsTransaction = lockFundsTransaction.signWith(account, generationHash);
            const signedLockFundsTransactionResponse = await firstValueFrom(
                transactionService.announce(signedLockFundsTransaction, helper.listener),
            );
            expect(signedLockFundsTransactionResponse.transactionInfo!.hash).to.be.equal(signedLockFundsTransaction.hash);
            const tx = await firstValueFrom(transactionService.announceAggregateBonded(signedAggregatedTransaction, helper.listener));
            expect(tx.signer!.publicKey).to.be.equal(account.publicKey);
            expect(tx.type).to.be.equal(TransactionType.AGGREGATE_BONDED);
        });
    });

    /**
     * =========================
     * House Keeping
     * =========================
     */

    describe('Restore test multisig Accounts', () => {
        it('Announce MultisigAccountModificationTransaction', async () => {
            const removeCosigner1 = MultisigAccountModificationTransaction.create(
                Deadline.create(helper.epochAdjustment),
                -1,
                0,
                [],
                [cosignAccount1.address],
                networkType,
                helper.maxFee,
            );
            const removeCosigner2 = MultisigAccountModificationTransaction.create(
                Deadline.create(helper.epochAdjustment),
                0,
                0,
                [],
                [cosignAccount2.address],
                networkType,
                helper.maxFee,
            );

            const removeCosigner3 = MultisigAccountModificationTransaction.create(
                Deadline.create(helper.epochAdjustment),
                -1,
                -1,
                [],
                [cosignAccount3.address],
                networkType,
                helper.maxFee,
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

            await helper.announce(signedTransaction);
        });
    });
});
