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

import { MultisigEntryBuilder } from 'catbuffer-typescript';
import { Address } from './Address';

/**
 * The multisig account graph info structure describes the information of all the mutlisig levels an account is involved in.
 */
export class MultisigAccountInfo {
    /**
     * @param version
     * @param accountAddress
     * @param minApproval
     * @param minRemoval
     * @param cosignatoryAddresses
     * @param multisigAddresses
     */
    constructor(
        /**
         * Version
         */
        public readonly version: number,
        /**
         * The account multisig address.
         */
        public readonly accountAddress: Address,
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
        public readonly cosignatoryAddresses: Address[],
        /**
         * The multisig accounts this account is cosigner of.
         */
        public readonly multisigAddresses: Address[],
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
     * @param address
     * @returns {boolean}
     */
    public hasCosigner(address: Address): boolean {
        return this.cosignatoryAddresses.find((cosigner) => cosigner.equals(address)) !== undefined;
    }

    /**
     * Checks if the multisig account is cosignatory of an account.
     * @param address
     * @returns {boolean}
     */
    public isCosignerOfMultisigAccount(address: Address): boolean {
        return this.multisigAddresses.find((multisig) => multisig.equals(address)) !== undefined;
    }

    /**
     * Generate buffer
     * @return {Uint8Array}
     */
    public serialize(): Uint8Array {
        return new MultisigEntryBuilder(
            this.version,
            this.minApproval,
            this.minRemoval,
            this.accountAddress.toBuilder(),
            this.cosignatoryAddresses.map((cosig) => cosig.toBuilder()),
            this.multisigAddresses.map((address) => address.toBuilder()),
        ).serialize();
    }
}
