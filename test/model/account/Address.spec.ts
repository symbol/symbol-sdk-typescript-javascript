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

import { expect } from 'chai';
import { Account } from '../../../src/model/account/Account';
import { Address } from '../../../src/model/account/Address';
import { NetworkType } from '../../../src/model/network/NetworkType';

describe('Address', () => {
    const publicKey = '2E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F';
    it('createComplete an address given publicKey + NetworkType.MIJIN_TEST', () => {
        const address = Address.createFromPublicKey(publicKey, NetworkType.MIJIN_TEST);
        expect(address.plain()).to.be.equal('SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMQ');
        expect(address.networkType).to.be.equal(NetworkType.MIJIN_TEST);
    });

    it('print the address in pretty format', () => {
        const address = Address.createFromPublicKey(publicKey, NetworkType.MIJIN_TEST);
        expect(address.pretty()).to.be.equal('SATNE7-Q5BITM-UTRRN6-IB4I7F-LSDRDW-ZA34I2-PMQ');
    });

    it('createComplete an address given publicKey + NetworkType.MIJIN', () => {
        const address = Address.createFromPublicKey(publicKey, NetworkType.MIJIN);
        expect(address.plain()).to.be.equal('MATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34YACRA');
        expect(address.networkType).to.be.equal(NetworkType.MIJIN);
    });

    it('createComplete an address given publicKey + NetworkType.MAIN_NET', () => {
        const address = Address.createFromPublicKey(publicKey, NetworkType.MAIN_NET);
        expect(address.plain()).to.be.equal('NATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34SQ33Y');
        expect(address.networkType).to.be.equal(NetworkType.MAIN_NET);
    });

    it('createComplete an address given publicKey + NetworkType.TEST_NET', () => {
        const address = Address.createFromPublicKey(publicKey, NetworkType.TEST_NET);
        expect(address.plain()).to.be.equal('TATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA37JGO5Q');
        expect(address.networkType).to.be.equal(NetworkType.TEST_NET);
    });

    it('createComplete an address given SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMQ', () => {
        const address = Address.createFromRawAddress('SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMQ');
        expect(address.networkType).to.be.equal(NetworkType.MIJIN_TEST);
    });

    it('createComplete an address given MATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34YACRA', () => {
        const address = Address.createFromRawAddress('MATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34YACRA');
        expect(address.networkType).to.be.equal(NetworkType.MIJIN);
    });

    it('createComplete an address given NATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34SQ33Y', () => {
        const address = Address.createFromRawAddress('NATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34SQ33Y');
        expect(address.networkType).to.be.equal(NetworkType.MAIN_NET);
    });

    it('createComplete an address given TATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA37JGO5Q', () => {
        const address = Address.createFromRawAddress('TATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA37JGO5Q');
        expect(address.networkType).to.be.equal(NetworkType.TEST_NET);
    });

    it('createComplete an address given SATNE7-Q5BITM-UTRRN6-IB4I7F-LSDRDW-ZA34I2-PMQ', () => {
        const address = Address.createFromRawAddress('SATNE7-Q5BITM-UTRRN6-IB4I7F-LSDRDW-ZA34I2-PMQ');
        expect(address.networkType).to.be.equal(NetworkType.MIJIN_TEST);
        expect(address.pretty()).to.be.equal('SATNE7-Q5BITM-UTRRN6-IB4I7F-LSDRDW-ZA34I2-PMQ');
    });

    it('should throw Error when the address contain an invalid network identifier', () => {
        expect(() => {
            Address.createFromRawAddress('ZCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPSDRSFR');
        }).to.throw('Address Network unsupported');
    });

    it('should throw Error when the address is not valid in length', () => {
        expect(() => {
            Address.createFromRawAddress('ZCTVW234AQ4TZIDZENGNOZXPRPSDRSFRF');
        }).to.throw('Address ZCTVW234AQ4TZIDZENGNOZXPRPSDRSFRF has to be 39 characters long');
    });

    it('should turn a lowercase address to uppercase', () => {
        const address = Address.createFromRawAddress('tatne7q5bitmutrrn6ib4i7flsdrdwza37jgo5q');
        expect(address.plain()).to.be.equal('TATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA37JGO5Q');
    });

    it('should equal addresses', () => {
        const address = Address.createFromRawAddress('TATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA37JGO5Q');
        const compareAddress = Address.createFromRawAddress('TATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA37JGO5Q');
        expect(address.equals(compareAddress)).to.be.equal(true);
    });

    it('should not equal addresses', () => {
        const address = Address.createFromRawAddress('TATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA37JGO5Q');
        const compareAddress = Address.createFromRawAddress('TDR6EW2WBHJQDYMNGFX2UBZHMMZC5PGL2YBO3KA');
        expect(address.equals(compareAddress)).to.be.equal(false);
    });

    it('It creates the address from an encoded value', () => {
        const encoded = '917E7E29A01014C2F3000000000000000000000000000000';
        const address = Address.createFromEncoded(encoded);
        expect(address.encoded()).to.be.equal(encoded);
    });

    describe('isValidRawAddress', () => {
        it('returns true for valid address when generated', () => {
            // Assert:
            expect(Address.isValidRawAddress(Account.generateNewAccount(NetworkType.MIJIN_TEST).address.plain())).to.equal(true);
            expect(Address.isValidRawAddress(Account.generateNewAccount(NetworkType.MAIN_NET).address.plain())).to.equal(true);
            expect(Address.isValidRawAddress(Account.generateNewAccount(NetworkType.MIJIN).address.plain())).to.equal(true);
            expect(Address.isValidRawAddress(Account.generateNewAccount(NetworkType.TEST_NET).address.plain())).to.equal(true);
        });

        it('returns true for valid address', () => {
            // Arrange:
            const rawAddress = 'SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMQ';

            // Assert:
            expect(Address.isValidRawAddress(rawAddress)).to.equal(true);
        });

        it('returns false for address with invalid checksum', () => {
            // Arrange:
            const rawAddress = 'SATNE7Q5BITMUTRRN6YB4I7FLSDRDWZA34I2PMQ';

            // Assert:
            expect(Address.isValidRawAddress(rawAddress)).to.equal(false);
        });

        it('returns false for address with invalid hash', () => {
            // Arrange:
            const rawAddress = 'SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PQQ';

            // Assert:
            expect(Address.isValidRawAddress(rawAddress)).to.equal(false);
        });

        it('returns false for address with invalid prefix', () => {
            // Arrange:
            const rawAddress = 'AATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMQ';

            // Assert:
            expect(Address.isValidRawAddress(rawAddress)).to.equal(false);
        });
    });

    describe('isValidEncodedAddress', () => {
        it('returns true for valid address when generated', () => {
            // Assert:
            expect(Address.isValidEncodedAddress(Account.generateNewAccount(NetworkType.MIJIN_TEST).address.encoded())).to.equal(true);
            expect(Address.isValidEncodedAddress(Account.generateNewAccount(NetworkType.MAIN_NET).address.encoded())).to.equal(true);
            expect(Address.isValidEncodedAddress(Account.generateNewAccount(NetworkType.MIJIN).address.encoded())).to.equal(true);
            expect(Address.isValidEncodedAddress(Account.generateNewAccount(NetworkType.TEST_NET).address.encoded())).to.equal(true);
        });

        it('returns true for valid encoded address', () => {
            // Arrange:
            const encoded = '6823BB7C3C089D996585466380EDBDC19D4959184893E38C';

            // Assert:
            expect(Address.isValidEncodedAddress(encoded)).to.equal(true);
        });

        it('returns false for invalid hex encoded address', () => {
            // Arrange:
            const encoded = 'Z823BB7C3C089D996585466380EDBDC19D4959184893E38C';

            // Assert:
            expect(Address.isValidEncodedAddress(encoded)).to.equal(false);
        });

        it('returns false for invalid encoded address', () => {
            // Arrange: changed last char
            const encoded = '6823BB7C3C089D996585466380EDBDC19D4959184893E38D';

            // Assert:
            expect(Address.isValidEncodedAddress(encoded)).to.equal(false);
        });

        it('returns false for encoded address with wrong length', () => {
            // Arrange: added ABC
            const encoded = '6823BB7C3C089D996585466380EDBDC19D4959184893E38CEE';

            // Assert:
            expect(Address.isValidEncodedAddress(encoded)).to.equal(false);
        });

        it('adding leading or trailing white space invalidates encoded address', () => {
            // Arrange:
            const encoded = '6823BB7C3C089D996585466380EDBDC19D4959184893E38C';

            // Assert:
            expect(Address.isValidEncodedAddress(`   \t    ${encoded}`)).to.equal(false);
            expect(Address.isValidEncodedAddress(`${encoded}   \t    `)).to.equal(false);
            expect(Address.isValidEncodedAddress(`   \t    ${encoded}   \t    `)).to.equal(false);
        });
    });
});
