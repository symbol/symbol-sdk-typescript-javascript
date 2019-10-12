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
import { NamespaceId } from '../namespace/NamespaceId';
import { UInt64 } from '../UInt64';
import { ReceiptType } from './ReceiptType';
import { ReceiptVersion } from './ReceiptVersion';
import { ResolutionEntry } from './ResolutionEntry';
import { ResolutionType } from './ResolutionType';

/**
 * When a transaction includes an alias, a so called resolution statement reflects the resolved value for that block:
 * - Address Resolution: An account alias was used in the block.
 * - Mosaic Resolution: A mosaic alias was used in the block.
 */
export class ResolutionStatement {

    /**
     * Receipt - resolution statement object
     * @param resolutionType - The resolution type
     * @param height - The block height
     * @param unresolved - An unresolved address or unresolved mosaicId.
     * @param resolutionEntries - The array of resolution entries.
     */
    constructor(
                /**
                 * Resolution type
                 */
                public readonly resolutionType: ResolutionType,
                /**
                 * The block height.
                 */
                public readonly height: UInt64,
                /**
                 * An unresolved address or unresolved mosaicId.
                 */
                public readonly unresolved: Address | MosaicId | NamespaceId,
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
        const type = this.resolutionType === ResolutionType.Address ? ReceiptType.Address_Alias_Resolution
                                                                    : ReceiptType.Mosaic_Alias_Resolution;
        const unresolvedBytes = this.getUnresolvedBytes(this.resolutionType);
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

    /**
     * @internal
     * Generate buffer for unresulved
     * @param - The resolution Type
     * @return {Uint8Array}
     */
    private getUnresolvedBytes(resolutionType: ResolutionType): Uint8Array {
        if (resolutionType === ResolutionType.Address) {
            const recipientString =
            this.unresolved instanceof NamespaceId ? (this.unresolved as NamespaceId).toHex()
                                                   : (this.unresolved as Address).plain();
            if (/^[0-9a-fA-F]{16}$/.test(recipientString)) {
                // received hexadecimal notation of namespaceId (alias)
                return RawAddress.aliasToRecipient(Convert.hexToUint8(recipientString));
            } else {
                // received recipient address
                return RawAddress.stringToAddress(recipientString);
            }
        }

        return GeneratorUtils.uint64ToBuffer(UInt64.fromHex((this.unresolved as MosaicId | NamespaceId).toHex()).toDTO());
    }
}
