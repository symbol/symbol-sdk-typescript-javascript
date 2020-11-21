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
    EmbeddedNodeKeyLinkTransactionBuilder,
    EmbeddedTransactionBuilder,
    KeyDto,
    NodeKeyLinkTransactionBuilder,
    TimestampDto,
    TransactionBuilder,
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
import { TransactionVersion } from './TransactionVersion';

export class NodeKeyLinkTransaction extends Transaction {
    /**
     * Create a node key link transaction object
     * @param deadline - The deadline to include the transaction.
     * @param linkedPublicKey - The linked public key.
     * @param linkAction - The account link action.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @param signature - (Optional) Transaction signature
     * @param signer - (Optional) Signer public account
     * @returns {NodeKeyLinkTransaction}
     */
    public static create(
        deadline: Deadline,
        linkedPublicKey: string,
        linkAction: LinkAction,
        networkType: NetworkType,
        maxFee: UInt64 = new UInt64([0, 0]),
        signature?: string,
        signer?: PublicAccount,
    ): NodeKeyLinkTransaction {
        return new NodeKeyLinkTransaction(
            networkType,
            TransactionVersion.NODE_KEY_LINK,
            deadline,
            maxFee,
            linkedPublicKey,
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
         * The account link action.
         */
        public readonly linkAction: LinkAction,
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo,
    ) {
        super(TransactionType.NODE_KEY_LINK, networkType, version, deadline, maxFee, signature, signer, transactionInfo);

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
            ? EmbeddedNodeKeyLinkTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload))
            : NodeKeyLinkTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload));
        const signerPublicKey = Convert.uint8ToHex(builder.getSignerPublicKey().key);
        const networkType = builder.getNetwork().valueOf();
        const signature = Transaction.getSignatureFromPayload(payload, isEmbedded);
        const transaction = NodeKeyLinkTransaction.create(
            isEmbedded
                ? Deadline.createEmtpy()
                : Deadline.createFromDTO((builder as NodeKeyLinkTransactionBuilder).getDeadline().timestamp),
            Convert.uint8ToHex(builder.getLinkedPublicKey().key),
            builder.getLinkAction().valueOf(),
            networkType,
            isEmbedded ? new UInt64([0, 0]) : new UInt64((builder as NodeKeyLinkTransactionBuilder).fee.amount),
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
        return new NodeKeyLinkTransactionBuilder(
            this.getSignatureAsBuilder(),
            this.getSignerAsBuilder(),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.NODE_KEY_LINK.valueOf(),
            new AmountDto(this.maxFee.toDTO()),
            new TimestampDto(this.deadline.toDTO()),
            new KeyDto(Convert.hexToUint8(this.linkedPublicKey)),
            this.linkAction.valueOf(),
        );
    }

    /**
     * @internal
     * @returns {EmbeddedTransactionBuilder}
     */
    public toEmbeddedTransaction(): EmbeddedTransactionBuilder {
        return new EmbeddedNodeKeyLinkTransactionBuilder(
            this.getSignerAsBuilder(),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.NODE_KEY_LINK.valueOf(),
            new KeyDto(Convert.hexToUint8(this.linkedPublicKey)),
            this.linkAction.valueOf(),
        );
    }

    /**
     * @internal
     * @returns {NodeKeyLinkTransaction}
     */
    resolveAliases(): NodeKeyLinkTransaction {
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
