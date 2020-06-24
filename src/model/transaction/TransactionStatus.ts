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

import { TransactionGroupEnum, TransactionStatusEnum } from 'symbol-openapi-typescript-fetch-client';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';

/**
 * Transaction status contains basic of a transaction announced to the blockchain.
 */
export class TransactionStatus {
    /**
     * @param group
     * @param code
     * @param hash
     * @param deadline
     * @param height
     */
    constructor(
        /**
         * The transaction status group "failed", "unconfirmed", "confirmed", etc...
         */
        public readonly group: TransactionGroupEnum,
        /**
         * The transaction hash.
         */
        public readonly hash: string,
        /**
         * The transaction deadline.
         */
        public readonly deadline: Deadline,
        /**
         * The transaction status code being the error name in case of failure and success otherwise.
         */
        public readonly code?: TransactionStatusEnum,
        /**
         * The height of the block at which it was confirmed or rejected.
         */
        public readonly height?: UInt64,
    ) {}
}
