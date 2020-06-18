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

import { expect } from 'chai';
import { Address } from '../../../src/model/account/Address';
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import { MosaicAddressRestriction } from '../../../src/model/restriction/MosaicAddressRestriction';
import { MosaicGlobalRestriction } from '../../../src/model/restriction/MosaicGlobalRestriction';
import { MosaicGlobalRestrictionItem } from '../../../src/model/restriction/MosaicGlobalRestrictionItem';
import { MosaicRestrictionEntryType } from '../../../src/model/restriction/MosaicRestrictionEntryType';
import { MosaicRestrictionType } from '../../../src/model/restriction/MosaicRestrictionType';

describe('MosaicRestrictions', () => {
    const hash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';

    it('should createComplete an MosaicAddressRestriction object', () => {
        const mosaicAddressRestrictionDTO = {
            compositeHash: hash,
            entryType: 0,
            mosaicId: '85BBEA6CC462B244',
            targetAddress: '6826D27E1D0A26CA4E316F901E23E55C8711DB20DF250DEF',
            restrictions: [
                {
                    key: 'testKey',
                    value: 'testValue',
                },
            ],
        };

        const mosaicAddressRestriction = new MosaicAddressRestriction(
            mosaicAddressRestrictionDTO.compositeHash,
            mosaicAddressRestrictionDTO.entryType,
            new MosaicId(mosaicAddressRestrictionDTO.mosaicId),
            Address.createFromEncoded(mosaicAddressRestrictionDTO.targetAddress),
            new Map<string, string>().set(
                mosaicAddressRestrictionDTO.restrictions[0].key,
                mosaicAddressRestrictionDTO.restrictions[0].value,
            ),
        );

        expect(mosaicAddressRestriction.compositeHash).to.be.equal(hash);
        expect(mosaicAddressRestriction.entryType).to.be.equal(MosaicRestrictionEntryType.ADDRESS);
        expect(mosaicAddressRestriction.targetAddress.plain()).to.be.equal(
            Address.createFromEncoded('6826D27E1D0A26CA4E316F901E23E55C8711DB20DF250DEF').plain(),
        );
        expect(mosaicAddressRestriction.restrictions.size).to.be.equal(1);
        expect(mosaicAddressRestriction.restrictions.get('testKey')).to.not.be.equal(undefined);
    });

    it('should createComplete an MosaicGlobalRestrictionItem object', () => {
        const mosaicGlobalRestrictionItemDTO = {
            referenceMosaicId: '85BBEA6CC462B244',
            restrictionValue: '123',
            restrictionType: 1,
        };

        const mosaicGlobalRestrictionItem = new MosaicGlobalRestrictionItem(
            new MosaicId(mosaicGlobalRestrictionItemDTO.referenceMosaicId),
            mosaicGlobalRestrictionItemDTO.restrictionValue,
            mosaicGlobalRestrictionItemDTO.restrictionType,
        );

        expect(mosaicGlobalRestrictionItem.referenceMosaicId.toHex()).to.be.equal('85BBEA6CC462B244');
        expect(mosaicGlobalRestrictionItem.restrictionValue).to.be.equal('123');
        expect(mosaicGlobalRestrictionItem.restrictionType).to.be.equal(MosaicRestrictionType.EQ);
    });

    it('should createComplete an MosaicGlobalRestriction object', () => {
        const mosaicGlobalRestrictionDTO = {
            compositeHash: hash,
            entryType: 0,
            mosaicId: '85BBEA6CC462B244',
            restrictions: [
                {
                    key: 'testKey',
                    restriction: {
                        referenceMosaicId: '85BBEA6CC462B244',
                        restrictionValue: '123',
                        restrictionType: 1,
                    },
                },
            ],
        };

        const mosaicGlobalRestriction = new MosaicGlobalRestriction(
            mosaicGlobalRestrictionDTO.compositeHash,
            mosaicGlobalRestrictionDTO.entryType,
            new MosaicId(mosaicGlobalRestrictionDTO.mosaicId),
            new Map<string, MosaicGlobalRestrictionItem>().set(
                mosaicGlobalRestrictionDTO.restrictions[0].key,
                new MosaicGlobalRestrictionItem(
                    new MosaicId(mosaicGlobalRestrictionDTO.restrictions[0].restriction.referenceMosaicId),
                    mosaicGlobalRestrictionDTO.restrictions[0].restriction.restrictionValue,
                    mosaicGlobalRestrictionDTO.restrictions[0].restriction.restrictionType,
                ),
            ),
        );

        expect(mosaicGlobalRestriction.compositeHash).to.be.equal(hash);
        expect(mosaicGlobalRestriction.entryType).to.be.equal(MosaicRestrictionEntryType.ADDRESS);
        expect(mosaicGlobalRestriction.mosaicId.toHex()).to.be.equal('85BBEA6CC462B244');
        expect(mosaicGlobalRestriction.restrictions.size).to.be.equal(1);
        expect(mosaicGlobalRestriction.restrictions.get('testKey')).to.not.be.equal(undefined);
        expect(mosaicGlobalRestriction.restrictions.get('testKey')!.referenceMosaicId.toHex()).to.be.equal('85BBEA6CC462B244');
        expect(mosaicGlobalRestriction.restrictions.get('testKey')!.restrictionValue).to.be.equal('123');
        expect(mosaicGlobalRestriction.restrictions.get('testKey')!.restrictionType).to.be.equal(MosaicRestrictionType.EQ);
    });
});
