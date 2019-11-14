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

import { Convert } from '../../core/format';
import { UnresolvedMapping } from '../../core/utils/UnresolvedMapping';
import { AccountMosaicRestrictionTransactionBuilder } from '../../infrastructure/catbuffer/AccountMosaicRestrictionTransactionBuilder';
import { AmountDto } from '../../infrastructure/catbuffer/AmountDto';
import {
    EmbeddedAccountMosaicRestrictionTransactionBuilder,
} from '../../infrastructure/catbuffer/EmbeddedAccountMosaicRestrictionTransactionBuilder';
import { KeyDto } from '../../infrastructure/catbuffer/KeyDto';
import { SignatureDto } from '../../infrastructure/catbuffer/SignatureDto';
import { TimestampDto } from '../../infrastructure/catbuffer/TimestampDto';
import { UnresolvedMosaicIdDto } from '../../infrastructure/catbuffer/UnresolvedMosaicIdDto';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { MosaicId } from '../mosaic/MosaicId';
import { NamespaceId } from '../namespace/NamespaceId';
import { AccountRestrictionFlags } from '../restriction/AccountRestrictionType';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { InnerTransaction } from './InnerTransaction';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';

export class AccountMosaicRestrictionTransaction extends Transaction {

    /**
     * Create a modify account mosaic restriction transaction object
     * @param deadline - The deadline to include the transaction.
     * @param restrictionFlags - The account restriction flags.
     * @param restrictionAdditions - Account restriction additions.
     * @param restrictionDeletions - Account restriction deletions.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {AccountAddressRestrictionTransaction}
     */
    public static create(deadline: Deadline,
                         restrictionFlags: AccountRestrictionFlags,
                         restrictionAdditions: Array<MosaicId | NamespaceId>,
                         restrictionDeletions: Array<MosaicId | NamespaceId>,
                         networkType: NetworkType,
                         maxFee: UInt64 = new UInt64([0, 0])): AccountMosaicRestrictionTransaction {
        return new AccountMosaicRestrictionTransaction(networkType,
            TransactionVersion.ACCOUNT_RESTRICTION_MOSAIC,
            deadline,
            maxFee,
            restrictionFlags,
            restrictionAdditions,
            restrictionDeletions);
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param restrictionFlags
     * @param restrictionAdditions
     * @param restrictionDeletions
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                public readonly restrictionFlags: AccountRestrictionFlags,
                public readonly restrictionAdditions: Array<MosaicId | NamespaceId>,
                public readonly restrictionDeletions: Array<MosaicId | NamespaceId>,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.ACCOUNT_RESTRICTION_MOSAIC,
              networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * Create a transaction object from payload
     * @param {string} payload Binary payload
     * @param {Boolean} isEmbedded Is embedded transaction (Default: false)
     * @returns {Transaction | InnerTransaction}
     */
    public static createFromPayload(payload: string,
                                    isEmbedded: boolean = false): Transaction | InnerTransaction {
        const builder = isEmbedded ? EmbeddedAccountMosaicRestrictionTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload)) :
            AccountMosaicRestrictionTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload));
        const signerPublicKey = Convert.uint8ToHex(builder.getSignerPublicKey().key);
        const networkType = builder.getNetwork().valueOf();
        const transaction = AccountMosaicRestrictionTransaction.create(
            isEmbedded ? Deadline.create() : Deadline.createFromDTO(
                (builder as AccountMosaicRestrictionTransactionBuilder).getDeadline().timestamp),
            builder.getRestrictionFlags().valueOf(),
            builder.getRestrictionAdditions().map((addition) => {
                return UnresolvedMapping.toUnresolvedMosaic(new UInt64(addition.unresolvedMosaicId).toHex());
            }),
            builder.getRestrictionDeletions().map((deletion) => {
                return UnresolvedMapping.toUnresolvedMosaic(new UInt64(deletion.unresolvedMosaicId).toHex());
            }),
            networkType,
            isEmbedded ? new UInt64([0, 0]) : new UInt64((builder as AccountMosaicRestrictionTransactionBuilder).fee.amount),
        );
        return isEmbedded ?
            transaction.toAggregate(PublicAccount.createFromPublicKey(signerPublicKey, networkType)) : transaction;
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a AccountMosaicRestrictionTransaction
     * @returns {number}
     * @memberof AccountMosaicRestrictionTransaction
     */
    public get size(): number {
        const byteSize = super.size;

        // set static byte size fields
        const byteRestrictionType = 2;
        const byteAdditionCount = 1;
        const byteDeletionCount = 1;
        const byteAccountRestrictionTransactionBody_Reserved1 = 4;
        const byteRestrictionAdditions = 8 * this.restrictionAdditions.length;
        const byteRestrictionDeletions = 8 * this.restrictionDeletions.length;

        return byteSize + byteRestrictionType + byteAdditionCount + byteDeletionCount +
               byteRestrictionAdditions + byteRestrictionDeletions +
               byteAccountRestrictionTransactionBody_Reserved1;
    }

    /**
     * @internal
     * @returns {Uint8Array}
     */
    protected generateBytes(): Uint8Array {
        const signerBuffer = new Uint8Array(32);
        const signatureBuffer = new Uint8Array(64);

        const transactionBuilder = new AccountMosaicRestrictionTransactionBuilder(
            new SignatureDto(signatureBuffer),
            new KeyDto(signerBuffer),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.ACCOUNT_RESTRICTION_MOSAIC.valueOf(),
            new AmountDto(this.maxFee.toDTO()),
            new TimestampDto(this.deadline.toDTO()),
            this.restrictionFlags.valueOf(),
            this.restrictionAdditions.map((addition) => {
                return new UnresolvedMosaicIdDto(addition.id.toDTO());
            }),
            this.restrictionDeletions.map((deletion) => {
                return new UnresolvedMosaicIdDto(deletion.id.toDTO());
            }),
        );
        return transactionBuilder.serialize();
    }

    /**
     * @internal
     * @returns {Uint8Array}
     */
    protected generateEmbeddedBytes(): Uint8Array {
        const transactionBuilder = new EmbeddedAccountMosaicRestrictionTransactionBuilder(
            new KeyDto(Convert.hexToUint8(this.signer!.publicKey)),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.ACCOUNT_RESTRICTION_MOSAIC.valueOf(),
            this.restrictionFlags.valueOf(),
            this.restrictionAdditions.map((addition) => {
                return new UnresolvedMosaicIdDto(addition.id.toDTO());
            }),
            this.restrictionDeletions.map((deletion) => {
                return new UnresolvedMosaicIdDto(deletion.id.toDTO());
            }),
        );
        return transactionBuilder.serialize();
    }
}
