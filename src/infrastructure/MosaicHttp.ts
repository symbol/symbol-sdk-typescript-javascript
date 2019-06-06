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

import {from as observableFrom, Observable} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';
import {PublicAccount} from '../model/account/PublicAccount';
import {MosaicId} from '../model/mosaic/MosaicId';
import {MosaicInfo} from '../model/mosaic/MosaicInfo';
import { MosaicNames } from '../model/mosaic/MosaicNames';
import {MosaicProperties} from '../model/mosaic/MosaicProperties';
import { MosaicPropertyType } from '../model/mosaic/MosaicPropertyType';
import {NamespaceId} from '../model/namespace/NamespaceId';
import { NamespaceName } from '../model/namespace/NamespaceName';
import {UInt64} from '../model/UInt64';
import {Http} from './Http';
import {MosaicRepository} from './MosaicRepository';
import {NetworkHttp} from './NetworkHttp';

/**
 * Mosaic http repository.
 *
 * @since 1.0
 */
export class MosaicHttp extends Http implements MosaicRepository {

    /**
     * Constructor
     * @param url
     * @param networkHttp
     */
    constructor(url: string, networkHttp?: NetworkHttp) {
        networkHttp = networkHttp == null ? new NetworkHttp(url) : networkHttp;
        super(url, networkHttp);
    }

    /**
     * Gets the MosaicInfo for a given mosaicId
     * @param mosaicId - Mosaic id
     * @returns Observable<MosaicInfo>
     */
    public getMosaic(mosaicId: MosaicId): Observable<MosaicInfo> {
        const postBody = null;

        // verify the required parameter 'mosaicId' is set
        if (mosaicId === undefined || mosaicId === null) {
            throw new Error('Missing the required parameter \'mosaicId\' when calling getMosaic');
        }

        const pathParams = {
            mosaicId: mosaicId.toHex(),
        };
        const queryParams = {
        };
        const headerParams = {
        };
        const formParams = {
        };

        const authNames = [];
        const contentTypes = [];
        const accepts = ['application/json'];

        const response = this.apiClient.callApi(
            '/mosaic/{mosaicId}', 'GET',
            pathParams, queryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts);
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(response).pipe(map((mosaicInfoDTO: any) => {
                return new MosaicInfo(
                    mosaicInfoDTO.meta.id,
                    new MosaicId(mosaicInfoDTO.mosaic.mosaicId),
                    new UInt64(mosaicInfoDTO.mosaic.supply),
                    new UInt64(mosaicInfoDTO.mosaic.height),
                    PublicAccount.createFromPublicKey(mosaicInfoDTO.mosaic.owner, networkType),
                    mosaicInfoDTO.mosaic.revision,
                    new MosaicProperties(
                        new UInt64(mosaicInfoDTO.mosaic.properties[MosaicPropertyType.MosaicFlags].value),
                        (new UInt64(mosaicInfoDTO.mosaic.properties[MosaicPropertyType.Divisibility].value)).compact(),
                        new UInt64(mosaicInfoDTO.mosaic.properties[MosaicPropertyType.Duration].value),
                    ),
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
        const postBody = mosaicIdsBody;

        // verify the required parameter 'mosaicIds' is set
        if (mosaicIdsBody === undefined || mosaicIdsBody === null) {
            throw new Error('Missing the required parameter \'mosaicIds\' when calling getMosaics');
        }

        const pathParams = {
        };
        const queryParams = {
        };
        const headerParams = {
        };
        const formParams = {
        };

        const authNames = [];
        const contentTypes = [];
        const accepts = ['application/json'];

        const response = this.apiClient.callApi(
            '/mosaic', 'POST',
            pathParams, queryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts);
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(response).pipe(map((mosaicInfosDTO: any) => {
                return mosaicInfosDTO.map((mosaicInfoDTO) => {
                    return new MosaicInfo(
                        mosaicInfoDTO.meta.id,
                        new MosaicId(mosaicInfoDTO.mosaic.mosaicId),
                        new UInt64(mosaicInfoDTO.mosaic.supply),
                        new UInt64(mosaicInfoDTO.mosaic.height),
                        PublicAccount.createFromPublicKey(mosaicInfoDTO.mosaic.owner, networkType),
                        mosaicInfoDTO.mosaic.revision,
                        new MosaicProperties(
                            new UInt64(mosaicInfoDTO.mosaic.properties[MosaicPropertyType.MosaicFlags].value),
                            (new UInt64(mosaicInfoDTO.mosaic.properties[MosaicPropertyType.Divisibility].value)).compact(),
                            new UInt64(mosaicInfoDTO.mosaic.properties[MosaicPropertyType.Duration].value),
                        ),
                    );
                });
            }))));
    }

    /**
     * Get readable names for a set of mosaics
     * Returns friendly names for mosaics.
     * @param mosaicIds - Array of mosaic ids
     * @return Observable<MosaicNames[]>
     */
    public getMosaicsNames(mosaicIds: MosaicId[]): Observable<MosaicNames[]> {
        const mosaicIdsBody = {
            mosaicIds: mosaicIds.map((id) => id.toHex()),
        };
        const postBody = mosaicIdsBody;

        // verify the required parameter 'mosaicIds' is set
        if (mosaicIdsBody === undefined || mosaicIdsBody === null) {
            throw new Error('Missing the required parameter \'mosaicIds\' when calling getMosaicsNames');
        }

        const pathParams = {
        };
        const queryParams = {
        };
        const headerParams = {
        };
        const formParams = {
        };

        const authNames = [];
        const contentTypes = [];
        const accepts = ['application/json'];

        const response = this.apiClient.callApi(
            '/mosaic/names', 'POST',
            pathParams, queryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts);
        return observableFrom(response).pipe(map((mosaics: any) => {
            return mosaics.map((mosaic) => {
                return new MosaicNames(
                    new MosaicId(mosaic.mosaicId),
                    mosaic.names.map((name) => {
                        new NamespaceName(new NamespaceId(name), name);
                    }),
                );
            });
        }));
    }
}
