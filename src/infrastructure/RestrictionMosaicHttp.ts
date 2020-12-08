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
import {
    MosaicAddressRestrictionDTO,
    MosaicAddressRestrictionEntryDTO,
    MosaicGlobalRestrictionDTO,
    MosaicGlobalRestrictionEntryDTO,
    RestrictionMosaicRoutesApi,
} from 'symbol-openapi-typescript-fetch-client';
import { DtoMapping } from '../core/utils';
import { MerkleStateInfo, UInt64 } from '../model';
import { Address } from '../model/account';
import { MosaicId } from '../model/mosaic';
import {
    MosaicAddressRestriction,
    MosaicAddressRestrictionItem,
    MosaicGlobalRestriction,
    MosaicGlobalRestrictionItem,
} from '../model/restriction';
import { MosaicRestriction } from '../model/restriction/MosaicRestriction';
import { Http } from './Http';
import { Page } from './Page';
import { RestrictionMosaicPaginationStreamer } from './paginationStreamer';
import { RestrictionMosaicRepository } from './RestrictionMosaicRepository';
import { RestrictionMosaicSearchCriteria } from './searchCriteria';

/**
 * RestrictionMosaic http repository.
 *
 * @since 1.0
 */
export class RestrictionMosaicHttp extends Http implements RestrictionMosaicRepository {
    /**
     * @internal
     */
    private restrictionMosaicRoutesApi: RestrictionMosaicRoutesApi;

    /**
     * Constructor
     * @param url Base catapult-rest url
     * @param fetchApi fetch function to be used when performing rest requests.
     */
    constructor(url: string, fetchApi?: any) {
        super(url, fetchApi);
        this.restrictionMosaicRoutesApi = new RestrictionMosaicRoutesApi(this.config());
    }

    /**
     * Returns a mosaic restrictions page based on the criteria.
     *
     * @param criteria the criteria
     * @return a page of {@link MosaicRestriction}
     */
    public search(criteria: RestrictionMosaicSearchCriteria): Observable<Page<MosaicRestriction>> {
        return this.call(
            this.restrictionMosaicRoutesApi.searchMosaicRestrictions(
                criteria.mosaicId?.toHex(),
                criteria.entryType?.valueOf(),
                criteria.targetAddress?.plain(),
                criteria.pageSize,
                criteria.pageNumber,
                criteria.offset,
                DtoMapping.mapEnum(criteria.order),
            ),
            (body) => super.toPage(body.pagination, body.data, (r) => RestrictionMosaicHttp.toMosaicRestriction(r)),
        );
    }

    public streamer(): RestrictionMosaicPaginationStreamer {
        return new RestrictionMosaicPaginationStreamer(this);
    }

    /**
     * This method maps a mosaic restriction dto from rest to the SDK's model object.
     *
     * @internal
     * @param {MosaicAddressRestrictionDTO | MosaicGlobalRestrictionDTO} dto the restriction object from rest.
     * @returns {MosaicRestriction} a restriction model
     */
    public static toMosaicRestriction(dto: MosaicAddressRestrictionDTO | MosaicGlobalRestrictionDTO): MosaicRestriction {
        if ((dto.mosaicRestrictionEntry as any).targetAddress) {
            const addressRestrictionDto = dto as MosaicAddressRestrictionDTO;
            return new MosaicAddressRestriction(
                dto.mosaicRestrictionEntry.version || 1,
                dto.mosaicRestrictionEntry.compositeHash,
                dto.mosaicRestrictionEntry.entryType.valueOf(),
                new MosaicId(dto.mosaicRestrictionEntry.mosaicId),
                Address.createFromEncoded(addressRestrictionDto.mosaicRestrictionEntry.targetAddress),
                addressRestrictionDto.mosaicRestrictionEntry.restrictions.map(RestrictionMosaicHttp.toMosaicAddressRestrictionItem),
            );
        }

        const globalRestrictionDto = dto as MosaicGlobalRestrictionDTO;
        return new MosaicGlobalRestriction(
            dto.mosaicRestrictionEntry.version || 1,
            dto.mosaicRestrictionEntry.compositeHash,
            dto.mosaicRestrictionEntry.entryType.valueOf(),
            new MosaicId(dto.mosaicRestrictionEntry.mosaicId),
            globalRestrictionDto.mosaicRestrictionEntry.restrictions.map((i) => RestrictionMosaicHttp.toMosaicGlobalRestrictionItem(i)),
        );
    }

    private static toMosaicGlobalRestrictionItem(restriction: MosaicGlobalRestrictionEntryDTO): MosaicGlobalRestrictionItem {
        return new MosaicGlobalRestrictionItem(
            UInt64.fromNumericString(restriction.key),
            new MosaicId(restriction.restriction.referenceMosaicId),
            UInt64.fromNumericString(restriction.restriction.restrictionValue),
            restriction.restriction.restrictionType.valueOf(),
        );
    }

    private static toMosaicAddressRestrictionItem(restriction: MosaicAddressRestrictionEntryDTO): MosaicAddressRestrictionItem {
        return new MosaicAddressRestrictionItem(UInt64.fromNumericString(restriction.key), UInt64.fromNumericString(restriction.value));
    }

    public getMosaicRestrictions(compositeHash: string): Observable<MosaicRestriction> {
        return this.call(this.restrictionMosaicRoutesApi.getMosaicRestrictions(compositeHash), RestrictionMosaicHttp.toMosaicRestriction);
    }

    public getMosaicRestrictionsMerkle(compositeHash: string): Observable<MerkleStateInfo> {
        return this.call(this.restrictionMosaicRoutesApi.getMosaicRestrictionsMerkle(compositeHash), DtoMapping.toMerkleStateInfo);
    }
}
