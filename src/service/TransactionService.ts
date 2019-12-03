/*
 * Copyright 2019 NEM
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

import {Observable} from 'rxjs';
import { mergeMap, toArray} from 'rxjs/operators';
import { ReceiptHttp } from '../infrastructure/ReceiptHttp';
import { TransactionHttp } from '../infrastructure/TransactionHttp';
import { Transaction } from '../model/transaction/Transaction';
import { ITransactionService } from './interfaces/ITransactionService';

/**
 * Transaction Service
 */
export class TransactionService implements ITransactionService {

    private readonly transactionHttp: TransactionHttp;
    private readonly receiptHttp: ReceiptHttp;
    /**
     * Constructor
     * @param url Base catapult-rest url
     */
    constructor(url: string) {
        this.transactionHttp = new TransactionHttp(url);
        this.receiptHttp = new ReceiptHttp(url);
    }

    /**
     * @param transationHashes List of transaction hashes.
     * @returns Observable<Transaction[]>
     */
    public resolveAliases(transationHashes: string[]): Observable<Transaction[]> {
        return this.transactionHttp.getTransactions(transationHashes).pipe(
                mergeMap((_) => _),
                mergeMap((transaction) => transaction.resolveAliases(this.receiptHttp)),
                toArray(),
            );
    }
}
