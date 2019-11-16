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

import {from as observableFrom, Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import { DtoMapping } from '../core/utils/DtoMapping';
import { Address } from '../model/account/Address';
import { AccountRestriction } from '../model/restriction/AccountRestriction';
import { AccountRestrictions } from '../model/restriction/AccountRestrictions';
import { RestrictionAccountRoutesApi } from './api/restrictionAccountRoutesApi';
import {Http} from './Http';
import { RestrictionAccountRepository } from './RestrictionAccountRespository';

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
     * @param url
     */
    constructor(url: string) {
        super();
        this.restrictionAccountRoutesApi = new RestrictionAccountRoutesApi(url);

    }

    /**
     * Get Account restrictions.
     * @param publicAccount public account
     * @returns Observable<AccountRestrictions[]>
     */
    public getAccountRestrictions(address: Address): Observable<AccountRestriction[]> {
        return observableFrom(this.restrictionAccountRoutesApi.getAccountRestrictions(address.plain()))
            .pipe(map(({body}) => DtoMapping.extractAccountRestrictionFromDto(body).accountRestrictions.restrictions),
            catchError((error) =>  throwError(this.errorHandling(error))),
        );
    }

    /**
     * Get Account restrictions.
     * @param address list of addresses
     * @returns Observable<AccountRestrictionsInfo[]>
     */
    public getAccountRestrictionsFromAccounts(addresses: Address[]): Observable<AccountRestrictions[]> {
        const accountIds = {
            addresses: addresses.map((address) => address.plain()),
        };
        return observableFrom(
            this.restrictionAccountRoutesApi.getAccountRestrictionsFromAccounts(accountIds))
                .pipe(map(({body}) => body.map((restriction) => {
                        return DtoMapping.extractAccountRestrictionFromDto(restriction).accountRestrictions;
                })),
                catchError((error) =>  throwError(this.errorHandling(error))),
        );
    }
}
