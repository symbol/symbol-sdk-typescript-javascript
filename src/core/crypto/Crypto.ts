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
import { Convert as convert } from '../format/Convert';
import { KeyPair } from './KeyPair';
import * as utility from './Utilities';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CryptoJS = require('crypto-js');

export class Crypto {
    /**
     * Encrypt a private key for mobile apps (AES_PBKF2)
     *
     * @param {string} password - A wallet password
     * @param {string} privateKey - An account private key
     *
     * @return {object} - The encrypted data
     */
    public static toMobileKey = (password, privateKey) => {
        // Errors
        if (!password || !privateKey) {
            throw new Error('Missing argument !');
        }
        // Processing
        const salt = CryptoJS.lib.WordArray.random(256 / 8);
        const key = CryptoJS.PBKDF2(password, salt, {
            keySize: 256 / 32,
            iterations: 2000,
        });
        const iv = Crypto.randomBytes(16);
        const encIv = {
            iv: utility.ua2words(iv, 16),
        };
        const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Hex.parse(privateKey), key, encIv);
        // Result
        return {
            encrypted: convert.uint8ToHex(iv) + encrypted.ciphertext,
            salt: salt.toString(),
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
    public static derivePassSha = (password, count) => {
        // Errors
        if (!password) {
            throw new Error('Missing argument !');
        }
        if (!count || count <= 0) {
            throw new Error('Please provide a count number above 0');
        }
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
    public static encrypt = (data, key) => {
        // Errors
        if (!data || !key) {
            throw new Error('Missing argument !');
        }
        // Processing
        const iv = Crypto.randomBytes(16);
        const encKey = utility.ua2words(key, 32);
        const encIv = {
            iv: utility.ua2words(iv, 16),
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
    public static decrypt = (data) => {
        // Errors
        if (!data) {
            throw new Error('Missing argument !');
        }
        // Processing
        const encKey = utility.ua2words(data.key, 32);
        const encIv = {
            iv: utility.ua2words(data.iv, 16),
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
    public static passwordToPrivateKey = (common, walletAccount, algo) => {
        // Errors
        if (!common || !common.password || !walletAccount || !algo) {
            throw new Error('Missing argument !');
        }
        // Processing
        let r;
        if (algo === WalletAlgorithm.Pass_6k) {
            // Brain wallets
            if (!walletAccount.encrypted && !walletAccount.iv) {
                // Account private key is generated simply using a passphrase so it has no encrypted and iv
                r = Crypto.derivePassSha(common.password, 6000);
            } else if (!walletAccount.encrypted || !walletAccount.iv) {
                // Else if one is missing there is a problem
                return false;
            } else {
                // Else child accounts have encrypted and iv so we decrypt
                const pass = Crypto.derivePassSha(common.password, 20);
                const obj = {
                    ciphertext: CryptoJS.enc.Hex.parse(walletAccount.encrypted),
                    iv: convert.hexToUint8(walletAccount.iv),
                    key: convert.hexToUint8(pass.priv),
                };
                const d = Crypto.decrypt(obj);
                r = { priv: d };
            }
        } else if (algo === WalletAlgorithm.Pass_bip32) {
            // Wallets from PRNG
            const pass = Crypto.derivePassSha(common.password, 20);
            const obj = {
                ciphertext: CryptoJS.enc.Hex.parse(walletAccount.encrypted),
                iv: convert.hexToUint8(walletAccount.iv),
                key: convert.hexToUint8(pass.priv),
            };
            const d = Crypto.decrypt(obj);
            r = { priv: d };
        } else if (algo === WalletAlgorithm.Pass_enc) {
            // Private Key wallets
            const pass = Crypto.derivePassSha(common.password, 20);
            const obj = {
                ciphertext: CryptoJS.enc.Hex.parse(walletAccount.encrypted),
                iv: convert.hexToUint8(walletAccount.iv),
                key: convert.hexToUint8(pass.priv),
            };
            const d = Crypto.decrypt(obj);
            r = { priv: d };
        } else if (algo === WalletAlgorithm.Trezor) {
            // HW wallet
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
    public static randomKey = () => {
        return Crypto.randomBytes(32);
    };

    /**
     * Encode a private key using a password
     *
     * @param {string} privateKey - An hex private key
     * @param {string} password - A password
     *
     * @return {object} - The encoded data
     */
    public static encodePrivateKey = (privateKey, password) => {
        // Errors
        if (!privateKey || !password) {
            throw new Error('Missing argument !');
        }
        // Processing
        const pass = Crypto.derivePassSha(password, 20);
        const r = Crypto.encrypt(privateKey, convert.hexToUint8(pass.priv));
        // Result
        return {
            ciphertext: CryptoJS.enc.Hex.stringify(r.ciphertext),
            iv: convert.uint8ToHex(r.iv),
        };
    };

    /** *
     * Encode a message, separated from encode() to help testing
     *
     * @param {string} senderPriv - A sender private key
     * @param {string} recipientPub - A recipient public key
     * @param {string} msg - A text message
     * @param {Uint8Array} iv - An initialization vector
     * @param {Uint8Array} salt - A salt
     * @return {string} - The encoded message
     */
    public static _encode = (senderPriv: string, recipientPub: string, msg: string, iv: Uint8Array): string => {
        // Errors
        if (!senderPriv || !recipientPub || !msg || !iv) {
            throw new Error('Missing argument !');
        }
        // Processing
        const keyPair = KeyPair.createKeyPairFromPrivateKeyString(senderPriv);
        const pk = convert.hexToUint8(recipientPub);
        const encKey = utility.ua2words(utility.catapult_crypto.deriveSharedKey(keyPair.privateKey, pk), 32);
        const encIv = {
            iv: utility.ua2words(iv, 16),
        };
        const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Hex.parse(msg), encKey, encIv);
        // Result
        const result = convert.uint8ToHex(iv) + CryptoJS.enc.Hex.stringify(encrypted.ciphertext);
        return result;
    };

    /**
     * Encode a message
     *
     * @param {string} senderPriv - A sender private key
     * @param {string} recipientPub - A recipient public key
     * @param {string} msg - A text message
     * @param {boolean} isHexString - Is payload string a hexadecimal string (default = false)
     * @return {string} - The encoded message
     */
    public static encode = (senderPriv: string, recipientPub: string, msg: string, isHexString = false): string => {
        // Errors
        if (!senderPriv || !recipientPub || !msg) {
            throw new Error('Missing argument !');
        }
        // Processing
        const iv = Crypto.randomBytes(16);
        const encoded = Crypto._encode(senderPriv, recipientPub, isHexString ? msg : convert.utf8ToHex(msg), iv);
        // Result
        return encoded;
    };

    /**
     * Decode an encrypted message payload
     *
     * @param {string} recipientPrivate - A recipient private key
     * @param {string} senderPublic - A sender public key
     * @param {Uint8Array} payload - An encrypted message payload in bytes
     * @param {Uint8Array} iv - 16-byte AES initialization vector
     * @return {string} - The decoded payload as hex
     */
    public static _decode = (recipientPrivate: string, senderPublic: string, payload: Uint8Array, iv: Uint8Array): string => {
        // Error
        if (!recipientPrivate || !senderPublic || !payload) {
            throw new Error('Missing argument !');
        }
        // Processing
        const keyPair = KeyPair.createKeyPairFromPrivateKeyString(recipientPrivate);
        const pk = convert.hexToUint8(senderPublic);
        const encKey = utility.ua2words(utility.catapult_crypto.deriveSharedKey(keyPair.privateKey, pk), 32);
        const encIv = {
            iv: utility.ua2words(iv, 16),
        };
        const encrypted = {
            ciphertext: utility.ua2words(payload, payload.length),
        };
        const plain = CryptoJS.AES.decrypt(encrypted, encKey, encIv);
        // Result
        return CryptoJS.enc.Hex.stringify(plain);
    };

    /**
     * Decode an encrypted message payload
     *
     * @param {string} recipientPrivate - A recipient private key
     * @param {string} senderPublic - A sender public key
     * @param {string} payload - An encrypted message payload
     * @return {string} - The decoded payload as hex
     */
    public static decode = (recipientPrivate: string, senderPublic: string, payload: string): string => {
        // Error
        if (!recipientPrivate || !senderPublic || !payload) {
            throw new Error('Missing argument !');
        }
        // Processing
        const binPayload = convert.hexToUint8(payload);
        const payloadBuffer = new Uint8Array(binPayload.buffer, 16);
        const iv = new Uint8Array(binPayload.buffer, 0, 16);
        const decoded = Crypto._decode(recipientPrivate, senderPublic, payloadBuffer, iv);
        return decoded.toUpperCase();
    };

    /**
     * Generate random bytes by length
     * @param {number} length - The length of the random bytes
     *
     * @return {Uint8Array}
     */
    public static randomBytes = (length) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const crypto = require('crypto');
        return crypto.randomBytes(length);
    };
}
