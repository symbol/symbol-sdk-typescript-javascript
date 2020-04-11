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
import { expect } from 'chai';
import { Crypto } from '../../../src/core/crypto';
import { sha3_256 } from 'js-sha3';
import { LockHashUtils } from '../../../src/core/utils/LockHashUtils';
import { LockHashAlgorithm } from '../../../src/model/transaction/LockHashAlgorithm';
import { Convert } from '../../../src/core/format/Convert';

describe('Hashes', () => {
    const ripemd160 = require('ripemd160');
    const sha256 = require('js-sha256');

    it('Op_Sha3_256', () => {
        const secretSeed = Crypto.randomBytes(20);
        const expected = sha3_256.create().update(secretSeed).hex();
        const hash = LockHashUtils.Op_Sha3_256(secretSeed);
        expect(expected.toUpperCase()).to.be.equal(hash);
    });

    it('Op_Sha_256', () => {
        const randomBytes = Crypto.randomBytes(32);
        const secretSeed = Buffer.from(randomBytes).toString('hex');
        const hash256 = sha256(Buffer.from(secretSeed, 'hex'));
        const expected = sha256(Buffer.from(hash256, 'hex'));
        const hash = LockHashUtils.Op_Hash_256(randomBytes);
        expect(expected.toUpperCase()).to.be.equal(hash);
    });

    it('Op_Hash_160', () => {
        const secretSeed = Crypto.randomBytes(20);
        const hash256 = sha256(Buffer.from(secretSeed));
        const expected = new ripemd160().update(Buffer.from(hash256, 'hex')).digest('hex');

        const hash = LockHashUtils.Op_Hash_160(secretSeed);
        expect(expected.toUpperCase()).to.be.equal(hash);
    });

    it('Hash', () => {
        const secretSeed = Crypto.randomBytes(20);

        const expectedSHA3 = sha3_256.create().update(secretSeed).hex();
        const hashSHA3 = LockHashUtils.Hash(LockHashAlgorithm.Op_Sha3_256, secretSeed);
        expect(expectedSHA3.toUpperCase()).to.be.equal(hashSHA3);

        const h256 = sha256(Buffer.from(secretSeed));
        const expected256 = sha256(Buffer.from(h256, 'hex'));
        const hash256 = LockHashUtils.Hash(LockHashAlgorithm.Op_Hash_256, secretSeed);
        expect(expected256.toUpperCase()).to.be.equal(hash256);


        const expected160 = new ripemd160().update(Buffer.from(h256, 'hex')).digest('hex');
        const hash160 = LockHashUtils.Hash(LockHashAlgorithm.Op_Hash_160, secretSeed);
        expect(expected160.toUpperCase()).to.be.equal(hash160);
    });

    it('Hash with error', () => {
        expect(() => {
            LockHashUtils.Hash(100, Crypto.randomBytes(20));
        }).to.throw(Error, 'HashAlgorithm is invalid.');
    });
});

describe('Hashes - static vector', () => {

    const inputs = ['', 'CC', '41FB', '1F877C', 'C1ECFDFC',
    '9F2FCC7C90DE090D6B87CD7E9718C1EA6CB21118FC2D5DE9F97E5DB6AC1E9C10',
    '414243442C31322C34353637'];

    const expectedSHA3_256 = [
        'A7FFC6F8BF1ED76651C14756A061D662F580FF4DE43B49FA82D80A4B80F8434A',
        '677035391CD3701293D385F037BA32796252BB7CE180B00B582DD9B20AAAD7F0',
        '39F31B6E653DFCD9CAED2602FD87F61B6254F581312FB6EEEC4D7148FA2E72AA',
        'BC22345E4BD3F792A341CF18AC0789F1C9C966712A501B19D1B6632CCD408EC5',
        'C5859BE82560CC8789133F7C834A6EE628E351E504E601E8059A0667FF62C124',
        '2F1A5F7159E34EA19CDDC70EBF9B81F1A66DB40615D7EAD3CC1F1B954D82A3AF',
        'BBB389B70F13B89A0D544D87E9BF6AC981FC1744EB6AB808A7FF3ECF7FB6A3B9'
    ];

    const expectedHash_256 = [
        '5DF6E0E2761359D30A8275058E299FCC0381534545F55CF43E41983F5D4C9456',
        '796A3E4EAC5A2BD225C147EE5F358B75255F9782E46DDDA286A2139398A23FB7',
        '7664A1EA2BED912F7A1F8A9B8D760BDBD479BFE80B603F0ADACCFE124051D39F',
        '67CC26E4B3534A4EC6E5973BF8A2FFA8C0DAAEFAEDB984A3B4A15930E0091418',
        'DEA31FB4B63E158E92037CE6C9696EEE4344FAAB22808A00FF5B94A7FDC1CFA0',
        'ABED1BA808548F4FD0D239C8BA4840C81F52F91C7D8E6543D40ADE934DC7D886',
        'E6173EF758919BEC5F9FA28A6C28133D791D3C17C0D79AB10E449D5B4CBB453A'
    ];

    const expectedHash_160 = [
        'B472A266D0BD89C13706A4132CCFB16F7C3B9FCB',
        '59CC35F8C8D91867717CE4290B40EA636E86CE5C',
        'BE254D2744329BBE20F9CF6DA61043B4CEF8C2BC',
        '5ACCBEB2A17F9257E769D9636BB3FE21B9F98531',
        'C849C5A5F6BCA84EF1829B2A84C0BAC9D765383D',
        'C7B080DF005A269059B68DE318BE136396B02948',
        '76A380402DE6B84B170AB433A96C6B1E0DE05AF0'
    ];

    it('Test', () => {
        for (let i = 0; i < inputs.length; i++) {
            const hashSHA3 = LockHashUtils.Hash(LockHashAlgorithm.Op_Sha3_256, Convert.hexToUint8(inputs[i]));
            expect(hashSHA3).to.be.equal(expectedSHA3_256[i]);

            const hash256 = LockHashUtils.Hash(LockHashAlgorithm.Op_Hash_256, Convert.hexToUint8(inputs[i]));
            expect(hash256).to.be.equal(expectedHash_256[i]);

            const hash160 = LockHashUtils.Hash(LockHashAlgorithm.Op_Hash_160, Convert.hexToUint8(inputs[i]));
            expect(hash160).to.be.equal(expectedHash_160[i]);
        }
    });
});
