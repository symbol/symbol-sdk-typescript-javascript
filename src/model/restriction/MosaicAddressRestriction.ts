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
import { MosaicRestrictionEntryType } from './MosaicRestrictionEntryType';
/**
 * Mosaic address restriction structure describes restriction information for an mosaic.
 */
export class MosaicAddressRestriction {

    /**
     * Constructor
     * @param compositeHash
     * @param entryType
     * @param mosaicId
     * @param targetAddress
     * @param restrictions
     */
    constructor(
                /**
                 * composite hash
                 */
                public readonly compositeHash: string,
                /**
                 * Mosaic restriction entry type.
                 */
                public readonly entryType: MosaicRestrictionEntryType,
                /**
                 * Mosaic identifier.
                 */
                public readonly mosaicId: MosaicId,
                /**
                 * Target address
                 */
                public readonly targetAddress: Address,
                /**
                 * Mosaic restriction items
                 */
                public readonly restrictions: Array<Map<string, string>>) {

    }
}
