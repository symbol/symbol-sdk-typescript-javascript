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

import { Convert } from '../../core/format';
import { AmountDto } from '../../infrastructure/catbuffer/AmountDto';
import { EmbeddedNamespaceMetadataTransactionBuilder } from '../../infrastructure/catbuffer/EmbeddedNamespaceMetadataTransactionBuilder';
import { KeyDto } from '../../infrastructure/catbuffer/KeyDto';
import { NamespaceIdDto } from '../../infrastructure/catbuffer/NamespaceIdDto';
import { NamespaceMetadataTransactionBuilder } from '../../infrastructure/catbuffer/NamespaceMetadataTransactionBuilder';
import { SignatureDto } from '../../infrastructure/catbuffer/SignatureDto';
import { TimestampDto } from '../../infrastructure/catbuffer/TimestampDto';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { NamespaceId } from '../namespace/NamespaceId';
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
     * @param targetPublicKey - Public key of the target account.
     * @param scopedMetadataKey - Metadata key scoped to source, target and type.
     * @param targetNamespaceId - Target namespace identifier.
     * @param valueSizeDelta - Change in value size in bytes.
     * @param value - Difference between the previous value and new value.
     *                You can calculate value as xor(previous-value, new-value).
     *                If there is no previous value, use directly the new value.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {NamespaceMetadataTransaction}
     */
    public static create(deadline: Deadline,
                         targetPublicKey: string,
                         scopedMetadataKey: UInt64,
                         targetNamespaceId: NamespaceId,
                         valueSizeDelta: number,
                         value: Uint8Array,
                         networkType: NetworkType,
                         maxFee: UInt64 = new UInt64([0, 0])): NamespaceMetadataTransaction {
        return new NamespaceMetadataTransaction(networkType,
            TransactionVersion.NAMESPACE_METADATA_TRANSACTION,
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
                maxFee: UInt64,
                /**
                 * Public key of the target account.
                 */
                public readonly targetPublicKey: string,
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
                 * Difference between the previous value and new value.
                 */
                public readonly value: Uint8Array,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.NAMESPACE_METADATA_TRANSACTION, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
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
        const networkType = Convert.hexToUint8(builder.getVersion().toString(16))[0];
        const transaction = NamespaceMetadataTransaction.create(
            isEmbedded ? Deadline.create() :
                Deadline.createFromDTO((builder as NamespaceMetadataTransactionBuilder).getDeadline().timestamp),
            Convert.uint8ToHex(builder.getTargetPublicKey().key),
            new UInt64(builder.getScopedMetadataKey()),
            new NamespaceId(builder.getTargetNamespaceId().namespaceId),
            builder.getValueSizeDelta(),
            builder.getValue(),
            networkType,
            isEmbedded ? new UInt64([0, 0]) : new UInt64((builder as NamespaceMetadataTransactionBuilder).fee.amount),
        );
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

        return byteSize + targetPublicKey + byteScopedMetadataKey +
               byteTargetNamespaceId + byteValueSizeDelta + this.value.length;
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
            TransactionType.NAMESPACE_METADATA_TRANSACTION.valueOf(),
            new AmountDto(this.maxFee.toDTO()),
            new TimestampDto(this.deadline.toDTO()),
            new KeyDto(Convert.hexToUint8(this.targetPublicKey)),
            this.scopedMetadataKey.toDTO(),
            new NamespaceIdDto(this.targetNamespaceId.id.toDTO()),
            this.valueSizeDelta,
            this.value,
        );
        return transactionBuilder.serialize();
    }

    /**
     * @internal
     * @returns {Uint8Array}
     */
    protected generateEmbeddedBytes(): Uint8Array {
        const transactionBuilder = new EmbeddedNamespaceMetadataTransactionBuilder(
            new KeyDto(Convert.hexToUint8(this.signer!.publicKey)),
            this.versionToDTO(),
            TransactionType.NAMESPACE_METADATA_TRANSACTION.valueOf(),
            new KeyDto(Convert.hexToUint8(this.targetPublicKey)),
            this.scopedMetadataKey.toDTO(),
            new NamespaceIdDto(this.targetNamespaceId.id.toDTO()),
            this.valueSizeDelta,
            this.value,
        );
        return transactionBuilder.serialize();
    }
}
