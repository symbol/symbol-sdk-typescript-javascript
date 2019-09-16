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
import {MosaicProperties} from '../../../src/model/mosaic/MosaicProperties';
import {UInt64} from '../../../src/model/UInt64';

describe('MosaicProperties', () => {

    it('should createComplete an MosaicProperties object with constructor', () => {
        const propertiesDTO = {
            flags: 7,
            divisibility: 3,
            duration: '1000',
        };

        const mosaicProperties = new MosaicProperties(
            propertiesDTO.flags,
            propertiesDTO.divisibility,
            UInt64.fromNumericString(propertiesDTO.duration),
        );

        expect(mosaicProperties.divisibility).to.be.equal(propertiesDTO.divisibility);
        deepEqual(mosaicProperties.duration.toString(), propertiesDTO.duration);

        expect(mosaicProperties.supplyMutable).to.be.equal(true);
        expect(mosaicProperties.transferable).to.be.equal(true);
    });

    it('should createComplete an MosaicProperties object with static method', () => {
        const duration = UInt64.fromUint(1000);

        const mosaicProperties = MosaicProperties.create({
            supplyMutable: false,
            transferable: false,
            divisibility: 10,
            duration,
        });

        expect(mosaicProperties.divisibility).to.be.equal(10);
        deepEqual(mosaicProperties.duration, duration);

        expect(mosaicProperties.supplyMutable).to.be.equal(false);
        expect(mosaicProperties.transferable).to.be.equal(false);
        expect(mosaicProperties.restrictable).to.be.equal(false);
    });

    it('should createComplete an MosaicProperties object without duration', () => {
        const mosaicProperties = MosaicProperties.create({
            supplyMutable: false,
            transferable: false,
            divisibility: 10,
            duration: UInt64.fromUint(0),
        });

        expect(mosaicProperties.divisibility).to.be.equal(10);
        deepEqual(mosaicProperties.duration.toDTO(), [0, 0]);

        expect(mosaicProperties.supplyMutable).to.be.equal(false);
        expect(mosaicProperties.transferable).to.be.equal(false);
        expect(mosaicProperties.restrictable).to.be.equal(false);
    });
});
