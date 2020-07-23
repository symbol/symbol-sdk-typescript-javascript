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
import { Convert } from '../../src/core/format/Convert';
import { MetadataRepository } from '../../src/infrastructure/MetadataRepository';
import { Account } from '../../src/model/account/Account';
import { Metadata } from '../../src/model/metadata/Metadata';
import { MetadataEntry } from '../../src/model/metadata/MetadataEntry';
import { MetadataType } from '../../src/model/metadata/MetadataType';
import { MosaicId } from '../../src/model/mosaic/MosaicId';
import { NamespaceId } from '../../src/model/namespace/NamespaceId';
import { NetworkType } from '../../src/model/network/NetworkType';
import { AccountMetadataTransaction } from '../../src/model/transaction/AccountMetadataTransaction';
import { Deadline } from '../../src/model/transaction/Deadline';
import { MosaicMetadataTransaction } from '../../src/model/transaction/MosaicMetadataTransaction';
import { NamespaceMetadataTransaction } from '../../src/model/transaction/NamespaceMetadataTransaction';
import { TransactionType } from '../../src/model/transaction/TransactionType';
import { UInt64 } from '../../src/model/UInt64';
import { MetadataTransactionService } from '../../src/service/MetadataTransactionService';
import { TestingAccount } from '../conf/conf.spec';
import { Page } from '../../src/infrastructure/Page';

describe('MetadataTransactionService', () => {
    let account: Account;
    let metadataTransactionService: MetadataTransactionService;
    const key = UInt64.fromHex('85BBEA6CC462B244');
    const value = 'TEST';
    const deltaValue = 'dalta';
    const targetIdHex = '941299B2B7E1291C';
    function mockMetadata(type: MetadataType): Metadata {
        let targetId;

        if (type === MetadataType.Account) {
            targetId = undefined;
        } else if (type === MetadataType.Mosaic) {
            targetId = new MosaicId(targetIdHex);
        } else if (type === MetadataType.Namespace) {
            targetId = NamespaceId.createFromEncoded(targetIdHex);
        }
        return new Metadata(
            '59DFBA84B2E9E7000135E80C',
            new MetadataEntry(
                '5E628EA59818D97AA4118780D9A88C5512FCE7A21C195E1574727EFCE5DF7C0D',
                account.address,
                account.address,
                key,
                MetadataType.Account,
                value,
                targetId,
            ),
        );
    }
    const mockMetadataRepository: MetadataRepository = mock();

    before(() => {
        account = TestingAccount;

        when(
            mockMetadataRepository.search(
                deepEqual({
                    targetAddress: account.address,
                    scopedMetadataKey: key.toHex(),
                    sourceAddress: account.address,
                    metadataType: MetadataType.Account,
                }),
            ),
        ).thenReturn(observableOf(new Page<Metadata>([mockMetadata(MetadataType.Account)], 1, 20, 1, 1)));

        when(
            mockMetadataRepository.search(
                deepEqual({
                    targetId: new MosaicId(targetIdHex),
                    scopedMetadataKey: key.toHex(),
                    sourceAddress: account.address,
                    metadataType: MetadataType.Mosaic,
                }),
            ),
        ).thenReturn(observableOf(new Page<Metadata>([mockMetadata(MetadataType.Mosaic)], 1, 20, 1, 1)));

        when(
            mockMetadataRepository.search(
                deepEqual({
                    targetId: NamespaceId.createFromEncoded(targetIdHex),
                    scopedMetadataKey: key.toHex(),
                    sourceAddress: account.address,
                    metadataType: MetadataType.Namespace,
                }),
            ),
        ).thenReturn(observableOf(new Page<Metadata>([mockMetadata(MetadataType.Namespace)], 1, 20, 1, 1)));

        const metadataRepository = instance(mockMetadataRepository);
        metadataTransactionService = new MetadataTransactionService(metadataRepository);
    });

    it('should create AccountMetadataTransaction', (done) => {
        metadataTransactionService
            .createAccountMetadataTransaction(
                Deadline.create(),
                NetworkType.MIJIN_TEST,
                account.address,
                key,
                value + deltaValue,
                account.address,
                UInt64.fromUint(2000),
            )
            .subscribe((transaction: AccountMetadataTransaction) => {
                expect(transaction.type).to.be.equal(TransactionType.ACCOUNT_METADATA);
                expect(transaction.scopedMetadataKey.toHex()).to.be.equal(key.toHex());
                expect(Convert.utf8ToHex(transaction.value)).to.be.equal(
                    Convert.xor(Convert.utf8ToUint8(value), Convert.utf8ToUint8(value + deltaValue)),
                );
                expect(transaction.valueSizeDelta).to.be.equal(deltaValue.length);
                expect(transaction.targetAddress.equals(account.address)).to.be.true;
                done();
            });
    });

    it('should create MosaicMetadataTransaction', (done) => {
        metadataTransactionService
            .createMosaicMetadataTransaction(
                Deadline.create(),
                NetworkType.MIJIN_TEST,
                account.address,
                new MosaicId(targetIdHex),
                key,
                value + deltaValue,
                account.address,
                UInt64.fromUint(2000),
            )
            .subscribe((transaction: MosaicMetadataTransaction) => {
                expect(transaction.type).to.be.equal(TransactionType.MOSAIC_METADATA);
                expect(transaction.scopedMetadataKey.toHex()).to.be.equal(key.toHex());
                expect(Convert.utf8ToHex(transaction.value)).to.be.equal(
                    Convert.xor(Convert.utf8ToUint8(value), Convert.utf8ToUint8(value + deltaValue)),
                );
                expect(transaction.targetMosaicId.toHex()).to.be.equal(targetIdHex);
                expect(transaction.valueSizeDelta).to.be.equal(deltaValue.length);
                expect(transaction.targetAddress.equals(account.address)).to.be.true;
                done();
            });
    });

    it('should create NamespaceMetadataTransaction', (done) => {
        metadataTransactionService
            .createNamespaceMetadataTransaction(
                Deadline.create(),
                NetworkType.MIJIN_TEST,
                account.address,
                NamespaceId.createFromEncoded(targetIdHex),
                key,
                value + deltaValue,
                account.address,
                UInt64.fromUint(2000),
            )
            .subscribe((transaction: NamespaceMetadataTransaction) => {
                expect(transaction.type).to.be.equal(TransactionType.NAMESPACE_METADATA);
                expect(transaction.scopedMetadataKey.toHex()).to.be.equal(key.toHex());
                expect(Convert.utf8ToHex(transaction.value)).to.be.equal(
                    Convert.xor(Convert.utf8ToUint8(value), Convert.utf8ToUint8(value + deltaValue)),
                );
                expect(transaction.targetNamespaceId.toHex()).to.be.equal(targetIdHex);
                expect(transaction.valueSizeDelta).to.be.equal(deltaValue.length);
                expect(transaction.targetAddress.equals(account.address)).to.be.true;
                done();
            });
    });

    it('should throw error with invalid address', () => {
        when(
            mockMetadataRepository.search(
                deepEqual({
                    targetAddress: account.address,
                    scopedMetadataKey: key.toHex(),
                    sourceAddress: account.address,
                    metadataType: MetadataType.Account,
                }),
            ),
        ).thenReject();
        expect(() => {
            metadataTransactionService.createAccountMetadataTransaction(
                Deadline.create(),
                NetworkType.MIJIN_TEST,
                account.address,
                key,
                value + deltaValue,
                account.address,
                UInt64.fromUint(2000),
            );
        }).to.throw;
    });

    it('should throw error with invalid mosaicId', () => {
        when(
            mockMetadataRepository.search(
                deepEqual({
                    targetId: new MosaicId(targetIdHex),
                    scopedMetadataKey: key.toHex(),
                    sourceAddress: account.address,
                    metadataType: MetadataType.Mosaic,
                }),
            ),
        ).thenReject();
        expect(() => {
            metadataTransactionService.createMosaicMetadataTransaction(
                Deadline.create(),
                NetworkType.MIJIN_TEST,
                account.address,
                new MosaicId(targetIdHex),
                key,
                value + deltaValue,
                account.address,
                UInt64.fromUint(2000),
            );
        }).to.throw;
    });

    it('should throw error with invalid NamespaceId', () => {
        when(
            mockMetadataRepository.search(
                deepEqual({
                    targetId: NamespaceId.createFromEncoded(targetIdHex),
                    scopedMetadataKey: key.toHex(),
                    sourceAddress: account.address,
                    metadataType: MetadataType.Namespace,
                }),
            ),
        ).thenReject();
        expect(() => {
            metadataTransactionService.createNamespaceMetadataTransaction(
                Deadline.create(),
                NetworkType.MIJIN_TEST,
                account.address,
                NamespaceId.createFromEncoded(targetIdHex),
                key,
                value + deltaValue,
                account.address,
                UInt64.fromUint(2000),
            );
        }).to.throw;
    });
});
