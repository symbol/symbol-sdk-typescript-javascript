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

import { SignSchema } from '../../core/crypto/SignSchema';
import { Convert } from '../../core/format';
import { AmountDto } from '../../infrastructure/catbuffer/AmountDto';
import { EmbeddedMosaicMetadataTransactionBuilder } from '../../infrastructure/catbuffer/EmbeddedMosaicMetadataTransactionBuilder';
import { KeyDto } from '../../infrastructure/catbuffer/KeyDto';
import { MosaicMetadataTransactionBuilder } from '../../infrastructure/catbuffer/MosaicMetadataTransactionBuilder';
import { SignatureDto } from '../../infrastructure/catbuffer/SignatureDto';
import { TimestampDto } from '../../infrastructure/catbuffer/TimestampDto';
import { UnresolvedMosaicIdDto } from '../../infrastructure/catbuffer/UnresolvedMosaicIdDto';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { MosaicId } from '../mosaic/MosaicId';
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
     * @param targetPublicKey - Public key of the target account.
     * @param scopedMetadataKey - Metadata key scoped to source, target and type.
     * @param targetMosaicId - Target mosaic identifier.
     * @param valueSizeDelta - Change in value size in bytes.
     * @param value - Difference between the previous value and new value.
     *                You can calculate value as xor(previous-value, new-value).
     *                If there is no previous value, use directly the new value.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {MosaicMetadataTransaction}
     */
    public static create(deadline: Deadline,
                         targetPublicKey: string,
                         scopedMetadataKey: UInt64,
                         targetMosaicId: MosaicId,
                         valueSizeDelta: number,
                         value: Uint8Array,
                         networkType: NetworkType,
                         maxFee: UInt64 = new UInt64([0, 0])): MosaicMetadataTransaction {
        return new MosaicMetadataTransaction(networkType,
            TransactionVersion.MOSAIC_METADATA_TRANSACTION,
            deadline,
            maxFee,
            targetPublicKey,
            scopedMetadataKey,
            targetMosaicId,
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
     * @param targetMosaicId
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
                 * Target mosaic identifier.
                 */
                public readonly targetMosaicId: MosaicId,
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
        super(TransactionType.MOSAIC_METADATA_TRANSACTION, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        if (value.length > 1024) {
            throw new Error('The maximum value size is 1024');
        }
    }

    /**
     * Create a transaction object from payload
     * @param {string} payload Binary payload
     * @param {Boolean} isEmbedded Is embedded transaction (Default: false)
     * @param {SignSchema} signSchema The Sign Schema. (KECCAK_REVERSED_KEY / SHA3)
     * @returns {Transaction | InnerTransaction}
     */
    public static createFromPayload(payload: string,
                                    isEmbedded: boolean = false,
                                    signSchema: SignSchema = SignSchema.SHA3): Transaction | InnerTransaction {
        const builder = isEmbedded ? EmbeddedMosaicMetadataTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload)) :
            MosaicMetadataTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload));
        const signer = Convert.uint8ToHex(builder.getSignerPublicKey().key);
        const networkType = Convert.hexToUint8(builder.getVersion().toString(16))[0];
        const transaction = MosaicMetadataTransaction.create(
            isEmbedded ? Deadline.create() : Deadline.createFromDTO((builder as MosaicMetadataTransactionBuilder).getDeadline().timestamp),
            Convert.uint8ToHex(builder.getTargetPublicKey().key),
            new UInt64(builder.getScopedMetadataKey()),
            new MosaicId(builder.getTargetMosaicId().unresolvedMosaicId),
            builder.getValueSizeDelta(),
            builder.getValue(),
            networkType,
            isEmbedded ? new UInt64([0, 0]) : new UInt64((builder as MosaicMetadataTransactionBuilder).fee.amount),
        );
        return isEmbedded ? transaction.toAggregate(PublicAccount.createFromPublicKey(signer, networkType, signSchema)) : transaction;
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
        const byteTargetMosaicId = 8;
        const byteValueSizeDelta = 2;

        return byteSize + targetPublicKey + byteScopedMetadataKey +
               byteTargetMosaicId + byteValueSizeDelta + this.value.length;
    }

    /**
     * @internal
     * @returns {Uint8Array}
     */
    protected generateBytes(): Uint8Array {
        const signerBuffer = new Uint8Array(32);
        const signatureBuffer = new Uint8Array(64);

        const transactionBuilder = new MosaicMetadataTransactionBuilder(
            new SignatureDto(signatureBuffer),
            new KeyDto(signerBuffer),
            this.versionToDTO(),
            TransactionType.MOSAIC_METADATA_TRANSACTION.valueOf(),
            new AmountDto(this.maxFee.toDTO()),
            new TimestampDto(this.deadline.toDTO()),
            new KeyDto(Convert.hexToUint8(this.targetPublicKey)),
            this.scopedMetadataKey.toDTO(),
            new UnresolvedMosaicIdDto(this.targetMosaicId.id.toDTO()),
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
        const transactionBuilder = new EmbeddedMosaicMetadataTransactionBuilder(
            new KeyDto(Convert.hexToUint8(this.signer!.publicKey)),
            this.versionToDTO(),
            TransactionType.MOSAIC_METADATA_TRANSACTION.valueOf(),
            new KeyDto(Convert.hexToUint8(this.targetPublicKey)),
            this.scopedMetadataKey.toDTO(),
            new UnresolvedMosaicIdDto(this.targetMosaicId.id.toDTO()),
            this.valueSizeDelta,
            this.value,
        );
        return transactionBuilder.serialize();
    }
}
