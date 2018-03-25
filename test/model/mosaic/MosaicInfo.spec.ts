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

import {deepEqual} from 'assert';
import {expect} from 'chai';
import {MosaicInfo} from '../../../src/model/mosaic/MosaicInfo';
import {MosaicProperties} from '../../../src/model/mosaic/MosaicProperties';
import {UInt64} from '../../../src/model/UInt64';
import {PublicAccount} from '../../../src/model/account/PublicAccount';
import {NetworkType} from '../../../src/model/blockchain/NetworkType';
import {MosaicId} from '../../../src/model/mosaic/MosaicId';
import {NamespaceId} from '../../../src/model/namespace/NamespaceId';

describe('MosaicInfo', () => {
    const mosaicInfoDTO = {
        meta: {
            active: true,
            id: '59FDA0733F17CF0001772CBC',
            index: 0,
        },
        mosaic: {
            height: new UInt64([1, 0]),
            levy: {},
            mosaicId: new MosaicId([3646934825, 3576016193]),
            namespaceId: new NamespaceId([929036875, 2226345261]),
            owner: PublicAccount.createFromPublicKey('B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF',
                NetworkType.MIJIN_TEST),
            properties: [
                new UInt64([
                    6,
                    0,
                ]),
                new UInt64([
                    3,
                    0,
                ]),
                new UInt64([
                    1000,
                    0,
                ]),
            ],
            supply: new UInt64([3403414400, 2095475]),
        },
    };

    before(() => {

    });

    it('should createComplete an MosaicInfo object', () => {
        const mosaicInfo = new MosaicInfo(
            mosaicInfoDTO.meta.active,
            mosaicInfoDTO.meta.index,
            mosaicInfoDTO.meta.id,
            mosaicInfoDTO.mosaic.namespaceId,
            mosaicInfoDTO.mosaic.mosaicId,
            mosaicInfoDTO.mosaic.supply,
            mosaicInfoDTO.mosaic.height,
            mosaicInfoDTO.mosaic.owner,
            new MosaicProperties(
                mosaicInfoDTO.mosaic.properties[0],
                mosaicInfoDTO.mosaic.properties[1].compact(),
                mosaicInfoDTO.mosaic.properties[2],
            ),
            mosaicInfoDTO.mosaic.levy,
        );

        expect(mosaicInfo.active).to.be.equal(mosaicInfoDTO.meta.active);
        expect(mosaicInfo.index).to.be.equal(mosaicInfoDTO.meta.index);
        expect(mosaicInfo.metaId).to.be.equal(mosaicInfoDTO.meta.id);
        deepEqual(mosaicInfo.namespaceId, mosaicInfoDTO.mosaic.namespaceId);
        deepEqual(mosaicInfo.mosaicId, mosaicInfoDTO.mosaic.mosaicId);
        deepEqual(mosaicInfo.supply, mosaicInfoDTO.mosaic.supply);
        deepEqual(mosaicInfo.height, mosaicInfoDTO.mosaic.height);
        expect(mosaicInfo.owner).to.be.equal(mosaicInfoDTO.mosaic.owner);

        expect(mosaicInfo.divisibility).to.be.equal(mosaicInfoDTO.mosaic.properties[1].lower);
        deepEqual(mosaicInfo.duration, mosaicInfoDTO.mosaic.properties[2]);

    });

    describe('isSupplyMutable', () => {
        it('should return true when it\'s mutable', () => {
            const mosaicInfo = new MosaicInfo(
                mosaicInfoDTO.meta.active,
                mosaicInfoDTO.meta.index,
                mosaicInfoDTO.meta.id,
                mosaicInfoDTO.mosaic.namespaceId,
                mosaicInfoDTO.mosaic.mosaicId,
                mosaicInfoDTO.mosaic.supply,
                mosaicInfoDTO.mosaic.height,
                mosaicInfoDTO.mosaic.owner,
                MosaicProperties.create({
                    supplyMutable: true,
                    transferable: false,
                    levyMutable: false,
                    divisibility: mosaicInfoDTO.mosaic.properties[1].compact(),
                    duration: mosaicInfoDTO.mosaic.properties[2],
                }),
                mosaicInfoDTO.mosaic.levy,
                )
            ;
            expect(mosaicInfo.isSupplyMutable()).to.be.equal(true);
        });

        it('should return false when it\'s immutable', () => {
            const mosaicInfo = new MosaicInfo(
                mosaicInfoDTO.meta.active,
                mosaicInfoDTO.meta.index,
                mosaicInfoDTO.meta.id,
                mosaicInfoDTO.mosaic.namespaceId,
                mosaicInfoDTO.mosaic.mosaicId,
                mosaicInfoDTO.mosaic.supply,
                mosaicInfoDTO.mosaic.height,
                mosaicInfoDTO.mosaic.owner,
                MosaicProperties.create({
                    supplyMutable: false,
                    transferable: false,
                    levyMutable: false,
                    divisibility: mosaicInfoDTO.mosaic.properties[1].compact(),
                    duration: mosaicInfoDTO.mosaic.properties[2],
                }),
                mosaicInfoDTO.mosaic.levy,
            );
            expect(mosaicInfo.isSupplyMutable()).to.be.equal(false);
        });
    });

    describe('isTransferable', () => {
        it('should return true when it\'s transferable', () => {
            const mosaicInfo = new MosaicInfo(
                mosaicInfoDTO.meta.active,
                mosaicInfoDTO.meta.index,
                mosaicInfoDTO.meta.id,
                mosaicInfoDTO.mosaic.namespaceId,
                mosaicInfoDTO.mosaic.mosaicId,
                mosaicInfoDTO.mosaic.supply,
                mosaicInfoDTO.mosaic.height,
                mosaicInfoDTO.mosaic.owner,
                MosaicProperties.create({
                    supplyMutable: false,
                    transferable: true,
                    levyMutable: false,
                    divisibility: mosaicInfoDTO.mosaic.properties[1].compact(),
                    duration: mosaicInfoDTO.mosaic.properties[2],
                }),
                mosaicInfoDTO.mosaic.levy,
            );
            expect(mosaicInfo.isTransferable()).to.be.equal(true);
        });

        it('should return false when it\'s not transferable', () => {
            const mosaicInfo = new MosaicInfo(
                mosaicInfoDTO.meta.active,
                mosaicInfoDTO.meta.index,
                mosaicInfoDTO.meta.id,
                mosaicInfoDTO.mosaic.namespaceId,
                mosaicInfoDTO.mosaic.mosaicId,
                mosaicInfoDTO.mosaic.supply,
                mosaicInfoDTO.mosaic.height,
                mosaicInfoDTO.mosaic.owner,
                MosaicProperties.create({
                    supplyMutable: false,
                    transferable: false,
                    levyMutable: false,
                    divisibility: mosaicInfoDTO.mosaic.properties[1].compact(),
                    duration: mosaicInfoDTO.mosaic.properties[2],
                }),
                mosaicInfoDTO.mosaic.levy,
            );
            expect(mosaicInfo.isTransferable()).to.be.equal(false);
        });
    });

    describe('isLevyMutable', () => {
        it('should return true when it\'s mutable', () => {
            const mosaicInfo = new MosaicInfo(
                mosaicInfoDTO.meta.active,
                mosaicInfoDTO.meta.index,
                mosaicInfoDTO.meta.id,
                mosaicInfoDTO.mosaic.namespaceId,
                mosaicInfoDTO.mosaic.mosaicId,
                mosaicInfoDTO.mosaic.supply,
                mosaicInfoDTO.mosaic.height,
                mosaicInfoDTO.mosaic.owner,
                MosaicProperties.create({
                    supplyMutable: true,
                    transferable: false,
                    levyMutable: true,
                    divisibility: mosaicInfoDTO.mosaic.properties[1].compact(),
                    duration: mosaicInfoDTO.mosaic.properties[2],
                }),
                mosaicInfoDTO.mosaic.levy,
            );
            expect(mosaicInfo.isLevyMutable()).to.be.equal(true);
        });

        it('should return false when it\'s immutable', () => {
            const mosaicInfo = new MosaicInfo(
                mosaicInfoDTO.meta.active,
                mosaicInfoDTO.meta.index,
                mosaicInfoDTO.meta.id,
                mosaicInfoDTO.mosaic.namespaceId,
                mosaicInfoDTO.mosaic.mosaicId,
                mosaicInfoDTO.mosaic.supply,
                mosaicInfoDTO.mosaic.height,
                mosaicInfoDTO.mosaic.owner,
                MosaicProperties.create({
                    supplyMutable: false,
                    transferable: false,
                    levyMutable: false,
                    divisibility: mosaicInfoDTO.mosaic.properties[1].compact(),
                    duration: mosaicInfoDTO.mosaic.properties[2],
                }),
                mosaicInfoDTO.mosaic.levy,
            );
            expect(mosaicInfo.isLevyMutable()).to.be.equal(false);
        });
    });
});
