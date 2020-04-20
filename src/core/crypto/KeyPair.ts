/*
 * Copyright 2020 NEM
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
import * as nacl from 'tweetnacl';
import { Convert as convert } from '../format';
import * as Utility from './Utilities';

export class KeyPair {
    /**
     * Creates a key pair from a private key string.
     * @param {string} privateKeyString A hex encoded private key string.
     * @returns {module:crypto/keyPair~KeyPair} The key pair.
     */
    public static createKeyPairFromPrivateKeyString(
        privateKeyString: string,
    ): {
        privateKey: Uint8Array;
        publicKey: Uint8Array;
    } {
        const privateKey = convert.hexToUint8(privateKeyString);
        if (Utility.Key_Size !== privateKey.length) {
            throw Error(`private key has unexpected size: ${privateKey.length}`);
        }
        const { publicKey } = nacl.sign.keyPair.fromSeed(privateKey);
        return { privateKey, publicKey };
    }

    /**
     * Signs a data buffer with a key pair.
     * @param {module:crypto/keyPair~KeyPair} keyPair The key pair to use for signing.
     * @param {Uint8Array} data The data to sign.
     * @returns {Uint8Array} The signature.
     */
    public static sign(keyPair, data: Uint8Array): Uint8Array {
        const secretKey = new Uint8Array(64);
        secretKey.set(keyPair.privateKey);
        secretKey.set(keyPair.publicKey, 32);
        return nacl.sign.detached(data, secretKey);
    }

    /**
     * Verifies a signature.
     * @param {Uint8Array} publicKey The public key to use for verification.
     * @param {Uint8Array} data The data to verify.
     * @param {Uint8Array} signature The signature to verify.
     * @returns {boolean} true if the signature is verifiable, false otherwise.
     */
    public static verify(publicKey: Uint8Array, data: Uint8Array, signature: Uint8Array): boolean {
        return nacl.sign.detached.verify(data, signature, publicKey);
    }
}
