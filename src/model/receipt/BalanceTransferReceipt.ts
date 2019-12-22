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
import { UnresolvedMapping } from '../../core/utils/UnresolvedMapping';
import { GeneratorUtils } from '../../infrastructure/catbuffer/GeneratorUtils';
import { Address } from '../account/Address';
import { PublicAccount } from '../account/PublicAccount';
import { MosaicId } from '../mosaic/MosaicId';
import { NamespaceId } from '../namespace/NamespaceId';
import { UInt64 } from '../UInt64';
import { Receipt } from './Receipt';
import { ReceiptType } from './ReceiptType';
import { ReceiptVersion } from './ReceiptVersion';

/**
 * Balance Transfer: A mosaic transfer was triggered.
 */
export class BalanceTransferReceipt extends Receipt {

    /**
     * Balance transfer expiry receipt
     * @param sender - The public account of the sender.
     * @param recipientAddress - The mosaic recipient address.
     * @param mosaicId - The mosaic id.
     * @param amount - The amount of mosaic.
     * @param version - The receipt version
     * @param type - The receipt type
     * @param size - the receipt size
     */
    constructor(
                /**
                 * The public account of the sender.
                 */
                public readonly sender: PublicAccount,
                /**
                 * The mosaic recipient address.
                 */
                public readonly recipientAddress: Address | NamespaceId,
                /**
                 * The mosaic id.
                 */
                public readonly mosaicId: MosaicId,
                /**
                 * The amount of mosaic.
                 */
                public readonly amount: UInt64,
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
        const recipient = this.getRecipientBytes();
        const buffer = new Uint8Array(52 + recipient.length);
        buffer.set(GeneratorUtils.uintToBuffer(ReceiptVersion.BALANCE_TRANSFER, 2));
        buffer.set(GeneratorUtils.uintToBuffer(this.type, 2), 2);
        buffer.set(GeneratorUtils.uint64ToBuffer(UInt64.fromHex(this.mosaicId.toHex()).toDTO()), 4);
        buffer.set(GeneratorUtils.uint64ToBuffer(UInt64.fromHex(this.amount.toHex()).toDTO()), 12);
        buffer.set(Convert.hexToUint8(this.sender.publicKey), 20);
        buffer.set(recipient, 52);
        return buffer;
    }

    /**
     * @internal
     * Generate buffer for recipientAddress
     * @return {Uint8Array}
     */
    private getRecipientBytes(): Uint8Array {
        return UnresolvedMapping.toUnresolvedAddressBytes(this.recipientAddress, this.sender.address.networkType);
    }
}
