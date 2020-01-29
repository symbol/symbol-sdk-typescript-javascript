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
    KeyDto,
    MosaicSupplyChangeTransactionBuilder,
    SignatureDto,
    TimestampDto,
    UnresolvedMosaicIdDto,
} from 'catbuffer';
import { Convert } from '../../core/format';
import { DtoMapping } from '../../core/utils/DtoMapping';
import { UnresolvedMapping } from '../../core/utils/UnresolvedMapping';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { MosaicId } from '../mosaic/MosaicId';
import { MosaicSupplyChangeAction } from '../mosaic/MosaicSupplyChangeAction';
import { NamespaceId } from '../namespace/NamespaceId';
import { Statement } from '../receipt/Statement';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
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
     * @returns {MosaicSupplyChangeTransaction}
     */
    public static create(deadline: Deadline,
                         mosaicId: MosaicId | NamespaceId,
                         action: MosaicSupplyChangeAction,
                         delta: UInt64,
                         networkType: NetworkType,
                         maxFee: UInt64 = new UInt64([0, 0])): MosaicSupplyChangeTransaction {
        return new MosaicSupplyChangeTransaction(networkType,
            TransactionVersion.MOSAIC_SUPPLY_CHANGE,
            deadline,
            maxFee,
            mosaicId,
            action,
            delta,
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
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                /**
                 * The unresolved mosaic id.
                 */
                public readonly mosaicId: MosaicId | NamespaceId,
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
                transactionInfo?: TransactionInfo) {
        super(TransactionType.MOSAIC_SUPPLY_CHANGE, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }



    /**
     * Creates a transaction from catbuffer body builders.
     * @internal
     * @param builder the body builder
     * @param networkType the preloaded network type
     * @param deadline the preloaded deadline
     * @param maxFee the preloaded max fee
     * @returns {Transaction}
     */
    public static createFromBodyBuilder(builder: MosaicSupplyChangeTransactionBuilder | EmbeddedMosaicSupplyChangeTransactionBuilder,
                                        networkType: NetworkType,
                                        deadline: Deadline,
                                        maxFee: UInt64): Transaction {
        return MosaicSupplyChangeTransaction.create(
            deadline,
            UnresolvedMapping.toUnresolvedMosaic(new UInt64(builder.getMosaicId().unresolvedMosaicId).toHex()),
            builder.getAction().valueOf(),
            new UInt64(builder.getDelta().amount),
            networkType,
            maxFee);
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a MosaicSupplyChangeTransaction
     * @returns {number}
     * @memberof MosaicSupplyChangeTransaction
     */
    public get size(): number {
        const byteSize = super.size;

        // set static byte size fields
        const byteMosaicId = 8;
        const byteAction = 1;
        const byteDelta = 8;

        return byteSize + byteMosaicId + byteAction + byteDelta;
    }

    /**
     * @internal
     * @returns {Uint8Array}
     */
    protected generateBytes(): Uint8Array {
        const signerBuffer = new Uint8Array(32);
        const signatureBuffer = new Uint8Array(64);

        const transactionBuilder = new MosaicSupplyChangeTransactionBuilder(
            new SignatureDto(signatureBuffer),
            new KeyDto(signerBuffer),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.MOSAIC_SUPPLY_CHANGE.valueOf(),
            new AmountDto(this.maxFee.toDTO()),
            new TimestampDto(this.deadline.toDTO()),
            new UnresolvedMosaicIdDto(this.mosaicId.id.toDTO()),
            new AmountDto(this.delta.toDTO()),
            this.action.valueOf(),
        );
        return transactionBuilder.serialize();
    }

    /**
     * @internal
     * @returns {EmbeddedTransactionBuilder}
     */
    public toEmbeddedTransaction(): EmbeddedTransactionBuilder {
        return new EmbeddedMosaicSupplyChangeTransactionBuilder(
            new KeyDto(Convert.hexToUint8(this.signer!.publicKey)),
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
    resolveAliases(statement: Statement, aggregateTransactionIndex: number = 0): MosaicSupplyChangeTransaction {
        const transactionInfo = this.checkTransactionHeightAndIndex();
        return DtoMapping.assign(this, {
            mosaicId: statement.resolveMosaicId(this.mosaicId, transactionInfo.height.toString(),
                transactionInfo.index, aggregateTransactionIndex)});
    }
}
