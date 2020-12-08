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

import { MosaicId } from '../mosaic/MosaicId';
import { UInt64 } from '../UInt64';
import { MosaicRestrictionType } from './MosaicRestrictionType';

/**
 * Mosaic global restriction item structure .
 */
export class MosaicGlobalRestrictionItem {
    /**
     * Constructor
     * @param key string,
     * @param referenceMosaicId
     * @param restrictionValue
     * @param restrictionType
     */
    constructor(
        public readonly key: UInt64,
        /**
         * Reference mosaic identifier
         */
        public readonly referenceMosaicId: MosaicId,
        /**
         * Mosaic restriction value.
         */
        public readonly restrictionValue: UInt64,
        /**
         * Mosaic restriction type.
         */
        public readonly restrictionType: MosaicRestrictionType,
    ) {}
}
