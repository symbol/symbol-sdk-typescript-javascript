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
import { NetworkType } from '../blockchain/NetworkType';
import { MosaicId } from '../mosaic/MosaicId';
import { MosaicNonce } from '../mosaic/MosaicNonce';
import { MosaicProperties } from '../mosaic/MosaicProperties';
import { UInt64 } from '../UInt64';
import {MosaicCreationTransaction
        as MosaicDefinitionTransactionLibrary,
} from './builders/MosaicCreationTransaction';
import {VerifiableTransaction} from './builders/VerifiableTransaction';
import { Deadline } from './Deadline';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';

/**
 * Before a mosaic can be created or transferred, a corresponding definition of the mosaic has to be created and published to the network.
 * This is done via a mosaic definition transaction.
 */
export class MosaicDefinitionTransaction extends Transaction {

    /**
     * Create a mosaic creation transaction object
     * @param deadline - The deadline to include the transaction.
     * @param nonce - The mosaic nonce ex: MosaicNonce.createRandom().
     * @param mosaicId - The mosaic id ex: new MosaicId([481110499, 231112638]).
     * @param mosaicProperties - The mosaic properties.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {MosaicDefinitionTransaction}
     */
    public static create(deadline: Deadline,
                         nonce: MosaicNonce,
                         mosaicId: MosaicId,
                         mosaicProperties: MosaicProperties,
                         networkType: NetworkType,
                         maxFee: UInt64 = new UInt64([0, 0])): MosaicDefinitionTransaction {
        return new MosaicDefinitionTransaction(networkType,
            TransactionVersion.MOSAIC_DEFINITION,
            deadline,
            maxFee,
            nonce,
            mosaicId,
            mosaicProperties,
        );
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param mosaicNonce
     * @param mosaicId
     * @param mosaicProperties
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                /**
                 * The mosaic nonce.
                 */
                public readonly nonce: MosaicNonce,
                /**
                 * The mosaic id.
                 */
                public readonly mosaicId: MosaicId,
                /**
                 * The mosaic properties.
                 */
                public readonly mosaicProperties: MosaicProperties,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.MOSAIC_DEFINITION, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a MosaicDefinitionTransaction
     * @returns {number}
     * @memberof MosaicDefinitionTransaction
     */
    public get size(): number {
        const byteSize = super.size;

        // set static byte size fields
        const byteNonce = 4;
        const byteMosaicId = 8;
        const byteNumProps = 1;
        const byteFlags = 1;
        const byteDivisibility = 1;
        const byteDurationSize = 1;
        const byteDuration = 8;

        return byteSize + byteNonce + byteMosaicId + byteNumProps + byteFlags + byteDivisibility + byteDurationSize + byteDuration;
    }

    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    protected buildTransaction(): VerifiableTransaction {
        let mosaicDefinitionTransaction = new MosaicDefinitionTransactionLibrary.Builder()
            .addDeadline(this.deadline.toDTO())
            .addFee(this.maxFee.toDTO())
            .addVersion(this.versionToDTO())
            .addDivisibility(this.mosaicProperties.divisibility)
            .addDuration(this.mosaicProperties.duration ? this.mosaicProperties.duration.toDTO() : [])
            .addNonce(this.nonce.toDTO())
            .addMosaicId(this.mosaicId.id.toDTO());

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
