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

import { from as observableFrom, Observable, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { MosaicRoutesApi } from 'symbol-openapi-typescript-node-client';
import { Address } from '../model/account/Address';
import { PublicAccount } from '../model/account/PublicAccount';
import { MosaicFlags } from '../model/mosaic/MosaicFlags';
import { MosaicId } from '../model/mosaic/MosaicId';
import { MosaicInfo } from '../model/mosaic/MosaicInfo';
import { NetworkType } from '../model/network/NetworkType';
import { UInt64 } from '../model/UInt64';
import { Http } from './Http';
import { MosaicRepository } from './MosaicRepository';

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
            mergeMap((networkType) => observableFrom(
                this.mosaicRoutesApi.getMosaic(mosaicId.toHex())).pipe(
                    map(({body}) => new MosaicInfo(
                        new MosaicId(body.mosaic.id),
                        UInt64.fromNumericString(body.mosaic.supply),
                        UInt64.fromNumericString(body.mosaic.startHeight),
                        PublicAccount.createFromPublicKey(body.mosaic.ownerPublicKey, networkType),
                        body.mosaic.revision,
                        new MosaicFlags(body.mosaic.flags),
                        body.mosaic.divisibility,
                        UInt64.fromNumericString(body.mosaic.duration),
                )),
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
        return this.networkTypeObservable.pipe(
            mergeMap((networkType) => observableFrom(
                this.mosaicRoutesApi.getMosaics(mosaicIdsBody)).pipe(
                    map(({body}) => body.map((mosaicInfoDTO) => {
                        return new MosaicInfo(
                            new MosaicId(mosaicInfoDTO.mosaic.id),
                            UInt64.fromNumericString(mosaicInfoDTO.mosaic.supply),
                            UInt64.fromNumericString(mosaicInfoDTO.mosaic.startHeight),
                            PublicAccount.createFromPublicKey(mosaicInfoDTO.mosaic.ownerPublicKey, networkType),
                            mosaicInfoDTO.mosaic.revision,
                            new MosaicFlags(mosaicInfoDTO.mosaic.flags),
                            mosaicInfoDTO.mosaic.divisibility,
                            UInt64.fromNumericString(mosaicInfoDTO.mosaic.duration),
                        );
                    })),
                    catchError((error) =>  throwError(this.errorHandling(error))),
                ),
            ),
        );
    }

    /**
     * Gets an array of mosaics created for a given account address.
     * @summary Get mosaics created by an account
     * @param address Account address.
     */
    public getMosaicsFromAccount(address: Address): Observable<MosaicInfo[]> {
        return this.networkTypeObservable.pipe(
            mergeMap((networkType) => observableFrom(
                this.mosaicRoutesApi.getMosaicsFromAccount(address.plain())).pipe(
                    map(({body}) => body.mosaics.map((mosaicInfo) =>
                        new MosaicInfo(
                            new MosaicId(mosaicInfo.id),
                            UInt64.fromNumericString(mosaicInfo.supply),
                            UInt64.fromNumericString(mosaicInfo.startHeight),
                            PublicAccount.createFromPublicKey(mosaicInfo.ownerPublicKey, networkType),
                            mosaicInfo.revision,
                            new MosaicFlags(mosaicInfo.flags),
                            mosaicInfo.divisibility,
                            UInt64.fromNumericString(mosaicInfo.duration)))),
                catchError((error) =>  throwError(this.errorHandling(error))),
            )),
        );
    }

    /**
     * Gets mosaics created for a given array of addresses.
     * @summary Get mosaics created for given array of addresses
     * @param addresses Array of addresses
     */
    public getMosaicsFromAccounts(addresses: Address[]): Observable<MosaicInfo[]> {
        const accountIdsBody = {
            addresses: addresses.map((address) => address.plain()),
        };
        return this.networkTypeObservable.pipe(
            mergeMap((networkType) => observableFrom(
                this.mosaicRoutesApi.getMosaicsFromAccounts(accountIdsBody)).pipe(
                    map(({body}) => body.mosaics.map((mosaicInfoDTO) => {
                        return new MosaicInfo(
                            new MosaicId(mosaicInfoDTO.id),
                            UInt64.fromNumericString(mosaicInfoDTO.supply),
                            UInt64.fromNumericString(mosaicInfoDTO.startHeight),
                            PublicAccount.createFromPublicKey(mosaicInfoDTO.ownerPublicKey, networkType),
                            mosaicInfoDTO.revision,
                            new MosaicFlags(mosaicInfoDTO.flags),
                            mosaicInfoDTO.divisibility,
                            UInt64.fromNumericString(mosaicInfoDTO.duration),
                        );
                    })),
                    catchError((error) =>  throwError(this.errorHandling(error))),
                ),
            ),
        );
    }
}
