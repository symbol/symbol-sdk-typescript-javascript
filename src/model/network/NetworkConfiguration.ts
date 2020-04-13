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

import { ChainProperties } from './ChainProperties';
import { NetworkProperties } from './NetworkProperties';
import { PluginProperties } from './PluginProperties';

/**
 * Network Configuration
 */
export class NetworkConfiguration {
    /**
     * @param network - Network related configuration properties.
     * @param chain - Chain related configuration properties.
     * @param plugins - Plugin related configuration properties.
     */
    constructor(
        public readonly network: NetworkProperties,
        public readonly chain: ChainProperties,
        public readonly plugins: PluginProperties,
    ) {}
}
