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
    AccountMosaicRestrictionTransactionBuilder,
    AccountRestrictionFlagsDto,
    AmountDto,
    EmbeddedAccountMosaicRestrictionTransactionBuilder,
    EmbeddedTransactionBuilder,
    GeneratorUtils,
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
import { MosaicRestrictionFlag } from '../restriction/MosaicRestrictionFlag';
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
     * @param signature - (Optional) Transaction signature
     * @param signer - (Optional) Signer public account
     * @returns {AccountAddressRestrictionTransaction}
     */
    public static create(
        deadline: Deadline,
        restrictionFlags: MosaicRestrictionFlag,
        restrictionAdditions: UnresolvedMosaicId[],
        restrictionDeletions: UnresolvedMosaicId[],
        networkType: NetworkType,
        maxFee: UInt64 = new UInt64([0, 0]),
        signature?: string,
        signer?: PublicAccount,
    ): AccountMosaicRestrictionTransaction {
        return new AccountMosaicRestrictionTransaction(
            networkType,
            TransactionVersion.ACCOUNT_MOSAIC_RESTRICTION,
            deadline,
            maxFee,
            restrictionFlags,
            restrictionAdditions,
            restrictionDeletions,
            signature,
            signer,
        );
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
    constructor(
        networkType: NetworkType,
        version: number,
        deadline: Deadline,
        maxFee: UInt64,
        public readonly restrictionFlags: MosaicRestrictionFlag,
        public readonly restrictionAdditions: UnresolvedMosaicId[],
        public readonly restrictionDeletions: UnresolvedMosaicId[],
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo,
    ) {
        super(TransactionType.ACCOUNT_MOSAIC_RESTRICTION, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * Create a transaction object from payload
     * @param {string} payload Binary payload
     * @param {Boolean} isEmbedded Is embedded transaction (Default: false)
     * @returns {Transaction | InnerTransaction}
     */
    public static createFromPayload(payload: string, isEmbedded = false): Transaction | InnerTransaction {
        const builder = isEmbedded
            ? EmbeddedAccountMosaicRestrictionTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload))
            : AccountMosaicRestrictionTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload));
        const signerPublicKey = Convert.uint8ToHex(builder.getSignerPublicKey().key);
        const networkType = builder.getNetwork().valueOf();
        const signature = Transaction.getSignatureFromPayload(payload, isEmbedded);
        const transaction = AccountMosaicRestrictionTransaction.create(
            isEmbedded
                ? Deadline.createEmtpy()
                : Deadline.createFromDTO((builder as AccountMosaicRestrictionTransactionBuilder).getDeadline().timestamp),
            GeneratorUtils.fromFlags(AccountRestrictionFlagsDto, builder.getRestrictionFlags()),
            builder.getRestrictionAdditions().map((addition) => {
                return UnresolvedMapping.toUnresolvedMosaic(new UInt64(addition.unresolvedMosaicId).toHex());
            }),
            builder.getRestrictionDeletions().map((deletion) => {
                return UnresolvedMapping.toUnresolvedMosaic(new UInt64(deletion.unresolvedMosaicId).toHex());
            }),
            networkType,
            isEmbedded ? new UInt64([0, 0]) : new UInt64((builder as AccountMosaicRestrictionTransactionBuilder).fee.amount),
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
        const transactionBuilder = new AccountMosaicRestrictionTransactionBuilder(
            this.getSignatureAsBuilder(),
            this.getSignerAsBuilder(),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.ACCOUNT_MOSAIC_RESTRICTION.valueOf(),
            new AmountDto(this.maxFee.toDTO()),
            new TimestampDto(this.deadline.toDTO()),
            GeneratorUtils.toFlags(AccountRestrictionFlagsDto, this.restrictionFlags.valueOf()),
            this.restrictionAdditions.map((addition) => {
                return new UnresolvedMosaicIdDto(addition.id.toDTO());
            }),
            this.restrictionDeletions.map((deletion) => {
                return new UnresolvedMosaicIdDto(deletion.id.toDTO());
            }),
        );
        return transactionBuilder;
    }

    /**
     * @internal
     * @returns {EmbeddedTransactionBuilder}
     */
    public toEmbeddedTransaction(): EmbeddedTransactionBuilder {
        return new EmbeddedAccountMosaicRestrictionTransactionBuilder(
            this.getSignerAsBuilder(),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.ACCOUNT_MOSAIC_RESTRICTION.valueOf(),
            GeneratorUtils.toFlags(AccountRestrictionFlagsDto, this.restrictionFlags.valueOf()),
            this.restrictionAdditions.map((addition) => {
                return new UnresolvedMosaicIdDto(addition.id.toDTO());
            }),
            this.restrictionDeletions.map((deletion) => {
                return new UnresolvedMosaicIdDto(deletion.id.toDTO());
            }),
        );
    }

    /**
     * @internal
     * @param statement Block receipt statement
     * @param aggregateTransactionIndex Transaction index for aggregated transaction
     * @returns {AccountMosaicRestrictionTransaction}
     */
    resolveAliases(statement: Statement, aggregateTransactionIndex = 0): AccountMosaicRestrictionTransaction {
        const transactionInfo = this.checkTransactionHeightAndIndex();
        return DtoMapping.assign(this, {
            restrictionAdditions: this.restrictionAdditions.map((addition) =>
                statement.resolveMosaicId(addition, transactionInfo.height.toString(), transactionInfo.index, aggregateTransactionIndex),
            ),
            restrictionDeletions: this.restrictionDeletions.map((deletion) =>
                statement.resolveMosaicId(deletion, transactionInfo.height.toString(), transactionInfo.index, aggregateTransactionIndex),
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
