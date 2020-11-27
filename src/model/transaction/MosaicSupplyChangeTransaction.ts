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
    EmbeddedMosaicSupplyChangeTransactionBuilder,
    EmbeddedTransactionBuilder,
    MosaicSupplyChangeTransactionBuilder,
    TimestampDto,
    TransactionBuilder,
    UnresolvedMosaicIdDto,
} from 'catbuffer-typescript';
import { Convert } from '../../core/format';
import { DtoMapping } from '../../core/utils/DtoMapping';
import { UnresolvedMapping } from '../../core/utils/UnresolvedMapping';
import { Address } from '../account/Address';
import { PublicAccount } from '../account/PublicAccount';
import { MosaicSupplyChangeAction } from '../mosaic/MosaicSupplyChangeAction';
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
 * In case a mosaic has the flag 'supplyMutable' set to true, the creator of the mosaic can change the supply,
 * i.e. increase or decrease the supply.
 */
export class MosaicSupplyChangeTransaction extends Transaction {
    /**
     * Create a mosaic supply change transaction object
     * @param deadline - The deadline to include the transaction.
     * @param mosaicId - The unresolved mosaic id.
     * @param action - The supply change action (increase | decrease).
     * @param delta - The supply change in units for the mosaic.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @param signature - (Optional) Transaction signature
     * @param signer - (Optional) Signer public account
     * @returns {MosaicSupplyChangeTransaction}
     */
    public static create(
        deadline: Deadline,
        mosaicId: UnresolvedMosaicId,
        action: MosaicSupplyChangeAction,
        delta: UInt64,
        networkType: NetworkType,
        maxFee: UInt64 = new UInt64([0, 0]),
        signature?: string,
        signer?: PublicAccount,
    ): MosaicSupplyChangeTransaction {
        return new MosaicSupplyChangeTransaction(
            networkType,
            TransactionVersion.MOSAIC_SUPPLY_CHANGE,
            deadline,
            maxFee,
            mosaicId,
            action,
            delta,
            signature,
            signer,
        );
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param mosaicId
     * @param action
     * @param delta
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
         * The unresolved mosaic id.
         */
        public readonly mosaicId: UnresolvedMosaicId,
        /**
         * The supply type.
         */
        public readonly action: MosaicSupplyChangeAction,
        /**
         * The supply change in units for the mosaic.
         */
        public readonly delta: UInt64,
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo,
    ) {
        super(TransactionType.MOSAIC_SUPPLY_CHANGE, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * Create a transaction object from payload
     * @param {string} payload Binary payload
     * @param {Boolean} isEmbedded Is embedded transaction (Default: false)
     * @returns {Transaction | InnerTransaction}
     */
    public static createFromPayload(payload: string, isEmbedded = false): Transaction | InnerTransaction {
        const builder = isEmbedded
            ? EmbeddedMosaicSupplyChangeTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload))
            : MosaicSupplyChangeTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload));
        const signerPublicKey = Convert.uint8ToHex(builder.getSignerPublicKey().key);
        const networkType = builder.getNetwork().valueOf();
        const signature = Transaction.getSignatureFromPayload(payload, isEmbedded);
        const transaction = MosaicSupplyChangeTransaction.create(
            isEmbedded
                ? Deadline.createEmtpy()
                : Deadline.createFromDTO((builder as MosaicSupplyChangeTransactionBuilder).getDeadline().timestamp),
            UnresolvedMapping.toUnresolvedMosaic(new UInt64(builder.getMosaicId().unresolvedMosaicId).toHex()),
            builder.getAction().valueOf(),
            new UInt64(builder.getDelta().amount),
            networkType,
            isEmbedded ? new UInt64([0, 0]) : new UInt64((builder as MosaicSupplyChangeTransactionBuilder).fee.amount),
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
        const transactionBuilder = new MosaicSupplyChangeTransactionBuilder(
            this.getSignatureAsBuilder(),
            this.getSignerAsBuilder(),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.MOSAIC_SUPPLY_CHANGE.valueOf(),
            new AmountDto(this.maxFee.toDTO()),
            new TimestampDto(this.deadline.toDTO()),
            new UnresolvedMosaicIdDto(this.mosaicId.id.toDTO()),
            new AmountDto(this.delta.toDTO()),
            this.action.valueOf(),
        );
        return transactionBuilder;
    }

    /**
     * @internal
     * @returns {EmbeddedTransactionBuilder}
     */
    public toEmbeddedTransaction(): EmbeddedTransactionBuilder {
        return new EmbeddedMosaicSupplyChangeTransactionBuilder(
            this.getSignerAsBuilder(),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.MOSAIC_SUPPLY_CHANGE.valueOf(),
            new UnresolvedMosaicIdDto(this.mosaicId.id.toDTO()),
            new AmountDto(this.delta.toDTO()),
            this.action.valueOf(),
        );
    }

    /**
     * @internal
     * @param statement Block receipt statement
     * @param aggregateTransactionIndex Transaction index for aggregated transaction
     * @returns {MosaicSupplyChangeTransaction}
     */
    resolveAliases(statement: Statement, aggregateTransactionIndex = 0): MosaicSupplyChangeTransaction {
        const transactionInfo = this.checkTransactionHeightAndIndex();
        return DtoMapping.assign(this, {
            mosaicId: statement.resolveMosaicId(
                this.mosaicId,
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
