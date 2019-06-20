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
import * as utilities from './Utilities';

export class Convert {

    /**
     * Decodes two hex characters into a byte.
     * @param {string} char1 The first hex digit.
     * @param {string} char2 The second hex digit.
     * @returns {number} The decoded byte.
     */
    public static toByte = (char1: string, char2: string): number => {
        const byte = utilities.tryParseByte(char1, char2);
        if (undefined === byte) {
            throw Error(`unrecognized hex char`);
        }
        return byte;
    }

    /**
     * Determines whether or not a string is a hex string.
     * @param {string} input The string to test.
     * @returns {boolean} true if the input is a hex string, false otherwise.
     */
    public static isHexString = (input: string): boolean => {
        if (0 !== input.length % 2) {
            return false;
        }
        for (let i = 0; i < input.length; i += 2) {
            if (undefined === utilities.tryParseByte(input[i], input[i + 1])) {
                return false;
            }
        }
        return true;
    }

    /**
     * Converts a hex string to a uint8 array.
     * @param {string} input A hex encoded string.
     * @returns {Uint8Array} A uint8 array corresponding to the input.
     */
    public static hexToUint8 = (input: string): Uint8Array => {
        if (0 !== input.length % 2) {
            throw Error(`hex string has unexpected size '${input.length}'`);
        }
        const output = new Uint8Array(input.length / 2);
        for (let i = 0; i < input.length; i += 2) {
            output[i / 2] = Convert.toByte(input[i], input[i + 1]);
        }
        return output;
    }

    /**
     * Reversed convertion hex string to a uint8 array.
     * @param {string} input A hex encoded string.
     * @returns {Uint8Array} A uint8 array corresponding to the input.
     */
    public static hexToUint8Reverse = (input: string): Uint8Array => {
        if (0 !== input.length % 2) {
            throw Error(`hex string has unexpected size '${input.length}'`);
        }
        const output = new Uint8Array(input.length / 2);
        for (let i = 0; i < input.length; i += 2) {
            output[output.length - 1 - (i / 2)] = Convert.toByte(input[i], input[i + 1]);
        }
        return output;
    }

    /**
     * Converts a uint8 array to a hex string.
     * @param {Uint8Array} input A uint8 array.
     * @returns {string} A hex encoded string corresponding to the input.
     */
    public static uint8ToHex = (input) => {
        let s = '';
        for (const byte of input) {
            s += utilities.Nibble_To_Char_Map[byte >> 4];
            s += utilities.Nibble_To_Char_Map[byte & 0x0F];
        }

        return s;
    }

    /**
     * Converts a uint8 array to a uint32 array.
     * @param {Uint8Array} input A uint8 array.
     * @returns {Uint32Array} A uint32 array created from the input.
     */
    public static uint8ToUint32 = (input) => new Uint32Array(input.buffer);

    /**
     * Converts a uint32 array to a uint8 array.
     * @param {Uint32Array} input A uint32 array.
     * @returns {Uint8Array} A uint8 array created from the input.
     */
    public static uint32ToUint8 = (input: Uint32Array): Uint8Array => new Uint8Array(input.buffer);

    /** Converts an unsigned byte to a signed byte with the same binary representation.
     * @param {number} input An unsigned byte.
     * @returns {number} A signed byte with the same binary representation as the input.
     *
     */
    public static uint8ToInt8 = (input: number): number => {
        if (0xFF < input) {
            throw Error(`input '${input}' is out of range`);
        }
        return input << 24 >> 24;
    }

    /** Converts a signed byte to an unsigned byte with the same binary representation.
     * @param {number} input A signed byte.
     * @returns {number} An unsigned byte with the same binary representation as the input.
     */
    public static int8ToUint8 = (input: number): number => {
        if (127 < input || -128 > input) {
            throw Error(`input '${input}' is out of range`);
        }
        return input & 0xFF;
    }

    /**
     * Converts a raw javascript string into a string of single byte characters using utf8 encoding.
     * This makes it easier to perform other encoding operations on the string.
     * @param {string} input - A raw string
     * @return {string} - UTF-8 string
     */
    public static rstr2utf8 = (input: string): string => {
        let output = '';

        for (let n = 0; n < input.length; n++) {
            const c = input.charCodeAt(n);

            if (128 > c) {
                output += String.fromCharCode(c);
            } else if ((127 < c) && (2048 > c)) {
                output += String.fromCharCode((c >> 6) | 192);
                output += String.fromCharCode((c & 63) | 128);
            } else {
                output += String.fromCharCode((c >> 12) | 224);
                output += String.fromCharCode(((c >> 6) & 63) | 128);
                output += String.fromCharCode((c & 63) | 128);
            }
        }

        return output;
    }

    /**
     * Convert UTF-8 to hex
     * @param {string} input - An UTF-8 string
     * @return {string}
     */
    public static utf8ToHex = (input: string): string => {
        const rawString = Convert.rstr2utf8(input);
        let result = '';
        for (let i = 0; i < rawString.length; i++) {
            result += rawString.charCodeAt(i).toString(16).padStart(2, '0');
        }
        return result;
    }
}
