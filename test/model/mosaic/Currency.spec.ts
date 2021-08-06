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
import { Currency } from '../../../src/model/mosaic';
import { NamespaceId } from '../../../src/model/namespace';
import { UInt64 } from '../../../src/model/UInt64';

export const NetworkCurrencyPublic = Currency.PUBLIC();

export const NetworkCurrencyLocal = new Currency({
    namespaceId: new NamespaceId('cat.currency'),
    divisibility: 6,
    transferable: true,
    supplyMutable: false,
    restrictable: false,
});

export const NetworkHarvestLocal = new Currency({
    namespaceId: new NamespaceId('cat.harvest'),
    divisibility: 3,
    transferable: true,
    supplyMutable: true,
    restrictable: false,
});

describe('NetworkCurrencyLocal', () => {
    it('should createComplete an NetworkCurrencyLocal object', () => {
        const currency = NetworkCurrencyLocal.createRelative(1000);

        deepEqual(currency.id.toHex(), '85BBEA6CC462B244'); // holds NAMESPACE_ID
        expect(currency.amount.compact()).to.be.equal(1000 * 1000000);
    });

    it('should createComplete an NetworkCurrencyLocal object', () => {
        const currency = NetworkCurrencyLocal.createRelative(UInt64.fromUint(1000));

        deepEqual(currency.id.toHex(), '85BBEA6CC462B244'); // holds NAMESPACE_ID
        expect(currency.amount.compact()).to.be.equal(1000 * 1000000);
    });

    it('should set amount in smallest unit when toDTO()', () => {
        const currency = NetworkCurrencyLocal.createRelative(1000);
        expect(currency.toDTO().amount).to.be.equal(BigInt(1000 * 1000000).toString());
    });

    it('should have valid statics', () => {
        deepEqual(NetworkCurrencyLocal.namespaceId!.id, new NamespaceId([3294802500, 2243684972]).id);
        expect(NetworkCurrencyLocal.divisibility).to.be.equal(6);
        expect(NetworkCurrencyLocal.transferable).to.be.equal(true);
        expect(NetworkCurrencyLocal.supplyMutable).to.be.equal(false);
    });

    it('should create network currency with absolute amount', () => {
        const currency = NetworkCurrencyLocal.createAbsolute(1000);
        expect(currency.toDTO().amount).to.be.equal(BigInt(1000).toString());
    });

    it('should create network currency with absolute amount in Uint64', () => {
        const currency = NetworkCurrencyLocal.createAbsolute(UInt64.fromUint(1000));
        expect(currency.toDTO().amount).to.be.equal(BigInt(1000).toString());
    });
});

describe('NetworkCurrencyPublic', () => {
    it('should createComplete an NetworkCurrencyPublic object', () => {
        const currency = NetworkCurrencyPublic.createRelative(1000);
        expect(currency.id.toHex()).to.be.equal(NetworkCurrencyPublic.namespaceId?.toHex()); // Holds Namespace ID
        expect(currency.amount.compact()).to.be.equal(1000 * 1000000);
    });

    it('should createComplete an NetworkCurrencyPublic object', () => {
        const currency = NetworkCurrencyPublic.createRelative(UInt64.fromUint(1000));
        expect(currency.id.toHex()).to.be.equal(NetworkCurrencyPublic.namespaceId?.toHex()); // Holds Namespace ID
        expect(currency.amount.compact()).to.be.equal(1000 * 1000000);
    });

    it('should set amount in smallest unit when toDTO()', () => {
        const currency = NetworkCurrencyPublic.createRelative(1000);
        expect(currency.toDTO().amount).to.be.equal(BigInt(1000 * 1000000).toString());
    });

    it('should have valid statics', () => {
        deepEqual(NetworkCurrencyPublic.namespaceId!.id, new NamespaceId([1106554862, 3880491450]).id);
        expect(NetworkCurrencyPublic.divisibility).to.be.equal(6);
        expect(NetworkCurrencyPublic.transferable).to.be.equal(true);
        expect(NetworkCurrencyPublic.supplyMutable).to.be.equal(false);
    });

    it('should create network currency with absolute amount', () => {
        const currency = NetworkCurrencyPublic.createAbsolute(1000);
        expect(UInt64.fromNumericString(currency.toDTO().amount).toDTO()).to.be.equal(BigInt(1000));
    });

    it('should create network currency with absolute amount in Uint64', () => {
        const currency = NetworkCurrencyPublic.createAbsolute(UInt64.fromUint(1000));
        expect(UInt64.fromNumericString(currency.toDTO().amount).toDTO()).to.be.equal(BigInt(1000));
    });
});
