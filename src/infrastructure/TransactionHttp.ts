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

import {BlockchainRoutesApi, TransactionRoutesApi} from 'nem2-library';
import * as requestPromise from 'request-promise-native';
import {from as observableFrom, Observable, throwError as observableThrowError} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {PublicAccount} from '../model/account/PublicAccount';
import {CosignatureSignedTransaction} from '../model/transaction/CosignatureSignedTransaction';
import {Deadline} from '../model/transaction/Deadline';
import {SignedTransaction} from '../model/transaction/SignedTransaction';
import { SyncAnnounce } from '../model/transaction/SyncAnnounce';
import {Transaction} from '../model/transaction/Transaction';
import {TransactionAnnounceResponse} from '../model/transaction/TransactionAnnounceResponse';
import {TransactionInfo} from '../model/transaction/TransactionInfo';
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
     * @internal
     * Nem2 Library blockchain routes api
     */
    private blockchainRoutesApi: BlockchainRoutesApi;

    /**
     * Constructor
     * @param url
     */
    constructor(private readonly url: string) {
        super(url);
        this.transactionRoutesApi = new TransactionRoutesApi(this.apiClient);
        this.blockchainRoutesApi = new BlockchainRoutesApi(this.apiClient);
    }

    /**
     * Gets a transaction for a transactionId
     * @param transactionId - Transaction id or hash.
     * @returns Observable<Transaction>
     */
    public getTransaction(transactionId: string): Observable<Transaction> {
        return observableFrom(this.transactionRoutesApi.getTransaction(transactionId)).pipe(map((transactionDTO) => {
            return CreateTransactionFromDTO(transactionDTO);
        }));
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
        return observableFrom(
            this.transactionRoutesApi.getTransactions(transactionIdsBody)).pipe(map((transactionsDTO) => {
            return transactionsDTO.map((transactionDTO) => {
                return CreateTransactionFromDTO(transactionDTO);
            });
        }));
    }

    /**
     * Gets a transaction status for a transaction hash
     * @param hash - Transaction hash.
     * @returns Observable<TransactionStatus>
     */
    public getTransactionStatus(transactionHash: string): Observable<TransactionStatus> {
        return observableFrom(this.transactionRoutesApi.getTransactionStatus(transactionHash)).pipe(
            map((transactionStatusDTO) => {
                return new TransactionStatus(
                    transactionStatusDTO.group,
                    transactionStatusDTO.status,
                    transactionStatusDTO.hash,
                    Deadline.createFromDTO(transactionStatusDTO.deadline),
                    transactionStatusDTO.height ? new UInt64(transactionStatusDTO.height) : UInt64.fromUint(0));
            }));
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
        return observableFrom(
            this.transactionRoutesApi.getTransactionsStatuses(transactionHashesBody)).pipe(
            map((transactionStatusesDTO) => {
                return transactionStatusesDTO.map((transactionStatusDTO) => {
                    return new TransactionStatus(
                        transactionStatusDTO.group,
                        transactionStatusDTO.status,
                        transactionStatusDTO.hash,
                        Deadline.createFromDTO(transactionStatusDTO.deadline),
                        transactionStatusDTO.height ? new UInt64(transactionStatusDTO.height) : UInt64.fromUint(0));
                });
            }));
    }

    /**
     * Send a signed transaction
     * @param signedTransaction - Signed transaction
     * @returns Observable<TransactionAnnounceResponse>
     */
    public announce(signedTransaction: SignedTransaction): Observable<TransactionAnnounceResponse> {
        return observableFrom(this.transactionRoutesApi.announceTransaction(signedTransaction)).pipe(
            map((transactionAnnounceResponseDTO) => {
                return new TransactionAnnounceResponse(transactionAnnounceResponseDTO.message);
            }));
    }

    /**
     * Send a signed transaction with missing signatures
     * @param signedTransaction - Signed transaction
     * @returns Observable<TransactionAnnounceResponse>
     */
    public announceAggregateBonded(signedTransaction: SignedTransaction): Observable<TransactionAnnounceResponse> {
        if (signedTransaction.type !== TransactionType.AGGREGATE_BONDED) {
            return observableFrom(new Promise((resolve, reject) => {
                reject('Only Transaction Type 0x4241 is allowed for announce aggregate bonded');
            }));
        }
        return observableFrom(this.transactionRoutesApi.announcePartialTransaction(signedTransaction)).pipe(
            map((transactionAnnounceResponseDTO) => {
                return new TransactionAnnounceResponse(transactionAnnounceResponseDTO.message);
            }));
    }

    /**
     * Send a cosignature signed transaction of an already announced transaction
     * @param cosignatureSignedTransaction - Cosignature signed transaction
     * @returns Observable<TransactionAnnounceResponse>
     */
    public announceAggregateBondedCosignature(
        cosignatureSignedTransaction: CosignatureSignedTransaction): Observable<TransactionAnnounceResponse> {
        return observableFrom(this.transactionRoutesApi.announceCosignatureTransaction(cosignatureSignedTransaction)).pipe(
            map((transactionAnnounceResponseDTO) => {
                return new TransactionAnnounceResponse(transactionAnnounceResponseDTO.message);
            }));
    }

    public announceSync(signedTx: SignedTransaction): Observable<Transaction> {
        const address = PublicAccount.createFromPublicKey(signedTx.signer, signedTx.networkType).address;
        const syncAnnounce = new SyncAnnounce(
            signedTx.payload,
            signedTx.hash,
            address.plain(),
        );
        return observableFrom(
            requestPromise.put({url: this.url + `/transaction/sync`, body: syncAnnounce, json: true}),
        ).pipe(map((response) => {
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
        }), catchError((err) => {
            if (err.statusCode === 405) {
                return observableThrowError('non sync server');
            }
            return observableThrowError(err);
        }));
    }

    /**
     * Gets a transaction's effective paid fee
     * @param transactionId - Transaction id or hash.
     * @returns Observable<number>
     */
    public getTransactionEffectiveFee(transactionId: string): Observable<number> {
        return observableFrom(this.transactionRoutesApi.getTransaction(transactionId)).pipe(
            mergeMap((transactionDTO) => {
                // parse transaction to take advantage of `size` getter overload
                const transaction = CreateTransactionFromDTO(transactionDTO);
                const uintHeight = (transaction.transactionInfo as TransactionInfo).height;

                // now read block details
                return observableFrom(this.blockchainRoutesApi.getBlockByHeight(uintHeight.compact())).pipe(
                map((blockDTO) => {

                    // @see https://nemtech.github.io/concepts/transaction.html#fees
                    // effective_fee = feeMultiplier x transaction::size
                    return blockDTO.block.feeMultiplier * transaction.size;
                }));
            }), catchError((err) => {
                return observableThrowError(err);
            }));
    }
}
