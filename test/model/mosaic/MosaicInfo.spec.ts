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
import { MosaicEntryBuilder } from 'catbuffer-typescript';
import { expect } from 'chai';
import { MosaicInfoDTO } from 'symbol-openapi-typescript-fetch-client';
import { Convert } from '../../../src/core/format';
import { MosaicHttp } from '../../../src/infrastructure';
import { Address } from '../../../src/model/account/Address';
import { MosaicFlags } from '../../../src/model/mosaic/MosaicFlags';
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import { MosaicInfo } from '../../../src/model/mosaic/MosaicInfo';
import { NetworkType } from '../../../src/model/network/NetworkType';
import { UInt64 } from '../../../src/model/UInt64';

describe('MosaicInfo', () => {
    const mosaicInfoDTO = {
        id: '59FDA0733F17CF0001772CBC',
        mosaic: {
            id: new MosaicId([3646934825, 3576016193]),
            supply: new UInt64([3403414400, 2095475]),
            startHeight: new UInt64([1, 0]),
            ownerAddress: Address.createFromPublicKey(
                'B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF',
                NetworkType.PRIVATE_TEST,
            ),
            revision: 1,
            flags: 7,
            divisibility: 3,
            duration: '1000',
        },
    };

    it('should createComplete an MosaicInfo object', () => {
        const mosaicInfo = new MosaicInfo(
            mosaicInfoDTO.id,
            mosaicInfoDTO.mosaic.id,
            mosaicInfoDTO.mosaic.supply,
            mosaicInfoDTO.mosaic.startHeight,
            mosaicInfoDTO.mosaic.ownerAddress,
            mosaicInfoDTO.mosaic.revision,
            new MosaicFlags(mosaicInfoDTO.mosaic.flags),
            mosaicInfoDTO.mosaic.divisibility,
            UInt64.fromNumericString(mosaicInfoDTO.mosaic.duration),
        );

        deepEqual(mosaicInfo.recordId, mosaicInfoDTO.id);
        deepEqual(mosaicInfo.id, mosaicInfoDTO.mosaic.id);
        deepEqual(mosaicInfo.supply, mosaicInfoDTO.mosaic.supply);
        deepEqual(mosaicInfo.startHeight, mosaicInfoDTO.mosaic.startHeight);
        expect(mosaicInfo.ownerAddress.equals(mosaicInfoDTO.mosaic.ownerAddress)).to.be.true;
        deepEqual(mosaicInfo.revision, mosaicInfoDTO.mosaic.revision);

        expect(mosaicInfo.divisibility).to.be.equal(mosaicInfoDTO.mosaic.divisibility);
        deepEqual(mosaicInfo.duration.toString(), mosaicInfoDTO.mosaic.duration);

        const serialized = mosaicInfo.serialize();
        expect(Convert.uint8ToHex(serialized)).eq(
            '010029CF5FD941AD25D580FBDBCA73F91F0001000000000000008022D04812D05000F96C283657B0C17990932BC849B1E811010000000703E803000000000000',
        );
        deepEqual(MosaicEntryBuilder.loadFromBinary(serialized).serialize(), serialized);
    });

    it('should createComplete an MosaicInfo object without duration', () => {
        mosaicInfoDTO.mosaic.duration = '0';
        const mosaicInfo = new MosaicInfo(
            mosaicInfoDTO.id,
            mosaicInfoDTO.mosaic.id,
            mosaicInfoDTO.mosaic.supply,
            mosaicInfoDTO.mosaic.startHeight,
            mosaicInfoDTO.mosaic.ownerAddress,
            mosaicInfoDTO.mosaic.revision,
            new MosaicFlags(mosaicInfoDTO.mosaic.flags),
            mosaicInfoDTO.mosaic.divisibility,
            UInt64.fromNumericString(mosaicInfoDTO.mosaic.duration),
        );

        deepEqual(mosaicInfo.recordId, mosaicInfoDTO.id);
        deepEqual(mosaicInfo.id, mosaicInfoDTO.mosaic.id);
        deepEqual(mosaicInfo.supply, mosaicInfoDTO.mosaic.supply);
        deepEqual(mosaicInfo.startHeight, mosaicInfoDTO.mosaic.startHeight);
        expect(mosaicInfo.ownerAddress.equals(mosaicInfoDTO.mosaic.ownerAddress)).to.be.true;
        deepEqual(mosaicInfo.revision, mosaicInfoDTO.mosaic.revision);

        expect(mosaicInfo.divisibility).to.be.equal(mosaicInfoDTO.mosaic.divisibility);
        deepEqual(mosaicInfo.duration.toDTO(), [0, 0]);

        const serialized = mosaicInfo.serialize();
        expect(Convert.uint8ToHex(serialized)).eq(
            '010029CF5FD941AD25D580FBDBCA73F91F0001000000000000008022D04812D05000F96C283657B0C17990932BC849B1E8110100000007030000000000000000',
        );
        deepEqual(MosaicEntryBuilder.loadFromBinary(serialized).serialize(), serialized);
    });

    describe('isSupplyMutable', () => {
        it("should return true when it's mutable", () => {
            const mosaicInfo = new MosaicInfo(
                mosaicInfoDTO.id,
                mosaicInfoDTO.mosaic.id,
                mosaicInfoDTO.mosaic.supply,
                mosaicInfoDTO.mosaic.startHeight,
                mosaicInfoDTO.mosaic.ownerAddress,
                mosaicInfoDTO.mosaic.revision,
                MosaicFlags.create(true, false, false),
                mosaicInfoDTO.mosaic.divisibility,
                UInt64.fromNumericString(mosaicInfoDTO.mosaic.duration),
            );
            expect(mosaicInfo.isSupplyMutable()).to.be.equal(true);
        });

        it("should return false when it's immutable", () => {
            const mosaicInfo = new MosaicInfo(
                mosaicInfoDTO.id,
                mosaicInfoDTO.mosaic.id,
                mosaicInfoDTO.mosaic.supply,
                mosaicInfoDTO.mosaic.startHeight,
                mosaicInfoDTO.mosaic.ownerAddress,
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
                mosaicInfoDTO.id,
                mosaicInfoDTO.mosaic.id,
                mosaicInfoDTO.mosaic.supply,
                mosaicInfoDTO.mosaic.startHeight,
                mosaicInfoDTO.mosaic.ownerAddress,
                mosaicInfoDTO.mosaic.revision,
                MosaicFlags.create(false, true, false),
                mosaicInfoDTO.mosaic.divisibility,
                UInt64.fromNumericString(mosaicInfoDTO.mosaic.duration),
            );
            expect(mosaicInfo.isTransferable()).to.be.equal(true);
        });

        it("should return false when it's not transferable", () => {
            const mosaicInfo = new MosaicInfo(
                mosaicInfoDTO.id,
                mosaicInfoDTO.mosaic.id,
                mosaicInfoDTO.mosaic.supply,
                mosaicInfoDTO.mosaic.startHeight,
                mosaicInfoDTO.mosaic.ownerAddress,
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
                mosaicInfoDTO.id,
                mosaicInfoDTO.mosaic.id,
                mosaicInfoDTO.mosaic.supply,
                mosaicInfoDTO.mosaic.startHeight,
                mosaicInfoDTO.mosaic.ownerAddress,
                mosaicInfoDTO.mosaic.revision,
                MosaicFlags.create(false, false, true),
                mosaicInfoDTO.mosaic.divisibility,
                UInt64.fromNumericString(mosaicInfoDTO.mosaic.duration),
            );
            expect(mosaicInfo.isRestrictable()).to.be.equal(true);
        });

        it("should return false when it's not restrictable", () => {
            const mosaicInfo = new MosaicInfo(
                mosaicInfoDTO.id,
                mosaicInfoDTO.mosaic.id,
                mosaicInfoDTO.mosaic.supply,
                mosaicInfoDTO.mosaic.startHeight,
                mosaicInfoDTO.mosaic.ownerAddress,
                mosaicInfoDTO.mosaic.revision,
                MosaicFlags.create(false, false, false),
                mosaicInfoDTO.mosaic.divisibility,
                UInt64.fromNumericString(mosaicInfoDTO.mosaic.duration),
            );
            expect(mosaicInfo.isRestrictable()).to.be.equal(false);
        });

        it('should serialize and state proof', () => {
            const dto: MosaicInfoDTO = {
                mosaic: {
                    id: '725CEC19BBA31720',
                    supply: '15000000',
                    startHeight: '1',
                    ownerAddress: '9857C93C1E3FA4FACA0534AB12B8DE85BB2E7A4ECD24768B',
                    revision: 1,
                    flags: 3,
                    divisibility: 3,
                    duration: '0',
                },
                id: '5FA893BB6D1B44BFCD93AEA4',
            };
            const info = MosaicHttp.toMosaicInfo(dto);

            const serializedHex = Convert.uint8ToHex(info.serialize());
            expect(serializedHex).eq(
                '01002017A3BB19EC5C72C0E1E4000000000001000000000000009857C93C1E3FA4FACA0534AB12B8DE85BB2E7A4ECD24768B0100000003030000000000000000',
            );
        });
    });
});
