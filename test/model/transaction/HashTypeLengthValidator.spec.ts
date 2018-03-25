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
import {sha3_256, sha3_512} from 'js-sha3';
import {HashType, HashTypeLengthValidator} from '../../../src/model/transaction/HashType';

describe('HashTypeLengthValidator', () => {
    it('HashType.SHA3_512 should be exactly 128 chars length', () => {
        expect(HashTypeLengthValidator(HashType.SHA3_512, sha3_512.create().update('abcxyz').hex())).to.be.equal(true);
    });

    it('HashType.SHA3_512 should return false if it is not 128 chars length', () => {
        expect(HashTypeLengthValidator(HashType.SHA3_512, sha3_256.create().update('abcxyz').hex())).to.be.equal(false);
    });

    it('HashType.SHA_512 should return false if it is not a hash valid', () => {
        const invalidHash = 'zyz6053bb910a6027f138ac5ebe92d43a9a18b7239b3c4d5ea69f1632e50aeef28184e46cd22ded096b76631858' +
            '0a569e74521a9d63885cc8d5e8644793be928';
        expect(HashTypeLengthValidator(HashType.SHA3_512, invalidHash)).to.be.equal(false);
    });
});
