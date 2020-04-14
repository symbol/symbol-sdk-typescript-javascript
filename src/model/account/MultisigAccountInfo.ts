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

import { PublicAccount } from './PublicAccount';

/**
 * The multisig account graph info structure describes the information of all the mutlisig levels an account is involved in.
 */
export class MultisigAccountInfo {
    /**
     * @param account
     * @param minApproval
     * @param minRemoval
     * @param cosignatories
     * @param multisigAccounts
     */
    constructor(
        /**
         * The account multisig public account.
         */
        public readonly account: PublicAccount,
        /**
         * The number of signatures needed to approve a transaction.
         */
        public readonly minApproval: number,
        /**
         * The number of signatures needed to remove a cosignatory.
         */
        public readonly minRemoval: number,
        /**
         * The multisig account cosignatories.
         */
        public readonly cosignatories: PublicAccount[],
        /**
         * The multisig accounts this account is cosigner of.
         */
        public readonly multisigAccounts: PublicAccount[],
    ) {}

    /**
     * Checks if the account is a multisig account.
     * @returns {boolean}
     */
    public isMultisig(): boolean {
        return this.minRemoval !== 0 && this.minApproval !== 0;
    }

    /**
     * Checks if an account is cosignatory of the multisig account.
     * @param account
     * @returns {boolean}
     */
    public hasCosigner(account: PublicAccount): boolean {
        return this.cosignatories.find((cosigner) => cosigner.equals(account)) !== undefined;
    }

    /**
     * Checks if the multisig account is cosignatory of an account.
     * @param account
     * @returns {boolean}
     */
    public isCosignerOfMultisigAccount(account: PublicAccount): boolean {
        return this.multisigAccounts.find((multisigAccount) => multisigAccount.equals(account)) !== undefined;
    }
}
