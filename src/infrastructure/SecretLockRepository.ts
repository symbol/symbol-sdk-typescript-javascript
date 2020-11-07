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
import { SecretLockInfo } from '../model/lock/SecretLockInfo';
import { Searcher } from './paginationStreamer/Searcher';
import { SecretLockSearchCriteria } from './searchCriteria/SecretLockSearchCriteria';

/**
 * Secretlock interface repository.
 */
export interface SecretLockRepository extends Searcher<SecretLockInfo, SecretLockSearchCriteria> {
    /**
     * Get Secret lock info for an account.
     * @param secret Secretlock Secret
     * @returns Observable<SecretLockInfo>
     */
    getSecretLock(secret: string): Observable<SecretLockInfo>;
}
