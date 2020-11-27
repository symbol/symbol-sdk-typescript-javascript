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
import { MosaicRestrictionEntryBuilder } from 'catbuffer-typescript';
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
        const key = UInt64.fromNumericString('60641');
        const value = UInt64.fromUint(2);

        const mosaicAddressRestriction = new MosaicAddressRestriction(
            hash,
            MosaicRestrictionEntryType.ADDRESS,
            new MosaicId('7EF64E60AC61127E'),
            Address.createFromEncoded('98090DC48CAE2D6FBF2F9B44CB09DFC2365076550BE017CA'),
            [new MosaicAddressRestrictionItem(key, value)],
        );

        expect(mosaicAddressRestriction.compositeHash).to.be.equal(hash);
        expect(mosaicAddressRestriction.entryType).to.be.equal(MosaicRestrictionEntryType.ADDRESS);
        expect(mosaicAddressRestriction.targetAddress.plain()).to.be.equal(
            Address.createFromEncoded('98090DC48CAE2D6FBF2F9B44CB09DFC2365076550BE017CA').plain(),
        );
        expect(mosaicAddressRestriction.restrictions.length).to.be.equal(1);
        expect(mosaicAddressRestriction.getRestriction(key)!.restrictionValue).to.be.equal(value);

        const serialized = mosaicAddressRestriction.serialize();
        expect(Convert.uint8ToHex(serialized)).eq(
            '0100007E1261AC604EF67E98090DC48CAE2D6FBF2F9B44CB09DFC2365076550BE017CA01E1EC0000000000000200000000000000',
        );
        deepEqual(MosaicRestrictionEntryBuilder.loadFromBinary(serialized).serialize(), serialized);
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
        const info = RestrictionMosaicHttp.toMosaicRestriction(dto);

        const serializedHex = Convert.uint8ToHex(info.serialize());
        expect(serializedHex).eq('010001C40A834ECBD8312C01E1EC0000000000000000000000000000010000000000000006');

        const builder = MosaicRestrictionEntryBuilder.loadFromBinary(Convert.hexToUint8(serializedHex));
        expect(new MosaicId(builder.globalEntry!.mosaicId.getMosaicId()).toHex()).eq(dto.mosaicRestrictionEntry.mosaicId);
        expect(builder.globalEntry!.getKeyPairs().getKeys().length).eq(1);
        expect(new UInt64(builder.globalEntry!.getKeyPairs().getKeys()[0].getKey().getMosaicRestrictionKey()).toString()).eq('60641');

        expect(
            new MosaicId(
                builder.globalEntry!.getKeyPairs().getKeys()[0].getRestrictionRule()!.getReferenceMosaicId().getMosaicId(),
            ).toHex(),
        ).eq('0000000000000000');

        expect(new UInt64(builder.globalEntry!.getKeyPairs().getKeys()[0].getRestrictionRule()!.getRestrictionValue()).toString()).eq('1');

        expect(builder.globalEntry!.getKeyPairs().getKeys()[0].getRestrictionRule()!.getRestrictionType()).eq(6);
    });

    it('should serialize address restriction and merkle proof', () => {
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
        const info = RestrictionMosaicHttp.toMosaicRestriction(dto);

        const serializedHex = Convert.uint8ToHex(info.serialize());
        expect(serializedHex).eq(
            '010000C40A834ECBD8312C9884C481C023D730A1C964F26A97DC59B88AC95B5259055001E1EC0000000000000200000000000000',
        );

        const builder = MosaicRestrictionEntryBuilder.loadFromBinary(Convert.hexToUint8(serializedHex));
        expect(new MosaicId(builder.getAddressEntry().mosaicId.getMosaicId()).toHex()).eq(dto.mosaicRestrictionEntry.mosaicId);
        expect(builder.getAddressEntry().getKeyPairs().getKeys().length).eq(1);
        expect(new UInt64(builder.getAddressEntry().getKeyPairs().getKeys()[0].getKey().getMosaicRestrictionKey()).toString()).eq('60641');
        expect(new UInt64(builder.getAddressEntry().getKeyPairs().getKeys()[0].getValue()).toString()).eq('2');
    });
});
