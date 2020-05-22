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
import { mergeMap } from 'rxjs/operators';
import { PublicAccount } from '../model/account/PublicAccount';
import { MosaicFlags } from '../model/mosaic/MosaicFlags';
import { MosaicId } from '../model/mosaic/MosaicId';
import { MosaicInfo } from '../model/mosaic/MosaicInfo';
import { NetworkType } from '../model/network/NetworkType';
import { UInt64 } from '../model/UInt64';
import { Http } from './Http';
import { MosaicRepository } from './MosaicRepository';
import { MosaicSearchCriteria } from './searchCriteria/MosaicSearchCriteria';
import { Page } from './Page';
import { MosaicRoutesApi, MosaicIds, MosaicInfoDTO } from 'symbol-openapi-typescript-node-client';

/**
 * Mosaic http repository.
 *
 * @since 1.0
 */
export class MosaicHttp extends Http implements MosaicRepository {
    /**
     * @internal
     * Symbol openapi typescript-node client mosaic routes api
     */
    private readonly mosaicRoutesApi: MosaicRoutesApi;

    /**
     * @internal
     * network type for the mappings.
     */
    private readonly networkTypeObservable: Observable<NetworkType>;
    /**
     * Constructor
     * @param url
     * @param networkType
     */
    constructor(url: string, networkType?: NetworkType | Observable<NetworkType>) {
        super(url);
        this.mosaicRoutesApi = new MosaicRoutesApi(url);
        this.networkTypeObservable = this.createNetworkTypeObservable(networkType);
        this.mosaicRoutesApi.useQuerystring = true;
    }

    /**
     * Gets the MosaicInfo for a given mosaicId
     * @param mosaicId - Mosaic id
     * @returns Observable<MosaicInfo>
     */
    public getMosaic(mosaicId: MosaicId): Observable<MosaicInfo> {
        return this.networkTypeObservable.pipe(
            mergeMap((networkType) =>
                this.call(this.mosaicRoutesApi.getMosaic(mosaicId.toHex()), (body) => this.toMosaicInfo(body, networkType)),
            ),
        );
    }

    /**
     * Gets MosaicInfo for different mosaicIds.
     * @param mosaicIds - Array of mosaic ids
     * @returns Observable<MosaicInfo[]>
     */
    public getMosaics(mosaicIds: MosaicId[]): Observable<MosaicInfo[]> {
        const ids = new MosaicIds();
        ids.mosaicIds = mosaicIds.map((id) => id.toHex());
        return this.networkTypeObservable.pipe(
            mergeMap((networkType) =>
                this.call(this.mosaicRoutesApi.getMosaics(ids), (body) => body.map((b) => this.toMosaicInfo(b, networkType))),
            ),
        );
    }

    /**
     * Gets an array of mosaics.
     * @summary Get mosaics created for given address
     * @param criteria Mosaic search criteria
     * @returns {Page<MosaicInfo>}
     */
    public searchMosaics(criteria: MosaicSearchCriteria): Observable<Page<MosaicInfo>> {
        return this.networkTypeObservable.pipe(
            mergeMap((networkType) =>
                this.call(
                    this.mosaicRoutesApi.searchMosaics(
                        criteria.ownerAddress?.plain(),
                        criteria.pageSize,
                        criteria.pageNumber,
                        criteria.offset,
                        criteria.order,
                    ),
                    (body) => super.toPage(body.pagination, body.data, this.toMosaicInfo, networkType),
                ),
            ),
        );
    }

    /**
     * Maps MosaicInfoDTO to MosaicInfo
     *
     * @param mosaicInfo the dto object.
     * @returns the model object
     */
    private toMosaicInfo(mosaicInfo: MosaicInfoDTO, networkType: NetworkType): MosaicInfo {
        return new MosaicInfo(
            new MosaicId(mosaicInfo.mosaic.id),
            UInt64.fromNumericString(mosaicInfo.mosaic.supply),
            UInt64.fromNumericString(mosaicInfo.mosaic.startHeight),
            PublicAccount.createFromPublicKey(mosaicInfo.mosaic.ownerPublicKey, networkType),
            mosaicInfo.mosaic.revision,
            new MosaicFlags(mosaicInfo.mosaic.flags),
            mosaicInfo.mosaic.divisibility,
            UInt64.fromNumericString(mosaicInfo.mosaic.duration),
        );
    }
}
