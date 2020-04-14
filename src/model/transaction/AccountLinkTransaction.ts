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
    AccountLinkTransactionBuilder,
    AmountDto,
    EmbeddedAccountLinkTransactionBuilder,
    EmbeddedTransactionBuilder,
    KeyDto,
    SignatureDto,
    TimestampDto,
} from 'catbuffer-typescript';
import { Convert } from '../../core/format';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../network/NetworkType';
import { Deadline } from './Deadline';
import { InnerTransaction } from './InnerTransaction';
import { LinkAction } from './LinkAction';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';

/**
 * Announce an AccountLinkTransaction to delegate the account importance to a proxy account.
 * By doing so, you can enable delegated harvesting
 */
export class AccountLinkTransaction extends Transaction {
    /**
     * Create a link account transaction object
     * @param deadline - The deadline to include the transaction.
     * @param remotePublicKey - The public key of the remote account.
     * @param linkAction - The account link action.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {AccountLinkTransaction}
     */
    public static create(
        deadline: Deadline,
        remotePublicKey: string,
        linkAction: LinkAction,
        networkType: NetworkType,
        maxFee = BigInt(0),
    ): AccountLinkTransaction {
        return new AccountLinkTransaction(networkType, TransactionVersion.ACCOUNT_LINK, deadline, maxFee, remotePublicKey, linkAction);
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param remotePublicKey
     * @param linkAction
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(
        networkType: NetworkType,
        version: number,
        deadline: Deadline,
        maxFee: bigint,
        /**
         * The public key of the remote account.
         */
        public readonly remotePublicKey: string,
        /**
         * The account link action.
         */
        public readonly linkAction: LinkAction,
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo,
    ) {
        super(TransactionType.ACCOUNT_LINK, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * Create a transaction object from payload
     * @param {string} payload Binary payload
     * @param {Boolean} isEmbedded Is embedded transaction (Default: false)
     * @returns {Transaction | InnerTransaction}
     */
    public static createFromPayload(payload: string, isEmbedded = false): Transaction | InnerTransaction {
        const builder = isEmbedded
            ? EmbeddedAccountLinkTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload))
            : AccountLinkTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload));
        const signerPublicKey = Convert.uint8ToHex(builder.getSignerPublicKey().key);
        const networkType = builder.getNetwork().valueOf();
        const transaction = AccountLinkTransaction.create(
            isEmbedded ? Deadline.create() : Deadline.createFromBigInt((builder as AccountLinkTransactionBuilder).getDeadline().timestamp),
            Convert.uint8ToHex(builder.getRemotePublicKey().key),
            builder.getLinkAction().valueOf(),
            networkType,
            isEmbedded ? BigInt(0) : (builder as AccountLinkTransactionBuilder).fee.amount,
        );
        return isEmbedded ? transaction.toAggregate(PublicAccount.createFromPublicKey(signerPublicKey, networkType)) : transaction;
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a AccountLinkTransaction
     * @returns {number}
     * @memberof AccountLinkTransaction
     */
    public get size(): number {
        const byteSize = super.size;

        // set static byte size fields
        const bytePublicKey = 32;
        const byteLinkAction = 1;

        return byteSize + bytePublicKey + byteLinkAction;
    }

    /**
     * @internal
     * @returns {Uint8Array}
     */
    protected generateBytes(): Uint8Array {
        const signerBuffer = new Uint8Array(32);
        const signatureBuffer = new Uint8Array(64);

        const transactionBuilder = new AccountLinkTransactionBuilder(
            new SignatureDto(signatureBuffer),
            new KeyDto(signerBuffer),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.ACCOUNT_LINK.valueOf(),
            new AmountDto(this.maxFee),
            new TimestampDto(this.deadline.toBigInt()),
            new KeyDto(Convert.hexToUint8(this.remotePublicKey)),
            this.linkAction.valueOf(),
        );
        return transactionBuilder.serialize();
    }

    /**
     * @internal
     * @returns {EmbeddedTransactionBuilder}
     */
    public toEmbeddedTransaction(): EmbeddedTransactionBuilder {
        return new EmbeddedAccountLinkTransactionBuilder(
            new KeyDto(Convert.hexToUint8(this.signer!.publicKey)),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.ACCOUNT_LINK.valueOf(),
            new KeyDto(Convert.hexToUint8(this.remotePublicKey)),
            this.linkAction.valueOf(),
        );
    }

    /**
     * @internal
     * @returns {AccountLinkTransaction}
     */
    resolveAliases(): AccountLinkTransaction {
        return this;
    }
}
