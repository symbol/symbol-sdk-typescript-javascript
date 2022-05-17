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

import { Keccak, sha3_256, sha3_512 } from '@noble/hashes/sha3';
import { Hash } from '@noble/hashes/utils';
import { Convert as convert, RawArray as array } from '../format';

export type HashLength = 32 | 64;

export class SHA3Hasher {
    /**
     * Calculates the hash of data.
     * @param {Uint8Array} dest The computed hash destination.
     * @param {Uint8Array} data The data to hash.
     * @param {number} length The hash length in bytes.
     */
    public static func = (dest: Uint8Array, data: Uint8Array, length: HashLength): void => {
        const hasher = SHA3Hasher.getHasher(length);
        const hash = hasher(data).buffer;
        array.copy(dest, array.uint8View(hash));
    };

    /**
     * Creates a hasher object.
     * @param {number} length The hash length in bytes.
     * @returns {object} The hasher.
     */
    public static createHasher = (length: HashLength = 64) => {
        let hash: Hash<Keccak>;
        return {
            reset: (): void => {
                hash = SHA3Hasher.getHasher(length).create();
            },
            update: (data: any): void => {
                if (data instanceof Uint8Array) {
                    hash.update(data);
                } else if ('string' === typeof data) {
                    hash.update(convert.hexToUint8(data));
                } else {
                    throw Error('unsupported data type');
                }
            },
            finalize: (result: any): void => {
                array.copy(result, array.uint8View(hash.digest().buffer));
            },
        };
    };

    /**
     * Get a hasher instance.
     * @param {numeric} length The hash length in bytes.
     * @returns {object} The hasher.
     */
    public static getHasher = (length: HashLength = 64) => {
        return {
            32: sha3_256,
            64: sha3_512,
        }[length];
    };
}
