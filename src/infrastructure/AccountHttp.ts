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

import {from as observableFrom, Observable} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';
import { DtoMapping } from '../core/utils/DtoMapping';
import {AccountInfo} from '../model/account/AccountInfo';
import { AccountNames } from '../model/account/AccountNames';
import { AccountPropertiesInfo } from '../model/account/AccountPropertiesInfo';
import {Address} from '../model/account/Address';
import {MultisigAccountGraphInfo} from '../model/account/MultisigAccountGraphInfo';
import {MultisigAccountInfo} from '../model/account/MultisigAccountInfo';
import {PublicAccount} from '../model/account/PublicAccount';
import {Mosaic} from '../model/mosaic/Mosaic';
import {MosaicId} from '../model/mosaic/MosaicId';
import { NamespaceId } from '../model/namespace/NamespaceId';
import { NamespaceName } from '../model/namespace/NamespaceName';
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
     * Constructor
     * @param url
     * @param networkHttp
     */
    constructor(url: string, networkHttp?: NetworkHttp) {
        networkHttp = networkHttp == null ? new NetworkHttp(url) : networkHttp;
        super(url, networkHttp);
    }

    /**
     * Gets an AccountInfo for an account.
     * @param address Address
     * @returns Observable<AccountInfo>
     */
    public getAccountInfo(address: Address): Observable<AccountInfo> {

        const accountId = address.plain();
        const postBody = null;

        // verify the required parameter 'accountId' is set
        if (accountId === undefined || accountId === null) {
            throw new Error('Missing the required parameter accountId when calling getAccountInfo');
        }

        const pathParams = {accountId};
        const queryParams = {
        };
        const headerParams = {
        };
        const formParams = {
        };

        const authNames = [];
        const contentTypes = [];
        const accepts = ['application/json'];

        const response =  this.apiClient.callApi(
            '/account/{accountId}', 'GET',
            pathParams, queryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts,
        );
        return observableFrom(response).pipe(map((accountInfoDTO: any) => {
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
        const postBody = null;
        const accountId = address.plain();
        // verify the required parameter 'accountId' is set
        if (accountId === undefined || accountId === null) {
            throw new Error('Missing the required parameter accountId when calling getAccountProperties');
        }

        const pathParams = {accountId};
        const queryParams = {
        };
        const headerParams = {
        };
        const formParams = {
        };

        const authNames = [];
        const contentTypes = [];
        const accepts = ['application/json'];

        const response = this.apiClient.callApi(
            '/account/{accountId}/properties/', 'GET',
            pathParams, queryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts);

        return observableFrom(response).pipe(map((accountProperties) => {
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
            addresses: addresses.map((address) => address.plain()),
        };
        const postBody = accountIds;

        // verify the required parameter 'accounstIds' is set
        if (accountIds === undefined || accountIds === null) {
            throw new Error('Missing the required parameter accounstIds when calling getAccountPropertiesFromAccounts');
        }

        const pathParams = {
        };
        const queryParams = {
        };
        const headerParams = {
        };
        const formParams = {
        };

        const authNames = [];
        const contentTypes = [];
        const accepts = ['application/json'];

        const response = this.apiClient.callApi(
            '/account/properties', 'POST',
            pathParams, queryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts);
        return observableFrom(response).pipe(map((accountProperties: any) => {
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
        const accountsIds = {
            addresses: addresses.map((address) => address.plain()),
        };
        const postBody = accountsIds;

        // verify the required parameter 'accountsIds' is set
        if (accountsIds === undefined || accountsIds === null) {
            throw new Error('Missing the required parameter accountsIds when calling getAccountsInfo');
        }

        const pathParams = {
        };
        const queryParams = {
        };
        const headerParams = {
        };
        const formParams = {
        };

        const authNames = [];
        const contentTypes = [];
        const accepts = ['application/json'];

        const response = this.apiClient.callApi(
            '/account', 'POST',
            pathParams, queryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts);
        return observableFrom(response).pipe(map((accountsInfoMetaDataDTO: any) => {
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

    public getAccountsNames(addresses: Address[]): Observable<AccountNames[]> {
        const accountIds = {
            addresses: addresses.map((address) => address.plain()),
        };
        const postBody = accountIds;

        // verify the required parameter 'accountIds' is set
        if (accountIds === undefined || accountIds === null) {
            throw new Error('Missing the required parameter accountIds when calling getAccountsNames');
        }

        const pathParams = {
        };
        const queryParams = {
        };
        const headerParams = {
        };
        const formParams = {
        };

        const authNames = [];
        const contentTypes = [];
        const accepts = ['application/json'];

        const response = this.apiClient.callApi(
            '/account/names', 'POST',
            pathParams, queryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts);
        return observableFrom(response).pipe(map((accountNames: any) => {
            return accountNames.map((accountName) => {
                return new AccountNames(
                    Address.createFromEncoded(accountName.address),
                    accountName.names.map((name) => {
                        new NamespaceName(new NamespaceId(name), name);
                    }),
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
        const postBody = null;
        const accountId = address.plain();
        // verify the required parameter 'accountId' is set
        if (accountId === undefined || accountId === null) {
        throw new Error('Missing the required parameter accountId when calling getAccountMultisig');
        }

        const pathParams = {
        accountId,
        };
        const queryParams = {
        };
        const headerParams = {
        };
        const formParams = {
        };

        const authNames = [];
        const contentTypes = [];
        const accepts = ['application/json'];

        const response = this.apiClient.callApi(
        '/account/{accountId}/multisig', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts);
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(response).pipe(map((multisigAccountInfoDTO: any) => {
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
        const postBody = null;
        const accountId = address.plain();
        // verify the required parameter 'accountId' is set
        if (accountId === undefined || accountId === null) {
            throw new Error('Missing the required parameter accountId when calling getAccountMultisigGraph');
        }

        const pathParams = {
            accountId,
        };
        const queryParams = {
        };
        const headerParams = {
        };
        const formParams = {
        };

        const authNames = [];
        const contentTypes = [];
        const accepts = ['application/json'];

        const response = this.apiClient.callApi(
            '/account/{accountId}/multisig/graph', 'GET',
            pathParams, queryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts);
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(response).pipe(map((multisigAccountGraphInfosDTO: any) => {
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
        const postBody = null;
        const publicKey = publicAccount.publicKey;

        // verify the required parameter 'publicKey' is set
        if (publicKey === undefined || publicKey === null) {
            throw new Error('Missing the required parameter publicKey when calling transactions');
        }

        const pathParams = {
            publicKey,
        };
        const headerParams = {
        };
        const formParams = {
        };

        const authNames = [];
        const contentTypes = [];
        const accepts = ['application/json'];

        const response = this.apiClient.callApi(
            '/account/{publicKey}/transactions', 'GET',
            pathParams, queryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts);
        return observableFrom(response).pipe(
            map((transactionsDTO: any) => {
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
        const postBody = null;
        const publicKey = publicAccount.publicKey;
        // verify the required parameter 'publicKey' is set
        if (publicKey === undefined || publicKey === null) {
            throw new Error('Missing the required parameter publicKey when calling incomingTransactions');
        }

        const pathParams = {
            publicKey,
        };
        const headerParams = {
        };
        const formParams = {
        };

        const authNames = [];
        const contentTypes = [];
        const accepts = ['application/json'];

        const response = this.apiClient.callApi(
            '/account/{publicKey}/transactions/incoming', 'GET',
            pathParams, queryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts);
        return observableFrom(response).pipe(
            map((transactionsDTO: any) => {
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
        const postBody = null;
        const publicKey = publicAccount.publicKey;
        // verify the required parameter 'publicKey' is set
        if (publicKey === undefined || publicKey === null) {
            throw new Error('Missing the required parameter publicKey when calling unconfirmedTransactions');
        }
        const pathParams = {
            publicKey,
        };
        const headerParams = {
        };
        const formParams = {
        };

        const authNames = [];
        const contentTypes = [];
        const accepts = ['application/json'];

        const response = this.apiClient.callApi(
            '/account/{publicKey}/transactions/outgoing', 'GET',
            pathParams, queryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts);
        return observableFrom(response).pipe(
            map((transactionsDTO: any) => {
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
        const postBody = null;
        const publicKey = publicAccount.publicKey;
        // verify the required parameter 'publicKey' is set
        if (publicKey === undefined || publicKey === null) {
            throw new Error('Missing the required parameter publicKey when calling unconfirmedTransactions');
        }
        const pathParams = {
            publicKey,
        };

        const headerParams = {
        };
        const formParams = {
        };

        const authNames = [];
        const contentTypes = [];
        const accepts = ['application/json'];

        const response = this.apiClient.callApi(
            '/account/{publicKey}/transactions/unconfirmed', 'GET',
            pathParams, queryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts);
        return observableFrom(response).pipe(
            map((transactionsDTO: any) => {
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
        const postBody = null;
        const publicKey = publicAccount.publicKey;
        // verify the required parameter 'publicKey' is set
        if (publicKey === undefined || publicKey === null) {
            throw new Error('Missing the required parameter publicKey when calling partialTransactions');
        }

        const pathParams = {
            publicKey,
        };
        const headerParams = {
        };
        const formParams = {
        };

        const authNames = [];
        const contentTypes = [];
        const accepts = ['application/json'];

        const response = this.apiClient.callApi(
            '/account/{publicKey}/transactions/partial', 'GET',
            pathParams, queryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts);
        return observableFrom(response).pipe(
            map((transactionsDTO: any) => {
                return transactionsDTO.map((transactionDTO) => {
                    return CreateTransactionFromDTO(transactionDTO) as AggregateTransaction;
                });
            }));
    }
}
