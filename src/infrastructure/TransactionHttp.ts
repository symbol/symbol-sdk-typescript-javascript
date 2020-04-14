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
import { from as observableFrom, Observable, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { BlockInfoDTO, BlockRoutesApi, TransactionRoutesApi, TransactionStatusDTO } from 'symbol-openapi-typescript-node-client';
import { CosignatureSignedTransaction } from '../model/transaction/CosignatureSignedTransaction';
import { Deadline } from '../model/transaction/Deadline';
import { SignedTransaction } from '../model/transaction/SignedTransaction';
import { Transaction } from '../model/transaction/Transaction';
import { TransactionAnnounceResponse } from '../model/transaction/TransactionAnnounceResponse';
import { TransactionInfo } from '../model/transaction/TransactionInfo';
import { TransactionStatus } from '../model/transaction/TransactionStatus';
import { TransactionType } from '../model/transaction/TransactionType';
import { UInt64 } from '../model/UInt64';
import { Http } from './Http';
import { CreateTransactionFromDTO } from './transaction/CreateTransactionFromDTO';
import { TransactionRepository } from './TransactionRepository';

/**
 * Transaction http repository.
 *
 * @since 1.0
 */
export class TransactionHttp extends Http implements TransactionRepository {
    /**
     * @internal
     * Symbol openapi typescript-node client transaction routes api
     */
    private transactionRoutesApi: TransactionRoutesApi;

    /**
     * @internal
     * Symbol openapi typescript-node client blockchain routes api
     */
    private blockRoutesApi: BlockRoutesApi;

    /**
     * Constructor
     * @param url
     */
    constructor(url: string) {
        super(url);
        this.transactionRoutesApi = new TransactionRoutesApi(url);
        this.blockRoutesApi = new BlockRoutesApi(url);
        this.transactionRoutesApi.useQuerystring = true;
        this.blockRoutesApi.useQuerystring = true;
    }

    /**
     * Gets a transaction for a transactionId
     * @param transactionId - Transaction id or hash.
     * @returns Observable<Transaction>
     */
    public getTransaction(transactionId: string): Observable<Transaction> {
        return observableFrom(this.transactionRoutesApi.getTransaction(transactionId)).pipe(
            map(({ body }) => CreateTransactionFromDTO(body)),
            catchError((error) => throwError(this.errorHandling(error))),
        );
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
        return observableFrom(this.transactionRoutesApi.getTransactions(transactionIdsBody)).pipe(
            map(({ body }) =>
                body.map((transactionDTO) => {
                    return CreateTransactionFromDTO(transactionDTO);
                }),
            ),
            catchError((error) => throwError(this.errorHandling(error))),
        );
    }

    /**
     * Gets a transaction status for a transaction hash
     * @param transactionHash - Transaction hash.
     * @returns Observable<TransactionStatus>
     */
    public getTransactionStatus(transactionHash: string): Observable<TransactionStatus> {
        return observableFrom(this.transactionRoutesApi.getTransactionStatus(transactionHash)).pipe(
            map(({ body }) => this.toTransactionStatus(body)),
            catchError((error) => throwError(this.errorHandling(error))),
        );
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
        return observableFrom(this.transactionRoutesApi.getTransactionsStatuses(transactionHashesBody)).pipe(
            map(({ body }) => body.map(this.toTransactionStatus)),
            catchError((error) => throwError(this.errorHandling(error))),
        );
    }

    /**
     * This method maps a TransactionStatusDTO from rest to the SDK's TransactionStatus model object.
     *
     * @internal
     * @param {TransactionStatusDTO} dto the TransactionStatusDTO object from rest.
     * @returns {TransactionStatus} a TransactionStatus model
     */
    private toTransactionStatus(dto: TransactionStatusDTO): TransactionStatus {
        return new TransactionStatus(
            dto.group,
            dto.hash,
            Deadline.createFromDTO(UInt64.fromNumericString(dto.deadline).toDTO()),
            dto.code,
            dto.height ? UInt64.fromNumericString(dto.height) : undefined,
        );
    }

    /**
     * Send a signed transaction
     * @param signedTransaction - Signed transaction
     * @returns Observable<TransactionAnnounceResponse>
     */
    public announce(signedTransaction: SignedTransaction): Observable<TransactionAnnounceResponse> {
        if (signedTransaction.type === TransactionType.AGGREGATE_BONDED) {
            throw new Error("Announcing aggregate bonded transaction should use 'announceAggregateBonded'");
        }
        return observableFrom(this.transactionRoutesApi.announceTransaction(signedTransaction)).pipe(
            map(({ body }) => new TransactionAnnounceResponse(body.message)),
            catchError((error) => throwError(this.errorHandling(error))),
        );
    }

    /**
     * Send a signed transaction with missing signatures
     * @param signedTransaction - Signed transaction
     * @returns Observable<TransactionAnnounceResponse>
     */
    public announceAggregateBonded(signedTransaction: SignedTransaction): Observable<TransactionAnnounceResponse> {
        if (signedTransaction.type !== TransactionType.AGGREGATE_BONDED) {
            throw new Error('Only Transaction Type 0x4241 is allowed for announce aggregate bonded');
        }
        return observableFrom(this.transactionRoutesApi.announcePartialTransaction(signedTransaction)).pipe(
            map(({ body }) => new TransactionAnnounceResponse(body.message)),
            catchError((error) => throwError(this.errorHandling(error))),
        );
    }

    /**
     * Send a cosignature signed transaction of an already announced transaction
     * @param cosignatureSignedTransaction - Cosignature signed transaction
     * @returns Observable<TransactionAnnounceResponse>
     */
    public announceAggregateBondedCosignature(
        cosignatureSignedTransaction: CosignatureSignedTransaction,
    ): Observable<TransactionAnnounceResponse> {
        return observableFrom(this.transactionRoutesApi.announceCosignatureTransaction(cosignatureSignedTransaction)).pipe(
            map(({ body }) => new TransactionAnnounceResponse(body.message)),
            catchError((error) => throwError(this.errorHandling(error))),
        );
    }

    /**
     * Gets a transaction's effective paid fee
     * @param transactionId - Transaction id or hash.
     * @returns Observable<number>
     */
    public getTransactionEffectiveFee(transactionId: string): Observable<number> {
        return observableFrom(this.transactionRoutesApi.getTransaction(transactionId)).pipe(
            mergeMap(({ body }) => {
                // parse transaction to take advantage of `size` getter overload
                const transaction = CreateTransactionFromDTO(body);
                const uintHeight = (transaction.transactionInfo as TransactionInfo).height;

                // now read block details
                return observableFrom(this.blockRoutesApi.getBlockByHeight(uintHeight.toString())).pipe(
                    map((blockResponse: { response: ClientResponse; body: BlockInfoDTO }) => {
                        const blockDTO = blockResponse.body;
                        // @see https://nemtech.github.io/concepts/transaction.html#fees
                        // effective_fee = feeMultiplier x transaction::size
                        return blockDTO.block.feeMultiplier * transaction.size;
                    }),
                    catchError((error) => throwError(this.errorHandling(error))),
                );
            }),
            catchError((err) => {
                return throwError(err);
            }),
        );
    }
}
