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
import { TransactionInfo } from './TransactionInfo';

/**
 * Inner transaction information model included in all aggregate inner transactions
 */
export class AggregateTransactionInfo extends TransactionInfo {
    /**
     * @param height
     * @param index
     * @param id
     * @param aggregateHash
     * @param aggregateId
     */
    constructor(
        height: UInt64,
        index: number,
        id: string,
        /**
         * The hash of the aggregate transaction.
         */
        public readonly aggregateHash: string,
        /**
         * The id of the aggregate transaction.
         */
        public readonly aggregateId: string,
    ) {
        super(height, index, id);
    }
}
