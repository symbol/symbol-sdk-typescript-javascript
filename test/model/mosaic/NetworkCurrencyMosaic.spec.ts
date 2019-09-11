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

import {deepEqual} from 'assert';
import {expect} from 'chai';
import {NetworkCurrencyMosaic} from '../../../src/model/mosaic/NetworkCurrencyMosaic';
import {NamespaceId} from '../../../src/model/namespace/NamespaceId';
import { UInt64 } from '../../../src/model/UInt64';

describe('NetworkCurrencyMosaic', () => {

    it('should createComplete an NetworkCurrencyMosaic object', () => {

        const currency = NetworkCurrencyMosaic.createRelative(1000);

        deepEqual(currency.id.id.toHex(), '85BBEA6CC462B244'); // holds NAMESPACE_ID
        expect(currency.amount.compact()).to.be.equal(1000 * 1000000);
    });

    it('should set amount in smallest unit when toDTO()', () => {

        const currency = NetworkCurrencyMosaic.createRelative(1000);
        expect(UInt64.fromNumericString(currency.toDTO().amount).toDTO()[0]).to.be.equal(1000 * 1000000);
    });

    it('should have valid statics', () => {
        deepEqual(NetworkCurrencyMosaic.NAMESPACE_ID.id, new NamespaceId([3294802500, 2243684972]).id);
        expect(NetworkCurrencyMosaic.DIVISIBILITY).to.be.equal(6);
        expect(NetworkCurrencyMosaic.TRANSFERABLE).to.be.equal(true);
        expect(NetworkCurrencyMosaic.SUPPLY_MUTABLE).to.be.equal(false);
    });
});
