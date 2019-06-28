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

import {NetworkType} from '../blockchain/NetworkType';

/**
 * SignedTransaction object is used to transfer the transaction data and the signature to the server
 * in order to initiate and broadcast a transaction.
 */
export class SignedTransaction {
    /**
     * @internal
     * @param payload
     * @param hash
     * @param signer
     * @param type
     * @param networkType
     */
    constructor(/**
                 * Transaction serialized data
                 */
                public readonly payload: string,
                /**
                 * Transaction hash
                 */
                public readonly hash: string,
                /**
                 * Transaction signer
                 */
                public readonly signer: string,
                /**
                 * Transaction type
                 */
                public readonly type: number,
                /**
                 * Signer network type
                 */
                public readonly networkType: NetworkType) {
        if (hash.length !== 64) {
            throw new Error('hash must be 64 characters long');
        }
    }

    /**
     * Create DTO object
     */
    toDTO() {
        return {
            payload: this.payload,
            hash: this.hash,
            signer: this.signer,
            type: this.type,
            networkType: this.networkType,
        };
    }
}
