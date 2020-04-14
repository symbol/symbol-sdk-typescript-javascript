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

import { NamespaceId } from '../namespace/NamespaceId';
import { UInt64 } from '../UInt64';
import { Mosaic } from './Mosaic';
import { MosaicId } from './MosaicId';

/**
 * NetworkCurrencyLocal mosaic for local test network (local bootstrap server)
 *
 * This represents the per-network currency mosaic. This mosaicId is aliased
 * with namespace name `cat.currency`.
 *
 * @since 0.10.2
 */
export class NetworkCurrencyLocal extends Mosaic {
    /**
     * namespaceId of `currency` namespace.
     *
     * @type {Id}
     */
    public static NAMESPACE_ID = new NamespaceId('cat.currency');

    /**
     * Divisiblity
     * @type {number}
     */
    public static DIVISIBILITY = 6;

    /**
     * Initial supply
     * @type {number}
     */
    public static INITIAL_SUPPLY = 8999999998;

    /**
     * Is tranferable
     * @type {boolean}
     */
    public static TRANSFERABLE = true;

    /**
     * Is Supply mutable
     * @type {boolean}
     */
    public static SUPPLY_MUTABLE = false;

    /**
     * constructor
     * @param owner
     * @param amount
     */
    private constructor(amount: UInt64) {
        super(NetworkCurrencyLocal.NAMESPACE_ID, amount);
    }

    /**
     * Create NetworkCurrencyLocal with using NetworkCurrencyLocal as unit.
     *
     * @param amount
     * @returns {NetworkCurrencyLocal}
     */
    public static createRelative(amount: UInt64 | number) {
        if (typeof amount === 'number') {
            return new NetworkCurrencyLocal(UInt64.fromUint(amount * Math.pow(10, NetworkCurrencyLocal.DIVISIBILITY)));
        }
        return new NetworkCurrencyLocal(UInt64.fromUint((amount as UInt64).compact() * Math.pow(10, NetworkCurrencyLocal.DIVISIBILITY)));
    }

    /**
     * Create NetworkCurrencyLocal with using micro NetworkCurrencyLocal as unit,
     * 1 NetworkCurrencyLocal = 1000000 micro NetworkCurrencyLocal.
     *
     * @param amount
     * @returns {NetworkCurrencyLocal}
     */
    public static createAbsolute(amount: UInt64 | number) {
        if (typeof amount === 'number') {
            return new NetworkCurrencyLocal(UInt64.fromUint(amount));
        }
        return new NetworkCurrencyLocal(amount as UInt64);
    }
}
