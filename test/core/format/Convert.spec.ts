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
import {expect} from 'chai';
import {Convert as convert} from '../../../src/core/format';

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
                    const expected = (pair1[1] * 16) + pair2[1];
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
            const inputs = [
                '',
                '026ee415fc15',
                'abcdef0123456789ABCDEF',
            ];

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
            const expected = Uint8Array.of(0x02, 0x6E, 0xE4, 0x15, 0xFC, 0x15);
            expect(actual).to.deep.equal(expected);
        });

        it('can parse valid hex string containing all valid hex characters into array', () => {
            // Act:
            const actual = convert.hexToUint8('abcdef0123456789ABCDEF');

            // Assert:
            const expected = Uint8Array.of(0xAB, 0xCD, 0xEF, 0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF);
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

    describe('uint8ToHex', () => {
        it('can format empty array into hex string', () => {
            // Act:
            const actual = convert.uint8ToHex(Uint8Array.of());

            // Assert:
            expect(actual).to.equal('');
        });

        it('can format single value array into hex string', () => {
            // Act:
            const actual = convert.uint8ToHex(Uint8Array.of(0xD2));

            // Assert:
            expect(actual).to.equal('D2');
        });

        it('can format multi value array into hex string', () => {
            // Act:
            const actual = convert.uint8ToHex(Uint8Array.of(0x02, 0x6E, 0xE4, 0x15, 0xFC, 0x15));

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
            const actual = convert.uint8ToUint32(Uint8Array.of(0x02, 0x6E, 0x89, 0xAB, 0xCD, 0xEF, 0xE4, 0x15));

            // Assert:
            expect(actual).to.deep.equal(Uint32Array.of(0xAB896E02, 0x15E4EFCD));
        });

        it('uint8 array with length not multiple of four cannot be converted to uint32 array', () => {
            // Assert:
            expect(() => {
                    convert.uint8ToUint32(Uint8Array.of(0x02, 0x6E, 0xE4, 0x15, 0x15));
                })
                .to.throw('byte length of Uint32Array should be a multiple of 4');
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
            const actual = convert.uint32ToUint8(Uint32Array.of(0xAB896E02, 0x15E4EFCD));

            // Assert:
            expect(actual).to.deep.equal(Uint8Array.of(0x02, 0x6E, 0x89, 0xAB, 0xCD, 0xEF, 0xE4, 0x15));
        });
    });

    describe('utf8ToHex', () => {
        it('utf8 text to hex', () => {
            // Act:
            const actual = convert.utf8ToHex('test words |@#¢∞¬÷“”≠[]}{–');

            // Assert:
            expect(actual).to.equal('7465737420776f726473207c4023c2a2e2889ec2acc3b7e2809ce2809de289a05b5d7d7be28093');
        });

        it('utf8 text to hex', () => {
            // Act:
            const actual = convert.utf8ToHex('先秦兩漢');

            // Assert:
            expect(actual).to.equal('e58588e7a7a6e585a9e6bca2');
        });

        it('utf8 text to hex with control char', () => {
            // Act:
            const test  = String.fromCodePoint(0x0f) + ' Hello World!';
            console.log('UTF8', test);
            const actual = convert.utf8ToHex(test);

            // Assert:
            expect(actual).to.equal('0f2048656c6c6f20576f726c6421');
        });
    });

    describe('signed <-> unsigned byte', () => {
        const testCases = [{
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
                unsigned: 0xA9,
                description: 'negative',
            },
            {
                signed: -1,
                unsigned: 0xFF,
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
                unsigned: 0x7E,
                description: 'max positive minus one',
            },
            {
                signed: 127,
                unsigned: 0x7F,
                description: 'max positive',
            },
        ];

        describe('uint8ToInt8', () => {
            const failureTestCases = [{
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
            const failureTestCases = [{
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
});
