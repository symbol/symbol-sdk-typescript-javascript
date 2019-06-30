/*
 * Copyright 2019 NEM
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

import { Builder } from '../../infrastructure/builders/AccountPropertiesEntityTypeTransaction';
import {VerifiableTransaction} from '../../infrastructure/builders/VerifiableTransaction';
import { RestrictionType } from '../account/RestrictionType';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { AccountRestrictionModification } from './AccountRestrictionModification';
import { Deadline } from './Deadline';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';

export class AccountOperationRestrictionModificationTransaction extends Transaction {

    /**
     * Create a modify account operation restriction type transaction object
     * @param deadline - The deadline to include the transaction.
     * @param restrictionType - The account restriction type.
     * @param modifications - The array of modifications.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {AccountOperationRestrictionModificationTransaction}
     */
    public static create(deadline: Deadline,
                         restrictionType: RestrictionType,
                         modifications: Array<AccountRestrictionModification<TransactionType>>,
                         networkType: NetworkType,
                         maxFee: UInt64 = new UInt64([0, 0])): AccountOperationRestrictionModificationTransaction {
        return new AccountOperationRestrictionModificationTransaction(networkType,
            TransactionVersion.MODIFY_ACCOUNT_PROPERTY_ENTITY_TYPE,
            deadline,
            maxFee,
            restrictionType,
            modifications);
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param restrictionType
     * @param modifications
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                public readonly restrictionType: RestrictionType,
                public readonly modifications: Array<AccountRestrictionModification<TransactionType>>,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.MODIFY_ACCOUNT_PROPERTY_ENTITY_TYPE, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a AccountOperationRestrictionModificationTransaction
     * @returns {number}
     * @memberof AccountOperationRestrictionModificationTransaction
     */
    public get size(): number {
        const byteSize = super.size;

        // set static byte size fields
        const bytePropertyType = 1;
        const byteModificationCount = 1;

        // each modification contains :
        // - 1 byte for modificationType
        // - 2 bytes for the modification value (transaction type)
        const byteModifications = 3 * this.modifications.length;

        return byteSize + bytePropertyType + byteModificationCount + byteModifications;
    }

    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    protected buildTransaction(): VerifiableTransaction {
        return new Builder()
            .addDeadline(this.deadline.toDTO())
            .addFee(this.maxFee.toDTO())
            .addVersion(this.versionToDTO())
            .addPropertyType(this.restrictionType)
            .addModifications(this.modifications.map((modification) => modification.toDTO()))
            .build();
    }

}
