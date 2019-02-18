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

import { HashLockTransaction, VerifiableTransaction } from 'nem2-library';
import { PublicAccount } from '../account/PublicAccount';
import { NetworkType } from '../blockchain/NetworkType';
import { Mosaic } from '../mosaic/Mosaic';
import { UInt64 } from '../UInt64';
import { Deadline } from './Deadline';
import { SignedTransaction } from './SignedTransaction';
import { Transaction } from './Transaction';
import { TransactionInfo } from './TransactionInfo';
import { TransactionType } from './TransactionType';
import { TransactionVersion } from './TransactionVersion';

/**
 * Lock funds transaction is used before sending an Aggregate bonded transaction, as a deposit to announce the transaction.
 * When aggregate bonded transaction is confirmed funds are returned to LockFundsTransaction signer.
 *
 * @since 1.0
 */
export class LockFundsTransaction extends Transaction {

    /**
     * Aggregate bonded hash.
     */
    public readonly hash: string;

    /**
     * Create a Lock funds transaction object
     * @param deadline - The deadline to include the transaction.
     * @param mosaic - The locked mosaic.
     * @param duration - The funds lock duration.
     * @param signedTransaction - The signed transaction for which funds are locked.
     * @param networkType - The network type.
     */
    public static create(deadline: Deadline,
                         mosaic: Mosaic,
                         duration: UInt64,
                         signedTransaction: SignedTransaction,
                         networkType: NetworkType): LockFundsTransaction {
        return new LockFundsTransaction(
            networkType,
            TransactionVersion.LOCK,
            deadline,
            UInt64.fromUint(0),
            mosaic,
            duration,
            signedTransaction,
        );
    }

    /**
     * @param networkType
     * @param version
     * @param deadline
     * @param fee
     * @param mosaic
     * @param duration
     * @param signedTransaction
     * @param signature
     * @param signer
     * @param transactionInfo
     */
    constructor(networkType: NetworkType,
                version: number,
                deadline: Deadline,
                fee: UInt64,
                /**
                 * The locked mosaic.
                 */
                public readonly mosaic: Mosaic,
                /**
                 * The funds lock duration.
                 */
                public readonly duration: UInt64,
                signedTransaction: SignedTransaction,
                signature?: string,
                signer?: PublicAccount,
                transactionInfo?: TransactionInfo) {
        super(TransactionType.LOCK, networkType, version, deadline, fee, signature, signer, transactionInfo);
        this.hash = signedTransaction.hash;
        if (signedTransaction.type !== TransactionType.AGGREGATE_BONDED) {
            throw new Error('Signed transaction must be Aggregate Bonded Transaction');
        }
    }

    /**
     * @internal
     * @return {VerifiableTransaction}
     */
    protected buildTransaction(): VerifiableTransaction {
        return new HashLockTransaction.Builder()
            .addDeadline(this.deadline.toDTO())
            .addType(this.type)
            .addFee(this.fee.toDTO())
            .addVersion(this.versionToDTO())
            .addMosaicId(this.mosaic.id.id.toDTO())
            .addMosaicAmount(this.mosaic.amount.toDTO())
            .addDuration(this.duration.toDTO())
            .addHash(this.hash)
            .build();
    }

}
