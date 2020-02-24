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
import { catchError, map } from 'rxjs/operators';
import { NodeRoutesApi } from 'symbol-openapi-typescript-node-client';
import { StorageInfo } from '../model/blockchain/StorageInfo';
import { NodeHealth } from '../model/node/NodeHealth';
import { NodeInfo } from '../model/node/NodeInfo';
import { NodeTime } from '../model/node/NodeTime';
import { ServerInfo } from '../model/node/ServerInfo';
import { UInt64 } from '../model/UInt64';
import { Http } from './Http';
import { NodeRepository } from './NodeRepository';

/**
 * Node http repository.
 *
 * @since 1.0
 */
export class NodeHttp extends Http implements NodeRepository {
    /**
     * @internal
     * Symbol openapi typescript-node client account routes api
     */
    private nodeRoutesApi: NodeRoutesApi;

    /**
     * Constructor
     * @param url
     */
    constructor(url: string) {
        super(url);
        this.nodeRoutesApi = new NodeRoutesApi(url);

    }

    /**
     * Supplies additional information about the application running on a node.
     * @summary Get the node information
     */
    public getNodeInfo(): Observable<NodeInfo> {
        return observableFrom(this.nodeRoutesApi.getNodeInfo()).pipe(
            map(({body}) => new NodeInfo(
                body.publicKey,
                body.networkGenerationHash,
                body.port,
                body.networkIdentifier,
                body.version,
                body.roles as number,
                body.host,
                body.friendlyName,
            )),
            catchError((error) =>  throwError(this.errorHandling(error))),
        );
    }

    /**
     * Gets the node time at the moment the reply was sent and received.
     * @summary Get the node time
     */
    public getNodeTime(): Observable<NodeTime> {
        return observableFrom(this.nodeRoutesApi.getNodeTime()).pipe(
            map(({body}) => {
                const nodeTimeDTO = body;
                if (nodeTimeDTO.communicationTimestamps.sendTimestamp && nodeTimeDTO.communicationTimestamps.receiveTimestamp) {
                    return new NodeTime(UInt64.fromNumericString(nodeTimeDTO.communicationTimestamps.sendTimestamp).toDTO(),
                                    UInt64.fromNumericString(nodeTimeDTO.communicationTimestamps.receiveTimestamp).toDTO());
                }
                throw Error ('Node time not available');
            }),
            catchError((error) =>  throwError(this.errorHandling(error))),
        );
    }

    /**
     * Gets blockchain storage info.
     * @returns Observable<BlockchainStorageInfo>
     */
    public getStorageInfo(): Observable<StorageInfo> {
        return observableFrom(
            this.nodeRoutesApi.getNodeStorage()).pipe(
                map(({body}) => new StorageInfo(
                        body.numBlocks,
                        body.numTransactions,
                        body.numAccounts,
                    )),
                catchError((error) =>  throwError(this.errorHandling(error))),
        );
    }

    /**
     * Gets blockchain server info.
     * @returns Observable<Server>
     */
    public getServerInfo(): Observable<ServerInfo> {
        return observableFrom(
            this.nodeRoutesApi.getServerInfo()).pipe(
                map(({body}) => new ServerInfo(body.serverInfo.restVersion, body.serverInfo.sdkVersion)),
                catchError((error) =>  throwError(this.errorHandling(error))),
        );
    }

    /**
     * Gets blockchain server info.
     * @returns Observable<Server>
     */
    public getNodeHealth(): Observable<NodeHealth> {
        return observableFrom(
            this.nodeRoutesApi.getNodeHealth()).pipe(
                map(({body}) => new NodeHealth(body.status.apiNode, body.status.db)),
                catchError((error) =>  throwError(this.errorHandling(error))),
        );
    }
}
