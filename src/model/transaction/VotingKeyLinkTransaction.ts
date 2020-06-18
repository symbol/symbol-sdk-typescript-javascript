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
    KeyDto,
    SignatureDto,
    TimestampDto,
    EmbeddedVotingKeyLinkTransactionBuilder,
    VotingKeyLinkTransactionBuilder,
    VotingKeyDto,
} from 'catbuffer-typescript';
import { Convert } from '../../core/format';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../network/NetworkType';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { InnerTransaction } from './InnerTransaction';
import { LinkAction } from './LinkAction';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';
import { Address } from '../account/Address';
import { FinalizationPointDto } from 'catbuffer-typescript/dist/FinalizationPointDto';

export class VotingKeyLinkTransaction extends Transaction {
    /**
     * Create a voting key link transaction object
     * @param deadline - The deadline to include the transaction.
     * @param linkedPublicKey - The public key for voting (48 bytes).
     * @param startPoint - The start finalization point.
     * @param endPoint - The end finalization point.
     * @param linkAction - The account link action.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @param signature - (Optional) Transaction signature
     * @param signer - (Optional) Signer public account
     * @returns {VotingKeyLinkTransaction}
     */
    public static create(
        deadline: Deadline,
        linkedPublicKey: string,
        startPoint: UInt64,
        endPoint: UInt64,
        linkAction: LinkAction,
        networkType: NetworkType,
        maxFee: UInt64 = new UInt64([0, 0]),
        signature?: string,
        signer?: PublicAccount,
    ): VotingKeyLinkTransaction {
        return new VotingKeyLinkTransaction(
            networkType,
            TransactionVersion.VOTING_KEY_LINK,
            deadline,
            maxFee,
            linkedPublicKey,
            startPoint,
            endPoint,
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
     * @param linkedPublicKey
     * @param startPoint
     * @param endPoint
     * @param linkAction
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
         * The public key of the remote account.
         */
        public readonly linkedPublicKey: string,
        /**
         * The start finalization point.
         */
        public readonly startPoint: UInt64,
        /**
         * The start finalization point.
         */
        public readonly endPoint: UInt64,
        /**
         * The account link action.
         */
        public readonly linkAction: LinkAction,
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo,
    ) {
        super(TransactionType.VOTING_KEY_LINK, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
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
        const signature = payload.substring(16, 144);
        const transaction = VotingKeyLinkTransaction.create(
            isEmbedded ? Deadline.create() : Deadline.createFromDTO((builder as VotingKeyLinkTransactionBuilder).getDeadline().timestamp),
            Convert.uint8ToHex(builder.getLinkedPublicKey().votingKey),
            new UInt64(builder.getStartPoint().finalizationPoint),
            new UInt64(builder.getEndPoint().finalizationPoint),
            builder.getLinkAction().valueOf(),
            networkType,
            isEmbedded ? new UInt64([0, 0]) : new UInt64((builder as VotingKeyLinkTransactionBuilder).fee.amount),
            isEmbedded || signature.match(`^[0]+$`) ? undefined : signature,
            signerPublicKey.match(`^[0]+$`) ? undefined : PublicAccount.createFromPublicKey(signerPublicKey, networkType),
        );
        return isEmbedded ? transaction.toAggregate(PublicAccount.createFromPublicKey(signerPublicKey, networkType)) : transaction;
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a VotingKeyLinkTransaction
     * @returns {number}
     * @memberof VotingKeyLinkTransaction
     */
    public get size(): number {
        const byteSize = super.size;

        // set static byte size fields
        const bytePublicKey = 48;
        const startPoint = 8;
        const endPoint = 8;
        const byteLinkAction = 1;

        return byteSize + bytePublicKey + startPoint + endPoint + byteLinkAction;
    }

    /**
     * @internal
     * @returns {Uint8Array}
     */
    protected generateBytes(): Uint8Array {
        const signerBuffer = this.signer !== undefined ? Convert.hexToUint8(this.signer.publicKey) : new Uint8Array(32);
        const signatureBuffer = this.signature !== undefined ? Convert.hexToUint8(this.signature) : new Uint8Array(64);

        const transactionBuilder = new VotingKeyLinkTransactionBuilder(
            new SignatureDto(signatureBuffer),
            new KeyDto(signerBuffer),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.VOTING_KEY_LINK.valueOf(),
            new AmountDto(this.maxFee.toDTO()),
            new TimestampDto(this.deadline.toDTO()),
            new VotingKeyDto(Convert.hexToUint8(this.linkedPublicKey)),
            new FinalizationPointDto(this.startPoint.toDTO()),
            new FinalizationPointDto(this.endPoint.toDTO()),
            this.linkAction.valueOf(),
        );
        return transactionBuilder.serialize();
    }

    /**
     * @internal
     * @returns {EmbeddedTransactionBuilder}
     */
    public toEmbeddedTransaction(): EmbeddedTransactionBuilder {
        return new EmbeddedVotingKeyLinkTransactionBuilder(
            new KeyDto(Convert.hexToUint8(this.signer!.publicKey)),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.VOTING_KEY_LINK.valueOf(),
            new VotingKeyDto(Convert.hexToUint8(this.linkedPublicKey)),
            new FinalizationPointDto(this.startPoint.toDTO()),
            new FinalizationPointDto(this.endPoint.toDTO()),
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
