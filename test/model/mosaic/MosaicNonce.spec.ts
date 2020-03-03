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
import {deepEqual} from 'assert';
import {expect} from 'chai';
import {PublicAccount} from '../../../src/model/account/PublicAccount';
import {NetworkType} from '../../../src/model/blockchain/NetworkType';
import {MosaicNonce} from '../../../src/model/mosaic/MosaicNonce';

describe('MosaicNonce', () => {

    it('should be created from Uint8Array', () => {
        const nonce = new MosaicNonce(new Uint8Array([0x0, 0x0, 0x0, 0x0]));
        deepEqual(nonce.nonce, new Uint8Array([0x0, 0x0, 0x0, 0x0]));
        deepEqual(nonce.toDTO(), 0);
    });

    it('should create random nonce', () => {
        const nonce = MosaicNonce.createRandom();
        expect(nonce.nonce).to.not.be.null;
    });

    it('should create random nonce twice not the same', () => {
        const nonce1 = MosaicNonce.createRandom();
        const nonce2 = MosaicNonce.createRandom();
        expect(nonce1.nonce).to.not.be.null;
        expect(nonce2.nonce).to.not.be.null;
        expect(nonce2.nonce).to.not.be.equal(nonce1.nonce);
    });

    it('should create nonce from hexadecimal notation', () => {
        const nonce = MosaicNonce.createFromHex('00000000');
        expect(nonce.nonce).to.not.be.null;
        deepEqual(nonce.nonce, new Uint8Array([0x0, 0x0, 0x0, 0x0]));
        deepEqual(nonce.toDTO(), 0);
    });

    it('should create nonce from hexadecimal notation throw exception', () => {
        expect(() => {
            MosaicNonce.createFromHex('111100000000');
        }).to.throw(Error, 'Expected 4 bytes for Nonce and got ' + '111100000000'.length + ' instead.');
    });

    it('should create nonce from hexadecimal notation with uint32 input - 0 value', () => {
        const nonce = MosaicNonce.createFromHex((0).toString(16));
        expect(nonce.nonce).to.not.be.null;
        deepEqual(nonce.nonce, new Uint8Array([0x0, 0x0, 0x0, 0x0]));
        deepEqual(nonce.toDTO(), 0);
    });

    it('should create nonce from hexadecimal notation with uint32 input', () => {
        const nonce = MosaicNonce.createFromHex((11).toString(16));
        expect(nonce.nonce).to.not.be.null;
        deepEqual(nonce.nonce, new Uint8Array([0, 0, 0, 11]));
        deepEqual(nonce.toDTO(), 184549376);
    });

    describe('toHex()', () => {
        it('should return string value of nonce', () => {
            const nonce = new MosaicNonce(new Uint8Array([0x0, 0x0, 0x0, 0x0]));
            const hex = nonce.toHex();
            expect(hex).to.be.equal('00000000');
        });
    });
});
