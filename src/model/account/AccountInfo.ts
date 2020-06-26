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

import { Mosaic } from '../mosaic/Mosaic';
import { UInt64 } from '../UInt64';
import { AccountType } from './AccountType';
import { ActivityBucket } from './ActivityBucket';
import { Address } from './Address';
import { PublicAccount } from './PublicAccount';
import { SupplementalPublicKeys } from './SupplementalPublicKeys';

/**
 * The account info structure describes basic information for an account.
 */
export class AccountInfo {
    /**
     *
     */
    constructor(
        /**
         * Address of the account.
         */
        public readonly address: Address,
        /**
         * Height when the address was published.
         */
        public readonly addressHeight: UInt64,
        /**
         * Public key of the account.
         */
        public readonly publicKey: string,
        /**
         * Height when the public key was published.
         */
        public readonly publicKeyHeight: UInt64,
        /**
         * Account type
         */
        public readonly accountType: AccountType,
        /**
         * Account keys
         */
        public readonly supplementalPublicKeys: SupplementalPublicKeys,
        /**
         * Account activity bucket
         */
        public readonly activityBucket: ActivityBucket[],
        /**
         * Mosaics held by the account.
         */
        public readonly mosaics: Mosaic[],
        /**
         * Importance of the account.
         */
        public readonly importance: UInt64,
        /**
         * Importance height of the account.
         */
        public readonly importanceHeight: UInt64,
    ) {}

    /**
     * Returns account public account.
     * @returns {PublicAccount}
     */
    get publicAccount(): PublicAccount {
        return PublicAccount.createFromPublicKey(this.publicKey, this.address.networkType);
    }
}
