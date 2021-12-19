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
import { Convert as convert } from '../../../src/core/format';

describe('convert', () => {
    describe('toByte', () => {
        it('can convert all valid hex char combinations to byte', () => {
            // Arrange:
            const charToValueMappings: any = [];
            for (let code = '0'.charCodeAt(0); code <= '9'.charCodeAt(0); ++code) {
                charToValueMappings.push([String.fromCharCode(code), code - '0'.charCodeAt(0)]);
            }
            for (let code = 'a'.charCodeAt(0); code <= 'f'.charCodeAt(0); ++code) {
                charToValueMappings.push([String.fromCharCode(code), code - 'a'.charCodeAt(0) + 10]);
            }
            for (let code = 'A'.charCodeAt(0); code <= 'F'.charCodeAt(0); ++code) {
                charToValueMappings.push([String.fromCharCode(code), code - 'A'.charCodeAt(0) + 10]);
            }

            // Act:
            let numTests = 0;
            charToValueMappings.forEach((pair1) => {
                charToValueMappings.forEach((pair2) => {
                    // Act:
                    const byte = convert.toByte(pair1[0], pair2[0]);

                    // Assert:
                    const expected = pair1[1] * 16 + pair2[1];
                    expect(byte, `input: ${pair1[0]}${pair2[0]}`).to.equal(expected);
                    ++numTests;
                });
            });

            // Sanity:
            expect(numTests).to.equal(22 * 22);
        });

        it('cannot convert invalid hex chars to byte', () => {
            // Arrange:
            const pairs = [
                ['G', '6'],
                ['7', 'g'],
                ['*', '8'],
                ['9', '!'],
            ];

            // Act:
            pairs.forEach((pair) => {
                // Assert:
                const message = `input: ${pair[0]}${pair[0]}`;
                expect(() => {
                    convert.toByte(pair[0], pair[1]);
                }, message).to.throw('unrecognized hex char');
            });
        });
    });

    describe('isHexString', () => {
        it('returns true for valid hex strings', () => {
            // Arrange:
            const inputs = ['', '026ee415fc15', 'abcdef0123456789ABCDEF'];

            // Act:
            for (const input of inputs) {
                const isHexString = convert.isHexString(input);

                // Assert:
                expect(isHexString, `input ${input}`).to.equal(true);
            }
        });

        it('returns false for invalid hex strings', () => {
            // Arrange:
            const inputs = [
                'abcdef012345G789ABCDEF', // invalid ('G') char
                'abcdef0123456789ABCDE', // invalid (odd) length
            ];

            // Act:
            for (const input of inputs) {
                const isHexString = convert.isHexString(input);

                // Assert:
                expect(isHexString, `input ${input}`).to.equal(false);
            }
        });
    });

    describe('hexToUint8', () => {
        it('can parse empty hex string into array', () => {
            // Act:
            const actual = convert.hexToUint8('');

            // Assert:
            const expected = Uint8Array.of();
            expect(actual).to.deep.equal(expected);
        });

        it('can parse valid hex string into array', () => {
            // Act:
            const actual = convert.hexToUint8('026ee415fc15');

            // Assert:
            const expected = Uint8Array.of(0x02, 0x6e, 0xe4, 0x15, 0xfc, 0x15);
            expect(actual).to.deep.equal(expected);
        });

        it('can parse valid hex string containing all valid hex characters into array', () => {
            // Act:
            const actual = convert.hexToUint8('abcdef0123456789ABCDEF');

            // Assert:
            const expected = Uint8Array.of(0xab, 0xcd, 0xef, 0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef);
            expect(actual).to.deep.equal(expected);
        });

        it('cannot parse hex string with invalid characters into array', () => {
            // Assert:
            expect(() => {
                convert.hexToUint8('abcdef012345G789ABCDEF');
            }).to.throw('unrecognized hex char');
        });

        it('cannot parse hex string with invalid size into array', () => {
            // Assert:
            expect(() => {
                convert.hexToUint8('abcdef012345G789ABCDE');
            }).to.throw('hex string has unexpected size');
        });
    });

    describe('hexToUint8Reverse', () => {
        it('can parse empty hex string into array', () => {
            // Act:
            const actual = convert.hexToUint8Reverse('');

            // Assert:
            const expected = Uint8Array.of();
            expect(actual).to.deep.equal(expected);
        });

        it('can parse valid hex string into array', () => {
            // Act:
            const actual = convert.hexToUint8Reverse('026ee415fc15');

            // Assert:
            const expected = Uint8Array.of(0x15, 0xfc, 0x15, 0xe4, 0x6e, 0x02);
            expect(actual).to.deep.equal(expected);
        });

        it('can parse valid hex string containing all valid hex characters into array', () => {
            // Act:
            const actual = convert.hexToUint8Reverse('abcdef0123456789ABCDEF');

            // Assert:
            const expected = Uint8Array.of(0xef, 0xcd, 0xab, 0x89, 0x67, 0x45, 0x23, 0x01, 0xef, 0xcd, 0xab);
            expect(actual).to.deep.equal(expected);
        });

        it('cannot parse hex string with invalid characters into array', () => {
            // Assert:
            expect(() => {
                convert.hexToUint8Reverse('abcdef012345G789ABCDEF');
            }).to.throw('unrecognized hex char');
        });

        it('cannot parse hex string with invalid size into array', () => {
            // Assert:
            expect(() => {
                convert.hexToUint8Reverse('abcdef012345G789ABCDE');
            }).to.throw('hex string has unexpected size');
        });
    });

    describe('uint8ToHex', () => {
        it('can format empty array into hex string', () => {
            // Act:
            const actual = convert.uint8ToHex(Uint8Array.of());

            // Assert:
            expect(actual).to.equal('');
        });

        it('can format single value array into hex string', () => {
            // Act:
            const actual = convert.uint8ToHex(Uint8Array.of(0xd2));

            // Assert:
            expect(actual).to.equal('D2');
        });

        it('can format multi value array into hex string', () => {
            // Act:
            const actual = convert.uint8ToHex(Uint8Array.of(0x02, 0x6e, 0xe4, 0x15, 0xfc, 0x15));

            // Assert:
            expect(actual).to.equal('026EE415FC15');
        });
    });

    describe('uint8ToUint32', () => {
        it('uint8 array with zero length can be converted to uint32 array', () => {
            // Act:
            const actual = convert.uint8ToUint32(Uint8Array.of());

            // Assert:
            expect(actual).to.deep.equal(Uint32Array.of());
        });

        it('uint8 array with length multiple of four can be converted to uint32 array', () => {
            // Act:
            const actual = convert.uint8ToUint32(Uint8Array.of(0x02, 0x6e, 0x89, 0xab, 0xcd, 0xef, 0xe4, 0x15));

            // Assert:
            expect(actual).to.deep.equal(Uint32Array.of(0xab896e02, 0x15e4efcd));
        });

        it('uint8 array with length not multiple of four cannot be converted to uint32 array', () => {
            // Assert:
            expect(() => {
                convert.uint8ToUint32(Uint8Array.of(0x02, 0x6e, 0xe4, 0x15, 0x15));
            }).to.throw('byte length of Uint32Array should be a multiple of 4');
        });
    });

    describe('uint32ToUint8', () => {
        it('uint32 array with zero length can be converted to uint8 array', () => {
            // Act:
            const actual = convert.uint32ToUint8(Uint32Array.of());

            // Assert:
            expect(actual).to.deep.equal(Uint8Array.of());
        });

        it('uint32 array with nonzero length can be converted to uint8 array', () => {
            // Act:
            const actual = convert.uint32ToUint8(Uint32Array.of(0xab896e02, 0x15e4efcd));

            // Assert:
            expect(actual).to.deep.equal(Uint8Array.of(0x02, 0x6e, 0x89, 0xab, 0xcd, 0xef, 0xe4, 0x15));
        });
    });

    describe('utf8ToHex', () => {
        it('utf8 text to hex', () => {
            // Act:
            const actual = convert.utf8ToHex('test words |@#¢∞¬÷“”≠[]}{–');

            // Assert:
            expect(actual).to.equal('7465737420776F726473207C4023C2A2E2889EC2ACC3B7E2809CE2809DE289A05B5D7D7BE28093');
        });

        it('utf8 text to hex', () => {
            // Act:
            const actual = convert.utf8ToHex('先秦兩漢');

            // Assert:
            expect(actual).to.equal('E58588E7A7A6E585A9E6BCA2');
        });

        it('utf8 text containing emoji to hex', () => {
            // Act:
            const actual = convert.utf8ToHex('😀こんにちは😀');

            // Assert:
            expect(actual).to.equal('F09F9880E38193E38293E381ABE381A1E381AFF09F9880');
        });

        it('utf8 text to hex with control char', () => {
            // Act:
            const actual = convert.utf8ToHex(String.fromCodePoint(0x0f) + ' Hello World!');

            // Assert:
            expect(actual).to.equal('0F2048656C6C6F20576F726C6421');
        });
    });

    describe('signed <-> unsigned byte', () => {
        const testCases = [
            {
                signed: -128,
                unsigned: 0x80,
                description: 'min negative',
            },
            {
                signed: -127,
                unsigned: 0x81,
                description: 'min negative plus one',
            },
            {
                signed: -87,
                unsigned: 0xa9,
                description: 'negative',
            },
            {
                signed: -1,
                unsigned: 0xff,
                description: 'negative one',
            },
            {
                signed: 0,
                unsigned: 0,
                description: 'zero',
            },
            {
                signed: 1,
                unsigned: 0x01,
                description: 'positive one',
            },
            {
                signed: 57,
                unsigned: 0x39,
                description: 'positive',
            },
            {
                signed: 126,
                unsigned: 0x7e,
                description: 'max positive minus one',
            },
            {
                signed: 127,
                unsigned: 0x7f,
                description: 'max positive',
            },
        ];

        describe('uint8ToInt8', () => {
            const failureTestCases = [
                {
                    input: 256,
                    description: 'one too large',
                },
                {
                    input: 1000,
                    description: 'very large',
                },
            ];

            for (const testCase of failureTestCases) {
                it(`cannot convert number that is ${testCase.description}`, () => {
                    // Assert:
                    expect(() => convert.uint8ToInt8(testCase.input)).to.throw(`input '${testCase.input}' is out of range`);
                });
            }

            for (const testCase of testCases) {
                it(`can convert ${testCase.description}`, () => {
                    // Act:
                    const value = convert.uint8ToInt8(testCase.unsigned);

                    // Assert:
                    expect(value).to.equal(testCase.signed);
                });
            }
        });

        describe('int8ToUint8', () => {
            const failureTestCases = [
                {
                    input: -1000,
                    description: 'very small',
                },
                {
                    input: -129,
                    description: 'one too small',
                },
                {
                    input: 128,
                    description: 'one too large',
                },
                {
                    input: 1000,
                    description: 'very large',
                },
            ];

            for (const testCase of failureTestCases) {
                it(`cannot convert number that is ${testCase.description}`, () => {
                    // Assert:
                    expect(() => convert.int8ToUint8(testCase.input)).to.throw(`input '${testCase.input}' is out of range`);
                });
            }

            for (const testCase of testCases) {
                it(`can convert ${testCase.description}`, () => {
                    // Act:
                    const value = convert.int8ToUint8(testCase.signed);

                    // Assert:
                    expect(value).to.equal(testCase.unsigned);
                });
            }
        });
    });

    describe('utf8ToUni8', () => {
        it('should convert numeric string to Uint8Array', () => {
            const actual = '123456789';
            // Act:
            const uint = convert.utf8ToUint8(actual);

            // Assert:
            expect(uint.length).to.be.equal(actual.length);
            expect(uint[0]).to.be.equal(49);
            expect(uint[8]).to.be.equal(57);
        });

        it('should convert utf string to Uint8Array', () => {
            const actual = 'test';
            // Act:
            const uint = convert.utf8ToUint8(actual);

            // Assert:
            expect(uint.length).to.be.equal(actual.length);
            expect(convert.uint8ToHex(uint)).to.be.equal('74657374');
        });
        it('should convert hex string to utf 8', () => {
            const hex = '746573742D6D657373616765';
            const plainText = 'test-message';
            expect(convert.hexToUtf8(hex)).to.be.equal(plainText);
            expect(convert.utf8ToHex(plainText)).eq(hex);
        });

        it('should convert hex string to utf 8 (emoji)', () => {
            const hex = 'F09F9880E38193E38293E381ABE381A1E381AFF09F9880';
            const plainText = '😀こんにちは😀';
            expect(convert.hexToUtf8(hex)).to.be.equal(plainText);
            expect(convert.utf8ToHex(plainText)).eq(hex);
        });
    });

    describe('uint8ToUtf8', () => {
        it('should convert Uint8Array to numericString', () => {
            const expected = '123456789';
            const actual = convert.utf8ToUint8(expected);
            // Act:
            const result = convert.uint8ToUtf8(actual);

            // Assert:
            expect(result).to.be.equal(expected);
        });

        it('should convert Uint8Array to utf8 string ', () => {
            const expected = 'test';
            const actual = convert.utf8ToUint8(expected);
            // Act:
            const result = convert.uint8ToUtf8(actual);

            // Assert:
            expect(result).to.be.equal(expected);
        });
    });

    describe('numberToUint8Array', () => {
        it('should convert to number and back', () => {
            const input = 123456789;
            const array = convert.numberToUint8Array(input, 4);
            // Act:
            const result = convert.uintArray8ToNumber(array);

            // Assert:
            expect(result).to.be.equal(input);
        });

        it('should convert to number and back when negative', () => {
            const input = -123456789;
            const array = convert.numberToUint8Array(input, 4);
            // Act:
            const result = convert.uintArray8ToNumber(array);

            // Assert:
            expect(result).to.be.equal(4171510507);
            expect(input).to.be.equal(-123456789);
        });
    });
});
