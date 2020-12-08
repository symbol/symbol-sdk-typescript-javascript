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
    EmbeddedMosaicGlobalRestrictionTransactionBuilder,
    EmbeddedTransactionBuilder,
    MosaicGlobalRestrictionTransactionBuilder,
    TimestampDto,
    TransactionBuilder,
    UnresolvedMosaicIdDto,
} from 'catbuffer-typescript';
import { Convert } from '../../core/format';
import { DtoMapping } from '../../core/utils/DtoMapping';
import { UnresolvedMapping } from '../../core/utils/UnresolvedMapping';
import { Address } from '../account/Address';
import { PublicAccount } from '../account/PublicAccount';
import { UnresolvedMosaicId } from '../mosaic/UnresolvedMosaicId';
import { NetworkType } from '../network/NetworkType';
import { Statement } from '../receipt/Statement';
import { MosaicRestrictionType } from '../restriction/MosaicRestrictionType';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { InnerTransaction } from './InnerTransaction';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';

export class MosaicGlobalRestrictionTransaction extends Transaction {
    /**
     * Create a mosaic address restriction transaction object
     *
     * The mosaic global restrictions are the network-wide rules that will determine
     * whether an account will be able to transact a given mosaic.
     *
     * Only accounts tagged with the key identifiers and values that meet the conditions
     * will be able to execute transactions involving the mosaic.
     *
     * Additionally, the mosaic creator can define restrictions that depend directly on
     * global restrictions set on another mosaic - known as **reference mosaic**.
     * The referenced mosaic and the restricted mosaic do not necessarily have to be created
     * by the same account, enabling the delegation of mosaic permissions to a third party.
     *
     * @param deadline - The deadline to include the transaction.
     * @param mosaicId - The mosaic id ex: new MosaicId([481110499, 231112638]).
     * @param restrictionKey - The restriction key.
     * @param previousRestrictionValue - The previous restriction value.
     * @param previousRestrictionType - The previous restriction type.
     * @param newRestrictionValue - The new restriction value.
     * @param newRestrictionType - The new restriction tpye.
     * @param networkType - The network type.
     * @param referenceMosaicId - (Optional) The unresolved mosaic identifier providing the restriction key.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @param signature - (Optional) Transaction signature
     * @param signer - (Optional) Signer public account
     * @returns {MosaicGlobalRestrictionTransaction}
     */
    public static create(
        deadline: Deadline,
        mosaicId: UnresolvedMosaicId,
        restrictionKey: UInt64,
        previousRestrictionValue: UInt64,
        previousRestrictionType: MosaicRestrictionType,
        newRestrictionValue: UInt64,
        newRestrictionType: MosaicRestrictionType,
        networkType: NetworkType,
        referenceMosaicId: UnresolvedMosaicId = UnresolvedMapping.toUnresolvedMosaic(UInt64.fromUint(0).toHex()),
        maxFee: UInt64 = new UInt64([0, 0]),
        signature?: string,
        signer?: PublicAccount,
    ): MosaicGlobalRestrictionTransaction {
        return new MosaicGlobalRestrictionTransaction(
            networkType,
            TransactionVersion.MOSAIC_GLOBAL_RESTRICTION,
            deadline,
            maxFee,
            mosaicId,
            referenceMosaicId,
            restrictionKey,
            previousRestrictionValue,
            previousRestrictionType,
            newRestrictionValue,
            newRestrictionType,
            signature,
            signer,
        );
    }

    /**
     * @param networkType - The network type
     * @param version - The transaction version
     * @param deadline - The deadline to include the transaction.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @param mosaicId - The unresolved mosaic identifier.
     * @param referenceMosaicId - The mosaic id providing the restriction key.
     * @param restrictionKey - The restriction key.
     * @param previousRestrictionValue - The previous restriction value.
     * @param previousRestrictionType - The previous restriction type.
     * @param newRestrictionValue - The new restriction value.
     * @param previousRestrictionType - The previous restriction tpye.
     * @param signature - The transaction signature
     * @param signer - The signer
     * @param transactionInfo - The transaction info
     */
    constructor(
        networkType: NetworkType,
        version: number,
        deadline: Deadline,
        maxFee: UInt64,
        /**
         * The mosaic id.
         */
        public readonly mosaicId: UnresolvedMosaicId,
        /**
         * The refrence mosaic id.
         */
        public readonly referenceMosaicId: UnresolvedMosaicId,
        /**
         * The restriction key.
         */
        public readonly restrictionKey: UInt64,
        /**
         * The previous restriction value.
         */
        public readonly previousRestrictionValue: UInt64,
        /**
         * The previous restriction type.
         */
        public readonly previousRestrictionType: MosaicRestrictionType,
        /**
         * The new restriction value.
         */
        public readonly newRestrictionValue: UInt64,
        /**
         * The new restriction type.
         */
        public readonly newRestrictionType: MosaicRestrictionType,
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo,
    ) {
        super(TransactionType.MOSAIC_GLOBAL_RESTRICTION, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * Create a transaction object from payload
     * @param {string} payload Binary payload
     * @param {Boolean} isEmbedded Is embedded transaction (Default: false)
     * @returns {Transaction | InnerTransaction}
     */
    public static createFromPayload(payload: string, isEmbedded = false): Transaction | InnerTransaction {
        const builder = isEmbedded
            ? EmbeddedMosaicGlobalRestrictionTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload))
            : MosaicGlobalRestrictionTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload));
        const signerPublicKey = Convert.uint8ToHex(builder.getSignerPublicKey().key);
        const networkType = builder.getNetwork().valueOf();
        const signature = Transaction.getSignatureFromPayload(payload, isEmbedded);
        const transaction = MosaicGlobalRestrictionTransaction.create(
            isEmbedded
                ? Deadline.createEmtpy()
                : Deadline.createFromDTO((builder as MosaicGlobalRestrictionTransactionBuilder).getDeadline().timestamp),
            UnresolvedMapping.toUnresolvedMosaic(new UInt64(builder.getMosaicId().unresolvedMosaicId).toHex()),
            new UInt64(builder.getRestrictionKey()),
            new UInt64(builder.getPreviousRestrictionValue()),
            builder.getPreviousRestrictionType().valueOf(),
            new UInt64(builder.getNewRestrictionValue()),
            builder.getNewRestrictionType().valueOf(),
            networkType,
            UnresolvedMapping.toUnresolvedMosaic(new UInt64(builder.getReferenceMosaicId().unresolvedMosaicId).toHex()),
            isEmbedded ? new UInt64([0, 0]) : new UInt64((builder as MosaicGlobalRestrictionTransactionBuilder).fee.amount),
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
        return new MosaicGlobalRestrictionTransactionBuilder(
            this.getSignatureAsBuilder(),
            this.getSignerAsBuilder(),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.MOSAIC_GLOBAL_RESTRICTION.valueOf(),
            new AmountDto(this.maxFee.toDTO()),
            new TimestampDto(this.deadline.toDTO()),
            new UnresolvedMosaicIdDto(this.mosaicId.id.toDTO()),
            new UnresolvedMosaicIdDto(this.referenceMosaicId.id.toDTO()),
            this.restrictionKey.toDTO(),
            this.previousRestrictionValue.toDTO(),
            this.newRestrictionValue.toDTO(),
            this.previousRestrictionType.valueOf(),
            this.newRestrictionType.valueOf(),
        );
    }

    /**
     * @internal
     * @returns {EmbeddedTransactionBuilder}
     */
    public toEmbeddedTransaction(): EmbeddedTransactionBuilder {
        return new EmbeddedMosaicGlobalRestrictionTransactionBuilder(
            this.getSignerAsBuilder(),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.MOSAIC_GLOBAL_RESTRICTION.valueOf(),
            new UnresolvedMosaicIdDto(this.mosaicId.id.toDTO()),
            new UnresolvedMosaicIdDto(this.referenceMosaicId.id.toDTO()),
            this.restrictionKey.toDTO(),
            this.previousRestrictionValue.toDTO(),
            this.newRestrictionValue.toDTO(),
            this.previousRestrictionType.valueOf(),
            this.newRestrictionType.valueOf(),
        );
    }

    /**
     * @internal
     * @param statement Block receipt statement
     * @param aggregateTransactionIndex Transaction index for aggregated transaction
     * @returns {MosaicGlobalRestrictionTransaction}
     */
    resolveAliases(statement: Statement, aggregateTransactionIndex = 0): MosaicGlobalRestrictionTransaction {
        const transactionInfo = this.checkTransactionHeightAndIndex();
        return DtoMapping.assign(this, {
            mosaicId: statement.resolveMosaicId(
                this.mosaicId,
                transactionInfo.height.toString(),
                transactionInfo.index,
                aggregateTransactionIndex,
            ),
            referenceMosaicId: statement.resolveMosaicId(
                this.referenceMosaicId,
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
    public shouldNotifyAccount(address: Address): boolean {
        return super.isSigned(address);
    }
}
