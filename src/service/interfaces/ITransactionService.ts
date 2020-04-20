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
import { IListener } from '../../infrastructure/IListener';
import { AggregateTransaction } from '../../model/transaction/AggregateTransaction';
import { SignedTransaction } from '../../model/transaction/SignedTransaction';
import { Transaction } from '../../model/transaction/Transaction';

/**
 * Transaction Service Interface
 */
export interface ITransactionService {
    /**
     * @param transactionHashes List of transaction hashes.
     * @returns {Observable<Transaction[]>}
     */
    resolveAliases(transactionHashes: string[]): Observable<Transaction[]>;

    /**
     *
     * This method announces a transaction while waiting for being confirmed by listing to the
     * /confirmed web socket. If an error to the given transaction is sent to the /status web
     * socket, the TransactionStatusError is raised.
     *
     * Steps:
     *
     * 1) It announces the transaction to the TransactionRepository
     *
     * 2) It calls the IListener's confirmed method waiting for the transaction to be
     * confirmed.
     *
     * 3) It calls the IListener's status method waiting for an error to occurred.
     *
     * The observable will resolve the transaction from 2) or it will raise an error from 3).
     *
     * @param signedTransaction Signed transaction to be announced.
     * @param listener the web socket listener used to detect confirmed transaction or status errors
     * coming from the catapult server.
     * @returns {Observable<Transaction>}
     */
    announce(signedTransaction: SignedTransaction, listener: IListener): Observable<Transaction>;

    /**
     * This method announces an aggregate bonded transaction while waiting for being added by
     * listing to the /aggregateBondedAdded web socket. If an error to the given transaction is sent
     * to the /status web socket, the TransactionStatusError is raised.
     * is raised.
     *
     * Steps:
     *
     * 1) It announceAggregateBonded the transaction to the TransactionRepository
     *
     * 2) It calls the IListener's aggregateBondedAdded method waiting for the transaction to
     * be confirmed.
     *
     * 3) It calls the IListener's status method waiting for an error to occurred.
     *
     * The observable will resolve the transaction from 2) or it will raise an error from 3)
     *
     * @param signedTransaction Signed aggregate bonded transaction.
     * @param listener Websocket listener
     * @returns {Observable<AggregateTransaction>}
     */
    announceAggregateBonded(signedTransaction: SignedTransaction, listener: IListener): Observable<AggregateTransaction>;

    /**
     *
     * This method announces an a hash lock transaction followed by a aggregate bonded transaction
     * while waiting for being confirmed by listing to the /confirmed and /aggregateBondedAdded web
     * socket. If a status ws error is sent while processing any of the given transaction the TransactionStatusError is raised.
     *
     * Announce aggregate bonded transaction with lock fund
     * @param signedHashLockTransaction Signed hash lock transaction.
     * @param signedAggregateTransaction Signed aggregate bonded transaction.
     * @param listener Websocket listener
     * @returns {Observable<AggregateTransaction>}
     */
    announceHashLockAggregateBonded(
        signedHashLockTransaction: SignedTransaction,
        signedAggregateTransaction: SignedTransaction,
        listener: IListener,
    ): Observable<AggregateTransaction>;
}
