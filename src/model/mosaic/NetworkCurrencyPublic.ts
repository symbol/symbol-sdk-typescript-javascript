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
import { Mosaic } from './Mosaic';
import { MosaicId } from './MosaicId';

/**
 * NetworkCurrencyPublic mosaic for public / Public_test network
 *
 * This represents the per-network currency mosaic. This mosaicId is aliased
 * with namespace name `symbol.xym`.
 *
 * @since 0.10.2
 */
export class NetworkCurrencyPublic extends Mosaic {
    /**
     * namespaceId of `currency` namespace.
     *
     * @type {Id}
     */
    public static NAMESPACE_ID = new NamespaceId('symbol.xym');

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
    private constructor(amount: bigint) {
        super(NetworkCurrencyPublic.NAMESPACE_ID, amount);
    }

    /**
     * Create NetworkCurrencyPublic with using NetworkCurrencyPublic as unit.
     *
     * @param amount
     * @returns {NetworkCurrencyPublic}
     */
    public static createRelative(amount: bigint | number) {
        if (typeof amount === 'number') {
            return new NetworkCurrencyPublic(BigInt(amount * Math.pow(10, NetworkCurrencyPublic.DIVISIBILITY)));
        }
        return new NetworkCurrencyPublic(BigInt(Number(amount) * Math.pow(10, NetworkCurrencyPublic.DIVISIBILITY)));
    }

    /**
     * Create NetworkCurrencyPublic with using micro NetworkCurrencyPublic as unit,
     * 1 NetworkCurrencyPublic = 1000000 micro NetworkCurrencyPublic.
     *
     * @param amount
     * @returns {NetworkCurrencyPublic}
     */
    public static createAbsolute(amount: bigint | number) {
        if (typeof amount === 'number') {
            return new NetworkCurrencyPublic(BigInt(amount));
        }
        return new NetworkCurrencyPublic(amount);
    }
}
