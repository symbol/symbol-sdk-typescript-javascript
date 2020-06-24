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

import { NodeStatusEnum } from 'symbol-openapi-typescript-fetch-client';

/**
 * The node info structure describes basic information of a node health.
 */
export class NodeHealth {
    /**
     * @param apiNode
     * @param db
     */
    constructor(
        /**
         * The api node status
         */
        public readonly apiNode: NodeStatusEnum,
        /**
         * The database status
         */
        public readonly db: NodeStatusEnum,
    ) {}
}
