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

import { Builder } from '../../core/transaction/AccountPropertiesMosaicTransaction';
import {VerifiableTransaction} from '../../core/transaction/VerifiableTransaction';
import { PropertyType } from '../account/PropertyType';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { AccountPropertyModification } from './AccountPropertyModification';
import { Deadline } from './Deadline';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';

export class ModifyAccountPropertyMosaicTransaction extends Transaction {

    /**
     * Create a modify account property mosaic transaction object
     * @param deadline - The deadline to include the transaction.
     * @param propertyType - The account property type.
     * @param modifications - The array of modifications.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {ModifyAccountPropertyAddressTransaction}
     */
    public static create(deadline: Deadline,
                         propertyType: PropertyType,
                         modifications: Array<AccountPropertyModification<number[]>>,
                         networkType: NetworkType,
                         maxFee: UInt64 = new UInt64([0, 0])): ModifyAccountPropertyMosaicTransaction {
        return new ModifyAccountPropertyMosaicTransaction(networkType,
            TransactionVersion.MODIFY_ACCOUNT_PROPERTY_MOSAIC,
            deadline,
            maxFee,
            propertyType,
            modifications);
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param minApprovalDelta
     * @param minRemovalDelta
     * @param modifications
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                public readonly propertyType: PropertyType,
                public readonly modifications: Array<AccountPropertyModification<number[]>>,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.MODIFY_ACCOUNT_PROPERTY_MOSAIC, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a ModifyAccountPropertyMosaicTransaction
     * @returns {number}
     * @memberof ModifyAccountPropertyMosaicTransaction
     */
    public get size(): number {
        const byteSize = super.size;

        // set static byte size fields
        const bytePropertyType = 1;
        const byteModificationCount = 1;

        // each modification contains :
        // - 1 byte for modificationType
        // - 8 bytes for the modification value (mosaicId)
        const byteModifications = 9 * this.modifications.length;

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
            .addPropertyType(this.propertyType)
            .addModifications(this.modifications.map((modification) => modification.toDTO()))
            .build();
    }

}
