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

import { RawArray as array } from '../format';
import * as nacl from './nacl_catapult';
// tslint:disable-next-line: no-var-requires
export const CryptoJS = require('crypto-js');
export const Key_Size = 32;
export const Signature_Size = 64;
export const Half_Signature_Size = Signature_Size / 2;
export const Hash_Size = 64;
export const Half_Hash_Size = Hash_Size / 2;
// tslint:disable-next-line: no-var-requires
export const hkdf = require('futoin-hkdf');
import { sha512 } from 'js-sha512';

/**
 * Convert an Uint8Array to WordArray
 *
 * @param {Uint8Array} ua - An Uint8Array
 * @param {number} uaLength - The Uint8Array length
 *
 * @return {WordArray}
 */
export const ua2words = (ua, uaLength) => {
    const temp: number[] = [];
    for (let i = 0; i < uaLength; i += 4) {
        const x = ua[i] * 0x1000000 + (ua[i + 1] || 0) * 0x10000 + (ua[i + 2] || 0) * 0x100 + (ua[i + 3] || 0);
        temp.push((x > 0x7fffffff) ? x - 0x100000000 : x);
    }
    return CryptoJS.lib.WordArray.create(temp, uaLength);
};

/**
 * Convert a wordArray to Uint8Array
 *
 * @param {Uint8Array} destUa - A destination Uint8Array
 * @param {WordArray} cryptoWords - A wordArray
 *
 * @return {Uint8Array}
 */
export const words2ua = (destUa, cryptoWords) => {
    for (let i = 0; i < destUa.length; i += 4) {
        let v = cryptoWords.words[i / 4];
        if (v < 0) { v += 0x100000000; }
        destUa[i] = (v >>> 24);
        destUa[i + 1] = (v >>> 16) & 0xff;
        destUa[i + 2] = (v >>> 8) & 0xff;
        destUa[i + 3] = v & 0xff;
    }
    return destUa;
};

// custom catapult crypto functions
export const catapult_crypto = (() => {
    function clamp(d) {
        d[0] &= 248;
        d[31] &= 127;
        d[31] |= 64;
    }

    function prepareForScalarMult(sk) {
        const d = new Uint8Array(64);
        const hash = sha512.arrayBuffer(sk);
        array.copy(d, array.uint8View(hash), 32);
        clamp(d);
        return d;
    }

    return {
        deriveSharedKey: (privateKey: Uint8Array, publicKey: Uint8Array): Uint8Array => {
            const sharedSecret = catapult_crypto.deriveSharedSecret(privateKey, publicKey);
            const info = 'catapult';
            const hash = 'SHA-256';
            return hkdf(sharedSecret, 32, {salt: new Uint8Array(32), info, hash});
        },

        deriveSharedSecret: (privateKey: Uint8Array, publicKey: Uint8Array): Uint8Array => {
            const c = nacl;
            const d = prepareForScalarMult(privateKey);

            // sharedKey = pack(p = d (derived from privateKey) * q (derived from publicKey))
            const q = [c.gf(), c.gf(), c.gf(), c.gf()];
            const p = [c.gf(), c.gf(), c.gf(), c.gf()];
            const sharedSecret = new Uint8Array(Key_Size);

            c.unpack(q, publicKey);
            c.scalarmult(p, q, d);
            c.pack(sharedSecret, p);
            return sharedSecret;
        },
    };
})();
