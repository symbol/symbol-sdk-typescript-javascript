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
import {EncryptedPrivateKey} from '../../../src/model/wallet/EncryptedPrivateKey';
import {Password} from '../../../src/model/wallet/Password';

describe('EncryptedPrivateKey', () => {

    it('should createComplete a private key encrypted object', () => {
        const privateKeyEncrypted = new EncryptedPrivateKey(
            'b6edb40bae6d099f099775bc828e36961f7fbb5e3ee62236714ad1e980ac8986bd4ed690f576abb5268ba0915ae575e7',
            '4344645752e57065f814b51713d05810');
        expect(privateKeyEncrypted.encryptedKey)
            .to.be.equal('b6edb40bae6d099f099775bc828e36961f7fbb5e3ee62236714ad1e980ac8986bd4ed690f576abb5268ba0915ae575e7');
        expect(privateKeyEncrypted.iv).to.be.equal('4344645752e57065f814b51713d05810');
    });

    it('should decrypt a private key encrypted object', () => {
        const privateKeyEncrypted = new EncryptedPrivateKey(
            'b6edb40bae6d099f099775bc828e36961f7fbb5e3ee62236714ad1e980ac8986bd4ed690f576abb5268ba0915ae575e7',
            '4344645752e57065f814b51713d05810');
        const privateKeyDecrypted = privateKeyEncrypted.decrypt(new Password('password'));
        expect(privateKeyDecrypted).to.be.equal('e85467d94fdf70b5713d3b3b083597e0962f38843feb10259158a3fa6dc444b6');
    });
});
