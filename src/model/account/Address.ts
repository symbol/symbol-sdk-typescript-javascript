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
import { AddressDto } from 'catbuffer-typescript';
import { Convert, RawAddress } from '../../core/format';
import { NetworkType } from '../network/NetworkType';

/**
 * The address structure describes an address with its network
 */
export class Address {
    /**
     * Create from private key
     * @param publicKey - The account public key.
     * @param networkType - The NEM network type.
     * @returns {Address}
     */
    public static createFromPublicKey(publicKey: string, networkType: NetworkType): Address {
        const publicKeyUint8 = Convert.hexToUint8(publicKey);
        const address = RawAddress.addressToString(RawAddress.publicKeyToAddress(publicKeyUint8, networkType));
        return new Address(address, networkType);
    }

    /**
     * Create an Address from a given raw address.
     * @param rawAddress - Address in string format.
     *                  ex: SB3KUBHATFCPV7UZQLWAQ2EUR6SIHBSBEOEDDDF3 or SB3KUB-HATFCP-V7UZQL-WAQ2EU-R6SIHB-SBEOED-DDF3
     * @returns {Address}
     */
    public static createFromRawAddress(rawAddress: string): Address {
        let networkType: NetworkType;
        const addressTrimAndUpperCase: string = rawAddress.trim().toUpperCase().replace(/-/g, '');
        if (addressTrimAndUpperCase.length !== 39) {
            throw new Error('Address ' + addressTrimAndUpperCase + ' has to be 39 characters long');
        }
        if (addressTrimAndUpperCase.charAt(0) === 'S') {
            networkType = NetworkType.MIJIN_TEST;
        } else if (addressTrimAndUpperCase.charAt(0) === 'M') {
            networkType = NetworkType.MIJIN;
        } else if (addressTrimAndUpperCase.charAt(0) === 'T') {
            networkType = NetworkType.TEST_NET;
        } else if (addressTrimAndUpperCase.charAt(0) === 'N') {
            networkType = NetworkType.MAIN_NET;
        } else if (addressTrimAndUpperCase.charAt(0) === 'P') {
            networkType = NetworkType.PRIVATE;
        } else if (addressTrimAndUpperCase.charAt(0) === 'V') {
            networkType = NetworkType.PRIVATE_TEST;
        } else {
            throw new Error('Address Network unsupported');
        }
        return new Address(addressTrimAndUpperCase, networkType);
    }

    /**
     * Create an Address from a given encoded address.
     * @param {string} encoded address. Expected format: 9085215E4620D383C2DF70235B9EF7607F6A28EF6D16FD7B9C.
     * @return {Address}
     */
    public static createFromEncoded(encoded: string): Address {
        return Address.createFromRawAddress(RawAddress.addressToString(Convert.hexToUint8(encoded)));
    }

    /**
     * Determines the validity of an raw address string.
     * @param {string} rawAddress The raw address string. Expected format VATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA35C4KNQ
     * @returns {boolean} true if the raw address string is valid, false otherwise.
     */
    public static isValidRawAddress = (rawAddress: string): boolean => {
        if (!['A', 'I', 'Q', 'Y'].includes(rawAddress.slice(-1).toUpperCase())) {
            return false;
        }
        try {
            return RawAddress.isValidAddress(RawAddress.stringToAddress(rawAddress));
        } catch (err) {
            return false;
        }
    };

    /**
     * Determines the validity of an encoded address string.
     * @param {string} encoded The encoded address string. Expected format: 6823BB7C3C089D996585466380EDBDC19D4959184893E38C
     * @returns {boolean} true if the encoded address string is valid, false otherwise.
     */
    public static isValidEncodedAddress = (encoded: string): boolean => {
        try {
            return RawAddress.isValidAddress(Convert.hexToUint8(encoded));
        } catch (err) {
            return false;
        }
    };

    /**
     * @internal
     * @param address
     * @param networkType
     */
    private constructor(
        /**
         * The address value.
         */
        private readonly address: string,
        /**
         * The NEM network type.
         */
        public readonly networkType: NetworkType,
    ) {}

    /**
     * Get address in plain format ex: SB3KUBHATFCPV7UZQLWAQ2EUR6SIHBSBEOEDDDF3.
     * @returns {string}
     */
    public plain(): string {
        return this.address;
    }

    /**
     * Get address in the encoded format ex: NAR3W7B4BCOZSZMFIZRYB3N5YGOUSWIYJCJ6HDFH.
     * @returns {string}
     */
    public encoded(): string {
        return Convert.uint8ToHex(RawAddress.stringToAddress(this.address));
    }

    /**
     * Get address in pretty format ex: SB3KUB-HATFCP-V7UZQL-WAQ2EU-R6SIHB-SBEOED-DDF3.
     * @returns {string}
     */
    public pretty(): string {
        return this.address.match(/.{1,6}/g)!.join('-');
    }

    /**
     * Compares addresses for equality
     * @param address - Address to compare
     * @returns {boolean}
     */
    public equals(address: any): boolean {
        if (address instanceof Address) {
            return this.plain() === address.plain() && this.networkType === address.networkType;
        }
        return false;
    }

    /**
     * Create DTO object
     */
    public toDTO(): any {
        return {
            address: this.address,
            networkType: this.networkType,
        };
    }

    /**
     * Create Builder object
     */
    public toBuilder(): AddressDto {
        return new AddressDto(Convert.hexToUint8(this.encoded()));
    }

    /**
     * Encoded address or namespace id. Note that namespace id get the hex reversed and
     * zero padded.
     * @returns {Uint8Array}
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public encodeUnresolvedAddress(networkType: NetworkType): Uint8Array {
        return Convert.hexToUint8(this.encoded());
    }
}
