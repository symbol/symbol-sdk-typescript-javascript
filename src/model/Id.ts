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

import {UInt64} from './UInt64';

/**
 * This class is used to define mosaicIds and namespaceIds
 */
export class Id extends UInt64 {
    public static fromHex(hexId: string): Id {
        const higher = parseInt(hexId.substr(0, 8), 16);
        const lower = parseInt(hexId.substr(8, 8), 16);

        return new Id([lower, higher]);
    }

    /**
     * Get string value of id
     * @returns {string}
     */
    public toHex(): string {
        const part1 = this.higher.toString(16);
        const part2 = this.lower.toString(16);

        return (this.pad(part1, 8) + this.pad(part2, 8)).toUpperCase();
    }

    /**
     * @param str
     * @param maxVal
     * @returns {string}
     */
    private pad(str, maxVal): string {
        return (str.length < maxVal ? this.pad(`0${str}`, maxVal) : str);
    }

}
