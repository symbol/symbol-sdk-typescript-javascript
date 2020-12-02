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

import { Observable } from 'rxjs';
import { AccountInfo, Address } from '../model/account';
import { MerkleStateInfo } from '../model/blockchain';
import { SearcherRepository } from './paginationStreamer';
import { AccountSearchCriteria } from './searchCriteria';

/**
 * Account interface repository.
 *
 * @since 1.0
 */
export interface AccountRepository extends SearcherRepository<AccountInfo, AccountSearchCriteria> {
    /**
     * Gets an AccountInfo for an account.
     * @param address Address
     * @returns Observable<AccountInfo>
     */
    getAccountInfo(address: Address): Observable<AccountInfo>;

    /**
     * Gets AccountsInfo for different accounts.
     * @param addresses List of Address
     * @returns Observable<AccountInfo[]>
     */
    getAccountsInfo(addresses: Address[]): Observable<AccountInfo[]>;

    /**
     * Gets an account infro merkle for an account.
     * @param address Address
     * @returns Observable<MerkleStateInfo>
     */
    getAccountInfoMerkle(address: Address): Observable<MerkleStateInfo>;
}
