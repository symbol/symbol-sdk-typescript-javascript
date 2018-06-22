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

import { KeyPair, convert } from 'nem2-library';
import { NetworkType } from '../blockchain/NetworkType';
import { Address } from './Address';

/**
 * The public account structure contains account's address and public key.
 */
export class PublicAccount {

    /**
     * @internal
     * @param publicKey
     * @param address
     */
    constructor(
                /**
                 * The account public private.
                 */
                public readonly publicKey: string,
                /**
                 * The account address.
                 */
                public readonly address: Address) {

    }

    /**
     * Create a PublicAccount from a public key and network type.
     * @param publicKey Public key
     * @param networkType Network type
     * @returns {PublicAccount}
     */
    static createFromPublicKey(publicKey: string, networkType: NetworkType): PublicAccount {
        if (publicKey == null || (publicKey.length !== 64 && publicKey.length !== 66)) {
            throw new Error('Not a valid public key');
        }
        const address = Address.createFromPublicKey(publicKey, networkType);
        return new PublicAccount(publicKey, address);
    }

    /**
     * Verify a signature.
     *
     * @param {string} publicKey - The public key to use for verification.
     * @param {string} data - The data to verify.
     * @param {string} signature - The signature to verify.
     *
     * @return {boolean}  - True if the signature is valid, false otherwise.
     */
    static verifySignature(publicKey: string, data: string, signature: string): boolean {
        if (!publicKey || !data || !signature) {
            throw new Error('Missing argument !');
        }

        if (publicKey.length !== 64 && publicKey.length !== 66) {
            throw new Error('Not a valid public key');
        }

        if (convert.isHexString(signature)) {
            throw new Error('Signature must be hexadecimal only !');
        }

        if (signature.length !== 128) {
            throw new Error('Signature length is incorrect !');
        }

        // Convert signature key to Uint8Array
        const _signature = convert.hexToUint8(signature);

        let _data;

        // Convert data to hex if data is not hex
        if (!convert.isHexString(data)) {
            _data = convert.utf8ToHex(data);
        }

        // Convert to Uint8Array
        _data = convert.hexToUint8(_data);

        return KeyPair.verify(publicKey, _data, _signature);
    }

    /**
     * Compares public accounts for equality.
     * @param publicAccount
     * @returns {boolean}
     */
    equals(publicAccount: PublicAccount) {
        return this.publicKey === publicAccount.publicKey && this.address.plain() === publicAccount.address.plain();
    }

}
