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

import { Receipt } from './receipt';
import { ReceiptSource } from './receiptSource';
import { ReceiptType } from './receiptType';

/**
 * A transaction statement is a collection of receipts linked with a transaction in a particular block.
 * - Balance Transfer: A mosaic transfer was triggered.
 * - Balance Change: A mosaic credit or debit was triggered.
 * - Artifact Expiry: An artifact (e.g. namespace, mosaic) expired.
 */
export class TransactionStatement extends Receipt {

    /**
     * Receipt - transaction statement object
     * @param size
     * @param version
     * @param type
     * @param m_source
     * @param receipts
     */
    constructor(size: number,
                version: number,
                type: ReceiptType,
                /**
                 * The receipt source.
                 */
                public readonly m_source: ReceiptSource,
                /**
                 * The array of receipt headers.
                 */
                public readonly receipts: Receipt[]) {
        super(size, version, type);
    }
}
