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
    KeyDto,
    MosaicAddressRestrictionTransactionBuilder,
    SignatureDto,
    TimestampDto,
    UnresolvedAddressDto,
    UnresolvedMosaicIdDto,
} from 'catbuffer-typescript';
import { Convert } from '../../core/format';
import { DtoMapping } from '../../core/utils/DtoMapping';
import { UnresolvedMapping } from '../../core/utils/UnresolvedMapping';
import { Address } from '../account/Address';
import { PublicAccount } from '../account/PublicAccount';
import { MosaicId } from '../mosaic/MosaicId';
import { NamespaceId } from '../namespace/NamespaceId';
import { NetworkType } from '../network/NetworkType';
import { Statement } from '../receipt/Statement';
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
     * @returns {MosaicAddressRestrictionTransaction}
     */
    public static create(deadline: Deadline,
                         mosaicId: MosaicId | NamespaceId,
                         restrictionKey: bigint,
                         targetAddress: Address | NamespaceId,
                         newRestrictionValue: bigint,
                         networkType: NetworkType,
                         previousRestrictionValue: bigint = BigInt('0xFFFFFFFFFFFFFFFF'),
                         maxFee: bigint = BigInt(0)): MosaicAddressRestrictionTransaction {
        return new MosaicAddressRestrictionTransaction(networkType,
            TransactionVersion.MOSAIC_ADDRESS_RESTRICTION,
            deadline,
            maxFee,
            mosaicId,
            restrictionKey,
            targetAddress,
            previousRestrictionValue,
            newRestrictionValue,
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
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: bigint,
                /**
                 * The mosaic id.
                 */
                public readonly mosaicId: MosaicId | NamespaceId,
                /**
                 * The restriction key.
                 */
                public readonly restrictionKey: bigint,
                /**
                 * The affected unresolved address.
                 */
                public readonly targetAddress: Address | NamespaceId,
                /**
                 * The previous restriction value.
                 */
                public readonly previousRestrictionValue: bigint,
                /**
                 * The new restriction value.
                 */
                public readonly newRestrictionValue: bigint,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.MOSAIC_ADDRESS_RESTRICTION, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * Create a transaction object from payload
     * @param {string} payload Binary payload
     * @param {Boolean} isEmbedded Is embedded transaction (Default: false)
     * @returns {Transaction | InnerTransaction}
     */
    public static createFromPayload(payload: string,
                                    isEmbedded: boolean = false): Transaction | InnerTransaction {
        const builder = isEmbedded ? EmbeddedMosaicAddressRestrictionTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload)) :
        MosaicAddressRestrictionTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload));
        const signerPublicKey = Convert.uint8ToHex(builder.getSignerPublicKey().key);
        const networkType = builder.getNetwork().valueOf();
        const transaction = MosaicAddressRestrictionTransaction.create(
            isEmbedded ? Deadline.create() : Deadline.createFromBigInt(
                (builder as MosaicAddressRestrictionTransactionBuilder).getDeadline().timestamp),
            UnresolvedMapping.toUnresolvedMosaic(builder.getMosaicId().unresolvedMosaicId),
            builder.getRestrictionKey(),
            UnresolvedMapping.toUnresolvedAddress(Convert.uint8ToHex(builder.getTargetAddress().unresolvedAddress)),
            builder.getNewRestrictionValue(),
            networkType,
            builder.getPreviousRestrictionValue(),
            isEmbedded ? BigInt(0) : (builder as MosaicAddressRestrictionTransactionBuilder).fee.amount);
        return isEmbedded ?
            transaction.toAggregate(PublicAccount.createFromPublicKey(signerPublicKey, networkType)) : transaction;
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a MosaicDefinitionTransaction
     * @returns {number}
     * @memberof MosaicAddressRestrictionTransaction
     */
    public get size(): number {
        const byteSize = super.size;

        // set static byte size fields
        const byteMosaicId = 8;
        const byteRestrictionKey = 8;
        const bytePreviousRestrictionValue = 8;
        const byteNewRestrictionValue = 8;
        const byteTargetAddress = 25;

        return byteSize + byteMosaicId + byteRestrictionKey +
               byteTargetAddress + bytePreviousRestrictionValue + byteNewRestrictionValue;
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
     * @returns {Uint8Array}
     */
    protected generateBytes(): Uint8Array {
        const signerBuffer = new Uint8Array(32);
        const signatureBuffer = new Uint8Array(64);

        const transactionBuilder = new MosaicAddressRestrictionTransactionBuilder(
            new SignatureDto(signatureBuffer),
            new KeyDto(signerBuffer),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.MOSAIC_ADDRESS_RESTRICTION.valueOf(),
            new AmountDto(this.maxFee),
            new TimestampDto(this.deadline.toBigInt()),
            new UnresolvedMosaicIdDto(this.mosaicId.id),
            this.restrictionKey,
            this.previousRestrictionValue,
            this.newRestrictionValue,
            new UnresolvedAddressDto(UnresolvedMapping.toUnresolvedAddressBytes(this.targetAddress, this.networkType)),
        );
        return transactionBuilder.serialize();
    }

    /**
     * @internal
     * @returns {EmbeddedTransactionBuilder}
     */
    public toEmbeddedTransaction(): EmbeddedTransactionBuilder {
        return new EmbeddedMosaicAddressRestrictionTransactionBuilder(
            new KeyDto(Convert.hexToUint8(this.signer!.publicKey)),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.MOSAIC_ADDRESS_RESTRICTION.valueOf(),
            new UnresolvedMosaicIdDto(this.mosaicId.id),
            this.restrictionKey,
            this.previousRestrictionValue,
            this.newRestrictionValue,
            new UnresolvedAddressDto(UnresolvedMapping.toUnresolvedAddressBytes(this.targetAddress, this.networkType)),
        );
    }

    /**
     * @internal
     * @param statement Block receipt statement
     * @param aggregateTransactionIndex Transaction index for aggregated transaction
     * @returns {MosaicAddressRestrictionTransaction}
     */
    resolveAliases(statement: Statement, aggregateTransactionIndex: number = 0): MosaicAddressRestrictionTransaction {
        const transactionInfo = this.checkTransactionHeightAndIndex();
        return DtoMapping.assign(this, {
            mosaicId: statement.resolveMosaicId(this.mosaicId, transactionInfo.height.toString(),
                transactionInfo.index, aggregateTransactionIndex),
            targetAddress: statement.resolveAddress(this.targetAddress,
                transactionInfo.height.toString(), transactionInfo.index, aggregateTransactionIndex)});
    }
}
