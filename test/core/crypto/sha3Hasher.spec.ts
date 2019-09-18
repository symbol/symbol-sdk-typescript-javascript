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
import {expect} from 'chai';
import {SHA3Hasher as sha3Hasher} from '../../../src/core/crypto/SHA3Hasher';
import {Convert as convert} from '../../../src/core/format';
import { NetworkType } from '../../../src/model/blockchain/NetworkType';

describe('hasher', () => {
    const inputs = [
        '',
        'CC',
        '41FB',
        '1F877C',
        'C1ECFDFC',
        '9F2FCC7C90DE090D6B87CD7E9718C1EA6CB21118FC2D5DE9F97E5DB6AC1E9C10',
    ];

    function addSha3Tests(length, expectedOutputs) {
        describe('func', () => {
            it('can hash test vectors', () => {
                // Sanity:
                expect(expectedOutputs.length).equal(inputs.length);

                for (let i = 0; i < inputs.length; ++i) {
                    // Arrange:
                    const inputHex = inputs[i];
                    const inputBuffer = convert.hexToUint8(inputHex);
                    const expectedHash = expectedOutputs[i];

                    // Act:
                    const hash = new Uint8Array(length);
                    sha3Hasher.func(hash, inputBuffer, length, NetworkType.MIJIN_TEST);

                    // Assert:
                    expect(convert.uint8ToHex(hash), `hashing ${inputHex}`).equal(expectedHash);
                }
            });
        });

        describe('object', () => {
            it('can hash test vectors', () => {
                // Sanity:
                expect(expectedOutputs.length).equal(inputs.length);

                for (let i = 0; i < inputs.length; ++i) {
                    // Arrange:
                    const inputHex = inputs[i];
                    const inputBuffer = convert.hexToUint8(inputHex);
                    const expectedHash = expectedOutputs[i];

                    const hasher = sha3Hasher.createHasher(length, NetworkType.MIJIN_TEST);
                    hasher.reset();

                    // Act: hash the input in two parts
                    hasher.update(inputBuffer.subarray(0, inputBuffer.length / 2));
                    hasher.update(inputBuffer.subarray(inputBuffer.length / 2));

                    const hash = new Uint8Array(length);
                    hasher.finalize(hash);

                    // Assert:
                    expect(convert.uint8ToHex(hash), `hashing ${inputHex}`).equal(expectedHash);
                }
            });

            it('can hash string', () => {
                // Arrange:
                const inputHex = inputs[3];
                const expectedHash = expectedOutputs[3];

                const hasher = sha3Hasher.createHasher(length, NetworkType.MIJIN_TEST);
                hasher.reset();

                // Act:
                hasher.update(inputHex);

                const hash = new Uint8Array(length);
                hasher.finalize(hash);

                // Assert:
                expect(convert.uint8ToHex(hash), `hashing ${inputHex}`).equal(expectedHash);
            });

            it('cannot hash unsupported data type', () => {
                // Arrange:
                const hasher = sha3Hasher.createHasher(length, NetworkType.MIJIN_TEST);
                hasher.reset();

                // Act:
                expect(() => hasher.update({})).to.throw('unsupported data type');
            });

            it('can reuse after reset', () => {
                // Arrange:
                const inputHex = inputs[3];
                const expectedHash = expectedOutputs[3];

                const hasher = sha3Hasher.createHasher(length, NetworkType.MIJIN_TEST);
                hasher.reset();
                hasher.update('ABCD');

                // Act:
                hasher.reset();
                hasher.update(inputHex);

                const hash = new Uint8Array(length);
                hasher.finalize(hash);

                // Assert:
                expect(convert.uint8ToHex(hash), `hashing ${inputHex}`).equal(expectedHash);
            });
        });
    }

    describe('sha3 256', () => {
        // https://github.com/gvanas/KeccakCodePackage/blob/master/TestVectors/ShortMsgKAT_SHA3-256.txt
        addSha3Tests(32, [
            'A7FFC6F8BF1ED76651C14756A061D662F580FF4DE43B49FA82D80A4B80F8434A',
            '677035391CD3701293D385F037BA32796252BB7CE180B00B582DD9B20AAAD7F0',
            '39F31B6E653DFCD9CAED2602FD87F61B6254F581312FB6EEEC4D7148FA2E72AA',
            'BC22345E4BD3F792A341CF18AC0789F1C9C966712A501B19D1B6632CCD408EC5',
            'C5859BE82560CC8789133F7C834A6EE628E351E504E601E8059A0667FF62C124',
            '2F1A5F7159E34EA19CDDC70EBF9B81F1A66DB40615D7EAD3CC1F1B954D82A3AF'
        ]);
    });

    describe('sha3 512', () => {
        // https://github.com/gvanas/KeccakCodePackage/blob/master/TestVectors/ShortMsgKAT_SHA3-512.txt
        addSha3Tests(64, [
            'A69F73CCA23A9AC5C8B567DC185A756E97C982164FE25859E0D1DCC1475C80A615B2123AF1F5F94C11E3E9402C3AC558F500199D95B6D3E301758586281DCD26',
            '3939FCC8B57B63612542DA31A834E5DCC36E2EE0F652AC72E02624FA2E5ADEECC7DD6BB3580224B4D6138706FC6E80597B528051230B00621CC2B22999EAA205',
            'AA092865A40694D91754DBC767B5202C546E226877147A95CB8B4C8F8709FE8CD6905256B089DA37896EA5CA19D2CD9AB94C7192FC39F7CD4D598975A3013C69',
            'CB20DCF54955F8091111688BECCEF48C1A2F0D0608C3A575163751F002DB30F40F2F671834B22D208591CFAF1F5ECFE43C49863A53B3225BDFD7C6591BA7658B',
            'D4B4BDFEF56B821D36F4F70AB0D231B8D0C9134638FD54C46309D14FADA92A2840186EED5415AD7CF3969BDFBF2DAF8CCA76ABFE549BE6578C6F4143617A4F1A',
            'B087C90421AEBF87911647DE9D465CBDA166B672EC47CCD4054A7135A1EF885E7903B52C3F2C3FE722B1C169297A91B82428956A02C631A2240F12162C7BC726'
        ]);
    });
});
