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
        return input.toString(16).padStart(16, '0').toUpperCase();
    }

    /**
     * Convert 8 byte hex string to Bigint
     * @param input 8 bytes hexdecimal string
     * @returns {bigint}
     */
    public static HexToBigInt(input: string): bigint {
        return BigInt('0x' + input);
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
        return uint8;
    }

    /**
     * Convert UInt64 to BigInt (Little Endian default)
     * @param input UInt64 in Uint32 array
     * @returns {BigInt}
     */
    public static UInt64ToBigInt(input: number[]): bigint {
        const littleEndian = true;
        const uint32Array = new Uint32Array(input);
        let uint8 = new Uint8Array(uint32Array.buffer);
        uint8 = littleEndian ? uint8.reverse() : uint8;
        return BigInt('0x' + Convert.uint8ToHex(uint8));

    }
}
