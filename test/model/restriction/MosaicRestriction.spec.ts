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
import { MosaicAddressRestrictionEntryBuilder } from 'catbuffer-typescript';
import { expect } from 'chai';
import { Convert } from '../../../src/core/format';
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
});
