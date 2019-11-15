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

import { ClientResponse } from 'http';
import {from as observableFrom, Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {AccountInfo} from '../model/account/AccountInfo';
import { ActivityBucket } from '../model/account/ActivityBucket';
import {Address} from '../model/account/Address';
import {Mosaic} from '../model/mosaic/Mosaic';
import {MosaicId} from '../model/mosaic/MosaicId';
import {AggregateTransaction} from '../model/transaction/AggregateTransaction';
import {Transaction} from '../model/transaction/Transaction';
import { UInt64 } from '../model/UInt64';
import {AccountRepository} from './AccountRepository';
import { AccountInfoDTO,
         AccountRoutesApi,
         TransactionInfoDTO } from './api';
import {Http} from './Http';
import {NetworkHttp} from './NetworkHttp';
import {QueryParams} from './QueryParams';
import {CreateTransactionFromDTO} from './transaction/CreateTransactionFromDTO';

/**
 * Account http repository.
 *
 * @since 1.0
 */
export class AccountHttp extends Http implements AccountRepository {
    /**
     * @internal
     * Nem2 Library account routes api
     */
    private accountRoutesApi: AccountRoutesApi;

    /**
     * Constructor
     * @param url
     * @param networkHttp
     */
    constructor(url: string, networkHttp?: NetworkHttp) {
        networkHttp = networkHttp == null ? new NetworkHttp(url) : networkHttp;
        super(networkHttp);
        this.accountRoutesApi = new AccountRoutesApi(url);
    }

    /**
     * Gets an AccountInfo for an account.
     * @param address Address
     * @returns Observable<AccountInfo>
     */
    public getAccountInfo(address: Address): Observable<AccountInfo> {
        return observableFrom(this.accountRoutesApi.getAccountInfo(address.plain())).pipe(
            map((response: { response: ClientResponse; body: AccountInfoDTO; }) => {
                const accountInfoDTO = response.body;
                return new AccountInfo(
                    Address.createFromEncoded(accountInfoDTO.account.address),
                    UInt64.fromNumericString(accountInfoDTO.account.addressHeight),
                    accountInfoDTO.account.publicKey,
                    UInt64.fromNumericString(accountInfoDTO.account.publicKeyHeight),
                    accountInfoDTO.account.accountType.valueOf(),
                    accountInfoDTO.account.linkedAccountKey,
                    accountInfoDTO.account.activityBuckets.map((bucket) => {
                        return new ActivityBucket(
                            bucket.startHeight,
                            bucket.totalFeesPaid,
                            bucket.beneficiaryCount,
                            bucket.rawScore,
                        );
                    }),
                    accountInfoDTO.account.mosaics.map((mosaicDTO) => new Mosaic(
                        new MosaicId(mosaicDTO.id),
                        UInt64.fromNumericString(mosaicDTO.amount),
                    )),
                    UInt64.fromNumericString(accountInfoDTO.account.importance),
                    UInt64.fromNumericString(accountInfoDTO.account.importanceHeight),
                );
            }),
            catchError((error) =>  throwError(this.errorHandling(error))),
        );
    }

    /**
     * Gets AccountsInfo for different accounts.
     * @param addresses List of Address
     * @returns Observable<AccountInfo[]>
     */
    public getAccountsInfo(addresses: Address[]): Observable<AccountInfo[]> {
        const accountIdsBody = {
            addresses: addresses.map((address) => address.plain()),
        };
        return observableFrom(
            this.accountRoutesApi.getAccountsInfo(accountIdsBody)).pipe(
                map((response: { response: ClientResponse; body: AccountInfoDTO[]; }) => {
                    const accountsInfoMetaDataDTO = response.body;
                    return accountsInfoMetaDataDTO.map((accountInfoDTO: AccountInfoDTO) => {
                        return new AccountInfo(
                            Address.createFromEncoded(accountInfoDTO.account.address),
                            UInt64.fromNumericString(accountInfoDTO.account.addressHeight),
                            accountInfoDTO.account.publicKey,
                            UInt64.fromNumericString(accountInfoDTO.account.publicKeyHeight),
                            accountInfoDTO.account.accountType.valueOf(),
                            accountInfoDTO.account.linkedAccountKey,
                            accountInfoDTO.account.activityBuckets.map((bucket) => {
                                return new ActivityBucket(
                                    bucket.startHeight,
                                    bucket.totalFeesPaid,
                                    bucket.beneficiaryCount,
                                    bucket.rawScore,
                                );
                            }),
                            accountInfoDTO.account.mosaics.map((mosaicDTO) => new Mosaic(
                                new MosaicId(mosaicDTO.id),
                                UInt64.fromNumericString(mosaicDTO.amount),
                            )),
                            UInt64.fromNumericString(accountInfoDTO.account.importance),
                            UInt64.fromNumericString(accountInfoDTO.account.importanceHeight),
                        );

                    });
                }),
                catchError((error) =>  throwError(this.errorHandling(error))),
        );
    }

    /**
     * Gets an array of confirmed transactions for which an account is signer or receiver.
     * @param address - * Address can be created rawAddress or publicKey
     * @param queryParams - (Optional) Query params
     * @returns Observable<Transaction[]>
     */
    public getAccountTransactions(address: Address, queryParams?: QueryParams): Observable<Transaction[]> {
        return observableFrom(
            this.accountRoutesApi.getAccountTransactions(address.plain(),
                                               this.queryParams(queryParams).pageSize,
                                               this.queryParams(queryParams).id,
                                               this.queryParams(queryParams).order)).pipe(
            map((response: { response: ClientResponse; body: TransactionInfoDTO[]; }) => {
                const transactionsDTO = response.body;
                return transactionsDTO.map((transactionDTO) => {
                    return CreateTransactionFromDTO(transactionDTO);
                });
            }),
            catchError((error) =>  throwError(this.errorHandling(error))),
        );
    }

    /**
     * Gets an array of transactions for which an account is the recipient of a transaction.
     * A transaction is said to be incoming with respect to an account if the account is the recipient of a transaction.
     * @param address - * Address can be created rawAddress or publicKey
     * @param queryParams - (Optional) Query params
     * @returns Observable<Transaction[]>
     */
    public getAccountIncomingTransactions(address: Address, queryParams?: QueryParams): Observable <Transaction[]> {
        return observableFrom(
            this.accountRoutesApi.getAccountIncomingTransactions(address.plain(),
                this.queryParams(queryParams).pageSize,
                this.queryParams(queryParams).id,
                this.queryParams(queryParams).order)).pipe(
                    map((response: { response: ClientResponse; body: TransactionInfoDTO[]; }) => {
                        const transactionsDTO = response.body;
                        return transactionsDTO.map((transactionDTO) => {
                            return CreateTransactionFromDTO(transactionDTO);
                        });
                    }),
                    catchError((error) =>  throwError(this.errorHandling(error))),
        );
    }

    /**
     * Gets an array of transactions for which an account is the sender a transaction.
     * A transaction is said to be outgoing with respect to an account if the account is the sender of a transaction.
     * @param address - * Address can be created rawAddress or publicKey
     * @param queryParams - (Optional) Query params
     * @returns Observable<Transaction[]>
     */
    public getAccountOutgoingTransactions(address: Address, queryParams?: QueryParams): Observable <Transaction[]> {
        return observableFrom(
            this.accountRoutesApi.getAccountOutgoingTransactions(address.plain(),
                this.queryParams(queryParams).pageSize,
                this.queryParams(queryParams).id,
                this.queryParams(queryParams).order)).pipe(
                    map((response: { response: ClientResponse; body: TransactionInfoDTO[]; }) => {
                        const transactionsDTO = response.body;
                        return transactionsDTO.map((transactionDTO) => {
                            return CreateTransactionFromDTO(transactionDTO);
                        });
                    }),
                    catchError((error) =>  throwError(this.errorHandling(error))),
                );
    }

    /**
     * Gets the array of transactions for which an account is the sender or receiver and which have not yet been included in a block.
     * Unconfirmed transactions are those transactions that have not yet been included in a block.
     * Unconfirmed transactions are not guaranteed to be included in any block.
     * @param address - * Address can be created rawAddress or publicKey
     * @param queryParams - (Optional) Query params
     * @returns Observable<Transaction[]>
     */
    public getAccountUnconfirmedTransactions(address: Address, queryParams?: QueryParams): Observable <Transaction[]> {
        return observableFrom(
            this.accountRoutesApi.getAccountUnconfirmedTransactions(address.plain(),
                this.queryParams(queryParams).pageSize,
                this.queryParams(queryParams).id,
                this.queryParams(queryParams).order)).pipe(
                    map((response: { response: ClientResponse; body: TransactionInfoDTO[]; }) => {
                        const transactionsDTO = response.body;
                        return transactionsDTO.map((transactionDTO) => {
                            return CreateTransactionFromDTO(transactionDTO);
                        });
                    }),
                    catchError((error) =>  throwError(this.errorHandling(error))),
                );
    }

    /**
     * Gets an array of transactions for which an account is the sender or has sign the transaction.
     * A transaction is said to be aggregate bonded with respect to an account if there are missing signatures.
     * @param address - * Address can be created rawAddress or publicKey
     * @param queryParams - (Optional) Query params
     * @returns Observable<AggregateTransaction[]>
     */
    public getAccountPartialTransactions(address: Address, queryParams?: QueryParams): Observable <AggregateTransaction[]> {
        return observableFrom(
            this.accountRoutesApi.getAccountPartialTransactions(address.plain(),
                this.queryParams(queryParams).pageSize,
                this.queryParams(queryParams).id,
                this.queryParams(queryParams).order)).pipe(
                    map((response: { response: ClientResponse; body: TransactionInfoDTO[]; }) => {
                        const transactionsDTO = response.body;
                        return transactionsDTO.map((transactionDTO) => {
                            return CreateTransactionFromDTO(transactionDTO) as AggregateTransaction;
                        });
                    }),
                    catchError((error) =>  throwError(this.errorHandling(error))),
                );
    }
}
