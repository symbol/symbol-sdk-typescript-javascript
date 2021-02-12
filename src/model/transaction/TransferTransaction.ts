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
    EmbeddedTransactionBuilder,
    EmbeddedTransferTransactionBuilder,
    GeneratorUtils,
    TimestampDto,
    TransactionBuilder,
    TransferTransactionBuilder,
    UnresolvedAddressDto,
    UnresolvedMosaicBuilder,
    UnresolvedMosaicIdDto,
} from 'catbuffer-typescript';
import * as Long from 'long';
import { Convert } from '../../core/format';
import { DtoMapping, UnresolvedMapping } from '../../core/utils';
import { Address, PublicAccount, UnresolvedAddress } from '../account';
import { EmptyMessage, Message, MessageFactory, MessageType } from '../message';
import { Mosaic } from '../mosaic';
import { NamespaceId } from '../namespace';
import { NetworkType } from '../network';
import { Statement } from '../receipt';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { InnerTransaction } from './InnerTransaction';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';

/**
 * Transfer transactions contain data about transfers of mosaics and message to another account.
 */
export class TransferTransaction extends Transaction {
    /**
     * Create a transfer transaction object.
     *
     * - This method can also be used to create PersistentDelegationRequestTransaction
     * with `PersistentHarvestingDelegationMessage` provided.
     * @param deadline - The deadline to include the transaction.
     * @param recipientAddress - The recipient address of the transaction.
     * @param mosaics - The array of mosaics.
     * @param message - The transaction message.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @param signature - (Optional) Transaction signature
     * @param signer - (Optional) Signer public account
     * @returns {TransferTransaction}
     */
    public static create(
        deadline: Deadline,
        recipientAddress: UnresolvedAddress,
        mosaics: Mosaic[],
        message: Message,
        networkType: NetworkType,
        maxFee: UInt64 = new UInt64([0, 0]),
        signature?: string,
        signer?: PublicAccount,
    ): TransferTransaction {
        return new TransferTransaction(
            networkType,
            TransactionVersion.TRANSFER,
            deadline,
            maxFee,
            recipientAddress,
            mosaics,
            message,
            signature,
            signer,
        );
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param recipientAddress
     * @param mosaics
     * @param message
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
         * The address of the recipient address.
         */
        public readonly recipientAddress: UnresolvedAddress,
        /**
         * The array of Mosaic objects.
         */
        public readonly mosaics: Mosaic[],
        /**
         * The transaction message of 2048 characters.
         */
        public readonly message: Message = EmptyMessage,
        signature?: string,
        signer?: PublicAccount,
        transactionInfo?: TransactionInfo,
    ) {
        super(TransactionType.TRANSFER, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
        this.validate();
    }

    /**
     * Create a transaction object from payload
     * @param {string} payload Binary payload
     * @param {Boolean} isEmbedded Is embedded transaction (Default: false)
     * @returns {Transaction | InnerTransaction}
     */
    public static createFromPayload(payload: string, isEmbedded = false): Transaction | InnerTransaction {
        const builder = isEmbedded
            ? EmbeddedTransferTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload))
            : TransferTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload));
        const signerPublicKey = Convert.uint8ToHex(builder.getSignerPublicKey().key);
        const networkType = builder.getNetwork().valueOf();
        const signature = Transaction.getSignatureFromPayload(payload, isEmbedded);
        const transaction = TransferTransaction.create(
            isEmbedded ? Deadline.createEmtpy() : Deadline.createFromDTO((builder as TransferTransactionBuilder).getDeadline().timestamp),
            UnresolvedMapping.toUnresolvedAddress(Convert.uint8ToHex(builder.getRecipientAddress().unresolvedAddress)),
            builder.getMosaics().map((mosaic) => {
                const id = new UInt64(mosaic.mosaicId.unresolvedMosaicId).toHex();
                return new Mosaic(UnresolvedMapping.toUnresolvedMosaic(id), new UInt64(mosaic.amount.amount));
            }),
            MessageFactory.createMessageFromBuffer(builder.getMessage()),
            networkType,
            isEmbedded ? new UInt64([0, 0]) : new UInt64((builder as TransferTransactionBuilder).fee.amount),
            signature,
            signerPublicKey.match(`^[0]+$`) ? undefined : PublicAccount.createFromPublicKey(signerPublicKey, networkType),
        );
        return isEmbedded ? transaction.toAggregate(PublicAccount.createFromPublicKey(signerPublicKey, networkType)) : transaction;
    }

    /**
     * Validate Transfer transaction creation with provided message
     * @internal
     */
    protected validate(): void {
        if (this.message?.type === MessageType.PersistentHarvestingDelegationMessage) {
            if (this.mosaics.length > 0) {
                throw new Error('PersistentDelegationRequestTransaction should be created without Mosaic');
            } else if (!/^[0-9a-fA-F]{264}$/.test(this.message.payload)) {
                throw new Error('PersistentDelegationRequestTransaction message is invalid');
            }
        }
    }

    /**
     * Return the string notation for the set recipient
     * @internal
     * @returns {string}
     */
    public recipientToString(): string {
        if (this.recipientAddress instanceof NamespaceId) {
            // namespaceId recipient, return hexadecimal notation
            return (this.recipientAddress as NamespaceId).toHex();
        }

        // address recipient
        return (this.recipientAddress as Address).plain();
    }

    /**
     * Return sorted mosaic arrays
     * @internal
     * @returns {Mosaic[]}
     */
    public sortMosaics(): Mosaic[] {
        return this.mosaics.sort((a, b) => {
            const long_a = Long.fromBits(a.id.id.lower, a.id.id.higher, true);
            const long_b = Long.fromBits(b.id.id.lower, b.id.id.higher, true);
            return long_a.compare(long_b);
        });
    }

    /**
     * Return message buffer
     * @internal
     * @returns {Uint8Array}
     */
    public getMessageBuffer(): Uint8Array {
        if (!this.message || !this.message.payload) {
            return Uint8Array.of();
        }
        const messgeHex =
            this.message.type === MessageType.PersistentHarvestingDelegationMessage
                ? this.message.payload
                : Convert.utf8ToHex(this.message.payload);
        const payloadBuffer = Convert.hexToUint8(messgeHex);
        const typeBuffer = GeneratorUtils.uintToBuffer(this.message.type, 1);
        return this.message.type === MessageType.PersistentHarvestingDelegationMessage || !this.message.payload
            ? payloadBuffer
            : GeneratorUtils.concatTypedArrays(typeBuffer, payloadBuffer);
    }

    /**
     * @internal
     * @returns {TransactionBuilder}
     */
    protected createBuilder(): TransactionBuilder {
        return new TransferTransactionBuilder(
            this.getSignatureAsBuilder(),
            this.getSignerAsBuilder(),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.TRANSFER.valueOf(),
            new AmountDto(this.maxFee.toDTO()),
            new TimestampDto(this.deadline.toDTO()),
            new UnresolvedAddressDto(this.recipientAddress.encodeUnresolvedAddress(this.networkType)),
            this.sortMosaics().map((mosaic) => {
                return new UnresolvedMosaicBuilder(new UnresolvedMosaicIdDto(mosaic.id.id.toDTO()), new AmountDto(mosaic.amount.toDTO()));
            }),
            this.getMessageBuffer(),
        );
    }

    /**
     * @internal
     * @returns {EmbeddedTransactionBuilder}
     */
    public toEmbeddedTransaction(): EmbeddedTransactionBuilder {
        return new EmbeddedTransferTransactionBuilder(
            this.getSignerAsBuilder(),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.TRANSFER.valueOf(),
            new UnresolvedAddressDto(this.recipientAddress.encodeUnresolvedAddress(this.networkType)),
            this.sortMosaics().map((mosaic) => {
                return new UnresolvedMosaicBuilder(new UnresolvedMosaicIdDto(mosaic.id.id.toDTO()), new AmountDto(mosaic.amount.toDTO()));
            }),
            this.getMessageBuffer(),
        );
    }

    /**
     * @internal
     * @param statement Block receipt statement
     * @param aggregateTransactionIndex Transaction index for aggregated transaction
     * @returns {TransferTransaction}
     */
    public resolveAliases(statement: Statement, aggregateTransactionIndex = 0): TransferTransaction {
        const transactionInfo = this.checkTransactionHeightAndIndex();
        return DtoMapping.assign(this, {
            recipientAddress: statement.resolveAddress(
                this.recipientAddress,
                transactionInfo.height.toString(),
                transactionInfo.index,
                aggregateTransactionIndex,
            ),
            mosaics: this.mosaics.map((mosaic) =>
                statement.resolveMosaic(mosaic, transactionInfo.height.toString(), transactionInfo.index, aggregateTransactionIndex),
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
        return super.isSigned(address) || this.recipientAddress.equals(address);
    }
}
