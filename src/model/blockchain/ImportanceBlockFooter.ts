/*
 * Copyright 2020 NEM
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

export class ImportanceBlockFooter {
    constructor(
        /**
         * Number of voting eligible accounts.
         */
        public readonly votingEligibleAccountsCount: number,
        /**
         * Number of harvesting eligible accounts.
         */
        public readonly harvestingEligibleAccountsCount: UInt64,
        /**
         * Total balance eligible for voting.
         */
        public readonly totalVotingBalance: UInt64,
        /**
         * Previous importance block hash.
         */
        public readonly previousImportanceBlockHash: string,
    ) {}
}
