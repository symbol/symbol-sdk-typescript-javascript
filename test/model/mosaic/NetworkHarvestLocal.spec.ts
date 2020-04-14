/*
 * Copyright 2020 NEM
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
import { NamespaceId } from '../../../src/model/namespace/NamespaceId';
import { BigIntUtilities } from '../../../src/core/format/BigIntUtilities';
import { NetworkHarvestLocal } from '../../../src/model/mosaic/NetworkHarvestLocal';

describe('NetworkHarvestLocal', () => {
    const hexId = '941299B2B7E1291C';
    const multiplier = BigInt(1000);

    it('should set amount when relative and number', () => {
        const amount = 900000000000000;
        const currency = NetworkHarvestLocal.createRelative(amount);
        deepEqual(BigIntUtilities.BigIntToHex(currency.id.id), hexId);
        expect(currency.toDTO().amount).to.be.equal((BigInt(amount) * multiplier).toString());
        expect(currency.amount.toString()).to.be.equal((BigInt(amount) * multiplier).toString());
    });

    it('should set amount when relative and bigint', () => {
        const amount = BigInt(900000000000000);
        const currency = NetworkHarvestLocal.createRelative(amount);
        deepEqual(BigIntUtilities.BigIntToHex(currency.id.id), hexId);
        expect(currency.toDTO().amount).to.be.equal((BigInt(amount) * multiplier).toString());
        expect(currency.amount.toString()).to.be.equal((BigInt(amount) * multiplier).toString());
    });

    it('should set amount when absolute and number', () => {
        const amount = 900000000000000123;
        const currency = NetworkHarvestLocal.createAbsolute(amount);
        deepEqual(BigIntUtilities.BigIntToHex(currency.id.id), hexId);
        expect(currency.toDTO().amount).to.be.equal(BigInt(amount).toString());
        expect(currency.amount.toString()).to.be.equal(BigInt(amount).toString());
    });

    it('should set amount when absolute and bigint', () => {
        const amount = BigInt(900000000000000123);
        const currency = NetworkHarvestLocal.createAbsolute(amount);
        deepEqual(BigIntUtilities.BigIntToHex(currency.id.id), hexId);
        expect(currency.toDTO().amount).to.be.equal(BigInt(amount).toString());
        expect(currency.amount.toString()).to.be.equal(BigInt(amount).toString());
    });

    it('should have valid statics', () => {
        deepEqual(NetworkHarvestLocal.NAMESPACE_ID.id, new NamespaceId(BigIntUtilities.HexToBigInt(hexId)).id);
        expect(NetworkHarvestLocal.DIVISIBILITY).to.be.equal(3);
        expect(NetworkHarvestLocal.TRANSFERABLE).to.be.equal(true);
        expect(NetworkHarvestLocal.SUPPLY_MUTABLE).to.be.equal(true);
    });
});
