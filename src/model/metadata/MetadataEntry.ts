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

import { MetadataEntryBuilder, MetadataValueBuilder, ScopedMetadataKeyDto } from 'catbuffer-typescript';
import { Convert } from '../../core/format';
import { Address } from '../account/Address';
import { MosaicId } from '../mosaic/MosaicId';
import { NamespaceId } from '../namespace/NamespaceId';
import { UInt64 } from '../UInt64';
import { MetadataType } from './MetadataType';

/**
 * A mosaic describes an instance of a mosaic definition.
 * Mosaics can be transferred by means of a transfer transaction.
 */
export class MetadataEntry {
    /**
     * Constructor
     * @param {number} version - The version
     * @param {string} compositeHash - The composite hash
     * @param {string} sourceAddress - The metadata source address (provider)
     * @param {string} targetAddress - The metadata target address
     * @param {UInt64} scopedMetadataKey - The key scoped to source, target and type
     * @param {MetadatType} metadataType - The metadata type (Account | Mosaic | Namespace)
     * @param {string} value - The metadata value
     * @param {UnresolvedMosaicId | undefined} targetId - The target mosaic or namespace identifier
     */
    constructor(
        /**
         * Version
         */
        public readonly version: number,
        /**
         * The composite hash
         */
        public readonly compositeHash: string,
        /**
         * The metadata source address (provider)
         */
        public readonly sourceAddress: Address,
        /**
         * The metadata target address
         */
        public readonly targetAddress: Address,
        /**
         * The key scoped to source, target and type
         */
        public readonly scopedMetadataKey: UInt64,
        /**
         * The metadata type
         */
        public readonly metadataType: MetadataType,
        /**
         * The metadata value
         */
        public readonly value: string,
        /**
         * The target mosaic or namespace identifier
         */
        public readonly targetId?: MosaicId | NamespaceId,
    ) {}

    /**
     * Generate buffer
     * @return {Uint8Array}
     */
    public serialize(): Uint8Array {
        const sourceAddress = this.sourceAddress.toBuilder();
        const targetAddress = this.targetAddress.toBuilder();

        /** Metadata key scoped to source, target and type. */
        const scopedMetadataKey = new ScopedMetadataKeyDto(this.scopedMetadataKey.toDTO());
        /** Target id. */
        const targetId: number[] = this.targetId?.id.toDTO() || [0, 0];
        /** Metadata type. */
        const metadataType = this.metadataType.valueOf();
        /** Value. */
        const value = new MetadataValueBuilder(Convert.utf8ToUint8(this.value));

        return new MetadataEntryBuilder(
            this.version,
            sourceAddress,
            targetAddress,
            scopedMetadataKey,
            targetId,
            metadataType,
            value,
        ).serialize();
    }
}
