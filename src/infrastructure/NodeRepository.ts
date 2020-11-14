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

import { Observable } from 'rxjs';
import { StorageInfo } from '../model/blockchain/StorageInfo';
import { NodeHealth } from '../model/node/NodeHealth';
import { NodeInfo } from '../model/node/NodeInfo';
import { NodeTime } from '../model/node/NodeTime';
import { ServerInfo } from '../model/node/ServerInfo';

/**
 * Node interface repository.
 *
 * @since 1.0
 */
export interface NodeRepository {
    /**
     * Supplies additional information about the application running on a node.
     * @summary Get the node information
     */
    getNodeInfo(): Observable<NodeInfo>;

    /**
     * Gets the list of peers visible by the node,
     * @summary Gets the list of peers visible by the node
     */
    getNodePeers(): Observable<NodeInfo[]>;

    /**
     * Gets the node time at the moment the reply was sent and received.
     * @summary Get the node time
     */
    getNodeTime(): Observable<NodeTime>;

    /**
     * Get node health information
     *
     * @return {@link NodeHealth} of NodeHealth
     */
    getNodeHealth(): Observable<NodeHealth>;

    /**
     * Gets blockchain storage info.
     * @param hostName Peer node host name.
     * @returns Observable<StorageInfo>
     */
    getStorageInfo(): Observable<StorageInfo>;

    /**
     * Gets blockchain server info.
     * @returns Observable<Server>
     */
    getServerInfo(): Observable<ServerInfo>;

    /**
     * Return unlocked harvesting account from node.
     * @returns Observable<string[]>
     */
    getUnlockedAccount(): Observable<string[]>;
}
