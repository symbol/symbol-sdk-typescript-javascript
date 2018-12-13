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

import {uint64} from 'nem2-library';

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
        const uintArray = [(value & 0xFFFFFFFF) >>> 0, (value / 0x100000000) >>> 0];
        if (0x00200000 <= uintArray[1] || 0 > value || 0 !== (value % 1))
            throw Error(`number cannot be converted to uint '${value}'`);

        return new UInt64(uint64.fromUint(value));
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
     * @internal
     * @returns {[number,number]}
     */
    public toDTO(): number[] {
        return [this.lower, this.higher];
    }

    /**
     * Compact higher and lower uint parts into a uint
     * @returns {number}
     */
    public compact(): number {
        return uint64.compact(this.toDTO());
    }

    /**
     * Compares for equality
     * @param other
     * @returns {boolean}
     */
    public equals(other: UInt64): boolean {
        return this.lower === other.lower && this.higher === other.higher;
    }
}
