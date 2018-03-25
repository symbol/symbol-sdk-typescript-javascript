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
import {PublicAccount} from '../../../src/model/account/PublicAccount';
import {NetworkType} from '../../../src/model/blockchain/NetworkType';

describe('PublicAccount', () => {
    const publicKey = 'b4f12e7c9f6946091e2cb8b6d3a12b50d17ccbbf646386ea27ce2946a7423dcf';

    it('should createComplete a public account from public key', () => {
        const publicAccount = PublicAccount.createFromPublicKey(publicKey, NetworkType.MIJIN_TEST);
        expect(publicAccount.publicKey).to.be.equal(publicKey);
        expect(publicAccount.address.plain()).to.be.equal('SARNASAS2BIAB6LMFA3FPMGBPGIJGK6IJETM3ZSP');
    });
});
