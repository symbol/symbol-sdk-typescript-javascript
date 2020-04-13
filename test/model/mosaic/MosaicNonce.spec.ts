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
import { deepEqual } from 'assert';
import { expect } from 'chai';
import { MosaicNonce } from '../../../src/model/mosaic/MosaicNonce';

describe('MosaicNonce', () => {
    it('should be created from Uint8Array', () => {
        const nonce = new MosaicNonce(new Uint8Array([0, 0, 0, 0]));
        deepEqual(nonce.toDTO(), 0);
    });

    it('should create random nonce', () => {
        const nonce = MosaicNonce.createRandom();
        expect(nonce.nonce).to.not.be.null;
        expect(nonce.toUint8Array()).to.not.be.null;
    });

    it('should create from createFromUint8Array', () => {
        const nonce = MosaicNonce.createFromUint8Array(new Uint8Array([1, 2, 3, 4]));
        expect(nonce.toDTO()).to.be.equals(67305985);
        expect(nonce.toUint8Array()).to.be.deep.equal(new Uint8Array([1, 2, 3, 4]));
    });

    it('should create random nonce twice not the same', () => {
        const nonce1 = MosaicNonce.createRandom();
        const nonce2 = MosaicNonce.createRandom();
        expect(nonce1.nonce).to.not.be.null;
        expect(nonce2.nonce).to.not.be.null;
        expect(nonce2.nonce).to.not.be.equal(nonce1.nonce);
        expect(nonce2.toUint8Array()).to.not.deep.equal(nonce1.toUint8Array());
        expect(nonce2.toUint8Array()).to.not.be.null;
    });

    it('should create nonce from hexadecimal notation', () => {
        const nonce = MosaicNonce.createFromHex('00000000');
        expect(nonce.nonce).to.not.be.null;
        deepEqual(nonce.toUint8Array(), new Uint8Array([0, 0, 0, 0]));
        deepEqual(nonce.toDTO(), 0);
    });

    it('should create nonce from hexadecimal notation throw exception', () => {
        expect(() => {
            MosaicNonce.createFromHex('111100000000');
        }).to.throw(Error, 'Invalid byte size for nonce, should be 4 bytes but received 6');
    });

    it('should createFromHex from nonce', () => {
        const nonce = MosaicNonce.createFromHex('FFFFFFC8');
        deepEqual(nonce.toHex().toUpperCase(), 'FFFFFFC8');
        deepEqual(nonce.toDTO(), 3372220415);

        const nonce2 = MosaicNonce.createFromNumber(nonce.toDTO());
        deepEqual(nonce2.toHex().toUpperCase(), 'FFFFFFC8');
    });

    it('should create nonce from hexadecimal notation with uint32 input - 0 value', () => {
        const nonce = MosaicNonce.createFromHex((0).toString(16).padStart(8, '0'));
        expect(nonce.nonce).to.not.be.null;
        deepEqual(nonce.nonce, new Uint8Array([0, 0, 0, 0]));
        deepEqual(nonce.toDTO(), 0);
    });

    it('should create nonce from hexadecimal notation with uint32 input', () => {
        const hex = (1845149376).toString(16);
        const nonce = MosaicNonce.createFromHex(hex);
        expect(nonce.nonce).to.not.be.null;
        deepEqual(nonce.toUint8Array(), new Uint8Array([109, 250, 190, 192]));
        deepEqual(nonce.toDTO(), 3233741421);
        deepEqual(nonce.toHex().toUpperCase(), hex.toUpperCase());
    });

    describe('toHex()', () => {
        it('should return string value of nonce', () => {
            const nonce = new MosaicNonce(new Uint8Array([0, 0, 0, 0]));
            const hex = nonce.toHex();
            expect(hex).to.be.equal('00000000');
        });

        it('should return string value of nonce', () => {
            const nonce = new MosaicNonce(new Uint8Array([1, 2, 3, 4]));
            const hex = nonce.toHex();
            expect(hex).to.be.equal('01020304');
        });
    });
});
