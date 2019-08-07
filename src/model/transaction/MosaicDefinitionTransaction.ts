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

import { Builder } from '../../infrastructure/builders/MosaicCreationTransaction';
import {VerifiableTransaction} from '../../infrastructure/builders/VerifiableTransaction';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { MosaicId } from '../mosaic/MosaicId';
import { MosaicNonce } from '../mosaic/MosaicNonce';
import { MosaicProperties } from '../mosaic/MosaicProperties';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';
import { MosaicDefinitionTransactionBuilder } from '../../infrastructure/catbuffer/MosaicDefinitionTransactionBuilder';
import { SignatureDto } from '../../infrastructure/catbuffer/SignatureDto';
import { KeyDto } from '../../infrastructure/catbuffer/KeyDto';
import { EntityTypeDto } from '../../infrastructure/catbuffer/EntityTypeDto';
import { AmountDto } from '../../infrastructure/catbuffer/AmountDto';
import { TimestampDto } from '../../infrastructure/catbuffer/TimestampDto';
import { MosaicNonceDto } from '../../infrastructure/catbuffer/MosaicNonceDto';
import { MosaicIdDto } from '../../infrastructure/catbuffer/MosaicIdDto';
import { MosaicFlagsDto } from '../../infrastructure/catbuffer/MosaicFlagsDto';
import { MosaicFlags } from '../mosaic/MosaicFlag';
import { BlockDurationDto } from '../../infrastructure/catbuffer/BlockDurationDto';
import { Convert } from '../../core/format';
import { GeneratorUtils } from '../../infrastructure/catbuffer/GeneratorUtils';

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
     * @description get the calculated mosaic flag value
     * @returns {number}
     * @memberof MosaicDefinitionTransaction
     */
    public getMosaicFlagValue(): number {
        let flag = MosaicFlags.NONE;
        if (this.mosaicProperties.supplyMutable === true) {
            flag += MosaicFlags.SUPPLY_MUTABLE;
        }

        if (this.mosaicProperties.transferable === true) {
            flag += MosaicFlags.TRANSFERABLE;
        }

        if (this.mosaicProperties.restrictable === true) {
            flag += MosaicFlags.RESTRICTABLE;
        }

        return flag.valueOf();
    }

    /**
     * @description Get mosaic nonce int value
     * @returns {number}
     * @memberof MosaicDefinitionTransaction
     */
    public getMosaicNonceIntValue(): number {
        return GeneratorUtils.readUint32At(this.nonce.toDTO(), 0);
    }

    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    protected buildTransaction(): VerifiableTransaction {
        let mosaicDefinitionTransaction = new Builder()
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

        if (this.mosaicProperties.restrictable === true) {
            mosaicDefinitionTransaction = mosaicDefinitionTransaction.addRestrictable();
        }

        return mosaicDefinitionTransaction.build();
    }

    /**
     * @internal
     * @returns {Uint8Array}
     */
    protected generateBytes(): Uint8Array {
        const signerBuffer = new Uint8Array(32);
        const signatureBuffer = new Uint8Array(64);

        const transactionBuilder = new MosaicDefinitionTransactionBuilder(
            new SignatureDto(signatureBuffer),
            new KeyDto(signerBuffer),
            this.versionToDTO(),
            TransactionType.MOSAIC_DEFINITION.valueOf(),
            new AmountDto(this.maxFee.toDTO()),
            new TimestampDto(this.deadline.toDTO()),
            new MosaicNonceDto(this.getMosaicNonceIntValue()),
            new MosaicIdDto(this.mosaicId.id.toDTO()),
            this.getMosaicFlagValue(),
            this.mosaicProperties.divisibility,
            new BlockDurationDto(this.mosaicProperties.duration ?
                    this.mosaicProperties.duration.toDTO() : []),
        );
        return transactionBuilder.serialize();
    }
}
