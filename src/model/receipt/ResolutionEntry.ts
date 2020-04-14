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

import { Address } from '../account/Address';
import { MosaicId } from '../mosaic/MosaicId';
import { ReceiptSource } from './ReceiptSource';

/**
 * The receipt source object.
 */
export class ResolutionEntry {
    /**
     * @constructor
     * @param resolved - A resolved address or resolved mosaicId (alias).
     * @param source - The receipt source.
     */
    constructor(
        /**
         * A resolved address or resolved mosaicId (alias).
         */
        public readonly resolved: Address | MosaicId,
        /**
         * The receipt source.
         */
        public readonly source: ReceiptSource,
    ) {}
}
