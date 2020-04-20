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

/**
 * Mosaic flags model
 */
export class MosaicFlags {
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
     * Not all the mosaics of a given network will be subject to mosaic restrictions. The feature will only affect
     * those to which the issuer adds the "restrictable" property explicitly at the moment of its creation. This
     * property appears disabled by default, as it is undesirable for autonomous tokens like the public network currency.
     */
    public readonly restrictable: boolean;
    /**
     * @param flags
     * @param divisibility
     * @param duration
     */
    constructor(flags: number) {
        let binaryFlags = '00' + (flags >>> 0).toString(2);
        binaryFlags = binaryFlags.substr(binaryFlags.length - 3, 3);
        this.supplyMutable = binaryFlags[2] === '1';
        this.transferable = binaryFlags[1] === '1';
        this.restrictable = binaryFlags[0] === '1';
    }

    /**
     * Static constructor function with default parameters
     * @returns {MosaicFlags}
     * @param supplyMutable
     * @param transferable
     * @param restrictable
     */
    public static create(supplyMutable: boolean, transferable: boolean, restrictable = false): MosaicFlags {
        const flags = (supplyMutable ? 1 : 0) + (transferable ? 2 : 0) + (restrictable ? 4 : 0);
        return new MosaicFlags(flags);
    }

    /**
     * Get mosaic flag value in number
     * @returns {number}
     */
    public getValue(): number {
        return (this.supplyMutable ? 1 : 0) + (this.transferable ? 2 : 0) + (this.restrictable ? 4 : 0);
    }

    /**
     * Create DTO object
     */
    toDTO(): any {
        return {
            flags: this.getValue(),
        };
    }
}
