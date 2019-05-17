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

import convert from '../format/convert'
import nacl from './nacl_catapult';
import CryptoJS from 'crypto-js';
import {keyPair as KeyPair } from './keyPair';

/**
 * Encrypt a private key for mobile apps (AES_PBKF2)
 *
 * @param {string} password - A wallet password
 * @param {string} privateKey - An account private key
 *
 * @return {object} - The encrypted data
 */
let toMobileKey = function(password, privateKey) {
    // Errors
    if (!password || !privateKey) throw new Error('Missing argument !');
    //if (!Helpers.isPrivateKeyValid(privateKey)) throw new Error('Private key is not valid !');
    // Processing
    let salt = CryptoJS.lib.WordArray.random(256 / 8);
    let key = CryptoJS.PBKDF2(password, salt, {
        keySize: 256 / 32,
        iterations: 2000
    });
    let iv = nacl.randomBytes(16)
    let encIv = {
        iv: ua2words(iv, 16)
    };
    let encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Hex.parse(privateKey), key, encIv);
    // Result
    return {
        encrypted: convert.uint8ToHex(iv) + encrypted.ciphertext,
        salt:  salt.toString()
    }
};

/**
 * Derive a private key from a password using count iterations of SHA3-256
 *
 * @param {string} password - A wallet password
 * @param {number} count - A number of iterations above 0
 *
 * @return {object} - The derived private key
 */
let derivePassSha = function(password, count) {
    // Errors
    if(!password) throw new Error('Missing argument !');
    if(!count || count <= 0) throw new Error('Please provide a count number above 0');
    // Processing
    let data = password;
    console.time('sha3^n generation time');
    for (let i = 0; i < count; ++i) {
        data = CryptoJS.SHA3(data, {
            outputLength: 256
        });
    }
    console.timeEnd('sha3^n generation time');
    // Result
    return {
        'priv': CryptoJS.enc.Hex.stringify(data)
    };
};

/**
 * Reveal the private key of an account or derive it from the wallet password
 *
 * @param {object} common- An object containing password and privateKey field
 * @param {object} walletAccount - A wallet account object
 * @param {string} algo - A wallet algorithm
 *
 * @return {object|boolean} - The account private key in and object or false
 */
let passwordToPrivatekey = function(common, walletAccount, algo) {
    // Errors
    if(!common || !common.password || !walletAccount || !algo) throw new Error('Missing argument !');
    // Processing
    let r = undefined;
    if (algo === "pass:6k") { // Brain wallets
        if (!walletAccount.encrypted && !walletAccount.iv) {
            // Account private key is generated simply using a passphrase so it has no encrypted and iv
            r = derivePassSha(common.password, 6000);
        } else if (!walletAccount.encrypted || !walletAccount.iv) {
            // Else if one is missing there is a problem
            //console.log("Account might be compromised, missing encrypted or iv");
            return false;
        } else {
            // Else child accounts have encrypted and iv so we decrypt
            let pass = derivePassSha(common.password, 20);
            let obj = {
                ciphertext: CryptoJS.enc.Hex.parse(walletAccount.encrypted),
                iv: convert.hexToUint8(walletAccount.iv),
                key: convert.hexToUint8(pass.priv)
            };
            let d = decrypt(obj);
            r = { 'priv': d };
        }
    } else if (algo === "pass:bip32") { // Wallets from PRNG
        let pass = derivePassSha(common.password, 20);
        let obj = {
            ciphertext: CryptoJS.enc.Hex.parse(walletAccount.encrypted),
            iv: convert.hexToUint8(walletAccount.iv),
            key: convert.hexToUint8(pass.priv)
        };
        let d = decrypt(obj);
        r = { 'priv': d };
    } else if (algo === "pass:enc") { // Private Key wallets
        let pass = derivePassSha(common.password, 20);
        let obj = {
            ciphertext: CryptoJS.enc.Hex.parse(walletAccount.encrypted),
            iv: convert.hexToUint8(walletAccount.iv),
            key: convert.hexToUint8(pass.priv)
        };
        let d = decrypt(obj);
        r = { 'priv': d };
    } else if (algo === "trezor") { // HW wallet
        r = { 'priv': '' };
        common.isHW = true;
    } else {
        //console.log("Unknown wallet encryption method");
        return false;
    }
    // Result
    common.privateKey = r.priv;
    return true;
}


function hashfunc(dest, data, dataLength) {
    let convertedData = ua2words(data, dataLength);
    let hash = CryptoJS.SHA3(convertedData, {
        outputLength: 512
    });
    words2ua(dest, hash);
}

/**
 * Generate a random key
 *
 * @return {Uint8Array} - A random key
 */
let randomKey = function() {
    let rkey = nacl.randomBytes(32)
    return rkey;
};

/**
 * Encrypt hex data using a key
 *
 * @param {string} data - An hex string
 * @param {Uint8Array} key - An Uint8Array key
 *
 * @return {object} - The encrypted data
 */
let encrypt = function(data, key) {
    // Errors
    if (!data || !key) throw new Error('Missing argument !');
    // Processing
    let iv = nacl.randomBytes(16)
    let encKey = ua2words(key, 32);
    let encIv = {
        iv: ua2words(iv, 16)
    };
    let encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Hex.parse(data), encKey, encIv);
    // Result
    return {
        ciphertext: encrypted.ciphertext,
        iv: iv,
        key: key
    };
};

/**
 * Decrypt data
 *
 * @param {object} data - An encrypted data object
 *
 * @return {string} - The decrypted hex string
 */
let decrypt = function(data) {
    // Errors
    if (!data) throw new Error('Missing argument !');
    // Processing
    let encKey = ua2words(data.key, 32);
    let encIv = {
        iv: ua2words(data.iv, 16)
    };
    // Result
    return CryptoJS.enc.Hex.stringify(CryptoJS.AES.decrypt(data, encKey, encIv));
};

/**
 * Encode a private key using a password
 *
 * @param {string} privateKey - An hex private key
 * @param {string} password - A password
 *
 * @return {object} - The encoded data
 */
let encodePrivKey = function(privateKey, password) {
    // Errors
    if (!privateKey || !password) throw new Error('Missing argument !');
    //if (!Helpers.isPrivateKeyValid(privateKey)) throw new Error('Private key is not valid !');
    // Processing
    let pass = derivePassSha(password, 20);
    let r = encrypt(privateKey, convert.hexToUint8(pass.priv));
    // Result
    return {
        ciphertext: CryptoJS.enc.Hex.stringify(r.ciphertext),
        iv: convert.uint8ToHex(r.iv)
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
let _encode = function(senderPriv, recipientPub, msg, iv, salt) {
    // Errors
    if (!senderPriv || !recipientPub || !msg || !iv || !salt) throw new Error('Missing argument !');
    // Processing
    let keyPair = KeyPair.createKeyPairFromPrivateKeyString(senderPriv);
    let pk = convert.hexToUint8(recipientPub);
    let encKey = KeyPair.deriveSharedKey(keyPair, pk, salt);
    let encIv = {
        iv: ua2words(iv, 16)
    };
    let encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Hex.parse(convert.utf8ToHex(msg)), encKey, encIv);
    // Result
    let result = convert.uint8ToHex(salt) + convert.uint8ToHex(iv) + CryptoJS.enc.Hex.stringify(encrypted.ciphertext);
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
let encode = function(senderPriv, recipientPub, msg) {
    // Errors
    if (!senderPriv || !recipientPub || !msg) throw new Error('Missing argument !');
    //if (!Helpers.isPrivateKeyValid(senderPriv)) throw new Error('Private key is not valid !');
    //if (!Helpers.isPublicKeyValid(recipientPub)) throw new Error('Public key is not valid !');
    // Processing
    let iv = nacl.randomBytes(16)
    //console.log("IV:", convert.uint8ToHex(iv));
    let salt = nacl.randomBytes(32)
    let encoded = _encode(senderPriv, recipientPub, msg, iv, salt);
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
let decode = function(recipientPrivate, senderPublic, _payload) {
    // Errorsp
    if(!recipientPrivate || !senderPublic || !_payload) throw new Error('Missing argument !');
    // Processing
    let binPayload = convert.hexToUint8(_payload);
    let salt = new Uint8Array(binPayload.buffer, 0, 32);
    let iv = new Uint8Array(binPayload.buffer, 32, 16);
    let payload = new Uint8Array(binPayload.buffer, 48);

    let keyPair =  KeyPair.createKeyPairFromPrivateKeyString(recipientPrivate);
    let pk = convert.hexToUint8(senderPublic);
    let encKey = KeyPair.deriveSharedKey(keyPair, pk, salt);
    let encIv = {
        iv: ua2words(iv, 16)
    };
    let encrypted = {
        'ciphertext': ua2words(payload, payload.length)
    };
    let plain = CryptoJS.AES.decrypt(encrypted, encKey, encIv);
    // Result
    let hexplain = CryptoJS.enc.Hex.stringify(plain);
    return hexplain;
};

/**
 * Convert an Uint8Array to WordArray
 *
 * @param {Uint8Array} ua - An Uint8Array
 * @param {number} uaLength - The Uint8Array length
 *
 * @return {WordArray}
 */
let ua2words = function(ua, uaLength) {
    let temp = [];
    for (let i = 0; i < uaLength; i += 4) {
        let x = ua[i] * 0x1000000 + (ua[i + 1] || 0) * 0x10000 + (ua[i + 2] || 0) * 0x100 + (ua[i + 3] || 0);
        temp.push((x > 0x7fffffff) ? x - 0x100000000 : x);
    }
    return CryptoJS.lib.WordArray.create(temp, uaLength);
}

/**
 * Convert a wordArray to Uint8Array
 *
 * @param {Uint8Array} destUa - A destination Uint8Array
 * @param {WordArray} cryptowords - A wordArray
 *
 * @return {Uint8Array}
 */
let words2ua = function(destUa, cryptowords) {
    for (let i = 0; i < destUa.length; i += 4) {
        let v = cryptowords.words[i / 4];
        if (v < 0) v += 0x100000000;
        destUa[i] = (v >>> 24);
        destUa[i + 1] = (v >>> 16) & 0xff;
        destUa[i + 2] = (v >>> 8) & 0xff;
        destUa[i + 3] = v & 0xff;
    }
    return destUa;
}

module.exports.crypto = {
    toMobileKey,
    derivePassSha,
    passwordToPrivatekey,
    randomKey,
    decrypt,
    encrypt,
    encodePrivKey,
    _encode,
    encode,
    decode
}
