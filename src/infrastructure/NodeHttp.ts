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

import { ClientResponse } from 'http';
import {from as observableFrom, Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import { NodeInfo } from '../model/node/NodeInfo';
import { NodeTime } from '../model/node/NodeTime';
import { NodeInfoDTO, NodeRoutesApi, NodeTimeDTO } from './api';
import {Http} from './Http';
import {NodeRepository} from './NodeRepository';

/**
 * Node http repository.
 *
 * @since 1.0
 */
export class NodeHttp extends Http implements NodeRepository {
    /**
     * @internal
     * Nem2 Library account routes api
     */
    private nodeRoutesApi: NodeRoutesApi;

    /**
     * Constructor
     * @param url
     */
    constructor(url: string) {
        super();
        this.nodeRoutesApi = new NodeRoutesApi(url);

    }

    /**
     * Supplies additional information about the application running on a node.
     * @summary Get the node information
     */
    public getNodeInfo(): Observable<NodeInfo> {
        return observableFrom(this.nodeRoutesApi.getNodeInfo()).pipe(
            map((response: { response: ClientResponse; body: NodeInfoDTO; } ) => {
                const nodeInfoDTO = response.body;
                return new NodeInfo(
                    nodeInfoDTO.publicKey,
                    nodeInfoDTO.port,
                    nodeInfoDTO.networkIdentifier,
                    nodeInfoDTO.version,
                    nodeInfoDTO.roles as number,
                    nodeInfoDTO.host,
                    nodeInfoDTO.friendlyName,
                );
            }),
            catchError((error) =>  throwError(this.errorHandling(error))),
        );
    }

    /**
     * Gets the node time at the moment the reply was sent and received.
     * @summary Get the node time
     */
    public getNodeTime(): Observable<NodeTime> {
        return observableFrom(this.nodeRoutesApi.getNodeTime()).pipe(
            map((response: { response: ClientResponse; body: NodeTimeDTO; } ) => {
                const nodeTimeDTO = response.body;
                return new NodeTime(nodeTimeDTO.communicationTimestamps.sendTimestamp,
                                    nodeTimeDTO.communicationTimestamps.receiveTimestamp);
            }),
            catchError((error) =>  throwError(this.errorHandling(error))),
        );
    }
}
