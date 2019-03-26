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

import { VerifiableTransaction } from 'nem2-library';
import { SerializeTransactionToJSON } from '../../infrastructure/transaction/SerializeTransactionToJSON';
import { Account } from '../account/Account';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { AggregateTransactionInfo } from './AggregateTransactionInfo';
import { Deadline } from './Deadline';
import { InnerTransaction } from './InnerTransaction';
import { SignedTransaction } from './SignedTransaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';

/**
 * An abstract transaction class that serves as the base class of all NEM transactions.
 */
export abstract class Transaction {

    /**
     * @constructor
     * @param type
     * @param networkType
     * @param version
     * @param deadline
     * @param fee
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(/**
                 * The transaction type.
                 */
                public readonly type: number,
                /**
                 * The network type.
                 */
                public readonly networkType: NetworkType,
                /**
                 * The transaction version number.
                 */
                public readonly version: number,
                /**
                 * The deadline to include the transaction.
                 */
                public readonly deadline: Deadline,
                /**
                 * The fee for the transaction. The higher the fee, the higher the priority of the transaction.
                 * Transactions with high priority get included in a block before transactions with lower priority.
                 */
                public readonly fee: UInt64,
                /**
                 * The transaction signature (missing if part of an aggregate transaction).
                 */
                public readonly signature?: string,
                /**
                 * The account of the transaction creator.
                 */
                public readonly signer?: PublicAccount,
                /**
                 * Transactions meta data object contains additional information about the transaction.
                 */
                public readonly transactionInfo?: TransactionInfo | AggregateTransactionInfo) {
    }

    /**
     * @internal
     * Serialize and sign transaction creating a new SignedTransaction
     * @param account - The account to sign the transaction
     * @returns {SignedTransaction}
     */
    public signWith(account: Account): SignedTransaction {
        const transaction = this.buildTransaction();
        const signedTransactionRaw = transaction.signTransaction(account);
        return new SignedTransaction(
            signedTransactionRaw.payload,
            signedTransactionRaw.hash,
            account.publicKey,
            this.type,
            this.networkType);
    }

    /**
     * @internal
     */
    protected abstract buildTransaction(): VerifiableTransaction;

    /**
     * @internal
     * @returns {Array<number>}
     */
    public aggregateTransaction(): number[] {
        return this.buildTransaction().toAggregateTransaction(this.signer!.publicKey);
    }

    /**
     * Convert an aggregate transaction to an inner transaction including transaction signer.
     * @param signer - Transaction signer.
     * @returns InnerTransaction
     */
    public toAggregate(signer: PublicAccount): InnerTransaction {
        if (this.type === TransactionType.AGGREGATE_BONDED || this.type === TransactionType.AGGREGATE_COMPLETE) {
            throw new Error('Inner transaction cannot be an aggregated transaction.');
        }
        return Object.assign({__proto__: Object.getPrototypeOf(this)}, this, {signer});
    }

    /**
     * Transaction pending to be included in a block
     * @returns {boolean}
     */
    public isUnconfirmed(): boolean {
        return this.transactionInfo != null && this.transactionInfo.height.compact() === 0
            && this.transactionInfo.hash === this.transactionInfo.merkleComponentHash;
    }

    /**
     * Transaction included in a block
     * @returns {boolean}
     */
    public isConfirmed(): boolean {
        return this.transactionInfo != null && this.transactionInfo.height.compact() > 0;
    }

    /**
     * Returns if a transaction has missing signatures.
     * @returns {boolean}
     */
    public hasMissingSignatures(): boolean {
        return this.transactionInfo != null && this.transactionInfo.height.compact() === 0 &&
            this.transactionInfo.hash !== this.transactionInfo.merkleComponentHash;
    }

    /**
     * Transaction is not known by the network
     * @return {boolean}
     */
    public isUnannounced(): boolean {
        return this.transactionInfo == null;
    }

    /**
     * @internal
     */
    public versionToDTO(): number {
        const versionDTO = this.networkType.toString(16) + '0' + this.version.toString(16);
        return parseInt(versionDTO, 16);
    }

    /**
     * @description reapply a given value to the transaction in an immutable way
     * @param {Deadline} deadline
     * @returns {Transaction}
     * @memberof Transaction
     */
    public reapplyGiven(deadline: Deadline = Deadline.create()): Transaction {
        if (this.isUnannounced()) {
            return Object.assign({__proto__: Object.getPrototypeOf(this)}, this, {deadline});
        }
        throw new Error('an Announced transaction can\'t be modified');
    }

    /**
     * @description Serialize a transaction object
     * @returns {string}
     * @memberof Transaction
     */
    public serialize() {
        const transaction = this.buildTransaction();
        return transaction.serializeUnsignedTransaction();
    }

    /**
     * @description Create JSON object
     * @returns {Object}
     * @memberof Transaction
     */
    public toJSON() {
        const commonTransactionObject = {
            type: this.type,
            networkType: this.networkType,
            version: this.version,
            fee: this.fee.toDTO(),
            deadline: this.deadline.toDTO(),
            signature: this.signature ? this.signature : '',
        };

        if (this.signer) {
            Object.assign(commonTransactionObject, {signer: this.signer.toDTO()});
        }

        const childClassObject = SerializeTransactionToJSON(this);

        return Object.assign(commonTransactionObject, childClassObject);
    }
}
