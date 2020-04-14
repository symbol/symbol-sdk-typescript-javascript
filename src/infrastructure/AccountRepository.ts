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
import { AccountInfo } from '../model/account/AccountInfo';
import { Address } from '../model/account/Address';
import { AggregateTransaction } from '../model/transaction/AggregateTransaction';
import { Transaction } from '../model/transaction/Transaction';
import { QueryParams } from './QueryParams';
import { TransactionFilter } from './TransactionFilter';

/**
 * Account interface repository.
 *
 * @since 1.0
 */
export interface AccountRepository {
    /**
     * Gets an AccountInfo for an account.
     * @param address Address
     * @returns Observable<AccountInfo>
     */
    getAccountInfo(address: Address): Observable<AccountInfo>;

    /**
     * Gets AccountsInfo for different accounts.
     * @param addresses List of Address
     * @returns Observable<AccountInfo[]>
     */
    getAccountsInfo(addresses: Address[]): Observable<AccountInfo[]>;

    /**
     * Gets an array of confirmed transactions for which an account is signer or receiver.
     * @param address - * Address can be created rawAddress or publicKey
     * @param queryParams - (Optional) Query params
     * @param transactionFilter - (Optional) Transaction fitler
     * @returns Observable<Transaction[]>
     */
    getAccountTransactions(address: Address, queryParams?: QueryParams, transactionFilter?: TransactionFilter): Observable<Transaction[]>;

    /**
     * Gets an array of transactions for which an account is the recipient of a transaction.
     * A transaction is said to be incoming with respect to an account if the account is the recipient of a transaction.
     * @param address - * Address can be created rawAddress or publicKey
     * @param queryParams - (Optional) Query params
     * @param transactionFilter - (Optional) Transaction fitler
     * @returns Observable<Transaction[]>
     */
    getAccountIncomingTransactions(
        address: Address,
        queryParams?: QueryParams,
        transactionFilter?: TransactionFilter,
    ): Observable<Transaction[]>;

    /**
     * Gets an array of transactions for which an account is the sender a transaction.
     * A transaction is said to be outgoing with respect to an account if the account is the sender of a transaction.
     * @param address - * Address can be created rawAddress or publicKey
     * @param queryParams - (Optional) Query params
     * @param transactionFilter - (Optional) Transaction fitler
     * @returns Observable<Transaction[]>
     */
    getAccountOutgoingTransactions(
        address: Address,
        queryParams?: QueryParams,
        transactionFilter?: TransactionFilter,
    ): Observable<Transaction[]>;

    /**
     * Gets the array of transactions for which an account is the sender or receiver and which have not yet been included in a block.
     * Unconfirmed transactions are those transactions that have not yet been included in a block.
     * Unconfirmed transactions are not guaranteed to be included in any block.
     * @param address - * Address can be created rawAddress or publicKey
     * @param queryParams - (Optional) Query params
     * @param transactionFilter - (Optional) Transaction fitler
     * @returns Observable<Transaction[]>
     */
    getAccountUnconfirmedTransactions(
        address: Address,
        queryParams?: QueryParams,
        transactionFilter?: TransactionFilter,
    ): Observable<Transaction[]>;

    /**
     * Gets an array of transactions for which an account is the sender or has sign the transaction.
     * A transaction is said to be aggregate bonded with respect to an account if there are missing signatures.
     * @param address - * Address can be created rawAddress or publicKey
     * @param queryParams - (Optional) Query params
     * @param transactionFilter - (Optional) Transaction fitler
     * @returns Observable<AggregateTransaction[]>
     */
    getAccountPartialTransactions(
        address: Address,
        queryParams?: QueryParams,
        transactionFilter?: TransactionFilter,
    ): Observable<AggregateTransaction[]>;
}
