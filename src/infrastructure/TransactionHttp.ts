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
import {
    BlockInfoDTO,
    BlockRoutesApi,
    TransactionRoutesApi,
    TransactionInfoDTO,
    TransactionPage,
    Cosignature,
} from 'symbol-openapi-typescript-node-client';
import { CosignatureSignedTransaction } from '../model/transaction/CosignatureSignedTransaction';
import { SignedTransaction } from '../model/transaction/SignedTransaction';
import { Transaction } from '../model/transaction/Transaction';
import { TransactionAnnounceResponse } from '../model/transaction/TransactionAnnounceResponse';
import { TransactionInfo } from '../model/transaction/TransactionInfo';
import { TransactionType } from '../model/transaction/TransactionType';
import { Http } from './Http';
import { CreateTransactionFromDTO } from './transaction/CreateTransactionFromDTO';
import { TransactionRepository } from './TransactionRepository';
import { TransactionSearchCriteria } from './searchCriteria/TransactionSearchCriteria';
import { Page } from './Page';
import { TransactionGroup } from './TransactionGroup';
import * as http from 'http';
import { DtoMapping } from '../core/utils/DtoMapping';

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
     * @param transactionGroup - Transaction group.
     * @returns Observable<Transaction>
     */
    public getTransaction(transactionId: string, transactionGroup: TransactionGroup): Observable<Transaction> {
        return observableFrom(this.getTransactionByGroup(transactionId, transactionGroup)).pipe(
            map(({ body }) => CreateTransactionFromDTO(body)),
            catchError((error) => throwError(this.errorHandling(error))),
        );
    }

    /**
     * Gets an array of transactions for different transaction ids
     * @param transactionIds - Array of transactions id and/or hash.
     * @returns Observable<Transaction[]>
     */
    public getTransactionsById(transactionIds: string[]): Observable<Transaction[]> {
        const transactionIdsBody = {
            transactionIds,
        };
        return observableFrom(this.transactionRoutesApi.getTransactionsById(transactionIdsBody)).pipe(
            map(({ body }) =>
                body.map((transactionDTO) => {
                    return CreateTransactionFromDTO(transactionDTO);
                }),
            ),
            catchError((error) => throwError(this.errorHandling(error))),
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
        const cosignature = new Cosignature();
        cosignature.parentHash = cosignatureSignedTransaction.parentHash;
        cosignature.signerPublicKey = cosignatureSignedTransaction.signerPublicKey;
        cosignature.signature = cosignatureSignedTransaction.signature;
        cosignature.version = cosignatureSignedTransaction.version.toString();
        return observableFrom(this.transactionRoutesApi.announceCosignatureTransaction(cosignature)).pipe(
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
        return observableFrom(this.getTransactionByGroup(transactionId, TransactionGroup.Confirmed)).pipe(
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
                );
            }),
            catchError((error) => throwError(this.errorHandling(error))),
        );
    }

    /**
     * Returns an array of transactions.
     * @summary Get transactions
     * @param criteria Transaction search criteria
     * @returns {Observable<Page<Transaction>>}
     */
    public search(criteria: TransactionSearchCriteria): Observable<Page<Transaction>> {
        return this.call(this.searchTransactionByGroup(criteria), (body) =>
            super.toPage(body.pagination, body.data, CreateTransactionFromDTO),
        );
    }

    /**
     * @internal
     * Gets a transaction info
     * @param transactionId - Transaction id or hash.
     * @param transactionGroup - Transaction group.
     * @returns Promise<{response: http.ClientResponse; body: TransactionInfoDTO;}>
     */
    private getTransactionByGroup(
        transactionId: string,
        transactionGroup: TransactionGroup,
    ): Promise<{
        response: http.ClientResponse;
        body: TransactionInfoDTO;
    }> {
        switch (transactionGroup) {
            case TransactionGroup.Confirmed:
                return this.transactionRoutesApi.getConfirmedTransaction(transactionId);
            case TransactionGroup.Unconfirmed:
                return this.transactionRoutesApi.getUnconfirmedTransaction(transactionId);
            case TransactionGroup.Partial:
                return this.transactionRoutesApi.getPartialTransaction(transactionId);
        }
    }

    /**
     * @internal
     * Gets a transaction search result
     * @param transactionId - Transaction id or hash.
     * @param transactionGroup - Transaction group.
     * @returns Promise<{response: http.ClientResponse; body: TransactionInfoDTO;}>
     */
    private searchTransactionByGroup(
        criteria: TransactionSearchCriteria,
    ): Promise<{
        response: http.ClientResponse;
        body: TransactionPage;
    }> {
        switch (criteria.group) {
            case TransactionGroup.Confirmed:
                return this.transactionRoutesApi.searchConfirmedTransactions(
                    criteria.address?.plain(),
                    criteria.recipientAddress?.plain(),
                    criteria.signerPublicKey,
                    criteria.height?.toString(),
                    criteria.type?.map((type) => type.valueOf()),
                    criteria.embedded,
                    criteria.pageSize,
                    criteria.pageNumber,
                    criteria.offset,
                    DtoMapping.mapEnum(criteria.order),
                );
            case TransactionGroup.Unconfirmed:
                return this.transactionRoutesApi.searchUnconfirmedTransactions(
                    criteria.address?.plain(),
                    criteria.recipientAddress?.plain(),
                    criteria.signerPublicKey,
                    criteria.height?.toString(),
                    criteria.type?.map((type) => type.valueOf()),
                    criteria.embedded,
                    criteria.pageSize,
                    criteria.pageNumber,
                    criteria.offset,
                    DtoMapping.mapEnum(criteria.order),
                );
            case TransactionGroup.Partial:
                return this.transactionRoutesApi.searchPartialTransactions(
                    criteria.address?.plain(),
                    criteria.recipientAddress?.plain(),
                    criteria.signerPublicKey,
                    criteria.height?.toString(),
                    criteria.type?.map((type) => type.valueOf()),
                    criteria.embedded,
                    criteria.pageSize,
                    criteria.pageNumber,
                    criteria.offset,
                    DtoMapping.mapEnum(criteria.order),
                );
        }
    }
}
