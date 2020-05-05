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

import { Order } from 'symbol-openapi-typescript-node-client/dist/model/order';

/**
 * Basic option used to search pages of entities.
 * - orderBy: default - 'desc`
 * - pageSize: default - 10
 * - pageNumber: default -1
 */
export class SearchCriteria {
    /**
     * Sort responses in ascending or descending order based on the collection property set on the
     * param ''orderBy''. If the request does not specify ''orderBy'', REST returns the collection
     * ordered by id.  (optional, default to desc)
     */
    orderBy?: Order;

    /**
     * Number of entities to return for each request. (optional, default to 10)
     */
    pageSize?: number;

    /**
     * Filter by page number. (optional, default to 1)
     */
    pageNumber?: number;
}
