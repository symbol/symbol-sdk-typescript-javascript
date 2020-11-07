/*
 * Copyright 2020 NEM
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
import * as CryptoJS from 'crypto-js';
import { sha3_256, sha3_512 } from 'js-sha3';
import { LockHashAlgorithm, LockHashAlgorithmLengthValidator } from '../../../src/model/lock/LockHashAlgorithm';

describe('LockHashAlgorithmLengthValidator', () => {
    it('LockHashAlgorithm.SHA3_256 should be exactly 64 chars length', () => {
        expect(LockHashAlgorithmLengthValidator(LockHashAlgorithm.Op_Sha3_256, sha3_256.create().update('abcxyz').hex())).to.be.equal(true);
    });

    it('LockHashAlgorithm.SHA3_256 should return false if it is not 64 chars length', () => {
        expect(LockHashAlgorithmLengthValidator(LockHashAlgorithm.Op_Sha3_256, sha3_512.create().update('abcxyz').hex())).to.be.equal(
            false,
        );
    });

    it('LockHashAlgorithm.SHA_256 should return false if it is not a hash valid', () => {
        const invalidHash =
            'zyz6053bb910a6027f138ac5ebe92d43a9a18b7239b3c4d5ea69f1632e50aeef28184e46cd22ded096b76631858' +
            '0a569e74521a9d63885cc8d5e8644793be928';
        expect(LockHashAlgorithmLengthValidator(LockHashAlgorithm.Op_Sha3_256, invalidHash)).to.be.equal(false);
    });

    it('LockHashAlgorithm.Op_Hash_256 should be exactly 64 chars length', () => {
        expect(
            LockHashAlgorithmLengthValidator(
                LockHashAlgorithm.Op_Hash_256,
                CryptoJS.SHA256(CryptoJS.SHA256('abcxyz').toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex),
            ),
        ).to.be.equal(true);
    });

    it('LockHashAlgorithm.Op_Hash_256 should return false if it is not 64 chars length', () => {
        expect(LockHashAlgorithmLengthValidator(LockHashAlgorithm.Op_Hash_256, sha3_512.create().update('abcxyz').toString())).to.be.equal(
            false,
        );
    });

    it('LockHashAlgorithm.Op_Hash_256 should return false if it is not a hash valid', () => {
        const invalidHash =
            'zyz6053bb910a6027f138ac5ebe92d43a9a18b7239b3c4d5ea69f1632e50aeef28184e46cd22ded096b76631858' +
            '0a569e74521a9d63885cc8d5e8644793be928';
        expect(LockHashAlgorithmLengthValidator(LockHashAlgorithm.Op_Hash_256, invalidHash)).to.be.equal(false);
    });

    it('LockHashAlgorithm.Op_Hash_160 should be exactly 40 chars length', () => {
        expect(
            LockHashAlgorithmLengthValidator(
                LockHashAlgorithm.Op_Hash_160,
                CryptoJS.RIPEMD160(CryptoJS.SHA256('abcxyz').toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex),
            ),
        ).to.be.equal(true);
    });

    it('LockHashAlgorithm.Op_Hash_160 should return false if it is not 64 chars length', () => {
        expect(LockHashAlgorithmLengthValidator(LockHashAlgorithm.Op_Hash_160, sha3_512.create().update('abcxyz').toString())).to.be.equal(
            false,
        );
    });

    it('LockHashAlgorithm.Op_Hash_160 should return false if it is not a hash valid', () => {
        const invalidHash =
            'zyz6053bb910a6027f138ac5ebe92d43a9a18b7239b3c4d5ea69f1632e50aeef28184e46cd22ded096b76631858' +
            '0a569e74521a9d63885cc8d5e8644793be928';
        expect(LockHashAlgorithmLengthValidator(LockHashAlgorithm.Op_Hash_160, invalidHash)).to.be.equal(false);
    });
});
