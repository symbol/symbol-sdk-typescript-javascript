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

import { WalletAlgorithm } from '../../model/wallet/WalletAlgorithm';
import * as convert from '../format/Convert';
import { createKeyPairFromPrivateKeyString, deriveSharedKey } from './KeyPair';
import * as nacl from './nacl_catapult';

const CryptoJS = require('crypto-js');


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
 * @param {WordArray} cryptowords - A wordArray
 *
 * @return {Uint8Array}
 */
export const words2ua = (destUa, cryptowords) => {
    for (let i = 0; i < destUa.length; i += 4) {
        let v = cryptowords.words[i / 4];
        if (v < 0) { v += 0x100000000; }
        destUa[i] = (v >>> 24);
        destUa[i + 1] = (v >>> 16) & 0xff;
        destUa[i + 2] = (v >>> 8) & 0xff;
        destUa[i + 3] = v & 0xff;
    }
    return destUa;
};

/**
 * Encrypt a private key for mobile apps (AES_PBKF2)
 *
 * @param {string} password - A wallet password
 * @param {string} privateKey - An account private key
 *
 * @return {object} - The encrypted data
 */
export const toMobileKey = (password, privateKey) => {
    // Errors
    if (!password || !privateKey) { throw new Error('Missing argument !'); }
    // Processing
    const salt = CryptoJS.lib.WordArray.random(256 / 8);
    const key = CryptoJS.PBKDF2(password, salt, {
        keySize: 256 / 32,
        iterations: 2000,
    });
    const iv = nacl.randomBytes(16);
    const encIv = {
        iv: ua2words(iv, 16),
    };
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Hex.parse(privateKey), key, encIv);
    // Result
    return {
        encrypted: convert.uint8ToHex(iv) + encrypted.ciphertext,
        salt:  salt.toString(),
    };
};

/**
 * Derive a private key from a password using count iterations of SHA3-256
 *
 * @param {string} password - A wallet password
 * @param {number} count - A number of iterations above 0
 *
 * @return {object} - The derived private key
 */
export const derivePassSha = (password, count) => {
    // Errors
    if (!password) { throw new Error('Missing argument !'); }
    if (!count || count <= 0) { throw new Error('Please provide a count number above 0'); }
    // Processing
    let data = password;
    for (let i = 0; i < count; ++i) {
        data = CryptoJS.SHA3(data, {
            outputLength: 256,
        });
    }
    // Result
    return {
        priv: CryptoJS.enc.Hex.stringify(data),
    };
};

/**
 * Encrypt hex data using a key
 *
 * @param {string} data - An hex string
 * @param {Uint8Array} key - An Uint8Array key
 *
 * @return {object} - The encrypted data
 */
export const encrypt = (data, key) => {
    // Errors
    if (!data || !key) { throw new Error('Missing argument !'); }
    // Processing
    const iv = nacl.randomBytes(16);
    const encKey = ua2words(key, 32);
    const encIv = {
        iv: ua2words(iv, 16),
    };
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Hex.parse(data), encKey, encIv);
    // Result
    return {
        ciphertext: encrypted.ciphertext,
        iv,
        key,
    };
};

/**
 * Decrypt data
 *
 * @param {object} data - An encrypted data object
 *
 * @return {string} - The decrypted hex string
 */
export const decrypt = (data) => {
    // Errors
    if (!data) { throw new Error('Missing argument !'); }
    // Processing
    const encKey = ua2words(data.key, 32);
    const encIv = {
        iv: ua2words(data.iv, 16),
    };
    // Result
    return CryptoJS.enc.Hex.stringify(CryptoJS.AES.decrypt(data, encKey, encIv));
};

/**
 * Reveal the private key of an account or derive it from the wallet password
 *
 * @param {object} common- An object containing password and privateKey field
 * @param {object} walletAccount - A wallet account object
 * @param {WalletAlgorithm} algo - A wallet algorithm
 *
 * @return {object|boolean} - The account private key in and object or false
 */
export const passwordToPrivateKey = (common, walletAccount, algo) => {
    // Errors
    if (!common || !common.password || !walletAccount || !algo) { throw new Error('Missing argument !'); }
    // Processing
    let r;
    if (algo === WalletAlgorithm.Pass_6k) { // Brain wallets
        if (!walletAccount.encrypted && !walletAccount.iv) {
            // Account private key is generated simply using a passphrase so it has no encrypted and iv
            r = derivePassSha(common.password, 6000);
        } else if (!walletAccount.encrypted || !walletAccount.iv) {
            // Else if one is missing there is a problem
            return false;
        } else {
            // Else child accounts have encrypted and iv so we decrypt
            const pass = derivePassSha(common.password, 20);
            const obj = {
                ciphertext: CryptoJS.enc.Hex.parse(walletAccount.encrypted),
                iv: convert.hexToUint8(walletAccount.iv),
                key: convert.hexToUint8(pass.priv),
            };
            const d = decrypt(obj);
            r = { priv: d };
        }
    } else if (algo === WalletAlgorithm.Pass_bip32) { // Wallets from PRNG
        const pass = derivePassSha(common.password, 20);
        const obj = {
            ciphertext: CryptoJS.enc.Hex.parse(walletAccount.encrypted),
            iv: convert.hexToUint8(walletAccount.iv),
            key: convert.hexToUint8(pass.priv),
        };
        const d = decrypt(obj);
        r = { priv: d };
    } else if (algo === WalletAlgorithm.Pass_enc) { // Private Key wallets
        const pass = derivePassSha(common.password, 20);
        const obj = {
            ciphertext: CryptoJS.enc.Hex.parse(walletAccount.encrypted),
            iv: convert.hexToUint8(walletAccount.iv),
            key: convert.hexToUint8(pass.priv),
        };
        const d = decrypt(obj);
        r = { priv: d };
    } else if (algo === WalletAlgorithm.Trezor) { // HW wallet
        r = { priv: '' };
        common.isHW = true;
    } else {
        return false;
    }
    // Result
    common.privateKey = r.priv;
    return true;
};

/**
 * Generate a random key
 *
 * @return {Uint8Array} - A random key
 */
export const randomKey = () => {
    return nacl.randomBytes(32);
};

/**
 * Encode a private key using a password
 *
 * @param {string} privateKey - An hex private key
 * @param {string} password - A password
 *
 * @return {object} - The encoded data
 */
export const encodePrivateKey = (privateKey, password) => {
    // Errors
    if (!privateKey || !password) { throw new Error('Missing argument !'); }
    // Processing
    const pass = derivePassSha(password, 20);
    const r = encrypt(privateKey, convert.hexToUint8(pass.priv));
    // Result
    return {
        ciphertext: CryptoJS.enc.Hex.stringify(r.ciphertext),
        iv: convert.uint8ToHex(r.iv),
    };
};

/***
 * Encode a message, separated from encode() to help testing
 *
 * @param {string} senderPriv - A sender private key
 * @param {string} recipientPub - A recipient public key
 * @param {string} msg - A text message
 * @param {Uint8Array} iv - An initialization vector
 * @param {Uint8Array} salt - A salt
 *
 * @return {string} - The encoded message
 */
const _encode = function(senderPriv, recipientPub, msg, iv, salt) {
    // Errors
    if (!senderPriv || !recipientPub || !msg || !iv || !salt) { throw new Error('Missing argument !'); }
    // Processing
    const keyPair = createKeyPairFromPrivateKeyString(senderPriv);
    const pk = convert.hexToUint8(recipientPub);
    const encKey = ua2words(deriveSharedKey(keyPair, pk, salt), 32);
    const encIv = {
        iv: ua2words(iv, 16),
    };
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Hex.parse(convert.utf8ToHex(msg)), encKey, encIv);
    // Result
    const result = convert.uint8ToHex(salt) + convert.uint8ToHex(iv) + CryptoJS.enc.Hex.stringify(encrypted.ciphertext);
    return result;
};

/**
 * Encode a message
 *
 * @param {string} senderPriv - A sender private key
 * @param {string} recipientPub - A recipient public key
 * @param {string} msg - A text message
 *
 * @return {string} - The encoded message
 */
export const encode = (senderPriv, recipientPub, msg) => {
    // Errors
    if (!senderPriv || !recipientPub || !msg) { throw new Error('Missing argument !'); }
    // Processing
    const iv = nacl.randomBytes(16);
    const salt = nacl.randomBytes(32);
    const encoded = _encode(senderPriv, recipientPub, msg, iv, salt);
    // Result
    return encoded;
};

/**
 * Decode an encrypted message payload
 *
 * @param {string} recipientPrivate - A recipient private key
 * @param {string} senderPublic - A sender public key
 * @param {string} _payload - An encrypted message payload
 *
 * @return {string} - The decoded payload as hex
 */
export const decode = (recipientPrivate, senderPublic, _payload) => {
    // Error
    if (!recipientPrivate || !senderPublic || !_payload) { throw new Error('Missing argument !'); }
    // Processing
    const binPayload = convert.hexToUint8(_payload);
    const salt = new Uint8Array(binPayload.buffer, 0, 32);
    const iv = new Uint8Array(binPayload.buffer, 32, 16);
    const payload = new Uint8Array(binPayload.buffer, 48);

    const keyPair = createKeyPairFromPrivateKeyString(recipientPrivate);
    const pk = convert.hexToUint8(senderPublic);
    const encKey = ua2words(deriveSharedKey(keyPair, pk, salt), 32);
    const encIv = {
        iv: ua2words(iv, 16),
    };
    const encrypted = {
        ciphertext: ua2words(payload, payload.length),
    };
    const plain = CryptoJS.AES.decrypt(encrypted, encKey, encIv);
    // Result
    return CryptoJS.enc.Hex.stringify(plain);
};

const hashfunc = (dest, data, dataLength) => {
    const convertedData = ua2words(data, dataLength);
    const hash = CryptoJS.SHA3(convertedData, {
        outputLength: 512,
    });
    words2ua(dest, hash);
};
