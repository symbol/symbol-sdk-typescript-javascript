/*
 * Copyright 2020 NEM
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

import { NetworkCurrencies } from '../model/mosaic/NetworkCurrencies';
import { NetworkType } from '../model/network/NetworkType';

export interface RepositoryFactoryConfig {
    /**
     * optional network type if you don't want to load it from the server.
     */
    networkType?: NetworkType;
    /**
     * optional node generation hash if you don't want to load it from the server.
     */
    generationHash?: string;
    /**
     * optional websocket url. If not provided, Default: Rest-Gateway url with ''/ws'' suffix (e.g. http://localhost:3000/ws).
     */
    websocketUrl?: string;
    /**
     * optional injected websocket instance when using listeners in client.
     */
    websocketInjected?: any;

    /**
     * optional fetch function to be used when performing rest requests. The default value is:
     *  1) window.fetch if running on a browser
     *  2) or node-fetch if running on server (window.fetch not found)
     */
    fetchApi?: any;

    /**
     * The nemesis block creation epoch
     */
    epochAdjustment?: number;

    /**
     * The preconfigured symbol network currencies for offline access. They are loaded from server by default if not provided.
     */
    networkCurrencies?: NetworkCurrencies;

    /**
     * The node public key used for NodeKeyLink transaction in delegated harvesting.
     */
    nodePublicKey?: string;
}
