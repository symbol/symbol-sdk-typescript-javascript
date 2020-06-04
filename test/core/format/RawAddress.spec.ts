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
import { Convert as convert, RawAddress as address } from '../../../src/core/format';
import { NetworkType } from '../../../src/model/model';

const Address_Decoded_Size = 24;

describe('address', () => {
    describe('stringToAddress', () => {
        function assertCannotCreateAddress(encoded, message): void {
            // Assert:
            expect(() => {
                address.stringToAddress(encoded);
            }).to.throw(message);
        }

        it('can create address from valid encoded address', () => {
            // Arrange:
            const encoded = 'NAR3W7B4BCOZSZMFIZRYB3N5YGOUSWIYJCJ6HDA';
            const expectedHex = '6823BB7C3C089D996585466380EDBDC19D4959184893E38C';

            // Act:
            const decoded = address.stringToAddress(encoded);

            // Assert:
            expect(address.isValidAddress(decoded)).to.equal(true);
            expect(convert.uint8ToHex(decoded)).to.equal(expectedHex);
        });

        it('can create address from valid encoded address', () => {
            // Arrange:
            const encoded = 'NATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34SQ33Y';
            const expectedHex = '6826D27E1D0A26CA4E316F901E23E55C8711DB20DF250DEF';

            // Act:
            const decoded = address.stringToAddress(encoded);

            // Assert:
            expect(address.isValidAddress(decoded)).to.equal(true);
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
            assertCannotCreateAddress('NC5(5DI2URIC4H3T3IMXQS25PWQWZIPEV6EV7LA', 'illegal base32 character (');
            assertCannotCreateAddress('NC5J1DI2URIC4H3T3IMXQS25PWQWZIPEV6EV7LA', 'illegal base32 character 1');
            assertCannotCreateAddress('NC5J5?I2URIC4H3T3IMXQS25PWQWZIPEV6EV7LA', 'illegal base32 character ?');
        });
    });

    describe('addressToString', () => {
        it('can create encoded address from address', () => {
            // Arrange:
            const decodedHex = '6823BB7C3C089D996585466380EDBDC19D4959184893E38C';
            const expected = 'NAR3W7B4BCOZSZMFIZRYB3N5YGOUSWIYJCJ6HDA';

            // Act:
            const encoded = address.addressToString(convert.hexToUint8(decodedHex));

            // Assert:
            expect(encoded).to.equal(expected);
        });

        it('can create encoded address from address to throw', () => {
            // Arrange:
            const decodedHex = '60000000C089D996585466380EDBDC19D4959184893E38CA6';
            // Assert:
            expect(() => address.addressToString(convert.hexToUint8(decodedHex))).to.throw();
        });
    });

    describe('publicKeyToAddress', () => {
        it('can create address from public key for well known network', () => {
            // Arrange:
            const expectedHex = '6026D27E1D0A26CA4E316F901E23E55C8711DB20DF300144';
            const publicKey = convert.hexToUint8('2E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F');

            // Act:
            const decoded = address.publicKeyToAddress(publicKey, NetworkType.MIJIN);

            // Assert:
            expect(decoded[0]).to.equal(NetworkType.MIJIN);
            expect(address.isValidAddress(decoded)).to.equal(true);
            expect(convert.uint8ToHex(decoded)).to.equal(expectedHex);
        });

        it('can create address from public key for custom network', () => {
            // Arrange:
            const expectedHex = '9026D27E1D0A26CA4E316F901E23E55C8711DB20DF11A7B2';
            const publicKey = convert.hexToUint8('2E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F');

            // Act:
            const decoded = address.publicKeyToAddress(publicKey, NetworkType.MIJIN_TEST);

            // Assert:
            expect(decoded[0]).to.equal(NetworkType.MIJIN_TEST);
            expect(address.isValidAddress(decoded)).to.equal(true);
            expect(convert.uint8ToHex(decoded)).to.equal(expectedHex);
        });

        it('address calculation is deterministic', () => {
            // Arrange:
            const publicKey = convert.hexToUint8('2E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F');

            // Act:
            const decoded1 = address.publicKeyToAddress(publicKey, NetworkType.MIJIN_TEST);
            const decoded2 = address.publicKeyToAddress(publicKey, NetworkType.MIJIN_TEST);

            // Assert:
            expect(address.isValidAddress(decoded1)).to.equal(true);
            expect(decoded1).to.deep.equal(decoded2);
        });

        it('different public keys result in different addresses', () => {
            // Arrange:
            const publicKey1 = convert.hexToUint8('2E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F');
            const publicKey2 = convert.hexToUint8('4875FD2E32875D1BC6567745F1509F0F890A1BF8EE59FA74452FA4183A270E03');

            // Act:
            const decoded1 = address.publicKeyToAddress(publicKey1, NetworkType.MIJIN_TEST);
            const decoded2 = address.publicKeyToAddress(publicKey2, NetworkType.MIJIN_TEST);

            // Assert:
            expect(address.isValidAddress(decoded1)).to.equal(true);
            expect(address.isValidAddress(decoded2)).to.equal(true);
            expect(decoded1).to.not.deep.equal(decoded2);
        });

        it('different networks result in different addresses', () => {
            // Arrange:
            const publicKey = convert.hexToUint8('4875FD2E32875D1BC6567745F1509F0F890A1BF8EE59FA74452FA4183A270E03');

            // Act:
            const decoded1 = address.publicKeyToAddress(publicKey, NetworkType.MIJIN_TEST);
            const decoded2 = address.publicKeyToAddress(publicKey, NetworkType.TEST_NET);

            // Assert:
            expect(address.isValidAddress(decoded1)).to.equal(true);
            expect(address.isValidAddress(decoded2)).to.equal(true);
            expect(decoded1).to.not.deep.equal(decoded2);
        });
    });

    describe('isValidAddress', () => {
        it('returns true for valid address', () => {
            // Arrange:
            const validHex = '6026D27E1D0A26CA4E316F901E23E55C8711DB20DF300144';
            const decoded = convert.hexToUint8(validHex);

            // Assert:
            expect(address.isValidAddress(decoded)).to.equal(true);
        });

        it('returns false for address with invalid checksum', () => {
            // Arrange:
            const validHex = '6026D27E1D0A26CA4E316F901E23E55C8711DB20DF300144';
            const decoded = convert.hexToUint8(validHex);
            decoded[Address_Decoded_Size - 1] ^= 0xff; // ruin checksum

            // Assert:
            expect(address.isValidAddress(decoded)).to.equal(false);
        });

        it('returns false for address with invalid hash', () => {
            // Arrange:
            const validHex = '6026D27E1D0A26CA4E316F901E23E55C8711DB20DF300144';
            const decoded = convert.hexToUint8(validHex);
            decoded[5] ^= 0xff; // ruin ripemd160 hash

            // Assert:
            expect(address.isValidAddress(decoded)).to.equal(false);
        });

        it('returns false for address with invalid length', () => {
            // Arrange:
            const validHex = '6823BB7C3C089D996585466380EDBDC19D4959184893E38CA6AABB';
            const decoded = convert.hexToUint8(validHex);
            // Assert:
            expect(address.isValidAddress(decoded)).to.equal(false);
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
                'NATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34SQ33Y',
                'NDR6EW2WBHJQDYMNGFX2UBZHMMZC5PGL2YCZOQQ',
                'NCOXVZMAZJTT4I3F7EAZYGNGR77D6WPTRH6SYIQ',
                'NDZ4373ASEGJ7S7GQTKF26TIIMC7HK5EWFDDCHA',
                'NDI5I7Z3BRBAAHTZHGONGOXX742CW4W5QAZ4BMQ',
            ];

            // Sanity:
            expect(Public_Keys.length).equal(Addresses.length);

            for (let i = 0; i < Public_Keys.length; ++i) {
                // Arrange:
                const publicKeyHex = Public_Keys[i];
                const expectedAddress = Addresses[i];

                // Act:
                const result = address.addressToString(address.publicKeyToAddress(convert.hexToUint8(publicKeyHex), NetworkType.MAIN_NET));

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
                'TATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA37JGO5Q',
                'TDR6EW2WBHJQDYMNGFX2UBZHMMZC5PGL2YBO3KA',
                'TCOXVZMAZJTT4I3F7EAZYGNGR77D6WPTRE3VIBQ',
                'TDZ4373ASEGJ7S7GQTKF26TIIMC7HK5EWEPHRSI',
                'TDI5I7Z3BRBAAHTZHGONGOXX742CW4W5QCY5ZUA',
            ];

            // Sanity:
            expect(Public_Keys.length).equal(Addresses.length);

            for (let i = 0; i < Public_Keys.length; ++i) {
                // Arrange:
                const publicKeyHex = Public_Keys[i];
                const expectedAddress = Addresses[i];

                // Act:
                const result = address.addressToString(address.publicKeyToAddress(convert.hexToUint8(publicKeyHex), NetworkType.TEST_NET));

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
                'MATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34YACRA',
                'MDR6EW2WBHJQDYMNGFX2UBZHMMZC5PGL22B27FI',
                'MCOXVZMAZJTT4I3F7EAZYGNGR77D6WPTRFDHL7I',
                'MDZ4373ASEGJ7S7GQTKF26TIIMC7HK5EWFN3NKY',
                'MDI5I7Z3BRBAAHTZHGONGOXX742CW4W5QCLCVEA',
            ];

            // Sanity:
            expect(Public_Keys.length).equal(Addresses.length);

            for (let i = 0; i < Public_Keys.length; ++i) {
                // Arrange:
                const publicKeyHex = Public_Keys[i];
                const expectedAddress = Addresses[i];

                // Act:
                const result = address.addressToString(address.publicKeyToAddress(convert.hexToUint8(publicKeyHex), NetworkType.MIJIN));

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
                'SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMQ',
                'SDR6EW2WBHJQDYMNGFX2UBZHMMZC5PGL2Z5UYYY',
                'SCOXVZMAZJTT4I3F7EAZYGNGR77D6WPTRFENHXQ',
                'SDZ4373ASEGJ7S7GQTKF26TIIMC7HK5EWH6N46A',
                'SDI5I7Z3BRBAAHTZHGONGOXX742CW4W5QDVZG2I',
            ];

            // Sanity:
            expect(Public_Keys.length).equal(Addresses.length);

            for (let i = 0; i < Public_Keys.length; ++i) {
                // Arrange:
                const publicKeyHex = Public_Keys[i];
                const expectedAddress = Addresses[i];

                // Act:
                const result = address.addressToString(
                    address.publicKeyToAddress(convert.hexToUint8(publicKeyHex), NetworkType.MIJIN_TEST),
                );

                // Assert:
                const message = ` from ${publicKeyHex}`;
                expect(result.toUpperCase(), `public ${message}`).equal(expectedAddress.toUpperCase());
            }
        });
    });
});
