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

import { keccak256, keccak512, sha3_256, sha3_512 } from 'js-sha3';
import { NetworkType } from '../../model/blockchain/NetworkType';
import { Convert as convert, RawArray as array } from '../format';
import { Crypto } from './Crypto';
import { SignSchema } from './SignSchema';

export class SHA3Hasher {
    /**
     * Calculates the hash of data.
     * @param {Uint8Array} dest The computed hash destination.
     * @param {Uint8Array} data The data to hash.
     * @param {numeric} length The hash length in bytes.
     * @param {NetworkType} networkType Catapult network identifier
     */
    public static func = (dest, data, length, networkType: NetworkType) => {
        const hasher = SHA3Hasher.getHasher(length, networkType);
        const hash = hasher.arrayBuffer(data);
        array.copy(dest, array.uint8View(hash));
    }

    /**
     * Creates a hasher object.
     * @param {numeric} length The hash length in bytes.
     * @param {NetworkType} networkType Catapult network identifier
     * @returns {object} The hasher.
     */
    public static createHasher = (length = 64, networkType: NetworkType) => {
        let hash;
        return {
            reset: () => {
                hash = SHA3Hasher.getHasher(length, networkType).create();
            },
            update: (data: any) => {
                if (data instanceof Uint8Array) {
                    hash.update(data);
                } else if ('string' === typeof data) {
                    hash.update(convert.hexToUint8(data));
                } else {
                    throw Error('unsupported data type');
                }
            },
            finalize: (result: any) => {
                array.copy(result, array.uint8View(hash.arrayBuffer()));
            },
        };
    }

    /**
     * Get a hasher instance.
     * @param {numeric} length The hash length in bytes.
     * @param {NetworkType} networkType Catapult network identifier
     * @returns {object} The hasher.
     */
    public static getHasher = (length = 64, networkType: NetworkType) => {
        const signSchema = Crypto.resolveNetworkType(networkType);
        return {
            32: signSchema === SignSchema.SHA3 ? sha3_256 : keccak256,
            64: signSchema === SignSchema.SHA3 ? sha3_512 : keccak512 ,
        } [length];
    }

    /**
     * Create a hasher instance with given payload bytes and return hash array buffer.
     * @param {Uint8Array} payload Payload in bytes.
     * @param {NetworkType} networkType Catapult network identifier
     * @returns {ArrayBuffer}
     */
    public static getHashArrayBuffer(payload: Uint8Array, networkType: NetworkType): ArrayBuffer {
        const signSchema = Crypto.resolveNetworkType(networkType);
        return signSchema === SignSchema.SHA3 ? sha3_256.arrayBuffer(payload) : keccak256.arrayBuffer(payload);
    }
}
