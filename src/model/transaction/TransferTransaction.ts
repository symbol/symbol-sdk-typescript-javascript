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

import { Convert, Convert as convert } from '../../core/format';
import { RawAddress } from '../../core/format/RawAddress';
import { AmountDto } from '../../infrastructure/catbuffer/AmountDto';
import { EmbeddedTransferTransactionBuilder } from '../../infrastructure/catbuffer/EmbeddedTransferTransactionBuilder';
import { GeneratorUtils } from '../../infrastructure/catbuffer/GeneratorUtils';
import { KeyDto } from '../../infrastructure/catbuffer/KeyDto';
import { SignatureDto } from '../../infrastructure/catbuffer/SignatureDto';
import { TimestampDto } from '../../infrastructure/catbuffer/TimestampDto';
import { TransferTransactionBuilder } from '../../infrastructure/catbuffer/TransferTransactionBuilder';
import { UnresolvedAddressDto } from '../../infrastructure/catbuffer/UnresolvedAddressDto';
import { UnresolvedMosaicBuilder } from '../../infrastructure/catbuffer/UnresolvedMosaicBuilder';
import { UnresolvedMosaicIdDto } from '../../infrastructure/catbuffer/UnresolvedMosaicIdDto';
import { Address } from '../account/Address';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { Mosaic } from '../mosaic/Mosaic';
import { MosaicId } from '../mosaic/MosaicId';
import { NamespaceId } from '../namespace/NamespaceId';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { EncryptedMessage } from './EncryptedMessage';
import { InnerTransaction } from './InnerTransaction';
import { Message } from './Message';
import { MessageType } from './MessageType';
import { PlainMessage } from './PlainMessage';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';

/**
 * Transfer transactions contain data about transfers of mosaics and message to another account.
 */
export class TransferTransaction extends Transaction {
    /**
     * Create a transfer transaction object
     * @param deadline - The deadline to include the transaction.
     * @param recipientAddress - The recipient address of the transaction.
     * @param mosaics - The array of mosaics.
     * @param message - The transaction message.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {TransferTransaction}
     */
    public static create(deadline: Deadline,
                         recipientAddress: Address | NamespaceId,
                         mosaics: Mosaic[],
                         message: Message,
                         networkType: NetworkType,
                         maxFee: UInt64 = new UInt64([0, 0])): TransferTransaction {
        return new TransferTransaction(networkType,
            TransactionVersion.TRANSFER,
            deadline,
            maxFee,
            recipientAddress,
            mosaics,
            message);
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
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                maxFee: UInt64,
                /**
                 * The address of the recipient address.
                 */
                public readonly recipientAddress: Address | NamespaceId,
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
                transactionInfo?: TransactionInfo) {
        super(TransactionType.TRANSFER, networkType, version, deadline, maxFee, signature, signer, transactionInfo);
    }

    /**
     * Create a transaction object from payload
     * @param {string} payload Binary payload
     * @param {Boolean} isEmbedded Is embedded transaction (Default: false)
     * @returns {Transaction | InnerTransaction}
     */
    public static createFromPayload(payload: string,
                                    isEmbedded: boolean = false): Transaction | InnerTransaction {
        const builder = isEmbedded ? EmbeddedTransferTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload)) :
            TransferTransactionBuilder.loadFromBinary(Convert.hexToUint8(payload));
        const messageType = builder.getMessage()[0];
        const messageHex = Convert.uint8ToHex(builder.getMessage()).substring(2);
        const signerPublicKey = Convert.uint8ToHex(builder.getSignerPublicKey().key);
        const networkType = Convert.hexToUint8(builder.getVersion().toString(16))[0];
        const transaction = TransferTransaction.create(
            isEmbedded ? Deadline.create() : Deadline.createFromDTO(
                (builder as TransferTransactionBuilder).getDeadline().timestamp),
            Address.createFromEncoded(Convert.uint8ToHex(builder.getRecipientAddress().unresolvedAddress)),
            builder.getMosaics().map((mosaic) => {
                return new Mosaic(
                    new MosaicId(mosaic.mosaicId.unresolvedMosaicId),
                    new UInt64(mosaic.amount.amount));
            }),
            messageType === MessageType.PlainMessage ?
                PlainMessage.createFromPayload(messageHex) :
                EncryptedMessage.createFromPayload(messageHex),
            networkType,
            isEmbedded ? new UInt64([0, 0]) : new UInt64((builder as TransferTransactionBuilder).fee.amount),
        );
        return isEmbedded ?
            transaction.toAggregate(PublicAccount.createFromPublicKey(signerPublicKey, networkType)) : transaction;
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
        const sortedMosaics = this.mosaics.sort((a, b) => {
            if (Number(a.id[1]) > b.id[1]) { return 1; } else if (a.id[1] < b.id[1]) { return -1; }
            return 0;
        });
        return sortedMosaics;
    }

    /**
     * Return message buffer
     * @internal
     * @returns {Uint8Array}
     */
    public getMessageBuffer(): Uint8Array {
        const payloadBuffer = Convert.hexToUint8(Convert.utf8ToHex(this.message.payload));
        const typeBuffer = GeneratorUtils.uintToBuffer(this.message.type, 1);
        return GeneratorUtils.concatTypedArrays(typeBuffer, payloadBuffer);
    }

    /**
     * Return unresolved address bytes of the recipient
     * @internal
     * @returns {string}
     */
    public getRecipientBytes(): Uint8Array {
        const recipient = this.recipientToString();
        if (/^[0-9a-fA-F]{16}$/.test(recipient)) {
            // received hexadecimal notation of namespaceId (alias)
            return RawAddress.aliasToRecipient(convert.hexToUint8(recipient));
        } else {
            // received recipient address
            return RawAddress.stringToAddress(recipient);
        }
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
        const byteNumMosaics = 2;

        // read message payload size
        const bytePayload = convert.hexToUint8(convert.utf8ToHex(this.message.payload)).length;

        // mosaicId / namespaceId are written on 8 bytes
        const byteMosaics = 8 * this.mosaics.length;

        return byteSize + byteRecipientAddress + byteNumMosaics + bytePayload + byteMosaics;
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
            TransactionType.TRANSFER.valueOf(),
            new AmountDto(this.maxFee.toDTO()),
            new TimestampDto(this.deadline.toDTO()),
            new UnresolvedAddressDto(this.getRecipientBytes()),
            this.getMessageBuffer(),
            this.sortMosaics().map((mosaic) => {
                return new UnresolvedMosaicBuilder(new UnresolvedMosaicIdDto(mosaic.id.id.toDTO()),
                                                   new AmountDto(mosaic.amount.toDTO()));
            }),
        );
        return transactionBuilder.serialize();
    }

    /**
     * @internal
     * @returns {Uint8Array}
     */
    protected generateEmbeddedBytes(): Uint8Array {
        const transactionBuilder = new EmbeddedTransferTransactionBuilder(
            new KeyDto(Convert.hexToUint8(this.signer!.publicKey)),
            this.versionToDTO(),
            TransactionType.TRANSFER.valueOf(),
            new UnresolvedAddressDto(RawAddress.stringToAddress(this.recipientToString())),
            this.getMessageBuffer(),
            this.sortMosaics().map((mosaic) => {
                return new UnresolvedMosaicBuilder(new UnresolvedMosaicIdDto(mosaic.id.id.toDTO()),
                                                   new AmountDto(mosaic.amount.toDTO()));
            }),
        );
        return transactionBuilder.serialize();
    }
}
