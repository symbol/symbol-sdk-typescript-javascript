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
     * @see https://raw.githubusercontent.com/nemtech/test-vectors/master/1.test-address.json
     */
    describe('Catapult test vector [PublicNet] - PublicKey to Address', () => {
        it('can create Address from Catapult public Key', () => {
            // Arrange:
            const Public_Keys = [
                '2E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F',
                '4875FD2E32875D1BC6567745F1509F0F890A1BF8EE59FA74452FA4183A270E03',
                '9F780097FB6A1F287ED2736A597B8EA7F08D20F1ECDB9935DE6694ECF1C58900',
                '0815926E003CDD5AF0113C0E067262307A42CD1E697F53B683F7E5F9F57D72C9',
                '3683B3E45E76870CFE076E47C2B34CE8E3EAEC26C8AA7C1ED752E3E840AF8A27',
            ];

            const Addresses = [
                'NATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34SQ3365',
                'NDR6EW2WBHJQDYMNGFX2UBZHMMZC5PGL2YCZOQR4',
                'NCOXVZMAZJTT4I3F7EAZYGNGR77D6WPTRH6SYIUT',
                'NDZ4373ASEGJ7S7GQTKF26TIIMC7HK5EWFDDCHAF',
                'NDI5I7Z3BRBAAHTZHGONGOXX742CW4W5QAZ4BMVY',
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
     * @see https://raw.githubusercontent.com/nemtech/test-vectors/master/1.test-address.json
     */
    describe('Catapult test vector [PublicTest] - PublicKey to Address', () => {
        it('can create Address from Catapult public Key', () => {
            // Arrange:
            const Public_Keys = [
                '2E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F',
                '4875FD2E32875D1BC6567745F1509F0F890A1BF8EE59FA74452FA4183A270E03',
                '9F780097FB6A1F287ED2736A597B8EA7F08D20F1ECDB9935DE6694ECF1C58900',
                '0815926E003CDD5AF0113C0E067262307A42CD1E697F53B683F7E5F9F57D72C9',
                '3683B3E45E76870CFE076E47C2B34CE8E3EAEC26C8AA7C1ED752E3E840AF8A27',
            ];

            const Addresses = [
                'TATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA37JGO5UW',
                'TDR6EW2WBHJQDYMNGFX2UBZHMMZC5PGL2YBO3KHD',
                'TCOXVZMAZJTT4I3F7EAZYGNGR77D6WPTRE3VIBRU',
                'TDZ4373ASEGJ7S7GQTKF26TIIMC7HK5EWEPHRSM7',
                'TDI5I7Z3BRBAAHTZHGONGOXX742CW4W5QCY5ZUBR',
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
     * @see https://raw.githubusercontent.com/nemtech/test-vectors/master/1.test-address.json
     */
    describe('Catapult test vector [MIJIN] - PublicKey to Address', () => {
        it('can create Address from Catapult public Key', () => {
            // Arrange:
            const Public_Keys = [
                '2E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F',
                '4875FD2E32875D1BC6567745F1509F0F890A1BF8EE59FA74452FA4183A270E03',
                '9F780097FB6A1F287ED2736A597B8EA7F08D20F1ECDB9935DE6694ECF1C58900',
                '0815926E003CDD5AF0113C0E067262307A42CD1E697F53B683F7E5F9F57D72C9',
                '3683B3E45E76870CFE076E47C2B34CE8E3EAEC26C8AA7C1ED752E3E840AF8A27',
            ];

            const Addresses = [
                'MATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34YACREP',
                'MDR6EW2WBHJQDYMNGFX2UBZHMMZC5PGL22B27FN3',
                'MCOXVZMAZJTT4I3F7EAZYGNGR77D6WPTRFDHL7JO',
                'MDZ4373ASEGJ7S7GQTKF26TIIMC7HK5EWFN3NK2Z',
                'MDI5I7Z3BRBAAHTZHGONGOXX742CW4W5QCLCVED4',
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
     * @see https://raw.githubusercontent.com/nemtech/test-vectors/master/1.test-address.json
     */
    describe('Catapult test vector [MIJIN_TEST] - PublicKey to Address', () => {
        it('can create Address from Catapult public Key', () => {
            // Arrange:
            const Public_Keys = [
                '2E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F',
                '4875FD2E32875D1BC6567745F1509F0F890A1BF8EE59FA74452FA4183A270E03',
                '9F780097FB6A1F287ED2736A597B8EA7F08D20F1ECDB9935DE6694ECF1C58900',
                '0815926E003CDD5AF0113C0E067262307A42CD1E697F53B683F7E5F9F57D72C9',
                '3683B3E45E76870CFE076E47C2B34CE8E3EAEC26C8AA7C1ED752E3E840AF8A27',
            ];

            const Addresses = [
                'SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMUQ',
                'SDR6EW2WBHJQDYMNGFX2UBZHMMZC5PGL2Z5UYY4U',
                'SCOXVZMAZJTT4I3F7EAZYGNGR77D6WPTRFENHXSH',
                'SDZ4373ASEGJ7S7GQTKF26TIIMC7HK5EWH6N46CD',
                'SDI5I7Z3BRBAAHTZHGONGOXX742CW4W5QDVZG2PO',
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
