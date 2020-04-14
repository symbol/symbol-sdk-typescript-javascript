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
import { NetworkCurrencyPublic } from '../../../src/model/mosaic/NetworkCurrencyPublic';

describe('NetworkCurrencyPublic', () => {
    const hexId = 'E74B99BA41F4AFEE';
    const multiplier = BigInt(1000000);

    it('should set amount when relative and number', () => {
        const amount = 900000000000000;
        const currency = NetworkCurrencyPublic.createRelative(amount);
        deepEqual(BigIntUtilities.BigIntToHex(currency.id.id), hexId);
        expect(currency.toDTO().amount).to.be.equal((BigInt(amount) * multiplier).toString());
        expect(currency.amount.toString()).to.be.equal((BigInt(amount) * multiplier).toString());
    });

    it('should set amount when relative and bigint', () => {
        const amount = BigInt(900000000000000);
        const currency = NetworkCurrencyPublic.createRelative(amount);
        deepEqual(BigIntUtilities.BigIntToHex(currency.id.id), hexId);
        expect(currency.toDTO().amount).to.be.equal((BigInt(amount) * multiplier).toString());
        expect(currency.amount.toString()).to.be.equal((BigInt(amount) * multiplier).toString());
    });

    it('should set amount when absolute and number', () => {
        const amount = 900000000000000123;
        const currency = NetworkCurrencyPublic.createAbsolute(amount);
        deepEqual(BigIntUtilities.BigIntToHex(currency.id.id), hexId);
        expect(currency.toDTO().amount).to.be.equal(BigInt(amount).toString());
        expect(currency.amount.toString()).to.be.equal(BigInt(amount).toString());
    });

    it('should set amount when absolute and bigint', () => {
        const amount = BigInt(900000000000000123);
        const currency = NetworkCurrencyPublic.createAbsolute(amount);
        deepEqual(BigIntUtilities.BigIntToHex(currency.id.id), hexId);
        expect(currency.toDTO().amount).to.be.equal(BigInt(amount).toString());
        expect(currency.amount.toString()).to.be.equal(BigInt(amount).toString());
    });

    it('should have valid statics', () => {
        deepEqual(NetworkCurrencyPublic.NAMESPACE_ID.id, new NamespaceId(BigIntUtilities.HexToBigInt(hexId)).id);
        expect(NetworkCurrencyPublic.DIVISIBILITY).to.be.equal(6);
        expect(NetworkCurrencyPublic.TRANSFERABLE).to.be.equal(true);
        expect(NetworkCurrencyPublic.SUPPLY_MUTABLE).to.be.equal(false);
    });
});
