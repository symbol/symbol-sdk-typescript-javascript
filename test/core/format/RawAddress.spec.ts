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

    /**
     * @see https://raw.githubusercontent.com/nemtech/test-vectors/master/1.test-address-nis1.json
     */
    describe('NIS1 test vector [PublicNet] - PublicKey to Address', () => {
        it('can create Address from NIS public Key', () => {
            // Arrange:
            const Public_Keys = [
                'd6c3845431236c5a5a907a9e45bd60da0e12efd350b970e7f58e3499e2e7a2f0',
                'f3bd51add90a7be8ed81f64eee9456af3b38478275b17eabe1853dfcfd3bf2cd',
                '017cb008d00e41d17a6a09a6be5c65c89e1e28706a621b0791b270e4f6182cc3',
                '60068a23a0893538b5c364cac86cb8670668be84aee2b6fcff83fdf39a03f822',
                'ae054ef2a458a0cee6b34a1dd32597a9236c4d453040b9af58b5ae22a73024b7',
            ];

            const Addresses = [
                'NCFGSLITSWMRROU2GO7FPMIUUDELUPSZUNJABUMH',
                'NAAPGLKY7HZNQJYM4T6JEKM4NU6M2MOBIV3T4GNF',
                'NCF5QZSBRM2CXTXIG3YWXZ7X6NARCF5JMD55OCV6',
                'NC3U645TJAVWXXYOLRQIX7GIZEVZWLN5W44Z3KZT',
                'NBLWRN5WLGP5MUBKMDQCHK6BWJL2LSJRVMDT7HQD',
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
                'd6c3845431236c5a5a907a9e45bd60da0e12efd350b970e7f58e3499e2e7a2f0',
                'f3bd51add90a7be8ed81f64eee9456af3b38478275b17eabe1853dfcfd3bf2cd',
                '017cb008d00e41d17a6a09a6be5c65c89e1e28706a621b0791b270e4f6182cc3',
                '60068a23a0893538b5c364cac86cb8670668be84aee2b6fcff83fdf39a03f822',
                'ae054ef2a458a0cee6b34a1dd32597a9236c4d453040b9af58b5ae22a73024b7',
            ];

            const Addresses = [
                'TCFGSLITSWMRROU2GO7FPMIUUDELUPSZUNUEZF33',
                'TAAPGLKY7HZNQJYM4T6JEKM4NU6M2MOBIXGXU3O6',
                'TCF5QZSBRM2CXTXIG3YWXZ7X6NARCF5JMB6EXFEQ',
                'TC3U645TJAVWXXYOLRQIX7GIZEVZWLN5W7JQHW5U',
                'TBLWRN5WLGP5MUBKMDQCHK6BWJL2LSJRVO7ZCX3R',
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
