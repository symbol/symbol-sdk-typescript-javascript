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

import { Order } from './Order';

export interface SearchCriteria {
    /**
     * Sort responses in ascending or descending order based on the collection property set on the
     * param ''order''. If the request does not specify ''order'', REST returns the collection
     * ordered by id. (optional)
     */
    order?: Order;

    /**
     * Number of entities to return for each request. (optional)
     */
    pageSize?: number;

    /**
     * Filter by page number. (optional)
     */
    pageNumber?: number;

    /**
     * Entry id at which to start pagination. If the ordering parameter is set to -id, the elements
     * returned precede the identifier. Otherwise, newer elements with respect to the id are
     * returned. (optional)
     */
    offset?: string;
}
