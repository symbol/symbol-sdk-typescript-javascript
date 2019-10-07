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

import { UInt64 } from '../../model/UInt64';
import { sha3_256 } from 'js-sha3';

export class KeyGenerator {
    /**
     * @returns {UInt64} Deterministic uint64 value for the given string
     */
    public static fromString(input: string) {
        if (input.length === 0) {
            throw Error(`Input must not be empty`);
        }
        if (input.length > 1024) {
            throw Error(`Input exceeds 1024 characters (has ${input.length})`);
        }
        const format = /^[a-zA-Z0-9_]+$/gm;
        if (input.match(format) === null) {
            throw Error(`Input has invalid format (accepted characters: a-z, A-Z, 0-9, _)`);
        }
        const hex = sha3_256(input)
        return UInt64.fromHex(hex.substr(0, 16))
    }
}
