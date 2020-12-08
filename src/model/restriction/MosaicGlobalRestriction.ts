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

import {
    GlobalKeyValueBuilder,
    GlobalKeyValueSetBuilder,
    MosaicGlobalRestrictionEntryBuilder,
    MosaicIdDto,
    MosaicRestrictionEntryBuilder,
    MosaicRestrictionEntryTypeDto,
    MosaicRestrictionKeyDto,
    RestrictionRuleBuilder,
} from 'catbuffer-typescript';
import { MosaicId } from '../mosaic';
import { UInt64 } from '../UInt64';
import { MosaicGlobalRestrictionItem } from './MosaicGlobalRestrictionItem';
import { MosaicRestrictionEntryType } from './MosaicRestrictionEntryType';

/**
 * Mosaic global restriction structure describes restriction information for an mosaic.
 */
export class MosaicGlobalRestriction {
    /**
     * Constructor
     * @param version
     * @param compositeHash
     * @param entryType
     * @param mosaicId
     * @param restrictions
     */
    constructor(
        /**
         * Version
         */
        public readonly version: number,
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
         * Mosaic restriction items
         */
        public readonly restrictions: MosaicGlobalRestrictionItem[],
    ) {}

    /**
     * Returns the restriction for a given key.
     *
     * @param key the key.
     */
    public getRestriction(key: UInt64): MosaicGlobalRestrictionItem | undefined {
        return this.restrictions.find((item) => item.key.equals(key));
    }

    /**
     * Generate buffer
     * @return {Uint8Array}
     */
    public serialize(): Uint8Array {
        const mosaicId: MosaicIdDto = this.mosaicId.toBuilder();
        const keyPairs: GlobalKeyValueSetBuilder = new GlobalKeyValueSetBuilder(
            this.restrictions
                .sort((a, b) => a.key.compare(b.key))
                .map((item) => {
                    const key: MosaicRestrictionKeyDto = new MosaicRestrictionKeyDto(item.key.toDTO());
                    const value: number[] = item.restrictionValue.toDTO();
                    const restrictionRule = new RestrictionRuleBuilder(
                        item.referenceMosaicId.toBuilder(),
                        value,
                        item.restrictionType as number,
                    );
                    return new GlobalKeyValueBuilder(key, restrictionRule);
                }),
        );
        const globalRestrictionBuilder = new MosaicGlobalRestrictionEntryBuilder(mosaicId, keyPairs);
        return new MosaicRestrictionEntryBuilder(
            this.version,
            MosaicRestrictionEntryTypeDto.GLOBAL,
            undefined,
            globalRestrictionBuilder,
        ).serialize();
    }
}
