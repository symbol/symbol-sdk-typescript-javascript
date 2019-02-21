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
import {UInt64} from '../../src/model/UInt64';

describe('Uint64', () => {

    it('should createComplete Uint64 object [0,0]', () => {
        const uintArray = [
            0,
            0,
        ];
        const uint64 = new UInt64(uintArray);
        expect(uint64.lower).to.be.equal(uintArray[0]);
        expect(uint64.higher).to.be.equal(uintArray[1]);
    });

    it('should createComplete Uint64 object [20,30]', () => {
        const uintArray = [
            20,
            30,
        ];
        const uint64 = new UInt64(uintArray);
        expect(uint64.lower).to.be.equal(uintArray[0]);
        expect(uint64.higher).to.be.equal(uintArray[1]);
    });

    it('should createComplete throw when trying to createComplete Uint64 object with empty array', () => {
        const uintArray = [];
        expect(() => {
            new UInt64(uintArray);
        }).to.throw(Error, 'uintArray must be be an array of two uint numbers');
    });

    it('should createComplete throw when trying to createComplete Uint64 object with negative numbers', () => {
        const uintArray = [-1, -1];
        expect(() => {
            new UInt64(uintArray);
        }).to.throw(Error, 'uintArray must be be an array of two uint numbers');
    });

    it('should createComplete Uint64 object from 51110867862', () => {
        const uint64 = UInt64.fromUint(51110867862);
        expect(uint64.lower).to.be.equal(3866227606);
        expect(uint64.higher).to.be.equal(11);
    });

    it('should compact UInt64 number', () => {
        const uint64Compact = new UInt64([3866227606, 11]).compact();
        expect(uint64Compact).to.be.equal(51110867862);
    });

    it('should fromUint throw exception with negative uint value', () => {
        expect(() => {
            UInt64.fromUint(-1);
        }).to.throw(Error, 'Unsigned integer cannot be negative');
    });

    describe('equal', () => {
        it('should return true if the inside values are the same', () => {
            const value = new UInt64([12, 12]);
            const other = new UInt64([12, 12]);
            expect(value.equals(other)).to.be.equal(true);
        });

        it('should return true if the inside values are the same but different order', () => {
            const value = new UInt64([12, 23]);
            const other = new UInt64([23, 12]);
            expect(value.equals(other)).to.be.equal(false);
        });
    });
});
