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
import { Crypto, KeyPair } from '../../../src/core/crypto';
import * as Utility from '../../../src/core/crypto/Utilities';
import { Convert } from '../../../src/core/format/Convert';
import { NetworkType } from '../../../src/model/blockchain/NetworkType';

describe('key pair', () => {
    const randomKeyPair = () =>
        KeyPair.createKeyPairFromPrivateKeyString(Convert.uint8ToHex(Crypto.randomBytes(32)));
    const Private_Key_Size = 32;
    const Signature_Size = 64;

    const Private_Keys = [
        '575dbb3062267eff57c970a336ebbc8fbcfe12c5bd3ed7bc11eb0481d7704ced'.toUpperCase(),
        '5b0e3fa5d3b49a79022d7c1e121ba1cbbf4db5821f47ab8c708ef88defc29bfe'.toUpperCase(),
        '738ba9bb9110aea8f15caa353aca5653b4bdfca1db9f34d0efed2ce1325aeeda'.toUpperCase(),
        'e8bf9bc0f35c12d8c8bf94dd3a8b5b4034f1063948e3cc5304e55e31aa4b95a6'.toUpperCase(),
        'c325ea529674396db5675939e7988883d59a5fc17a28ca977e3ba85370232a83'.toUpperCase(),
    ];
     /**
      * @see https://github.com/nemtech/test-vectors/blob/master/1.test-keys.json
      */
    describe('construction', () => {
        it('can extract from private key test vectors', () => {
            // Arrange:
            const Expected_Public_Keys = [
                '2E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F',
                '4875FD2E32875D1BC6567745F1509F0F890A1BF8EE59FA74452FA4183A270E03',
                '9F780097FB6A1F287ED2736A597B8EA7F08D20F1ECDB9935DE6694ECF1C58900',
                '0815926E003CDD5AF0113C0E067262307A42CD1E697F53B683F7E5F9F57D72C9',
                '3683B3E45E76870CFE076E47C2B34CE8E3EAEC26C8AA7C1ED752E3E840AF8A27',
            ];

            // Sanity:
            expect(Private_Keys.length).equal(Expected_Public_Keys.length);

            for (let i = 0; i < Private_Keys.length; ++i) {
                // Arrange:
                const privateKeyHex = Private_Keys[i];
                const expectedPublicKey = Expected_Public_Keys[i];

                // Act:
                const keyPair = KeyPair.createKeyPairFromPrivateKeyString(privateKeyHex);

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
                        KeyPair.createKeyPairFromPrivateKeyString(privateKey);
                    }, `from ${privateKey}`)
                    .to.throw('private key has unexpected size');
            });
        });
    });

    describe('sign & verify- Test Vector', () => {
        /**
         * @see https://github.com/nemtech/test-vectors/blob/master/2.test-sign.json
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
                '31D272F0662915CAC43AB7D721CAF65D8601F52B2E793EA1533E7BC20E04EA97B74859D9209A7B18DFECFD2C4A42D6957628F5357E3FB8B87CF6A888BAB4280E',
                'F21E4BE0A914C0C023F724E1EAB9071A3743887BB8824CB170404475873A827B301464261E93700725E8D4427A3E39D365AFB2C9191F75D33C6BE55896E0CC00',
                '939CD8932093571E24B21EA53F1359279BA5CFC32CE99BB020E676CF82B0AA1DD4BC76FCDE41EF784C06D122B3D018135352C057F079C926B3EFFA7E73CF1D06',
                '9B4AFBB7B96CAD7726389C2A4F31115940E6EEE3EA29B3293C82EC8C03B9555C183ED1C55CA89A58C17729EFBA76A505C79AA40EC618D83124BC1134B887D305',
                '7AF2F0D9B30DE3B6C40605FDD4EBA93ECE39FA7458B300D538EC8D0ABAC1756DEFC0CA84C8A599954313E58CE36EFBA4C24A82FD6BB8127023A58EFC52A8410A',
            ];

            for (let i = 0; i < Catapult_Private_Key.length; ++i) {
                // Arrange:
                const keyPair = KeyPair.createKeyPairFromPrivateKeyString(Catapult_Private_Key[i]);
                const payload = Convert.hexToUint8(Catapult_Data[i]);

                // Act:
                const signature = KeyPair.sign(keyPair, payload);

                // Assert:
                const message = ` from ${Catapult_Private_Key[i]}`;
                expect(Convert.uint8ToHex(signature).toUpperCase(),
                    `private ${message}`).to.deep.equal(Expected_Signature[i].toUpperCase());
                const isVerified = KeyPair.verify(keyPair.publicKey, payload, signature);
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
            const signature = KeyPair.sign(keyPair, payload);

            // Assert:
            expect(signature).to.not.deep.equal(new Uint8Array(Signature_Size));
        });

        it('returns same signature for same data signed by same key pairs', () => {
            // Arrange:
            const privateKey = Convert.uint8ToHex(Crypto.randomBytes(Private_Key_Size));
            const keyPair1 = KeyPair.createKeyPairFromPrivateKeyString(privateKey);
            const keyPair2 = KeyPair.createKeyPairFromPrivateKeyString(privateKey);
            const payload = Crypto.randomBytes(100);

            // Act:
            const signature1 = KeyPair.sign(keyPair1, payload);
            const signature2 = KeyPair.sign(keyPair2, payload);

            // Assert:
            expect(signature2).to.deep.equal(signature1);
        });

        it('returns different signature for same data signed by different key pairs', () => {
            // Arrange:
            const keyPair1 = randomKeyPair();
            const keyPair2 = randomKeyPair();
            const payload = Crypto.randomBytes(100);

            // Act:
            const signature1 = KeyPair.sign(keyPair1, payload);
            const signature2 = KeyPair.sign(keyPair2, payload);

            // Assert:
            expect(signature2).to.not.deep.equal(signature1);
        });

    });

    describe('verify', () => {
        it('returns true for data signed with same key pair', () => {
            // Arrange:
            const keyPair = randomKeyPair();
            const payload = Crypto.randomBytes(100);
            const signature = KeyPair.sign(keyPair, payload);

            // Act:
            const isVerified = KeyPair.verify(keyPair.publicKey, payload, signature);

            // Assert:
            expect(isVerified).to.equal(true);
        });

        it('returns false for data signed with different key pair', () => {
            // Arrange:
            const keyPair1 = randomKeyPair();
            const keyPair2 = randomKeyPair();
            const payload = Crypto.randomBytes(100);
            const signature = KeyPair.sign(keyPair1, payload);

            // Act:
            const isVerified = KeyPair.verify(keyPair2.publicKey, payload, signature);

            // Assert:
            expect(isVerified).to.equal(false);
        });

        it('returns false if signature has been modified', () => {
            // Arrange:
            const keyPair = randomKeyPair();
            const payload = Crypto.randomBytes(100);

            for (let i = 0; i < Signature_Size; i += 4) {
                const signature = KeyPair.sign(keyPair, payload);
                signature[i] ^= 0xFF;

                // Act:
                const isVerified = KeyPair.verify(keyPair.publicKey, payload, signature);

                // Assert:
                expect(isVerified, `signature modified at ${i}`).to.equal(false);
            }
        });

        it('returns false if payload has been modified', () => {
            // Arrange:
            const keyPair = randomKeyPair();
            const payload = Crypto.randomBytes(44);

            for (let i = 0; i < payload.length; i += 4) {
                const signature = KeyPair.sign(keyPair, payload);
                payload[i] ^= 0xFF;

                // Act:
                const isVerified = KeyPair.verify(keyPair.publicKey, payload, signature);

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
            const signature = KeyPair.sign(keyPair, payload);

            // Act:
            const isVerified = KeyPair.verify(keyPair.publicKey, payload, signature);

            // Assert:
            expect(isVerified).to.equal(false);
        });

        it('fails if public key does not correspond to private key', () => {
            // Arrange:
            const keyPair = randomKeyPair();
            const payload = Crypto.randomBytes(100);
            const signature = KeyPair.sign(keyPair, payload);

            for (let i = 0; i < keyPair.publicKey.length; ++i) {
                keyPair.publicKey[i] ^= 0xFF;
            }

            // Act:
            const isVerified = KeyPair.verify(keyPair.publicKey, payload, signature);

            // Assert:
            expect(isVerified).to.equal(false);
        });

        it('rejects zero public key', () => {
            // Arrange:
            const keyPair = randomKeyPair();
            keyPair.publicKey.fill(0);

            const payload = Crypto.randomBytes(100);
            const signature = KeyPair.sign(keyPair, payload);

            // Act:
            const isVerified = KeyPair.verify(keyPair.publicKey, payload, signature);

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
            const canonicalSignature = KeyPair.sign(keyPair, payload);

            // this is signature with group order added to 'encodedS' part of signature
            const nonCanonicalSignature = canonicalSignature.slice();
            scalarAddGroupOrder(nonCanonicalSignature.subarray(32));

            // Act:
            const isCanonicalVerified = KeyPair.verify(keyPair.publicKey, payload, canonicalSignature);
            const isNonCanonicalVerified = KeyPair.verify(keyPair.privateKey, payload, nonCanonicalSignature);

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
            const sharedKey1 = Utility.catapult_crypto.deriveSharedKey(keyPair1.privateKey, keyPair2.publicKey);
            const sharedKey2 = Utility.catapult_crypto.deriveSharedKey(keyPair2.privateKey, keyPair1.publicKey);

            // Assert:
            expect(sharedKey1).to.deep.equal(sharedKey2);
        });

        it('derives different shared keys for different partners', () => {
            // Arrange:
            const keyPair = randomKeyPair();
            const publicKey1 = Crypto.randomBytes(32);
            const publicKey2 = Crypto.randomBytes(32);

            // Act:
            const sharedKey1 = Utility.catapult_crypto.deriveSharedKey(keyPair.privateKey, publicKey1);
            const sharedKey2 = Utility.catapult_crypto.deriveSharedKey(keyPair.privateKey, publicKey2);

            // Assert:
            expect(sharedKey1).to.not.deep.equal(sharedKey2);
        });
    });

    /**
     * @see https://github.com/nemtech/test-vectors/blob/master/3.test-derive.json
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
                'FDEE3C7A41F4717D18B5BFFD685C3C43DFFDC3F8E168AA1B237E1EBF8E9BC869',
                '0531061660549384490453BC61FB7AFDA69D49E961489A4847D8D5AF1749C65B',
                '9A6C6AA5C83019DFF2BC89F4D28D5163F72724F765AA450CB68F9EB6CBFBE20B',
                '4C29246B32541F0469028BDFE0E24A3322163CFB086A17537CA6C1A5858DE222',
                'DA64508E86229035B35D9363A2A3583B0E59D50A25472CED4320B149166F91B0',
            ];

            const Expected_ScalarMulResult = [
                'EAFB74D6778DCF4A55B1758432A13767719FD8AD66A32FF2E3256CEFA4DD7334',
                '03351F60B934BC9635D397A76CA47C25A4B3B78925785931A04F30460F102CE6',
                'C1EFCCDF3DC7E0A898B18D7C13D4433E59F6D5D404B6BB714942822250C0778C',
                '750AA2E689A89D9A25D0C1F4F41BF470CF598126BD958FAB2245DBEB84B5E65F',
                '7247B4916097994EF458A899F7163718A55A4D6CF2C26BA2EFD37A9791DB9EB4',
            ];

            const Expected_Derived_Key = [
                '59BE24D6DB8381DA153CB653134EF7352FA9FDDFD2A9B3727924F7761390C6C1',
                '52C7F2DCD494A14ED50720BAE0CE6792D9E22D450CF492682801294ECAF35932',
                'C8B57A0B117548273422A55801A963F86A4404AE23F3E4986EF655F40927691F',
                '3E8A0DAB3B19B68C176FC349BFE6476A33CCDE7A09292040D98F88DE222495A9',
                'A3B157EFB3B5163CDF24841F11ECB55DEC18567345D0FCB46B072C2399CD364A',
            ];

            for (let i = 0; i < Private_Key.length; ++i) {
                // Arrange:
                const privateKey = Convert.hexToUint8(Private_Key[i]);
                const publicKey = Convert.hexToUint8(Public_Keys[i]);

                // Act:
                const sharedKey = Convert.uint8ToHex(Utility.catapult_crypto.deriveSharedKey(privateKey, publicKey));
                const sharedSecret = Convert.uint8ToHex(Utility.catapult_crypto.deriveSharedSecret(privateKey, publicKey));

                // Assert:
                expect(sharedSecret.toUpperCase()).to.deep.equal(Expected_ScalarMulResult[i].toUpperCase());
                expect(sharedKey.toUpperCase()).to.deep.equal(Expected_Derived_Key[i].toUpperCase());
                expect(sharedSecret.toUpperCase()).to.deep.equal(Expected_ScalarMulResult[i].toUpperCase());
            }
        });
    });
});
