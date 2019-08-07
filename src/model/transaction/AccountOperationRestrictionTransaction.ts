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

import { Builder } from '../../infrastructure/builders/AccountRestrictionsEntityTypeTransaction';
import {VerifiableTransaction} from '../../infrastructure/builders/VerifiableTransaction';
import { PublicAccount } from '../account/PublicAccount';
import { RestrictionType } from '../account/RestrictionType';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { AccountRestrictionModification } from './AccountRestrictionModification';
import { Deadline } from './Deadline';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';
import { AccountOperationRestrictionModificationBuilder } from '../../infrastructure/catbuffer/AccountOperationRestrictionModificationBuilder';
import { AccountOperationRestrictionTransactionBuilder } from '../../infrastructure/catbuffer/AccountOperationRestrictionTransactionBuilder';
import { SignatureDto } from '../../infrastructure/catbuffer/SignatureDto';
import { KeyDto } from '../../infrastructure/catbuffer/KeyDto';
import { EntityTypeDto } from '../../infrastructure/catbuffer/EntityTypeDto';
import { AmountDto } from '../../infrastructure/catbuffer/AmountDto';
import { TimestampDto } from '../../infrastructure/catbuffer/TimestampDto';

export class AccountOperationRestrictionTransaction extends Transaction {

    /**
     * Create a modify account operation restriction type transaction object
     * @param deadline - The deadline to include the transaction.
     * @param restrictionType - The account restriction type.
     * @param modifications - The array of modifications.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {AccountOperationRestrictionTransaction}
     */
    public static create(deadline: Deadline,
                         restrictionType: RestrictionType,
                         modifications: Array<AccountRestrictionModification<TransactionType>>,
                         networkType: NetworkType,
                         maxFee: UInt64 = new UInt64([0, 0])): AccountOperationRestrictionTransaction {
        return new AccountOperationRestrictionTransaction(networkType,
            TransactionVersion.MODIFY_ACCOUNT_RESTRICTION_ENTITY_TYPE,
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
        super(TransactionType.ACCOUNT_RESTRICTION_OPERATION,
              networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a AccountOperationRestrictionTransaction
     * @returns {number}
     * @memberof AccountOperationRestrictionTransaction
     */
    public get size(): number {
        const byteSize = super.size;

        // set static byte size fields
        const byteRestrictionType = 1;
        const byteModificationCount = 1;

        // each modification contains :
        // - 1 byte for modificationType
        // - 2 bytes for the modification value (transaction type)
        const byteModifications = 3 * this.modifications.length;

        return byteSize + byteRestrictionType + byteModificationCount + byteModifications;
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
            .addRestrictionType(this.restrictionType)
            .addModifications(this.modifications.map((modification) => modification.toDTO()))
            .build();
    }

    /**
     * @internal
     * @returns {Uint8Array}
     */
    protected generateBytes(): Uint8Array {
        const signerBuffer = new Uint8Array(32);
        const signatureBuffer = new Uint8Array(64);

        const transactionBuilder = new AccountOperationRestrictionTransactionBuilder(
            new SignatureDto(signatureBuffer),
            new KeyDto(signerBuffer),
            this.versionToDTO(),
            TransactionType.ACCOUNT_RESTRICTION_OPERATION.valueOf(),
            new AmountDto(this.maxFee.toDTO()),
            new TimestampDto(this.deadline.toDTO()),
            this.restrictionType.valueOf(),
            this.modifications.map((modification) => {
                return new AccountOperationRestrictionModificationBuilder(
                    modification.modificationType.valueOf(),
                    modification.value.valueOf(),
                );
            }),
        );
        return transactionBuilder.serialize();
    }
}
