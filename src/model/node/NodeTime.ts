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
import { UInt64 } from '../UInt64';

/**
 * The node info structure describes basic information of a node.
 */
export class NodeTime {
    /**
     * @param sendTimeStamp
     * @param receiveTimeStamp
     */
    constructor(
        /**
         * The request send timestamp
         */
        public readonly sendTimeStamp?: UInt64,
        /**
         * The request received timestamp
         */
        public readonly receiveTimeStamp?: UInt64,
    ) {}
}
