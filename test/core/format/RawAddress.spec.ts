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
import {
    Convert as convert,
    RawAddress as address,
} from '../../../src/core/format';
import { NetworkType } from '../../../src/model/model';

const Address_Decoded_Size = 25;

describe('address', () => {
    describe('stringToAddress', () => {
        function assertCannotCreateAddress(encoded, message) {
            // Assert:
            expect(() => {
                address.stringToAddress(encoded);
            }).to.throw(message);
        }

        it('can create address from valid encoded address', () => {
            // Arrange:
            const encoded = 'NAR3W7B4BCOZSZMFIZRYB3N5YGOUSWIYJCJ6HDFG';
            const expectedHex = '6823BB7C3C089D996585466380EDBDC19D4959184893E38CA6';

            // Act:
            const decoded = address.stringToAddress(encoded);

            // Assert:
            expect(address.isValidAddress(decoded, NetworkType.MIJIN_TEST)).to.equal(true);
            expect(convert.uint8ToHex(decoded)).to.equal(expectedHex);
        });

        it('cannot create address from encoded string with wrong length', () => {
            // Assert:
            assertCannotCreateAddress(
                'NC5J5DI2URIC4H3T3IMXQS25PWQWZIPEV6EV7LASABCDEFGH',
                'NC5J5DI2URIC4H3T3IMXQS25PWQWZIPEV6EV7LASABCDEFGH does not represent a valid encoded address',
            );
        });

        it('cannot create address from invalid encoded string', () => {
            // Assert:
            assertCannotCreateAddress('NC5(5DI2URIC4H3T3IMXQS25PWQWZIPEV6EV7LAS', 'illegal base32 character (');
            assertCannotCreateAddress('NC5J1DI2URIC4H3T3IMXQS25PWQWZIPEV6EV7LAS', 'illegal base32 character 1');
            assertCannotCreateAddress('NC5J5?I2URIC4H3T3IMXQS25PWQWZIPEV6EV7LAS', 'illegal base32 character ?');
        });
    });

    describe('addressToString', () => {
        it('can create encoded address from address', () => {
            // Arrange:
            const decodedHex = '6823BB7C3C089D996585466380EDBDC19D4959184893E38CA6';
            const expected = 'NAR3W7B4BCOZSZMFIZRYB3N5YGOUSWIYJCJ6HDFG';

            // Act:
            const encoded = address.addressToString(convert.hexToUint8(decodedHex));

            // Assert:
            expect(encoded).to.equal(expected);
        });
    });

    describe('publicKeyToAddress', () => {
        it('can create address from public key for well known network', () => {
            // Arrange:
            const expectedHex = '6023BB7C3C089D996585466380EDBDC19D49591848B3727714';
            const publicKey = convert.hexToUint8('3485D98EFD7EB07ADAFCFD1A157D89DE2796A95E780813C0258AF3F5F84ED8CB');

            // Act:
            const decoded = address.publicKeyToAddress(publicKey, NetworkType.MIJIN);

            // Assert:
            expect(decoded[0]).to.equal(NetworkType.MIJIN);
            expect(address.isValidAddress(decoded, NetworkType.MIJIN)).to.equal(true);
            expect(convert.uint8ToHex(decoded)).to.equal(expectedHex);
        });

        it('can create address from public key for custom network', () => {
            // Arrange:
            const expectedHex = '9023BB7C3C089D996585466380EDBDC19D495918486F4F86A7';
            const publicKey = convert.hexToUint8('3485D98EFD7EB07ADAFCFD1A157D89DE2796A95E780813C0258AF3F5F84ED8CB');

            // Act:
            const decoded = address.publicKeyToAddress(publicKey, NetworkType.MIJIN_TEST);

            // Assert:
            expect(decoded[0]).to.equal(NetworkType.MIJIN_TEST);
            expect(address.isValidAddress(decoded, NetworkType.MIJIN_TEST)).to.equal(true);
            expect(convert.uint8ToHex(decoded)).to.equal(expectedHex);
        });

        it('address calculation is deterministic', () => {
            // Arrange:
            const publicKey = convert.hexToUint8('3485D98EFD7EB07ADAFCFD1A157D89DE2796A95E780813C0258AF3F5F84ED8CB');

            // Act:
            const decoded1 = address.publicKeyToAddress(publicKey, NetworkType.MIJIN_TEST);
            const decoded2 = address.publicKeyToAddress(publicKey, NetworkType.MIJIN_TEST);

            // Assert:
            expect(address.isValidAddress(decoded1, NetworkType.MIJIN_TEST)).to.equal(true);
            expect(decoded1).to.deep.equal(decoded2);
        });

        it('different public keys result in different addresses', () => {
            // Arrange:
            const publicKey1 = convert.hexToUint8('1464953393CE96A08ABA6184601FD08864E910696B060FF7064474726E666CA8');
            const publicKey2 = convert.hexToUint8('b4f12e7c9f6946091e2cb8b6d3a12b50d17ccbbf646386ea27ce2946a7423dcf');

            // Act:
            const decoded1 = address.publicKeyToAddress(publicKey1, NetworkType.MIJIN_TEST);
            const decoded2 = address.publicKeyToAddress(publicKey2, NetworkType.MIJIN_TEST);

            // Assert:
            expect(address.isValidAddress(decoded1, NetworkType.MIJIN_TEST)).to.equal(true);
            expect(address.isValidAddress(decoded2, NetworkType.MIJIN_TEST)).to.equal(true);
            expect(decoded1).to.not.deep.equal(decoded2);
        });

        it('different networks result in different addresses', () => {
            // Arrange:
            const publicKey = convert.hexToUint8('b4f12e7c9f6946091e2cb8b6d3a12b50d17ccbbf646386ea27ce2946a7423dcf');

            // Act:
            const decoded1 = address.publicKeyToAddress(publicKey, NetworkType.MIJIN_TEST);
            const decoded2 = address.publicKeyToAddress(publicKey, NetworkType.TEST_NET);

            // Assert:
            expect(address.isValidAddress(decoded1, NetworkType.MIJIN_TEST)).to.equal(true);
            expect(address.isValidAddress(decoded2, NetworkType.TEST_NET)).to.equal(true);
            expect(decoded1).to.not.deep.equal(decoded2);
        });

        it('can create address from public key using NIS1 schema', () => {
            const nonKeccakHex = '9823BB7C3C089D996585466380EDBDC19D495918484BF7E997';
            const keccakHex = '981A00208CDDCC647BF1E065E93824FAA732AAB187CC1A9B02';
            const publicKey = convert.hexToUint8('3485D98EFD7EB07ADAFCFD1A157D89DE2796A95E780813C0258AF3F5F84ED8CB');

            // Act:
            const decoded = address.publicKeyToAddress(publicKey, NetworkType.TEST_NET);

            // Assert:
            expect(decoded[0]).to.equal(NetworkType.TEST_NET);
            expect(address.isValidAddress(decoded, NetworkType.TEST_NET)).to.equal(true);
            expect(convert.uint8ToHex(decoded)).to.equal(keccakHex);
            expect(convert.uint8ToHex(decoded)).not.to.equal(nonKeccakHex);
        });
    });

    describe('isValidAddress', () => {
        it('returns true for valid address', () => {
            // Arrange:
            const validHex = '6823BB7C3C089D996585466380EDBDC19D4959184893E38CA6';
            const decoded = convert.hexToUint8(validHex);

            // Assert:
            expect(address.isValidAddress(decoded, NetworkType.MIJIN_TEST)).to.equal(true);
        });

        it('returns false for address with invalid checksum', () => {
            // Arrange:
            const validHex = '6823BB7C3C089D996585466380EDBDC19D4959184893E38CA6';
            const decoded = convert.hexToUint8(validHex);
            decoded[Address_Decoded_Size - 1] ^= 0xff; // ruin checksum

            // Assert:
            expect(address.isValidAddress(decoded, NetworkType.MIJIN_TEST)).to.equal(false);
        });

        it('returns false for address with invalid hash', () => {
            // Arrange:
            const validHex = '6823BB7C3C089D996585466380EDBDC19D4959184893E38CA6';
            const decoded = convert.hexToUint8(validHex);
            decoded[5] ^= 0xff; // ruin ripemd160 hash

            // Assert:
            expect(address.isValidAddress(decoded, NetworkType.MIJIN_TEST)).to.equal(false);
        });
    });

    describe('isValidEncodedAddress', () => {
        it('returns true for valid encoded address', () => {
            // Arrange:
            const encoded = 'NAR3W7B4BCOZSZMFIZRYB3N5YGOUSWIYJCJ6HDFG';

            // Assert:
            expect(address.isValidEncodedAddress(encoded, NetworkType.MIJIN_TEST)).to.equal(true);
        });

        it('returns false for invalid encoded address', () => {
            // Arrange: changed last char
            const encoded = 'NAR3W7B4BCOZSZMFIZRYB3N5YGOUSWIYJCJ6HDFH';

            // Assert:
            expect(address.isValidEncodedAddress(encoded, NetworkType.MIJIN_TEST)).to.equal(false);
        });

        it('returns false for encoded address with wrong length', () => {
            // Arrange: added ABC
            const encoded = 'NAR3W7B4BCOZSZMFIZRYB3N5YGOUSWIYJCJ6HDFGABC';

            // Assert:
            expect(address.isValidEncodedAddress(encoded, NetworkType.MIJIN_TEST)).to.equal(false);
        });

        it('adding leading or trailing white space invalidates encoded address', () => {
            // Arrange:
            const encoded = 'NAR3W7B4BCOZSZMFIZRYB3N5YGOUSWIYJCJ6HDFG';

            // Assert:
            expect(address.isValidEncodedAddress(`   \t    ${encoded}`, NetworkType.MIJIN_TEST)).to.equal(false);
            expect(address.isValidEncodedAddress(`${encoded}   \t    `, NetworkType.MIJIN_TEST)).to.equal(false);
            expect(address.isValidEncodedAddress(`   \t    ${encoded}   \t    `, NetworkType.MIJIN_TEST)).to.equal(false);
        });
    });

    /**
     * @see https://raw.githubusercontent.com/nemtech/test-vectors/master/1.test-address-nis1.json
     */
    describe('NIS1 test vector [PublicNet] - PublicKey to Address', () => {
        it('can create Address from NIS public Key', () => {
            // Arrange:
            const Public_Keys = [
                'c5f54ba980fcbb657dbaaa42700539b207873e134d2375efeab5f1ab52f87844',
                '96eb2a145211b1b7ab5f0d4b14f8abc8d695c7aee31a3cfc2d4881313c68eea3',
                '2d8425e4ca2d8926346c7a7ca39826acd881a8639e81bd68820409c6e30d142a',
                '4feed486777ed38e44c489c7c4e93a830e4c4a907fa19a174e630ef0f6ed0409',
                '83ee32e4e145024d29bca54f71fa335a98b3e68283f1a3099c4d4ae113b53e54',
            ];

            const Addresses = [
                'NDD2CT6LQLIYQ56KIXI3ENTM6EK3D44P5JFXJ4R4',
                'NABHFGE5ORQD3LE4O6B7JUFN47ECOFBFASC3SCAC',
                'NAVOZX4HDVOAR4W6K4WJHWPD3MOFU27DFHC7KZOZ',
                'NBZ6JK5YOCU6UPSSZ5D3G27UHAPHTY5HDQMGE6TT',
                'NCQW2P5DNZ5BBXQVGS367DQ4AHC3RXOEVGRCLY6V',
            ];

            // Sanity:
            expect(Public_Keys.length).equal(Addresses.length);

            for (let i = 0; i < Public_Keys.length; ++i) {
                // Arrange:
                const publicKeyHex = Public_Keys[i];
                const expectedAddress = Addresses[i];

                // Act:
                const result = address.addressToString(
                        address.publicKeyToAddress(convert.hexToUint8(publicKeyHex), NetworkType.MAIN_NET));

                // Assert:
                const message = ` from ${publicKeyHex}`;
                expect(result.toUpperCase(), `public ${message}`).equal(expectedAddress.toUpperCase());
            }
        });
    });

    /**
     * @see https://raw.githubusercontent.com/nemtech/test-vectors/master/1.test-address-nis1.json
     */
    describe('NIS1 test vector [PublicTest] - PublicKey to Address', () => {
        it('can create Address from NIS public Key', () => {
            // Arrange:
            const Public_Keys = [
                'c5f54ba980fcbb657dbaaa42700539b207873e134d2375efeab5f1ab52f87844',
                '96eb2a145211b1b7ab5f0d4b14f8abc8d695c7aee31a3cfc2d4881313c68eea3',
                '2d8425e4ca2d8926346c7a7ca39826acd881a8639e81bd68820409c6e30d142a',
                '4feed486777ed38e44c489c7c4e93a830e4c4a907fa19a174e630ef0f6ed0409',
                '83ee32e4e145024d29bca54f71fa335a98b3e68283f1a3099c4d4ae113b53e54',
            ];

            const Addresses = [
                'TDD2CT6LQLIYQ56KIXI3ENTM6EK3D44P5KZPFMK2',
                'TABHFGE5ORQD3LE4O6B7JUFN47ECOFBFATE53N2I',
                'TAVOZX4HDVOAR4W6K4WJHWPD3MOFU27DFEJDR2PR',
                'TBZ6JK5YOCU6UPSSZ5D3G27UHAPHTY5HDQCDS5YA',
                'TCQW2P5DNZ5BBXQVGS367DQ4AHC3RXOEVFZOQCJ6',
            ];

            // Sanity:
            expect(Public_Keys.length).equal(Addresses.length);

            for (let i = 0; i < Public_Keys.length; ++i) {
                // Arrange:
                const publicKeyHex = Public_Keys[i];
                const expectedAddress = Addresses[i];

                // Act:
                const result = address.addressToString(
                        address.publicKeyToAddress(convert.hexToUint8(publicKeyHex), NetworkType.TEST_NET));

                // Assert:
                const message = ` from ${publicKeyHex}`;
                expect(result.toUpperCase(), `public ${message}`).equal(expectedAddress.toUpperCase());
            }
        });
    });

    /**
     * @see https://raw.githubusercontent.com/nemtech/test-vectors/master/1.test-address-catapult.json
     */
    describe('Catapult test vector [PublicNet] - PublicKey to Address', () => {
        it('can create Address from Catapult public Key', () => {
            // Arrange:
            const Public_Keys = [
                'BD8D3F8B7E1B3839C650F458234AB1FF87CDB1EDA36338D9E446E27D454717F2',
                '26821636A618FD524A3AB57276EFC36CAF787DF19EE00F60035CE376A18E8C47',
                'DFC7F40FC549AC8BB2EF097600103FF457A1D7DC5755D434474761459B030E6F',
                '96C7AB358EBB91104322C56435642BD939A77432286B229372987FC366EA319F',
                '9488CFB5D7D439213B11FA80C1B57E8A7AB7E41B64CBA18A89180D412C04915C',
            ];

            const Addresses = [
                'MDIPRQMB3HT7A6ZKV7HOHJQM7JHX6H3FN5YHHZMD',
                'MC65QJI4OWTUFJNQ2IDVOMUTE7IDI2EGEEZ6ADFH',
                'MCBC4VAQBVSB4J5J2PTFM7OUY5CYDL33VUHV7FNU',
                'MBLW3CQPBGPCFAXG4XM5GDEVLPESCPDPFN4NBABW',
                'MA5RDU36TKBTW4KVSSPD7PT5YTUMD7OIJEMAYYMV',
            ];

            // Sanity:
            expect(Public_Keys.length).equal(Addresses.length);

            for (let i = 0; i < Public_Keys.length; ++i) {
                // Arrange:
                const publicKeyHex = Public_Keys[i];
                const expectedAddress = Addresses[i];

                // Act:
                const result = address.addressToString(
                        address.publicKeyToAddress(convert.hexToUint8(publicKeyHex), NetworkType.MIJIN));

                // Assert:
                const message = ` from ${publicKeyHex}`;
                expect(result.toUpperCase(), `public ${message}`).equal(expectedAddress.toUpperCase());
            }
        });
    });

    /**
     * @see https://raw.githubusercontent.com/nemtech/test-vectors/master/1.test-address-catapult.json
     */
    describe('Catapult test vector [PublicTest] - PublicKey to Address', () => {
        it('can create Address from Catapult public Key', () => {
            // Arrange:
            const Public_Keys = [
                'BD8D3F8B7E1B3839C650F458234AB1FF87CDB1EDA36338D9E446E27D454717F2',
                '26821636A618FD524A3AB57276EFC36CAF787DF19EE00F60035CE376A18E8C47',
                'DFC7F40FC549AC8BB2EF097600103FF457A1D7DC5755D434474761459B030E6F',
                '96C7AB358EBB91104322C56435642BD939A77432286B229372987FC366EA319F',
                '9488CFB5D7D439213B11FA80C1B57E8A7AB7E41B64CBA18A89180D412C04915C',
            ];

            const Addresses = [
                'SDIPRQMB3HT7A6ZKV7HOHJQM7JHX6H3FN5EIRD3D',
                'SC65QJI4OWTUFJNQ2IDVOMUTE7IDI2EGEGTDOMI3',
                'SCBC4VAQBVSB4J5J2PTFM7OUY5CYDL33VVLQRCX6',
                'SBLW3CQPBGPCFAXG4XM5GDEVLPESCPDPFNJYN46J',
                'SA5RDU36TKBTW4KVSSPD7PT5YTUMD7OIJGV24AZM',
            ];

            // Sanity:
            expect(Public_Keys.length).equal(Addresses.length);

            for (let i = 0; i < Public_Keys.length; ++i) {
                // Arrange:
                const publicKeyHex = Public_Keys[i];
                const expectedAddress = Addresses[i];

                // Act:
                const result = address.addressToString(
                        address.publicKeyToAddress(convert.hexToUint8(publicKeyHex), NetworkType.MIJIN_TEST));

                // Assert:
                const message = ` from ${publicKeyHex}`;
                expect(result.toUpperCase(), `public ${message}`).equal(expectedAddress.toUpperCase());
            }
        });
    });

    /**
     * @see https://raw.githubusercontent.com/nemtech/test-vectors/master/1.test-address-catapult.json
     */
    describe('Catapult test vector [MIJIN] - PublicKey to Address', () => {
        it('can create Address from Catapult public Key', () => {
            // Arrange:
            const Public_Keys = [
                'BD8D3F8B7E1B3839C650F458234AB1FF87CDB1EDA36338D9E446E27D454717F2',
                '26821636A618FD524A3AB57276EFC36CAF787DF19EE00F60035CE376A18E8C47',
                'DFC7F40FC549AC8BB2EF097600103FF457A1D7DC5755D434474761459B030E6F',
                '96C7AB358EBB91104322C56435642BD939A77432286B229372987FC366EA319F',
                '9488CFB5D7D439213B11FA80C1B57E8A7AB7E41B64CBA18A89180D412C04915C',
            ];

            const Addresses = [
                'MDIPRQMB3HT7A6ZKV7HOHJQM7JHX6H3FN5YHHZMD',
                'MC65QJI4OWTUFJNQ2IDVOMUTE7IDI2EGEEZ6ADFH',
                'MCBC4VAQBVSB4J5J2PTFM7OUY5CYDL33VUHV7FNU',
                'MBLW3CQPBGPCFAXG4XM5GDEVLPESCPDPFN4NBABW',
                'MA5RDU36TKBTW4KVSSPD7PT5YTUMD7OIJEMAYYMV',
            ];

            // Sanity:
            expect(Public_Keys.length).equal(Addresses.length);

            for (let i = 0; i < Public_Keys.length; ++i) {
                // Arrange:
                const publicKeyHex = Public_Keys[i];
                const expectedAddress = Addresses[i];

                // Act:
                const result = address.addressToString(
                        address.publicKeyToAddress(convert.hexToUint8(publicKeyHex), NetworkType.MIJIN));

                // Assert:
                const message = ` from ${publicKeyHex}`;
                expect(result.toUpperCase(), `public ${message}`).equal(expectedAddress.toUpperCase());
            }
        });
    });

    /**
     * @see https://raw.githubusercontent.com/nemtech/test-vectors/master/1.test-address-catapult.json
     */
    describe('Catapult test vector [MIJIN_TEST] - PublicKey to Address', () => {
        it('can create Address from Catapult public Key', () => {
            // Arrange:
            const Public_Keys = [
                'BD8D3F8B7E1B3839C650F458234AB1FF87CDB1EDA36338D9E446E27D454717F2',
                '26821636A618FD524A3AB57276EFC36CAF787DF19EE00F60035CE376A18E8C47',
                'DFC7F40FC549AC8BB2EF097600103FF457A1D7DC5755D434474761459B030E6F',
                '96C7AB358EBB91104322C56435642BD939A77432286B229372987FC366EA319F',
                '9488CFB5D7D439213B11FA80C1B57E8A7AB7E41B64CBA18A89180D412C04915C',
            ];

            const Addresses = [
                'SDIPRQMB3HT7A6ZKV7HOHJQM7JHX6H3FN5EIRD3D',
                'SC65QJI4OWTUFJNQ2IDVOMUTE7IDI2EGEGTDOMI3',
                'SCBC4VAQBVSB4J5J2PTFM7OUY5CYDL33VVLQRCX6',
                'SBLW3CQPBGPCFAXG4XM5GDEVLPESCPDPFNJYN46J',
                'SA5RDU36TKBTW4KVSSPD7PT5YTUMD7OIJGV24AZM',
            ];

            // Sanity:
            expect(Public_Keys.length).equal(Addresses.length);

            for (let i = 0; i < Public_Keys.length; ++i) {
                // Arrange:
                const publicKeyHex = Public_Keys[i];
                const expectedAddress = Addresses[i];

                // Act:
                const result = address.addressToString(
                        address.publicKeyToAddress(convert.hexToUint8(publicKeyHex), NetworkType.MIJIN_TEST));

                // Assert:
                const message = ` from ${publicKeyHex}`;
                expect(result.toUpperCase(), `public ${message}`).equal(expectedAddress.toUpperCase());
            }
        });
    });
});
