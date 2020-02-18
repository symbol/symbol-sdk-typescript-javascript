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
import {NamespaceId} from '../namespace/NamespaceId';
import {UInt64} from '../UInt64';
import {Mosaic} from './Mosaic';
import {MosaicId} from './MosaicId';

/**
 * NetworkHarvestLocal mosaic
 *
 * This represents the per-network harvest mosaic. This mosaicId is aliased
 * with namespace name `cat.harvest`.
 *
 * @since 0.10.2
 */
export class NetworkHarvestLocal extends Mosaic {

    /**
     * namespaceId of `currency` namespace.
     *
     * @type {Id}
     */
    public static NAMESPACE_ID = new NamespaceId('cat.harvest');

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
     * constructor
     * @param owner
     * @param amount
     */
    private constructor(amount: UInt64) {
        super(NetworkHarvestLocal.NAMESPACE_ID, amount);
    }

    /**
     * Create NetworkHarvestLocal with using NetworkHarvestLocal as unit.
     *
     * @param amount
     * @returns {NetworkHarvestLocal}
     */
    public static createRelative(amount: UInt64 | number) {
        if (typeof amount === 'number') {
            return new NetworkHarvestLocal(UInt64.fromUint(amount * Math.pow(10, NetworkHarvestLocal.DIVISIBILITY)));
        }
        return new NetworkHarvestLocal(UInt64.fromUint((amount as UInt64).compact() * Math.pow(10, NetworkHarvestLocal.DIVISIBILITY)));
    }

    /**
     * Create NetworkHarvestLocal with using micro NetworkHarvestLocal as unit,
     * 1 NetworkHarvestLocal = 1000000 micro NetworkHarvestLocal.
     *
     * @param amount
     * @returns {NetworkHarvestLocal}
     */
    public static createAbsolute(amount: UInt64 | number) {
        if (typeof amount === 'number') {
            return new NetworkHarvestLocal(UInt64.fromUint(amount));
        }
        return new NetworkHarvestLocal(amount as UInt64);
    }
}
