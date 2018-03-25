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

import {NamespaceId} from '../namespace/NamespaceId';
import {UInt64} from '../UInt64';
import {Mosaic} from './Mosaic';
import {MosaicId} from './MosaicId';

/**
 * XEM mosaic
 */
export class XEM extends Mosaic {
    /**
     * Divisiblity
     * @type {number}
     */
    public static DIVISIBILITY = 6;

    /**
     * Initial supply
     * @type {number}
     */
    public static INITIAL_SUPPLY = 8999999999;

    /**
     * Is tranferable
     * @type {boolean}
     */
    public static TRANSFERABLE = true;

    /**
     * Is mutable
     * @type {boolean}
     */
    public static SUPPLY_MUTABLE = false;

    /**
     * mosaicId
     * @type {Id}
     */
    public static MOSAIC_ID = new MosaicId('nem:xem');

    /**
     * namespaceId
     * @type {Id}
     */
    public static NAMESPACE_ID = new NamespaceId('nem');

    /**
     * constructor
     * @param amount
     */
    private constructor(amount: UInt64) {
        super(XEM.MOSAIC_ID, amount);
    }

    /**
     * Create xem with using xem as unit.
     *
     * @param amount
     * @returns {XEM}
     */
    public static createRelative(amount: UInt64 | number) {
        if (typeof amount === 'number') {
            return new XEM(UInt64.fromUint(amount * Math.pow(10, XEM.DIVISIBILITY)));
        }
        return new XEM(UInt64.fromUint((amount as UInt64).compact() * Math.pow(10, XEM.DIVISIBILITY)));
    }

    /**
     * Create xem with using micro xem as unit, 1 XEM = 1000000 micro XEM.
     *
     * @param amount
     * @returns {XEM}
     */
    public static createAbsolute(amount: UInt64 | number) {
        if (typeof amount === 'number') {
            return new XEM(UInt64.fromUint(amount));
        }
        return new XEM(amount as UInt64);
    }
}
