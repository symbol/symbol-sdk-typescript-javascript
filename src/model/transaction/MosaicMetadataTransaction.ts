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

import {
    AmountDto,
    EmbeddedMosaicMetadataTransactionBuilder,
    EmbeddedTransactionBuilder,
    MosaicMetadataTransactionBuilder,
    TimestampDto,
    TransactionBuilder,
    UnresolvedAddressDto,
    UnresolvedMosaicIdDto,
} from 'catbuffer-typescript';
import { Convert } from '../../core/format';
import { DtoMapping } from '../../core/utils/DtoMapping';
import { UnresolvedMapping } from '../../core/utils/UnresolvedMapping';
import { PublicAccount } from '../account/PublicAccount';
import { UnresolvedAddress } from '../account/UnresolvedAddress';
import { UnresolvedMosaicId } from '../mosaic/UnresolvedMosaicId';
import { NetworkType } from '../network/NetworkType';
import { Statement } from '../receipt/Statement';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { InnerTransaction } from './InnerTransaction';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';

/**
 * Announce an mosaic metadata transaction to associate a key-value state to an account.
 */
export class MosaicMetadataTransaction extends Transaction {
    /**
     * Create a mosaic meta data transaction object
     * @param deadline - transaction deadline
     * @param targetAddress - target account address.
     * @param scopedMetadataKey - Metadata key scoped to source, target and type.
     * @param targetMosaicId - Target unresolved mosaic identifier.
     * @param valueSizeDelta - Change in value size in bytes.
     * @param value - String value with UTF-8 encoding
     *                Difference between the previous value and new value.
     *                You can calculate value as xor(previous-value, new-value).
     *                If there is no previous value, use directly the new value.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @param signature - (Optional) Transaction signature
     * @param signer - (Optional) Signer public account
     * @returns {MosaicMetadataTransaction}
     */
    public static create(
        deadline: Deadline,
        targetAddress: UnresolvedAddress,
        scopedMetadataKey: UInt64,
        targetMosaicId: UnresolvedMosaicId,
        valueSizeDelta: number,
        value: string,
        networkType: NetworkType,
        maxFee: UInt64 = new UInt64([0, 0]),
        signature?: string,
        signer?: PublicAccount,
    ): MosaicMetadataTransaction {
        return new MosaicMetadataTransaction(
            networkType,
            TransactionVersion.MOSAIC_METADATA,
            deadline,
            maxFee,
            targetAddress,
            scopedMetadataKey,
            targetMosaicId,
            valueSizeDelta,
            value,
            signature,
            signer,
        );
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param targetAddress
     * @param scopedMetadataKey
     * @param targetMosaicId
     * @param valueSizeDelta
     * @param value
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
         * target account address.
         */
        public readonly targetAddress: UnresolvedAddress,
        /**
         * Metadata key scoped to source, target and type.
         */
        public readonly scopedMetadataKey: UInt64,
        /**
         * Target mosaic identifier.
         */
        public readonly targetMosaicId: UnresolvedMosaicId,
        /**
         * Change in value size in bytes.
         */
        public readonly valueSizeDelta: number,
        /**
         * String value with UTF-8 encoding.
         * Difference between the previous value and new value.
         */
        public readonly value: string,
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo,
    ) {
        super(TransactionType.MOSAIC_METADATA, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * Create a transaction object from payload
     * @param {string} payload Binary payload
     * @param {Boolean} isEmbedded Is embedded transaction (Default: false)
     * @returns {Transaction | InnerTransaction}
     */
    public static createFromPayload(payload: string, isEmbedded = false): Transaction | InnerTransaction {
        const builder = isEmbedded
            ? EmbeddedMosaicMetadataTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload))
            : MosaicMetadataTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload));
        const signerPublicKey = Convert.uint8ToHex(builder.getSignerPublicKey().key);
        const networkType = builder.getNetwork().valueOf();
        const signature = Transaction.getSignatureFromPayload(payload, isEmbedded);
        const transaction = MosaicMetadataTransaction.create(
            isEmbedded
                ? Deadline.createEmtpy()
                : Deadline.createFromDTO((builder as MosaicMetadataTransactionBuilder).getDeadline().timestamp),
            UnresolvedMapping.toUnresolvedAddress(Convert.uint8ToHex(builder.getTargetAddress().unresolvedAddress)),
            new UInt64(builder.getScopedMetadataKey()),
            UnresolvedMapping.toUnresolvedMosaic(new UInt64(builder.getTargetMosaicId().unresolvedMosaicId).toHex()),
            builder.getValueSizeDelta(),
            Convert.uint8ToUtf8(builder.getValue()),
            networkType,
            isEmbedded ? new UInt64([0, 0]) : new UInt64((builder as MosaicMetadataTransactionBuilder).fee.amount),
            signature,
            signerPublicKey.match(`^[0]+$`) ? undefined : PublicAccount.createFromPublicKey(signerPublicKey, networkType),
        );
        return isEmbedded ? transaction.toAggregate(PublicAccount.createFromPublicKey(signerPublicKey, networkType)) : transaction;
    }

    /**
     * @internal
     * @returns {TransactionBuilder}
     */
    protected createBuilder(): TransactionBuilder {
        const transactionBuilder = new MosaicMetadataTransactionBuilder(
            this.getSignatureAsBuilder(),
            this.getSignerAsBuilder(),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.MOSAIC_METADATA.valueOf(),
            new AmountDto(this.maxFee.toDTO()),
            new TimestampDto(this.deadline.toDTO()),
            new UnresolvedAddressDto(this.targetAddress.encodeUnresolvedAddress(this.networkType)),
            this.scopedMetadataKey.toDTO(),
            new UnresolvedMosaicIdDto(this.targetMosaicId.id.toDTO()),
            this.valueSizeDelta,
            Convert.utf8ToUint8(this.value),
        );
        return transactionBuilder;
    }

    /**
     * @internal
     * @returns {EmbeddedTransactionBuilder}
     */
    public toEmbeddedTransaction(): EmbeddedTransactionBuilder {
        return new EmbeddedMosaicMetadataTransactionBuilder(
            this.getSignerAsBuilder(),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.MOSAIC_METADATA.valueOf(),
            new UnresolvedAddressDto(this.targetAddress.encodeUnresolvedAddress(this.networkType)),
            this.scopedMetadataKey.toDTO(),
            new UnresolvedMosaicIdDto(this.targetMosaicId.id.toDTO()),
            this.valueSizeDelta,
            Convert.utf8ToUint8(this.value),
        );
    }

    /**
     * @internal
     * @param statement Block receipt statement
     * @param aggregateTransactionIndex Transaction index for aggregated transaction
     * @returns {MosaicMetadataTransaction}
     */
    resolveAliases(statement: Statement, aggregateTransactionIndex = 0): MosaicMetadataTransaction {
        const transactionInfo = this.checkTransactionHeightAndIndex();
        return DtoMapping.assign(this, {
            targetMosaicId: statement.resolveMosaicId(
                this.targetMosaicId,
                transactionInfo.height.toString(),
                transactionInfo.index,
                aggregateTransactionIndex,
            ),
        });
    }

    /**
     * @internal
     * Check a given address should be notified in websocket channels
     * @param address address to be notified
     * @returns {boolean}
     */
    public shouldNotifyAccount(address: UnresolvedAddress): boolean {
        return super.isSigned(address) || this.targetAddress.equals(address);
    }
}
