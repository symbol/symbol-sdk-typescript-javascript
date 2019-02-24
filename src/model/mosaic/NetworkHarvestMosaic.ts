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

import {mosaicId, convert} from 'nem2-library';
import {NamespaceId} from '../namespace/NamespaceId';
import {UInt64} from '../UInt64';
import {Mosaic} from './Mosaic';
import {MosaicId} from './MosaicId';

/**
 * NetworkHarvestMosaic mosaic
 * 
 * This represents the per-network harvest mosaic. This mosaicId is aliased
 * with namespace name `harvest`.
 * 
 * @since 0.10.2
 */
export class NetworkHarvestMosaic extends Mosaic {
    /**
     * Per-Network default mosaic owner public key
     */
    public static OWNER_PUBLIC_KEY = 'B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF';

    /**
     * Per-Network harvestMosaicId
     *
     * @note Mark the little-endianness on nonce field.
     * @type {Id}
     */
    public static MOSAIC_ID = new MosaicId(mosaicId([
        0x1, 0x0,
        0x0, 0x0,
    ], convert.hexToUint8(NetworkHarvestMosaic.OWNER_PUBLIC_KEY)));

    /**
     * Divisiblity
     * @type {number}
     */
    public static DIVISIBILITY = 3;

    /**
     * Initial supply
     * @type {number}
     */
    public static INITIAL_SUPPLY = 15000000;

    /**
     * Is tranferable
     * @type {boolean}
     */
    public static TRANSFERABLE = true;

    /**
     * Is Supply mutable
     * @type {boolean}
     */
    public static SUPPLY_MUTABLE = true;

    /**
     * Is Levy mutable
     * @type {boolean}
     */
    public static LEVY_MUTABLE = false;

    /**
     * constructor
     * @param amount
     */
    private constructor(amount: UInt64) {
        super(NetworkHarvestMosaic.MOSAIC_ID, amount);
    }

    /**
     * Create NetworkHarvestMosaic with using NetworkHarvestMosaic as unit.
     *
     * @param amount
     * @returns {NetworkHarvestMosaic}
     */
    public static createRelative(amount: UInt64 | number) {
        if (typeof amount === 'number') {
            return new NetworkHarvestMosaic(UInt64.fromUint(amount * Math.pow(10, NetworkHarvestMosaic.DIVISIBILITY)));
        }
        return new NetworkHarvestMosaic(UInt64.fromUint((amount as UInt64).compact() * Math.pow(10, NetworkHarvestMosaic.DIVISIBILITY)));
    }

    /**
     * Create NetworkHarvestMosaic with using micro NetworkHarvestMosaic as unit,
     * 1 NetworkHarvestMosaic = 1000000 micro NetworkHarvestMosaic.
     *
     * @param amount
     * @returns {NetworkHarvestMosaic}
     */
    public static createAbsolute(amount: UInt64 | number) {
        if (typeof amount === 'number') {
            return new NetworkHarvestMosaic(UInt64.fromUint(amount));
        }
        return new NetworkHarvestMosaic(amount as UInt64);
    }
}
