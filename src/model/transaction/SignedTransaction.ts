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

import { Address } from '../account/Address';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../network/NetworkType';
import { TransactionType } from './TransactionType';

/**
 * SignedTransaction object is used to transfer the transaction data and the signature to the server
 * in order to initiate and broadcast a transaction.
 */
export class SignedTransaction {
    /**
     * @param payload
     * @param hash
     * @param type
     * @param networkType
     */
    constructor(
        /**
         * Transaction serialized data
         */
        public readonly payload: string,
        /**
         * Transaction hash
         */
        public readonly hash: string,
        /**
         * Transaction signerPublicKey
         */
        public readonly signerPublicKey: string,
        /**
         * Transaction type
         */
        public readonly type: TransactionType,
        /**
         * Signer network type
         */
        public readonly networkType: NetworkType,
    ) {
        if (hash.length !== 64) {
            throw new Error('hash must be 64 characters long');
        }
    }

    /**
     * Create DTO object
     */
    toDTO(): any {
        return {
            payload: this.payload,
            hash: this.hash,
            signerPublicKey: this.signerPublicKey,
            type: this.type,
            networkType: this.networkType,
        };
    }

    /**
     * Return signer's address
     * @returns {Address}
     */
    getSignerAddress(): Address {
        return PublicAccount.createFromPublicKey(this.signerPublicKey, this.networkType).address;
    }
}
