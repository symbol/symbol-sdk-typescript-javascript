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

import { from as observableFrom, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NetworkType } from '../model/blockchain/NetworkType';
import { NodeInfo } from '../model/node/NodeInfo';
import { Http } from './Http';
import { NetworkRepository } from './NetworkRepository';
import { NetworkRoutesApi, NetworkTypeNameEnum } from "nem2-sdk-openapi-typescript-node-client";
import { NetworkTypeDTO } from "nem2-sdk-openapi-typescript-node-client/model/networkTypeDTO";

/**
 * Network http repository.
 *
 * @since 1.0
 */
export class NetworkHttp extends Http implements NetworkRepository {
    /**
     * @internal
     * Nem2 Library network routes api
     */
    private networkRoutesApi: NetworkRoutesApi;

    /**
     * Constructor
     * @param url
     */
    constructor(url: string) {
        super();
        this.networkRoutesApi = new NetworkRoutesApi(url);

    }

    /**
     * Get current network type.
     *
     * @return network type enum.
     */
    public getNetworkType(): Observable<NetworkType> {
        return observableFrom(this.networkRoutesApi.getNetworkType()).pipe(
            map((({body}) => {
                    switch (body.name) {
                        case NetworkTypeNameEnum.Mijin:
                            return NetworkType.MIJIN;
                        case NetworkTypeNameEnum.MijinTest:
                            return NetworkType.MIJIN_TEST;
                        case NetworkTypeNameEnum.Public:
                            return NetworkType.MAIN_NET;
                        case NetworkTypeNameEnum.PublicTest:
                            return NetworkType.TEST_NET;
                        default:
                            throw new Error(`Unknown NetworkType with name ${body.name}`);
                    }
                }),
                catchError((error) => throwError(this.errorHandling(error)))),
        );
    }
}
