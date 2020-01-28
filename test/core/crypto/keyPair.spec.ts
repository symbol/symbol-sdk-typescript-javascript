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
import {Crypto, KeyPair, SHA3Hasher, SignSchema} from '../../../src/core/crypto';
import { Convert } from '../../../src/core/format/Convert';
import { NetworkType } from '../../../src/model/blockchain/NetworkType';
import { Address } from '../../../src/model/account/Address';

describe('key pair', () => {
    const randomKeyPair = () =>
        KeyPair.createKeyPairFromPrivateKeyString(Convert.uint8ToHex(Crypto.randomBytes(32)), SignSchema.SHA3);
    const Private_Key_Size = 32;
    const Signature_Size = 64;
    const mijinTestSignSchema = SHA3Hasher.resolveSignSchema(NetworkType.MIJIN_TEST);
    const nis1TestSignSchema = SHA3Hasher.resolveSignSchema(NetworkType.TEST_NET);

    const Private_Keys = [
        '575dbb3062267eff57c970a336ebbc8fbcfe12c5bd3ed7bc11eb0481d7704ced'.toUpperCase(),
        '5b0e3fa5d3b49a79022d7c1e121ba1cbbf4db5821f47ab8c708ef88defc29bfe'.toUpperCase(),
        '738ba9bb9110aea8f15caa353aca5653b4bdfca1db9f34d0efed2ce1325aeeda'.toUpperCase(),
        'e8bf9bc0f35c12d8c8bf94dd3a8b5b4034f1063948e3cc5304e55e31aa4b95a6'.toUpperCase(),
        'c325ea529674396db5675939e7988883d59a5fc17a28ca977e3ba85370232a83'.toUpperCase(),
    ];

    describe('construction', () => {
        it('can extract from private key test vectors', () => {
            // Arrange:
            const Expected_Public_Keys = [
                'BD8D3F8B7E1B3839C650F458234AB1FF87CDB1EDA36338D9E446E27D454717F2',
                '26821636A618FD524A3AB57276EFC36CAF787DF19EE00F60035CE376A18E8C47',
                'DFC7F40FC549AC8BB2EF097600103FF457A1D7DC5755D434474761459B030E6F',
                '96C7AB358EBB91104322C56435642BD939A77432286B229372987FC366EA319F',
                '9488CFB5D7D439213B11FA80C1B57E8A7AB7E41B64CBA18A89180D412C04915C',
            ];

            // Sanity:
            expect(Private_Keys.length).equal(Expected_Public_Keys.length);

            for (let i = 0; i < Private_Keys.length; ++i) {
                // Arrange:
                const privateKeyHex = Private_Keys[i];
                const expectedPublicKey = Expected_Public_Keys[i];

                // Act:
                const keyPair = KeyPair.createKeyPairFromPrivateKeyString(privateKeyHex, mijinTestSignSchema);

                // Assert:
                const message = ` from ${privateKeyHex}`;
                expect(Convert.uint8ToHex(keyPair.publicKey), `public ${message}`).equal(expectedPublicKey);
                expect(Convert.uint8ToHex(keyPair.privateKey), `private ${message}`).equal(privateKeyHex);
            }
        });

        it('cannot extract from invalid private key', () => {
            // Arrange:
            const invalidPrivateKeys = [
                '', // empty
                '53C659B47C176A70EB228DE5C0A0FF391282C96640C2A42CD5BBD0982176AB', // short
                '53C659B47C176A70EB228DE5C0A0FF391282C96640C2A42CD5BBD0982176AB1BBB', // long
            ];

            // Act:
            invalidPrivateKeys.forEach((privateKey) => {
                // Assert:
                expect(() => {
                        KeyPair.createKeyPairFromPrivateKeyString(privateKey, mijinTestSignSchema);
                    }, `from ${privateKey}`)
                    .to.throw('private key has unexpected size');
            });
        });
    });

    /**
     * @see https://raw.githubusercontent.com/nemtech/test-vectors/master/1.test-keys-nis1.json
     */
    describe('NIS1 test vector - Keccak', () => {
        it('can extract from private key test vectors', () => {
            // Arrange:
            const Nis1_Private_Key = [
                '575dbb3062267eff57c970a336ebbc8fbcfe12c5bd3ed7bc11eb0481d7704ced',
                '5b0e3fa5d3b49a79022d7c1e121ba1cbbf4db5821f47ab8c708ef88defc29bfe',
                '738ba9bb9110aea8f15caa353aca5653b4bdfca1db9f34d0efed2ce1325aeeda',
                'e8bf9bc0f35c12d8c8bf94dd3a8b5b4034f1063948e3cc5304e55e31aa4b95a6',
                'c325ea529674396db5675939e7988883d59a5fc17a28ca977e3ba85370232a83',
            ];

            const Expected_Public_Keys = [
                'D6C3845431236C5A5A907A9E45BD60DA0E12EFD350B970E7F58E3499E2E7A2F0',
                'F3BD51ADD90A7BE8ED81F64EEE9456AF3B38478275B17EABE1853DFCFD3BF2CD',
                '017CB008D00E41D17A6A09A6BE5C65C89E1E28706A621B0791B270E4F6182CC3',
                '60068A23A0893538B5C364CAC86CB8670668BE84AEE2B6FCFF83FDF39A03F822',
                'AE054EF2A458A0CEE6B34A1DD32597A9236C4D453040B9AF58B5AE22A73024B7',
            ];

            // Sanity:
            expect(Nis1_Private_Key.length).equal(Expected_Public_Keys.length);

            for (let i = 0; i < Nis1_Private_Key.length; ++i) {
                // Arrange:
                const privateKeyHex = Nis1_Private_Key[i];
                const expectedPublicKey = Expected_Public_Keys[i];

                // Act:
                const keyPair = KeyPair.createKeyPairFromPrivateKeyString(privateKeyHex, nis1TestSignSchema);

                // Assert:
                const message = ` from ${privateKeyHex}`;
                expect(Convert.uint8ToHex(keyPair.publicKey).toUpperCase(), `public ${message}`).equal(expectedPublicKey.toUpperCase());
                expect(Convert.uint8ToHex(keyPair.privateKey).toUpperCase(), `private ${message}`).equal(privateKeyHex.toUpperCase());
            }
        });

        it('cannot extract from invalid private key', () => {
            // Arrange:
            const invalidPrivateKeys = [
                '', // empty
                '53C659B47C176A70EB228DE5C0A0FF391282C96640C2A42CD5BBD0982176AB', // short
                '53C659B47C176A70EB228DE5C0A0FF391282C96640C2A42CD5BBD0982176AB1BBB', // long
            ];

            // Act:
            invalidPrivateKeys.forEach((privateKey) => {
                // Assert:
                expect(() => {
                        KeyPair.createKeyPairFromPrivateKeyString(privateKey, mijinTestSignSchema);
                    }, `from ${privateKey}`)
                    .to.throw('private key has unexpected size');
            });
        });
    });

    /**
     * @see https://raw.githubusercontent.com/nemtech/test-vectors/master/1.test-keys-catapult.json
     */
    describe('Catapult test vector - SHA3', () => {
        it('can extract from private key test vectors', () => {
            // Arrange:
            const Private_Key = [
                '575dbb3062267eff57c970a336ebbc8fbcfe12c5bd3ed7bc11eb0481d7704ced',
                '5b0e3fa5d3b49a79022d7c1e121ba1cbbf4db5821f47ab8c708ef88defc29bfe',
                '738ba9bb9110aea8f15caa353aca5653b4bdfca1db9f34d0efed2ce1325aeeda',
                'e8bf9bc0f35c12d8c8bf94dd3a8b5b4034f1063948e3cc5304e55e31aa4b95a6',
                'c325ea529674396db5675939e7988883d59a5fc17a28ca977e3ba85370232a83',
            ];

            const Expected_Public_Keys = [
                'BD8D3F8B7E1B3839C650F458234AB1FF87CDB1EDA36338D9E446E27D454717F2',
                '26821636A618FD524A3AB57276EFC36CAF787DF19EE00F60035CE376A18E8C47',
                'DFC7F40FC549AC8BB2EF097600103FF457A1D7DC5755D434474761459B030E6F',
                '96C7AB358EBB91104322C56435642BD939A77432286B229372987FC366EA319F',
                '9488CFB5D7D439213B11FA80C1B57E8A7AB7E41B64CBA18A89180D412C04915C',
            ];

            // Sanity:
            expect(Private_Key.length).equal(Expected_Public_Keys.length);

            for (let i = 0; i < Private_Key.length; ++i) {
                // Arrange:
                const privateKeyHex = Private_Key[i];
                const expectedPublicKey = Expected_Public_Keys[i];

                // Act:
                const keyPair = KeyPair.createKeyPairFromPrivateKeyString(privateKeyHex, mijinTestSignSchema);

                // Assert:
                const message = ` from ${privateKeyHex}`;
                expect(Convert.uint8ToHex(keyPair.publicKey).toUpperCase(), `public ${message}`).equal(expectedPublicKey.toUpperCase());
                expect(Convert.uint8ToHex(keyPair.privateKey).toUpperCase(), `private ${message}`).equal(privateKeyHex.toUpperCase());
            }
        });

        it('cannot extract from invalid private key', () => {
            // Arrange:
            const invalidPrivateKeys = [
                '', // empty
                '53C659B47C176A70EB228DE5C0A0FF391282C96640C2A42CD5BBD0982176AB', // short
                '53C659B47C176A70EB228DE5C0A0FF391282C96640C2A42CD5BBD0982176AB1BBB', // long
            ];

            // Act:
            invalidPrivateKeys.forEach((privateKey) => {
                // Assert:
                expect(() => {
                        KeyPair.createKeyPairFromPrivateKeyString(privateKey, mijinTestSignSchema);
                    }, `from ${privateKey}`)
                    .to.throw('private key has unexpected size');
            });
        });
    });

    /**
     * @see https://raw.githubusercontent.com/nemtech/test-vectors/master/1.test-keys-catapult.json
     */
    describe('Catapult test vector - SHA3', () => {
        it('can extract from private key test vectors', () => {
            // Arrange:
            const Private_Key = [
                '575dbb3062267eff57c970a336ebbc8fbcfe12c5bd3ed7bc11eb0481d7704ced',
                '5b0e3fa5d3b49a79022d7c1e121ba1cbbf4db5821f47ab8c708ef88defc29bfe',
                '738ba9bb9110aea8f15caa353aca5653b4bdfca1db9f34d0efed2ce1325aeeda',
                'e8bf9bc0f35c12d8c8bf94dd3a8b5b4034f1063948e3cc5304e55e31aa4b95a6',
                'c325ea529674396db5675939e7988883d59a5fc17a28ca977e3ba85370232a83',
            ];

            const Expected_Public_Keys = [
                'BD8D3F8B7E1B3839C650F458234AB1FF87CDB1EDA36338D9E446E27D454717F2',
                '26821636A618FD524A3AB57276EFC36CAF787DF19EE00F60035CE376A18E8C47',
                'DFC7F40FC549AC8BB2EF097600103FF457A1D7DC5755D434474761459B030E6F',
                '96C7AB358EBB91104322C56435642BD939A77432286B229372987FC366EA319F',
                '9488CFB5D7D439213B11FA80C1B57E8A7AB7E41B64CBA18A89180D412C04915C',
            ];

            // Sanity:
            expect(Private_Key.length).equal(Expected_Public_Keys.length);

            for (let i = 0; i < Private_Key.length; ++i) {
                // Arrange:
                const privateKeyHex = Private_Key[i];
                const expectedPublicKey = Expected_Public_Keys[i];

                // Act:
                const keyPair = KeyPair.createKeyPairFromPrivateKeyString(privateKeyHex, mijinTestSignSchema);

                // Assert:
                const message = ` from ${privateKeyHex}`;
                expect(Convert.uint8ToHex(keyPair.publicKey).toUpperCase(), `public ${message}`).equal(expectedPublicKey.toUpperCase());
                expect(Convert.uint8ToHex(keyPair.privateKey).toUpperCase(), `private ${message}`).equal(privateKeyHex.toUpperCase());
            }
        });

        it('cannot extract from invalid private key', () => {
            // Arrange:
            const invalidPrivateKeys = [
                '', // empty
                '53C659B47C176A70EB228DE5C0A0FF391282C96640C2A42CD5BBD0982176AB', // short
                '53C659B47C176A70EB228DE5C0A0FF391282C96640C2A42CD5BBD0982176AB1BBB', // long
            ];

            // Act:
            invalidPrivateKeys.forEach((privateKey) => {
                // Assert:
                expect(() => {
                        KeyPair.createKeyPairFromPrivateKeyString(privateKey, mijinTestSignSchema);
                    }, `from ${privateKey}`)
                    .to.throw('private key has unexpected size');
            });
        });
    });

    describe('sign & verify- Test Vector', () => {
        /**
         * @see https://raw.githubusercontent.com/nemtech/test-vectors/master/2.test-sign-nis1.json
         */
        it('NIS1', () => {
            const Nis1_Private_Key = [
                'abf4cf55a2b3f742d7543d9cc17f50447b969e6e06f5ea9195d428ab12b7318d',
                '6aa6dad25d3acb3385d5643293133936cdddd7f7e11818771db1ff2f9d3f9215',
                '8e32bc030a4c53de782ec75ba7d5e25e64a2a072a56e5170b77a4924ef3c32a9',
                'c83ce30fcb5b81a51ba58ff827ccbc0142d61c13e2ed39e78e876605da16d8d7',
                '2da2a0aae0f37235957b51d15843edde348a559692d8fa87b94848459899fc27',
            ];
            const Nis1_Data = [
                '8ce03cd60514233b86789729102ea09e867fc6d964dea8c2018ef7d0a2e0e24bf7e348e917116690b9',
                'e4a92208a6fc52282b620699191ee6fb9cf04daf48b48fd542c5e43daa9897763a199aaa4b6f10546109f47ac3564fade0',
                '13ed795344c4448a3b256f23665336645a853c5c44dbff6db1b9224b5303b6447fbf8240a2249c55',
                'a2704638434e9f7340f22d08019c4c8e3dbee0df8dd4454a1d70844de11694f4c8ca67fdcb08fed0cec9abb2112b5e5f89',
                'd2488e854dbcdfdb2c9d16c8c0b2fdbc0abb6bac991bfe2b14d359a6bc99d66c00fd60d731ae06d0',
            ];
            const Expected_Signature = [
                '62D65D4728E07489152A45FC66BF680A85674AA1D971F265C02AC45E09EB115791FFA524C28F9A3238A18751C314EDC0CDD7124A1BDEE1B1414DE7365F02950B',
                'E48FFDE4FE2298E6DE06CE1FC0006A68544B5A8CEA4F93CFAD3E671720A010092FBB4E2DE3B7414C4E09766129BA26BA30A06A7676269B8868E55913779D4B0E',
                'C65ECD2E25797A92CA6BB92DC817ABCABA9B40F19F181A77150222F8C8519391B5FA713DE495040E9DE1354ADCE35485F2C56608DAD30A94FA0EAAE468651308',
                'C8B018ACB41191A09B354FCA3C8A207EDA8875F3FE6778B90288E67AA4648C9FF183E6576B452F6DC88B1D31E369BE5AF79A96FE4520EC40D156232B7B08F900',
                '5A3CDDAC6E61DB8A614C8475A5B55EF0EC35C5206FA3EE4057CEADDD0E101A2EC4AFCBC688F8CF3488AB25FA5B6C879CEE59F4A1F51115383EEA2F9A9E1D820C',
            ];

            for (let i = 0; i < Nis1_Private_Key.length; ++i) {
                // Arrange:
                const privateKey = Nis1_Private_Key[i];
                const keyPair = KeyPair.createKeyPairFromPrivateKeyString(privateKey, nis1TestSignSchema);
                const payload = Convert.hexToUint8(Nis1_Data[i]);

                // Act:
                const signature = KeyPair.sign(keyPair, payload, nis1TestSignSchema);

                // Assert:
                const message = ` from ${Nis1_Private_Key[i]}`;
                expect(Convert.uint8ToHex(KeyPair.sign(keyPair, payload, nis1TestSignSchema)).toUpperCase(),
                    `private ${message}`).to.deep.equal(Expected_Signature[i].toUpperCase());

                const isVerified = KeyPair.verify(keyPair.publicKey, payload, signature, nis1TestSignSchema);
                expect(isVerified, `private ${message}`).to.equal(true);
            }
        });

        /**
         * @see https://raw.githubusercontent.com/nemtech/test-vectors/master/2.test-sign-catapult.json
         */
        it('CATAPULT', () => {
            const Catapult_Private_Key = [
                'abf4cf55a2b3f742d7543d9cc17f50447b969e6e06f5ea9195d428ab12b7318d',
                '6aa6dad25d3acb3385d5643293133936cdddd7f7e11818771db1ff2f9d3f9215',
                '8e32bc030a4c53de782ec75ba7d5e25e64a2a072a56e5170b77a4924ef3c32a9',
                'c83ce30fcb5b81a51ba58ff827ccbc0142d61c13e2ed39e78e876605da16d8d7',
                '2da2a0aae0f37235957b51d15843edde348a559692d8fa87b94848459899fc27',
            ];
            const Catapult_Data = [
                '8ce03cd60514233b86789729102ea09e867fc6d964dea8c2018ef7d0a2e0e24bf7e348e917116690b9',
                'e4a92208a6fc52282b620699191ee6fb9cf04daf48b48fd542c5e43daa9897763a199aaa4b6f10546109f47ac3564fade0',
                '13ed795344c4448a3b256f23665336645a853c5c44dbff6db1b9224b5303b6447fbf8240a2249c55',
                'a2704638434e9f7340f22d08019c4c8e3dbee0df8dd4454a1d70844de11694f4c8ca67fdcb08fed0cec9abb2112b5e5f89',
                'd2488e854dbcdfdb2c9d16c8c0b2fdbc0abb6bac991bfe2b14d359a6bc99d66c00fd60d731ae06d0',
            ];
            const Expected_Signature = [
                '26E2C18BD0865AC141EDC181C61D2EC74231A4C8EB644C732D4830E82EB143094E7078086648964B0B91363E555907EC53E2AE7BD185D609805099F5C3A4CF07',
                '079B761E8C6A0AF15664D86E8DCCC67D78286384732CF3E36332E7E839DAB617C4A7F942B9C40F84513613089011378B43D43706648317564E3F77EF142F280A',
                '2AD313E2BFFE35A6AFBBCBC1AC673922EB760EC1FF91C35BAA76275E4E9BA3D9A5FA7F5B005D52F5E3B9DB381DD268499234C7F0774C297823693955C382D00B',
                'C846A755CF670A8C13861D27380568480FFC96D99CA2F560EC432DEE244D41D7B180EC6B756ED393A249C28932D6CE1BD5A3A7D28396DEBA7739BAEF611A180B',
                'DF852FB53BF166ACF784E2C906BFE35AA0A7D51A0193265288945111D066906C77874AD1E13555E274A4425673AF046B102137ADE1DF5A361614C7411B53F50F',
            ];

            for (let i = 0; i < Catapult_Private_Key.length; ++i) {
                // Arrange:
                const keyPair = KeyPair.createKeyPairFromPrivateKeyString(Catapult_Private_Key[i], mijinTestSignSchema);
                const payload = Convert.hexToUint8(Catapult_Data[i]);

                // Act:
                const signature = KeyPair.sign(keyPair, payload, mijinTestSignSchema);

                // Assert:
                const message = ` from ${Catapult_Private_Key[i]}`;
                expect(Convert.uint8ToHex(signature).toUpperCase(),
                    `private ${message}`).to.deep.equal(Expected_Signature[i].toUpperCase());
                const isVerified = KeyPair.verify(keyPair.publicKey, payload, signature, mijinTestSignSchema);
                expect(isVerified, `private ${message}`).to.equal(true);
            }
        });
    });

    describe('sign', () => {
        it('fills the signature', () => {
            // Arrange:
            const keyPair = randomKeyPair();
            const payload = Crypto.randomBytes(100);

            // Act:
            const signature = KeyPair.sign(keyPair, payload, mijinTestSignSchema);

            // Assert:
            expect(signature).to.not.deep.equal(new Uint8Array(Signature_Size));
        });

        it('returns same signature for same data signed by same key pairs', () => {
            // Arrange:
            const privateKey = Convert.uint8ToHex(Crypto.randomBytes(Private_Key_Size));
            const keyPair1 = KeyPair.createKeyPairFromPrivateKeyString(privateKey, mijinTestSignSchema);
            const keyPair2 = KeyPair.createKeyPairFromPrivateKeyString(privateKey, mijinTestSignSchema);
            const payload = Crypto.randomBytes(100);

            // Act:
            const signature1 = KeyPair.sign(keyPair1, payload, mijinTestSignSchema);
            const signature2 = KeyPair.sign(keyPair2, payload, mijinTestSignSchema);

            // Assert:
            expect(signature2).to.deep.equal(signature1);
        });

        it('returns different signature for same data signed by different key pairs', () => {
            // Arrange:
            const keyPair1 = randomKeyPair();
            const keyPair2 = randomKeyPair();
            const payload = Crypto.randomBytes(100);

            // Act:
            const signature1 = KeyPair.sign(keyPair1, payload, mijinTestSignSchema);
            const signature2 = KeyPair.sign(keyPair2, payload, mijinTestSignSchema);

            // Assert:
            expect(signature2).to.not.deep.equal(signature1);
        });

    });

    describe('verify', () => {
        it('returns true for data signed with same key pair', () => {
            // Arrange:
            const keyPair = randomKeyPair();
            const payload = Crypto.randomBytes(100);
            const signature = KeyPair.sign(keyPair, payload, mijinTestSignSchema);

            // Act:
            const isVerified = KeyPair.verify(keyPair.publicKey, payload, signature, mijinTestSignSchema);

            // Assert:
            expect(isVerified).to.equal(true);
        });

        it('returns false for data signed with different key pair', () => {
            // Arrange:
            const keyPair1 = randomKeyPair();
            const keyPair2 = randomKeyPair();
            const payload = Crypto.randomBytes(100);
            const signature = KeyPair.sign(keyPair1, payload, mijinTestSignSchema);

            // Act:
            const isVerified = KeyPair.verify(keyPair2.publicKey, payload, signature, mijinTestSignSchema);

            // Assert:
            expect(isVerified).to.equal(false);
        });

        it('returns false if signature has been modified', () => {
            // Arrange:
            const keyPair = randomKeyPair();
            const payload = Crypto.randomBytes(100);

            for (let i = 0; i < Signature_Size; i += 4) {
                const signature = KeyPair.sign(keyPair, payload, mijinTestSignSchema);
                signature[i] ^= 0xFF;

                // Act:
                const isVerified = KeyPair.verify(keyPair.publicKey, payload, signature, mijinTestSignSchema);

                // Assert:
                expect(isVerified, `signature modified at ${i}`).to.equal(false);
            }
        });

        it('returns false if payload has been modified', () => {
            // Arrange:
            const keyPair = randomKeyPair();
            const payload = Crypto.randomBytes(44);

            for (let i = 0; i < payload.length; i += 4) {
                const signature = KeyPair.sign(keyPair, payload, mijinTestSignSchema);
                payload[i] ^= 0xFF;

                // Act:
                const isVerified = KeyPair.verify(keyPair.publicKey, payload, signature, mijinTestSignSchema);

                // Assert:
                expect(isVerified, `payload modified at ${i}`).to.equal(false);
            }
        });

        it('fails if public key is not on curve', () => {
            // Arrange:
            const keyPair = randomKeyPair();
            keyPair.publicKey.fill(0);
            keyPair.publicKey[keyPair.publicKey.length - 1] = 1;

            const payload = Crypto.randomBytes(100);
            const signature = KeyPair.sign(keyPair, payload, mijinTestSignSchema);

            // Act:
            const isVerified = KeyPair.verify(keyPair.publicKey, payload, signature, mijinTestSignSchema);

            // Assert:
            expect(isVerified).to.equal(false);
        });

        it('fails if public key does not correspond to private key', () => {
            // Arrange:
            const keyPair = randomKeyPair();
            const payload = Crypto.randomBytes(100);
            const signature = KeyPair.sign(keyPair, payload, mijinTestSignSchema);

            for (let i = 0; i < keyPair.publicKey.length; ++i) {
                keyPair.publicKey[i] ^= 0xFF;
            }

            // Act:
            const isVerified = KeyPair.verify(keyPair.publicKey, payload, signature, mijinTestSignSchema);

            // Assert:
            expect(isVerified).to.equal(false);
        });

        it('rejects zero public key', () => {
            // Arrange:
            const keyPair = randomKeyPair();
            keyPair.publicKey.fill(0);

            const payload = Crypto.randomBytes(100);
            const signature = KeyPair.sign(keyPair, payload, mijinTestSignSchema);

            // Act:
            const isVerified = KeyPair.verify(keyPair.publicKey, payload, signature, mijinTestSignSchema);

            // Assert:
            expect(isVerified).to.equal(false);
        });

        it('cannot verify non canonical signature', () => {
            function scalarAddGroupOrder(scalar) {
                // 2^252 + 27742317777372353535851937790883648493, little endian
                const Group_Order = [
                    0xed, 0xd3, 0xf5, 0x5c, 0x1a, 0x63, 0x12, 0x58, 0xd6, 0x9c, 0xf7, 0xa2, 0xde, 0xf9, 0xde, 0x14,
                    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x10,
                ];

                let r = 0;
                for (let i = 0; i < scalar.length; ++i) {
                    const t = scalar[i] + Group_Order[i];
                    scalar[i] += Group_Order[i] + r;
                    r = (t >> 8) & 0xFF;
                }
            }

            // Arrange:
            const keyPair = randomKeyPair();
            const payload = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
            const canonicalSignature = KeyPair.sign(keyPair, payload, mijinTestSignSchema);

            // this is signature with group order added to 'encodedS' part of signature
            const nonCanonicalSignature = canonicalSignature.slice();
            scalarAddGroupOrder(nonCanonicalSignature.subarray(32));

            // Act:
            const isCanonicalVerified = KeyPair.verify(keyPair.publicKey, payload, canonicalSignature, mijinTestSignSchema);
            const isNonCanonicalVerified = KeyPair.verify(keyPair.privateKey, payload, nonCanonicalSignature, mijinTestSignSchema);

            // Assert:
            expect(isCanonicalVerified).to.equal(true);
            expect(isNonCanonicalVerified).to.equal(false);
        });
    });

    describe('derive shared key', () => {

        it('derives same shared key for both partners', () => {
            // Arrange:
            const keyPair1 = randomKeyPair();
            const keyPair2 = randomKeyPair();

            // Act:
            const sharedKey1 = KeyPair.deriveSharedKey(keyPair1, keyPair2.publicKey, mijinTestSignSchema);
            const sharedKey2 = KeyPair.deriveSharedKey(keyPair2, keyPair1.publicKey, mijinTestSignSchema);

            // Assert:
            expect(sharedKey1).to.deep.equal(sharedKey2);
        });

        it('derives different shared keys for different partners', () => {
            // Arrange:
            const keyPair = randomKeyPair();
            const publicKey1 = Crypto.randomBytes(32);
            const publicKey2 = Crypto.randomBytes(32);

            // Act:
            const sharedKey1 = KeyPair.deriveSharedKey(keyPair, publicKey1, mijinTestSignSchema);
            const sharedKey2 = KeyPair.deriveSharedKey(keyPair, publicKey2, mijinTestSignSchema);

            // Assert:
            expect(sharedKey1).to.not.deep.equal(sharedKey2);
        });

        it('can derive deterministic shared key from well known inputs', () => {
            // Arrange:
            const keyPair = KeyPair.createKeyPairFromPrivateKeyString(
                '8F545C2816788AB41D352F236D80DBBCBC34705B5F902EFF1F1D88327C7C1300', mijinTestSignSchema);
            const publicKey = Convert.hexToUint8('BF684FB1A85A8C8091EE0442EDDB22E51683802AFA0C0E7C6FE3F3E3E87A8D72');

            // Act:
            const sharedKey = KeyPair.deriveSharedKey(keyPair, publicKey, mijinTestSignSchema);

            // Assert:
            expect(Convert.uint8ToHex(sharedKey)).to.equal('9E2DF6A12BABD5673F02C5B81898A03AC2E2D152639502E3DCECEF7C91C115F6');
        });
    });

    /**
     * @see https://github.com/nemtech/test-vectors/blob/master/3.test-derive-nis1.json
     */
    describe('derive shared key - Test Vecto NIS1', () => {
        it('derive shared key using keccak', () => {
            // Arrange: create a salt that is too long
            // Arrange:
            const Nis1_Private_Key = [
                '00137c7c32881d1fff2e905f5b7034bcbcdb806d232f351db48a7816285c548f',
                'e8857f8e488d4e6d4b71bcd44bb4cff49208c32651e1f6500c3b58cafeb8def6',
                'd7f67b5f52cbcd1a1367e0376a8eb1012b634acfcf35e8322bae8b22bb9e8dea',
                'd026ddb445fb3bbf3020e4b55ed7b5f9b7fd1278c34978ca1a6ed6b358dadbae',
                'c522b38c391d1c3fa539cc58802bc66ac34bb3c73accd7f41b47f539bedcd016',
            ];

            const Nis1_Public_Keys = [
                '4C3B71636D3088ED3DF93D81E9169604EF0D4D68107BE0B446715DC12096243B',
                '3B2BE0C315CDA77876D70845FD355D46E6825BA26985ABAB3E07B65C71266126',
                '536D5C32538C8E66623F2E4F0FA7E124EF0AF1F0DBC97338C61188F37C4937EA',
                'FA9AF9448E76D1D0B6EBE05336D813918315B4941F78C1CC5EA1D1573177022C',
                '63ABC887EAD7B80247244E0C58CB7689C313444F4924278DBEA72DDB3391F9DA',
            ];

            const Nis1_Salt = [
                '422c39df16aae42a74a5597d6ee2d59cfb4eeb6b3f26d98425b9163a03daa3b5',
                'ad63ac08f9afc85eb0bf4f8881ca6eaa0215924c87aa2f137d56109bb76c6f98',
                '96104f0a28f9cca40901c066cd435134662a3b053eb6c8df80ee0d05dc941963',
                'd8f94a0bbb1de80aea17aab42e2ffb982e73fc49b649a318479e951e392d8728',
                '3f8c969678a8abdbfb76866a142c284a6f01636c1c1607947436e0d2c30d5245',
            ];

            const Expected_Derived_Key = [
                '1E203DF5CD53961AAF75B24EFD5548AB6F01F0E9EF1C0C721F6A0ECAAF91AC9A',
                'E77654455AACFADE2E3291E3B88191847D06295CAE7160D55FB32E6D86A48C17',
                '0368A074CA19F446659DF7BA04B2CE92F6BDCB423510D69223BD75E3827F0893',
                '2F58733AB16A170B8389C39F5BA10509E59EC803CF9168739C693D0E6035A402',
                '28DB21A1EBA731E85B0A58109CA273AF4B461726F5A5F62951777C3DCCD9281C',
            ];

            for (let i = 0; i < Nis1_Private_Key.length; ++i) {
                // Arrange:
                const privateKey = Nis1_Private_Key[i];
                const keyPair = KeyPair.createKeyPairFromPrivateKeyString(privateKey, nis1TestSignSchema);
                const publicKey = Convert.hexToUint8(Nis1_Public_Keys[i]);

                // Act:
                const sharedKey = Convert.uint8ToHex(KeyPair.deriveSharedKey(keyPair, publicKey, nis1TestSignSchema));

                // Assert:
                const message = ` from ${Nis1_Private_Key[i]}`;
                expect(sharedKey.toUpperCase()).to.deep.equal(Expected_Derived_Key[i].toUpperCase());
            }
        });
    });

    /**
     * @see https://github.com/nemtech/test-vectors/blob/master/3.test-derive-catapult.json
     */
    describe('derive shared key - Test Vecto Catapult', () => {
        it('derive shared key using sha3', () => {
            // Arrange: create a salt that is too long
            // Arrange:
            const Private_Key = [
                '00137c7c32881d1fff2e905f5b7034bcbcdb806d232f351db48a7816285c548f',
                'e8857f8e488d4e6d4b71bcd44bb4cff49208c32651e1f6500c3b58cafeb8def6',
                'd7f67b5f52cbcd1a1367e0376a8eb1012b634acfcf35e8322bae8b22bb9e8dea',
                'd026ddb445fb3bbf3020e4b55ed7b5f9b7fd1278c34978ca1a6ed6b358dadbae',
                'c522b38c391d1c3fa539cc58802bc66ac34bb3c73accd7f41b47f539bedcd016',
            ];

            const Public_Keys = [
                '134A753D1FBC098879D3EC04F67EF661B2976B15C6037F7961AA343DC23D9D5E',
                '2B3CFEF43CEE139691F466643F779EC3CEBFC9B1AB92DBA87FF9AC8E5F49B454',
                '31C960BF74D53DE0EA92E11DE39DC69D60F1133131F634C2C2595F05E35B687E',
                'FDA70F88C7985C5B7D8BDE4CD6C2162E1DF0C7F44555125B6EA54E87958F6722',
                '9896A394B035E0F18855B2F6EE934E20ABADBF6B65B26E0C9329C283C1A9F980',
            ];

            const Salt = [
                '422c39df16aae42a74a5597d6ee2d59cfb4eeb6b3f26d98425b9163a03daa3b5',
                'ad63ac08f9afc85eb0bf4f8881ca6eaa0215924c87aa2f137d56109bb76c6f98',
                '96104f0a28f9cca40901c066cd435134662a3b053eb6c8df80ee0d05dc941963',
                'd8f94a0bbb1de80aea17aab42e2ffb982e73fc49b649a318479e951e392d8728',
                '3f8c969678a8abdbfb76866a142c284a6f01636c1c1607947436e0d2c30d5245',
            ];

            const Expected_Derived_Key = [
                '8ADE930F8352A5D2B42B575B698C8791834525CBB1A3C94F814DA676922EDBBD',
                'C831BAFDF301F3E7A2910557B14EAEE054F8072A5E3C58797DF2F7EAD6C2F8E2',
                '9C885AA670354E517320403E6E613FD076F486A3C6F986F3D7605F36D542F705',
                '857312941280887C38FA7077AA808C52C755A27EAEAC1220A2F404CFDABBA131',
                '85F5C2F191D2E3A3833C63059566D11B8EA552775AE0002D237BC35B5439FB59',
            ];

            for (let i = 0; i < Private_Key.length; ++i) {
                // Arrange:
                const keyPair = KeyPair.createKeyPairFromPrivateKeyString(Private_Key[i], mijinTestSignSchema);
                const publicKey = Convert.hexToUint8(Public_Keys[i]);

                // Act:
                const sharedKey = Convert.uint8ToHex(KeyPair.deriveSharedKey(keyPair, publicKey, mijinTestSignSchema));

                // Assert:
                const message = ` from ${Private_Key[i]}`;
                expect(sharedKey.toUpperCase()).to.deep.equal(Expected_Derived_Key[i].toUpperCase());
            }
        });
    });
});
