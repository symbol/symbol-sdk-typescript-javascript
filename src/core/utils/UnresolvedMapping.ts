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
import { Address } from '../../model/account/Address';
import { UnresolvedAddress } from '../../model/account/UnresolvedAddress';
import { MosaicId } from '../../model/mosaic/MosaicId';
import { UnresolvedMosaicId } from '../../model/mosaic/UnresolvedMosaicId';
import { NamespaceId } from '../../model/namespace/NamespaceId';
import { NetworkType } from '../../model/network/NetworkType';
import { Convert } from '../format/Convert';
import { RawAddress } from '../format/RawAddress';

/**
 * @internal
 */
export class UnresolvedMapping {
    /**
     * @internal
     * Map unresolved mosaic string to MosaicId or NamespaceId
     * @param {string} mosaicId The unresolvedMosaic id in hex.
     * @returns {UnresolvedMosaicId}
     */
    public static toUnresolvedMosaic(mosaicId: string): UnresolvedMosaicId {
        if (!Convert.isHexString(mosaicId)) {
            throw new Error('Input string is not in valid hexadecimal notation.');
        }
        const bytes = Convert.hexToUint8(mosaicId);
        const byte0 = bytes[0];

        // if most significant bit of byte 0 is set, then we have a namespaceId
        if ((byte0 & 128) === 128) {
            return NamespaceId.createFromEncoded(mosaicId);
        }
        // most significant bit of byte 0 is not set => mosaicId
        return new MosaicId(mosaicId);
    }

    /**
     * Map unresolved address string to Address or NamespaceId
     * @param {string} address The unresolved address in hex
     * @returns {UnresolvedAddress}
     */
    public static toUnresolvedAddress(address: string): UnresolvedAddress {
        if (!Convert.isHexString(address)) {
            throw new Error('Input string is not in valid hexadecimal notation.');
        }
        // If bit 0 of byte 0 is not set (like in 0x90), then it is a regular address.
        // Else (e.g. 0x91) it represents a namespace id which starts at byte 1.
        const bit0 = Convert.hexToUint8(address.substr(1, 2))[0];
        if ((bit0 & 16) === 16) {
            // namespaceId encoded hexadecimal notation provided
            // only 8 bytes are relevant to resolve the NamespaceId
            const relevantPart = address.substr(2, 16);
            return NamespaceId.createFromEncoded(Convert.uint8ToHex(Convert.hexToUint8Reverse(relevantPart)));
        }

        // read address from encoded hexadecimal notation
        return Address.createFromEncoded(address);
    }

    /**
     * Return unresolved address bytes of the unresolved address
     * @internal
     * @param {UnresolvedAddress} unresolvedAddress The unresolved address
     * @param {networkType} networkType the network type serialized in the output.
     * @return {Uint8Array}
     */
    public static toUnresolvedAddressBytes(unresolvedAddress: UnresolvedAddress, networkType: NetworkType): Uint8Array {
        if (unresolvedAddress instanceof NamespaceId) {
            // received hexadecimal notation of namespaceId (alias)
            return RawAddress.aliasToRecipient(Convert.hexToUint8((unresolvedAddress as NamespaceId).toHex()), networkType);
        } else {
            // received recipient address
            return RawAddress.stringToAddress((unresolvedAddress as Address).plain());
        }
    }
}
