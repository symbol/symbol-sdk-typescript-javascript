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

import { UInt64 } from '../UInt64';
import { UnresolvedMosaicId } from './UnresolvedMosaicId';

/**
 * A mosaic describes an instance of a mosaic definition.
 * Mosaics can be transferred by means of a transfer transaction.
 */
export class Mosaic {
    /**
     * Constructor
     * @param id
     * @param amount
     */
    constructor(
        /**
         * The mosaic id
         */
        public readonly id: UnresolvedMosaicId,
        /**
         * The mosaic amount. The quantity is always given in smallest units for the mosaic
         * i.e. if it has a divisibility of 3 the quantity is given in millis.
         */
        public readonly amount: UInt64,
    ) {}

    /**
     * @internal
     * @returns {{amount: number[], id: number[]}}
     */
    public toDTO(): any {
        return {
            amount: this.amount.toString(),
            id: this.id.id.toHex(),
        };
    }
}
