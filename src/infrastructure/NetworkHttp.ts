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
import { Http } from './Http';
import { NetworkRepository } from './NetworkRepository';
import { NetworkRoutesApi, NodeRoutesApi } from "nem2-sdk-openapi-typescript-node-client";
import { NetworkInfo } from "../model/blockchain/NetworkInfo";

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
     * @internal
     * Nem2 Library node routes api
     */
    private nodeRoutesApi: NodeRoutesApi;

    /**
     * Constructor
     * @param url
     */
    constructor(url: string) {
        super();
        this.networkRoutesApi = new NetworkRoutesApi(url);
        this.nodeRoutesApi = new NodeRoutesApi(url);

    }

    /**
     * Get current network type.
     *
     * @return network type enum.
     */
    public getNetworkType(): Observable<NetworkType> {
        return observableFrom(this.nodeRoutesApi.getNodeInfo()).pipe(
            map((({body}) => body.networkIdentifier),
                catchError((error) => throwError(this.errorHandling(error)))),
        );
    }

    /**
     * Get network info
     *
     * @return network type enum.
     */
    public getNetworkInfo(): Observable<NetworkInfo> {
        return observableFrom(this.networkRoutesApi.getNetworkType()).pipe(
            map((({body}) => new NetworkInfo(body.name, body.description)),
                catchError((error) => throwError(this.errorHandling(error)))),
        );
    }
}
