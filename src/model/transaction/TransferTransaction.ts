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
import { Builder } from '../../infrastructure/builders/TransferTransaction';
import {VerifiableTransaction} from '../../infrastructure/builders/VerifiableTransaction';
import { AmountDto } from '../../infrastructure/catbuffer/AmountDto';
import { EmbeddedTransferTransactionBuilder } from '../../infrastructure/catbuffer/EmbeddedTransferTransactionBuilder';
import { EntityTypeDto } from '../../infrastructure/catbuffer/EntityTypeDto';
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
import { NamespaceId } from '../namespace/NamespaceId';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { Message } from './Message';
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
     * @param recipient - The recipient of the transaction.
     * @param mosaics - The array of mosaics.
     * @param message - The transaction message.
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {TransferTransaction}
     */
    public static create(deadline: Deadline,
                         recipient: Address | NamespaceId,
                         mosaics: Mosaic[],
                         message: Message,
                         networkType: NetworkType,
                         maxFee: UInt64 = new UInt64([0, 0])): TransferTransaction {
        return new TransferTransaction(networkType,
            TransactionVersion.TRANSFER,
            deadline,
            maxFee,
            recipient,
            mosaics,
            message);
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param maxFee
     * @param recipient
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
                 * The address of the recipient.
                 */
                public readonly recipient: Address | NamespaceId,
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
     * Return the string notation for the set recipient
     * @internal
     * @returns {string}
     */
    public recipientToString(): string {

        if (this.recipient instanceof NamespaceId) {
            // namespaceId recipient, return hexadecimal notation
            return (this.recipient as NamespaceId).toHex();
        }

        // address recipient
        return (this.recipient as Address).plain();
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
     * @override Transaction.size()
     * @description get the byte size of a TransferTransaction
     * @returns {number}
     * @memberof TransferTransaction
     */
    public get size(): number {
        const byteSize = super.size;

        // recipient and number of mosaics are static byte size
        const byteRecipient = 25;
        const byteNumMosaics = 2;

        // read message payload size
        const bytePayload = convert.hexToUint8(convert.utf8ToHex(this.message.payload)).length;

        // mosaicId / namespaceId are written on 8 bytes
        const byteMosaics = 8 * this.mosaics.length;

        return byteSize + byteRecipient + byteNumMosaics + bytePayload + byteMosaics;
    }

    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    protected buildTransaction(): VerifiableTransaction {
        return new Builder()
            .addDeadline(this.deadline.toDTO())
            .addFee(this.maxFee.toDTO())
            .addVersion(this.versionToDTO())
            .addRecipient(this.recipientToString())
            .addMosaics(this.mosaics.map((mosaic) => mosaic.toDTO()))
            .addMessage(this.message)
            .build();
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
            new UnresolvedAddressDto(RawAddress.stringToAddress(this.recipientToString())),
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
        const signerBuffer = new Uint8Array(32);
        const transactionBuilder = new EmbeddedTransferTransactionBuilder(
            new KeyDto(signerBuffer),
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
