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

import { ClientResponse } from 'http';
import {from as observableFrom, Observable, throwError} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {PublicAccount} from '../model/account/PublicAccount';
import {MosaicId} from '../model/mosaic/MosaicId';
import {MosaicInfo} from '../model/mosaic/MosaicInfo';
import { MosaicNames } from '../model/mosaic/MosaicNames';
import {MosaicProperties} from '../model/mosaic/MosaicProperties';
import { MosaicPropertyType } from '../model/mosaic/MosaicPropertyType';
import {NamespaceId} from '../model/namespace/NamespaceId';
import { NamespaceName } from '../model/namespace/NamespaceName';
import {UInt64} from '../model/UInt64';
import { MosaicInfoDTO, MosaicNamesDTO, MosaicRoutesApi, MosaicsNamesDTO } from './api';
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
        super(networkHttp);
        this.mosaicRoutesApi = new MosaicRoutesApi(url);
    }

    /**
     * Gets the MosaicInfo for a given mosaicId
     * @param mosaicId - Mosaic id
     * @returns Observable<MosaicInfo>
     */
    public getMosaic(mosaicId: MosaicId): Observable<MosaicInfo> {
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(
                this.mosaicRoutesApi.getMosaic(mosaicId.toHex())).pipe(
                    map((response: { response: ClientResponse; body: MosaicInfoDTO; } ) => {
                        const mosaicInfoDTO = response.body;
                        let mosaicFlag;
                        let divisibility;
                        let duration;
                        if (mosaicInfoDTO.mosaic.properties.flags) {
                            mosaicFlag = mosaicInfoDTO.mosaic.properties.flags;
                        }
                        if (mosaicInfoDTO.mosaic.properties.divisibility) {
                            divisibility = mosaicInfoDTO.mosaic.properties.divisibility;
                        }
                        if (mosaicInfoDTO.mosaic.properties.duration) {
                            duration = mosaicInfoDTO.mosaic.properties.duration;
                        }
                        return new MosaicInfo(
                            new MosaicId(mosaicInfoDTO.mosaic.id),
                            UInt64.fromNumericString(mosaicInfoDTO.mosaic.supply),
                            UInt64.fromNumericString(mosaicInfoDTO.mosaic.startHeight),
                            PublicAccount.createFromPublicKey(mosaicInfoDTO.mosaic.ownerPublicKey, networkType),
                            mosaicInfoDTO.mosaic.revision,
                            new MosaicProperties(
                                mosaicFlag ? UInt64.fromUint(mosaicFlag) : UInt64.fromUint(0),
                                (divisibility ? divisibility : 0),
                                duration ? UInt64.fromNumericString(duration) : undefined,
                            ),
                    );
                }),
                catchError((error) =>  throwError(this.errorHandling(error))),
            )),
        );
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
                this.mosaicRoutesApi.getMosaics(mosaicIdsBody)).pipe(
                    map((response: { response: ClientResponse; body: MosaicInfoDTO[]; }) => {
                        const mosaicInfosDTO = response.body;
                        return mosaicInfosDTO.map((mosaicInfoDTO) => {
                            let mosaicFlag;
                            let divisibility;
                            let duration;
                            if (mosaicInfoDTO.mosaic.properties.flags) {
                                mosaicFlag = mosaicInfoDTO.mosaic.properties.flags;
                            }
                            if (mosaicInfoDTO.mosaic.properties.divisibility) {
                                divisibility = mosaicInfoDTO.mosaic.properties.divisibility;
                            }
                            if (mosaicInfoDTO.mosaic.properties.duration) {
                                duration = mosaicInfoDTO.mosaic.properties.duration;
                            }
                            return new MosaicInfo(
                                new MosaicId(mosaicInfoDTO.mosaic.id),
                                UInt64.fromNumericString(mosaicInfoDTO.mosaic.supply),
                                UInt64.fromNumericString(mosaicInfoDTO.mosaic.startHeight),
                                PublicAccount.createFromPublicKey(mosaicInfoDTO.mosaic.ownerPublicKey, networkType),
                                mosaicInfoDTO.mosaic.revision,
                                new MosaicProperties(
                                    mosaicFlag ? UInt64.fromUint(mosaicFlag) : UInt64.fromUint(0),
                                    (divisibility ? divisibility : 0),
                                    duration ? UInt64.fromNumericString(duration) : undefined,
                                ),
                            );
                        });
                    }),
                    catchError((error) =>  throwError(this.errorHandling(error))),
                ),
            ),
        );
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
        return observableFrom(
            this.mosaicRoutesApi.getMosaicsNames(mosaicIdsBody)).pipe(
                map((response: { response: ClientResponse; body: MosaicsNamesDTO; }) => {
                    const mosaics = response.body;
                    return mosaics.mosaicNames.map((mosaic) => {
                        return new MosaicNames(
                            new MosaicId(mosaic.mosaicId),
                            mosaic.names.map((name) => {
                            return new NamespaceName(new NamespaceId(name), name);
                            }),
                        );
                    });
                }),
                catchError((error) =>  throwError(this.errorHandling(error))),
            );
    }
}
