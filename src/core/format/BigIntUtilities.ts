/*
 * Copyright 2019 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Convert } from './Convert';

export class BigIntUtilities {
    /**
     * Convert BitInt to 8 byte hex string
     * @param input BigInt value
     * @returns {string}
     */
    public static BigIntToHex(input: bigint): string {
        const uint8 = BigIntUtilities.BigIntToUint8(input);
        return Convert.uint8ToHex(uint8);
    }

    /**
     * Convert 8 byte hex string to Bigint
     * @param input 8 bytes hexdecimal string
     * @returns {bigint}
     */
    public static HexToBigInt(input: string): bigint {
        const uint8 = Convert.hexToUint8(input);
        return BigIntUtilities.Uint8ToBigInt(uint8);
    }

    /**
     * Convert BigInt to buffer array
     * @param input BigInt value
     * @returns {Uint8Array}
     */
    public static BigIntToUint8(input: bigint): Uint8Array {
        const hex = input.toString(16).padStart(16, '0');
        const len = hex.length / 2;
        const uint8 = new Uint8Array(len);

        let i = 0;
        let j = 0;
        while (i < len) {
            uint8[i] = parseInt(hex.slice(j, j + 2), 16);
            i += 1;
            j += 2;
        }

        return uint8.reverse();
    }

    /**
     * Convert buffer to BigInt
     * @param input Buffer array
     * @returns {BigInt}
     */
    public static Uint8ToBigInt(input: Uint8Array): bigint {
        return BigInt('0x' + Convert.uint8ToHex(input.reverse()));
    }

    /**
     * Convert BigInt to UInt32 array (Little Endian)
     * @param input BigInt value
     * @param littleEndian Using little endian
     * @returns {number[]}
     */
    public static BigIntToUInt64(input: bigint, littleEndian: boolean = true): number[] {
        const uint8 = BigIntUtilities.BigIntToUint8(input);
        if (8 !== uint8.length) {
            throw Error(`byte array has unexpected size '${uint8.length}'`);
        }
        const view = new DataView(uint8.buffer);
        return littleEndian ? [view.getUint32(4), view.getUint32(0)] : [view.getUint32(0), view.getUint32(4)];
    }

    /**
     * Convert UInt64 to BigInt
     * @param input UInt64 in Uint32 array
     * @param littleEndian Reverse uint32 array
     * @returns {BigInt}
     */
    public static UInt64ToBigInt(input: number[], reverse: boolean = false): bigint {
        const uint32Array = new Uint32Array(input);
        let uint8 = new Uint8Array(uint32Array.buffer);
        uint8 = reverse ? uint8.reverse() : uint8;
        return BigInt('0x' + Convert.uint8ToHex(uint8));

    }

    /**
     * Convert UInt64 to hex 
     * @param input UInt64 in Uint32 array
     * @param littleEndian Reverse uint32 array
     * @returns {string}
     */
    public static UInt64ToHex(input: number[], reverse: boolean = false): string {
        const bigInt = BigIntUtilities.UInt64ToBigInt(input, reverse);
        return BigIntUtilities.BigIntToHex(bigInt);

    }
}
