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
    KeyDto,
    MultisigAccountModificationTransactionBuilder,
    SignatureDto,
    TimestampDto
} from 'catbuffer';
import { Convert } from '../../core/format';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
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
     * @param publicKeyAdditions - Cosignatory public key additions.
     * @param publicKeyDeletions - Cosignatory public key deletions.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {MultisigAccountModificationTransaction}
     */
    public static create(deadline: Deadline,
                         minApprovalDelta: number,
                         minRemovalDelta: number,
                         publicKeyAdditions: PublicAccount[],
                         publicKeyDeletions: PublicAccount[],
                         networkType: NetworkType,
                         maxFee: UInt64 = new UInt64([0, 0])): MultisigAccountModificationTransaction {
        return new MultisigAccountModificationTransaction(networkType,
            TransactionVersion.MODIFY_MULTISIG_ACCOUNT,
            deadline,
            maxFee,
            minApprovalDelta,
            minRemovalDelta,
            publicKeyAdditions,
            publicKeyDeletions);
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param minApprovalDelta
     * @param minRemovalDelta
     * @param publicKeyAdditions
     * @param publicKeyDeletions
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
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
                 * The Cosignatory public key additions.
                 */
                public readonly  publicKeyAdditions: PublicAccount[],
                /**
                 * The Cosignatory public key deletion.
                 */
                public readonly  publicKeyDeletions: PublicAccount[],
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.MODIFY_MULTISIG_ACCOUNT, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * Create a transaction object from payload
     * @param {string} payload Binary payload
     * @param {Boolean} isEmbedded Is embedded transaction (Default: false)
     * @returns {Transaction | InnerTransaction}
     */
    public static createFromPayload(payload: string,
                                    isEmbedded: boolean = false): Transaction | InnerTransaction {
        const builder = isEmbedded ? EmbeddedMultisigAccountModificationTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload)) :
            MultisigAccountModificationTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload));
        const signerPublicKey = Convert.uint8ToHex(builder.getSignerPublicKey().key);
        const networkType = builder.getNetwork().valueOf();
        const transaction = MultisigAccountModificationTransaction.create(
            isEmbedded ? Deadline.create() : Deadline.createFromDTO(
                (builder as MultisigAccountModificationTransactionBuilder).getDeadline().timestamp),
            builder.getMinApprovalDelta(),
            builder.getMinRemovalDelta(),
            builder.getPublicKeyAdditions().map((addition) => {
                return PublicAccount.createFromPublicKey(Convert.uint8ToHex(addition.getKey()), networkType);
            }),
            builder.getPublicKeyDeletions().map((deletion) => {
                return PublicAccount.createFromPublicKey(Convert.uint8ToHex(deletion.getKey()), networkType);
            }),
            networkType,
            isEmbedded ? new UInt64([0, 0]) : new UInt64((builder as MultisigAccountModificationTransactionBuilder).fee.amount),
        );
        return isEmbedded ?
            transaction.toAggregate(PublicAccount.createFromPublicKey(signerPublicKey, networkType)) : transaction;
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a MultisigAccountModificationTransaction
     * @returns {number}
     * @memberof MultisigAccountModificationTransaction
     */
    public get size(): number {
        const byteSize = super.size;

        // set static byte size fields
        const byteRemovalDelta = 1;
        const byteApprovalDelta = 1;
        const byteAdditionCount = 1;
        const byteDeletionCount = 1;
        const bytePublicKeyAdditions = 32 * this.publicKeyAdditions.length;
        const bytePublicKeyDeletions = 32 * this.publicKeyDeletions.length;
        const byteReserved1 = 4;

        return byteSize + byteRemovalDelta + byteApprovalDelta + byteAdditionCount +
        byteDeletionCount + bytePublicKeyAdditions + bytePublicKeyDeletions + byteReserved1;
    }

    /**
     * @internal
     * @returns {Uint8Array}
     */
    protected generateBytes(): Uint8Array {
        const signerBuffer = new Uint8Array(32);
        const signatureBuffer = new Uint8Array(64);

        const transactionBuilder = new MultisigAccountModificationTransactionBuilder(
            new SignatureDto(signatureBuffer),
            new KeyDto(signerBuffer),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.MODIFY_MULTISIG_ACCOUNT.valueOf(),
            new AmountDto(this.maxFee.toDTO()),
            new TimestampDto(this.deadline.toDTO()),
            this.minRemovalDelta,
            this.minApprovalDelta,
            this.publicKeyAdditions.map((addition) => {
                return new KeyDto(Convert.hexToUint8(addition.publicKey));
            }),
            this.publicKeyDeletions.map((deletion) => {
                return new KeyDto(Convert.hexToUint8(deletion.publicKey));
            }),
        );
        return transactionBuilder.serialize();
    }

    /**
     * @internal
     * @returns {EmbeddedTransactionBuilder}
     */
    public toEmbeddedTransaction(): EmbeddedTransactionBuilder {
        return new EmbeddedMultisigAccountModificationTransactionBuilder(
            new KeyDto(Convert.hexToUint8(this.signer!.publicKey)),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.MODIFY_MULTISIG_ACCOUNT.valueOf(),
            this.minRemovalDelta,
            this.minApprovalDelta,
            this.publicKeyAdditions.map((addition) => {
                return new KeyDto(Convert.hexToUint8(addition.publicKey));
            }),
            this.publicKeyDeletions.map((deletion) => {
                return new KeyDto(Convert.hexToUint8(deletion.publicKey));
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
}
