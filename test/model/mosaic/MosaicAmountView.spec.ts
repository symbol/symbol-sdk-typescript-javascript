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
import {MosaicFlags} from '../../../src/model/mosaic/MosaicFlags';
import {MosaicId} from '../../../src/model/mosaic/MosaicId';
import {MosaicInfo} from '../../../src/model/mosaic/MosaicInfo';
import {NetworkType} from '../../../src/model/network/NetworkType';
import {UInt64} from '../../../src/model/UInt64';
import {MosaicAmountView} from '../../../src/service/MosaicAmountView';

describe('MosaicAmountView', () => {

    let mosaicInfo: MosaicInfo;

    before(() => {
        mosaicInfo = new MosaicInfo(
            new MosaicId([3294802500, 2243684972]), // mosaicId
            new UInt64([3403414400, 2095475]), // supply
            new UInt64([1, 0]), // height
            PublicAccount.createFromPublicKey('B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF', NetworkType.MIJIN_TEST),
            1, // revision
            MosaicFlags.create(true, true, true),
            3,
            UInt64.fromUint(1000),
        );
    });

    it('should createComplete a Mosaic Amount View', () => {
        const mosaicAmountView = new MosaicAmountView(mosaicInfo, UInt64.fromUint(100));
        expect(mosaicAmountView.amount.compact()).to.be.equal(100);
        expect(mosaicAmountView.mosaicInfo).to.be.an.instanceof(MosaicInfo);
    });

    it('should createComplete a Mosaic Amount View get relative amount', () => {
        const mosaicAmountView = new MosaicAmountView(mosaicInfo, UInt64.fromUint(100));
        expect(mosaicAmountView.relativeAmount()).to.be.equal(100 / Math.pow(10, 3));
        expect(mosaicAmountView.mosaicInfo).to.be.an.instanceof(MosaicInfo);
    });

    it('should createComplete a Mosaic Amount View get correct amount', () => {
        const mosaicAmountView = new MosaicAmountView(mosaicInfo, UInt64.fromUint(100));
        expect(mosaicAmountView.mosaicInfo).to.be.an.instanceof(MosaicInfo);
        expect(mosaicAmountView.amount.compact()).to.be.equal(100);
    });
});
