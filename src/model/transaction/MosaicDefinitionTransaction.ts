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

import { Convert } from '../../core/format';
import { AmountDto } from '../../infrastructure/catbuffer/AmountDto';
import { BlockDurationDto } from '../../infrastructure/catbuffer/BlockDurationDto';
import { EmbeddedMosaicDefinitionTransactionBuilder } from '../../infrastructure/catbuffer/EmbeddedMosaicDefinitionTransactionBuilder';
import { GeneratorUtils } from '../../infrastructure/catbuffer/GeneratorUtils';
import { KeyDto } from '../../infrastructure/catbuffer/KeyDto';
import { MosaicDefinitionTransactionBuilder } from '../../infrastructure/catbuffer/MosaicDefinitionTransactionBuilder';
import { MosaicIdDto } from '../../infrastructure/catbuffer/MosaicIdDto';
import { MosaicNonceDto } from '../../infrastructure/catbuffer/MosaicNonceDto';
import { SignatureDto } from '../../infrastructure/catbuffer/SignatureDto';
import { TimestampDto } from '../../infrastructure/catbuffer/TimestampDto';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { MosaicFlags } from '../mosaic/MosaicFlags';
import { MosaicId } from '../mosaic/MosaicId';
import { MosaicNonce } from '../mosaic/MosaicNonce';
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
     * @returns {MosaicDefinitionTransaction}
     */
    public static create(deadline: Deadline,
                         nonce: MosaicNonce,
                         mosaicId: MosaicId,
                         flags: MosaicFlags,
                         divisibility: number,
                         duration: UInt64,
                         networkType: NetworkType,
                         maxFee: UInt64 = new UInt64([0, 0])): MosaicDefinitionTransaction {
        return new MosaicDefinitionTransaction(networkType,
            TransactionVersion.MOSAIC_DEFINITION,
            deadline,
            maxFee,
            nonce,
            mosaicId,
            flags,
            divisibility,
            duration,
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
                transactionInfo?: TransactionInfo) {
        super(TransactionType.MOSAIC_DEFINITION, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * Create a transaction object from payload
     * @param {string} payload Binary payload
     * @param {Boolean} isEmbedded Is embedded transaction (Default: false)
     * @returns {Transaction | InnerTransaction}
     */
    public static createFromPayload(payload: string,
                                    isEmbedded: boolean = false): Transaction | InnerTransaction {
        const builder = isEmbedded ? EmbeddedMosaicDefinitionTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload)) :
            MosaicDefinitionTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload));
        const signerPublicKey = Convert.uint8ToHex(builder.getSignerPublicKey().key);
        const networkType = Convert.hexToUint8(builder.getVersion().toString(16))[0];
        const transaction = MosaicDefinitionTransaction.create(
            isEmbedded ? Deadline.create() : Deadline.createFromDTO(
                (builder as MosaicDefinitionTransactionBuilder).getDeadline().timestamp),
            new MosaicNonce(builder.getNonce().serialize()),
            new MosaicId(builder.getId().mosaicId),
            MosaicFlags.create(
                (builder.getFlags() & 1) === 1,
                (builder.getFlags() & 2) === 2,
                (builder.getFlags() & 4) === 4),
            builder.getDivisibility(),
            new UInt64(builder.getDuration().blockDuration),
            networkType,
            isEmbedded ? new UInt64([0, 0]) : new UInt64((builder as MosaicDefinitionTransactionBuilder).fee.amount),
        );
        return isEmbedded ?
            transaction.toAggregate(PublicAccount.createFromPublicKey(signerPublicKey, networkType)) : transaction;
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
     * @description Get mosaic nonce int value
     * @returns {number}
     * @memberof MosaicDefinitionTransaction
     */
    public getMosaicNonceIntValue(): number {
        return GeneratorUtils.readUint32At(this.nonce.toDTO(), 0);
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
            this.flags.getValue(),
            this.divisibility,
            new BlockDurationDto(this.duration.toDTO()),
        );
        return transactionBuilder.serialize();
    }

    /**
     * @internal
     * @returns {Uint8Array}
     */
    protected generateEmbeddedBytes(): Uint8Array {
        const transactionBuilder = new EmbeddedMosaicDefinitionTransactionBuilder(
            new KeyDto(Convert.hexToUint8(this.signer!.publicKey)),
            this.versionToDTO(),
            TransactionType.MOSAIC_DEFINITION.valueOf(),
            new MosaicNonceDto(this.getMosaicNonceIntValue()),
            new MosaicIdDto(this.mosaicId.id.toDTO()),
            this.flags.getValue(),
            this.divisibility,
            new BlockDurationDto(this.duration.toDTO()),
        );
        return transactionBuilder.serialize();
    }
}
