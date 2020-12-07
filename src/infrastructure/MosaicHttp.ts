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
import { MosaicInfoDTO, MosaicRoutesApi } from 'symbol-openapi-typescript-fetch-client';
import { DtoMapping } from '../core/utils/DtoMapping';
import { Address } from '../model/account/Address';
import { MerkleStateInfo } from '../model/blockchain';
import { MosaicFlags } from '../model/mosaic/MosaicFlags';
import { MosaicId } from '../model/mosaic/MosaicId';
import { MosaicInfo } from '../model/mosaic/MosaicInfo';
import { NetworkType } from '../model/network/NetworkType';
import { UInt64 } from '../model/UInt64';
import { Http } from './Http';
import { MosaicRepository } from './MosaicRepository';
import { Page } from './Page';
import { MosaicPaginationStreamer } from './paginationStreamer';
import { MosaicSearchCriteria } from './searchCriteria/MosaicSearchCriteria';

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
     * @param url Base catapult-rest url
     * @param networkType the network type.
     * @param fetchApi fetch function to be used when performing rest requests.
     */
    constructor(url: string, networkType?: NetworkType | Observable<NetworkType>, fetchApi?: any) {
        super(url, fetchApi);
        this.mosaicRoutesApi = new MosaicRoutesApi(this.config());
        this.networkTypeObservable = this.createNetworkTypeObservable(networkType);
    }

    /**
     * Gets the MosaicInfo for a given mosaicId
     * @param mosaicId - Mosaic id
     * @returns Observable<MosaicInfo>
     */
    public getMosaic(mosaicId: MosaicId): Observable<MosaicInfo> {
        return this.call(this.mosaicRoutesApi.getMosaic(mosaicId.toHex()), (body) => MosaicHttp.toMosaicInfo(body));
    }

    /**
     * Gets MosaicInfo for different mosaicIds.
     * @param mosaicIds - Array of mosaic ids
     * @returns Observable<MosaicInfo[]>
     */
    public getMosaics(mosaicIds: MosaicId[]): Observable<MosaicInfo[]> {
        return this.call(
            this.mosaicRoutesApi.getMosaics({
                mosaicIds: mosaicIds.map((id) => id.toHex()),
            }),
            (body) => body.map((b) => MosaicHttp.toMosaicInfo(b)),
        );
    }

    /**
     * Gets a MosaicInfo merkle for a given mosaicId
     * @param mosaicId - Mosaic id
     * @returns Observable<MerkleStateInfo>
     */
    public getMosaicMerkle(mosaicId: MosaicId): Observable<MerkleStateInfo> {
        return this.call(this.mosaicRoutesApi.getMosaicMerkle(mosaicId.toHex()), DtoMapping.toMerkleStateInfo);
    }

    /**
     * Gets an array of mosaics.
     * @summary Get mosaics created for given address
     * @param criteria Mosaic search criteria
     * @returns {Page<MosaicInfo>}
     */
    public search(criteria: MosaicSearchCriteria): Observable<Page<MosaicInfo>> {
        return this.networkTypeObservable.pipe(
            mergeMap((networkType) =>
                this.call(
                    this.mosaicRoutesApi.searchMosaics(
                        criteria.ownerAddress?.plain(),
                        criteria.pageSize,
                        criteria.pageNumber,
                        criteria.offset,
                        DtoMapping.mapEnum(criteria.order),
                    ),
                    (body) => super.toPage(body.pagination, body.data, MosaicHttp.toMosaicInfo, networkType),
                ),
            ),
        );
    }

    public streamer(): MosaicPaginationStreamer {
        return new MosaicPaginationStreamer(this);
    }

    /**
     * Maps MosaicInfoDTO to MosaicInfo
     *
     * @param mosaicInfo the dto object.
     * @returns the model object
     */
    public static toMosaicInfo(mosaicInfo: MosaicInfoDTO): MosaicInfo {
        return new MosaicInfo(
            mosaicInfo.mosaic.version || 1,
            mosaicInfo.id,
            new MosaicId(mosaicInfo.mosaic.id),
            UInt64.fromNumericString(mosaicInfo.mosaic.supply),
            UInt64.fromNumericString(mosaicInfo.mosaic.startHeight),
            Address.createFromEncoded(mosaicInfo.mosaic.ownerAddress),
            mosaicInfo.mosaic.revision,
            new MosaicFlags(mosaicInfo.mosaic.flags),
            mosaicInfo.mosaic.divisibility,
            UInt64.fromNumericString(mosaicInfo.mosaic.duration),
        );
    }
}
