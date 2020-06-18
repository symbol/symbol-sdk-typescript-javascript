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

import { from as observableFrom, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TransactionStatusRoutesApi, TransactionStatusDTO } from 'symbol-openapi-typescript-node-client';
import { Deadline } from '../model/transaction/Deadline';
import { TransactionStatus } from '../model/transaction/TransactionStatus';
import { UInt64 } from '../model/UInt64';
import { Http } from './Http';
import { TransactionStatusRepository } from './TransactionStatusRepository';

/**
 * Transaction status http repository.
 *
 * @since 1.0
 */
export class TransactionStatusHttp extends Http implements TransactionStatusRepository {
    /**
     * @internal
     * Symbol openapi typescript-node client transaction status routes api
     */
    private transactionStatusRoutesApi: TransactionStatusRoutesApi;

    /**
     * Constructor
     * @param url
     */
    constructor(url: string) {
        super(url);
        this.transactionStatusRoutesApi = new TransactionStatusRoutesApi(url);
    }

    /**
     * Gets a transaction status for a transaction hash
     * @param transactionHash - Transaction hash.
     * @returns Observable<TransactionStatus>
     */
    public getTransactionStatus(transactionHash: string): Observable<TransactionStatus> {
        return observableFrom(this.transactionStatusRoutesApi.getTransactionStatus(transactionHash)).pipe(
            map(({ body }) => this.toTransactionStatus(body)),
            catchError((error) => throwError(this.errorHandling(error))),
        );
    }

    /**
     * Gets an array of transaction status for different transaction hashes
     * @param transactionHashes - Array of transaction hash
     * @returns Observable<TransactionStatus[]>
     */
    public getTransactionStatuses(transactionHashes: string[]): Observable<TransactionStatus[]> {
        const transactionHashesBody = {
            hashes: transactionHashes,
        };
        return observableFrom(this.transactionStatusRoutesApi.getTransactionStatuses(transactionHashesBody)).pipe(
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
}
