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
    EmbeddedTransactionBuilder,
    EmbeddedVotingKeyLinkTransactionBuilder,
    FinalizationEpochDto,
    TimestampDto,
    TransactionBuilder,
    VotingKeyDto,
    VotingKeyLinkTransactionBuilder,
} from 'catbuffer-typescript';
import { Convert } from '../../core/format';
import { Address, PublicAccount } from '../account';
import { NetworkType } from '../network';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { InnerTransaction } from './InnerTransaction';
import { LinkAction } from './LinkAction';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';

export class VotingKeyLinkTransaction extends Transaction {
    /**
     * Create a voting key link transaction object
     * @param deadline - The deadline to include the transaction.
     * @param linkedPublicKey - The public key for voting (48 bytes).
     * @param startEpoch - The start finalization point.
     * @param endEpoch - The end finalization point.
     * @param linkAction - The account link action.
     * @param networkType - the network type.
     * @param version - The version of the transaction. Depending on the server distribution it could be 1 or 2.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @param signature - (Optional) Transaction signature
     * @param signer - (Optional) Signer public account
     * @returns {VotingKeyLinkTransaction}
     */
    public static create(
        deadline: Deadline,
        linkedPublicKey: string,
        startEpoch: number,
        endEpoch: number,
        linkAction: LinkAction,
        networkType: NetworkType,
        version: number,
        maxFee: UInt64 = new UInt64([0, 0]),
        signature?: string,
        signer?: PublicAccount,
    ): VotingKeyLinkTransaction {
        return new VotingKeyLinkTransaction(
            networkType,
            version,
            deadline,
            maxFee,
            linkedPublicKey,
            startEpoch,
            endEpoch,
            linkAction,
            signature,
            signer,
        );
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param linkedPublicKey The public key of the remote account.
     * @param startEpoch The start finalization point.
     * @param endEpoch The start finalization point.
     * @param linkAction The account link action.
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(
        networkType: NetworkType,
        version: number,
        deadline: Deadline,
        maxFee: UInt64,
        public readonly linkedPublicKey: string,
        public readonly startEpoch: number,
        public readonly endEpoch: number,
        public readonly linkAction: LinkAction,
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo,
    ) {
        super(TransactionType.VOTING_KEY_LINK, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        Convert.validateHexString(linkedPublicKey, 64, 'Invalid linkedPublicKey');
    }

    /**
     * Create a transaction object from payload
     * @param {string} payload Binary payload
     * @param {Boolean} isEmbedded Is embedded transaction (Default: false)
     * @returns {Transaction | InnerTransaction}
     */
    public static createFromPayload(payload: string, isEmbedded = false): Transaction | InnerTransaction {
        const builder = isEmbedded
            ? EmbeddedVotingKeyLinkTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload))
            : VotingKeyLinkTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload));
        const signerPublicKey = Convert.uint8ToHex(builder.getSignerPublicKey().key);
        const networkType = builder.getNetwork().valueOf();
        const signature = Transaction.getSignatureFromPayload(payload, isEmbedded);
        const transaction = VotingKeyLinkTransaction.create(
            isEmbedded
                ? Deadline.createEmtpy()
                : Deadline.createFromDTO((builder as VotingKeyLinkTransactionBuilder).getDeadline().timestamp),
            Convert.uint8ToHex(builder.getLinkedPublicKey().votingKey),
            builder.getStartEpoch().finalizationEpoch,
            builder.getEndEpoch().finalizationEpoch,
            builder.getLinkAction().valueOf(),
            networkType,
            builder.getVersion(),
            isEmbedded ? new UInt64([0, 0]) : new UInt64((builder as VotingKeyLinkTransactionBuilder).fee.amount),
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
        return new VotingKeyLinkTransactionBuilder(
            this.getSignatureAsBuilder(),
            this.getSignerAsBuilder(),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.VOTING_KEY_LINK.valueOf(),
            new AmountDto(this.maxFee.toDTO()),
            new TimestampDto(this.deadline.toDTO()),
            new VotingKeyDto(Convert.hexToUint8(this.linkedPublicKey)),
            new FinalizationEpochDto(this.startEpoch),
            new FinalizationEpochDto(this.endEpoch),
            this.linkAction.valueOf(),
        );
    }

    /**
     * @internal
     * @returns {EmbeddedTransactionBuilder}
     */
    public toEmbeddedTransaction(): EmbeddedTransactionBuilder {
        return new EmbeddedVotingKeyLinkTransactionBuilder(
            this.getSignerAsBuilder(),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.VOTING_KEY_LINK.valueOf(),
            new VotingKeyDto(Convert.hexToUint8(this.linkedPublicKey)),
            new FinalizationEpochDto(this.startEpoch),
            new FinalizationEpochDto(this.endEpoch),
            this.linkAction.valueOf(),
        );
    }

    /**
     * @internal
     * @returns {VotingKeyLinkTransaction}
     */
    resolveAliases(): VotingKeyLinkTransaction {
        return this;
    }

    /**
     * @internal
     * Check a given address should be notified in websocket channels
     * @param address address to be notified
     * @returns {boolean}
     */
    public shouldNotifyAccount(address: Address): boolean {
        return super.isSigned(address) || Address.createFromPublicKey(this.linkedPublicKey, this.networkType).equals(address);
    }
}
