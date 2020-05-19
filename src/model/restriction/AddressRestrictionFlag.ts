/*
 * Copyright 2020 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License"),
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

import { RestrictionFlag } from './RestrictionFlag';

export enum AddressRestrictionFlag {
    /**
     * Allow only incoming transactions from a given address.
     */
    AllowIncomingAddress = RestrictionFlag.Address,

    /**
     * Allow only outgoing transactions to a given address.
     */
    AllowOutgoingAddress = RestrictionFlag.Address + RestrictionFlag.Outgoing,

    /**
     * Block incoming transactions from a given address.
     */
    BlockIncomingAddress = RestrictionFlag.Address + RestrictionFlag.Block,

    /**
     * Block outgoing transactions from a given address.
     */
    BlockOutgoingAddress = RestrictionFlag.Address + RestrictionFlag.Block + RestrictionFlag.Outgoing,
}
