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
import { KeyGenerator } from '../../../src/core/format/KeyGenerator';
import { BigIntUtilities } from '../../../src/core/format/BigIntUtilities';

describe('key generator', () => {
    describe('generate key from string', () => {
        it('throws if input is empty', () => {
            expect(() => KeyGenerator.generateUInt64Key('')).to.throw(Error, 'Input must not be empty');
        });
        it('returns UInt64', () => {
            expect(KeyGenerator.generateUInt64Key('a')).to.be.instanceOf(BigInt);
        });
        it('generates correct keys', () => {
            expect(KeyGenerator.generateUInt64Key('a')).to.equal(BigIntUtilities.HexToBigInt('F524A0FBF24B0880'));
        });
        it('generates keys deterministically', () => {
            expect(KeyGenerator.generateUInt64Key('abc')).to.equal(BigIntUtilities.HexToBigInt('B225E24FA75D983A'));
            expect(KeyGenerator.generateUInt64Key('abc')).to.equal(BigIntUtilities.HexToBigInt('B225E24FA75D983A'));
            expect(KeyGenerator.generateUInt64Key('def')).to.equal(BigIntUtilities.HexToBigInt('B0AC5222678F0D8E'));
            expect(KeyGenerator.generateUInt64Key('def')).to.equal(BigIntUtilities.HexToBigInt('B0AC5222678F0D8E'));
            expect(KeyGenerator.generateUInt64Key('abc')).to.equal(BigIntUtilities.HexToBigInt('B225E24FA75D983A'));
        });
    });
});
