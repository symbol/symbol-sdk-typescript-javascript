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
import { Base32 as base32 } from '../../../src/core/format/Base32';

describe('base32', () => {
    const Test_Vectors = [
        {
            decoded: '68BA9E8D1AA4502E1F73DA19784B5D7DA16CA1E4AF895FAC12',
            encoded: 'NC5J5DI2URIC4H3T3IMXQS25PWQWZIPEV6EV7LAS',
        },
        {
            decoded: '684C2605E5B366BB94BC30755EC9F50D74E80FC9283D20E283',
            encoded: 'NBGCMBPFWNTLXFF4GB2V5SPVBV2OQD6JFA6SBYUD',
        },
        {
            decoded: '68D7B09A14BEA7CE060E71C0FA9AC9B4226DE167013DE10B3D',
            encoded: 'NDL3BGQUX2T44BQOOHAPVGWJWQRG3YLHAE66CCZ5',
        },
        {
            decoded: '686C44C024F1089669F53C45AC6D62CC17A0D9CBA67A6205E6',
            encoded: 'NBWEJQBE6EEJM2PVHRC2Y3LCZQL2BWOLUZ5GEBPG',
        },
        {
            decoded: '98A0FE84BBFC5EEE7CADC2B12F790DAA4A7A9505096E674FAB',
            encoded: 'TCQP5BF37RPO47FNYKYS66INVJFHVFIFBFXGOT5L',
        },
    ];

    describe('encode', () => {
        it('can convert empty input', () => {
            // Act:
            const encoded = base32.Base32Encode(new Uint8Array([]));

            // Assert:
            expect(encoded).to.equal('');
        });

        it('can convert test vectors', () => {
            // Arrange:
            for (const sample of Test_Vectors) {
                const input = convert.hexToUint8(sample.decoded);

                // Act:
                const encoded = base32.Base32Encode(input);

                // Assert:
                expect(encoded, `input ${sample.decoded}`).to.equal(sample.encoded);
            }
        });

        it('accepts all byte values', () => {
            // Arrange:
            const data: any = [];
            for (let i = 0; i < 260; ++i) {
                data.push(i & 0xff);
            }

            // Act:
            const encoded = base32.Base32Encode(data);

            // Assert:
            const expected =
                'AAAQEAYEAUDAOCAJBIFQYDIOB4IBCEQTCQKRMFYY' +
                'DENBWHA5DYPSAIJCEMSCKJRHFAUSUKZMFUXC6MBR' +
                'GIZTINJWG44DSOR3HQ6T4P2AIFBEGRCFIZDUQSKK' +
                'JNGE2TSPKBIVEU2UKVLFOWCZLJNVYXK6L5QGCYTD' +
                'MRSWMZ3INFVGW3DNNZXXA4LSON2HK5TXPB4XU634' +
                'PV7H7AEBQKBYJBMGQ6EITCULRSGY5D4QSGJJHFEV' +
                'S2LZRGM2TOOJ3HU7UCQ2FI5EUWTKPKFJVKV2ZLNO' +
                'V6YLDMVTWS23NN5YXG5LXPF5X274BQOCYPCMLRWH' +
                'ZDE4VS6MZXHM7UGR2LJ5JVOW27MNTWW33TO55X7A' +
                '4HROHZHF43T6R2PK5PWO33XP6DY7F47U6X3PP6HZ' +
                '7L57Z7P674AACAQD';
            expect(encoded).to.equal(expected);
        });

        it('throws if input size is not a multiple of block size', () => {
            // Arrange:
            for (let i = 2; i < 10; i += 2) {
                const input = new Uint8Array(i);

                // Act + Assert:
                expect(() => {
                    base32.Base32Encode(input);
                }, `input at ${i}`).to.throw('decoded size must be multiple of 5');
            }
        });
    });

    describe('decode', () => {
        it('can convert empty input', () => {
            // Act:
            const decoded = base32.Base32Decode('');

            // Assert:
            expect(convert.uint8ToHex(decoded)).to.equal('');
        });

        it('can convert test vectors', () => {
            // Arrange:
            for (const sample of Test_Vectors) {
                // Act:
                const decoded = base32.Base32Decode(sample.encoded);

                // Assert:
                expect(convert.uint8ToHex(decoded), `input ${sample.encoded}`).to.equal(sample.decoded);
            }
        });

        it('accepts all valid characters', () => {
            // Act:
            const decoded = base32.Base32Decode('ABCDEFGHIJKLMNOPQRSTUVWXYZ234567');

            // Assert:
            expect(convert.uint8ToHex(decoded)).to.equal('00443214C74254B635CF84653A56D7C675BE77DF');
        });

        it('throws if input size is not a multiple of block size', () => {
            // Arrange:
            for (let i = 1; i < 8; ++i) {
                const input = 'A'.repeat(i);

                // Act + Assert:
                expect(() => {
                    base32.Base32Decode(input);
                }, `input at ${i}`).to.throw('encoded size must be multiple of 8');
            }
        });

        it('throws if input contains an invalid character', () => {
            // Arrange:
            const illegalInputs = [
                'NC5J5DI2URIC4H3T3IMXQS21PWQWZIPEV6EV7LAS', // contains char '1'
                'NBGCMBPFWNTLXFF4GB2V5SPV!V2OQD6JFA6SBYUD', // contains char '!'
                'NDL3BGQUX2T44BQOOHAPVGWJWQRG3YLHAE)6CCZ5', // contains char ')'
            ];

            // Act + Assert:
            for (const input of illegalInputs) {
                expect(() => {
                    base32.Base32Decode(input);
                }, `input ${input}`).to.throw('illegal base32 character');
            }
        });
    });

    describe('roundtrip', () => {
        it('decode -> encode', () => {
            // Arrange: inputs
            const inputs = ['BDS73DQ5NC33MKYI3K6GXLJ53C2HJ35A', '46FNYP7T4DD3SWAO6C4NX62FJI5CBA26'];
            for (const input of inputs) {
                // Act:
                const decoded = base32.Base32Decode(input);
                const result = base32.Base32Encode(decoded);

                // Assert:
                expect(result, `input ${input}`).to.equal(input);
            }
        });

        it('encode -> decode', () => {
            // Arrange: inputs
            const inputs = ['8A4E7DF5B61CC0F97ED572A95F6ACA', '2D96E4ABB65F0AD3C29FEA48C132CE'];
            for (const input of inputs) {
                // Act:
                const encoded = base32.Base32Encode(convert.hexToUint8(input));
                const result = base32.Base32Decode(encoded);

                // Assert:
                expect(convert.uint8ToHex(result), `input ${input}`).to.equal(input);
            }
        });
    });
});
