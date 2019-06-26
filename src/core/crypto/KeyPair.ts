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
import { Convert as convert } from '../format';
import { SignSchema } from './SignSchema';
import * as Utility from './Utilities';

export class KeyPair {
    /**
     * Creates a key pair from a private key string.
     * @param {string} privateKeyString A hex encoded private key string.
     * @param {SignSchema} signSchema The Sign Schema (NIS / Catapult)
     * @returns {module:crypto/keyPair~KeyPair} The key pair.
     */
    public static createKeyPairFromPrivateKeyString = (privateKeyString, signSchema = SignSchema.Catapult) => {
        const privateKey = convert.hexToUint8(privateKeyString);

        // NIS use reversed private key.
        const secretKey = signSchema === SignSchema.Catapult ? privateKey : convert.hexToUint8Reverse(privateKeyString);
        if (Utility.Key_Size !== privateKey.length) {
            throw Error(`private key has unexpected size: ${privateKey.length}`);
        }
        const publicKey = Utility.catapult_crypto.extractPublicKey(secretKey, Utility.catapult_hash.func, signSchema);
        return {
            privateKey,
            publicKey,
        };
    }

    /**
     * Signs a data buffer with a key pair.
     * @param {module:crypto/keyPair~KeyPair} keyPair The key pair to use for signing.
     * @param {Uint8Array} data The data to sign.
     * @param {SignSchema} signSchema The Sign Schema (NIS / Catapult)
     * @returns {Uint8Array} The signature.
     */
    public static sign = (keyPair, data, signSchema = SignSchema.Catapult) => {
        let secretKey = keyPair.privateKey;
        // NIS use reversed private key.
        if (signSchema === SignSchema.NIS) {
            secretKey = convert.hexToUint8Reverse(convert.uint8ToHex(secretKey));
        }
        return Utility.catapult_crypto.sign(data, keyPair.publicKey, secretKey,
                Utility.catapult_hash.createHasher(64, signSchema));
    }

    /**
     * Verifies a signature.
     * @param {module:crypto/keyPair~PublicKey} publicKey The public key to use for verification.
     * @param {Uint8Array} data The data to verify.
     * @param {Uint8Array} signature The signature to verify.
     * @param {SignSchema} signSchema The Sign Schema (NIS / Catapult)
     * @returns {boolean} true if the signature is verifiable, false otherwise.
     */
    public static verify = (publicKey, data, signature, signSchema = SignSchema.Catapult) => {
        return Utility.catapult_crypto.verify(publicKey, data, signature, Utility.catapult_hash.createHasher(64, signSchema));
    }

    /**
     * Creates a shared key given a key pair and an arbitrary public key.
     * The shared key can be used for encrypted message passing between the two.
     * @param {module:crypto/keyPair~KeyPair} keyPair The key pair for which to create the shared key.
     * @param {Uint8Array} publicKey The public key for which to create the shared key.
     * @param {Uint8Array} salt A salt that should be applied to the shared key.
     * @param {SignSchema} signSchema The Sign Schema (NIS / Catapult)
     * @returns {Uint8Array} The shared key.
     */
    public static deriveSharedKey = (keyPair, publicKey, salt, signSchema = SignSchema.Catapult) => {
        if (Utility.Key_Size !== salt.length) {
            throw Error(`salt has unexpected size: ${salt.length}`);
        }
        if (Utility.Key_Size !== publicKey.length) {
            throw Error(`public key has unexpected size: ${salt.length}`);
        }
        let secretKey = keyPair.privateKey;
        // NIS use reversed private key.
        if (signSchema === SignSchema.NIS) {
            secretKey = convert.hexToUint8Reverse(convert.uint8ToHex(secretKey));
        }
        return Utility.catapult_crypto.deriveSharedKey(salt, secretKey, publicKey, Utility.catapult_hash.func, signSchema);
    }
}
