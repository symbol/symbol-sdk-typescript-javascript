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

import { Observable } from 'rxjs';
import { MerkleStateInfo } from '../model/blockchain';
import { SecretLockInfo } from '../model/lock';
import { SearcherRepository } from './paginationStreamer';
import { SecretLockSearchCriteria } from './searchCriteria';

/**
 * Secretlock interface repository.
 */
export interface SecretLockRepository extends SearcherRepository<SecretLockInfo, SecretLockSearchCriteria> {
    /**
     * Get secret lock info of the given id.
     * @param compositeHash SecretLockInfo composite hash id
     * @returns Observable<SecretLockInfo>
     */
    getSecretLock(compositeHash: string): Observable<SecretLockInfo>;

    /**
     * Get secret lock merkle info of the given id.
     * @param compositeHash SecretLockInfo composite hash id
     * @returns Observable<MerkleStateInfo>
     */
    getSecretLockMerkle(compositeHash: string): Observable<MerkleStateInfo>;
}
