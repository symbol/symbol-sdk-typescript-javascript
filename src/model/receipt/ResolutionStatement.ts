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
import { UInt64 } from '../UInt64';
import { ResolutionEntry } from './ResolutionEntry';

/**
 * When a transaction includes an alias, a so called resolution statement reflects the resolved value for that block:
 * - Address Resolution: An account alias was used in the block.
 * - Mosaic Resolution: A mosaic alias was used in the block.
 */
export class ResolutionStatement {

    /**
     * Receipt - resolution statement object
     * @param height - The block height
     * @param unresolved - An unresolved address or unresolved mosaicId.
     * @param resolutionEntries - The array of resolution entries.
     */
    constructor(
                /**
                 * The block height.
                 */
                public readonly height: UInt64,
                /**
                 * An unresolved address or unresolved mosaicId.
                 */
                public readonly unresolved: Address | MosaicId,
                /**
                 * The array of resolution entries.
                 */
                public readonly resolutionEntries: ResolutionEntry[]) {
    }
}
