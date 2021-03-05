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
import { mergeMap } from 'rxjs/operators';
import {
    BlockInfoDTO,
    BlockRoutesApi,
    TransactionInfoDTO,
    TransactionPage,
    TransactionRoutesApi,
} from 'symbol-openapi-typescript-fetch-client';
import { DtoMapping } from '../core/utils';
import {
    CosignatureSignedTransaction,
    SignedTransaction,
    Transaction,
    TransactionAnnounceResponse,
    TransactionInfo,
    TransactionType,
} from '../model/transaction';
import { Http } from './Http';
import { Page } from './Page';
import { TransactionPaginationStreamer } from './paginationStreamer';
import { TransactionSearchCriteria } from './searchCriteria';
import { CreateTransactionFromDTO } from './transaction';
import { TransactionGroup } from './TransactionGroup';
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
     * @param url Base catapult-rest url
     * @param fetchApi fetch function to be used when performing rest requests.
     */
    constructor(url: string, fetchApi?: any) {
        super(url, fetchApi);
        this.transactionRoutesApi = new TransactionRoutesApi(this.config());
        this.blockRoutesApi = new BlockRoutesApi(this.config());
    }

    /**
     * Gets a transaction for a transactionId
     * @param transactionId - Transaction id or hash.
     * @param transactionGroup - Transaction group.
     * @returns Observable<Transaction>
     */
    public getTransaction(transactionId: string, transactionGroup: TransactionGroup): Observable<Transaction> {
        return this.call(this.getTransactionByGroup(transactionId, transactionGroup), (body) => CreateTransactionFromDTO(body));
    }

    /**
     * Gets an array of transactions for different transaction ids
     * @param transactionIds - Array of transactions id and/or hash.
     * @param transactionGroup - Transaction group.
     * @returns Observable<Transaction[]>
     */
    public getTransactionsById(transactionIds: string[], transactionGroup: TransactionGroup): Observable<Transaction[]> {
        const transactionIdsBody = {
            transactionIds,
        };

        switch (transactionGroup) {
            case TransactionGroup.Confirmed:
                return this.call(this.transactionRoutesApi.getConfirmedTransactions(transactionIdsBody), (body) =>
                    body.map((transactionDTO) => {
                        return CreateTransactionFromDTO(transactionDTO);
                    }),
                );
            case TransactionGroup.Unconfirmed:
                return this.call(this.transactionRoutesApi.getUnconfirmedTransactions(transactionIdsBody), (body) =>
                    body.map((transactionDTO) => {
                        return CreateTransactionFromDTO(transactionDTO);
                    }),
                );
            case TransactionGroup.Partial:
                return this.call(this.transactionRoutesApi.getPartialTransactions(transactionIdsBody), (body) =>
                    body.map((transactionDTO) => {
                        return CreateTransactionFromDTO(transactionDTO);
                    }),
                );
        }
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
        return this.call(
            this.transactionRoutesApi.announceTransaction(signedTransaction),
            (body) => new TransactionAnnounceResponse(body.message),
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
        return this.call(
            this.transactionRoutesApi.announcePartialTransaction(signedTransaction),
            (body) => new TransactionAnnounceResponse(body.message),
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
        const cosignature = {
            parentHash: cosignatureSignedTransaction.parentHash,
            signerPublicKey: cosignatureSignedTransaction.signerPublicKey,
            signature: cosignatureSignedTransaction.signature,
            version: cosignatureSignedTransaction.version.toString(),
        };
        return this.call(
            this.transactionRoutesApi.announceCosignatureTransaction(cosignature),
            (body) => new TransactionAnnounceResponse(body.message),
        );
    }

    /**
     * Gets a transaction's effective paid fee
     * @param transactionId - Transaction id or hash.
     * @returns Observable<number>
     */
    public getTransactionEffectiveFee(transactionId: string): Observable<number> {
        return this.call(this.getTransactionByGroup(transactionId, TransactionGroup.Confirmed), CreateTransactionFromDTO).pipe(
            mergeMap((transaction) => {
                // now read block details
                return this.call(
                    this.blockRoutesApi.getBlockByHeight((transaction.transactionInfo as TransactionInfo).height.toString()),
                    (blockDTO: BlockInfoDTO) => {
                        // @see https://nemtech.github.io/concepts/transaction.html#fees
                        // effective_fee = feeMultiplier x transaction::size
                        return blockDTO.block.feeMultiplier * transaction.size;
                    },
                );
            }),
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
    public streamer(): TransactionPaginationStreamer {
        return new TransactionPaginationStreamer(this);
    }

    /**
     * @internal
     * Gets a transaction info
     * @param transactionId - Transaction id or hash.
     * @param transactionGroup - Transaction group.
     * @returns Promise<{response: http.ClientResponse; body: TransactionInfoDTO;}>
     */
    private getTransactionByGroup(transactionId: string, transactionGroup: TransactionGroup): Promise<TransactionInfoDTO> {
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
     * @param criteria - the criteria.
     * @returns Promise<{response: http.ClientResponse; body: TransactionInfoDTO;}>
     */
    private searchTransactionByGroup(criteria: TransactionSearchCriteria): Promise<TransactionPage> {
        switch (criteria.group) {
            case TransactionGroup.Confirmed:
                return this.transactionRoutesApi.searchConfirmedTransactions(
                    criteria.address?.plain(),
                    criteria.recipientAddress?.plain(),
                    criteria.signerPublicKey,
                    criteria.height?.toString(),
                    criteria.fromHeight?.toString(),
                    criteria.toHeight?.toString(),
                    criteria.fromTransferAmount?.toString(),
                    criteria.toTransferAmount?.toString(),
                    criteria.type?.map((type) => type.valueOf()),
                    criteria.embedded,
                    criteria.transferMosaicId?.toHex(),
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
                    criteria.fromHeight?.toString(),
                    criteria.toHeight?.toString(),
                    criteria.fromTransferAmount?.toString(),
                    criteria.toTransferAmount?.toString(),
                    criteria.type?.map((type) => type.valueOf()),
                    criteria.embedded,
                    criteria.transferMosaicId?.toHex(),
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
                    criteria.fromHeight?.toString(),
                    criteria.toHeight?.toString(),
                    criteria.fromTransferAmount?.toString(),
                    criteria.toTransferAmount?.toString(),
                    criteria.type?.map((type) => type.valueOf()),
                    criteria.embedded,
                    criteria.transferMosaicId?.toHex(),
                    criteria.pageSize,
                    criteria.pageNumber,
                    criteria.offset,
                    DtoMapping.mapEnum(criteria.order),
                );
        }
    }
}
