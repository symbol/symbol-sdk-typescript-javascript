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
import { UInt64 } from '../../../src/model/UInt64';
import { KeyGenerator } from '../../../src/core/format/KeyGenerator';

describe('key generator', () => {
    describe('generate key from string', () => {
        it('throws if input is empty', () => {
            expect(() => KeyGenerator.fromString('')).to.throw(Error, 'Input must not be empty');
        })
        it('returns UInt64', () => {
            expect(KeyGenerator.fromString('a')).to.be.instanceOf(UInt64);
        })
        it('throws if input has invalid format', () => {
            expect(() => KeyGenerator.fromString('$abc')).to.throw(Error, '');
            expect(() => KeyGenerator.fromString('ab-c')).to.throw(Error, '');
            expect(() => KeyGenerator.fromString('abc.')).to.throw(Error, '');
        })
        it('generates correct keys', () => {
            expect(KeyGenerator.fromString('a').toHex()).to.equal('80084BF2FBA02475');
        })
        it('generates keys deterministically', () => {
            expect(KeyGenerator.fromString('abc').toHex()).to.equal('3A985DA74FE225B2');
            expect(KeyGenerator.fromString('abc').toHex()).to.equal('3A985DA74FE225B2');
            expect(KeyGenerator.fromString('def').toHex()).to.equal('8E0D8F672252ACB0');
            expect(KeyGenerator.fromString('def').toHex()).to.equal('8E0D8F672252ACB0');
            expect(KeyGenerator.fromString('abc').toHex()).to.equal('3A985DA74FE225B2');
        })
    })
});