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
    EmbeddedMosaicAliasTransactionBuilder,
    EmbeddedTransactionBuilder,
    MosaicAliasTransactionBuilder,
    TimestampDto,
    TransactionBuilder,
} from 'catbuffer-typescript';
import { Convert } from '../../core/format';
import { Address } from '../account/Address';
import { PublicAccount } from '../account/PublicAccount';
import { MosaicId } from '../mosaic/MosaicId';
import { AliasAction } from '../namespace/AliasAction';
import { NamespaceId } from '../namespace/NamespaceId';
import { NetworkType } from '../network/NetworkType';
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
     * @param signature - (Optional) Transaction signature
     * @param signer - (Optional) Signer public account
     * @returns {MosaicAliasTransaction}
     */
    public static create(
        deadline: Deadline,
        aliasAction: AliasAction,
        namespaceId: NamespaceId,
        mosaicId: MosaicId,
        networkType: NetworkType,
        maxFee: UInt64 = new UInt64([0, 0]),
        signature?: string,
        signer?: PublicAccount,
    ): MosaicAliasTransaction {
        return new MosaicAliasTransaction(
            networkType,
            TransactionVersion.MOSAIC_ALIAS,
            deadline,
            maxFee,
            aliasAction,
            namespaceId,
            mosaicId,
            signature,
            signer,
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
    constructor(
        networkType: NetworkType,
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
        transactionInfo?: TransactionInfo,
    ) {
        super(TransactionType.MOSAIC_ALIAS, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * Create a transaction object from payload
     * @param {string} payload Binary payload
     * @param {Boolean} isEmbedded Is embedded transaction (Default: false)
     * @returns {Transaction | InnerTransaction}
     */
    public static createFromPayload(payload: string, isEmbedded = false): Transaction | InnerTransaction {
        const builder = isEmbedded
            ? EmbeddedMosaicAliasTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload))
            : MosaicAliasTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload));
        const signerPublicKey = Convert.uint8ToHex(builder.getSignerPublicKey().key);
        const networkType = builder.getNetwork().valueOf();
        const signature = Transaction.getSignatureFromPayload(payload, isEmbedded);
        const transaction = MosaicAliasTransaction.create(
            isEmbedded
                ? Deadline.createEmtpy()
                : Deadline.createFromDTO((builder as MosaicAliasTransactionBuilder).getDeadline().timestamp),
            builder.getAliasAction().valueOf(),
            new NamespaceId(builder.getNamespaceId().namespaceId),
            new MosaicId(builder.getMosaicId().mosaicId),
            networkType,
            isEmbedded ? new UInt64([0, 0]) : new UInt64((builder as MosaicAliasTransactionBuilder).fee.amount),
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
        return new MosaicAliasTransactionBuilder(
            this.getSignatureAsBuilder(),
            this.getSignerAsBuilder(),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.MOSAIC_ALIAS.valueOf(),
            new AmountDto(this.maxFee.toDTO()),
            new TimestampDto(this.deadline.toDTO()),
            this.namespaceId.toBuilder(),
            this.mosaicId.toBuilder(),
            this.aliasAction.valueOf(),
        );
    }

    /**
     * @internal
     * @returns {EmbeddedTransactionBuilder}
     */
    public toEmbeddedTransaction(): EmbeddedTransactionBuilder {
        return new EmbeddedMosaicAliasTransactionBuilder(
            this.getSignerAsBuilder(),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.MOSAIC_ALIAS.valueOf(),
            this.namespaceId.toBuilder(),
            this.mosaicId.toBuilder(),
            this.aliasAction.valueOf(),
        );
    }

    /**
     * @internal
     * @returns {MosaicAliasTransaction}
     */
    resolveAliases(): MosaicAliasTransaction {
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
