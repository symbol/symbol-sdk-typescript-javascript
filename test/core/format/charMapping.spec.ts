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
import charMapping from '../../../src/core/format/charMapping';

describe('char mapping', () => {
	describe('builder', () => {
		it('initially has empty map', () => {
			// Arrange:
			const builder = charMapping.createBuilder();

			// Act:
			const map = builder.map;

			// Assert:
			expect(map).to.deep.equal({});
		});

		it('can add single arbitrary range with zero base', () => {
			// Arrange:
			const builder = charMapping.createBuilder();

			// Act:
			builder.addRange('d', 'f', 0);
			const map = builder.map;

			// Assert:
			expect(map).to.deep.equal({
				d: 0,
				e: 1,
				f: 2
			});
		});

		it('can add single arbitrary range with nonzero base', () => {
			// Arrange:
			const builder = charMapping.createBuilder();

			// Act:
			builder.addRange('d', 'f', 17);
			const map = builder.map;

			// Assert:
			expect(map).to.deep.equal({
				d: 17,
				e: 18,
				f: 19
			});
		});

		it('can add multiple arbitrary ranges', () => {
			// Arrange:
			const builder = charMapping.createBuilder();

			// Act:
			builder.addRange('b', 'b', 8);
			builder.addRange('d', 'f', 17);
			builder.addRange('y', 'z', 0);
			const map = builder.map;

			// Assert:
			expect(map).to.deep.equal({
				b: 8,
				d: 17,
				e: 18,
				f: 19,
				y: 0,
				z: 1
			});
		});

		it('can add multiple arbitrary overlapping ranges', () => {
			// Arrange:
			const builder = charMapping.createBuilder();

			// Act:
			builder.addRange('b', 'b', 18);
			builder.addRange('d', 'f', 17);
			builder.addRange('y', 'z', 19);
			const map = builder.map;

			// Assert:
			expect(map).to.deep.equal({
				b: 18,
				d: 17,
				e: 18,
				f: 19,
				y: 19,
				z: 20
			});
		});
	});
});

