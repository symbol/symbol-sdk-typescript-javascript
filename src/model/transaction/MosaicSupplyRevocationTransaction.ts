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
    EmbeddedMosaicSupplyRevocationTransactionBuilder,
    EmbeddedTransactionBuilder,
    MosaicSupplyRevocationTransactionBuilder,
    TimestampDto,
    TransactionBuilder,
    UnresolvedAddressDto,
    UnresolvedMosaicBuilder,
    UnresolvedMosaicIdDto,
} from 'catbuffer-typescript';
import { DtoMapping } from '../../core';
import { Convert } from '../../core/format';
import { UnresolvedMapping } from '../../core/utils/UnresolvedMapping';
import { Address } from '../account';
import { PublicAccount } from '../account/PublicAccount';
import { UnresolvedAddress } from '../account/UnresolvedAddress';
import { Mosaic } from '../mosaic';
import { NetworkType } from '../network/NetworkType';
import { Statement } from '../receipt';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { InnerTransaction } from './InnerTransaction';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';

/**
 * Creators of a revokable mosaic will be able to recall any and all balances from any holders. Holders of these mosaics implicitly place trust in the issuer.
 * The mosaic issuer can revoke and recall balances using this transaction.
 */
export class MosaicSupplyRevocationTransaction extends Transaction {
    /**
     * Create a mosaic supply revocation transaction object
     * @param deadline - The deadline to include the transaction.
     * @param sourceAddress - Address from which tokens should be revoked.
     * @param mosaic - Revoked mosaic and amount.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @param signature - (Optional) Transaction signature
     * @param signer - (Optional) Signer public account
     * @returns {MosaicSupplyRevocationTransaction}
     */
    public static create(
        deadline: Deadline,
        sourceAddress: UnresolvedAddress,
        mosaic: Mosaic,
        networkType: NetworkType,
        maxFee: UInt64 = new UInt64([0, 0]),
        signature?: string,
        signer?: PublicAccount,
    ): MosaicSupplyRevocationTransaction {
        return new MosaicSupplyRevocationTransaction(
            networkType,
            TransactionVersion.MOSAIC_SUPPLY_REVOCATION,
            deadline,
            maxFee,
            sourceAddress,
            mosaic,
            signature,
            signer,
        );
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param sourceAddress
     * @param mosaic
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
         * Address from which tokens should be revoked.
         */
        public readonly sourceAddress: UnresolvedAddress,
        /**
         * Revoked mosaic and amount.
         */
        public readonly mosaic: Mosaic,

        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo,
    ) {
        super(TransactionType.MOSAIC_SUPPLY_REVOCATION, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * Create a transaction object from payload
     * @param {string} payload Binary payload
     * @param {Boolean} isEmbedded Is embedded transaction (Default: false)
     * @returns {Transaction | InnerTransaction}
     */
    public static createFromPayload(payload: string, isEmbedded = false): Transaction | InnerTransaction {
        const builder = isEmbedded
            ? EmbeddedMosaicSupplyRevocationTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload))
            : MosaicSupplyRevocationTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload));
        const mosaicBuilder = builder.getMosaic();
        const id = new UInt64(mosaicBuilder.mosaicId.unresolvedMosaicId).toHex();
        const mosaic = new Mosaic(UnresolvedMapping.toUnresolvedMosaic(id), new UInt64(mosaicBuilder.amount.amount));
        const signerPublicKey = Convert.uint8ToHex(builder.getSignerPublicKey().publicKey);
        const networkType = builder.getNetwork().valueOf();
        const signature = Transaction.getSignatureFromPayload(payload, isEmbedded);
        const deadline = isEmbedded
            ? Deadline.createEmtpy()
            : Deadline.createFromDTO((builder as MosaicSupplyRevocationTransactionBuilder).getDeadline().timestamp);
        const transaction = MosaicSupplyRevocationTransaction.create(
            deadline,
            UnresolvedMapping.toUnresolvedAddress(Convert.uint8ToHex(builder.getSourceAddress().unresolvedAddress)),
            mosaic,
            networkType,
            isEmbedded ? new UInt64([0, 0]) : new UInt64((builder as MosaicSupplyRevocationTransactionBuilder).fee.amount),
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
        const mosaicBuilder = new UnresolvedMosaicBuilder(
            new UnresolvedMosaicIdDto(this.mosaic.id.id.toDTO()),
            new AmountDto(this.mosaic.amount.toDTO()),
        );

        return new MosaicSupplyRevocationTransactionBuilder(
            this.getSignatureAsBuilder(),
            this.getSignerAsBuilder(),
            this.versionToDTO(),
            this.networkType.valueOf(),
            this.type.valueOf(),
            new AmountDto(this.maxFee.toDTO()),
            new TimestampDto(this.deadline.toDTO()),
            new UnresolvedAddressDto(this.sourceAddress.encodeUnresolvedAddress(this.networkType)),
            mosaicBuilder,
        );
    }

    /**
     * @internal
     * @returns {EmbeddedTransactionBuilder}
     */
    public toEmbeddedTransaction(): EmbeddedTransactionBuilder {
        const mosaicBuilder = new UnresolvedMosaicBuilder(
            new UnresolvedMosaicIdDto(this.mosaic.id.id.toDTO()),
            new AmountDto(this.mosaic.amount.toDTO()),
        );
        return new EmbeddedMosaicSupplyRevocationTransactionBuilder(
            this.getSignerAsBuilder(),
            this.versionToDTO(),
            this.networkType.valueOf(),
            this.type.valueOf(),
            new UnresolvedAddressDto(this.sourceAddress.encodeUnresolvedAddress(this.networkType)),
            mosaicBuilder,
        );
    }

    /**
     * @internal
     * @param statement Block receipt statement
     * @param aggregateTransactionIndex Transaction index for aggregated transaction
     * @returns {MosaicSupplyRevocationTransaction}
     */
    resolveAliases(statement: Statement, aggregateTransactionIndex = 0): MosaicSupplyRevocationTransaction {
        const transactionInfo = this.checkTransactionHeightAndIndex();
        return DtoMapping.assign(this, {
            sourceAddress: statement.resolveAddress(
                this.sourceAddress,
                transactionInfo.height.toString(),
                transactionInfo.index,
                aggregateTransactionIndex,
            ),
            mosaic: statement.resolveMosaic(
                this.mosaic,
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
