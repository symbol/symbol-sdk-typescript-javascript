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

import { UInt64 } from '../UInt64';

/**
 * Account activity bucket.
 */
export class ActivityBucket {
    /**
     * Constructor
     * @param meta
     * @param accountRestrictions
     */
    constructor(
        /**
         * Start height
         */
        public readonly startHeight: UInt64,
        /**
         * Total fees paid.
         */
        public readonly totalFeesPaid: UInt64,
        /**
         * Beneficiary count.
         */
        public readonly beneficiaryCount: number,
        /**
         * Raw score.
         */
        public readonly rawScore: UInt64,
    ) {}
}
