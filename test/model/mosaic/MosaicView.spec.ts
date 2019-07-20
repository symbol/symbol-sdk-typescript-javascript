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

import {expect} from 'chai';
import {PublicAccount} from '../../../src/model/account/PublicAccount';
import {NetworkType} from '../../../src/model/blockchain/NetworkType';
import {MosaicId} from '../../../src/model/mosaic/MosaicId';
import {MosaicInfo} from '../../../src/model/mosaic/MosaicInfo';
import {MosaicProperties} from '../../../src/model/mosaic/MosaicProperties';
import {UInt64} from '../../../src/model/UInt64';
import {MosaicView} from '../../../src/service/MosaicView';

describe('MosaicView', () => {

    let mosaicInfo: MosaicInfo;

    before(() => {
        mosaicInfo = new MosaicInfo(
            '59FDA0733F17CF0001772CBC',
            new MosaicId([3294802500, 2243684972]),
            new UInt64([3403414400, 2095475]), // supply
            new UInt64([1, 0]), // height
            PublicAccount.createFromPublicKey('B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF', NetworkType.MIJIN_TEST),
            1, // revision
            MosaicProperties.create({
                supplyMutable: true,
                transferable: true,
                divisibility: 2,
                restrictable: true,
                duration: UInt64.fromUint(1000),
            }));
    });

    it('should createComplete a Mosaic View', () => {
        const mosaicView = new MosaicView(mosaicInfo);
        expect(mosaicView.mosaicInfo).to.be.an.instanceof(MosaicInfo);
    });
});
