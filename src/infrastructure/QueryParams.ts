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
     * Constructor
     * @param pageSize
     * @param id
     */
    constructor(
                /**
                 * Page size between 10 and 100, otherwise 10
                 */
                public readonly pageSize: number,
                /**
                 * Id after which we want objects to be returned
                 */
                public readonly id?: string,
                /**
                 * Order of transactions.
                 * DESC. Newer to older.
                 * ASC. Older to newer.
                 */
                public readonly order: Order = Order.DESC,
                ) {
        this.pageSize = (pageSize >= 10 && pageSize <= 100) ? pageSize : 10;
        this.id = id;
    }
}
