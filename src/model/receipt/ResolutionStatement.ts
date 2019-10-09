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

import { sha3_256 } from 'js-sha3';
import { Convert } from '../../core/format/Convert';
import { RawAddress } from '../../core/format/RawAddress';
import { GeneratorUtils } from '../../infrastructure/catbuffer/GeneratorUtils';
import { Address } from '../account/Address';
import { MosaicId } from '../mosaic/MosaicId';
import { UInt64 } from '../UInt64';
import { ReceiptType } from './ReceiptType';
import { ReceiptVersion } from './ReceiptVersion';
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

    /**
     * Generate receipt hash
     * @return {string} receipt hash in hex
     */
    public generateHash(): string {
        const type = this.unresolved instanceof Address ? ReceiptType.Address_Alias_Resolution
                                                        : ReceiptType.Mosaic_Alias_Resolution;
        const unresolvedBytes = this.unresolved instanceof Address ? RawAddress.stringToAddress(this.unresolved.plain())
                                                                   : Convert.hexToUint8(this.unresolved.toHex());
        const hasher = sha3_256.create();
        hasher.update(GeneratorUtils.uintToBuffer(ReceiptVersion.RESOLUTION_STATEMENT, 2));
        hasher.update(GeneratorUtils.uintToBuffer(type, 2));
        hasher.update(unresolvedBytes);

        let entryBytes = Uint8Array.from([]);
        this.resolutionEntries.forEach((entry) => {
            const bytes = entry.serialize();
            entryBytes = GeneratorUtils.concatTypedArrays(entryBytes, bytes);
        });

        hasher.update(entryBytes);
        return hasher.hex().toUpperCase();
    }
}
