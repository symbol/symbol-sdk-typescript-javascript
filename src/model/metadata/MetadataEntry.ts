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
     * @param {string} compositeHash - The composite hash
     * @param {string} senderPublicKey - The metadata sender's public key
     * @param {string} targetPublicKey - The metadata target public key
     * @param {UInt64} scopedMetadataKey - The key scoped to source, target and type
     * @param {MetadatType} metadataType - The metadata type (Account | Mosaic | Namespace)
     * @param {string} value - The metadata value
     * @param {MosaicId | NamespaceId | undefined} targetId - The target mosaic or namespace identifier
     */
    constructor(
        /**
         * The composite hash
         */
        public readonly compositeHash: string,
        /**
         * The metadata sender's public key
         */
        public readonly senderPublicKey: string,
        /**
         * The metadata target public key
         */
        public readonly targetPublicKey: string,
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
}
