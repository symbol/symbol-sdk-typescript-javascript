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

import {AccountRoutesApi} from 'nem2-library';
import {from as observableFrom, Observable} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';
import { DtoMapping } from '../core/utils/DtoMapping';
import {AccountInfo} from '../model/account/AccountInfo';
import { AccountPropertiesInfo } from '../model/account/AccountPropertiesInfo';
import {Address} from '../model/account/Address';
import {MultisigAccountGraphInfo} from '../model/account/MultisigAccountGraphInfo';
import {MultisigAccountInfo} from '../model/account/MultisigAccountInfo';
import {PublicAccount} from '../model/account/PublicAccount';
import {Mosaic} from '../model/mosaic/Mosaic';
import {MosaicId} from '../model/mosaic/MosaicId';
import {AggregateTransaction} from '../model/transaction/AggregateTransaction';
import {Transaction} from '../model/transaction/Transaction';
import {UInt64} from '../model/UInt64';
import {AccountRepository} from './AccountRepository';
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
        super(url, networkHttp);
        this.accountRoutesApi = new AccountRoutesApi(this.apiClient);
    }

    /**
     * Gets an AccountInfo for an account.
     * @param address Address
     * @returns Observable<AccountInfo>
     */
    public getAccountInfo(address: Address): Observable<AccountInfo> {
        return observableFrom(this.accountRoutesApi.getAccountInfo(address.plain())).pipe(map((accountInfoDTO) => {
            return new AccountInfo(
                accountInfoDTO.meta,
                Address.createFromEncoded(accountInfoDTO.account.address),
                new UInt64(accountInfoDTO.account.addressHeight),
                accountInfoDTO.account.publicKey,
                new UInt64(accountInfoDTO.account.publicKeyHeight),
                accountInfoDTO.account.mosaics.map((mosaicDTO) => new Mosaic(
                    new MosaicId(mosaicDTO.id),
                    new UInt64(mosaicDTO.amount),
                )),
                new UInt64(accountInfoDTO.account.importance),
                new UInt64(accountInfoDTO.account.importanceHeight),
            );
        }));
    }

    /**
     * Gets Account property.
     * @param publicAccount public account
     * @returns Observable<AccountProperty>
     */
    public getAccountProperties(address: Address): Observable<AccountPropertiesInfo> {
        return observableFrom(this.accountRoutesApi.getAccountProperties(address.plain())).pipe(map((accountProperties) => {
            return DtoMapping.extractAccountPropertyFromDto(accountProperties);
        }));
    }

    /**
     * Gets Account properties.
     * @param address list of addresses
     * @returns Observable<AccountProperty[]>
     */
    public getAccountPropertiesFromAccounts(addresses: Address[]): Observable<AccountPropertiesInfo[]> {
        const accountIds = {
            addresses: addresses.map((address) => address.plain())
        };
        return observableFrom(
            this.accountRoutesApi.getAccountPropertiesFromAccounts(accountIds)).pipe(map((accountProperties) => {
            return accountProperties.map((property) => {
                return DtoMapping.extractAccountPropertyFromDto(property);
            });
        }));
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
            this.accountRoutesApi.getAccountsInfo(accountIdsBody)).pipe(map((accountsInfoMetaDataDTO) => {
            return accountsInfoMetaDataDTO.map((accountInfoDTO) => {
                return new AccountInfo(
                    accountInfoDTO.meta,
                    Address.createFromEncoded(accountInfoDTO.account.address),
                    new UInt64(accountInfoDTO.account.addressHeight),
                    accountInfoDTO.account.publicKey,
                    new UInt64(accountInfoDTO.account.publicKeyHeight),
                    accountInfoDTO.account.mosaics.map((mosaicDTO) => new Mosaic(mosaicDTO.id, mosaicDTO.amount)),
                    new UInt64(accountInfoDTO.account.importance),
                    new UInt64(accountInfoDTO.account.importanceHeight),
                );
            });
        }));
    }

    /**
     * Gets a MultisigAccountInfo for an account.
     * @param address - User address
     * @returns Observable<MultisigAccountInfo>
     */
    public getMultisigAccountInfo(address: Address): Observable<MultisigAccountInfo> {
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(
                this.accountRoutesApi.getAccountMultisig(address.plain())).pipe(map((multisigAccountInfoDTO) => {
                return new MultisigAccountInfo(
                    PublicAccount.createFromPublicKey(multisigAccountInfoDTO.multisig.account, networkType),
                    multisigAccountInfoDTO.multisig.minApproval,
                    multisigAccountInfoDTO.multisig.minRemoval,
                    multisigAccountInfoDTO.multisig.cosignatories
                        .map((cosigner) => PublicAccount.createFromPublicKey(cosigner, networkType)),
                    multisigAccountInfoDTO.multisig.multisigAccounts
                        .map((multisigAccount) => PublicAccount.createFromPublicKey(multisigAccount, networkType)),
                );
            }))));
    }

    /**
     * Gets a MultisigAccountGraphInfo for an account.
     * @param address - User address
     * @returns Observable<MultisigAccountGraphInfo>
     */
    public getMultisigAccountGraphInfo(address: Address): Observable<MultisigAccountGraphInfo> {
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(
                this.accountRoutesApi.getAccountMultisigGraph(address.plain())).pipe(map((multisigAccountGraphInfosDTO) => {
                const multisigAccounts = new Map<number, MultisigAccountInfo[]>();
                multisigAccountGraphInfosDTO.map((multisigAccountGraphInfoDTO) => {
                    multisigAccounts.set(multisigAccountGraphInfoDTO.level,
                        multisigAccountGraphInfoDTO.multisigEntries.map((multisigAccountInfoDTO) => {
                            return new MultisigAccountInfo(
                                PublicAccount.createFromPublicKey(multisigAccountInfoDTO.multisig.account, networkType),
                                multisigAccountInfoDTO.multisig.minApproval,
                                multisigAccountInfoDTO.multisig.minRemoval,
                                multisigAccountInfoDTO.multisig.cosignatories
                                    .map((cosigner) => PublicAccount.createFromPublicKey(cosigner, networkType)),
                                multisigAccountInfoDTO.multisig.multisigAccounts
                                    .map((multisigAccountDTO) => PublicAccount.createFromPublicKey(multisigAccountDTO, networkType)));
                        }),
                    );
                });
                return new MultisigAccountGraphInfo(multisigAccounts);
            }))));
    }

    /**
     * Gets an array of confirmed transactions for which an account is signer or receiver.
     * @param publicAccount - User public account
     * @param queryParams - (Optional) Query params
     * @returns Observable<Transaction[]>
     */
    public transactions(publicAccount: PublicAccount, queryParams?: QueryParams): Observable<Transaction[]> {
        return observableFrom(
            this.accountRoutesApi.transactions(publicAccount.publicKey, queryParams != null ? queryParams : {})).pipe(
            map((transactionsDTO) => {
                return transactionsDTO.map((transactionDTO) => {
                    return CreateTransactionFromDTO(transactionDTO);
                });
            }));
    }

    /**
     * Gets an array of transactions for which an account is the recipient of a transaction.
     * A transaction is said to be incoming with respect to an account if the account is the recipient of a transaction.
     * @param publicAccount - User public account
     * @param queryParams - (Optional) Query params
     * @returns Observable<Transaction[]>
     */
    public incomingTransactions(publicAccount: PublicAccount, queryParams?: QueryParams): Observable <Transaction[]> {
        return observableFrom(
            this.accountRoutesApi.incomingTransactions(publicAccount.publicKey, queryParams != null ? queryParams : {})).pipe(
            map((transactionsDTO) => {
                return transactionsDTO.map((transactionDTO) => {
                    return CreateTransactionFromDTO(transactionDTO);
                });
            }));
    }

    /**
     * Gets an array of transactions for which an account is the sender a transaction.
     * A transaction is said to be outgoing with respect to an account if the account is the sender of a transaction.
     * @param publicAccount - User public account
     * @param queryParams - (Optional) Query params
     * @returns Observable<Transaction[]>
     */
    public outgoingTransactions(publicAccount: PublicAccount, queryParams?: QueryParams): Observable <Transaction[]> {
        return observableFrom(
            this.accountRoutesApi.outgoingTransactions(publicAccount.publicKey, queryParams != null ? queryParams : {})).pipe(
            map((transactionsDTO) => {
                return transactionsDTO.map((transactionDTO) => {
                    return CreateTransactionFromDTO(transactionDTO);
                });
            }));
    }

    /**
     * Gets the array of transactions for which an account is the sender or receiver and which have not yet been included in a block.
     * Unconfirmed transactions are those transactions that have not yet been included in a block.
     * Unconfirmed transactions are not guaranteed to be included in any block.
     * @param publicAccount - User public account
     * @param queryParams - (Optional) Query params
     * @returns Observable<Transaction[]>
     */
    public unconfirmedTransactions(publicAccount: PublicAccount, queryParams?: QueryParams): Observable <Transaction[]> {
        return observableFrom(
            this.accountRoutesApi.unconfirmedTransactions(publicAccount.publicKey, queryParams != null ? queryParams : {})).pipe(
            map((transactionsDTO) => {
                return transactionsDTO.map((transactionDTO) => {
                    return CreateTransactionFromDTO(transactionDTO);
                });
            }));
    }

    /**
     * Gets an array of transactions for which an account is the sender or has sign the transaction.
     * A transaction is said to be aggregate bonded with respect to an account if there are missing signatures.
     * @param publicAccount - User public account
     * @param queryParams - (Optional) Query params
     * @returns Observable<AggregateTransaction[]>
     */
    public aggregateBondedTransactions(publicAccount: PublicAccount, queryParams?: QueryParams): Observable <AggregateTransaction[]> {
        return observableFrom(
            this.accountRoutesApi.partialTransactions(publicAccount.publicKey, queryParams != null ? queryParams : {})).pipe(
            map((transactionsDTO) => {
                return transactionsDTO.map((transactionDTO) => {
                    return CreateTransactionFromDTO(transactionDTO) as AggregateTransaction;
                });
            }));
    }
}
