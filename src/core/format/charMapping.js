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

/** @module coders/charMapping */

/**
 * Builder for building a character map.
 * @class CharacterMapBuilder
 *
 * @property {object} map The character map.
 */

export default {
    /**
     * Creates a builder for building a character map.
     * @returns {module:coders/charMapping~CharacterMapBuilder} A character map builder.
     */
    createBuilder: () => {
        const map = {};
        return {
            map,

            /**
             * Adds a range mapping to the map.
             * @param {string} start The start character.
             * @param {string} end The end character.
             * @param {number} base The value corresponding to the start character.
             * @memberof module:utils/charMapping~CharacterMapBuilder
             * @instance
             */
            addRange: (start, end, base) => {
                const startCode = start.charCodeAt(0);
                const endCode = end.charCodeAt(0);

                for (let code = startCode; code <= endCode; ++code)
                    map[String.fromCharCode(code)] = code - startCode + base;
            }
        };
    }
};
