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
import { NetworkType } from '../network/NetworkType';
import { RoleType } from './RoleType';

/**
 * The node info structure describes basic information of a node.
 */
export class NodeInfo {
    /**
     * @param publicKey
     * @param networkGenerationHashSeed
     * @param port
     * @param networkIdentifier
     * @param version
     * @param roles
     * @param host
     * @param friendlyName
     * @param nodePublicKey
     */
    constructor(
        /**
         * The public key used to identify the node.
         */
        public readonly publicKey: string,
        /**
         * The network generation hash seed
         */
        public readonly networkGenerationHashSeed: string,
        /**
         * The port used for the communication.
         */
        public readonly port: number,
        /**
         * The network identifier.
         */
        public readonly networkIdentifier: NetworkType,
        /**
         * The version of the application.
         */
        public readonly version: number,
        /**
         * The roles of the application.
         */
        public readonly roles: RoleType[],
        /**
         * The IP address of the endpoint.
         */
        public readonly host: string,
        /**
         * The name of the node.
         */
        public readonly friendlyName: string,
        /**
         * The node public key used for NodeKeyLink transaction.
         */
        public readonly nodePublicKey?: string,
    ) {}
}
