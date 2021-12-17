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
import { deepEqual } from 'assert';
import { expect } from 'chai';
import { firstValueFrom } from 'rxjs';
import { take, toArray } from 'rxjs/operators';
import { HashLockPaginationStreamer, Order } from '../../src/infrastructure';
import { HashLockRepository } from '../../src/infrastructure/HashLockRepository';
import { Account } from '../../src/model/account/Account';
import { Address } from '../../src/model/account/Address';
import { PlainMessage } from '../../src/model/message/PlainMessage';
import { Mosaic } from '../../src/model/mosaic/Mosaic';
import { UnresolvedMosaicId } from '../../src/model/mosaic/UnresolvedMosaicId';
import { NetworkType } from '../../src/model/network/NetworkType';
import { AggregateTransaction } from '../../src/model/transaction/AggregateTransaction';
import { Deadline } from '../../src/model/transaction/Deadline';
import { LockFundsTransaction } from '../../src/model/transaction/LockFundsTransaction';
import { MultisigAccountModificationTransaction } from '../../src/model/transaction/MultisigAccountModificationTransaction';
import { SignedTransaction } from '../../src/model/transaction/SignedTransaction';
import { TransferTransaction } from '../../src/model/transaction/TransferTransaction';
import { UInt64 } from '../../src/model/UInt64';
import { IntegrationTestHelper } from './IntegrationTestHelper';

describe('HashLockHttp', () => {
    const helper = new IntegrationTestHelper();
    let account: Account;
    let account2: Account;
    let multisigAccount: Account;
    let cosignAccount1: Account;
    let cosignAccount2: Account;
    let cosignAccount3: Account;
    let hashLockRepo: HashLockRepository;
    let hash: string;
    let generationHash: string;
    let networkType: NetworkType;

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
            hashLockRepo = helper.repositoryFactory.createHashLockRepository();
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

    const createHashLockTransactionAndAnnounce = (
        signedAggregatedTransaction: SignedTransaction,
        signer: Account,
        mosaicId: UnresolvedMosaicId,
    ): any => {
        const lockFundsTransaction = LockFundsTransaction.create(
            Deadline.create(helper.epochAdjustment),
            new Mosaic(mosaicId, UInt64.fromUint(10 * Math.pow(10, helper.networkCurrency.divisibility))),
            UInt64.fromUint(1000),
            signedAggregatedTransaction,
            networkType,
            helper.maxFee,
        );
        const signedLockFundsTransaction = signer.sign(lockFundsTransaction, generationHash);
        return helper.announce(signedLockFundsTransaction);
    };

    /**
     * =========================
     * Setup test data
     * =========================
     */

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

    describe('Create a hash lock', () => {
        it('Announce HashLockTransaction', () => {
            const signedAggregatedTx = createSignedAggregatedBondTransaction(multisigAccount, account, account2.address);
            return createHashLockTransactionAndAnnounce(signedAggregatedTx, account, helper.networkCurrency.namespaceId!);
        });
    });

    /**
     * =========================
     * Tests
     * =========================
     */

    describe('searchHashLock', () => {
        it('should return hash lock page info', async () => {
            await new Promise((resolve) => setTimeout(resolve, 3000));
            const page = await firstValueFrom(hashLockRepo.search({ address: account.address }));
            const info = page.data[0];
            hash = info.hash;
            expect(page.data.length).to.be.greaterThan(0);

            const infoFromId = await firstValueFrom(hashLockRepo.getHashLock(hash));
            expect(infoFromId).deep.eq(info);
            const merkleInfo = await firstValueFrom(hashLockRepo.getHashLockMerkle(hash));
            expect(merkleInfo.raw).to.not.be.undefined;
        });
    });

    describe('searchHashLock with streamer', () => {
        it('should return hash lock page info', async () => {
            const streamer = new HashLockPaginationStreamer(hashLockRepo);
            const infoStreamer = await firstValueFrom(
                streamer.search({ address: account.address, pageSize: 20, order: Order.Asc }).pipe(take(20), toArray()),
            );
            const info = await firstValueFrom(hashLockRepo.search({ address: account.address, pageSize: 20, order: Order.Asc }));
            expect(infoStreamer.length).to.be.greaterThan(0);
            deepEqual(infoStreamer[0], info.data[0]);
        });
    });

    describe('getHashLock', () => {
        it('should return hash lock info given hash', async () => {
            const info = await firstValueFrom(hashLockRepo.getHashLock(hash));
            expect(info.ownerAddress.plain()).to.be.equal(account.address.plain());
            expect(info.amount.toString()).to.be.equal('10000000');
        });
    });

    /**
     * =========================
     * House Keeping
     * =========================
     */

    describe('Restore test multisig Accounts', () => {
        it('Announce MultisigAccountModificationTransaction', () => {
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
            return helper.announce(signedTransaction);
        });
    });
});
