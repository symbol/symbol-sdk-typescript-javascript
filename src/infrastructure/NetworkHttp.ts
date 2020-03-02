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
import { NetworkRoutesApi, NodeRoutesApi } from 'symbol-openapi-typescript-node-client';
import { NetworkFees } from '../model/blockchain/NetworkFees';
import { NetworkName } from '../model/blockchain/NetworkName';
import { NetworkType } from '../model/blockchain/NetworkType';
import { NodeInfo } from '../model/node/NodeInfo';
import { Http } from './Http';
import { NetworkRepository } from './NetworkRepository';
import { NodeHttp } from './NodeHttp';

/**
 * Network http repository.
 *
 * @since 1.0
 */
export class NetworkHttp extends Http implements NetworkRepository {
    /**
     * @internal
     * Symbol openapi typescript-node client account routes api
     */
    private nodeHttp: NodeHttp;

    /**
     * Constructor
     * @param url symbol server url.
     * @param nodeRoutesApi the rest api node client. Parameter provided only when unit testing.
     * @param networkRouteApi the rest api network client. Parameter provided only when unit testing.
     */
    constructor(url: string, nodeRoutesApi = new NodeRoutesApi(url), private readonly networkRouteApi = new NetworkRoutesApi(url)) {
        super(url);
        this.nodeHttp = new NodeHttp(url, nodeRoutesApi);

    }

    /**
     * Get current network identifier.
     *
     * @return network identifier.
     */
    public getNetworkType(): Observable<NetworkType> {
        return observableFrom(this.nodeHttp.getNodeInfo()).pipe(
            map(((nodeInfo: NodeInfo) => nodeInfo.networkIdentifier),
            catchError((error) =>  throwError(this.errorHandling(error)))),
        );
    }

    /**
     * Get current network type name and description
     *
     * @return current network type name and description
     */
    public getNetworkName(): Observable<NetworkName> {
        return observableFrom(this.networkRouteApi.getNetworkType()).pipe(
            map((({body}) => new NetworkName(body.name, body.description))),
            catchError((error) =>  throwError(this.errorHandling(error))),
        );
    }

    /**
     * Returns information about the average, median, highest and lower fee multiplier over the last
     * \"numBlocksTransactionFeeStats\". The setting \"numBlocksTransactionFeeStats\" is adjustable
     * via a configuration file (rest/resources/rest.json) per REST instance.
     * @summary Get transaction fees information
     */
    public getNetworkFees(): Observable<NetworkFees> {
        return observableFrom(this.networkRouteApi.getNetworkFees()).pipe(
            map((({body}) =>
                new NetworkFees(body.averageFeeMultiplier, body.medianFeeMultiplier, body.highestFeeMultiplier, body.lowestFeeMultiplier))),
            catchError((error) =>  throwError(this.errorHandling(error))),
        );
    }
}
