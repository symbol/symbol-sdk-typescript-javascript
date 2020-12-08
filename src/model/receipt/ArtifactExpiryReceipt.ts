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

import { MosaicExpiryReceiptBuilder, NamespaceExpiryReceiptBuilder } from 'catbuffer-typescript';
import { MosaicId } from '../mosaic/MosaicId';
import { UnresolvedMosaicId } from '../mosaic/UnresolvedMosaicId';
import { Receipt } from './Receipt';
import { ReceiptType } from './ReceiptType';
import { ReceiptVersion } from './ReceiptVersion';

/**
 * Artifact Expiry: An artifact (e.g. namespace, mosaic) expired.
 */
export class ArtifactExpiryReceipt extends Receipt {
    /**
     * Artifact expiry receipt
     * @param artifactId -The id of the artifact (eg. namespace, mosaic).
     * @param version - The receipt version
     * @param type - The receipt type
     * @param size - the receipt size
     */
    constructor(public readonly artifactId: UnresolvedMosaicId, version: ReceiptVersion, type: ReceiptType, size?: number) {
        super(version, type, size);
    }

    /**
     * @internal
     * Generate buffer
     * @return {Uint8Array}
     */
    public serialize(): Uint8Array {
        if (this.artifactId instanceof MosaicId) {
            return new MosaicExpiryReceiptBuilder(
                ReceiptVersion.ARTIFACT_EXPIRY,
                this.type.valueOf(),
                this.artifactId.toBuilder(),
            ).serialize();
        }
        return new NamespaceExpiryReceiptBuilder(
            ReceiptVersion.ARTIFACT_EXPIRY,
            this.type.valueOf(),
            this.artifactId.toBuilder(),
        ).serialize();
    }
}
