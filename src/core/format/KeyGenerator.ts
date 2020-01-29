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

import { sha3_256 } from 'js-sha3';
import { UInt64 } from '../../model/UInt64';

export class KeyGenerator {
    /**
     * Generate UInt64 from a string
     * @param {string} input Input string
     * @returns {UInt64} Deterministic uint64 value for the given string
     */
    public static generateUInt64Key(input: string): UInt64 {
        if (input.length === 0) {
            throw Error(`Input must not be empty`);
        }
        const buf = sha3_256.arrayBuffer(input);
        const result = new Uint32Array(buf);
        return new UInt64([result[0], (result[1] | 0x80000000) >>> 0]);
    }
}
