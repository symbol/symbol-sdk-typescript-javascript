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
import { RestrictionAccountRepository, RestrictionMosaicRepository } from '../../src/infrastructure';
import { toPromise } from '../../src/infrastructure/rxUtils';
import { UInt64 } from '../../src/model';
import { Account, Address } from '../../src/model/account';
import { MosaicFlags, MosaicId, MosaicNonce } from '../../src/model/mosaic';
import { NetworkType } from '../../src/model/network';
import {
    AddressRestrictionFlag,
    MosaicAddressRestriction,
    MosaicRestrictionEntryType,
    MosaicRestrictionType,
} from '../../src/model/restriction';
import {
    AccountRestrictionTransaction,
    AggregateTransaction,
    Deadline,
    MosaicAddressRestrictionTransaction,
    MosaicDefinitionTransaction,
    MosaicGlobalRestrictionTransaction,
} from '../../src/model/transaction';
import { IntegrationTestHelper } from './IntegrationTestHelper';

describe('RestrictionHttp', () => {
    const helper = new IntegrationTestHelper();
    let account: Account;
    let account3: Account;
    let accountAddress: Address;
    let restrictionMosaicRepository: RestrictionMosaicRepository;
    let generationHash: string;
    let networkType: NetworkType;
    let mosaicId: MosaicId;
    let referenceMosaicId: MosaicId;
    let restrictionAccountRepository: RestrictionAccountRepository;

    before(() => {
        return helper.start({ openListener: true }).then(() => {
            account = helper.account;
            account3 = helper.account3;
            accountAddress = helper.account.address;
            generationHash = helper.generationHash;
            networkType = helper.networkType;
            restrictionMosaicRepository = helper.repositoryFactory.createRestrictionMosaicRepository();
            restrictionAccountRepository = helper.repositoryFactory.createRestrictionAccountRepository();
        });
    });

    after(() => {
        return helper.close();
    });

    /**
     * =========================
     * Setup test data
     * =========================
     */
    describe('MosaicDefinitionTransaction', () => {
        it('standalone', () => {
            const nonce = MosaicNonce.createRandom();
            mosaicId = MosaicId.createFromNonce(nonce, account.address);
            const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
                Deadline.create(helper.epochAdjustment),
                nonce,
                mosaicId,
                MosaicFlags.create(true, true, true),
                3,
                UInt64.fromUint(1000),
                networkType,
                helper.maxFee,
            );
            const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('MosaicDefinitionTransaction', () => {
        it('standalone', () => {
            const nonce = MosaicNonce.createRandom();
            referenceMosaicId = MosaicId.createFromNonce(nonce, account.address);
            const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
                Deadline.create(helper.epochAdjustment),
                nonce,
                referenceMosaicId,
                MosaicFlags.create(true, true, true),
                3,
                UInt64.fromUint(1000),
                networkType,
                helper.maxFee,
            );
            const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('Setup Test AccountAddressRestriction', () => {
        it('Announce AccountRestrictionTransaction', () => {
            const addressModification = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
                Deadline.create(helper.epochAdjustment),
                AddressRestrictionFlag.AllowIncomingAddress,
                [account3.address],
                [],
                networkType,
                helper.maxFee,
            );
            const signedTransaction = addressModification.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('MosaicGlobalRestrictionTransaction - Reference', () => {
        it('standalone', () => {
            const mosaicGlobalRestrictionTransaction = MosaicGlobalRestrictionTransaction.create(
                Deadline.create(helper.epochAdjustment),
                referenceMosaicId,
                UInt64.fromUint(60641),
                UInt64.fromUint(0),
                MosaicRestrictionType.NONE,
                UInt64.fromUint(0),
                MosaicRestrictionType.GE,
                networkType,
                undefined,
                helper.maxFee,
            );
            const signedTransaction = mosaicGlobalRestrictionTransaction.signWith(account, generationHash);

            return helper.announce(signedTransaction);
        });
    });

    describe('MosaicGlobalRestrictionTransaction - with referenceMosaicId', () => {
        it('standalone', () => {
            const mosaicGlobalRestrictionTransaction = MosaicGlobalRestrictionTransaction.create(
                Deadline.create(helper.epochAdjustment),
                mosaicId,
                UInt64.fromUint(60641),
                UInt64.fromUint(0),
                MosaicRestrictionType.NONE,
                UInt64.fromUint(0),
                MosaicRestrictionType.GE,
                networkType,
                undefined,
                helper.maxFee,
                // TODO:
                // referenceMosaicId,
            );
            const signedTransaction = mosaicGlobalRestrictionTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('MosaicAddressRestrictionTransaction', () => {
        it('aggregate', () => {
            const mosaicAddressRestrictionTransaction = MosaicAddressRestrictionTransaction.create(
                Deadline.create(helper.epochAdjustment),
                mosaicId,
                UInt64.fromUint(60641),
                account3.address,
                UInt64.fromUint(2),
                networkType,
                UInt64.fromHex('FFFFFFFFFFFFFFFF'),
                helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(helper.epochAdjustment),
                [mosaicAddressRestrictionTransaction.toAggregate(account.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    /**
     * =========================
     * Tests
     * =========================
     */

    describe('getAccountRestrictions', () => {
        it('should call getAccountRestrictions successfully', async () => {
            const accountRestrictions = await toPromise(restrictionAccountRepository.getAccountRestrictions(accountAddress));
            expect(accountRestrictions.restrictions.length).to.be.greaterThan(0);
        });
    });

    describe('search', () => {
        it('should call search successfully', async () => {
            const mosaicRestrictionPage = await toPromise(
                restrictionMosaicRepository.search({ mosaicId, targetAddress: account3.address }),
            );
            const info = mosaicRestrictionPage.data[0];
            deepEqual(info.mosaicId.toHex(), mosaicId.toHex());
            deepEqual(info.entryType, MosaicRestrictionEntryType.ADDRESS);
            const addressRestriction = info as MosaicAddressRestriction;
            deepEqual(addressRestriction.targetAddress.plain(), account3.address.plain());
            deepEqual(addressRestriction.getRestriction(UInt64.fromUint(60641))!.restrictionValue, UInt64.fromUint(2));

            const infoFromId = await toPromise(restrictionMosaicRepository.getMosaicRestrictions(info.compositeHash));
            expect(infoFromId).to.be.equal(info);

            const merkleInfo = await toPromise(restrictionMosaicRepository.getMosaicRestrictionsMerkle(info.compositeHash));
            expect(merkleInfo.raw).to.not.be.undefined;
        });
    });

    /**
     * =========================
     * House Keeping
     * =========================
     */
    describe('Remove test AccountRestriction - Address', () => {
        it('Announce AccountRestrictionTransaction', () => {
            const addressModification = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
                Deadline.create(helper.epochAdjustment),
                AddressRestrictionFlag.AllowIncomingAddress,
                [],
                [account3.address],
                networkType,
                helper.maxFee,
            );
            const signedTransaction = addressModification.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });
});
