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
import {convert} from '../../../src/core/format/convert';
import {uint64} from '../../../src/core/format/uint64';

describe('uint64', () => {
	describe('compact', () => {
		it('can compact 32 bit value', () => {
			// Act:
			const result = uint64.compact([0x12345678, 0x00000000]);

			// Assert:
			expect(result).to.equal(0x12345678);
		});

		it('can compact less than max safe integer', () => {
			// Act:
			const result = uint64.compact([0x00ABCDEF, 0x000FDFFF]);

			// Assert:
			expect(result).to.equal(0xFDFFF00ABCDEF);
		});

		it('can compact max safe integer', () => {
			// Sanity:
			expect(0x1FFFFFFFFFFFFF).to.equal(Number.MAX_SAFE_INTEGER);

			// Act:
			const result = uint64.compact([0xFFFFFFFF, 0x001FFFFF]);

			// Assert:
			expect(result).to.equal(Number.MAX_SAFE_INTEGER);
		});

		it('cannot compact min unsafe integer', () => {
			// Sanity:
			expect(0x0020000000000000 + 1).to.equal(0x0020000000000000);

			// Act:
			const result = uint64.compact([0x00000000, 0x00200000]);

			// Assert:
			expect(result).to.deep.equal([0x00000000, 0x00200000]);
		});

		it('cannot compact greater than min unsafe integer', () => {
			// Act:
			const result = uint64.compact([0xF0000000, 0x01000D00]);

			// Assert:
			expect(result).to.deep.equal([0xF0000000, 0x01000D00]);
		});
	});

	describe('fromUint', () => {
		// const failureTestCases = [
		// 	{ number: 0x0020000000000000, description: 'min unsafe integer' },
		// 	{ number: 0x01000D00F0000000, description: 'greater than min unsafe integer' },
		// 	{ number: -1, description: 'negative' },
		// 	{ number: 1234.56, description: 'floating point' }
		// ];

		// failureTestCases.forEach(testCase => {
		// 	it(`cannot parse number that is ${testCase.description}`, () => {
		// 		// Assert:
		// 		expect(() => uint64.fromUint(testCase.number)).to.throw(`number cannot be converted to uint '${testCase.number}'`);
		// 	});
		// });

		const successTestCases = [
			{ number: 0, uint64: [0, 0], description: '0' },
			{ number: 0xA1B2, uint64: [0xA1B2, 0], description: '(0, 8)' },
			{ number: 0x12345678, uint64: [0x12345678, 0], description: '8' },
			{ number: 0xABCD12345678, uint64: [0x12345678, 0xABCD], description: '(8, 16)' },
			{ number: 0x0014567890ABCDEF, uint64: [0x90ABCDEF, 0x00145678], description: '14' },
			{ number: Number.MAX_SAFE_INTEGER, uint64: [0xFFFFFFFF, 0x001FFFFF], description: '14 (max value)' }
		];

		successTestCases.forEach(testCase => {
			it(`can parse numeric with ${testCase.description} significant digits`, () => {
				// Act:
				const value = uint64.fromUint(testCase.number);

				// Assert:
				expect(value).to.deep.equal(testCase.uint64);
			});
		});
	});

	const hexTestCases = [
		{ str: '0000000000000000', value: [0, 0], description: '0' },
		{ str: '000000000000A1B2', value: [0xA1B2, 0], description: '(0, 8)' },
		{ str: '0000000012345678', value: [0x12345678, 0], description: '8' },
		{ str: '0000ABCD12345678', value: [0x12345678, 0xABCD], description: '(8, 16)' },
		{ str: '1234567890ABCDEF', value: [0x90ABCDEF, 0x12345678], description: '16' },
		{ str: 'FFFFFFFFFFFFFFFF', value: [0xFFFFFFFF, 0xFFFFFFFF], description: '16 (max value)' }
	];

	describe('fromBytes', () => {
		hexTestCases.forEach(testCase => {
			it(`can parse byte array with ${testCase.description} significant digits`, () => {
				// Arrange: prepare little-endian bytes
				const bytes = convert.hexToUint8(testCase.str).reverse();

				// Act:
				const value = uint64.fromBytes(bytes);

				// Assert:
				expect(value).to.deep.equal(testCase.value);
			});
		});

		it('cannot parse byte array with invalid size into uint64', () => {
			// Arrange:
			const errorMessage = 'byte array has unexpected size';

			// Assert:
			[0, 3, 4, 5, 7, 9].forEach(size => {
				expect(() => { uint64.fromBytes(new Uint8Array(size)); }, `size ${size}`).to.throw(errorMessage);
			});
		});
	});

	describe('fromBytes32', () => {
		const fromBytes32TestCases = [
			{ str: '00000000', value: [0, 0], description: '0' },
			{ str: '0000A1B2', value: [0xA1B2, 0], description: '(0, 8)' },
			{ str: '12345678', value: [0x12345678, 0], description: '8' },
			{ str: 'FFFFFFFF', value: [0xFFFFFFFF, 0], description: '8 (max value)' }
		];

		fromBytes32TestCases.forEach(testCase => {
			it(`can parse byte array with ${testCase.description} significant digits`, () => {
				// Arrange: prepare little-endian bytes
				const bytes = convert.hexToUint8(testCase.str).reverse();

				// Act:
				const value = uint64.fromBytes32(bytes);

				// Assert:
				expect(value).to.deep.equal(testCase.value);
			});
		});

		it('cannot parse byte array with invalid size into uint64', () => {
			// Arrange:
			const errorMessage = 'byte array has unexpected size';

			// Assert:
			[0, 3, 5, 7, 8, 9].forEach(size => {
				expect(() => { uint64.fromBytes32(new Uint8Array(size)); }, `size ${size}`).to.throw(errorMessage);
			});
		});
	});

	describe('fromHex', () => {
		hexTestCases.forEach(testCase => {
			it(`can parse hex string with ${testCase.description} significant digits`, () => {
				// Act:
				const value = uint64.fromHex(testCase.str);

				// Assert:
				expect(value).to.deep.equal(testCase.value);
			});
		});

		it('cannot parse hex string with invalid characters into uint64', () => {
			// Assert:
			expect(() => { uint64.fromHex('0000000012345G78'); }).to.throw('unrecognized hex char'); // contains 'G'
		});

		it('cannot parse hex string with invalid size into uint64', () => {
			// Arrange:
			const errorMessage = 'hex string has unexpected size';

			// Assert:
			expect(() => { uint64.fromHex(''); }).to.throw(errorMessage); // empty string
			expect(() => { uint64.fromHex('1'); }).to.throw(errorMessage); // odd number of chars
			expect(() => { uint64.fromHex('ABCDEF12'); }).to.throw(errorMessage); // too short
			expect(() => { uint64.fromHex('1234567890ABCDEF12'); }).to.throw(errorMessage); // too long
		});
	});

	describe('toHex', () => {
		hexTestCases.forEach(testCase => {
			it(`can format hex string with ${testCase.description} significant digits`, () => {
				// Act:
				const str = uint64.toHex(testCase.value);

				// Assert:
				expect(str).to.equal(testCase.str);
			});
		});
	});

	describe('isZero', () => {
		const zeroTestCases = [
			{ description: 'low and high are zero', value: [0, 0], isZero: true },
			{ description: 'low is nonzero and high is zero', value: [1, 0], isZero: false },
			{ description: 'low is zero and high is nonzero', value: [0, 1], isZero: false },
			{ description: 'low and high are nonzero', value: [74, 12], isZero: false }
		];

		zeroTestCases.forEach(testCase => {
			it(`returns ${testCase.isZero} when ${testCase.description}`, () => {
				// Act:
				const isZero = uint64.isZero(testCase.value);

				// Assert:
				expect(isZero).to.equal(testCase.isZero);
			});
		});
	});
});
