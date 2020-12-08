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

import { PublicAccount } from '../account/PublicAccount';
import { UInt64 } from '../UInt64';

/**
 * Model representing cosignature of an aggregate transaction.
 */
export class AggregateTransactionCosignature {
    /**
     * @param signature
     * @param signer
     * @param version
     */
    constructor(
        /**
         * The signature of aggregate transaction done by the cosigner.
         */
        public readonly signature: string,
        /**
         * The cosigner public account.
         */
        public readonly signer: PublicAccount,
        /**
         * Version
         */
        public readonly version = UInt64.fromUint(0),
    ) {}

    /**
     * Create DTO object
     */
    public toDTO(): any {
        return {
            version: this.version.toDTO(),
            signature: this.signature,
            signerPublicKey: this.signer.toDTO(),
        };
    }
}
