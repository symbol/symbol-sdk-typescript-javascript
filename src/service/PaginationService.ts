/*
 * Copyright 2020 NEM
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

import { concat, defer, from, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AccountRepository } from '../infrastructure/AccountRepository';
import { BlockRepository } from '../infrastructure/BlockRepository';
import { Order, QueryParams } from '../infrastructure/QueryParams';
import { RepositoryFactory } from '../infrastructure/RepositoryFactory';
import { TransactionFilter } from '../infrastructure/TransactionFilter';
import { Address } from '../model/account/Address';
import { Transaction } from '../model/transaction/Transaction';
import { UInt64 } from '../model/UInt64';
import { IPaginationService } from './interfaces/IPaginationService';

/**
 * Transaction Service
 */
export class PaginationService implements IPaginationService {

    private readonly accountRepository: AccountRepository;
    private readonly blockRepository: BlockRepository;
    private readonly getTransactionIdCallback = (entity: Transaction) => entity.transactionInfo!.id;

    constructor(private readonly repositoryFactory: RepositoryFactory) {
        this.accountRepository = this.repositoryFactory.createAccountRepository();
        this.blockRepository = this.repositoryFactory.createBlockRepository();
    }

    getAccountTransactions(address: Address, transactionFilter?: TransactionFilter, order?: Order): Observable<Transaction> {
        const readPageCallback = (queryParams: QueryParams) => {
            return this.accountRepository.getAccountTransactions(address, queryParams, transactionFilter);
        };
        return this.getPageReader(readPageCallback, this.getTransactionIdCallback, order);
    }

    getAccountPartialTransactions(address: Address, transactionFilter?: TransactionFilter, order?: Order):
        Observable<Transaction> {
        const readPageCallback = (queryParams: QueryParams) => {
            return this.accountRepository.getAccountPartialTransactions(address, queryParams, transactionFilter);
        };
        return this.getPageReader(readPageCallback, this.getTransactionIdCallback, order);
    }

    getAccountUnconfirmedTransactions(address: Address, transactionFilter?: TransactionFilter, order?: Order):
        Observable<Transaction> {
        const readPageCallback = (queryParams: QueryParams) => {
            return this.accountRepository.getAccountUnconfirmedTransactions(address, queryParams, transactionFilter);
        };
        return this.getPageReader(readPageCallback, this.getTransactionIdCallback, order);
    }

    getAccountIncomingTransactions(address: Address, transactionFilter?: TransactionFilter, order?: Order):
        Observable<Transaction> {
        const readPageCallback = (queryParams: QueryParams) => {
            return this.accountRepository.getAccountIncomingTransactions(address, queryParams, transactionFilter);
        };
        return this.getPageReader(readPageCallback, this.getTransactionIdCallback, order);
    }

    getAccountOutgoingTransactions(address: Address, transactionFilter?: TransactionFilter, order?: Order):
        Observable<Transaction> {
        const readPageCallback = (queryParams: QueryParams) => {
            return this.accountRepository.getAccountOutgoingTransactions(address, queryParams, transactionFilter);
        };
        return this.getPageReader(readPageCallback, this.getTransactionIdCallback, order);
    }

    getBlockTransactions(height: UInt64, order?: Order):
        Observable<Transaction> {
        const readPageCallback = (queryParams: QueryParams) => {
            return this.blockRepository.getBlockTransactions(height, queryParams);
        };
        return this.getPageReader(readPageCallback, this.getTransactionIdCallback, order);
    }

    private getPageReader<T>(
        readPageCallback: (queryParams: QueryParams) => Observable<T[]>,
        getIdCallback: (entity: T) => string,
        order?: Order,
        lastIdRead?: string,
    ): Observable<T> {
        // getPageReader will change when we change how pages are read.
        // We may use page index/number instead of last id read
        // getPageReader can be used for entities of other types like Account, Namespace,
        // Mosaic etc once they support pagination
        // getIdCallback won't be necessary when using generic pageIndex/pageNumber instead of entity driven lastIdRead ids.
        //
        // https://stackoverflow.com/questions/35254323/rxjs-observable-pagination
        const pageSize = 10;
        const queryParams = new QueryParams({
            pageSize,
            id: lastIdRead,
            order,
        });
        return defer(() => readPageCallback(queryParams)).pipe(
            mergeMap((entities) => {
                    if (entities.length < pageSize) {
                        return from(entities);
                    } else {
                        const lastEntityId = getIdCallback(entities[entities.length - 1]);
                        return concat(from(entities), this.getPageReader(readPageCallback, getIdCallback, order, lastEntityId));
                    }
                }
            )
        );
    }

}
