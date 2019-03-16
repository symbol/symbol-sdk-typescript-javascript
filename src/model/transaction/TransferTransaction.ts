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

import { TransferTransaction as TransferTransactionLibrary, VerifiableTransaction } from 'nem2-library';
import { Address } from '../account/Address';
import { PublicAccount } from '../account/PublicAccount';
import { Recipient } from '../account/Recipient';
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
     * @returns {TransferTransaction}
     */
    public static create(deadline: Deadline,
                         recipient: Recipient | Address | NamespaceId,
                         mosaics: Mosaic[],
                         message: Message,
                         networkType: NetworkType): TransferTransaction {
        return new TransferTransaction(networkType,
            TransactionVersion.TRANSFER,
            deadline,
            new UInt64([0, 0]),
            recipient,
            mosaics,
            message);
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param fee
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
                fee: UInt64,
                /**
                 * The address of the recipient.
                 */
                public readonly recipient: Recipient | Address | NamespaceId,
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
        super(TransactionType.TRANSFER, networkType, version, deadline, fee, signature, signer, transactionInfo);
    }

    /**
     * Return the string notation for the set recipient
     * @internal
     * @returns {string}
     */
    public recipientToString(): string {

        // handle `Recipient` wrapper class
        let recipient = this.recipient;
        if (recipient instanceof Recipient) {
            recipient = (this.recipient as Recipient).value;
        }

        if (recipient instanceof NamespaceId) {
            // namespaceId recipient, return hexadecimal notation
            return (recipient as NamespaceId).toHex();
        }

        // address recipient
        return (recipient as Address).plain();
    }

    /**
     * @internal
     * @returns {VerifiableTransaction}
     */
    protected buildTransaction(): VerifiableTransaction {
        return new TransferTransactionLibrary.Builder()
            .addDeadline(this.deadline.toDTO())
            .addFee(this.fee.toDTO())
            .addVersion(this.versionToDTO())
            .addRecipient(this.recipientToString())
            .addMosaics(this.mosaics.map((mosaic) => mosaic.toDTO()))
            .addMessage(this.message)
            .build();
    }

}
