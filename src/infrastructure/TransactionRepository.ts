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
import { CosignatureSignedTransaction } from '../model/transaction/CosignatureSignedTransaction';
import { SignedTransaction } from '../model/transaction/SignedTransaction';
import { Transaction } from '../model/transaction/Transaction';
import { TransactionAnnounceResponse } from '../model/transaction/TransactionAnnounceResponse';
import { TransactionStatus } from '../model/transaction/TransactionStatus';
import { Page } from './Page';
import { TransactionSearchCriteria } from './TransactionSearchCriteria';

/**
 * Transaction interface repository.
 *
 * @since 1.0
 */
export interface TransactionRepository {
    /**
     * Gets a transaction for a transactionId
     * @param transactionId - Transaction id or hash.
     * @returns Observable<Transaction>
     */
    getTransaction(transactionId: string): Observable<Transaction>;

    /**
     * Gets an array of transactions for different transaction ids
     * @param transactionIds - Array of transactions id and/or hash.
     * @returns Observable<Transaction[]>
     */
    getTransactionsById(transactionIds: string[]): Observable<Transaction[]>;

    /**
     * Gets a transaction status for a transaction hash
     * @param transactionHash - Transaction hash.
     * @returns Observable<TransactionStatus>
     */
    getTransactionStatus(transactionHash: string): Observable<TransactionStatus>;

    /**
     * Gets an array of transaction status for different transaction hashes
     * @param transactionHashes - Array of transaction hash
     * @returns Observable<TransactionStatus[]>
     */
    getTransactionsStatuses(transactionHashes: string[]): Observable<TransactionStatus[]>;

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

    /**
     * Search transactions based on the criteria's filtering and sorting returning a page.
     *
     * @param criteria the criteria
     * @return a page of transactions.
     */
    searchTransactions(criteria: TransactionSearchCriteria): Observable<Page<Transaction>>;
}
