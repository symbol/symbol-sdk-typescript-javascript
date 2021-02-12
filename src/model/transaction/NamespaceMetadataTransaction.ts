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
    EmbeddedNamespaceMetadataTransactionBuilder,
    EmbeddedTransactionBuilder,
    NamespaceMetadataTransactionBuilder,
    TimestampDto,
    TransactionBuilder,
    UnresolvedAddressDto,
} from 'catbuffer-typescript';
import { Convert } from '../../core/format';
import { UnresolvedMapping } from '../../core/utils/UnresolvedMapping';
import { PublicAccount } from '../account/PublicAccount';
import { UnresolvedAddress } from '../account/UnresolvedAddress';
import { NamespaceId } from '../namespace/NamespaceId';
import { NetworkType } from '../network/NetworkType';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { InnerTransaction } from './InnerTransaction';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';

/**
 * Announce an namespace metadata transaction to associate a key-value state to an account.
 */
export class NamespaceMetadataTransaction extends Transaction {
    /**
     * Create a mosaic meta data transaction object
     * @param deadline - transaction deadline
     * @param targetAddress - target account address.
     * @param scopedMetadataKey - Metadata key scoped to source, target and type.
     * @param targetNamespaceId - Target namespace identifier.
     * @param valueSizeDelta - Change in value size in bytes.
     * @param value - String value with UTF-8 encoding
     *                Difference between the previous value and new value.
     *                You can calculate value as xor(previous-value, new-value).
     *                If there is no previous value, use directly the new value.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @param signature - (Optional) Transaction signature
     * @param signer - (Optional) Signer public account
     * @returns {NamespaceMetadataTransaction}
     */
    public static create(
        deadline: Deadline,
        targetAddress: UnresolvedAddress,
        scopedMetadataKey: UInt64,
        targetNamespaceId: NamespaceId,
        valueSizeDelta: number,
        value: string,
        networkType: NetworkType,
        maxFee: UInt64 = new UInt64([0, 0]),
        signature?: string,
        signer?: PublicAccount,
    ): NamespaceMetadataTransaction {
        return new NamespaceMetadataTransaction(
            networkType,
            TransactionVersion.NAMESPACE_METADATA,
            deadline,
            maxFee,
            targetAddress,
            scopedMetadataKey,
            targetNamespaceId,
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
     * @param targetNamespaceId
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
         * Target namespace identifier.
         */
        public readonly targetNamespaceId: NamespaceId,
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
        super(TransactionType.NAMESPACE_METADATA, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * Create a transaction object from payload
     * @param {string} payload Binary payload
     * @param {Boolean} isEmbedded Is embedded transaction (Default: false)
     * @returns {Transaction | InnerTransaction}
     */
    public static createFromPayload(payload: string, isEmbedded = false): Transaction | InnerTransaction {
        const builder = isEmbedded
            ? EmbeddedNamespaceMetadataTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload))
            : NamespaceMetadataTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload));
        const signerPublicKey = Convert.uint8ToHex(builder.getSignerPublicKey().key);
        const networkType = builder.getNetwork().valueOf();
        const signature = Transaction.getSignatureFromPayload(payload, isEmbedded);
        const transaction = NamespaceMetadataTransaction.create(
            isEmbedded
                ? Deadline.createEmtpy()
                : Deadline.createFromDTO((builder as NamespaceMetadataTransactionBuilder).getDeadline().timestamp),
            UnresolvedMapping.toUnresolvedAddress(Convert.uint8ToHex(builder.getTargetAddress().unresolvedAddress)),
            new UInt64(builder.getScopedMetadataKey()),
            new NamespaceId(builder.getTargetNamespaceId().namespaceId),
            builder.getValueSizeDelta(),
            Convert.uint8ToUtf8(builder.getValue()),
            networkType,
            isEmbedded ? new UInt64([0, 0]) : new UInt64((builder as NamespaceMetadataTransactionBuilder).fee.amount),
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
        const transactionBuilder = new NamespaceMetadataTransactionBuilder(
            this.getSignatureAsBuilder(),
            this.getSignerAsBuilder(),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.NAMESPACE_METADATA.valueOf(),
            new AmountDto(this.maxFee.toDTO()),
            new TimestampDto(this.deadline.toDTO()),
            new UnresolvedAddressDto(this.targetAddress.encodeUnresolvedAddress(this.networkType)),
            this.scopedMetadataKey.toDTO(),
            this.targetNamespaceId.toBuilder(),
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
        return new EmbeddedNamespaceMetadataTransactionBuilder(
            this.getSignerAsBuilder(),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.NAMESPACE_METADATA.valueOf(),
            new UnresolvedAddressDto(this.targetAddress.encodeUnresolvedAddress(this.networkType)),
            this.scopedMetadataKey.toDTO(),
            this.targetNamespaceId.toBuilder(),
            this.valueSizeDelta,
            Convert.utf8ToUint8(this.value),
        );
    }

    /**
     * @internal
     * @returns {NamespaceMetadataTransaction}
     */
    resolveAliases(): NamespaceMetadataTransaction {
        return this;
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
