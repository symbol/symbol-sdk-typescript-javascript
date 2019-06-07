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

import { sha3_256 } from 'js-sha3';
import RIPEMD160 = require('ripemd160');
import { Base32 } from './Base32';
import { Convert } from './Convert';
import { RawArray } from './RawArray';

export class RawAddress {
    static readonly constants = {
        sizes: {
            ripemd160: 20,
            addressDecoded: 25,
            addressEncoded: 40,
            key: 32,
            checksum: 4,
        },
    };
    /**
     * Converts an encoded address string to a decoded address.
     * @param {string} encoded The encoded address string.
     * @returns {Uint8Array} The decoded address corresponding to the input.
     */
    public static stringToAddress = (encoded) => {
        if (RawAddress.constants.sizes.addressEncoded !== encoded.length) {
            throw Error(`${encoded} does not represent a valid encoded address`);
        }

        return Base32.Base32Decode(encoded);
    }

    /**
     * Format a namespaceId *alias* into a valid recipient field value.
     * @param {string} namespaceId The hexadecimal namespaceId
     * @returns {Uint8Array} The padded hexadecimal notation of the alias
     */
    public static aliasToRecipient = (namespaceId) => {
        // 0x91 | namespaceId on 8 bytes | 16 bytes 0-pad = 25 bytes
        const padded = new Uint8Array(1 + 8 + 16);
        padded.set([0x91], 0);
        padded.set(namespaceId.reverse(), 1);
        padded.set(Convert.hexToUint8('00'.repeat(16)), 9);
        return padded;
    }

    /**
     * Converts a decoded address to an encoded address string.
     * @param {Uint8Array} decoded The decoded address.
     * @returns {string} The encoded address string corresponding to the input.
     */
    public static addressToString = (decoded) => {
        if (RawAddress.constants.sizes.addressDecoded !== decoded.length) {
            throw Error(`${Convert.uint8ToHex(decoded)} does not represent a valid decoded address`);
        }

        return Base32.Base32Encode(decoded);
    }

    /**
     * Converts a public key to a decoded address for a specific network.
     * @param {module:crypto/keyPair~PublicKey} publicKey The public key.
     * @param {number} networkIdentifier The network identifier.
     * @returns {Uint8Array} The decoded address corresponding to the inputs.
     */
    public static publicKeyToAddress = (publicKey, networkIdentifier) => {
        // step 1: sha3 hash of the public key
        const publicKeyHash = (sha3_256 as any).arrayBuffer(publicKey);

        // step 2: ripemd160 hash of (1)
        const ripemdHash = new RIPEMD160().update(new Buffer(publicKeyHash)).digest();

        // step 3: add network identifier byte in front of (2)
        const decodedAddress = new Uint8Array(RawAddress.constants.sizes.addressDecoded);
        decodedAddress[0] = networkIdentifier;
        RawArray.copy(decodedAddress, ripemdHash, RawAddress.constants.sizes.ripemd160, 1);

        // step 4: concatenate (3) and the checksum of (3)
        const hash = (sha3_256 as any).arrayBuffer(decodedAddress.subarray(0, RawAddress.constants.sizes.ripemd160 + 1));
        RawArray.copy(decodedAddress, RawArray.uint8View(hash),
            RawAddress.constants.sizes.checksum, RawAddress.constants.sizes.ripemd160 + 1);

        return decodedAddress;
    }

    /**
     * Determines the validity of a decoded address.
     * @param {Uint8Array} decoded The decoded address.
     * @returns {boolean} true if the decoded address is valid, false otherwise.
     */
    public static isValidAddress = (decoded) => {
        const hash = sha3_256.create();
        const checksumBegin = RawAddress.constants.sizes.addressDecoded - RawAddress.constants.sizes.checksum;
        hash.update(decoded.subarray(0, checksumBegin));
        const checksum = new Uint8Array(RawAddress.constants.sizes.checksum);
        RawArray.copy(checksum, RawArray.uint8View(hash.arrayBuffer()), RawAddress.constants.sizes.checksum);
        return RawArray.deepEqual(checksum, decoded.subarray(checksumBegin));
    }

    /**
     * Determines the validity of an encoded address string.
     * @param {string} encoded The encoded address string.
     * @returns {boolean} true if the encoded address string is valid, false otherwise.
     */
    public static isValidEncodedAddress = (encoded) => {
        if (RawAddress.constants.sizes.addressEncoded !== encoded.length) {
            return false;
        }

        try {
            const decoded = RawAddress.stringToAddress(encoded);
            return RawAddress.isValidAddress(decoded);
        } catch (err) {
            return false;
        }
    }
}
