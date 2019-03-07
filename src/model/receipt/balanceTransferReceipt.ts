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

import { PublicAccount } from '../account/PublicAccount';
import { MosaicId } from '../mosaic/MosaicId';
import { UInt64 } from '../UInt64';
import { Receipt } from './receipt';
import { ReceiptType } from './receiptType';

/**
 * Balance Transfer: A mosaic transfer was triggered.
 */
export class BalanceTransferReceipt extends Receipt {

    /**
     * Balance transfer expiry receipt
     * @param size
     * @param version
     * @param type
     * @param sender
     * @param recipient
     * @param mosaicId
     * @param amount
     */
    constructor(size: number,
                version: number,
                type: ReceiptType,
                /**
                 * The public key of the sender.
                 */
                public readonly sender: PublicAccount,
                /**
                 * The public key of the recipient.
                 */
                public readonly recipient: PublicAccount,
                /**
                 * The mosaic id.
                 */
                public readonly mosaicId: MosaicId,
                /**
                 * The amount of mosaic.
                 */
                public readonly amount: UInt64) {
        super(size, version, type);
    }
}
