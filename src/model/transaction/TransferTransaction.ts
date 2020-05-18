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
    KeyDto,
    SignatureDto,
    TimestampDto,
    TransferTransactionBuilder,
    UnresolvedAddressDto,
    UnresolvedMosaicBuilder,
    UnresolvedMosaicIdDto,
} from 'catbuffer-typescript';
import * as Long from 'long';
import { Convert } from '../../core/format';
import { DtoMapping } from '../../core/utils/DtoMapping';
import { UnresolvedMapping } from '../../core/utils/UnresolvedMapping';
import { Address } from '../account/Address';
import { PublicAccount } from '../account/PublicAccount';
import { EncryptedMessage } from '../message/EncryptedMessage';
import { Message } from '../message/Message';
import { MessageType } from '../message/MessageType';
import { PlainMessage } from '../message/PlainMessage';
import { Mosaic } from '../mosaic/Mosaic';
import { NamespaceId } from '../namespace/NamespaceId';
import { NetworkType } from '../network/NetworkType';
import { Statement } from '../receipt/Statement';
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
     * @returns {TransferTransaction}
     */
    public static create(
        deadline: Deadline,
        recipientAddress: Address | NamespaceId,
        mosaics: Mosaic[],
        message: Message,
        networkType: NetworkType,
        maxFee: UInt64 = new UInt64([0, 0]),
    ): TransferTransaction {
        return new TransferTransaction(networkType, TransactionVersion.TRANSFER, deadline, maxFee, recipientAddress, mosaics, message);
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
        public readonly recipientAddress: Address | NamespaceId,
        /**
         * The array of Mosaic objects.
         */
        public readonly mosaics: Mosaic[],
        /**
         * The transaction message of 2048 characters.
         */
        public readonly message: Message,
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
        const messageType = builder.getMessage()[0];
        const messageHex = Convert.uint8ToHex(builder.getMessage()).substring(2);
        const signerPublicKey = Convert.uint8ToHex(builder.getSignerPublicKey().key);
        const networkType = builder.getNetwork().valueOf();
        const transaction = TransferTransaction.create(
            isEmbedded ? Deadline.create() : Deadline.createFromDTO((builder as TransferTransactionBuilder).getDeadline().timestamp),
            UnresolvedMapping.toUnresolvedAddress(Convert.uint8ToHex(builder.getRecipientAddress().unresolvedAddress)),
            builder.getMosaics().map((mosaic) => {
                const id = new UInt64(mosaic.mosaicId.unresolvedMosaicId).toHex();
                return new Mosaic(UnresolvedMapping.toUnresolvedMosaic(id), new UInt64(mosaic.amount.amount));
            }),
            messageType === MessageType.PlainMessage
                ? PlainMessage.createFromPayload(messageHex)
                : EncryptedMessage.createFromPayload(messageHex),
            networkType,
            isEmbedded ? new UInt64([0, 0]) : new UInt64((builder as TransferTransactionBuilder).fee.amount),
        );
        return isEmbedded ? transaction.toAggregate(PublicAccount.createFromPublicKey(signerPublicKey, networkType)) : transaction;
    }

    /**
     * Validate Transfer transaction creation with provided message
     * @internal
     */
    protected validate(): void {
        if (this.message.type === MessageType.PersistentHarvestingDelegationMessage) {
            if (this.mosaics.length > 0) {
                throw new Error('PersistentDelegationRequestTransaction should be created without Mosaic');
            } else if (!/^[0-9a-fA-F]{208}$/.test(this.message.payload)) {
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
        const messgeHex =
            this.message.type === MessageType.PersistentHarvestingDelegationMessage
                ? this.message.payload
                : Convert.utf8ToHex(this.message.payload);
        const payloadBuffer = Convert.hexToUint8(messgeHex);
        const typeBuffer = GeneratorUtils.uintToBuffer(this.message.type, 1);
        return this.message.type === MessageType.PersistentHarvestingDelegationMessage
            ? payloadBuffer
            : GeneratorUtils.concatTypedArrays(typeBuffer, payloadBuffer);
    }

    /**
     * @override Transaction.size()
     * @description get the byte size of a TransferTransaction
     * @returns {number}
     * @memberof TransferTransaction
     */
    public get size(): number {
        const byteSize = super.size;

        // recipient and number of mosaics are static byte size
        const byteRecipientAddress = 25;
        const byteMosaicsCount = 1;
        const byteMessageSize = 2;
        const byteTransferTransactionBody_Reserved1 = 4;

        // read message payload size
        const bytePayload = this.getMessageBuffer().length;

        // mosaicId / namespaceId are written on 8 bytes + 8 bytes for the amount.
        const byteMosaics = (8 + 8) * this.mosaics.length;

        return (
            byteSize +
            byteMosaicsCount +
            byteRecipientAddress +
            +byteTransferTransactionBody_Reserved1 +
            byteMessageSize +
            bytePayload +
            byteMosaics
        );
    }

    /**
     * @internal
     * @returns {Uint8Array}
     */
    protected generateBytes(): Uint8Array {
        const signerBuffer = new Uint8Array(32);
        const signatureBuffer = new Uint8Array(64);

        const transactionBuilder = new TransferTransactionBuilder(
            new SignatureDto(signatureBuffer),
            new KeyDto(signerBuffer),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.TRANSFER.valueOf(),
            new AmountDto(this.maxFee.toDTO()),
            new TimestampDto(this.deadline.toDTO()),
            new UnresolvedAddressDto(UnresolvedMapping.toUnresolvedAddressBytes(this.recipientAddress, this.networkType)),
            this.sortMosaics().map((mosaic) => {
                return new UnresolvedMosaicBuilder(new UnresolvedMosaicIdDto(mosaic.id.id.toDTO()), new AmountDto(mosaic.amount.toDTO()));
            }),
            this.getMessageBuffer(),
        );
        return transactionBuilder.serialize();
    }

    /**
     * @internal
     * @returns {EmbeddedTransactionBuilder}
     */
    public toEmbeddedTransaction(): EmbeddedTransactionBuilder {
        return new EmbeddedTransferTransactionBuilder(
            new KeyDto(Convert.hexToUint8(this.signer!.publicKey)),
            this.versionToDTO(),
            this.networkType.valueOf(),
            TransactionType.TRANSFER.valueOf(),
            new UnresolvedAddressDto(UnresolvedMapping.toUnresolvedAddressBytes(this.recipientAddress, this.networkType)),
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
     * @param alias address alias (names)
     * @returns {boolean}
     */
    public NotifyAccount(address: Address, alias: NamespaceId[]): boolean {
        return (
            (this.signer !== undefined && this.signer!.address.equals(address)) ||
            (this.recipientAddress as Address).equals(address) ||
            alias.find((name) => (this.recipientAddress as NamespaceId).equals(name)) !== undefined
        );
    }
}
