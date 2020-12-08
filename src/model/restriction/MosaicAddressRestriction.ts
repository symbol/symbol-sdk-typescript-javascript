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
    AddressDto,
    AddressKeyValueBuilder,
    AddressKeyValueSetBuilder,
    MosaicAddressRestrictionEntryBuilder,
    MosaicIdDto,
    MosaicRestrictionEntryBuilder,
    MosaicRestrictionEntryTypeDto,
    MosaicRestrictionKeyDto,
} from 'catbuffer-typescript';
import { Address } from '../account';
import { MosaicId } from '../mosaic/MosaicId';
import { UInt64 } from '../UInt64';
import { MosaicAddressRestrictionItem } from './MosaicAddressRestrictionItem';
import { MosaicRestrictionEntryType } from './MosaicRestrictionEntryType';

export class MosaicAddressRestriction {
    /**
     * Constructor
     * @param version
     * @param compositeHash
     * @param entryType
     * @param mosaicId
     * @param targetAddress
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
         * Target address
         */
        public readonly targetAddress: Address,
        /**
         * Mosaic restriction items
         */
        public readonly restrictions: MosaicAddressRestrictionItem[],
    ) {}

    /**
     * Returns the restriction for a given key.
     *
     * @param key the key.
     */
    public getRestriction(key: UInt64): MosaicAddressRestrictionItem | undefined {
        return this.restrictions.find((item) => item.key.equals(key));
    }

    /**
     * Generate buffer
     * @return {Uint8Array}
     */
    public serialize(): Uint8Array {
        const mosaicId: MosaicIdDto = this.mosaicId.toBuilder();
        const address: AddressDto = this.targetAddress.toBuilder();
        const keyPairs: AddressKeyValueSetBuilder = new AddressKeyValueSetBuilder(
            this.restrictions
                .sort((a, b) => a.key.compare(b.key))
                .map((item) => {
                    const key: MosaicRestrictionKeyDto = new MosaicRestrictionKeyDto(item.key.toDTO());
                    const value: number[] = item.restrictionValue.toDTO();
                    return new AddressKeyValueBuilder(key, value);
                }),
        );
        const addressRestrictionBuilder = new MosaicAddressRestrictionEntryBuilder(mosaicId, address, keyPairs);
        return new MosaicRestrictionEntryBuilder(
            this.version,
            MosaicRestrictionEntryTypeDto.ADDRESS,
            addressRestrictionBuilder,
            undefined,
        ).serialize();
    }
}
