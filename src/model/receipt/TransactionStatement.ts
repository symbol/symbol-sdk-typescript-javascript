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

import { GeneratorUtils } from 'catbuffer-typescript';
import { sha3_256 } from 'js-sha3';
import { UInt64 } from '../UInt64';
import { Receipt } from './Receipt';
import { ReceiptSource } from './ReceiptSource';
import { ReceiptType } from './ReceiptType';
import { ReceiptVersion } from './ReceiptVersion';

/**
 * A transaction statement is a collection of receipts linked with a transaction in a particular block.
 * - Balance Transfer: A mosaic transfer was triggered.
 * - Balance Change: A mosaic credit or debit was triggered.
 * - Artifact Expiry: An artifact (e.g. namespace, mosaic) expired.
 */
export class TransactionStatement {
    /**
     * Receipt - transaction statement object
     * @param height - The block height
     * @param source - The receipt source
     * @param receipts - The array of receipt headers.
     */
    constructor(
        /**
         * The block height.
         */
        public readonly height: UInt64,
        /**
         * The receipt source.
         */
        public readonly source: ReceiptSource,
        /**
         * The array of receipt headers.
         */
        public readonly receipts: Receipt[],
    ) {}

    /**
     * Generate receipt hash
     * @return {string} receipt hash in hex
     */
    public generateHash(): string {
        const hasher = sha3_256.create();
        hasher.update(GeneratorUtils.uintToBuffer(ReceiptVersion.TRANSACTION_STATEMENT, 2));
        hasher.update(GeneratorUtils.uintToBuffer(ReceiptType.Transaction_Group, 2));
        hasher.update(this.source.serialize());

        let receiptBytes = Uint8Array.from([]);
        this.receipts.forEach((receipt) => {
            const bytes = receipt.serialize();
            receiptBytes = GeneratorUtils.concatTypedArrays(receiptBytes, bytes);
        });

        hasher.update(receiptBytes);
        return hasher.hex().toUpperCase();
    }
}
