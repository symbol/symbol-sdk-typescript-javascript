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

import { Observable } from 'rxjs';
import { Order } from '../../infrastructure/QueryParams';
import { TransactionFilter } from '../../infrastructure/TransactionFilter';
import { Address } from '../../model/account/Address';
import { Transaction } from '../../model/transaction/Transaction';
import { UInt64 } from '../../model/UInt64';

/**
 * pagination Service Interface
 */
export interface IPaginationService {

    getAccountTransactions(address: Address, transactionFilter?: TransactionFilter, order?: Order): Observable<Transaction>;

    getAccountPartialTransactions(address: Address, transactionFilter?: TransactionFilter, order?: Order):
        Observable<Transaction>;

    getAccountUnconfirmedTransactions(address: Address, transactionFilter?: TransactionFilter, order?: Order):
        Observable<Transaction>;

    getAccountIncomingTransactions(address: Address, transactionFilter?: TransactionFilter, order?: Order):
        Observable<Transaction>;

    getAccountOutgoingTransactions(address: Address, transactionFilter?: TransactionFilter, order?: Order):
        Observable<Transaction>;

    getBlockTransactions(height: UInt64, order?: Order):
        Observable<Transaction>;
}
