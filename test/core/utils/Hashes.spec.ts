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
import { Crypto } from '../../../src/core/crypto';
import { sha3_256 } from 'js-sha3';
import { LockHashUtils } from '../../../src/core/utils/LockHashUtils';

describe('Hashes', () => {
    it('Op_Sha3_256', () => {
        const secretSeed = Crypto.randomBytes(20);
        const expected = sha3_256.create().update(secretSeed).hex();
        const hash = LockHashUtils.Op_Sha3_256(secretSeed);
        expect(expected).to.be.equal(hash);
    });

    it('Op_Sha_256', () => {
        const sha256 = require('js-sha256');
        const randomBytes = Crypto.randomBytes(32);
        const secretSeed = randomBytes.toString('hex');
        const hash256 = sha256(Buffer.from(secretSeed, 'hex'));
        const expected = sha256(Buffer.from(hash256, 'hex'));
        const hash = LockHashUtils.Op_Hash_256(randomBytes);
        expect(expected).to.be.equal(hash);
    });

    it('Op_Hash_160', () => {
        const ripemd160 = require('ripemd160');
        const sha256 = require('js-sha256');
        const secretSeed = Crypto.randomBytes(20);
        const hash256 = sha256(Buffer.from(secretSeed, 'hex'));
        const expected = new ripemd160().update(Buffer.from(hash256, 'hex')).digest('hex');

        const hash = LockHashUtils.Op_Hash_160(secretSeed);
        expect(expected).to.be.equal(hash);
    });
});
