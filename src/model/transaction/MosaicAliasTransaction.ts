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
import { EmbeddedMosaicAliasTransactionBuilder } from '../../infrastructure/catbuffer/EmbeddedMosaicAliasTransactionBuilder';
import { EntityTypeDto } from '../../infrastructure/catbuffer/EntityTypeDto';
import { KeyDto } from '../../infrastructure/catbuffer/KeyDto';
import { MosaicAliasTransactionBuilder } from '../../infrastructure/catbuffer/MosaicAliasTransactionBuilder';
import { MosaicIdDto } from '../../infrastructure/catbuffer/MosaicIdDto';
import { NamespaceIdDto } from '../../infrastructure/catbuffer/NamespaceIdDto';
import { SignatureDto } from '../../infrastructure/catbuffer/SignatureDto';
import { TimestampDto } from '../../infrastructure/catbuffer/TimestampDto';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { MosaicId } from '../mosaic/MosaicId';
import { AliasAction } from '../namespace/AliasAction';
import { NamespaceId } from '../namespace/NamespaceId';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { InnerTransaction } from './InnerTransaction';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';

export class MosaicAliasTransaction extends Transaction {

    /**
     * Create a mosaic alias transaction object
     * @param deadline - The deadline to include the transaction.
     * @param aliasAction - The alias action type.
     * @param namespaceId - The namespace id.
     * @param mosaicId - The mosaic id.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {MosaicAliasTransaction}
     */
    public static create(deadline: Deadline,
                         aliasAction: AliasAction,
                         namespaceId: NamespaceId,
                         mosaicId: MosaicId,
                         networkType: NetworkType,
                         maxFee: UInt64 = new UInt64([0, 0])): MosaicAliasTransaction {
        return new MosaicAliasTransaction(networkType,
            TransactionVersion.MOSAIC_ALIAS,
            deadline,
            maxFee,
            aliasAction,
            namespaceId,
            mosaicId,
        );
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param aliasAction
     * @param namespaceId
     * @param mosaicId
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                /**
                 * The alias action type.
                 */
                public readonly aliasAction: AliasAction,
                /**
                 * The namespace id that will be an alias.
                 */
                public readonly namespaceId: NamespaceId,
                /**
                 * The mosaic id.
                 */
                public readonly mosaicId: MosaicId,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.MOSAIC_ALIAS, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
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
        const builder = isEmbedded ? EmbeddedMosaicAliasTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload)) :
            MosaicAliasTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload));
        const signerPublicKey = Convert.uint8ToHex(builder.getSignerPublicKey().key);
        const networkType = Convert.hexToUint8(builder.getVersion().toString(16))[0];
        const transaction = MosaicAliasTransaction.create(
            isEmbedded ? Deadline.create() : Deadline.createFromDTO((builder as MosaicAliasTransactionBuilder).getDeadline().timestamp),
            builder.getAliasAction().valueOf(),
            new NamespaceId(builder.getNamespaceId().namespaceId),
            new MosaicId(builder.getMosaicId().mosaicId),
            networkType,
            isEmbedded ? new UInt64([0, 0]) : new UInt64((builder as MosaicAliasTransactionBuilder).fee.amount),
        );
        return isEmbedded ?
            transaction.toAggregate(PublicAccount.createFromPublicKey(signerPublicKey, networkType, signSchema)) : transaction;
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a MosaicAliasTransaction
     * @returns {number}
     * @memberof MosaicAliasTransaction
     */
    public get size(): number {
        const byteSize = super.size;

        // set static byte size fields
        const byteType = 1;
        const byteNamespaceId = 8;
        const byteMosaicId = 8;

        return byteSize + byteType + byteNamespaceId + byteMosaicId;
    }

    /**
     * @internal
     * @returns {Uint8Array}
     */
    protected generateBytes(): Uint8Array {
        const signerBuffer = new Uint8Array(32);
        const signatureBuffer = new Uint8Array(64);

        const transactionBuilder = new MosaicAliasTransactionBuilder(
            new SignatureDto(signatureBuffer),
            new KeyDto(signerBuffer),
            this.versionToDTO(),
            TransactionType.MOSAIC_ALIAS.valueOf(),
            new AmountDto(this.maxFee.toDTO()),
            new TimestampDto(this.deadline.toDTO()),
            this.aliasAction.valueOf(),
            new NamespaceIdDto(this.namespaceId.id.toDTO()),
            new MosaicIdDto(this.mosaicId.id.toDTO()),
        );
        return transactionBuilder.serialize();
    }

    /**
     * @internal
     * @returns {Uint8Array}
     */
    protected generateEmbeddedBytes(): Uint8Array {
        const transactionBuilder = new EmbeddedMosaicAliasTransactionBuilder(
            new KeyDto(Convert.hexToUint8(this.signer!.publicKey)),
            this.versionToDTO(),
            TransactionType.MOSAIC_ALIAS.valueOf(),
            this.aliasAction.valueOf(),
            new NamespaceIdDto(this.namespaceId.id.toDTO()),
            new MosaicIdDto(this.mosaicId.id.toDTO()),
        );
        return transactionBuilder.serialize();
    }
}
