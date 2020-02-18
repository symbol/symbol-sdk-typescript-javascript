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

import { TransactionType } from '../model/transaction/TransactionType';
import { QueryParams } from './QueryParams';

 /**
  * Transaction search criteria for filtering transaction list
  */
export class TransactionSearchCriteria extends QueryParams {
    /**
     * Transaction type filter
     */
    public type?: string;
    /**
     * Constructor
     * @param pageSize
     * @param id
     */
    constructor() {
        super();
    }

    public setTransactionTypes(transactionTypes?: TransactionType[]): TransactionSearchCriteria {
        if (!transactionTypes || transactionTypes.length === 0) {
            this.type = undefined;
        } else {
            this.type = transactionTypes.map((type) => type.valueOf().toString()).join(',');
        }
        return this;
    }
}
