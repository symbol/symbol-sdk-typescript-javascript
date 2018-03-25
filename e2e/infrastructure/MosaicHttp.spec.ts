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
import {MosaicHttp} from '../../src/infrastructure/MosaicHttp';
import {MosaicId} from '../../src/model/mosaic/MosaicId';
import {NamespaceId} from '../../src/model/namespace/NamespaceId';
import {APIUrl} from '../conf/conf.spec';

describe('MosaicHttp', () => {
    const mosaicId = new MosaicId([3646934825, 3576016193]);
    const namespaceId = new NamespaceId([929036875, 2226345261]);
    const mosaicHttp = new MosaicHttp(APIUrl);

    describe('getMosaic', () => {
        it('should return mosaic given mosaicId', (done) => {
            mosaicHttp.getMosaic(mosaicId)
                .subscribe((mosaicInfo) => {
                    expect(mosaicInfo.height.lower).to.be.equal(1);
                    expect(mosaicInfo.height.higher).to.be.equal(0);
                    expect(mosaicInfo.divisibility).to.be.equal(6);
                    expect(mosaicInfo.isSupplyMutable()).to.be.equal(false);
                    expect(mosaicInfo.isTransferable()).to.be.equal(true);
                    expect(mosaicInfo.isLevyMutable()).to.be.equal(false);
                    done();
                });
        });
    });

    describe('getMosaics', () => {
        it('should return mosaics given array of mosaicIds', (done) => {
            mosaicHttp.getMosaics([mosaicId])
                .subscribe((mosaicInfos) => {
                    expect(mosaicInfos[0].height.lower).to.be.equal(1);
                    expect(mosaicInfos[0].height.higher).to.be.equal(0);
                    expect(mosaicInfos[0].divisibility).to.be.equal(6);
                    expect(mosaicInfos[0].isSupplyMutable()).to.be.equal(false);
                    expect(mosaicInfos[0].isTransferable()).to.be.equal(true);
                    expect(mosaicInfos[0].isLevyMutable()).to.be.equal(false);
                    done();
                });
        });
    });

    describe('getMosaicsFromNamespace', () => {
        it('should return mosaics given namespaceId', (done) => {
            mosaicHttp.getMosaicsFromNamespace(namespaceId)
                .subscribe((mosaicInfos) => {
                    expect(mosaicInfos[0].height.lower).to.be.equal(1);
                    expect(mosaicInfos[0].height.higher).to.be.equal(0);
                    expect(mosaicInfos[0].divisibility).to.be.equal(6);
                    expect(mosaicInfos[0].isSupplyMutable()).to.be.equal(false);
                    expect(mosaicInfos[0].isTransferable()).to.be.equal(true);
                    expect(mosaicInfos[0].isLevyMutable()).to.be.equal(false);
                    done();
                });
        });
    });

    describe('getMosaicsName', () => {
        it('should return mosaics name given array of mosaicIds', (done) => {
            mosaicHttp.getMosaicsName([mosaicId])
                .subscribe((mosaicNames) => {
                    expect(mosaicNames[0].name).to.be.equal('xem');
                    done();
                });
        });
    });
});
