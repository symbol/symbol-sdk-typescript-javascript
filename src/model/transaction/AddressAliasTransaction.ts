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

import { AddressAliasTransaction as AddressAliasTransactionLibrary, VerifiableTransaction } from 'nem2-library';
import { Address } from '../account/Address';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { AliasActionType } from '../namespace/AliasActionType';
import { NamespaceId } from '../namespace/NamespaceId';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';

/**
 * In case a mosaic has the flag 'supplyMutable' set to true, the creator of the mosaic can change the supply,
 * i.e. increase or decrease the supply.
 */
export class AddressAliasTransaction extends Transaction {

    /**
     * Create a mosaic supply change transaction object
     * @param deadline - The deadline to include the transaction.
     * @param actionType - The namespace id.
     * @param namespaceId - The namespace id.
     * @param mosaicId - The mosaic id.
     * @param networkType - The network type.
     * @returns {AddressAliasTransaction}
     */
    public static create(deadline: Deadline,
                         actionType: AliasActionType,
                         namespaceId: NamespaceId,
                         address: Address,
                         networkType: NetworkType): AddressAliasTransaction {
        return new AddressAliasTransaction(networkType,
            TransactionVersion.ADDRESS_ALIAS,
            deadline,
            new UInt64([0, 0]),
            actionType,
            namespaceId,
            address,
        );
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param fee
     * @param actionType
     * @param namespaceId
     * @param address
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                fee: UInt64,
                /**
                 * The alias action type.
                 */
                public readonly actionType: AliasActionType,
                /**
                 * The namespace id that will be an alias.
                 */
                public readonly namespaceId: NamespaceId,
                /**
                 * The mosaic id.
                 */
                public readonly address: Address,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.ADDRESS_ALIAS, networkType, version, deadline, fee, signature, signer, transactionInfo);
    }

    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    protected buildTransaction(): VerifiableTransaction {
        return new AddressAliasTransactionLibrary.Builder()
            .addDeadline(this.deadline.toDTO())
            .addFee(this.fee.toDTO())
            .addVersion(this.versionToDTO())
            .addActionType(this.actionType)
            .addNamespaceId(this.namespaceId.id.toDTO())
            .addAddress(this.address.plain())
            .build();
    }

}
