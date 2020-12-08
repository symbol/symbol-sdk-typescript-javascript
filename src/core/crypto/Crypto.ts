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

import * as crypto from 'crypto';
import * as CryptoJS from 'crypto-js';
import { Convert as convert } from '../format/Convert';
import { KeyPair } from './KeyPair';
import * as utility from './Utilities';

export class Crypto {
    private static AES_ALGO = 'aes-256-gcm';
    /**
     * Encrypt data
     * @param {string} data
     * @param {string} salt
     * @param {string} password
     */
    public static encrypt(data: string, password: string): string {
        const salt = CryptoJS.lib.WordArray.random(16);

        // generate password based key
        const key = CryptoJS.PBKDF2(password, salt, {
            keySize: 8,
            iterations: 1024,
        });

        // encrypt using random IV
        const iv = CryptoJS.lib.WordArray.random(16);
        const encrypted = CryptoJS.AES.encrypt(data, key, {
            iv: iv,
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC,
        });

        // salt (16 bytes) + iv (16 bytes)
        // prepend them to the ciphertext for use in decryption
        return salt.toString() + iv.toString() + encrypted.toString();
    }

    /**
     * Decrypt data
     * @param {string} data
     * @param {string} salt
     * @param {string} password
     */
    public static decrypt(data: string, password: string): string {
        const salt = CryptoJS.enc.Hex.parse(data.substr(0, 32));
        const iv = CryptoJS.enc.Hex.parse(data.substr(32, 32));
        const encrypted = data.substring(64);

        // generate password based key
        const key = CryptoJS.PBKDF2(password, salt, {
            keySize: 8,
            iterations: 1024,
        });

        // decrypt using custom IV
        const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
            iv: iv,
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC,
        });

        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    /***
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
        const encKey = Buffer.from(utility.catapult_crypto.deriveSharedKey(keyPair.privateKey, convert.hexToUint8(recipientPub)), 32);
        const encIv = Buffer.from(iv);
        const cipher = crypto.createCipheriv(Crypto.AES_ALGO, encKey, encIv);
        const encrypted = Buffer.concat([cipher.update(Buffer.from(convert.hexToUint8(msg))), cipher.final()]);
        const tag = cipher.getAuthTag();
        // Result
        const result = tag.toString('hex') + encIv.toString('hex') + encrypted.toString('hex');
        return result;
    };

    /**
     * Encode a message using AES-GCM algorithm
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
        const iv = Crypto.randomBytes(12);
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
     * @param {Uint8Array} tagAndIv - 16-bytes AES auth tag and 12-byte AES initialization vector
     * @return {string} - The decoded payload as hex
     */
    public static _decode = (recipientPrivate: string, senderPublic: string, payload: Uint8Array, tagAndIv: Uint8Array): string => {
        // Error
        if (!recipientPrivate || !senderPublic || !payload) {
            throw new Error('Missing argument !');
        }
        // Processing
        const keyPair = KeyPair.createKeyPairFromPrivateKeyString(recipientPrivate);
        const encKey = Buffer.from(utility.catapult_crypto.deriveSharedKey(keyPair.privateKey, convert.hexToUint8(senderPublic)), 32);
        const encIv = Buffer.from(new Uint8Array(tagAndIv.buffer, 16, 12));
        const encTag = Buffer.from(new Uint8Array(tagAndIv.buffer, 0, 16));
        const cipher = crypto.createDecipheriv(Crypto.AES_ALGO, encKey, encIv);
        cipher.setAuthTag(encTag);
        const decrypted = Buffer.concat([cipher.update(Buffer.from(payload)), cipher.final()]);
        // Result
        return decrypted.toString('hex');
    };

    /**
     * Decode an encrypted (AES-GCM algorithm) message payload
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
        const payloadBuffer = new Uint8Array(binPayload.buffer, 16 + 12); //tag + iv
        const tagAndIv = new Uint8Array(binPayload.buffer, 0, 16 + 12);
        try {
            const decoded = Crypto._decode(recipientPrivate, senderPublic, payloadBuffer, tagAndIv);
            return decoded.toUpperCase();
        } catch {
            // To return empty string rather than error throwing if authentication failed
            return '';
        }
    };

    /**
     * Generate random bytes by length
     * @param {number} length - The length of the random bytes
     *
     * @return {Uint8Array}
     */
    public static randomBytes = (length: number): any => {
        return crypto.randomBytes(length);
    };
}
