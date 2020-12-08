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

import {
    AmountDto,
    BlockDurationDto,
    GeneratorUtils,
    HeightDto,
    MosaicDefinitionBuilder,
    MosaicEntryBuilder,
    MosaicFlagsDto,
    MosaicIdDto,
    MosaicPropertiesBuilder,
} from 'catbuffer-typescript';
import { Address } from '../account';
import { UInt64 } from '../UInt64';
import { MosaicFlags } from './MosaicFlags';
import { MosaicId } from './MosaicId';

/**
 * The mosaic info structure describes a mosaic.
 */
export class MosaicInfo {
    /**
     * @param version
     * @param recordId
     * @param id
     * @param supply
     * @param startHeight
     * @param ownerAddress
     * @param revision
     * @param flags
     * @param divisibility
     * @param duration
     */
    constructor(
        /**
         * Version
         */
        public readonly version: number,
        /**
         * The database record id.
         */
        public readonly recordId: string,
        /**
         * The mosaic id.
         */
        public readonly id: MosaicId,
        /**
         * The mosaic supply.
         */
        public readonly supply: UInt64,
        /**
         * The block height were mosaic was created.
         */
        public readonly startHeight: UInt64,
        /**
         * The mosaic owner address.
         */
        public readonly ownerAddress: Address,
        /**
         * The mosaic revision
         */
        public readonly revision: number,
        /**
         * The mosaic flags.
         */
        public readonly flags: MosaicFlags,
        /**
         * Mosaic divisibility
         */
        public readonly divisibility: number,
        /**
         * Mosaic duration
         */
        public readonly duration: UInt64,
    ) {}

    /**
     * Is mosaic supply mutable
     * @returns {boolean}
     */
    public isSupplyMutable(): boolean {
        return this.flags.supplyMutable;
    }

    /**
     * Is mosaic transferable
     * @returns {boolean}
     */
    public isTransferable(): boolean {
        return this.flags.transferable;
    }

    /**
     * Is mosaic restrictable
     * @returns {boolean}
     */
    public isRestrictable(): boolean {
        return this.flags.restrictable;
    }

    /**
     * Generate buffer
     * @return {Uint8Array}
     */
    public serialize(): Uint8Array {
        const mosaicId: MosaicIdDto = this.id.toBuilder();
        const supply: AmountDto = new AmountDto(this.supply.toDTO());
        const startHeight = new HeightDto(this.startHeight.toDTO());
        const ownerAddress = this.ownerAddress.toBuilder();
        const revision = this.revision;
        const duration = new BlockDurationDto(this.duration.toDTO());
        const flags = GeneratorUtils.toFlags(MosaicFlagsDto, this.flags.getValue());
        const properties = new MosaicPropertiesBuilder(flags, this.divisibility, duration);
        const definition = new MosaicDefinitionBuilder(startHeight, ownerAddress, revision, properties);
        return new MosaicEntryBuilder(this.version, mosaicId, supply, definition).serialize();
    }
}
