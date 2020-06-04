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
import { AddressRestrictionFlag } from '../../src/model/restriction/AddressRestrictionFlag';

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
        return helper.start().then(() => {
            account = helper.account;
            account3 = helper.account3;
            accountAddress = helper.account.address;
            generationHash = helper.generationHash;
            networkType = helper.networkType;
            restrictionMosaicRepository = helper.repositoryFactory.createRestrictionMosaicRepository();
            restrictionAccountRepository = helper.repositoryFactory.createRestrictionAccountRepository();
        });
    });
    before(() => {
        return helper.listener.open();
    });

    after(() => {
        helper.listener.close();
    });

    /**
     * =========================
     * Setup test data
     * =========================
     */
    describe('MosaicDefinitionTransaction', () => {
        it('standalone', () => {
            const nonce = MosaicNonce.createRandom();
            mosaicId = MosaicId.createFromNonce(nonce, account.publicAccount);
            const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
                Deadline.create(),
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
            referenceMosaicId = MosaicId.createFromNonce(nonce, account.publicAccount);
            const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
                Deadline.create(),
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
                Deadline.create(),
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
                Deadline.create(),
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
                Deadline.create(),
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
                Deadline.create(),
                mosaicId,
                UInt64.fromUint(60641),
                account3.address,
                UInt64.fromUint(2),
                networkType,
                UInt64.fromHex('FFFFFFFFFFFFFFFF'),
                helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(),
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
            expect(accountRestrictions.length).to.be.greaterThan(0);
        });
    });

    describe('getAccountRestrictionsFromAccounts', () => {
        it('should call getAccountRestrictionsFromAccounts successfully', async () => {
            const accountRestrictions = await restrictionAccountRepository.getAccountRestrictionsFromAccounts([accountAddress]).toPromise();
            deepEqual(accountRestrictions[0]!.address, accountAddress);
        });
    });

    describe('getMosaicAddressRestriction', () => {
        it('should call getMosaicAddressRestriction successfully', async () => {
            const mosaicRestriction = await restrictionMosaicRepository.getMosaicAddressRestriction(mosaicId, account3.address).toPromise();
            deepEqual(mosaicRestriction.mosaicId.toHex(), mosaicId.toHex());
            deepEqual(mosaicRestriction.entryType, MosaicRestrictionEntryType.ADDRESS);
            deepEqual(mosaicRestriction.targetAddress.plain(), account3.address.plain());
            deepEqual(mosaicRestriction.restrictions.get(UInt64.fromUint(60641).toString()), UInt64.fromUint(2).toString());
        });
    });

    describe('getMosaicAddressRestrictions', () => {
        it('should call getMosaicAddressRestrictions successfully', async () => {
            const mosaicRestriction = await restrictionMosaicRepository
                .getMosaicAddressRestrictions(mosaicId, [account3.address])
                .toPromise();
            deepEqual(mosaicRestriction[0].mosaicId.toHex(), mosaicId.toHex());
            deepEqual(mosaicRestriction[0].entryType, MosaicRestrictionEntryType.ADDRESS);
            deepEqual(mosaicRestriction[0].targetAddress.plain(), account3.address.plain());
            deepEqual(mosaicRestriction[0].restrictions.get(UInt64.fromUint(60641).toString()), UInt64.fromUint(2).toString());
        });
    });

    describe('getMosaicGlobalRestriction', () => {
        it('should call getMosaicGlobalRestriction successfully', async () => {
            const mosaicRestriction = await restrictionMosaicRepository.getMosaicGlobalRestriction(mosaicId).toPromise();
            deepEqual(mosaicRestriction.mosaicId.toHex(), mosaicId.toHex());
            deepEqual(mosaicRestriction.entryType, MosaicRestrictionEntryType.GLOBAL);
            deepEqual(
                mosaicRestriction.restrictions.get(UInt64.fromUint(60641).toString())!.referenceMosaicId.toHex(),
                new MosaicId(UInt64.fromUint(0).toHex()).toHex(),
            );
            deepEqual(mosaicRestriction.restrictions.get(UInt64.fromUint(60641).toString())!.restrictionType, MosaicRestrictionType.GE);
            deepEqual(
                mosaicRestriction.restrictions.get(UInt64.fromUint(60641).toString())!.restrictionValue.toString(),
                UInt64.fromUint(0).toString(),
            );
        });
    });

    describe('getMosaicGlobalRestrictions', () => {
        it('should call getMosaicGlobalRestrictions successfully', async () => {
            const mosaicRestriction = await restrictionMosaicRepository.getMosaicGlobalRestrictions([mosaicId]).toPromise();
            deepEqual(mosaicRestriction[0].mosaicId.toHex(), mosaicId.toHex());
            deepEqual(mosaicRestriction[0].entryType, MosaicRestrictionEntryType.GLOBAL);
            deepEqual(
                mosaicRestriction[0].restrictions.get(UInt64.fromUint(60641).toString())!.referenceMosaicId.toHex(),
                new MosaicId(UInt64.fromUint(0).toHex()).toHex(),
            );
            deepEqual(mosaicRestriction[0].restrictions.get(UInt64.fromUint(60641).toString())!.restrictionType, MosaicRestrictionType.GE);
            deepEqual(
                mosaicRestriction[0].restrictions.get(UInt64.fromUint(60641).toString())!.restrictionValue.toString(),
                UInt64.fromUint(0).toString(),
            );
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
                Deadline.create(),
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
