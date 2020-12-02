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

import { Observable } from 'rxjs';
import { CosignatureSignedTransaction, SignedTransaction, Transaction, TransactionAnnounceResponse } from '../model/transaction';
import { SearcherRepository } from './paginationStreamer';
import { TransactionSearchCriteria } from './searchCriteria';
import { TransactionGroup } from './TransactionGroup';

/**
 * Transaction interface repository.
 *
 * @since 1.0
 */
export interface TransactionRepository extends SearcherRepository<Transaction, TransactionSearchCriteria> {
    /**
     * Gets a transaction for a transactionId
     * @param transactionId - Transaction id or hash.
     * @param transactionGroup - Transaction group.
     * @returns Observable<Transaction>
     */
    getTransaction(transactionId: string, transactionGroup: TransactionGroup): Observable<Transaction>;

    /**
     * Gets an array of transactions for different transaction ids
     * @param transactionIds - Array of transactions id and/or hash.
     * @param transactionGroup - Transaction group.
     * @returns Observable<Transaction[]>
     */
    getTransactionsById(transactionIds: string[], transactionGroup: TransactionGroup): Observable<Transaction[]>;
    /**
     * Gets a transaction's effective paid fee
     * @param transactionId - Transaction id or hash.
     * @returns Observable<number>
     */
    getTransactionEffectiveFee(transactionId: string): Observable<number>;

    /**
     * Send a signed transaction
     * @param signedTransaction - Signed transaction
     * @returns Observable<TransactionAnnounceResponse>
     */
    announce(signedTransaction: SignedTransaction): Observable<TransactionAnnounceResponse>;

    /**
     * Send a signed transaction with missing signatures
     * @param signedTransaction - Signed transaction
     * @returns Observable<TransactionAnnounceResponse>
     */
    announceAggregateBonded(signedTransaction: SignedTransaction): Observable<TransactionAnnounceResponse>;

    /**
     * Send a cosignature signed transaction of an already announced transaction
     * @param cosignatureSignedTransaction - Cosignature signed transaction
     * @returns Observable<TransactionAnnounceResponse>
     */
    announceAggregateBondedCosignature(cosignatureSignedTransaction: CosignatureSignedTransaction): Observable<TransactionAnnounceResponse>;
}
