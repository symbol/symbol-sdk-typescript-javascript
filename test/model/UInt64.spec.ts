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

const hexTestCases = [
    { str: '0000000000000000', value: [0, 0], description: '0' },
    { str: '000000000000A1B2', value: [0xA1B2, 0], description: '(0, 8)' },
    { str: '0000000012345678', value: [0x12345678, 0], description: '8' },
    { str: '0000ABCD12345678', value: [0x12345678, 0xABCD], description: '(8, 16)' },
    { str: '1234567890ABCDEF', value: [0x90ABCDEF, 0x12345678], description: '16' },
    { str: 'FFFFFFFFFFFFFFFF', value: [0xFFFFFFFF, 0xFFFFFFFF], description: '16 (max value)' },
];

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

    describe('compare', () => {
        it('should return -1 - unsigned', () => {
            const value = UInt64.fromNumericString('1');
            const other = UInt64.fromNumericString('2');
            expect(value.compare(other)).to.be.equal(-1);
        });

        it('should return 0 - unsigned', () => {
            const value = UInt64.fromNumericString('1');
            const other = UInt64.fromNumericString('1');
            expect(value.compare(other)).to.be.equal(0);
        });

        it('should return 1 - unsigned', () => {
            const value = UInt64.fromNumericString('2');
            const other = UInt64.fromNumericString('1');
            expect(value.compare(other)).to.be.equal(1);
        });
    });

    describe('fromHex', () => {
        it('should create from hexadecimal notation', () => {
            hexTestCases.forEach((testCase) => {
                it(`can parse hex string with ${testCase.description} significant digits`, () => {
                    // Act:
                    const value = UInt64.fromHex(testCase.str);

                    // Assert:
                    expect(value).to.deep.equal(testCase.value);
                });
            });

            it('cannot parse hex string with invalid characters into uint64', () => {
                // Assert:
                expect(() => { UInt64.fromHex('0000000012345G78'); }).to.throw('unrecognized hex char'); // contains 'G'
            });

            it('cannot parse hex string with invalid size into uint64', () => {
                // Arrange:
                const errorMessage = 'hex string has unexpected size';

                // Assert:
                expect(() => { UInt64.fromHex(''); }).to.throw(errorMessage); // empty string
                expect(() => { UInt64.fromHex('1'); }).to.throw(errorMessage); // odd number of chars
                expect(() => { UInt64.fromHex('ABCDEF12'); }).to.throw(errorMessage); // too short
                expect(() => { UInt64.fromHex('1234567890ABCDEF12'); }).to.throw(errorMessage); // too long
            });
        });
    });

    describe('fromNumericString', () => {
        it('should create Uint64 object from string', () => {
            const value = '1000';
            const uint64 = UInt64.fromNumericString(value);
            expect(uint64.lower).to.be.equal(1000);

            // To make sure new method works on existing tests
            const value2 = '51110867862';
            const uint64_2 = UInt64.fromNumericString(value2);
            expect(uint64_2.lower).to.be.equal(3866227606);
            expect(uint64_2.higher).to.be.equal(11);
        });
        it('should throw exception when creating Uint64 object from string', () => {
            expect(() => { UInt64.fromNumericString('000012345678'); }).to.throw('Input string is not a valid numeric string');
            expect(() => { UInt64.fromNumericString('ABC12345678'); }).to.throw('Input string is not a valid numeric string');
        });
    });

    describe('toNuermicString', () => {
        it('should return numeric string representation', () => {
            const value = '1000';
            const uint64 = UInt64.fromNumericString(value);

            expect(uint64.toString()).to.be.equal(value);
        });
    });

    describe('isLongNumericString', () => {
        it('should return false', () => {
            const value = 'aaa';
            const result = UInt64.isLongNumericString(value);

            expect(result).to.be.false;
        });

        it('should return true', () => {
            const value = '1000';
            const result = UInt64.isLongNumericString(value);

            expect(result).to.be.true;
        });
    });

    describe('Operation', () => {
        it('should return added value', () => {
            const value = UInt64.fromUint(100);
            const other = UInt64.fromUint(1);
            const result = value.add(other);
            expect(result.compact()).to.be.equal(101);
        });
        it('should return added value', () => {
            const value = UInt64.fromUint(0);
            const other = UInt64.fromUint(0);
            const result = value.add(other);
            expect(result.compact()).to.be.equal(0);
        });

        it('should return substract value', () => {
            const value = UInt64.fromUint(100);
            const other = UInt64.fromUint(1);
            const result = value.subtract(other);
            expect(result.compact()).to.be.equal(99);
        });

        it('should return substract value', () => {
            const value = UInt64.fromUint(1);
            const other = UInt64.fromUint(1);
            const result = value.subtract(other);
            expect(result.compact()).to.be.equal(0);
        });

        it('should return substract value', () => {
            const value = UInt64.fromUint(100);
            const other = UInt64.fromUint(1);
            expect(() => {
                other.subtract(value);
            }).to.throw(Error, 'Unsigned substraction result cannot be negative.');
        });
    });
});
