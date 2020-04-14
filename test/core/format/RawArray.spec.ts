/*
 * Copyright 2019 NEM
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
import { Convert as convert, RawArray as array } from '../../../src/core/format';

describe('array', () => {
    describe('uint8View', () => {
        it('can get uint8 view of array buffer', () => {
            // Arrange:
            const src = convert.hexToUint8('0A12B5675069');

            // Act:
            const view = array.uint8View(src.buffer);

            // Assert:
            expect(convert.uint8ToHex(view)).to.equal('0A12B5675069');
        });

        it('can get uint8 view of uint8 typed array', () => {
            // Arrange:
            const src = convert.hexToUint8('0A12B5675069');

            // Act:
            const view = array.uint8View(src);

            // Assert:
            expect(convert.uint8ToHex(view)).to.equal('0A12B5675069');
        });

        it('cannot get uint8 view of arbitrary typed array', () => {
            // Arrange:
            const src = new Uint16Array(10);

            // Act:
            expect(() => array.uint8View(src)).to.throw('unsupported type passed to uint8View');
        });
    });

    describe('copy', () => {
        it('can copy full typed array', () => {
            // Arrange:
            const src = convert.hexToUint8('0A12B5675069');
            const dest = new Uint8Array(src.length);

            // Act:
            array.copy(dest, src);

            // Assert:
            expect(convert.uint8ToHex(dest)).to.equal('0A12B5675069');
        });

        it('can copy partial typed array when dest is same size as src', () => {
            // Arrange:
            const src = convert.hexToUint8('0A12B5675069');
            const dest = new Uint8Array(src.length);

            // Act:
            array.copy(dest, src, 3);

            // Assert:
            expect(convert.uint8ToHex(dest)).to.equal('0A12B5000000');
        });

        it('can copy partial typed array when dest is smaller than src', () => {
            // Arrange:
            const src = convert.hexToUint8('0A12B5675069');
            const dest = new Uint8Array(4);

            // Act:
            array.copy(dest, src);

            // Assert:
            expect(convert.uint8ToHex(dest)).to.equal('0A12B567');
        });

        it('can copy partial typed array with custom offsets', () => {
            // Arrange:
            const src = convert.hexToUint8('0A12B5675069');
            const dest = new Uint8Array(src.length);

            // Act:
            array.copy(dest, src, 3, 2, 1);

            // Assert:
            expect(convert.uint8ToHex(dest)).to.equal('000012B56700');
        });
    });

    describe('isZeroFilled', () => {
        it('returns true if typed array is zero', () => {
            // Act:
            const isZero = array.isZeroFilled(new Uint16Array(10));

            // Assert:
            expect(isZero).to.equal(true);
        });

        function assertIsNonZero(length, nonZeroOffset) {
            // Arrange:
            const src = new Uint16Array(length);
            src[nonZeroOffset] = 2;

            // Act
            const isZero = array.isZeroFilled(src);

            // Assert:
            expect(isZero, `nonzero offset ${nonZeroOffset}`).to.equal(false);
        }

        it('returns false if typed array is non zero', () => {
            // Assert:
            assertIsNonZero(10, 0);
            assertIsNonZero(10, 5);
            assertIsNonZero(10, 9);
        });
    });

    describe('deepEqual', () => {
        it('returns true if typed arrays are equal', () => {
            // Arrange:
            const lhs = convert.hexToUint8('0A12B5675069');
            const rhs = convert.hexToUint8('0A12B5675069');

            // Act:
            const isEqual = array.deepEqual(lhs, rhs);

            // Assert:
            expect(isEqual).to.equal(true);
        });

        it('returns false if typed arrays have different sizes', () => {
            // Arrange:
            const shorter = convert.hexToUint8('0A12B5675069');
            const longer = convert.hexToUint8('0A12B567506983');

            // Act:
            const isEqual1 = array.deepEqual(shorter, longer);
            const isEqual2 = array.deepEqual(longer, shorter);

            // Assert:
            expect(isEqual1).to.equal(false);
            expect(isEqual2).to.equal(false);
        });

        function assertNotEqual(lhs, unequalOffset) {
            // Arrange:
            const rhs = new Uint8Array(lhs.length);
            array.copy(rhs, lhs);
            rhs[unequalOffset] ^= 0xff;

            // Act
            const isEqual = array.deepEqual(lhs, rhs);

            // Assert:
            expect(isEqual, `unequal offset ${unequalOffset}`).to.equal(false);
        }

        it('returns false if typed arrays are not equal', () => {
            // Arrange:
            const lhs = convert.hexToUint8('0A12B5675069');

            // Assert:
            assertNotEqual(lhs, 0);
            assertNotEqual(lhs, 3);
            assertNotEqual(lhs, 5);
        });

        it('returns true if subset of typed arrays are equal', () => {
            // Arrange: different at 2
            const lhs = convert.hexToUint8('0A12B5675069');
            const rhs = convert.hexToUint8('0A12C5675069');

            // Act:
            const isEqualSubset = array.deepEqual(lhs, rhs, 2);
            const isEqualAll = array.deepEqual(lhs, rhs);

            // Assert:
            expect(isEqualSubset).to.equal(true);
            expect(isEqualAll).to.equal(false);
        });

        it('returns true if subset of typed arrays of different lengths are equal', () => {
            // Arrange:
            const shorter = convert.hexToUint8('0A12B5');
            const longer = convert.hexToUint8('0A12B567506983');

            // Act:
            const isEqual1 = array.deepEqual(shorter, longer, 3);
            const isEqual2 = array.deepEqual(longer, shorter, 3);

            // Assert:
            expect(isEqual1).to.equal(true);
            expect(isEqual2).to.equal(true);
        });

        it('returns false if either typed array has fewer elements than requested for comparison', () => {
            // Arrange:
            const shorter = convert.hexToUint8('0A12B5');
            const longer = convert.hexToUint8('0A12B567506983');

            // Act:
            const isEqual1 = array.deepEqual(shorter, longer, 4);
            const isEqual2 = array.deepEqual(longer, shorter, 4);

            // Assert:
            expect(isEqual1).to.equal(false);
            expect(isEqual2).to.equal(false);
        });
    });
});
