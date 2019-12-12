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

import { Observable } from 'rxjs';
import { Listener } from '../../infrastructure/Listener';
import { AggregateTransaction } from '../../model/transaction/AggregateTransaction';
import { SignedTransaction } from '../../model/transaction/SignedTransaction';
import { Transaction } from '../../model/transaction/Transaction';

/**
 * Transaction Service Interface
 */
export interface ITransactionService {

    /**
     * @param transationHashes List of transaction hashes.
     * @returns {Observable<Transaction[]>}
     */
    resolveAliases(transationHashes: string[]): Observable<Transaction[]>;

    /**
     * @param signedTransaction Signed transaction to be announced.
     * @param listener Websocket listener
     * @returns {Observable<Transaction>}
     */
    announce(signedTransaction: SignedTransaction, listener: Listener): Observable<Transaction>;

    /**
     * Announce aggregate transaction
     * @param signedTransaction Signed aggregate bonded transaction.
     * @param listener Websocket listener
     * @returns {Observable<AggregateTransaction>}
     */
    announceAggregateBonded(signedTransaction: SignedTransaction, listener: Listener): Observable<AggregateTransaction>;

    /**
     * Announce aggregate bonded transaction with lock fund
     * @param signedHashLockTransaction Signed hash lock transaction.
     * @param signedAggregateTransaction Signed aggregate bonded transaction.
     * @param listener Websocket listener
     * @returns {Observable<AggregateTransaction>}
     */
    announceHashLockAggregateBonded(signedHashLockTransaction: SignedTransaction,
                                    signedAggregateTransaction: SignedTransaction,
                                    listener: Listener): Observable<AggregateTransaction>;
}
