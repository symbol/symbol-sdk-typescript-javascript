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

/**
 * UInt64 data model
 */
export class UInt64 {
    /**
     * uint64 lower part
     */
    public readonly value: bigint;

    /**
     * Constructor
     * @param value the value
     */
    constructor(value: bigint | number | number[]) {
        if (value instanceof Array) {
            this.value = BigInt(UInt64.toBigInt(value));
        } else {
            if (value < 0) {
                throw new Error('Unsigned integer cannot be negative');
            }
            this.value = BigInt(value);
        }
    }

    /**
     * Create from uint value
     * @param value
     * @returns {UInt64}
     */
    public static fromUint(value: number): UInt64 {
        return new UInt64(BigInt(value));
    }

    /**
     * Create from uint value
     * @deprecated
     * @param uintArray
     * @returns {UInt64}
     *
     */
    public static fromNumberArray(uintArray: number[]): UInt64 {
        return new UInt64(this.toBigInt(uintArray));
    }

    /**
     * Create from uint value
     * @deprecated
     * @param uintArray
     * @returns {UInt64}
     *
     */
    public static toBigInt(uintArray: number[]): bigint {
        if (uintArray.length !== 2 || uintArray[0] < 0 || uintArray[1] < 0) {
            throw new Error('uintArray must be be an array of two uint numbers');
        }
        const long = Long.fromBits(uintArray[0], uintArray[1], true);
        return BigInt(long.toString());
    }

    public static fromHex(hexId: string): UInt64 {
        const higher = parseInt(hexId.substr(0, 8), 16);
        const lower = parseInt(hexId.substr(8, 8), 16);
        return UInt64.fromNumberArray([lower, higher]);
    }

    /**
     * Get hexadecimal representation
     *
     * @return hex string representation
     */
    public toHex(): string {
        const part1 = this.higher.toString(16);
        const part2 = this.lower.toString(16);
        return (UInt64.pad(part1, 8) + UInt64.pad(part2, 8)).toUpperCase();
    }

    /**
     * @param str
     * @param maxVal
     * @returns {string}
     */
    private static pad(str: string, maxVal: number): string {
        return str.padStart(maxVal, '0');
    }

    /**
     * Parses a numeric string into a UInt64.
     * @param  input A numeric string.
     * @returns The uint64 representation of the input.
     */
    public static fromNumericString(input: string): UInt64 {
        if (!UInt64.isLongNumericString(input)) {
            throw new Error('Input string is not a valid numeric string');
        }
        return new UInt64(BigInt(input));
    }

    /**
     * Check if input string is a numeric string or not
     * @param  input A string.
     * @returns {boolean}
     */
    public static isLongNumericString(input: string): boolean {
        if (!/^\d+$/.test(input) || (input.substr(0, 1) === '0' && input.length > 1)) {
            return false;
        }
        return true;
    }

    /**
     * Get the catbuffer represention
     *
     * @returns bigint.
     */
    public toDTO(): bigint {
        return this.value;
    }

    /**
     * Get numeric string representation
     *
     * @return string representation
     */
    public toString(): string {
        return this.value.toString();
    }

    /**
     * Compact higher and lower uint parts into a uint
     * @deprecated use bigint operations
     * @returns {number}
     */
    public compact(): number {
        if (this.value > Number.MAX_SAFE_INTEGER) {
            throw new Error('Compacted value is greater than Number.Max_Value.');
        }
        return Number(this.value);
    }

    /**
     * Compares for equality
     * @param other
     * @returns {boolean}
     */
    public equals(other: UInt64): boolean {
        return this.value === other.value;
    }

    /**
     * Compares two UInt64
     * @param other
     * @returns {number} - -1, 0, 1
     */
    public compare(other: UInt64): number {
        if (this.value == other.value) {
            return 0;
        }
        return this.value > other.value ? 1 : -1;
    }

    /**
     * UInt64 add operation
     * @param other
     * @returns {UInt64}
     */
    public add(other: UInt64): UInt64 {
        return new UInt64(this.value + other.value);
    }

    /**
     * UInt64 add operation
     * @param other
     * @returns {UInt64}
     */
    public subtract(other: UInt64): UInt64 {
        return new UInt64(this.value - other.value);
    }

    /**
     * @deprecated migrate out of number[]
     */
    public get lower(): number {
        return this.toArray()[0];
    }
    /**
     * @deprecated migrate out of number[]
     */
    public get higher(): number {
        return this.toArray()[1];
    }

    /**
     * @deprecated migrate out of number[]
     */
    public toArray(): number[] {
        //only ref to log, remove!
        const long = Long.fromString(this.value.toString());
        return [long.getLowBitsUnsigned(), long.getHighBitsUnsigned()];
    }
}
