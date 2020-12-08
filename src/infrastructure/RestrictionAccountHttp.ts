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
import { DtoMapping } from '../core/utils';
import { Address } from '../model/account';
import { MerkleStateInfo } from '../model/blockchain';
import { AccountRestrictions } from '../model/restriction';
import { Http } from './Http';
import { Page } from './Page';
import { RestrictionAccountPaginationStreamer } from './paginationStreamer';
import { RestrictionAccountRepository } from './RestrictionAccountRepository';
import { RestrictionAccountSearchCriteria } from './searchCriteria/RestrictionAccountSearchCriteria';

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
        return this.call(
            this.restrictionAccountRoutesApi.getAccountRestrictions(address.plain()),
            DtoMapping.extractAccountRestrictionFromDto,
        );
    }

    /**
     * Get Account restrictions merkle.
     * @param address the address
     * @returns Observable<MerkleStateInfo>
     */
    public getAccountRestrictionsMerkle(address: Address): Observable<MerkleStateInfo> {
        return this.call(this.restrictionAccountRoutesApi.getAccountRestrictionsMerkle(address.plain()), DtoMapping.toMerkleStateInfo);
    }

    /**
     * Returns a mosaic restrictions page based on the criteria.
     *
     * @param criteria the criteria
     * @return a page of {@link MosaicRestriction}
     */
    public search(criteria: RestrictionAccountSearchCriteria): Observable<Page<AccountRestrictions>> {
        return this.call(
            this.restrictionAccountRoutesApi.searchAccountRestrictions(
                criteria.address?.plain(),
                criteria.pageSize,
                criteria.pageNumber,
                criteria.offset,
                DtoMapping.mapEnum(criteria.order),
            ),
            (body) => super.toPage(body.pagination, body.data, DtoMapping.extractAccountRestrictionFromDto),
        );
    }

    public streamer(): RestrictionAccountPaginationStreamer {
        return new RestrictionAccountPaginationStreamer(this);
    }
}
