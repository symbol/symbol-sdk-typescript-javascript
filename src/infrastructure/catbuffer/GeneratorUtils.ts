// tslint:disable: jsdoc-format
/**
*** Copyright (c) 2016-present,
*** Jaguar0625, gimre, BloodyRookie, Tech Bureau, Corp. All rights reserved.
***
*** This file is part of Catapult.
***
*** Catapult is free software: you can redistribute it and/or modify
*** it under the terms of the GNU Lesser General Public License as published by
*** the Free Software Foundation, either version 3 of the License, or
*** (at your option) any later version.
***
*** Catapult is distributed in the hope that it will be useful,
*** but WITHOUT ANY WARRANTY; without even the implied warranty of
*** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
*** GNU Lesser General Public License for more details.
***
*** You should have received a copy of the GNU Lesser General Public License
*** along with Catapult. If not, see <http://www.gnu.org/licenses/>.
**/

/**
 * Generator utility class.
 */
export class GeneratorUtils {

    /**
     * Convert a UInt8Array input into an array of 2 numbers.
	 * Numbers in the returned array are cast to UInt32.
     * @param {Uint8Array} input A uint8 array.
     * @returns {number[]} The uint64 representation of the input.
     */
    public static bufferToUint64(input: Uint8Array): number[] {
        if (8 !== input.length) {
            throw Error(`byte array has unexpected size '${input.length}'`);
        }
        input = input.reverse();
        const view = new DataView(input.buffer);
        return [view.getUint32(4), view.getUint32(0)];
    }

    /**
     * Read 4 bytes as a uint32 value from buffer bytes starting at given index.
     * @param {Uint8Array} bytes A uint8 array.
     * @param {number} index Index.
     * @returns {number} 32bits integer.
     */
    public static readUint32At(bytes: Uint8Array, index: number): number {
        return (bytes[index] + (bytes[index + 1] << 8) + (bytes[index + 2] << 16) + (bytes[index + 3] << 24)) >>> 0;
    }

    /**
     * Convert uint value into buffer
     * @param {number} uintValue A uint8 array.
     * @param {number} bufferSize Buffer size.
     * @returns {Uint8Array}
     */
    public static uintToBuffer(uintValue: number, bufferSize: number): Uint8Array {
        const buffer = new ArrayBuffer(bufferSize);
		const dataView = new DataView(buffer);
		try {
			if (1 === bufferSize) {
				dataView.setUint8(0, uintValue);
			} else if (2 === bufferSize) {
				dataView.setUint16(0, uintValue, true);
			} else if (4 === bufferSize) {
				dataView.setUint32(0, uintValue, true);
			} else {
				throw new Error('Unexpected bufferSize');
			}
			return new Uint8Array(buffer);
		}
		catch (e) {
			throw new Error(`Converting uint value ${uintValue} into buffer with error: ${e}`);
		}
    }

    /**
     * Convert uint8 array buffer into number
     * @param {Uint8Array} buffer A uint8 array.
     * @returns {number}
     */
    public static bufferToUint(buffer: Uint8Array): number {
		const dataView = new DataView(buffer.buffer);
		try {
			if (1 === buffer.byteLength) {
				return dataView.getUint8(0);
			} else if (2 === buffer.byteLength) {
				return dataView.getUint16(0, true);
			} else if (4 === buffer.byteLength) {
				return dataView.getUint32(0, true);
			}
			throw new Error('Unexpected buffer size');
		}
		catch (e) {
			throw new Error(`Converting buffer into number with error: ${e}`);
		}
    }

    /**
     * Convert unit64 into buffer
     * @param {number} uintValue Uint64 (number[]).
     * @returns {Uint8Array}
     */
    public static uint64ToBuffer(uintValue: number[]): Uint8Array {
        const uint32Array = new Uint32Array(uintValue);
        return new Uint8Array(uint32Array.buffer);
    }

    /**
     * Concatenate two arrays
     * @param {Uint8Array} array1 A Uint8Array.
     * @param {Uint8Array} array2 A Uint8Array.
     * @returns {Uint8Array}
     */
    public static concatTypedArrays(array1: Uint8Array, array2: Uint8Array): Uint8Array {
        const newArray = new Uint8Array(array1.length + array2.length);
        newArray.set(array1);
        newArray.set(array2, array1.length);
        return newArray;
    }

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

    /** Get bytes by given sub array size.
     * @param {Uint8Array} binary Binary bytes array.
     * @param {number} size Subarray size.
     * @returns {Uint8Array}
     *
     */
    public static getBytes(binary: Uint8Array, size: number): Uint8Array {
        if (size > binary.length) {
            throw new RangeError();
        }
        const bytes = binary.slice(0, size);
        return bytes;
    }
}
