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

import { combineLatest, of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { Convert } from '../../core/format';
import { UnresolvedMapping } from '../../core/utils/UnresolvedMapping';
import { AmountDto } from '../../infrastructure/catbuffer/AmountDto';
import {
    EmbeddedMosaicGlobalRestrictionTransactionBuilder,
} from '../../infrastructure/catbuffer/EmbeddedMosaicGlobalRestrictionTransactionBuilder';
import { KeyDto } from '../../infrastructure/catbuffer/KeyDto';
import { MosaicGlobalRestrictionTransactionBuilder } from '../../infrastructure/catbuffer/MosaicGlobalRestrictionTransactionBuilder';
import { SignatureDto } from '../../infrastructure/catbuffer/SignatureDto';
import { TimestampDto } from '../../infrastructure/catbuffer/TimestampDto';
import { UnresolvedMosaicIdDto } from '../../infrastructure/catbuffer/UnresolvedMosaicIdDto';
import { ReceiptHttp } from '../../infrastructure/ReceiptHttp';
import { TransactionService } from '../../service/TransactionService';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { MosaicId } from '../mosaic/MosaicId';
import { NamespaceId } from '../namespace/NamespaceId';
import { ResolutionType } from '../receipt/ResolutionType';
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
     * @returns {MosaicGlobalRestrictionTransaction}
     */
    public static create(deadline: Deadline,
                         mosaicId: MosaicId | NamespaceId,
                         restrictionKey: UInt64,
                         previousRestrictionValue: UInt64,
                         previousRestrictionType: MosaicRestrictionType,
                         newRestrictionValue: UInt64,
                         newRestrictionType: MosaicRestrictionType,
                         networkType: NetworkType,
                         referenceMosaicId: MosaicId | NamespaceId = UnresolvedMapping.toUnresolvedMosaic(UInt64.fromUint(0).toHex()),
                         maxFee: UInt64 = new UInt64([0, 0])): MosaicGlobalRestrictionTransaction {
        return new MosaicGlobalRestrictionTransaction(networkType,
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
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                /**
                 * The mosaic id.
                 */
                public readonly mosaicId: MosaicId | NamespaceId,
                /**
                 * The refrence mosaic id.
                 */
                public readonly referenceMosaicId: MosaicId | NamespaceId,
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
                transactionInfo?: TransactionInfo) {
        super(TransactionType.MOSAIC_GLOBAL_RESTRICTION, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * Create a transaction object from payload
     * @param {string} payload Binary payload
     * @param {Boolean} isEmbedded Is embedded transaction (Default: false)
     * @returns {Transaction | InnerTransaction}
     */
    public static createFromPayload(payload: string,
                                    isEmbedded: boolean = false): Transaction | InnerTransaction {
        const builder = isEmbedded ? EmbeddedMosaicGlobalRestrictionTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload)) :
            MosaicGlobalRestrictionTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload));
        const signerPublicKey = Convert.uint8ToHex(builder.getSignerPublicKey().key);
        const networkType = builder.getNetwork().valueOf();
        const transaction = MosaicGlobalRestrictionTransaction.create(
            isEmbedded ? Deadline.create() : Deadline.createFromDTO(
                (builder as MosaicGlobalRestrictionTransactionBuilder).getDeadline().timestamp),
            UnresolvedMapping.toUnresolvedMosaic(new UInt64(builder.getMosaicId().unresolvedMosaicId).toHex()),
            new UInt64(builder.getRestrictionKey()),
            new UInt64(builder.getPreviousRestrictionValue()),
            builder.getPreviousRestrictionType().valueOf(),
            new UInt64(builder.getNewRestrictionValue()),
            builder.getNewRestrictionType().valueOf(),
            networkType,
            UnresolvedMapping.toUnresolvedMosaic(new UInt64(builder.getReferenceMosaicId().unresolvedMosaicId).toHex()),
            isEmbedded ? new UInt64([0, 0]) : new UInt64((builder as MosaicGlobalRestrictionTransactionBuilder).fee.amount),
        );
        return isEmbedded ?
            transaction.toAggregate(PublicAccount.createFromPublicKey(signerPublicKey, networkType)) : transaction;
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a MosaicDefinitionTransaction
     * @returns {number}
     * @memberof MosaicGlobalRestrictionTransaction
     */
    public get size(): number {
        const byteSize = super.size;

        // set static byte size fields
        const byteMosaicId = 8;
        const byteReferenceMosaicId = 8;
        const byteRestrictionKey = 8;
        const bytePreviousRestrictionValue = 8;
        const byteNewRestrictionValue = 8;
        const bytePreviousRestrictionType = 1;
        const byteNewRestrictionType = 1;

        return byteSize + byteMosaicId + byteRestrictionKey + byteReferenceMosaicId +
               bytePreviousRestrictionValue + byteNewRestrictionValue + byteNewRestrictionType +
               bytePreviousRestrictionType;
    }

    /**
     * @internal
     * @returns {Uint8Array}
     */
    protected generateBytes(): Uint8Array {
        const signerBuffer = new Uint8Array(32);
        const signatureBuffer = new Uint8Array(64);

        const transactionBuilder = new MosaicGlobalRestrictionTransactionBuilder(
            new SignatureDto(signatureBuffer),
            new KeyDto(signerBuffer),
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
        return transactionBuilder.serialize();
    }

    /**
     * @internal
     * @returns {Uint8Array}
     */
    protected generateEmbeddedBytes(): Uint8Array {
        const transactionBuilder = new EmbeddedMosaicGlobalRestrictionTransactionBuilder(
            new KeyDto(Convert.hexToUint8(this.signer!.publicKey)),
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
        return transactionBuilder.serialize();
    }

    /**
     * @internal
     * @param receiptHttp ReceiptHttp
     * @returns {TransferTransaction}
     */
    resolveAliases(receiptHttp: ReceiptHttp): Observable<MosaicGlobalRestrictionTransaction> {
        const hasUnresolved = this.mosaicId instanceof NamespaceId ||
            this.referenceMosaicId instanceof NamespaceId;

        if (!hasUnresolved) {
            return of(this);
        }

        const transactionInfo = this.checkTransactionHeightAndIndex();

        const statementObservable = receiptHttp.getBlockReceipts(transactionInfo.height.toString());

        const resolvedMosaicId = statementObservable.pipe(
            map((statement) => this.mosaicId instanceof NamespaceId ?
                TransactionService.getResolvedFromReceipt(ResolutionType.Mosaic, this.mosaicId as NamespaceId,
                    statement, transactionInfo.index, transactionInfo.height.toString()) as MosaicId :
                this.mosaicId,
            ),
        );

        const resolvedRefMosaicId = statementObservable.pipe(
            map((statement) => this.referenceMosaicId instanceof NamespaceId ?
                TransactionService.getResolvedFromReceipt(ResolutionType.Mosaic, this.referenceMosaicId as NamespaceId,
                    statement, transactionInfo.index, transactionInfo.height.toString()) as MosaicId :
                this.referenceMosaicId,
            ),
        );

        return combineLatest(resolvedMosaicId, resolvedRefMosaicId, (mosaicId, refMosaicId) => {
            return new MosaicGlobalRestrictionTransaction(
                this.networkType,
                this.version,
                this.deadline,
                this.maxFee,
                mosaicId,
                refMosaicId,
                this.restrictionKey,
                this.previousRestrictionValue,
                this.previousRestrictionType,
                this.newRestrictionValue,
                this.newRestrictionType,
                this.signature,
                this.signer,
                this.transactionInfo,
            );
        });
    }
}
