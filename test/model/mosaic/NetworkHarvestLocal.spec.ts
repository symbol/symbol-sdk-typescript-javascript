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

import { deepEqual } from 'assert';
import { expect } from 'chai';
import { NetworkHarvestLocal } from '../../../src/model/mosaic/NetworkHarvestLocal';
import { NamespaceId } from '../../../src/model/namespace/NamespaceId';
import { UInt64 } from '../../../src/model/UInt64';

describe('NetworkHarvestLocal', () => {
    it('should createComplete an NetworkHarvestLocal object', () => {
        const currency = NetworkHarvestLocal.createRelative(1000);

        deepEqual(currency.id.id.toHex(), '941299B2B7E1291C');
        expect(currency.amount.compact()).to.be.equal(1000 * 1000);
    });

    it('should createComplete an NetworkHarvestLocal object', () => {
        const currency = NetworkHarvestLocal.createRelative(UInt64.fromUint(1000));

        deepEqual(currency.id.id.toHex(), '941299B2B7E1291C');
        expect(currency.amount.compact()).to.be.equal(1000 * 1000);
    });

    it('should set amount in smallest unit when toDTO()', () => {
        const currency = NetworkHarvestLocal.createRelative(1000);
        expect(UInt64.fromNumericString(currency.toDTO().amount).toDTO()[0]).to.be.equal(1000 * 1000);
    });

    it('should have valid statics', () => {
        deepEqual(NetworkHarvestLocal.NAMESPACE_ID.id, new NamespaceId([3084986652, 2484246962]).id);
        expect(NetworkHarvestLocal.DIVISIBILITY).to.be.equal(3);
        expect(NetworkHarvestLocal.TRANSFERABLE).to.be.equal(true);
        expect(NetworkHarvestLocal.SUPPLY_MUTABLE).to.be.equal(true);
    });

    it('should create network currency with absolute amount', () => {
        const currency = NetworkHarvestLocal.createAbsolute(1000);
        expect(UInt64.fromNumericString(currency.toDTO().amount).toDTO()[0]).to.be.equal(1000);
    });

    it('should create network currency with absolute amount in Uint64', () => {
        const currency = NetworkHarvestLocal.createAbsolute(UInt64.fromUint(1000));
        expect(UInt64.fromNumericString(currency.toDTO().amount).toDTO()[0]).to.be.equal(1000);
    });
});
