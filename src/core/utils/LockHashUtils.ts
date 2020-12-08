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

import { sha256 } from 'js-sha256';
import { sha3_256 } from 'js-sha3';
import * as ripemd160 from 'ripemd160';
import { LockHashAlgorithm } from '../../model/lock/LockHashAlgorithm';

/**
 * Hash utilities for SecretLock hashing
 */
export class LockHashUtils {
    /**
     * Perform SHA3_256 hash
     * @param input buffer to be hashed
     * @returns {string} Hash in hexidecimal format
     */
    public static Op_Sha3_256(input: Uint8Array): string {
        return sha3_256.create().update(input).hex().toUpperCase();
    }

    /**
     * Perform SHA256 hash
     * @param input buffer to be hashed
     * @returns {string} Hash in hexidecimal format
     */
    public static Op_Hash_256(input: Uint8Array): string {
        const hash = sha256(input);
        return sha256(Buffer.from(hash, 'hex')).toUpperCase();
    }

    /**
     * Perform ripemd160 hash
     * @param input buffer to be hashed
     * @returns {string} Hash in hexidecimal format
     */
    public static Op_Hash_160(input: Uint8Array): string {
        const sha256Hash = sha256(input);
        return new ripemd160().update(Buffer.from(sha256Hash, 'hex')).digest('hex').toUpperCase();
    }

    /**
     * Perform hash for SecretLock with proficed hash algorithm
     * @param hashAlgorithm Hash algorithm
     * @param input buffer to be hashed
     * @returns {string} Hash in hexidecimal format
     */
    public static Hash(hashAlgorithm: LockHashAlgorithm, input: Uint8Array): string {
        switch (hashAlgorithm) {
            case LockHashAlgorithm.Op_Hash_160:
                return LockHashUtils.Op_Hash_160(input);
            case LockHashAlgorithm.Op_Hash_256:
                return LockHashUtils.Op_Hash_256(input);
            case LockHashAlgorithm.Op_Sha3_256:
                return LockHashUtils.Op_Sha3_256(input);
            default:
                throw new Error('HashAlgorithm is invalid.');
        }
    }
}
