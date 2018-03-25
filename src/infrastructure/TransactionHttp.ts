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

import {TransactionRoutesApi} from 'nem2-library';
import * as requestPromise from 'request-promise-native';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {PublicAccount} from '../model/account/PublicAccount';
import {CosignatureSignedTransaction} from '../model/transaction/CosignatureSignedTransaction';
import {Deadline} from '../model/transaction/Deadline';
import {SignedTransaction} from '../model/transaction/SignedTransaction';
import {Transaction} from '../model/transaction/Transaction';
import {TransactionAnnounceResponse} from '../model/transaction/TransactionAnnounceResponse';
import {TransactionStatus} from '../model/transaction/TransactionStatus';
import {TransactionType} from '../model/transaction/TransactionType';
import {UInt64} from '../model/UInt64';
import {Http} from './Http';
import {CreateTransactionFromDTO} from './transaction/CreateTransactionFromDTO';
import {TransactionRepository} from './TransactionRepository';

/**
 * Transaction http repository.
 *
 * @since 1.0
 */
export class TransactionHttp extends Http implements TransactionRepository {
    /**
     * @internal
     * Nem2 Library transaction routes api
     */
    private transactionRoutesApi: TransactionRoutesApi;

    /**
     * Constructor
     * @param url
     */
    constructor(private readonly url: string) {
        super(url);
        this.transactionRoutesApi = new TransactionRoutesApi(this.apiClient);
    }

    /**
     * Gets a transaction for a transactionId
     * @param transactionId - Transaction id or hash.
     * @returns Observable<Transaction>
     */
    public getTransaction(transactionId: string): Observable<Transaction> {
        return Observable.fromPromise(this.transactionRoutesApi.getTransaction(transactionId)).map((transactionDTO) => {
            return CreateTransactionFromDTO(transactionDTO);
        });
    }

    /**
     * Gets an array of transactions for different transaction ids
     * @param transactionIds - Array of transactions id and/or hash.
     * @returns Observable<Transaction[]>
     */
    public getTransactions(transactionIds: string[]): Observable<Transaction[]> {
        const transactionIdsBody = {
            transactionIds,
        };
        return Observable.fromPromise(
            this.transactionRoutesApi.getTransactions(transactionIdsBody)).map((transactionsDTO) => {
            return transactionsDTO.map((transactionDTO) => {
                return CreateTransactionFromDTO(transactionDTO);
            });
        });
    }

    /**
     * Gets a transaction status for a transaction hash
     * @param hash - Transaction hash.
     * @returns Observable<TransactionStatus>
     */
    public getTransactionStatus(transactionHash: string): Observable<TransactionStatus> {
        return Observable.fromPromise(this.transactionRoutesApi.getTransactionStatus(transactionHash))
            .map((transactionStatusDTO) => {
                return new TransactionStatus(
                    transactionStatusDTO.group,
                    transactionStatusDTO.status,
                    transactionStatusDTO.hash,
                    Deadline.createFromDTO(transactionStatusDTO.deadline),
                    new UInt64(transactionStatusDTO.height));
            });
    }

    /**
     * Gets an array of transaction status for different transaction hashes
     * @param transactionHashes - Array of transaction hash
     * @returns Observable<TransactionStatus[]>
     */
    public getTransactionsStatuses(transactionHashes: string[]): Observable<TransactionStatus[]> {
        const transactionHashesBody = {
            hashes: transactionHashes,
        };
        return Observable.fromPromise(
            this.transactionRoutesApi.getTransactionsStatuses(transactionHashesBody))
            .map((transactionStatusesDTO) => {
                return transactionStatusesDTO.map((transactionStatusDTO) => {
                    return new TransactionStatus(
                        transactionStatusDTO.group,
                        transactionStatusDTO.status,
                        transactionStatusDTO.hash,
                        Deadline.createFromDTO(transactionStatusDTO.deadline),
                        new UInt64(transactionStatusDTO.height));
                });
            });
    }

    /**
     * Send a signed transaction
     * @param signedTransaction - Signed transaction
     * @returns Observable<TransactionAnnounceResponse>
     */
    public announce(signedTransaction: SignedTransaction): Observable<TransactionAnnounceResponse> {
        return Observable.fromPromise(this.transactionRoutesApi.announceTransaction(signedTransaction))
            .map((transactionAnnounceResponseDTO) => {
                return new TransactionAnnounceResponse(transactionAnnounceResponseDTO.message);
            });
    }

    /**
     * Send a signed transaction with missing signatures
     * @param signedTransaction - Signed transaction
     * @returns Observable<TransactionAnnounceResponse>
     */
    public announceAggregateBonded(signedTransaction: SignedTransaction): Observable<TransactionAnnounceResponse> {
        if (signedTransaction.type !== TransactionType.AGGREGATE_BONDED) {
            return Observable.fromPromise(new Promise((resolve, reject) => {
                reject('Only Transaction Type 0x4241 is allowed for announce aggregate bonded');
            }));
        }
        return Observable.fromPromise(this.transactionRoutesApi.announcePartialTransaction(signedTransaction))
            .map((transactionAnnounceResponseDTO) => {
                return new TransactionAnnounceResponse(transactionAnnounceResponseDTO.message);
            });
    }

    /**
     * Send a cosignature signed transaction of an already announced transaction
     * @param cosignatureSignedTransaction - Cosignature signed transaction
     * @returns Observable<TransactionAnnounceResponse>
     */
    public announceAggregateBondedCosignature(
        cosignatureSignedTransaction: CosignatureSignedTransaction): Observable<TransactionAnnounceResponse> {
        return Observable.fromPromise(this.transactionRoutesApi.announceCosignatureTransaction(cosignatureSignedTransaction))
            .map((transactionAnnounceResponseDTO) => {
                return new TransactionAnnounceResponse(transactionAnnounceResponseDTO.message);
            });
    }

    public announceSync(signedTx: SignedTransaction): Observable<Transaction> {
        const address = PublicAccount.createFromPublicKey(signedTx.signer, signedTx.networkType).address;
        const syncAnnounce = new SyncAnnounce(
            signedTx.payload,
            signedTx.hash,
            address.plain(),
        );
        return Observable.fromPromise(
            requestPromise.put({url: this.url + `/transaction/sync`, body: syncAnnounce, json: true}),
        ).map((response) => {
            if (response.status !== undefined) {
                throw new TransactionStatus(
                    'failed',
                    response.status,
                    response.hash,
                    Deadline.createFromDTO(response.deadline),
                    UInt64.fromUint(0));
            } else {
                return CreateTransactionFromDTO(response);
            }
        }).catch((err) => {
            if (err.statusCode === 405) {
                return Observable.throw('non sync server');
            }
            return Observable.throw(err);
        });
    }
}

class SyncAnnounce {
    constructor(/**
                 * Transaction serialized data
                 */
                public readonly payload: string,
                /**
                 * Transaction hash
                 */
                public readonly hash: string,
                /**
                 * Transaction address
                 */
                public readonly address: string) {
    }
}
