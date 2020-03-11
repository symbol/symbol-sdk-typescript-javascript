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

import { toArray } from 'rxjs/operators';
import { Order } from '../../src/infrastructure/QueryParams';
import { TransactionRepository } from '../../src/infrastructure/TransactionRepository';
import { Account } from '../../src/model/account/Account';
import { NetworkType } from '../../src/model/network/NetworkType';
import { UInt64 } from '../../src/model/UInt64';
import { IPaginationService } from '../../src/service/interfaces/IPaginationService';
import { PaginationService } from '../../src/service/PaginationService';
import { IntegrationTestHelper } from '../infrastructure/IntegrationTestHelper';

describe('PaginationService', () => {
    const helper = new IntegrationTestHelper();
    let generationHash: string;
    let account: Account;
    let account2: Account;
    let account3: Account;
    let cosignAccount4: Account;
    let networkType: NetworkType;
    let paginationService: IPaginationService;
    let transactionRepository: TransactionRepository;

    before(() => {
        return helper.start().then(() => {
            account = helper.account;
            account2 = helper.account2;
            account3 = helper.account3;
            cosignAccount4 = helper.cosignAccount4;
            generationHash = helper.generationHash;
            networkType = helper.networkType;
            transactionRepository = helper.repositoryFactory.createTransactionRepository();
            paginationService = new PaginationService(helper.repositoryFactory);
        });
    });
    before(() => {
        return helper.listener.open();
    });

    after(() => {
        helper.listener.close();
    });

    it('getAccountTransactionsAsc', async () => {
        const accountTransactions = paginationService.getAccountTransactions(helper.account.address, undefined, Order.ASC);
        // Note toArray() puts all the transactions of all the pages into one array but you can do other stuff like filtering, peek 1, etc.
        const transactions = await accountTransactions.pipe(toArray()).toPromise();
        console.log(transactions.length);
        console.log(transactions.map((t) => t.transactionInfo!.id));
    });

    it('getAccountTransactionsDesc', async () => {
        const accountTransactions = paginationService.getAccountTransactions(helper.account.address,undefined, Order.DESC);
        // Note toArray() puts all the transactions of all the pages into one array but you can do other stuff like filtering, peek 1, etc.
        const transactions = await accountTransactions.pipe(toArray()).toPromise();
        console.log(transactions.length);
        console.log(transactions.map((t) => t.transactionInfo!.id));
    });

    it('getBlockTransactionsAsc', async () => {
        const accountTransactions = paginationService.getBlockTransactions(UInt64.fromNumericString('1'), Order.ASC);
        // Note toArray() puts all the transactions of all the pages into one array but you can do other stuff like filtering, peek 1, etc.
        const transactions = await accountTransactions.pipe(toArray()).toPromise();
        console.log(transactions.length);
        console.log(transactions.map((t) => t.transactionInfo!.id));
    });

    it('getBlockTransactionsDesc', async () => {
        const accountTransactions = paginationService.getBlockTransactions(UInt64.fromNumericString('1'), Order.DESC);
        // Note toArray() puts all the transactions of all the pages into one array but you can do other stuff like filtering, peek 1, etc.
        const transactions = await accountTransactions.pipe(toArray()).toPromise();
        console.log(transactions.length);
        console.log(transactions.map((t) => t.transactionInfo!.id));
    });
});
