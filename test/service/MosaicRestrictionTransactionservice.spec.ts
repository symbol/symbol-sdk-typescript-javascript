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
import { of as observableOf } from 'rxjs';
import { deepEqual, instance, mock, when } from 'ts-mockito';
import { KeyGenerator } from '../../src/core/format/KeyGenerator';
import { NamespaceRepository } from '../../src/infrastructure/NamespaceRepository';
import { Page } from '../../src/infrastructure/Page';
import { RestrictionMosaicRepository } from '../../src/infrastructure/RestrictionMosaicRepository';
import { Account } from '../../src/model/account/Account';
import { MosaicId } from '../../src/model/mosaic/MosaicId';
import { NamespaceId } from '../../src/model/namespace/NamespaceId';
import { NetworkType } from '../../src/model/network/NetworkType';
import { MosaicAddressRestriction } from '../../src/model/restriction/MosaicAddressRestriction';
import { MosaicGlobalRestriction } from '../../src/model/restriction/MosaicGlobalRestriction';
import { MosaicGlobalRestrictionItem } from '../../src/model/restriction/MosaicGlobalRestrictionItem';
import { MosaicRestrictionEntryType } from '../../src/model/restriction/MosaicRestrictionEntryType';
import { MosaicRestrictionType } from '../../src/model/restriction/MosaicRestrictionType';
import { Deadline } from '../../src/model/transaction/Deadline';
import { MosaicAddressRestrictionTransaction } from '../../src/model/transaction/MosaicAddressRestrictionTransaction';
import { MosaicGlobalRestrictionTransaction } from '../../src/model/transaction/MosaicGlobalRestrictionTransaction';
import { TransactionType } from '../../src/model/transaction/TransactionType';
import { UInt64 } from '../../src/model/UInt64';
import { MosaicRestrictionTransactionService } from '../../src/service/MosaicRestrictionTransactionService';
import { TestingAccount } from '../conf/conf.spec';

describe('MosaicRestrictionTransactionService', () => {
    let account: Account;
    let mosaicId: MosaicId;
    let unresolvedMosaicId: NamespaceId;
    let unresolvedAddress: NamespaceId;
    let referenceMosaicId: MosaicId;
    let mosaicRestrictionTransactionService: MosaicRestrictionTransactionService;
    const key = KeyGenerator.generateUInt64Key('TestKey');
    const invalidKey = KeyGenerator.generateUInt64Key('9999');
    let mosaicIdWrongKey: MosaicId;
    const globalRestrictionValue = '1000';
    const globalRestrictionType = MosaicRestrictionType.LE;
    const addressRestrictionValue = '10';
    const epochAdjustment = 1573430400;

    function mockGlobalRestriction(): Page<MosaicGlobalRestriction> {
        const restriction = new MosaicGlobalRestriction(
            '59DFBA84B2E9E7000135E80C',
            MosaicRestrictionEntryType.GLOBAL,
            mosaicId,
            new Map<string, MosaicGlobalRestrictionItem>().set(
                key.toString(),
                new MosaicGlobalRestrictionItem(referenceMosaicId, globalRestrictionValue, globalRestrictionType),
            ),
        );

        return new Page<MosaicGlobalRestriction>([restriction], 1, 1);
    }

    function mockAddressRestriction(): Page<MosaicAddressRestriction> {
        const restriction = new MosaicAddressRestriction(
            '59DFBA84B2E9E7000135E80C',
            MosaicRestrictionEntryType.GLOBAL,
            mosaicId,
            account.address,
            new Map<string, string>().set(key.toString(), addressRestrictionValue),
        );
        return new Page<MosaicAddressRestriction>([restriction], 1, 1);
    }

    before(() => {
        account = TestingAccount;
        mosaicId = new MosaicId('85BBEA6CC462B244');
        unresolvedMosaicId = NamespaceId.createFromEncoded('F8495AEE892FA108');
        unresolvedAddress = NamespaceId.createFromEncoded('AB114281960BF1CC');
        mosaicIdWrongKey = new MosaicId('85BBEA6CC462B288');
        referenceMosaicId = new MosaicId('1AB129B545561E6A');
        const mockRestrictionRepository = mock<RestrictionMosaicRepository>();
        const mockNamespaceRepository = mock<NamespaceRepository>();

        when(mockRestrictionRepository.searchMosaicRestrictions(deepEqual({ mosaicId }))).thenReturn(observableOf(mockGlobalRestriction()));
        when(mockRestrictionRepository.searchMosaicRestrictions(deepEqual({ mosaicId, targetAddress: account.address }))).thenReturn(
            observableOf(mockAddressRestriction()),
        );
        when(mockNamespaceRepository.getLinkedMosaicId(deepEqual(unresolvedMosaicId))).thenReturn(observableOf(mosaicId));
        when(mockNamespaceRepository.getLinkedMosaicId(deepEqual(unresolvedAddress))).thenThrow(new Error('invalid namespaceId'));
        when(mockNamespaceRepository.getLinkedAddress(deepEqual(unresolvedAddress))).thenReturn(observableOf(account.address));
        when(mockNamespaceRepository.getLinkedAddress(deepEqual(unresolvedMosaicId))).thenThrow(new Error('invalid namespaceId'));
        const restrictionRepository = instance(mockRestrictionRepository);
        const namespaceRepository = instance(mockNamespaceRepository);
        mosaicRestrictionTransactionService = new MosaicRestrictionTransactionService(restrictionRepository, namespaceRepository);
    });

    it('should create MosaicGlobalRestriction Transaction', (done) => {
        mosaicRestrictionTransactionService
            .createMosaicGlobalRestrictionTransaction(
                Deadline.create(epochAdjustment),
                NetworkType.PRIVATE_TEST,
                mosaicId,
                key,
                '2000',
                MosaicRestrictionType.LE,
            )
            .subscribe((transaction: MosaicGlobalRestrictionTransaction) => {
                expect(transaction.type).to.be.equal(TransactionType.MOSAIC_GLOBAL_RESTRICTION);
                expect(transaction.restrictionKey.toString()).to.be.equal(key.toString());
                expect(transaction.previousRestrictionType).to.be.equal(globalRestrictionType);
                expect(transaction.previousRestrictionValue.toString()).to.be.equal(globalRestrictionValue);
                expect(transaction.referenceMosaicId.toHex()).to.be.equal(new MosaicId(UInt64.fromUint(0).toDTO()).toHex());
                done();
            });
    });

    it('should create MosaicGlobalRestriction Transaction - with referenceMosaicId', (done) => {
        mosaicRestrictionTransactionService
            .createMosaicGlobalRestrictionTransaction(
                Deadline.create(epochAdjustment),
                NetworkType.PRIVATE_TEST,
                mosaicId,
                key,
                '2000',
                MosaicRestrictionType.LE,
                referenceMosaicId,
            )
            .subscribe((transaction: MosaicGlobalRestrictionTransaction) => {
                expect(transaction.type).to.be.equal(TransactionType.MOSAIC_GLOBAL_RESTRICTION);
                expect(transaction.restrictionKey.toHex()).to.be.equal(key.toHex());
                expect(transaction.previousRestrictionType).to.be.equal(globalRestrictionType);
                expect(transaction.previousRestrictionValue.toString()).to.be.equal(globalRestrictionValue);
                expect(transaction.referenceMosaicId.toHex()).to.be.equal(referenceMosaicId.toHex());
                done();
            });
    });

    it('should create MosaicAddressRestriction Transaction', (done) => {
        mosaicRestrictionTransactionService
            .createMosaicAddressRestrictionTransaction(
                Deadline.create(epochAdjustment),
                NetworkType.PRIVATE_TEST,
                mosaicId,
                key,
                account.address,
                '2000',
            )
            .subscribe((transaction: MosaicAddressRestrictionTransaction) => {
                expect(transaction.type).to.be.equal(TransactionType.MOSAIC_ADDRESS_RESTRICTION);
                expect(transaction.restrictionKey.toString()).to.be.equal(key.toString());
                expect(transaction.targetAddressToString()).to.be.equal(account.address.plain());
                expect(transaction.previousRestrictionValue.toString()).to.be.equal(addressRestrictionValue);
                done();
            });
    });

    it('should create MosaicGlobalRestriction Transaction with unresolvedMosaicId', (done) => {
        mosaicRestrictionTransactionService
            .createMosaicGlobalRestrictionTransaction(
                Deadline.create(epochAdjustment),
                NetworkType.PRIVATE_TEST,
                unresolvedMosaicId,
                key,
                '2000',
                MosaicRestrictionType.LE,
            )
            .subscribe((transaction: MosaicGlobalRestrictionTransaction) => {
                expect(transaction.type).to.be.equal(TransactionType.MOSAIC_GLOBAL_RESTRICTION);
                expect(transaction.restrictionKey.toHex()).to.be.equal(key.toHex());
                expect(transaction.previousRestrictionType).to.be.equal(globalRestrictionType);
                expect(transaction.previousRestrictionValue.toString()).to.be.equal(globalRestrictionValue);
                expect(transaction.referenceMosaicId.toHex()).to.be.equal(new MosaicId(UInt64.fromUint(0).toDTO()).toHex());
                done();
            });
    });

    it('should create MosaicAddressRestriction Transaction with unresolvedAddress', (done) => {
        mosaicRestrictionTransactionService
            .createMosaicAddressRestrictionTransaction(
                Deadline.create(epochAdjustment),
                NetworkType.PRIVATE_TEST,
                unresolvedMosaicId,
                key,
                unresolvedAddress,
                '2000',
            )
            .subscribe((transaction: MosaicAddressRestrictionTransaction) => {
                expect(transaction.type).to.be.equal(TransactionType.MOSAIC_ADDRESS_RESTRICTION);
                expect(transaction.restrictionKey.toString()).to.be.equal(key.toString());
                expect(transaction.targetAddressToString()).to.be.equal(unresolvedAddress.toHex());
                expect(transaction.previousRestrictionValue.toString()).to.be.equal(addressRestrictionValue);
                done();
            });
    });

    it('should throw error with invalid unresolvedMosaicId', () => {
        expect(() => {
            mosaicRestrictionTransactionService.createMosaicGlobalRestrictionTransaction(
                Deadline.create(epochAdjustment),
                NetworkType.PRIVATE_TEST,
                unresolvedAddress,
                key,
                '2000',
                MosaicRestrictionType.LE,
            );
        }).to.throw();
    });

    it('should throw error with invalid unresolvedAddress', () => {
        expect(() => {
            mosaicRestrictionTransactionService.createMosaicAddressRestrictionTransaction(
                Deadline.create(epochAdjustment),
                NetworkType.PRIVATE_TEST,
                mosaicId,
                key,
                unresolvedMosaicId,
                '2000',
            );
        }).to.throw();
    });

    it('should throw error with invalid value / key', () => {
        expect(() => {
            mosaicRestrictionTransactionService.createMosaicGlobalRestrictionTransaction(
                Deadline.create(epochAdjustment),
                NetworkType.PRIVATE_TEST,
                mosaicId,
                key,
                'wrong value',
                MosaicRestrictionType.LE,
            );
        }).to.throw(Error, 'RestrictionValue: wrong value is not a valid numeric string.');

        expect(() => {
            mosaicRestrictionTransactionService.createMosaicAddressRestrictionTransaction(
                Deadline.create(epochAdjustment),
                NetworkType.PRIVATE_TEST,
                mosaicId,
                key,
                account.address,
                'wrong value',
            );
        }).to.throw(Error, 'RestrictionValue: wrong value is not a valid numeric string.');
    });

    it('should throw error with invalid address restriction key - MosaicAddressRestriction', () => {
        mosaicRestrictionTransactionService
            .createMosaicAddressRestrictionTransaction(
                Deadline.create(epochAdjustment),
                NetworkType.PRIVATE_TEST,
                mosaicIdWrongKey,
                invalidKey,
                account.address,
                '2000',
            )
            .subscribe(
                () => {
                    expect(true).to.be.false;
                },
                (err) => {
                    expect(err).not.to.be.undefined;
                },
            );
    });
});
