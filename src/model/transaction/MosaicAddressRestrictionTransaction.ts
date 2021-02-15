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
    EmbeddedMosaicAddressRestrictionTransactionBuilder,
    EmbeddedTransactionBuilder,
    MosaicAddressRestrictionTransactionBuilder,
    TimestampDto,
    TransactionBuilder,
    UnresolvedAddressDto,
    UnresolvedMosaicIdDto,
} from 'catbuffer-typescript';
import { Convert } from '../../core/format';
import { DtoMapping } from '../../core/utils/DtoMapping';
import { UnresolvedMapping } from '../../core/utils/UnresolvedMapping';
import { Address } from '../account/Address';
import { PublicAccount } from '../account/PublicAccount';
import { UnresolvedAddress } from '../account/UnresolvedAddress';
import { UnresolvedMosaicId } from '../mosaic/UnresolvedMosaicId';
import { NamespaceId } from '../namespace/NamespaceId';
import { NetworkType } from '../network/NetworkType';
import { Statement } from '../receipt/Statement';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { InnerTransaction } from './InnerTransaction';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';

export class MosaicAddressRestrictionTransaction extends Transaction {
    /**
     * Create a mosaic address restriction transaction object
     *
     * Enabling accounts to transact with the token is similar to the process of
     * adding elevated permissions to a user in a company computer network.
     *
     * The mosaic creator can modify the permissions of an account by sending a
     * mosaic restriction transaction targeting the account address.
     *
     * **MosaicAddressRestrictionTransaction can only be announced in with Aggregate Transaction
     *
     * @param deadline - The deadline to include the transaction.
     * @param mosaicId - The unresolved mosaic identifier.
     * @param restrictionKey - The restriction key.
     * @param targetAddress - The affected unresolved address.
     * @param newRestrictionValue - The new restriction value.
     * @param networkType - The network type.
     * @param previousRestrictionValue - (Optional) The previous restriction value.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @param signature - (Optional) Transaction signature
     * @param signer - (Optional) Signer public account
     * @returns {MosaicAddressRestrictionTransaction}
     */
    public static create(
        deadline: Deadline,
        mosaicId: UnresolvedMosaicId,
        restrictionKey: UInt64,
        targetAddress: UnresolvedAddress,
        newRestrictionValue: UInt64,
        networkType: NetworkType,
        previousRestrictionValue: UInt64 = UInt64.fromHex('FFFFFFFFFFFFFFFF'),
        maxFee: UInt64 = new UInt64([0, 0]),
        signature?: string,
        signer?: PublicAccount,
    ): MosaicAddressRestrictionTransaction {
        return new MosaicAddressRestrictionTransaction(
            networkType,
            TransactionVersion.MOSAIC_ADDRESS_RESTRICTION,
            deadline,
            maxFee,
            mosaicId,
            restrictionKey,
            targetAddress,
            previousRestrictionValue,
            newRestrictionValue,
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
     * @param signature
     * @param restrictionKey
     * @param targetAddress
     * @param previousRestrictionValue
     * @param newRestrictionValue
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
         * The mosaic id.
         */
        public readonly mosaicId: UnresolvedMosaicId,
        /**
         * The restriction key.
         */
        public readonly restrictionKey: UInt64,
        /**
         * The affected unresolved address.
         */
        public readonly targetAddress: UnresolvedAddress,
        /**
         * The previous restriction value.
         */
        public readonly previousRestrictionValue: UInt64,
        /**
         * The new restriction value.
         */
        public readonly newRestrictionValue: UInt64,
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo,
    ) {
        super(TransactionType.MOSAIC_ADDRESS_RESTRICTION, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * Create a transaction object from payload
     * @param {string} payload Binary payload
     * @param {Boolean} isEmbedded Is embedded transaction (Default: false)
     * @returns {Transaction | InnerTransaction}
     */
    public static createFromPayload(payload: string, isEmbedded = false): Transaction | InnerTransaction {
        const builder = isEmbedded
            ? EmbeddedMosaicAddressRestrictionTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload))
            : MosaicAddressRestrictionTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload));
        const signerPublicKey = Convert.uint8ToHex(builder.getSignerPublicKey().key);
        const networkType = builder.getNetwork().valueOf();
        const signature = Transaction.getSignatureFromPayload(payload, isEmbedded);
        const transaction = MosaicAddressRestrictionTransaction.create(
            isEmbedded
                ? Deadline.createEmtpy()
                : Deadline.createFromDTO((builder as MosaicAddressRestrictionTransactionBuilder).getDeadline().timestamp),
            UnresolvedMapping.toUnresolvedMosaic(new UInt64(builder.getMosaicId().unresolvedMosaicId).toHex()),
            new UInt64(builder.getRestrictionKey()),
            UnresolvedMapping.toUnresolvedAddress(Convert.uint8ToHex(builder.getTargetAddress().unresolvedAddress)),
            new UInt64(builder.getNewRestrictionValue()),
            networkType,
            new UInt64(builder.getPreviousRestrictionValue()),
            isEmbedded ? new UInt64([0, 0]) : new UInt64((builder as MosaicAddressRestrictionTransactionBuilder).fee.amount),
            signature,
            signerPublicKey.match(`^[0]+$`) ? undefined : PublicAccount.createFromPublicKey(signerPublicKey, networkType),
        );
        return isEmbedded ? transaction.toAggregate(PublicAccount.createFromPublicKey(signerPublicKey, networkType)) : transaction;
    }

    /**
     * Return the string notation for the set recipient
     * @internal
     * @returns {string}
     */
    public targetAddressToString(): string {
        if (this.targetAddress instanceof NamespaceId) {
            // namespaceId recipient, return hexadecimal notation
            return (this.targetAddress as NamespaceId).toHex();
        }

        // address recipient
        return (this.targetAddress as Address).plain();
    }

    /**
     * @internal
     * @returns {TransactionBuilder}
     */
    protected createBuilder(): TransactionBuilder {
        const transactionBuilder = new MosaicAddressRestrictionTransactionBuilder(
            this.getSignatureAsBuilder(),
            this.getSignerAsBuilder(),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.MOSAIC_ADDRESS_RESTRICTION.valueOf(),
            new AmountDto(this.maxFee.toDTO()),
            new TimestampDto(this.deadline.toDTO()),
            new UnresolvedMosaicIdDto(this.mosaicId.id.toDTO()),
            this.restrictionKey.toDTO(),
            this.previousRestrictionValue.toDTO(),
            this.newRestrictionValue.toDTO(),
            new UnresolvedAddressDto(this.targetAddress.encodeUnresolvedAddress(this.networkType)),
        );
        return transactionBuilder;
    }

    /**
     * @internal
     * @returns {EmbeddedTransactionBuilder}
     */
    public toEmbeddedTransaction(): EmbeddedTransactionBuilder {
        return new EmbeddedMosaicAddressRestrictionTransactionBuilder(
            this.getSignerAsBuilder(),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.MOSAIC_ADDRESS_RESTRICTION.valueOf(),
            new UnresolvedMosaicIdDto(this.mosaicId.id.toDTO()),
            this.restrictionKey.toDTO(),
            this.previousRestrictionValue.toDTO(),
            this.newRestrictionValue.toDTO(),
            new UnresolvedAddressDto(this.targetAddress.encodeUnresolvedAddress(this.networkType)),
        );
    }

    /**
     * @internal
     * @param statement Block receipt statement
     * @param aggregateTransactionIndex Transaction index for aggregated transaction
     * @returns {MosaicAddressRestrictionTransaction}
     */
    resolveAliases(statement: Statement, aggregateTransactionIndex = 0): MosaicAddressRestrictionTransaction {
        const transactionInfo = this.checkTransactionHeightAndIndex();
        return DtoMapping.assign(this, {
            mosaicId: statement.resolveMosaicId(
                this.mosaicId,
                transactionInfo.height.toString(),
                transactionInfo.index,
                aggregateTransactionIndex,
            ),
            targetAddress: statement.resolveAddress(
                this.targetAddress,
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
    public shouldNotifyAccount(address: UnresolvedAddress): boolean {
        return super.isSigned(address) || this.targetAddress.equals(address);
    }
}
