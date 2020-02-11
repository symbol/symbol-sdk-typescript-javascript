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

import {LocalDateTime} from 'js-joda';
import {Crypto, KeyPair, SHA3Hasher} from '../../core/crypto';
import {Convert as convert} from '../../core/format';
import {Account} from '../account/Account';
import {Address} from '../account/Address';
import {NetworkType} from '../blockchain/NetworkType';
import {EncryptedPrivateKey} from './EncryptedPrivateKey';
import {ISimpleWalletDTO} from './ISimpleWalletDTO';
import {Password} from './Password';
import {Wallet} from './Wallet';

/**
 * Simple wallet model generates a private key from a PRNG
 */
export class SimpleWallet extends Wallet {

    /**
     * @param name
     * @param network
     * @param address
     * @param creationDate
     * @param encryptedPrivateKey
     */
    constructor(name: string,
                network: NetworkType,
                address: Address,
                creationDate: LocalDateTime,
                /**
                 * The encrypted private key and information to decrypt it
                 */
                public readonly encryptedPrivateKey: EncryptedPrivateKey) {
        super(name, network, address, creationDate, 'simple_v1');
    }

    /**
     * Create a Simple wallet
     * @param name - Wallet name
     * @param password - Password to encrypt wallet
     * @param network - Network id
     * @returns {SimpleWallet}
     */
    public static create(name: string,
                         password: Password,
                         network: NetworkType): SimpleWallet {
        // Create random bytes
        const randomBytesArray = Crypto.randomBytes(32);
        // Hash random bytes with entropy seed
        // Finalize and keep only 32 bytes
        const hashKey = convert.uint8ToHex(randomBytesArray); // TODO: derive private key correctly

        // Create KeyPair from hash key
        const keyPair = KeyPair.createKeyPairFromPrivateKeyString(hashKey);

        // Create address from public key
        const address = Address.createFromPublicKey(convert.uint8ToHex(keyPair.publicKey), network);

        // Encrypt private key using password
        const encrypted = Crypto.encodePrivateKey(hashKey, password.value);

        const encryptedPrivateKey = new EncryptedPrivateKey(encrypted.ciphertext, encrypted.iv);

        return new SimpleWallet(name, network, address, LocalDateTime.now(), encryptedPrivateKey);
    }

    /**
     * Create a SimpleWallet from private key
     * @param name - Wallet name
     * @param password - Password to encrypt wallet
     * @param privateKey - Wallet private key
     * @param network - Network id
     * @returns {SimpleWallet}
     */
    static createFromPrivateKey(name: string,
                                password: Password,
                                privateKey: string,
                                network: NetworkType): SimpleWallet {
        // Create KeyPair from hash key
        const keyPair = KeyPair.createKeyPairFromPrivateKeyString(privateKey);

        // Create address from public key
        const address = Address.createFromPublicKey(convert.uint8ToHex(keyPair.publicKey), network);

        // Encrypt private key using password
        const encrypted = Crypto.encodePrivateKey(privateKey, password.value);

        const encryptedPrivateKey = new EncryptedPrivateKey(encrypted.ciphertext, encrypted.iv);

        return new SimpleWallet(name, network, address, LocalDateTime.now(), encryptedPrivateKey);
    }

    /**
     * Instantiate a SimpleWallet from a DTO
     * @param simpleWalletDTO simple wallet without prototype
     * @returns {SimpleWallet}
     */
    static createFromDTO(simpleWalletDTO: ISimpleWalletDTO): SimpleWallet {
        return new SimpleWallet(
            simpleWalletDTO.name,
            simpleWalletDTO.network,
            Address.createFromRawAddress(simpleWalletDTO.address.address),
            LocalDateTime.now(),
            new EncryptedPrivateKey(
                simpleWalletDTO.encryptedPrivateKey.encryptedKey,
                simpleWalletDTO.encryptedPrivateKey.iv,
            ),
        );
    }

    /**
     * Open a wallet and generate an Account
     * @param password - Password to decrypt private key
     * @returns {Account}
     */
    public open(password: Password): Account {
        return Account.createFromPrivateKey(this.encryptedPrivateKey.decrypt(password), this.network);
    }

}
