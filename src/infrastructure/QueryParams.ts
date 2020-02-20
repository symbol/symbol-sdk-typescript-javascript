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

import { TransactionType } from '../model/transaction/TransactionType';

 /**
  * @since 0.11.3
  */
export enum Order {
    ASC = 'id',
    DESC = '-id',
}

/**
 * The query params structure describes pagination params for requests.
 *
 * @since 1.0
 */
export class QueryParams {
    /**
     * Page size between 10 and 100, otherwise 10
     */
    public pageSize = 10;
    /**
     * Order of transactions.
     * DESC. Newer to older.
     * ASC. Older to newer.
     */

    public order: Order = Order.DESC;

    /**
     * Id after which we want objects to be returned
     */
    public id?: string;

    /**
     * Creates an instance of QueryParams.
     * @param {{
     *         pageSize?: number,
     *         order?: Order,
     *         id?: string;
     *     }} configuration arguments
     */
    constructor(args: {
        pageSize?: number,
        order?: Order,
        id?: string;
    }) {
        if (args.pageSize) this.setPageSize(args.pageSize)
        if (args.order) this.setOrder(Order[args.order])
        if (args.id) this.setId(args.id)
    }

    public setPageSize(pageSize: number): QueryParams {
        this.pageSize = (pageSize >= 10 && pageSize <= 100) ? pageSize : 10;
        return this;
    }

    public setId(id?: string): QueryParams {
        this.id = id;
        return this;
    }

    public setOrder(order: Order = Order.DESC): QueryParams {
        this.order = order;
        return this;
    }
}
