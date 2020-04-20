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
import { PublicAccount } from '../../../src/model/account/PublicAccount';
import { MosaicFlags } from '../../../src/model/mosaic/MosaicFlags';
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import { MosaicInfo } from '../../../src/model/mosaic/MosaicInfo';
import { NetworkType } from '../../../src/model/network/NetworkType';
import { UInt64 } from '../../../src/model/UInt64';

describe('MosaicInfo', () => {
    const mosaicInfoDTO = {
        meta: {
            id: '59FDA0733F17CF0001772CBC',
        },
        mosaic: {
            mosaicId: new MosaicId([3646934825, 3576016193]),
            supply: new UInt64([3403414400, 2095475]),
            height: new UInt64([1, 0]),
            owner: PublicAccount.createFromPublicKey(
                'B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF',
                NetworkType.MIJIN_TEST,
            ),
            revision: 1,
            flags: 7,
            divisibility: 3,
            duration: '1000',
        },
    };

    it('should createComplete an MosaicInfo object', () => {
        const mosaicInfo = new MosaicInfo(
            mosaicInfoDTO.mosaic.mosaicId,
            mosaicInfoDTO.mosaic.supply,
            mosaicInfoDTO.mosaic.height,
            mosaicInfoDTO.mosaic.owner,
            mosaicInfoDTO.mosaic.revision,
            new MosaicFlags(mosaicInfoDTO.mosaic.flags),
            mosaicInfoDTO.mosaic.divisibility,
            UInt64.fromNumericString(mosaicInfoDTO.mosaic.duration),
        );

        deepEqual(mosaicInfo.id, mosaicInfoDTO.mosaic.mosaicId);
        deepEqual(mosaicInfo.supply, mosaicInfoDTO.mosaic.supply);
        deepEqual(mosaicInfo.height, mosaicInfoDTO.mosaic.height);
        expect(mosaicInfo.owner).to.be.equal(mosaicInfoDTO.mosaic.owner);
        deepEqual(mosaicInfo.revision, mosaicInfoDTO.mosaic.revision);

        expect(mosaicInfo.divisibility).to.be.equal(mosaicInfoDTO.mosaic.divisibility);
        deepEqual(mosaicInfo.duration.toString(), mosaicInfoDTO.mosaic.duration);
    });

    it('should createComplete an MosaicInfo object without duration', () => {
        mosaicInfoDTO.mosaic.duration = '0';
        const mosaicInfo = new MosaicInfo(
            mosaicInfoDTO.mosaic.mosaicId,
            mosaicInfoDTO.mosaic.supply,
            mosaicInfoDTO.mosaic.height,
            mosaicInfoDTO.mosaic.owner,
            mosaicInfoDTO.mosaic.revision,
            new MosaicFlags(mosaicInfoDTO.mosaic.flags),
            mosaicInfoDTO.mosaic.divisibility,
            UInt64.fromNumericString(mosaicInfoDTO.mosaic.duration),
        );

        deepEqual(mosaicInfo.id, mosaicInfoDTO.mosaic.mosaicId);
        deepEqual(mosaicInfo.supply, mosaicInfoDTO.mosaic.supply);
        deepEqual(mosaicInfo.height, mosaicInfoDTO.mosaic.height);
        expect(mosaicInfo.owner).to.be.equal(mosaicInfoDTO.mosaic.owner);
        deepEqual(mosaicInfo.revision, mosaicInfoDTO.mosaic.revision);

        expect(mosaicInfo.divisibility).to.be.equal(mosaicInfoDTO.mosaic.divisibility);
        deepEqual(mosaicInfo.duration.toDTO(), [0, 0]);
    });

    describe('isSupplyMutable', () => {
        it("should return true when it's mutable", () => {
            const mosaicInfo = new MosaicInfo(
                mosaicInfoDTO.mosaic.mosaicId,
                mosaicInfoDTO.mosaic.supply,
                mosaicInfoDTO.mosaic.height,
                mosaicInfoDTO.mosaic.owner,
                mosaicInfoDTO.mosaic.revision,
                MosaicFlags.create(true, false, false),
                mosaicInfoDTO.mosaic.divisibility,
                UInt64.fromNumericString(mosaicInfoDTO.mosaic.duration),
            );
            expect(mosaicInfo.isSupplyMutable()).to.be.equal(true);
        });

        it("should return false when it's immutable", () => {
            const mosaicInfo = new MosaicInfo(
                mosaicInfoDTO.mosaic.mosaicId,
                mosaicInfoDTO.mosaic.supply,
                mosaicInfoDTO.mosaic.height,
                mosaicInfoDTO.mosaic.owner,
                mosaicInfoDTO.mosaic.revision,
                MosaicFlags.create(false, false, false),
                mosaicInfoDTO.mosaic.divisibility,
                UInt64.fromNumericString(mosaicInfoDTO.mosaic.duration),
            );
            expect(mosaicInfo.isSupplyMutable()).to.be.equal(false);
        });
    });

    describe('isTransferable', () => {
        it("should return true when it's transferable", () => {
            const mosaicInfo = new MosaicInfo(
                mosaicInfoDTO.mosaic.mosaicId,
                mosaicInfoDTO.mosaic.supply,
                mosaicInfoDTO.mosaic.height,
                mosaicInfoDTO.mosaic.owner,
                mosaicInfoDTO.mosaic.revision,
                MosaicFlags.create(false, true, false),
                mosaicInfoDTO.mosaic.divisibility,
                UInt64.fromNumericString(mosaicInfoDTO.mosaic.duration),
            );
            expect(mosaicInfo.isTransferable()).to.be.equal(true);
        });

        it("should return false when it's not transferable", () => {
            const mosaicInfo = new MosaicInfo(
                mosaicInfoDTO.mosaic.mosaicId,
                mosaicInfoDTO.mosaic.supply,
                mosaicInfoDTO.mosaic.height,
                mosaicInfoDTO.mosaic.owner,
                mosaicInfoDTO.mosaic.revision,
                MosaicFlags.create(false, false, false),
                mosaicInfoDTO.mosaic.divisibility,
                UInt64.fromNumericString(mosaicInfoDTO.mosaic.duration),
            );
            expect(mosaicInfo.isTransferable()).to.be.equal(false);
        });
    });

    describe('isRestrictable', () => {
        it("should return true when it's restrictable", () => {
            const mosaicInfo = new MosaicInfo(
                mosaicInfoDTO.mosaic.mosaicId,
                mosaicInfoDTO.mosaic.supply,
                mosaicInfoDTO.mosaic.height,
                mosaicInfoDTO.mosaic.owner,
                mosaicInfoDTO.mosaic.revision,
                MosaicFlags.create(false, false, true),
                mosaicInfoDTO.mosaic.divisibility,
                UInt64.fromNumericString(mosaicInfoDTO.mosaic.duration),
            );
            expect(mosaicInfo.isRestrictable()).to.be.equal(true);
        });

        it("should return false when it's not restrictable", () => {
            const mosaicInfo = new MosaicInfo(
                mosaicInfoDTO.mosaic.mosaicId,
                mosaicInfoDTO.mosaic.supply,
                mosaicInfoDTO.mosaic.height,
                mosaicInfoDTO.mosaic.owner,
                mosaicInfoDTO.mosaic.revision,
                MosaicFlags.create(false, false, false),
                mosaicInfoDTO.mosaic.divisibility,
                UInt64.fromNumericString(mosaicInfoDTO.mosaic.duration),
            );
            expect(mosaicInfo.isRestrictable()).to.be.equal(false);
        });
    });
});
