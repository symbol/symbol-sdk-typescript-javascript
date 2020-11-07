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
import { AccountInfoResolvedMosaic } from '../../model/account/AccountInfoResolvedMosaic';
import { Address } from '../../model/account/Address';
import { NamespaceInfoWithName } from '../../model/namespace/NamespaceInfoWithName';

/**
 * Block Service Interface
 */
export interface IAccountService {
    /**
     * Get account info with resolved mosaic
     * @param addresses Array of addresses
     */
    accountInfoWithResolvedMosaic(addresses: Address[]): Observable<AccountInfoResolvedMosaic[]>;

    /**
     * Get namespace info for account with namespace name
     * @param address Namespace owner address
     * @returns {Observable<NamespaceInfoWithName[]>}
     */
    accountNamespacesWithName(addresses: Address): Observable<NamespaceInfoWithName[]>;
}
