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

import {deepEqual} from 'assert';
import { Account } from '../../../src/model/account/Account';
import { MetadataEntry } from '../../../src/model/metadata/MetadataEntry';
import { MetadataType } from '../../../src/model/metadata/MetadataType';
import { MosaicId, NamespaceId } from '../../../src/model/model';
import {UInt64} from '../../../src/model/UInt64';
import { TestingAccount } from '../../conf/conf.spec';

describe('MetadataEntry', () => {
    let account: Account;
    const hash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = TestingAccount;
    });

    it('should createComplete an Account Metadata object', () => {
        const metadataEntryDTO = {
            compositeHash: hash,
            senderPublicKey: account.publicKey,
            targetPublicKey: account.publicKey,
            scopedMetadataKey: '85BBEA6CC462B244',
            targetId: undefined,
            metadataType: 0,
            valueSize: 5,
            value: '12345',
        };

        const metadata = new MetadataEntry(
            metadataEntryDTO.compositeHash,
            metadataEntryDTO.senderPublicKey,
            metadataEntryDTO.targetPublicKey,
            UInt64.fromHex(metadataEntryDTO.scopedMetadataKey),
            metadataEntryDTO.metadataType,
            metadataEntryDTO.valueSize,
            metadataEntryDTO.value,
        );

        deepEqual(metadata.senderPublicKey, account.publicKey);
        deepEqual(metadata.compositeHash, hash);
        deepEqual(metadata.targetPublicKey, account.publicKey);
        deepEqual(metadata.scopedMetadataKey, UInt64.fromHex('85BBEA6CC462B244'));
        deepEqual(metadata.targetId, undefined);
        deepEqual(metadata.metadataType, MetadataType.Account);
        deepEqual(metadata.valueSize, 5);
        deepEqual(metadata.value, '12345');
    });

    it('should createComplete an Mosaic Metadata object', () => {
        const metadataEntryDTO = {
            compositeHash: hash,
            senderPublicKey: account.publicKey,
            targetPublicKey: account.publicKey,
            scopedMetadataKey: '85BBEA6CC462B244',
            targetId: '85BBEA6CC462B244',
            metadataType: 1,
            valueSize: 5,
            value: '12345',
        };

        const metadata = new MetadataEntry(
            metadataEntryDTO.compositeHash,
            metadataEntryDTO.senderPublicKey,
            metadataEntryDTO.targetPublicKey,
            UInt64.fromHex(metadataEntryDTO.scopedMetadataKey),
            metadataEntryDTO.metadataType,
            metadataEntryDTO.valueSize,
            metadataEntryDTO.value,
            new MosaicId(metadataEntryDTO.targetId),
        );

        deepEqual(metadata.senderPublicKey, account.publicKey);
        deepEqual(metadata.compositeHash, hash);
        deepEqual(metadata.targetPublicKey, account.publicKey);
        deepEqual(metadata.scopedMetadataKey, UInt64.fromHex('85BBEA6CC462B244'));
        deepEqual((metadata.targetId as MosaicId).toHex(), '85BBEA6CC462B244');
        deepEqual(metadata.metadataType, MetadataType.Mosaic);
        deepEqual(metadata.valueSize, 5);
        deepEqual(metadata.value, '12345');
    });

    it('should createComplete an Namespace Metadata object', () => {
        const metadataEntryDTO = {
            compositeHash: hash,
            senderPublicKey: account.publicKey,
            targetPublicKey: account.publicKey,
            scopedMetadataKey: '85BBEA6CC462B244',
            targetId: '85BBEA6CC462B244',
            metadataType: 2,
            valueSize: 5,
            value: '12345',
        };

        const metadata = new MetadataEntry(
            metadataEntryDTO.compositeHash,
            metadataEntryDTO.senderPublicKey,
            metadataEntryDTO.targetPublicKey,
            UInt64.fromHex(metadataEntryDTO.scopedMetadataKey),
            metadataEntryDTO.metadataType,
            metadataEntryDTO.valueSize,
            metadataEntryDTO.value,
            NamespaceId.createFromEncoded(metadataEntryDTO.targetId),
        );

        deepEqual(metadata.senderPublicKey, account.publicKey);
        deepEqual(metadata.compositeHash, hash);
        deepEqual(metadata.targetPublicKey, account.publicKey);
        deepEqual(metadata.scopedMetadataKey, UInt64.fromHex('85BBEA6CC462B244'));
        deepEqual((metadata.targetId as NamespaceId).toHex(), '85BBEA6CC462B244');
        deepEqual(metadata.metadataType, MetadataType.Namespace);
        deepEqual(metadata.valueSize, 5);
        deepEqual(metadata.value, '12345');
    });
});
