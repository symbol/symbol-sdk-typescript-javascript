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

import { AccountLinkPublicKey } from './AccountLinkPublicKey';
import { AccountLinkVotingKey } from './AccountLinkVotingKey';

/**
 * SupplementalPublicKeys
 */
export class SupplementalPublicKeys {
    /**
     *
     */
    constructor(
        /**
         * Linked keys
         */
        public readonly linked?: AccountLinkPublicKey,
        /**
         * Node linked keys
         */
        public readonly node?: AccountLinkPublicKey,
        /**
         * VRF linked keys
         */
        public readonly vrf?: AccountLinkPublicKey,
        /**
         * Voting linked keys
         */
        public readonly voting?: AccountLinkVotingKey[],
    ) {}
}
