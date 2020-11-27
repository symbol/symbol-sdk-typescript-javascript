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

import {
    AmountDto,
    BlockDurationDto,
    EmbeddedMosaicDefinitionTransactionBuilder,
    EmbeddedTransactionBuilder,
    GeneratorUtils,
    MosaicDefinitionTransactionBuilder,
    MosaicFlagsDto,
    MosaicNonceDto,
    TimestampDto,
    TransactionBuilder,
} from 'catbuffer-typescript';
import { Convert } from '../../core/format';
import { Address } from '../account/Address';
import { PublicAccount } from '../account/PublicAccount';
import { MosaicFlags } from '../mosaic/MosaicFlags';
import { MosaicId } from '../mosaic/MosaicId';
import { MosaicNonce } from '../mosaic/MosaicNonce';
import { NetworkType } from '../network/NetworkType';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { InnerTransaction } from './InnerTransaction';
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
     * @param flags - The mosaic flags.
     * @param divisibility - The mosaic divicibility.
     * @param duration - The mosaic duration.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @param signature - (Optional) Transaction signature
     * @param signer - (Optional) Signer public account
     * @returns {MosaicDefinitionTransaction}
     */
    public static create(
        deadline: Deadline,
        nonce: MosaicNonce,
        mosaicId: MosaicId,
        flags: MosaicFlags,
        divisibility: number,
        duration: UInt64,
        networkType: NetworkType,
        maxFee: UInt64 = new UInt64([0, 0]),
        signature?: string,
        signer?: PublicAccount,
    ): MosaicDefinitionTransaction {
        return new MosaicDefinitionTransaction(
            networkType,
            TransactionVersion.MOSAIC_DEFINITION,
            deadline,
            maxFee,
            nonce,
            mosaicId,
            flags,
            divisibility,
            duration,
            signature,
            signer,
        );
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param nonce
     * @param mosaicId
     * @param flags
     * @param divisibility
     * @param duration
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(
        networkType: NetworkType,
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
        public readonly flags: MosaicFlags,
        /**
         * Mosaic divisibility
         */
        public readonly divisibility: number,
        /**
         * Mosaic duration, 0 value for eternal mosaic
         */
        public readonly duration: UInt64 = UInt64.fromUint(0),
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo,
    ) {
        super(TransactionType.MOSAIC_DEFINITION, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * Create a transaction object from payload
     * @param {string} payload Binary payload
     * @param {Boolean} isEmbedded Is embedded transaction (Default: false)
     * @returns {Transaction | InnerTransaction}
     */
    public static createFromPayload(payload: string, isEmbedded = false): Transaction | InnerTransaction {
        const builder = isEmbedded
            ? EmbeddedMosaicDefinitionTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload))
            : MosaicDefinitionTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload));
        const signerPublicKey = Convert.uint8ToHex(builder.getSignerPublicKey().key);
        const networkType = builder.getNetwork().valueOf();
        const signature = Transaction.getSignatureFromPayload(payload, isEmbedded);
        const transaction = MosaicDefinitionTransaction.create(
            isEmbedded
                ? Deadline.createEmtpy()
                : Deadline.createFromDTO((builder as MosaicDefinitionTransactionBuilder).getDeadline().timestamp),
            MosaicNonce.createFromUint8Array(builder.getNonce().serialize()),
            new MosaicId(builder.getId().mosaicId),
            MosaicFlags.create(
                builder.getFlags().indexOf(MosaicFlagsDto.SUPPLY_MUTABLE) > -1,
                builder.getFlags().indexOf(MosaicFlagsDto.TRANSFERABLE) > -1,
                builder.getFlags().indexOf(MosaicFlagsDto.RESTRICTABLE) > -1,
            ),
            builder.getDivisibility(),
            new UInt64(builder.getDuration().blockDuration),
            networkType,
            isEmbedded ? new UInt64([0, 0]) : new UInt64((builder as MosaicDefinitionTransactionBuilder).fee.amount),
            signature,
            signerPublicKey.match(`^[0]+$`) ? undefined : PublicAccount.createFromPublicKey(signerPublicKey, networkType),
        );
        return isEmbedded ? transaction.toAggregate(PublicAccount.createFromPublicKey(signerPublicKey, networkType)) : transaction;
    }

    /**
     * @description Get mosaic nonce int value
     * @returns {number}
     * @memberof MosaicDefinitionTransaction
     */
    public getMosaicNonceIntValue(): number {
        return this.nonce.toDTO();
    }

    /**
     * @internal
     * @returns {TransactionBuilder}
     */
    protected createBuilder(): TransactionBuilder {
        return new MosaicDefinitionTransactionBuilder(
            this.getSignatureAsBuilder(),
            this.getSignerAsBuilder(),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.MOSAIC_DEFINITION.valueOf(),
            new AmountDto(this.maxFee.toDTO()),
            new TimestampDto(this.deadline.toDTO()),
            this.mosaicId.toBuilder(),
            new BlockDurationDto(this.duration.toDTO()),
            new MosaicNonceDto(this.getMosaicNonceIntValue()),
            GeneratorUtils.toFlags(MosaicFlagsDto, this.flags.getValue()),
            this.divisibility,
        );
    }

    /**
     * @internal
     * @returns {EmbeddedTransactionBuilder}
     */
    public toEmbeddedTransaction(): EmbeddedTransactionBuilder {
        return new EmbeddedMosaicDefinitionTransactionBuilder(
            this.getSignerAsBuilder(),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.MOSAIC_DEFINITION.valueOf(),
            this.mosaicId.toBuilder(),
            new BlockDurationDto(this.duration.toDTO()),
            new MosaicNonceDto(this.getMosaicNonceIntValue()),
            GeneratorUtils.toFlags(MosaicFlagsDto, this.flags.getValue()),
            this.divisibility,
        );
    }

    /**
     * @internal
     * @returns {MosaicDefinitionTransaction}
     */
    resolveAliases(): MosaicDefinitionTransaction {
        return this;
    }

    /**
     * @internal
     * Check a given address should be notified in websocket channels
     * @param address address to be notified
     * @returns {boolean}
     */
    public shouldNotifyAccount(address: Address): boolean {
        return super.isSigned(address);
    }
}
