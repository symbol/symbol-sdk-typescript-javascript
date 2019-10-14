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

import { Convert } from '../../core/format/Convert';
import { GeneratorUtils } from '../../infrastructure/catbuffer/GeneratorUtils';
import { MosaicId } from '../mosaic/MosaicId';
import { NamespaceId } from '../namespace/NamespaceId';
import { UInt64 } from '../UInt64';
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
    constructor(public readonly  artifactId: MosaicId | NamespaceId,
                version: ReceiptVersion,
                type: ReceiptType,
                size?: number) {
        super(version, type, size);
    }

    /**
     * @internal
     * Generate buffer
     * @return {Uint8Array}
     */
    public serialize(): Uint8Array {
        const buffer = new Uint8Array(12);
        buffer.set(GeneratorUtils.uintToBuffer(ReceiptVersion.ARTIFACT_EXPIRY, 2));
        buffer.set(GeneratorUtils.uintToBuffer(this.type, 2), 2);
        buffer.set(GeneratorUtils.uint64ToBuffer(UInt64.fromHex(this.artifactId.toHex()).toDTO()), 4);
        return buffer;
    }
}
