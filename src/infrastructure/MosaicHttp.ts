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

import {MosaicRoutesApi} from 'nem2-library';
import {from as observableFrom, Observable} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';
import {PublicAccount} from '../model/account/PublicAccount';
import {MosaicId} from '../model/mosaic/MosaicId';
import {MosaicInfo} from '../model/mosaic/MosaicInfo';
import {MosaicName} from '../model/mosaic/MosaicName';
import {MosaicProperties} from '../model/mosaic/MosaicProperties';
import {NamespaceId} from '../model/namespace/NamespaceId';
import {UInt64} from '../model/UInt64';
import {Http} from './Http';
import {MosaicRepository} from './MosaicRepository';
import {NetworkHttp} from './NetworkHttp';
import {QueryParams} from './QueryParams';

/**
 * Mosaic http repository.
 *
 * @since 1.0
 */
export class MosaicHttp extends Http implements MosaicRepository {
    /**
     * @internal
     * Nem2 Library mosaic routes api
     */
    private mosaicRoutesApi: MosaicRoutesApi;

    /**
     * Constructor
     * @param url
     * @param networkHttp
     */
    constructor(url: string, networkHttp?: NetworkHttp) {
        networkHttp = networkHttp == null ? new NetworkHttp(url) : networkHttp;
        super(url, networkHttp);
        this.mosaicRoutesApi = new MosaicRoutesApi(this.apiClient);
    }

    /**
     * Gets the MosaicInfo for a given mosaicId
     * @param mosaicId - Mosaic id
     * @returns Observable<MosaicInfo>
     */
    public getMosaic(mosaicId: MosaicId): Observable<MosaicInfo> {
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(
                this.mosaicRoutesApi.getMosaic(mosaicId.toHex())).pipe(map((mosaicInfoDTO) => {
                return new MosaicInfo(
                    mosaicInfoDTO.meta.active,
                    mosaicInfoDTO.meta.index,
                    mosaicInfoDTO.meta.id,
                    new NamespaceId(mosaicInfoDTO.mosaic.namespaceId),
                    new MosaicId(mosaicInfoDTO.mosaic.mosaicId),
                    new UInt64(mosaicInfoDTO.mosaic.supply),
                    new UInt64(mosaicInfoDTO.mosaic.height),
                    PublicAccount.createFromPublicKey(mosaicInfoDTO.mosaic.owner, networkType),
                    new MosaicProperties(
                        new UInt64(mosaicInfoDTO.mosaic.properties[0]),
                        (new UInt64(mosaicInfoDTO.mosaic.properties[1])).compact(),
                        new UInt64(mosaicInfoDTO.mosaic.properties[2]),
                    ),
                    mosaicInfoDTO.mosaic.levy,
                );
            }))));
    }

    /**
     * Gets MosaicInfo for different mosaicIds.
     * @param mosaicIds - Array of mosaic ids
     * @returns Observable<MosaicInfo[]>
     */
    public getMosaics(mosaicIds: MosaicId[]): Observable<MosaicInfo[]> {
        const mosaicIdsBody = {
            mosaicIds: mosaicIds.map((id) => id.toHex()),
        };
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(
                this.mosaicRoutesApi.getMosaics(mosaicIdsBody)).pipe(map((mosaicInfosDTO) => {
                return mosaicInfosDTO.map((mosaicInfoDTO) => {
                    return new MosaicInfo(
                        mosaicInfoDTO.meta.active,
                        mosaicInfoDTO.meta.index,
                        mosaicInfoDTO.meta.id,
                        new NamespaceId(mosaicInfoDTO.mosaic.namespaceId),
                        new MosaicId(mosaicInfoDTO.mosaic.mosaicId),
                        new UInt64(mosaicInfoDTO.mosaic.supply),
                        new UInt64(mosaicInfoDTO.mosaic.height),
                        PublicAccount.createFromPublicKey(mosaicInfoDTO.mosaic.owner, networkType),
                        new MosaicProperties(
                            new UInt64(mosaicInfoDTO.mosaic.properties[0]),
                            (new UInt64(mosaicInfoDTO.mosaic.properties[1])).compact(),
                            new UInt64(mosaicInfoDTO.mosaic.properties[2]),
                        ),
                        mosaicInfoDTO.mosaic.levy,
                    );
                });
            }))));
    }

    /**
     * Gets array of MosaicInfo from mosaics created with provided namespace
     * @param namespaceId - Namespace id
     * @param queryParams - (Optional) Query params
     * @returns Observable<MosaicInfo[]>
     */
    public getMosaicsFromNamespace(namespaceId: NamespaceId,
                                   queryParams?: QueryParams): Observable<MosaicInfo[]> {
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(
                this.mosaicRoutesApi.getMosaicsFromNamespace(namespaceId.toHex(), queryParams != null ? queryParams : {})).pipe(
                map((mosaicsDefinitionDTO) => {
                    return mosaicsDefinitionDTO.map((mosaicInfoDTO) => {
                        return new MosaicInfo(
                            mosaicInfoDTO.meta.active,
                            mosaicInfoDTO.meta.index,
                            mosaicInfoDTO.meta.id,
                            new NamespaceId(mosaicInfoDTO.mosaic.namespaceId),
                            new MosaicId(mosaicInfoDTO.mosaic.mosaicId),
                            new UInt64(mosaicInfoDTO.mosaic.supply),
                            new UInt64(mosaicInfoDTO.mosaic.height),
                            PublicAccount.createFromPublicKey(mosaicInfoDTO.mosaic.owner, networkType),
                            new MosaicProperties(
                                new UInt64(mosaicInfoDTO.mosaic.properties[0]),
                                (new UInt64(mosaicInfoDTO.mosaic.properties[1])).compact(),
                                new UInt64(mosaicInfoDTO.mosaic.properties[2]),
                            ),
                            mosaicInfoDTO.mosaic.levy,
                        );
                    });
                }))));
    }

    /**
     * Gets array of MosaicName for different mosaicIds
     * @param mosaicIds - Array of mosaic ids
     * @returns Observable<MosaicName[]>
     */
    public getMosaicsName(mosaicIds: MosaicId[]): Observable<MosaicName[]> {
        const mosaicIdsBody = {
            mosaicIds: mosaicIds.map((id) => id.toHex()),
        };
        return observableFrom(this.mosaicRoutesApi.getMosaicsName(mosaicIdsBody)).pipe(map((mosaicInfosDTO) => {
            return mosaicInfosDTO.map((mosaicInfoDTO) => {
                return new MosaicName(
                    new MosaicId(mosaicInfoDTO.mosaicId),
                    new NamespaceId(mosaicInfoDTO.parentId),
                    mosaicInfoDTO.name,
                );
            });
        }));
    }
}
