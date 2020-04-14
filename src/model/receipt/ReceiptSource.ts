import { GeneratorUtils } from 'catbuffer-typescript';

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

/**
 * The receipt source object.
 */
export class ReceiptSource {
    /**
     * @constructor
     * @param primaryId - The transaction primary source (e.g. index within block).
     * @param secondaryId - The transaction secondary source (e.g. index within aggregate).
     */
    constructor(
        /**
         * The transaction primary source (e.g. index within block).
         */
        public readonly primaryId: number,
        /**
         * The transaction secondary source (e.g. index within aggregate).
         */
        public readonly secondaryId: number,
    ) {}

    /**
     * @internal
     * Generate buffer
     * @return {Uint8Array}
     */
    public serialize(): Uint8Array {
        return GeneratorUtils.concatTypedArrays(
            GeneratorUtils.uintToBuffer(this.primaryId, 4),
            GeneratorUtils.uintToBuffer(this.secondaryId, 4),
        );
    }
}
