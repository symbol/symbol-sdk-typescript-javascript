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

import { Crypto, KeyPair } from '../../core/crypto';
import { Convert as convert } from '../../core/format';
import { Account } from '../account/Account';
import { Address } from '../account/Address';
import { NetworkType } from '../network/NetworkType';
import { ISimpleWalletDTO } from './ISimpleWalletDTO';
import { Password } from './Password';
import { Wallet } from './Wallet';

export class SimpleWallet extends Wallet {
    /**
     *Creates an instance of SimpleWallet.
     * @param {string} name
     * @param {Address} address
     * @param {string} encryptedPrivateKey
     */
    constructor(name: string, address: Address, public readonly encryptedPrivateKey: string) {
        super(name, address, 'simple_v2');
    }

    /**
     * Create a Simple wallet
     * @param name - Wallet name
     * @param password - Password to encrypt wallet
     * @param network - Network id
     * @returns {SimpleWallet}
     */
    public static create(name: string, password: Password, network: NetworkType): SimpleWallet {
        // Create random bytes
        const randomBytesArray = Crypto.randomBytes(32);
        // Hash random bytes with entropy seed
        // Finalize and keep only 32 bytes
        const hashKey = convert.uint8ToHex(randomBytesArray); // TODO: derive private key correctly

        // Create KeyPair from hash key
        const { publicKey, privateKey } = KeyPair.createKeyPairFromPrivateKeyString(hashKey);

        // Create address from public key
        const address = Address.createFromPublicKey(convert.uint8ToHex(publicKey), network);

        // Encrypt private key using password
        const encryptedPrivateKey = Crypto.encrypt(convert.uint8ToHex(privateKey), password.value);

        return new SimpleWallet(name, address, encryptedPrivateKey);
    }

    /**
     * Create a SimpleWallet from private key
     * @param name - Wallet name
     * @param password - Password to encrypt wallet
     * @param privateKey - Wallet private key
     * @param network - Network id
     * @returns {SimpleWallet}
     */
    static createFromPrivateKey(name: string, password: Password, privateKey: string, network: NetworkType): SimpleWallet {
        // Create KeyPair from hash key
        const keyPair = KeyPair.createKeyPairFromPrivateKeyString(privateKey);

        // Create address from public key
        const address = Address.createFromPublicKey(convert.uint8ToHex(keyPair.publicKey), network);

        // Encrypt private key using password
        const encryptedPrivateKey = Crypto.encrypt(privateKey, password.value);

        return new SimpleWallet(name, address, encryptedPrivateKey);
    }

    /**
     * Instantiate a SimpleWallet from a DTO
     * @param simpleWalletDTO simple wallet without prototype
     * @returns {SimpleWallet}
     */
    static createFromDTO(simpleWalletDTO: ISimpleWalletDTO): SimpleWallet {
        return new SimpleWallet(
            simpleWalletDTO.name,
            Address.createFromRawAddress(simpleWalletDTO.address.address),
            simpleWalletDTO.encryptedPrivateKey,
        );
    }

    /**
     * Creates a SimpleWallet DTO
     * @returns {ISimpleWalletDTO}
     */
    public toDTO(): ISimpleWalletDTO {
        return JSON.parse(JSON.stringify(this));
    }

    /**
     * Open a wallet and generate an Account
     * @param password - Password to decrypt private key
     * @returns {Account}
     */
    public open(password: Password): Account {
        const privateKey = Crypto.decrypt(this.encryptedPrivateKey, password.value);
        return Account.createFromPrivateKey(privateKey, this.networkType);
    }
}
