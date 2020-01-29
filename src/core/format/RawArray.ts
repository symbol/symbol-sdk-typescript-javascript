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

export class RawArray {
    /**
     * Creates a Uint8Array view on top of input.
     * @param {ArrayBuffer|Uint8Array} input The input array.
     * @returns {Uint8Array} A Uint8Array view on top of input.
     */
    public static uint8View = (input) => {
        if (ArrayBuffer === input.constructor) {
            return new Uint8Array(input);
        } else if (Uint8Array === input.constructor) {
            return input;
        }

        throw Error('unsupported type passed to uint8View');
    }

    /**
     * Copies elements from a source array to a destination array.
     * @param {Array} dest The destination array.
     * @param {Array} src The source array.
     * @param {number} [numElementsToCopy=undefined] The number of elements to copy.
     * @param {number} [destOffset=0] The first index of the destination to write.
     * @param {number} [srcOffset=0] The first index of the source to read.
     */
    public static copy = (dest, src, numElementsToCopy?, destOffset = 0, srcOffset = 0) => {
        const length = undefined === numElementsToCopy ? dest.length : numElementsToCopy;
        for (let i = 0; i < length; ++i) {
            dest[destOffset + i] = src[srcOffset + i];
        }
    }

    /**
     * Determines whether or not an array is zero-filled.
     * @param {Array} array The array to check.
     * @returns {boolean} true if the array is zero-filled, false otherwise.
     */
    public static isZeroFilled = (array) => array.every((value) => 0 === value);

    /**
     * Deeply checks the equality of two arrays.
     * @param {Array} lhs First array to compare.
     * @param {Array} rhs Second array to compare.
     * @param {number} [numElementsToCompare=undefined] The number of elements to compare.
     * @returns {boolean} true if all compared elements are equal, false otherwise.
     */
    public static deepEqual = (lhs, rhs, numElementsToCompare?) => {
        let length = numElementsToCompare;
        if (undefined === length) {
            if (lhs.length !== rhs.length) {
                return false;
            }

            length = lhs.length;
        }

        if (length > lhs.length || length > rhs.length) {
            return false;
        }

        for (let i = 0; i < length; ++i) {
            if (lhs[i] !== rhs[i]) {
                return false;
            }
        }

        return true;
    }
}
