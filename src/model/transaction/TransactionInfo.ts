/*
 * Copyright 2018 NEM
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

import { UInt64 } from '../UInt64';

/**
 * Transaction information model included in all transactions
 */
export class TransactionInfo {
    /**
     * @param height
     * @param index
     * @param id
     * @param hash
     * @param merkleComponentHash
     */
    constructor(
        /**
         * The block height in which the transaction was included.
         */
        public readonly height: UInt64,
        /**
         * The index representing either transaction index/position within block or within an aggregate transaction.
         */
        public readonly index: number,
        /**
         * The transaction db id.
         */
        public readonly id: string,
        /**
         * The transaction hash.
         */
        public readonly hash?: string,
        /**
         * The transaction merkle hash.
         */
        public readonly merkleComponentHash?: string,
    ) {}
}
