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

import { Observable } from 'rxjs';
import { Address } from '../model/account';
import { MerkleStateInfo } from '../model/blockchain';
import { AccountRestrictions } from '../model/restriction';
import { SearcherRepository } from './paginationStreamer';
import { RestrictionAccountSearchCriteria } from './searchCriteria';

export interface RestrictionAccountRepository extends SearcherRepository<AccountRestrictions, RestrictionAccountSearchCriteria> {
    /**
     * Gets Account restrictions.
     * @param address the address
     * @returns Observable<AccountRestrictions>
     */
    getAccountRestrictions(address: Address): Observable<AccountRestrictions>;

    /**
     * Gets Account restrictions merkle .
     * @param address the account address.
     * @returns Observable<MerkleStateInfo>
     */
    getAccountRestrictionsMerkle(address: Address): Observable<MerkleStateInfo>;
}
