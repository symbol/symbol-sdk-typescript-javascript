/*
 * Copyright 2020 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License"),
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
import { MessageGroup } from './MessageGroup';

/**
 * Finalization proof
 */
export class FinalizationProof {
    constructor(
        /**
         * Version.
         */
        public readonly version: number,
        /**
         * Finalization epoch.
         */
        public readonly finalizationEpoch: number,
        /**
         * Finalization point.
         */
        public readonly finalizationPoint: number,
        /**
         * Finalization height.
         */
        public readonly height: UInt64,
        /**
         * Hash.
         */
        public readonly hash: string,
        /**
         * Message groups.
         */
        public readonly messageGroups: MessageGroup[],
    ) {}
}
