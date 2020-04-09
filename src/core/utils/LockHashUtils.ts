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

import { sha3_256 } from 'js-sha3';
import { Convert } from '../format/Convert';

/**
 * Hash utilities for SecretLock hashing
 */
export class LockHashUtils {
    private static sha256 = require('js-sha256');
    private static ripemd160 = require('ripemd160');
    /**
     * Perform SHA3_256 hash
     * @param input buffer to be hashed
     * @returns {string} Hash in hexidecimal format
     */
    public static Op_Sha3_256(input: Uint8Array): string {
        return sha3_256.create().update(input).hex();
    }

    /**
     * Perform SHA256 hash
     * @param input buffer to be hashed
     * @returns {string} Hash in hexidecimal format
     */
    public static Op_Hash_256(input: Uint8Array): string {
        const hash = LockHashUtils.sha256(Buffer.from(Convert.uint8ToHex(input), 'hex'));
        return LockHashUtils.sha256(Buffer.from(hash, 'hex'));
    }

    /**
     * Perform ripemd160 hash
     * @param input buffer to be hashed
     * @returns {string} Hash in hexidecimal format
     */
    public static Op_Hash_160(input: Uint8Array): string {
        const sha256Hash = LockHashUtils.sha256(Buffer.from(Convert.uint8ToHex(input), 'hex'));
        return new LockHashUtils.ripemd160().update(Buffer.from(sha256Hash, 'hex')).digest('hex');
    }
}
