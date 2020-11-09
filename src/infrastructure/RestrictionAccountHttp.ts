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
import { RestrictionAccountRoutesApi } from 'symbol-openapi-typescript-fetch-client';
import { DtoMapping } from '../core/utils/DtoMapping';
import { Address } from '../model/account/Address';
import { AccountRestrictions } from '../model/restriction';
import { Http } from './Http';
import { RestrictionAccountRepository } from './RestrictionAccountRepository';

/**
 * RestrictionAccount http repository.
 *
 * @since 1.0
 */
export class RestrictionAccountHttp extends Http implements RestrictionAccountRepository {
    /**
     * @internal
     */
    private restrictionAccountRoutesApi: RestrictionAccountRoutesApi;

    /**
     * Constructor
     * @param url Base catapult-rest url
     * @param fetchApi fetch function to be used when performing rest requests.
     */
    constructor(url: string, fetchApi?: any) {
        super(url, fetchApi);
        this.restrictionAccountRoutesApi = new RestrictionAccountRoutesApi(this.config());
    }

    /**
     * Get Account restrictions.
     * @param address the address
     * @returns Observable<AccountRestrictions[]>
     */
    public getAccountRestrictions(address: Address): Observable<AccountRestrictions> {
        return this.call(this.restrictionAccountRoutesApi.getAccountRestrictions(address.plain()), (body) =>
            DtoMapping.extractAccountRestrictionFromDto(body),
        );
    }
}
