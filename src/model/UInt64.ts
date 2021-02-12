/*
 * Copyright 2018 NEM
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

import * as Long from 'long';
import { RawUInt64 as uint64 } from '../core/format';

/**
 * UInt64 data model
 */
export class UInt64 {
    /**
     * uint64 lower part
     */
    public readonly lower: number;

    /**
     * uint64 higher part
     */
    public readonly higher: number;

    /**
     * Create from uint value
     * @param value
     * @returns {UInt64}
     */
    public static fromUint(value: number): UInt64 {
        if (value < 0) {
            throw new Error('Unsigned integer cannot be negative');
        }
        return new UInt64(uint64.fromUint(value));
    }

    /**
     * Parses a hex string into a UInt64.
     * @param {string} input A hex encoded string.
     * @returns {module:coders/uint64~uint64} The uint64 representation of the input.
     */
    public static fromHex(input: string): UInt64 {
        const dto = uint64.fromHex(input);
        return new UInt64(dto);
    }

    /**
     * Parses a numeric string into a UInt64.
     * @param {string} input A numeric string.
     * @returns {module:coders/uint64~uint64} The uint64 representation of the input.
     */
    public static fromNumericString(input: string): UInt64 {
        if (!UInt64.isLongNumericString(input)) {
            throw new Error('Input string is not a valid numeric string');
        }
        const input_long = Long.fromString(input, true);
        return new UInt64([input_long.getLowBitsUnsigned(), input_long.getHighBitsUnsigned()]);
    }

    /**
     * Check if input string is a numeric string or not
     * @param {string} input A string.
     * @returns {boolean}
     */
    public static isLongNumericString(input: string): boolean {
        const input_long = Long.fromString(input, true);
        if (!/^\d+$/.test(input) || (input.substr(0, 1) === '0' && input.length > 1) || !Long.isLong(input_long)) {
            return false;
        }
        return true;
    }

    /**
     * Constructor
     * @param uintArray
     */
    constructor(uintArray: number[]) {
        if (uintArray.length !== 2 || uintArray[0] < 0 || uintArray[1] < 0) {
            throw new Error('uintArray must be be an array of two uint numbers');
        }
        this.lower = uintArray[0];
        this.higher = uintArray[1];
    }

    /**
     * Get DTO representation with format: `[lower, higher]`
     *
     * @returns {[number,number]}
     */
    public toDTO(): number[] {
        return [this.lower, this.higher];
    }

    /**
     * Get hexadecimal representation
     *
     * @return {string}
     */
    public toHex(): string {
        return uint64.toHex(this.toDTO());
    }

    /**
     * Get numeric string representation
     *
     * @return {string}
     */
    public toString(): string {
        return Long.fromBits(this.lower, this.higher, true).toString();
    }

    /**
     * Compact higher and lower uint parts into a uint
     * @returns {number}
     */
    public compact(): number {
        const result = uint64.compact(this.toDTO());
        if (Array.isArray(result)) {
            throw new Error('Compacted value is greater than Number.Max_Value.');
        }
        return result;
    }

    /**
     * Compares for equality
     * @param other
     * @returns {boolean}
     */
    public equals(other: UInt64): boolean {
        return this.lower === other.lower && this.higher === other.higher;
    }

    /**
     * Compares two UInt64
     * @param other
     * @returns {number} - -1, 0, 1
     */
    public compare(other: UInt64): number {
        const long_a = Long.fromBits(this.lower, this.higher, true);
        const long_b = Long.fromBits(other.lower, other.higher, true);
        return long_a.compare(long_b);
    }

    /**
     * UInt64 add operation
     * @param other
     * @returns {UInt64}
     */
    public add(other: UInt64): UInt64 {
        const long_value = Long.fromBits(this.lower, this.higher, true);
        const long_b = Long.fromBits(other.lower, other.higher, true);
        return this.longToUint64(long_value.add(long_b));
    }

    /**
     * UInt64 add operation
     * @param other
     * @returns {UInt64}
     */
    public subtract(other: UInt64): UInt64 {
        const long_value = Long.fromBits(this.lower, this.higher, true);
        const long_b = Long.fromBits(other.lower, other.higher, true);
        if (long_value.compare(long_b) < 0) {
            throw new Error('Unsigned substraction result cannot be negative.');
        }
        return this.longToUint64(long_value.subtract(long_b));
    }

    /**
     * Convert long value to UInt64
     * @param longValue long value
     */
    private longToUint64(longValue: Long): UInt64 {
        return new UInt64([longValue.getLowBitsUnsigned(), longValue.getHighBitsUnsigned()]);
    }
}
