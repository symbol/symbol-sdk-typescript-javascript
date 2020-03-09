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

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NetworkRoutesApi } from 'symbol-openapi-typescript-node-client';
import { NetworkFees } from '../model/network/NetworkFees';
import { NetworkName } from '../model/network/NetworkName';
import { NetworkType } from '../model/network/NetworkType';
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
    private readonly nodeHttp: NodeHttp;
    private readonly networkRoutesApi: NetworkRoutesApi;

    /**
     * Constructor
     * @param url
     */
    constructor(url: string) {
        super(url);
        this.nodeHttp = new NodeHttp(url);
        this.networkRoutesApi = new NetworkRoutesApi(url);

    }

    /**
     * Get current network identifier.
     *
     * @return network identifier.
     */
    public getNetworkType(): Observable<NetworkType> {
        return this.nodeHttp.getNodeInfo().pipe(map((nodeInfo: NodeInfo) => nodeInfo.networkIdentifier));
    }

    /**
     * Get current network type name and description
     *
     * @return current network type name and description
     */
    public getNetworkName(): Observable<NetworkName> {
        return this.call(this.networkRoutesApi.getNetworkType(), (body) => new NetworkName(body.name, body.description));
    }

    /**
     * Returns information about the average, median, highest and lower fee multiplier over the last
     * \"numBlocksTransactionFeeStats\". The setting \"numBlocksTransactionFeeStats\" is adjustable
     * via a configuration file (rest/resources/rest.json) per REST instance.
     * @summary Get transaction fees information
     */
    public getNetworkFees(): Observable<NetworkFees> {
        return this.call(this.networkRoutesApi.getNetworkFees(), (body) =>
            new NetworkFees(body.averageFeeMultiplier, body.medianFeeMultiplier, body.highestFeeMultiplier, body.lowestFeeMultiplier));
    }
}
