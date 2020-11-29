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

import { FinalizationPointDto, FinalizedBlockHeaderBuilder } from 'catbuffer-typescript';
import { FinalizationEpochDto } from 'catbuffer-typescript/src/FinalizationEpochDto';
import { FinalizationRoundBuilder } from 'catbuffer-typescript/src/FinalizationRoundBuilder';
import { Hash256Dto } from 'catbuffer-typescript/src/Hash256Dto';
import { HeightDto } from 'catbuffer-typescript/src/HeightDto';
import { Convert } from '../../core/format';
import { UInt64 } from '../UInt64';

/**
 * The finalized block.
 */
export class FinalizedBlock {
    /**
     * @param height Block height
     * @param hash Block hash
     * @param finalizationPoint Block finalization point
     * @param finalizationEpoch Block finalization epoch
     */
    constructor(
        public readonly height: UInt64,
        public readonly hash: string,
        public readonly finalizationPoint: number,
        public readonly finalizationEpoch: number,
    ) {}

    /**
     * Generate buffer
     * @return {Uint8Array}
     */
    public serialize(): Uint8Array {
        const epoch = new FinalizationEpochDto(this.finalizationEpoch);
        const point = new FinalizationPointDto(this.finalizationPoint);
        const round: FinalizationRoundBuilder = new FinalizationRoundBuilder(epoch, point);
        const height: HeightDto = new HeightDto(this.height.toDTO());
        const hash: Hash256Dto = new Hash256Dto(Convert.hexToUint8(this.hash));
        return new FinalizedBlockHeaderBuilder(round, height, hash).serialize();
    }
}
