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
import { AccountIds, AccountInfoDTO, AccountRoutesApi } from 'symbol-openapi-typescript-node-client';
import { AccountInfo } from '../model/account/AccountInfo';
import { ActivityBucket } from '../model/account/ActivityBucket';
import { Address } from '../model/account/Address';
import { Mosaic } from '../model/mosaic/Mosaic';
import { MosaicId } from '../model/mosaic/MosaicId';
import { AggregateTransaction } from '../model/transaction/AggregateTransaction';
import { Transaction } from '../model/transaction/Transaction';
import { AccountRepository } from './AccountRepository';
import { Http } from './Http';
import { QueryParams } from './QueryParams';
import { CreateTransactionFromDTO } from './transaction/CreateTransactionFromDTO';
import { TransactionFilter } from './TransactionFilter';

/**
 * Account http repository.
 *
 * @since 1.0
 */
export class AccountHttp extends Http implements AccountRepository {
    /**
     * @internal
     * Symbol openapi typescript-node client account routes api
     */
    private accountRoutesApi: AccountRoutesApi;

    /**
     * Constructor
     * @param url
     */
    constructor(url: string) {
        super(url);
        this.accountRoutesApi = new AccountRoutesApi(url);
        this.accountRoutesApi.useQuerystring = true;
    }

    /**
     * Gets an AccountInfo for an account.
     * @param address Address
     * @returns Observable<AccountInfo>
     */
    public getAccountInfo(address: Address): Observable<AccountInfo> {
        return this.call(this.accountRoutesApi.getAccountInfo(address.plain()), (body) => this.toAccountInfo(body));
    }

    /**
     * Gets AccountsInfo for different accounts.
     * @param addresses List of Address
     * @returns Observable<AccountInfo[]>
     */
    public getAccountsInfo(addresses: Address[]): Observable<AccountInfo[]> {
        const accountIds = new AccountIds();
        accountIds.addresses = addresses.map((address) => address.plain());
        return this.call(this.accountRoutesApi.getAccountsInfo(accountIds), (body) => body.map(this.toAccountInfo));
    }

    /**
     * This method maps a AccountInfoDTO from rest to the SDK's AccountInfo model object.
     *
     * @internal
     * @param {AccountInfoDTO} dto AccountInfoDTO the dto object from rest.
     * @returns AccountInfo model
     */
    private toAccountInfo(dto: AccountInfoDTO): AccountInfo {
        return new AccountInfo(
            Address.createFromEncoded(dto.account.address),
            BigInt(dto.account.addressHeight),
            dto.account.publicKey,
            BigInt(dto.account.publicKeyHeight),
            dto.account.accountType.valueOf(),
            dto.account.linkedAccountKey,
            dto.account.activityBuckets.map((bucket) => {
                return new ActivityBucket(
                    bucket.startHeight,
                    bucket.totalFeesPaid,
                    bucket.beneficiaryCount,
                    bucket.rawScore,
                );
            }),
            dto.account.mosaics.map((mosaicDTO) => new Mosaic(
                new MosaicId(mosaicDTO.id),
                BigInt(mosaicDTO.amount),
            )),
            BigInt(dto.account.importance),
            BigInt(dto.account.importanceHeight),
        );

    }

    /**
     * Gets an array of confirmed transactions for which an account is signer or receiver.
     * @param address - * Address can be created rawAddress or publicKey
     * @param queryParams - (Optional) Query params
     * @param transactionFilter - (Optional) Transaction filter
     * @returns Observable<Transaction[]>
     */
    public getAccountTransactions(address: Address,
                                  queryParams?: QueryParams,
                                  transactionFilter?: TransactionFilter): Observable<Transaction[]> {

        return this.call(this.accountRoutesApi.getAccountConfirmedTransactions(address.plain(),
            this.queryParams(queryParams).pageSize,
            this.queryParams(queryParams).id,
            this.queryParams(queryParams).ordering,
            this.transactionFilter(transactionFilter).type),
            (body) => body.map((transactionDTO) => CreateTransactionFromDTO(transactionDTO)));
    }

    /**
     * Gets an array of transactions for which an account is the recipient of a transaction.
     * A transaction is said to be incoming with respect to an account if the account is the recipient of a transaction.
     * @param address - * Address can be created rawAddress or publicKey
     * @param queryParams - (Optional) Query params
     * @param transactionFilter - (Optional) Transaction filter
     * @returns Observable<Transaction[]>
     */
    public getAccountIncomingTransactions(address: Address,
                                          queryParams?: QueryParams,
                                          transactionFilter?: TransactionFilter): Observable<Transaction[]> {
        return this.call(this.accountRoutesApi.getAccountIncomingTransactions(address.plain(),
            this.queryParams(queryParams).pageSize,
            this.queryParams(queryParams).id,
            this.queryParams(queryParams).ordering,
            this.transactionFilter(transactionFilter).type),
            (body) => body.map((transactionDTO) => CreateTransactionFromDTO(transactionDTO)));
    }

    /**
     * Gets an array of transactions for which an account is the sender a transaction.
     * A transaction is said to be outgoing with respect to an account if the account is the sender of a transaction.
     * @param address - * Address can be created rawAddress or publicKey
     * @param queryParams - (Optional) Query params
     * @param transactionFilter - (Optional) Transaction filter
     * @returns Observable<Transaction[]>
     */
    public getAccountOutgoingTransactions(address: Address,
                                          queryParams?: QueryParams,
                                          transactionFilter?: TransactionFilter): Observable<Transaction[]> {
        return this.call(this.accountRoutesApi.getAccountOutgoingTransactions(address.plain(),
            this.queryParams(queryParams).pageSize,
            this.queryParams(queryParams).id,
            this.queryParams(queryParams).ordering,
            this.transactionFilter(transactionFilter).type),
            (body) => body.map((transactionDTO) => CreateTransactionFromDTO(transactionDTO)));
    }

    /**
     * Gets the array of transactions for which an account is the sender or receiver and which have not yet been included in a block.
     * Unconfirmed transactions are those transactions that have not yet been included in a block.
     * Unconfirmed transactions are not guaranteed to be included in any block.
     * @param address - * Address can be created rawAddress or publicKey
     * @param queryParams - (Optional) Query params
     * @param transactionFilter - (Optional) Transaction filter
     * @returns Observable<Transaction[]>
     */
    public getAccountUnconfirmedTransactions(address: Address,
                                             queryParams?: QueryParams,
                                             transactionFilter?: TransactionFilter): Observable<Transaction[]> {
        return this.call(this.accountRoutesApi.getAccountUnconfirmedTransactions(address.plain(),
            this.queryParams(queryParams).pageSize,
            this.queryParams(queryParams).id,
            this.queryParams(queryParams).ordering,
            this.transactionFilter(transactionFilter).type),
            (body) => body.map((transactionDTO) => CreateTransactionFromDTO(transactionDTO)));
    }

    /**
     * Gets an array of transactions for which an account is the sender or has sign the transaction.
     * A transaction is said to be aggregate bonded with respect to an account if there are missing signatures.
     * @param address - * Address can be created rawAddress or publicKey
     * @param queryParams - (Optional) Query params
     * @param transactionFilter - (Optional) Transaction filter
     * @returns Observable<AggregateTransaction[]>
     */
    public getAccountPartialTransactions(address: Address,
                                         queryParams?: QueryParams,
                                         transactionFilter?: TransactionFilter): Observable<AggregateTransaction[]> {
        return this.call(this.accountRoutesApi.getAccountPartialTransactions(address.plain(),
            this.queryParams(queryParams).pageSize,
            this.queryParams(queryParams).id,
            this.queryParams(queryParams).ordering,
            this.transactionFilter(transactionFilter).type),
            (body) => body.map((transactionDTO) => CreateTransactionFromDTO(transactionDTO) as AggregateTransaction));
    }
}
