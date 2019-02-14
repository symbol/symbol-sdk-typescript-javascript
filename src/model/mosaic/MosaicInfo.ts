/*
 * Copyright 2018 NEM
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

import {PublicAccount} from '../account/PublicAccount';
import {UInt64} from '../UInt64';
import {MosaicId} from './MosaicId';
import {MosaicProperties} from './MosaicProperties';

/**
 * The mosaic info structure describes a mosaic.
 */
export class MosaicInfo {

    /**
     * @param active
     * @param index
     * @param metaId
     * @param nonce
     * @param supply
     * @param height
     * @param owner
     * @param properties
     * @param levy
     */
    constructor(/**
                 * Mosaic is active.
                 */
                public readonly active: boolean,
                /**
                 * The mosaic index.
                 */
                public readonly index: number,
                /**
                 * The meta data id.
                 */
                public readonly metaId: string,
                /**
                 * The mosaic nonce.
                 */
                public readonly mosaicId: MosaicId,
                /**
                 * The mosaic nonce.
                 */
                public readonly nonce: UInt64,
                /**
                 * The mosaic supply.
                 */
                public readonly supply: UInt64,
                /**
                 * The block height were mosaic was created.
                 */
                public readonly height: UInt64,
                /**
                 * The public key of the mosaic creator.
                 */
                public readonly owner: PublicAccount,
                /**
                 * The mosaic properties.
                 */
                private readonly properties: MosaicProperties,
                /**
                 * The optional levy for the mosaic. A creator can demand that each mosaic transfer induces an additional fee.
                 */
                public readonly levy: any) {
    }

    /**
     * Mosaic divisibility
     * @returns {number}
     */
    public get divisibility(): number {
        return this.properties.divisibility;
    }

    /**
     * Mosaic duration
     * @returns {UInt64}
     */
    public get duration(): UInt64 {
        return this.properties.duration;
    }

    /**
     * Is mosaic supply mutable
     * @returns {boolean}
     */
    public isSupplyMutable(): boolean {
        return this.properties.supplyMutable;
    }

    /**
     * Is mosaic transferable
     * @returns {boolean}
     */
    public isTransferable(): boolean {
        return this.properties.transferable;
    }

    /**
     * Is levy mutable
     * @returns {boolean}
     */
    public isLevyMutable(): boolean {
        return this.properties.levyMutable;
    }

}
