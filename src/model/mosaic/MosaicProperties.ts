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

import {UInt64} from '../UInt64';

/**
 * Mosaic properties model
 */
export class MosaicProperties {

    /**
     * The creator can choose between a definition that allows a mosaic supply change at a later point or an immutable supply.
     * Allowed values for the property are "true" and "false". The default value is "false".
     */
    public readonly supplyMutable: boolean;

    /**
     * The creator can choose if the mosaic definition should allow for transfers of the mosaic among accounts other than the creator.
     * If the property 'transferable' is set to "false", only transfer transactions
     * having the creator as sender or as recipient can transfer mosaics of that type.
     * If set to "true" the mosaics can be transferred to and from arbitrary accounts.
     * Allowed values for the property are thus "true" and "false". The default value is "true".
     */
    public readonly transferable: boolean;

    /**
     * Levy mutable
     */
    public readonly levyMutable: boolean;

    /**
     * @param flags
     * @param divisibility
     * @param duration
     */
    constructor(flags: UInt64,
                /**
                 * The divisibility determines up to what decimal place the mosaic can be divided into.
                 * Thus a divisibility of 3 means that a mosaic can be divided into smallest parts of 0.001 mosaics
                 * i.e. milli mosaics is the smallest sub-unit.
                 * When transferring mosaics via a transfer transaction the quantity transferred
                 * is given in multiples of those smallest parts.
                 * The divisibility must be in the range of 0 and 6. The default value is "0".
                 */
                public readonly divisibility: number,
                /**
                 * The duration in blocks a mosaic will be available.
                 * After the duration finishes mosaic is inactive and can be renewed.
                 */
                public readonly duration: UInt64) {
        let binaryFlags = '00' + (flags.lower >>> 0).toString(2);
        binaryFlags = binaryFlags.substr(binaryFlags.length - 3, 3);
        this.supplyMutable = binaryFlags[2] === '1';
        this.transferable = binaryFlags[1] === '1';
        this.levyMutable = binaryFlags[0] === '1';
    }

    /**
     * Static constructor function with default parameters
     * @returns {MosaicProperties}
     * @param params
     */
    public static create(params: {
        supplyMutable: boolean,
        transferable: boolean,
        levyMutable: boolean,
        divisibility: number,
        duration: UInt64,
    }) {
        const flags = (params.supplyMutable ? 1 : 0) + (params.transferable ? 2 : 0) + (params.levyMutable ? 4 : 0);
        return new MosaicProperties(UInt64.fromUint(flags), params.divisibility, params.duration);
    }

    /**
     * Create DTO object
     */
    toDTO() {
        return {
            supplyMutable: this.supplyMutable,
            transferable: this.transferable,
            levyMutable: this.levyMutable,
            divisibility: this.divisibility,
            duration: this.duration.toDTO(),
        };
    }
}
