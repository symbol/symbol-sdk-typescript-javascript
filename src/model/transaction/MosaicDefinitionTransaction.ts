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

import { MosaicCreationTransaction as MosaicDefinitionTransactionLibrary, mosaicId as mosaicIdLibrary, VerifiableTransaction } from 'nem2-library';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { MosaicId } from '../mosaic/MosaicId';
import { MosaicProperties } from '../mosaic/MosaicProperties';
import { NamespaceId } from '../namespace/NamespaceId';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';

/**
 * Before a mosaic can be created or transferred, a corresponding definition of the mosaic has to be created and published to the network.
 * This is done via a mosaic definition transaction.
 */
export class MosaicDefinitionTransaction extends Transaction {

    /**
     * Create a mosaic creation transaction object
     * @param deadline - The deadline to include the transaction.
     * @param mosaicName - The mosaic name ex: xem.
     * @param namespaceName - The namespace where mosaic will be included ex: nem.
     * @param mosaicProperties - The mosaic properties.
     * @param networkType - The network type.
     * @returns {MosaicDefinitionTransaction}
     */
    public static create(deadline: Deadline,
                         mosaicName: string,
                         namespaceName: string,
                         mosaicProperties: MosaicProperties,
                         networkType: NetworkType): MosaicDefinitionTransaction {
        return new MosaicDefinitionTransaction(networkType,
            2,
            deadline,
            new UInt64([0, 0]),
            new NamespaceId(namespaceName),
            new MosaicId(mosaicIdLibrary(namespaceName, mosaicName)),
            mosaicName,
            mosaicProperties,
        );
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param fee
     * @param parentId
     * @param mosaicId
     * @param mosaicName
     * @param mosaicProperties
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                fee: UInt64,
                /**
                 * The namespace id.
                 */
                public readonly parentId: NamespaceId,
                /**
                 * The mosaic id.
                 */
                public readonly mosaicId: MosaicId,
                /**
                 * The name of the mosaic.
                 */
                public readonly mosaicName: string,
                /**
                 * The mosaic properties.
                 */
                public readonly mosaicProperties: MosaicProperties,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.MOSAIC_DEFINITION, networkType, version, deadline, fee, signature, signer, transactionInfo);
    }

    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    protected buildTransaction(): VerifiableTransaction {
        let mosaicDefinitionTransaction = new MosaicDefinitionTransactionLibrary.Builder()
            .addDeadline(this.deadline.toDTO())
            .addFee(this.fee.toDTO())
            .addVersion(this.versionToDTO())
            .addDivisibility(this.mosaicProperties.divisibility)
            .addDuration(this.mosaicProperties.duration.toDTO())
            .addParentId(this.parentId.id.toDTO())
            .addMosaicId(this.mosaicId.id.toDTO())
            .addMosaicName(this.mosaicName);

        if (this.mosaicProperties.supplyMutable === true) {
            mosaicDefinitionTransaction = mosaicDefinitionTransaction.addSupplyMutable();
        }

        if (this.mosaicProperties.transferable === true) {
            mosaicDefinitionTransaction = mosaicDefinitionTransaction.addTransferability();
        }

        if (this.mosaicProperties.levyMutable === true) {
            mosaicDefinitionTransaction = mosaicDefinitionTransaction.addLevyMutable();
        }

        return mosaicDefinitionTransaction.build();
    }

}
