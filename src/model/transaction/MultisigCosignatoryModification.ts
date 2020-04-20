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
import { CosignatoryModificationAction } from './CosignatoryModificationAction';

/**
 * Multisig cosignatory modifications are part of the NEM's multisig account system.
 * With a multisig cosignatory modification a cosignatory is added to or deleted from a multisig account.
 * Multisig cosignatory modifications are part of a modify multisig account transactions.
 *
 */
export class MultisigCosignatoryModification {
    /**
     * Constructor
     * @param modificationAction
     * @param cosignatoryPublicAccount
     */
    constructor(
        /**
         * Multi-signature modification type.
         */
        public readonly modificationAction: CosignatoryModificationAction,
        /**
         * Cosignatory public account.
         */
        public readonly cosignatoryPublicAccount: PublicAccount,
    ) {}

    /**
     * @internal
     */
    toDTO(): any {
        return {
            cosignatoryPublicKey: this.cosignatoryPublicAccount.publicKey,
            modificationAction: this.modificationAction,
        };
    }
}
