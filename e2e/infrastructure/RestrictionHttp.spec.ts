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
import { RestrictionAccountRepository } from '../../src/infrastructure/RestrictionAccountRepository';
import { RestrictionMosaicRepository } from '../../src/infrastructure/RestrictionMosaicRepository';
import { Account } from '../../src/model/account/Account';
import { Address } from '../../src/model/account/Address';
import { MosaicFlags } from '../../src/model/mosaic/MosaicFlags';
import { MosaicId } from '../../src/model/mosaic/MosaicId';
import { MosaicNonce } from '../../src/model/mosaic/MosaicNonce';
import { NetworkType } from '../../src/model/network/NetworkType';
import { AddressRestrictionFlag } from '../../src/model/restriction/AddressRestrictionFlag';
import { MosaicAddressRestriction } from '../../src/model/restriction/MosaicAddressRestriction';
import { MosaicRestrictionEntryType } from '../../src/model/restriction/MosaicRestrictionEntryType';
import { MosaicRestrictionType } from '../../src/model/restriction/MosaicRestrictionType';
import { AccountRestrictionTransaction } from '../../src/model/transaction/AccountRestrictionTransaction';
import { AggregateTransaction } from '../../src/model/transaction/AggregateTransaction';
import { Deadline } from '../../src/model/transaction/Deadline';
import { MosaicAddressRestrictionTransaction } from '../../src/model/transaction/MosaicAddressRestrictionTransaction';
import { MosaicDefinitionTransaction } from '../../src/model/transaction/MosaicDefinitionTransaction';
import { MosaicGlobalRestrictionTransaction } from '../../src/model/transaction/MosaicGlobalRestrictionTransaction';
import { UInt64 } from '../../src/model/UInt64';
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
    const epochAdjustment = 1573430400;

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
                Deadline.create(epochAdjustment),
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
                Deadline.create(epochAdjustment),
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
                Deadline.create(epochAdjustment),
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
                Deadline.create(epochAdjustment),
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
                Deadline.create(epochAdjustment),
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
                Deadline.create(epochAdjustment),
                mosaicId,
                UInt64.fromUint(60641),
                account3.address,
                UInt64.fromUint(2),
                networkType,
                UInt64.fromHex('FFFFFFFFFFFFFFFF'),
                helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(epochAdjustment),
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
            const accountRestrictions = await restrictionAccountRepository.getAccountRestrictions(accountAddress).toPromise();
            expect(accountRestrictions.restrictions.length).to.be.greaterThan(0);
        });
    });

    describe('search', () => {
        it('should call search successfully', async () => {
            const mosaicRestrictionPage = await restrictionMosaicRepository
                .searchMosaicRestrictions({ mosaicId, targetAddress: account3.address })
                .toPromise();
            deepEqual(mosaicRestrictionPage.data[0].mosaicId.toHex(), mosaicId.toHex());
            deepEqual(mosaicRestrictionPage.data[0].entryType, MosaicRestrictionEntryType.ADDRESS);
            const addressRestriction = mosaicRestrictionPage.data[0] as MosaicAddressRestriction;
            deepEqual(addressRestriction.targetAddress.plain(), account3.address.plain());
            deepEqual(addressRestriction.getRestriction(UInt64.fromUint(60641))!.restrictionValue, UInt64.fromUint(2));
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
                Deadline.create(epochAdjustment),
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
