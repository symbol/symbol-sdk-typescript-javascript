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
    KeyDto,
    NamespaceIdDto,
    NamespaceMetadataTransactionBuilder,
    SignatureDto,
    TimestampDto,
} from 'catbuffer-typescript';
import { Convert } from '../../core/format';
import { PublicAccount } from '../account/PublicAccount';
import { NamespaceId } from '../namespace/NamespaceId';
import { NetworkType } from '../network/NetworkType';
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
     * @param targetPublicKey - Public key of the target account.
     * @param scopedMetadataKey - Metadata key scoped to source, target and type.
     * @param targetNamespaceId - Target namespace identifier.
     * @param valueSizeDelta - Change in value size in bytes.
     * @param value - String value with UTF-8 encoding
     *                Difference between the previous value and new value.
     *                You can calculate value as xor(previous-value, new-value).
     *                If there is no previous value, use directly the new value.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {NamespaceMetadataTransaction}
     */
    public static create(deadline: Deadline,
                         targetPublicKey: string,
                         scopedMetadataKey: bigint,
                         targetNamespaceId: NamespaceId,
                         valueSizeDelta: number,
                         value: string,
                         networkType: NetworkType,
                         maxFee: bigint = BigInt(0)): NamespaceMetadataTransaction {
        return new NamespaceMetadataTransaction(networkType,
            TransactionVersion.NAMESPACE_METADATA,
            deadline,
            maxFee,
            targetPublicKey,
            scopedMetadataKey,
            targetNamespaceId,
            valueSizeDelta,
            value);
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param targetPublicKey
     * @param scopedMetadataKey
     * @param targetNamespaceId
     * @param valueSizeDelta
     * @param value
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: bigint,
                /**
                 * Public key of the target account.
                 */
                public readonly targetPublicKey: string,
                /**
                 * Metadata key scoped to source, target and type.
                 */
                public readonly scopedMetadataKey: bigint,
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
                transactionInfo?: TransactionInfo) {
        super(TransactionType.NAMESPACE_METADATA, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        if (value.length > 1024) {
            throw new Error('The maximum value size is 1024');
        }
    }

    /**
     * Create a transaction object from payload
     * @param {string} payload Binary payload
     * @param {Boolean} isEmbedded Is embedded transaction (Default: false)
     * @returns {Transaction | InnerTransaction}
     */
    public static createFromPayload(payload: string,
                                    isEmbedded: boolean = false): Transaction | InnerTransaction {
        const builder = isEmbedded ? EmbeddedNamespaceMetadataTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload)) :
            NamespaceMetadataTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload));
        const signerPublicKey = Convert.uint8ToHex(builder.getSignerPublicKey().key);
        const networkType = builder.getNetwork().valueOf();
        const transaction = NamespaceMetadataTransaction.create(
            isEmbedded ? Deadline.create() :
                Deadline.createFromBigInt((builder as NamespaceMetadataTransactionBuilder).getDeadline().timestamp),
            Convert.uint8ToHex(builder.getTargetPublicKey().key),
            builder.getScopedMetadataKey(),
            new NamespaceId(builder.getTargetNamespaceId().namespaceId),
            builder.getValueSizeDelta(),
            Convert.uint8ToUtf8(builder.getValue()),
            networkType,
            isEmbedded ? BigInt(0) : (builder as NamespaceMetadataTransactionBuilder).fee.amount);
        return isEmbedded ?
            transaction.toAggregate(PublicAccount.createFromPublicKey(signerPublicKey, networkType)) : transaction;
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a AccountLinkTransaction
     * @returns {number}
     * @memberof AccountLinkTransaction
     */
    public get size(): number {
        const byteSize = super.size;

        // set static byte size fields
        const targetPublicKey = 32;
        const byteScopedMetadataKey = 8;
        const byteTargetNamespaceId = 8;
        const byteValueSizeDelta = 2;
        const byteValueSize = 2;

        return byteSize + targetPublicKey + byteScopedMetadataKey +
               byteTargetNamespaceId + byteValueSizeDelta + byteValueSize + this.value.length;
    }

    /**
     * @internal
     * @returns {Uint8Array}
     */
    protected generateBytes(): Uint8Array {
        const signerBuffer = new Uint8Array(32);
        const signatureBuffer = new Uint8Array(64);

        const transactionBuilder = new NamespaceMetadataTransactionBuilder(
            new SignatureDto(signatureBuffer),
            new KeyDto(signerBuffer),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.NAMESPACE_METADATA.valueOf(),
            new AmountDto(this.maxFee),
            new TimestampDto(this.deadline.toBigInt()),
            new KeyDto(Convert.hexToUint8(this.targetPublicKey)),
            this.scopedMetadataKey,
            new NamespaceIdDto(this.targetNamespaceId.id),
            this.valueSizeDelta,
            Convert.utf8ToUint8(this.value),
        );
        return transactionBuilder.serialize();
    }

    /**
     * @internal
     * @returns {EmbeddedTransactionBuilder}
     */
    public toEmbeddedTransaction(): EmbeddedTransactionBuilder {
        return new EmbeddedNamespaceMetadataTransactionBuilder(
            new KeyDto(Convert.hexToUint8(this.signer!.publicKey)),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.NAMESPACE_METADATA.valueOf(),
            new KeyDto(Convert.hexToUint8(this.targetPublicKey)),
            this.scopedMetadataKey,
            new NamespaceIdDto(this.targetNamespaceId.id),
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
}
