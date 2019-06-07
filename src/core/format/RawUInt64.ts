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

import { Convert } from './Convert';

export class RawUInt64 {
    static readonly readUint32At = (bytes, i) => (bytes[i] + (bytes[i + 1] << 8) + (bytes[i + 2] << 16) + (bytes[i + 3] << 24)) >>> 0;

    /**
     * An exact uint64 representation composed of two 32bit values.
     * @typedef {Array} uint64
     * @property {number} 0 The low 32bit value.
     * @property {number} 1 The high 32bit value.
     */
    /**
     * Tries to compact a uint64 into a simple numeric.
     * @param {module:coders/uint64~uint64} uint64 A uint64 value.
     * @returns {number|module:coders/uint64~uint64}
     * A numeric if the uint64 is no greater than Number.MAX_SAFE_INTEGER or the original uint64 value otherwise.
     */
    public static compact = (uint64) => {
        const low = uint64[0];
        const high = uint64[1];

        // don't compact if the value is >= 2^53
        if (0x00200000 <= high) {
            return uint64;
        }

        // multiply because javascript bit operations operate on 32bit values
        return (high * 0x100000000) + low;
    }

    /**
     * Converts a numeric unsigned integer into a uint64.
     * @param {number} number The unsigned integer.
     * @returns {module:coders/uint64~uint64} The uint64 representation of the input.
     */
    public static fromUint = (number) => {
        const value = [(number & 0xFFFFFFFF) >>> 0, (number / 0x100000000) >>> 0];
        return value;
    }

    /**
     * Converts a (64bit) uint8 array into a uint64.
     * @param {Uint8Array} uint8Array A uint8 array.
     * @returns {module:coders/uint64~uint64} The uint64 representation of the input.
     */
    public static fromBytes = (uint8Array) => {
        if (8 !== uint8Array.length) {
            throw Error(`byte array has unexpected size '${uint8Array.length}'`);
        }
        return [RawUInt64.readUint32At(uint8Array, 0), RawUInt64.readUint32At(uint8Array, 4)];
    }

    /**
     * Converts a (32bit) uint8 array into a uint64.
     * @param {Uint8Array} uint8Array A uint8 array.
     * @returns {module:coders/uint64~uint64} The uint64 representation of the input.
     */
    public static fromBytes32 = (uint8Array) => {
        if (4 !== uint8Array.length) {
            throw Error(`byte array has unexpected size '${uint8Array.length}'`);
        }
        return [RawUInt64.readUint32At(uint8Array, 0), 0];
    }

    /**
     * Parses a hex string into a uint64.
     * @param {string} input A hex encoded string.
     * @returns {module:coders/uint64~uint64} The uint64 representation of the input.
     */
    public static fromHex = (input) => {
        if (16 !== input.length) {
            throw Error(`hex string has unexpected size '${input.length}'`);
        }
        let hexString = input;
        if (16 > hexString.length) {
            hexString = '0'.repeat(16 - hexString.length) + hexString;
        }
        const uint8Array = Convert.hexToUint8(hexString);
        const view = new DataView(uint8Array.buffer);
        return [view.getUint32(4), view.getUint32(0)];
    }

    /**
     * Converts a uint64 into a hex string.
     * @param {module:coders/uint64~uint64} uint64 A uint64 value.
     * @returns {string} A hex encoded string representing the uint64.
     */
    public static toHex = (uint64) => {
        const uint32Array = new Uint32Array(uint64);
        const uint8Array = Convert.uint32ToUint8(uint32Array).reverse();
        return Convert.uint8ToHex(uint8Array);
    }

    /**
     * Returns true if a uint64 is zero.
     * @param {module:coders/uint64~uint64} uint64 A uint64 value.
     * @returns {boolean} true if the value is zero.
     */
    public static isZero = (uint64) => 0 === uint64[0] && 0 === uint64[1];
}
