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
import { PublicAccount } from '../../../src/model/account/PublicAccount';
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import { MosaicNonce } from '../../../src/model/mosaic/MosaicNonce';
import { NetworkType } from '../../../src/model/network/NetworkType';
import { expect } from 'chai';
import { BigIntUtilities } from '../../../src/core/format/BigIntUtilities';

describe('MosaicId', () => {
    const publicKey = 'b4f12e7c9f6946091e2cb8b6d3a12b50d17ccbbf646386ea27ce2946a7423dcf';

    it('should be created from id', () => {
        const id = new MosaicId('85BBEA6CC462B244');
        deepEqual(id.id, BigIntUtilities.HexToBigInt('85BBEA6CC462B244'));
    });

    it('should be created from id', () => {
        const id = new MosaicId('85BBEA6CC462B244');
        deepEqual(id.id, BigIntUtilities.HexToBigInt('85BBEA6CC462B244'));
    });

    it('should create id given nonce and owner', () => {
        const owner = PublicAccount.createFromPublicKey(publicKey, NetworkType.MIJIN_TEST);
        const id = MosaicId.createFromNonce(MosaicNonce.createFromNumber(0), owner);
        deepEqual(id.id, BigIntUtilities.HexToBigInt('0DC67FBE1CAD29E3'));
    });

    it('should create id twice the same given nonce and owner', () => {
        const owner = PublicAccount.createFromPublicKey(publicKey, NetworkType.MIJIN_TEST);
        const id1 = MosaicId.createFromNonce(MosaicNonce.createFromNumber(12), owner);
        const id2 = MosaicId.createFromNonce(MosaicNonce.createFromNumber(12), owner);

        deepEqual(id1.id, id2.id);
    });

    it('should throw invalid size', () => {
        expect(() => {
            new MosaicId('85BBEA6CC462B24499');
        }).to.throw(Error, 'Invalid size for MosaicId hexadecimal notation');
    });
});
