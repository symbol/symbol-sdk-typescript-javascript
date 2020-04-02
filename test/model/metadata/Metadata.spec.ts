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
import { Metadata } from '../../../src/model/metadata/Metadata';
import { MetadataEntry } from '../../../src/model/metadata/MetadataEntry';
import { MetadataType } from '../../../src/model/metadata/MetadataType';
import { TestingAccount } from '../../conf/conf.spec';

describe('Metadata', () => {
    let account: Account;
    const hash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = TestingAccount;
    });

    it('should createComplete an Metadata object', () => {
        const metadataEntryDTO = {
            compositeHash: hash,
            senderPublicKey: account.publicKey,
            targetPublicKey: account.publicKey,
            scopedMetadataKey: '85BBEA6CC462B244',
            targetId: undefined,
            metadataType: 0,
            value: '12345',
        };
        const metadataDTO = {
            meta: {
                id: '9999',
            },
            metadataEntry: metadataEntryDTO,
        };

        const metadata = new Metadata(
            metadataDTO.meta.id,
            new MetadataEntry(
                metadataDTO.metadataEntry.compositeHash,
                metadataDTO.metadataEntry.senderPublicKey,
                metadataDTO.metadataEntry.targetPublicKey,
                BigInt(metadataDTO.metadataEntry.scopedMetadataKey),
                metadataDTO.metadataEntry.metadataType,
                metadataDTO.metadataEntry.value,
            ),
        );

        deepEqual(metadata.id, '9999');
        deepEqual(metadata.metadataEntry.senderPublicKey, account.publicKey);
        deepEqual(metadata.metadataEntry.compositeHash, hash);
        deepEqual(metadata.metadataEntry.targetPublicKey, account.publicKey);
        deepEqual(metadata.metadataEntry.scopedMetadataKey, BigInt('0x85BBEA6CC462B244'));
        deepEqual(metadata.metadataEntry.targetId, undefined);
        deepEqual(metadata.metadataEntry.metadataType, MetadataType.Account);
        deepEqual(metadata.metadataEntry.value, '12345');
    });
});
