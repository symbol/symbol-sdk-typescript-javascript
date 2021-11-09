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
import { MosaicFlags } from '../../../src/model/mosaic/MosaicFlags';

describe('MosaicFlags', () => {
    it('should createComplete an MosaicFlags object with constructor', () => {
        const mosaicFlags = new MosaicFlags(7);
        expect(mosaicFlags.supplyMutable).to.be.equal(true);
        expect(mosaicFlags.transferable).to.be.equal(true);
        expect(mosaicFlags.restrictable).to.be.equal(true);
        expect(mosaicFlags.revokable).to.be.equal(false);
    });

    it('should createComplete an mosaicFlags object with static method', () => {
        const mosaicFlags = MosaicFlags.create(false, false, false, false);

        expect(mosaicFlags.supplyMutable).to.be.equal(false);
        expect(mosaicFlags.transferable).to.be.equal(false);
        expect(mosaicFlags.restrictable).to.be.equal(false);
        expect(mosaicFlags.revokable).to.be.equal(false);
    });

    it('should return correct flags value', () => {
        let mosaicFlags = MosaicFlags.create(false, false, false, false);
        expect(mosaicFlags.getValue()).to.be.equal(0);

        mosaicFlags = MosaicFlags.create(true, false, false, false);
        expect(mosaicFlags.getValue()).to.be.equal(1);

        mosaicFlags = MosaicFlags.create(false, true, false, false);
        expect(mosaicFlags.getValue()).to.be.equal(2);

        mosaicFlags = MosaicFlags.create(false, false, true, false);
        expect(mosaicFlags.getValue()).to.be.equal(4);

        mosaicFlags = MosaicFlags.create(true, true, true, false);
        expect(mosaicFlags.getValue()).to.be.equal(7);

        mosaicFlags = MosaicFlags.create(true, false, true, false);
        expect(mosaicFlags.getValue()).to.be.equal(5);

        mosaicFlags = MosaicFlags.create(true, true, false, false);
        expect(mosaicFlags.getValue()).to.be.equal(3);

        mosaicFlags = MosaicFlags.create(false, false, false, true);
        expect(mosaicFlags.getValue()).to.be.equal(8);

        mosaicFlags = MosaicFlags.create(true, false, false, true);
        expect(mosaicFlags.getValue()).to.be.equal(9);

        mosaicFlags = MosaicFlags.create(false, true, false, true);
        expect(mosaicFlags.getValue()).to.be.equal(10);

        mosaicFlags = MosaicFlags.create(false, false, true, true);
        expect(mosaicFlags.getValue()).to.be.equal(12);

        mosaicFlags = MosaicFlags.create(true, true, true, true);
        expect(mosaicFlags.getValue()).to.be.equal(15);

        mosaicFlags = MosaicFlags.create(true, false, true, true);
        expect(mosaicFlags.getValue()).to.be.equal(13);

        mosaicFlags = MosaicFlags.create(true, true, false, true);
        expect(mosaicFlags.getValue()).to.be.equal(3 + 8);
    });

    it('should return correct flags json object', () => {
        const mosaicFlags = MosaicFlags.create(true, true, true, true);
        expect(mosaicFlags.toDTO().flags).to.be.equal(15);
    });
});
