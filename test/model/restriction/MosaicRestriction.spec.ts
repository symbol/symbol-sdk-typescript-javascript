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
import { MosaicAddressRestrictionEntryBuilder, MosaicGlobalRestrictionEntryBuilder } from 'catbuffer-typescript';
import { expect } from 'chai';
import { MosaicAddressRestrictionDTO, MosaicGlobalRestrictionDTO } from 'symbol-openapi-typescript-fetch-client';
import { Convert } from '../../../src/core/format';
import { RestrictionMosaicHttp } from '../../../src/infrastructure';
import { MosaicAddressRestrictionItem, UInt64 } from '../../../src/model';
import { Address } from '../../../src/model/account';
import { MosaicId } from '../../../src/model/mosaic';
import {
    MosaicAddressRestriction,
    MosaicGlobalRestriction,
    MosaicGlobalRestrictionItem,
    MosaicRestrictionEntryType,
    MosaicRestrictionType,
} from '../../../src/model/restriction';

describe('MosaicRestrictions', () => {
    const hash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';

    it('should createComplete an MosaicAddressRestriction object', () => {
        const key = UInt64.fromUint(10);
        const value = UInt64.fromUint(1000);

        const mosaicAddressRestriction = new MosaicAddressRestriction(
            hash,
            MosaicRestrictionEntryType.ADDRESS,
            new MosaicId('85BBEA6CC462B244'),
            Address.createFromEncoded('6826D27E1D0A26CA4E316F901E23E55C8711DB20DF250DEF'),
            [new MosaicAddressRestrictionItem(key, value)],
        );

        expect(mosaicAddressRestriction.compositeHash).to.be.equal(hash);
        expect(mosaicAddressRestriction.entryType).to.be.equal(MosaicRestrictionEntryType.ADDRESS);
        expect(mosaicAddressRestriction.targetAddress.plain()).to.be.equal(
            Address.createFromEncoded('6826D27E1D0A26CA4E316F901E23E55C8711DB20DF250DEF').plain(),
        );
        expect(mosaicAddressRestriction.restrictions.length).to.be.equal(1);
        expect(mosaicAddressRestriction.getRestriction(key)!.restrictionValue).to.be.equal(value);

        const serialized = mosaicAddressRestriction.serialize();
        expect(Convert.uint8ToHex(serialized)).eq(
            '44B262C46CEABB856826D27E1D0A26CA4E316F901E23E55C8711DB20DF250DEF010A00000000000000E803000000000000',
        );
        deepEqual(MosaicAddressRestrictionEntryBuilder.loadFromBinary(serialized).serialize(), serialized);
    });

    it('should createComplete an MosaicGlobalRestrictionItem object', () => {
        const key = UInt64.fromUint(10);
        const value = UInt64.fromUint(1000);

        const mosaicGlobalRestrictionItem = new MosaicGlobalRestrictionItem(key, new MosaicId('85BBEA6CC462B244'), value, 1);

        deepEqual(mosaicGlobalRestrictionItem.key, key);
        expect(mosaicGlobalRestrictionItem.referenceMosaicId.toHex()).to.be.equal('85BBEA6CC462B244');
        expect(mosaicGlobalRestrictionItem.restrictionValue).to.be.equal(value);
        expect(mosaicGlobalRestrictionItem.restrictionType).to.be.equal(MosaicRestrictionType.EQ);
    });

    it('should createComplete an MosaicGlobalRestriction object', () => {
        const key = UInt64.fromUint(10);
        const value = UInt64.fromUint(1000);

        const mosaicGlobalRestriction = new MosaicGlobalRestriction(hash, 0, new MosaicId('85BBEA6CC462B244'), [
            new MosaicGlobalRestrictionItem(key, new MosaicId('85BBEA6CC462B244'), value, 1),
        ]);

        expect(mosaicGlobalRestriction.compositeHash).to.be.equal(hash);
        expect(mosaicGlobalRestriction.entryType).to.be.equal(MosaicRestrictionEntryType.ADDRESS);
        expect(mosaicGlobalRestriction.mosaicId.toHex()).to.be.equal('85BBEA6CC462B244');
        expect(mosaicGlobalRestriction.restrictions.length).to.be.equal(1);
        deepEqual(mosaicGlobalRestriction.getRestriction(key)?.key, key);
        expect(mosaicGlobalRestriction.getRestriction(key)?.referenceMosaicId.toHex()).to.be.equal('85BBEA6CC462B244');
        expect(mosaicGlobalRestriction.getRestriction(key)?.restrictionValue).to.be.equal(value);
        expect(mosaicGlobalRestriction.getRestriction(key)?.restrictionType).to.be.equal(MosaicRestrictionType.EQ);
    });

    it('should serialize global restriction and merkle proof', () => {
        const dto: MosaicGlobalRestrictionDTO = {
            mosaicRestrictionEntry: {
                compositeHash: 'F6F00336ECAAFCCDDB88A52C9766522AC04B6090623D450D52D62889476B4FCC',
                entryType: 1,
                mosaicId: '2C31D8CB4E830AC4',
                restrictions: [
                    {
                        key: '60641',
                        restriction: {
                            referenceMosaicId: '0000000000000000',
                            restrictionValue: '1',
                            restrictionType: 6,
                        },
                    },
                ],
            },
            id: '5FA89FFF6D1B44BFCD93B9ED',
        };

        const rawMerklePath =
            '0000000617B94CD8589D2F0177B2B21D01B6E99C1B40BDE9D897EBBF9417EA0350DBCE22D228AFA36359167E6D9D99A08445EFE74D77B6BDE52EC6DAC05DA7C5385A0CF2FF3FC36C4563B0A0510C63005D4F520C5D515E505DF94A452F5907F721DDDDBFF1705CC7DA55E693AF3E7154B3AC6E8572D925143C9105D3F3E9D62136FB45F2A4B1';

        const info = RestrictionMosaicHttp.toMosaicRestriction(dto);

        const serializedHex = Convert.uint8ToHex(info.serialize());
        expect(serializedHex).eq('C40A834ECBD8312C01E1EC0000000000000000000000000000010000000000000006');

        const builder = MosaicGlobalRestrictionEntryBuilder.loadFromBinary(Convert.hexToUint8(serializedHex));
        expect(new MosaicId(builder.mosaicId.getMosaicId()).toHex()).eq(dto.mosaicRestrictionEntry.mosaicId);
        expect(builder.getKeyPairs().getKeys().length).eq(1);
        expect(new UInt64(builder.getKeyPairs().getKeys()[0].getKey().getMosaicRestrictionKey()).toString()).eq('60641');

        expect(new MosaicId(builder.getKeyPairs().getKeys()[0].getRestrictionRule()!.getReferenceMosaicId().getMosaicId()).toHex()).eq(
            '0000000000000000',
        );

        expect(new UInt64(builder.getKeyPairs().getKeys()[0].getRestrictionRule()!.getRestrictionValue()).toString()).eq('1');

        expect(builder.getKeyPairs().getKeys()[0].getRestrictionRule()!.getRestrictionType()).eq(6);
    });

    it('should serialize global restriction and merkle proff', () => {
        const dto: MosaicAddressRestrictionDTO = {
            mosaicRestrictionEntry: {
                compositeHash: '9AFD43230CAC7ACC6D9412623298B305CE593CB96F7487E4969D150FC6A54906',
                entryType: 0,
                mosaicId: '2C31D8CB4E830AC4',
                targetAddress: '9884C481C023D730A1C964F26A97DC59B88AC95B52590550',
                restrictions: [
                    {
                        key: '60641',
                        value: '2',
                    },
                ],
            },
            id: '5FA8A0156D1B44BFCD93BA0F',
        };

        const rawMerklePath =
            '0000000617B94CD8589D2F0177B2B21D01B6E99C1B40BDE9D897EBBF9417EA0350DBCE22D228AFA36359167E6D9D99A08445EFE74D77B6BDE52EC6DAC05DA7C5385A0CF2FF3F79E09654679180FE39E8DC88DB73226989F9CB72A59E3615E1F4133EE36B9C404A78DF6E2FEE38F54451C9E890C041AE91537CE413DCC95D3EFC57D97B2F9963';

        const info = RestrictionMosaicHttp.toMosaicRestriction(dto);

        const serializedHex = Convert.uint8ToHex(info.serialize());
        expect(serializedHex).eq('C40A834ECBD8312C9884C481C023D730A1C964F26A97DC59B88AC95B5259055001E1EC0000000000000200000000000000');

        const builder = MosaicAddressRestrictionEntryBuilder.loadFromBinary(Convert.hexToUint8(serializedHex));
        expect(new MosaicId(builder.mosaicId.getMosaicId()).toHex()).eq(dto.mosaicRestrictionEntry.mosaicId);
        expect(builder.getKeyPairs().getKeys().length).eq(1);
        expect(new UInt64(builder.getKeyPairs().getKeys()[0].getKey().getMosaicRestrictionKey()).toString()).eq('60641');

        expect(new UInt64(builder.getKeyPairs().getKeys()[0].getValue()).toString()).eq('2');
    });
});
