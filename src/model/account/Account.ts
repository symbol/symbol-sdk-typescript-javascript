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

import * as KeyPair from '../../core/crypto/KeyPair';
import * as nacl from '../../core/crypto/nacl_catapult';
import * as AddressLibrary from '../../core/format/Address';
import * as convert from '../../core/format/Convert';
import {NetworkType} from '../blockchain/NetworkType';
import {AggregateTransaction} from '../transaction/AggregateTransaction';
import {CosignatureSignedTransaction} from '../transaction/CosignatureSignedTransaction';
import {CosignatureTransaction} from '../transaction/CosignatureTransaction';
import {EncryptedMessage} from '../transaction/EncryptedMessage';
import {PlainMessage} from '../transaction/PlainMessage';
import {SignedTransaction} from '../transaction/SignedTransaction';
import {Transaction} from '../transaction/Transaction';
import {Address} from './Address';
import {PublicAccount} from './PublicAccount';

interface IKeyPair {
    privateKey: Uint8Array;
    publicKey: Uint8Array;
}

/**
 * The account structure describes an account private key, public key, address and allows signing transactions.
 */
export class Account {

    /**
     * @internal
     * @param address
     * @param keyPair
     */
    private constructor(
                        /**
                         * The account address.
                         */
                        public readonly address: Address,
                        /**
                         * The account keyPair, public and private key.
                         */
                        private readonly keyPair: IKeyPair) {
    }

    /**
     * Create an Account from a given private key
     * @param privateKey - Private key from an account
     * @param networkType - Network type
     * @return {Account}
     */
    public static createFromPrivateKey(privateKey: string, networkType: NetworkType): Account {
        const keyPair: IKeyPair = KeyPair.createKeyPairFromPrivateKeyString(privateKey);
        const address = AddressLibrary.addressToString(
            AddressLibrary.publicKeyToAddress(keyPair.publicKey, networkType));
        return new Account(
            Address.createFromRawAddress(address),
            keyPair,
        );
    }

    public static generateNewAccount(networkType: NetworkType): Account {
        // Create random bytes
        const randomBytesArray = nacl.randomBytes(32);
        // Hash random bytes with entropy seed
        // Finalize and keep only 32 bytes
        const hashKey = convert.uint8ToHex(randomBytesArray); // TODO: derive private key correctly

        // Create KeyPair from hash key
        const keyPair = KeyPair.createKeyPairFromPrivateKeyString(hashKey);

        const address = Address.createFromPublicKey(convert.uint8ToHex(keyPair.publicKey), networkType);
        return new Account(address, keyPair);
    }
    /**
     * Create a new encrypted Message
     * @param message
     * @param recipientPublicAccount
     * @returns {EncryptedMessage}
     */
    public encryptMessage(message: string, recipientPublicAccount: PublicAccount): EncryptedMessage {
        return EncryptedMessage.create(message, recipientPublicAccount, this.privateKey);
    }

    /**
     * Decrypts an encrypted message
     * @param encryptedMessage
     * @param recipientPublicAccount
     * @returns {PlainMessage}
     */
    public decryptMessage(encryptedMessage: EncryptedMessage, recipientPublicAccount: PublicAccount): PlainMessage {
        return EncryptedMessage.decrypt(encryptedMessage, this.privateKey, recipientPublicAccount);
    }
    /**
     * Account public key.
     * @return {string}
     */
    get publicKey(): string {
        return convert.uint8ToHex(this.keyPair.publicKey);
    }

    /**
     * Public account.
     * @return {PublicAccount}
     */
    get publicAccount(): PublicAccount {
        return PublicAccount.createFromPublicKey(this.publicKey, this.address.networkType);
    }

    /**
     * Account private key.
     * @return {string}
     */
    get privateKey(): string {
        return convert.uint8ToHex(this.keyPair.privateKey);
    }

    /**
     * Sign a transaction
     * @param transaction - The transaction to be signed.
     * @param generationHash - Network generation hash hex
     * @return {SignedTransaction}
     */
    public sign(transaction: Transaction, generationHash): SignedTransaction {
        return transaction.signWith(this, generationHash);
    }

    /**
     * Sign transaction with cosignatories creating a new SignedTransaction
     * @param transaction - The aggregate transaction to be signed.
     * @param cosignatories - The array of accounts that will cosign the transaction
     * @param generationHash - Network generation hash hex
     * @return {SignedTransaction}
     */
    public signTransactionWithCosignatories(transaction: AggregateTransaction,
                                            cosignatories: Account[],
                                            generationHash: string): SignedTransaction {
    return transaction.signTransactionWithCosignatories(this, cosignatories, generationHash);
    }

    /**
     * Sign aggregate signature transaction
     * @param cosignatureTransaction - The aggregate signature transaction.
     * @return {CosignatureSignedTransaction}
     */
    public signCosignatureTransaction(cosignatureTransaction: CosignatureTransaction): CosignatureSignedTransaction {
        return cosignatureTransaction.signWith(this);
    }

    /**
     * Sign raw data
     * @param data - Data to be signed
     * @return {string} - Signed data result
     */
    public signData(data: string): string {
        return convert.uint8ToHex(KeyPair.sign(this.keyPair,
                            convert.hexToUint8(convert.utf8ToHex(data)),
                        ));
    }
}
