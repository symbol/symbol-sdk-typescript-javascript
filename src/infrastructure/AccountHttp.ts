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
import {catchError, map, mergeMap} from 'rxjs/operators';
import { DtoMapping } from '../core/utils/DtoMapping';
import {AccountInfo} from '../model/account/AccountInfo';
import { AccountNames } from '../model/account/AccountNames';
import { ActivityBucket } from '../model/account/ActivityBucket';
import {Address} from '../model/account/Address';
import {MultisigAccountGraphInfo} from '../model/account/MultisigAccountGraphInfo';
import {MultisigAccountInfo} from '../model/account/MultisigAccountInfo';
import {PublicAccount} from '../model/account/PublicAccount';
import {Mosaic} from '../model/mosaic/Mosaic';
import {MosaicId} from '../model/mosaic/MosaicId';
import { NamespaceId } from '../model/namespace/NamespaceId';
import { NamespaceName } from '../model/namespace/NamespaceName';
import { AccountRestrictionsInfo } from '../model/restriction/AccountRestrictionsInfo';
import {AggregateTransaction} from '../model/transaction/AggregateTransaction';
import {Transaction} from '../model/transaction/Transaction';
import { UInt64 } from '../model/UInt64';
import {AccountRepository} from './AccountRepository';
import { AccountInfoDTO,
         AccountNamesDTO,
         AccountRestrictionsInfoDTO,
         AccountRoutesApi,
         MosaicDTO,
         MultisigAccountGraphInfoDTO,
         MultisigAccountInfoDTO,
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
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(
                this.accountRoutesApi.getAccountInfo(address.plain()))
                    .pipe(map((response: { response: ClientResponse; body: AccountInfoDTO; }) => {
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
                    catchError((error) =>  throwError(this.errorHandling(error)))),
            ));
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
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(
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
                    catchError((error) =>  throwError(this.errorHandling(error)))),
            ));
    }

    public getAccountsNames(addresses: Address[]): Observable<AccountNames[]> {
        const accountIdsBody = {
            addresses: addresses.map((address) => address.plain()),
        };
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(
                this.accountRoutesApi.getAccountsNames(accountIdsBody)).pipe(
                    map((response: { response: ClientResponse; body: any; }) => {
                        const accountNames = response.body.accountNames;
                        return accountNames.map((accountName) => {
                            return new AccountNames(
                                Address.createFromEncoded(accountName.address),
                                accountName.names.map((name) => {
                                    return new NamespaceName(new NamespaceId(name, networkType), name);
                                }),
                            );
                        });
                    }),
                    catchError((error) =>  throwError(this.errorHandling(error)))),
            ));
    }
    /**
     * Gets a MultisigAccountInfo for an account.
     * @param address - * Address can be created rawAddress or publicKey
     * @returns Observable<MultisigAccountInfo>
     */
    public getMultisigAccountInfo(address: Address): Observable<MultisigAccountInfo> {
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(
                this.accountRoutesApi.getAccountMultisig(address.plain()))
                    .pipe(map((response: { response: ClientResponse; body: MultisigAccountInfoDTO; }) => {
                        const multisigAccountInfoDTO = response.body;
                        return new MultisigAccountInfo(
                            PublicAccount.createFromPublicKey(multisigAccountInfoDTO.multisig.accountPublicKey, networkType),
                            multisigAccountInfoDTO.multisig.minApproval,
                            multisigAccountInfoDTO.multisig.minRemoval,
                            multisigAccountInfoDTO.multisig.cosignatoryPublicKeys
                                .map((cosigner) => PublicAccount.createFromPublicKey(cosigner, networkType)),
                            multisigAccountInfoDTO.multisig.multisigPublicKeys
                                .map((multisigAccount) => PublicAccount.createFromPublicKey(multisigAccount, networkType)),
                        );
                    }),
                    catchError((error) =>  throwError(this.errorHandling(error))),
        )));
    }

    /**
     * Gets a MultisigAccountGraphInfo for an account.
     * @param address - * Address can be created rawAddress or publicKey
     * @returns Observable<MultisigAccountGraphInfo>
     */
    public getMultisigAccountGraphInfo(address: Address): Observable<MultisigAccountGraphInfo> {
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(
                this.accountRoutesApi.getAccountMultisigGraph(address.plain()))
                    .pipe(map((response: { response: ClientResponse; body: MultisigAccountGraphInfoDTO[]; }) => {
                        const multisigAccountGraphInfosDTO = response.body;
                        const multisigAccounts = new Map<number, MultisigAccountInfo[]>();
                        multisigAccountGraphInfosDTO.map((multisigAccountGraphInfoDTO) => {
                            multisigAccounts.set(multisigAccountGraphInfoDTO.level,
                                multisigAccountGraphInfoDTO.multisigEntries.map((multisigAccountInfoDTO) => {
                                    return new MultisigAccountInfo(
                                        PublicAccount.createFromPublicKey(multisigAccountInfoDTO.multisig.accountPublicKey, networkType),
                                        multisigAccountInfoDTO.multisig.minApproval,
                                        multisigAccountInfoDTO.multisig.minRemoval,
                                        multisigAccountInfoDTO.multisig.cosignatoryPublicKeys
                                            .map((cosigner) => PublicAccount.createFromPublicKey(cosigner, networkType)),
                                        multisigAccountInfoDTO.multisig.multisigPublicKeys
                                            .map((multisigAccountDTO) =>
                                                PublicAccount.createFromPublicKey(multisigAccountDTO, networkType)));
                                }),
                            );
                        });
                        return new MultisigAccountGraphInfo(multisigAccounts);
                    }),
                    catchError((error) =>  throwError(this.errorHandling(error))),
        )));
    }

    /**
     * Gets an array of confirmed transactions for which an account is signer or receiver.
     * @param address - * Address can be created rawAddress or publicKey
     * @param queryParams - (Optional) Query params
     * @returns Observable<Transaction[]>
     */
    public transactions(address: Address, queryParams?: QueryParams): Observable<Transaction[]> {
        return observableFrom(
            this.accountRoutesApi.transactions(address.plain(),
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
    public incomingTransactions(address: Address, queryParams?: QueryParams): Observable <Transaction[]> {
        return observableFrom(
            this.accountRoutesApi.incomingTransactions(address.plain(),
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
    public outgoingTransactions(address: Address, queryParams?: QueryParams): Observable <Transaction[]> {
        return observableFrom(
            this.accountRoutesApi.outgoingTransactions(address.plain(),
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
    public unconfirmedTransactions(address: Address, queryParams?: QueryParams): Observable <Transaction[]> {
        return observableFrom(
            this.accountRoutesApi.unconfirmedTransactions(address.plain(),
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
    public aggregateBondedTransactions(address: Address, queryParams?: QueryParams): Observable <AggregateTransaction[]> {
        return observableFrom(
            this.accountRoutesApi.partialTransactions(address.plain(),
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
