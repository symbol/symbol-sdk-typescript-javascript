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

import { AmountDto, BalanceChangeReceiptBuilder, MosaicBuilder } from 'catbuffer-typescript';
import { Address } from '../account/Address';
import { MosaicId } from '../mosaic/MosaicId';
import { UInt64 } from '../UInt64';
import { Receipt } from './Receipt';
import { ReceiptType } from './ReceiptType';
import { ReceiptVersion } from './ReceiptVersion';

/**
 * Balance Change: A mosaic credit or debit was triggered.
 */
export class BalanceChangeReceipt extends Receipt {
    /**
     * Balance change expiry receipt
     * @param targetAddress - The target account address.
     * @param mosaicId - The mosaic id.
     * @param amount - The amount of mosaic.
     * @param version - The receipt version
     * @param type - The receipt type
     * @param size - the receipt size
     */
    constructor(
        /**
         * The target account address.
         */
        public readonly targetAddress: Address,
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
        size?: number,
    ) {
        super(version, type, size);
    }

    /**
     * @internal
     * Generate buffer
     * @return {Uint8Array}
     */
    public serialize(): Uint8Array {
        return new BalanceChangeReceiptBuilder(
            ReceiptVersion.BALANCE_CHANGE,
            this.type.valueOf(),
            new MosaicBuilder(this.mosaicId.toBuilder(), new AmountDto(this.amount.toDTO())),
            this.targetAddress.toBuilder(),
        ).serialize();
    }
}
