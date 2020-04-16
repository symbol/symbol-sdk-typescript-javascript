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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CryptoJS = require('crypto-js');

export class AESEncryptionService {
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
}
