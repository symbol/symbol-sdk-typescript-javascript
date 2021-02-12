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
    EmbeddedMultisigAccountModificationTransactionBuilder,
    EmbeddedTransactionBuilder,
    MultisigAccountModificationTransactionBuilder,
    TimestampDto,
    TransactionBuilder,
    UnresolvedAddressDto,
} from 'catbuffer-typescript';
import { Convert } from '../../core/format';
import { UnresolvedMapping } from '../../core/utils/UnresolvedMapping';
import { PublicAccount } from '../account/PublicAccount';
import { UnresolvedAddress } from '../account/UnresolvedAddress';
import { NetworkType } from '../network/NetworkType';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { InnerTransaction } from './InnerTransaction';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';

/**
 * Modify multisig account transactions are part of the NEM's multisig account system.
 * A modify multisig account transaction holds an array of multisig cosignatory modifications,
 * min number of signatures to approve a transaction and a min number of signatures to remove a cosignatory.
 * @since 1.0
 */
export class MultisigAccountModificationTransaction extends Transaction {
    /**
     * Create a modify multisig account transaction object
     * @param deadline - The deadline to include the transaction.
     * @param minApprovalDelta - The min approval relative change.
     * @param minRemovalDelta - The min removal relative change.
     * @param addressAdditions - Cosignatory address additions.
     * @param addressDeletions - Cosignatory address deletions.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @param signature - (Optional) Transaction signature
     * @param signer - (Optional) Signer public account
     * @returns {MultisigAccountModificationTransaction}
     */
    public static create(
        deadline: Deadline,
        minApprovalDelta: number,
        minRemovalDelta: number,
        addressAdditions: UnresolvedAddress[],
        addressDeletions: UnresolvedAddress[],
        networkType: NetworkType,
        maxFee: UInt64 = new UInt64([0, 0]),
        signature?: string,
        signer?: PublicAccount,
    ): MultisigAccountModificationTransaction {
        return new MultisigAccountModificationTransaction(
            networkType,
            TransactionVersion.MULTISIG_ACCOUNT_MODIFICATION,
            deadline,
            maxFee,
            minApprovalDelta,
            minRemovalDelta,
            addressAdditions,
            addressDeletions,
            signature,
            signer,
        );
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param minApprovalDelta
     * @param minRemovalDelta
     * @param addressAdditions
     * @param addressDeletions
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
         * The number of signatures needed to approve a transaction.
         * If we are modifying and existing multi-signature account this indicates the relative change of the minimum cosignatories.
         */
        public readonly minApprovalDelta: number,
        /**
         * The number of signatures needed to remove a cosignatory.
         * If we are modifying and existing multi-signature account this indicates the relative change of the minimum cosignatories.
         */
        public readonly minRemovalDelta: number,
        /**
         * The Cosignatory address additions.
         */
        public readonly addressAdditions: UnresolvedAddress[],
        /**
         * The Cosignatory address deletion.
         */
        public readonly addressDeletions: UnresolvedAddress[],
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo,
    ) {
        super(TransactionType.MULTISIG_ACCOUNT_MODIFICATION, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * Create a transaction object from payload
     * @param {string} payload Binary payload
     * @param {Boolean} isEmbedded Is embedded transaction (Default: false)
     * @returns {Transaction | InnerTransaction}
     */
    public static createFromPayload(payload: string, isEmbedded = false): Transaction | InnerTransaction {
        const builder = isEmbedded
            ? EmbeddedMultisigAccountModificationTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload))
            : MultisigAccountModificationTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload));
        const signerPublicKey = Convert.uint8ToHex(builder.getSignerPublicKey().key);
        const networkType = builder.getNetwork().valueOf();
        const signature = Transaction.getSignatureFromPayload(payload, isEmbedded);
        const transaction = MultisigAccountModificationTransaction.create(
            isEmbedded
                ? Deadline.createEmtpy()
                : Deadline.createFromDTO((builder as MultisigAccountModificationTransactionBuilder).getDeadline().timestamp),
            builder.getMinApprovalDelta(),
            builder.getMinRemovalDelta(),
            builder.getAddressAdditions().map((addition) => {
                return UnresolvedMapping.toUnresolvedAddress(Convert.uint8ToHex(addition.unresolvedAddress));
            }),
            builder.getAddressDeletions().map((deletion) => {
                return UnresolvedMapping.toUnresolvedAddress(Convert.uint8ToHex(deletion.unresolvedAddress));
            }),
            networkType,
            isEmbedded ? new UInt64([0, 0]) : new UInt64((builder as MultisigAccountModificationTransactionBuilder).fee.amount),
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
        const transactionBuilder = new MultisigAccountModificationTransactionBuilder(
            this.getSignatureAsBuilder(),
            this.getSignerAsBuilder(),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.MULTISIG_ACCOUNT_MODIFICATION.valueOf(),
            new AmountDto(this.maxFee.toDTO()),
            new TimestampDto(this.deadline.toDTO()),
            this.minRemovalDelta,
            this.minApprovalDelta,
            this.addressAdditions.map((addition) => {
                return new UnresolvedAddressDto(addition.encodeUnresolvedAddress(this.networkType));
            }),
            this.addressDeletions.map((deletion) => {
                return new UnresolvedAddressDto(deletion.encodeUnresolvedAddress(this.networkType));
            }),
        );
        return transactionBuilder;
    }

    /**
     * @internal
     * @returns {EmbeddedTransactionBuilder}
     */
    public toEmbeddedTransaction(): EmbeddedTransactionBuilder {
        return new EmbeddedMultisigAccountModificationTransactionBuilder(
            this.getSignerAsBuilder(),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.MULTISIG_ACCOUNT_MODIFICATION.valueOf(),
            this.minRemovalDelta,
            this.minApprovalDelta,
            this.addressAdditions.map((addition) => {
                return new UnresolvedAddressDto(addition.encodeUnresolvedAddress(this.networkType));
            }),
            this.addressDeletions.map((deletion) => {
                return new UnresolvedAddressDto(deletion.encodeUnresolvedAddress(this.networkType));
            }),
        );
    }

    /**
     * @internal
     * @returns {MultisigAccountModificationTransaction}
     */
    resolveAliases(): MultisigAccountModificationTransaction {
        return this;
    }

    /**
     * @internal
     * Check a given address should be notified in websocket channels
     * @param address address to be notified
     * @returns {boolean}
     */
    public shouldNotifyAccount(address: UnresolvedAddress): boolean {
        return (
            super.isSigned(address) ||
            this.addressAdditions.find((_) => _.equals(address)) !== undefined ||
            this.addressDeletions.find((_) => _.equals(address)) !== undefined
        );
    }
}
