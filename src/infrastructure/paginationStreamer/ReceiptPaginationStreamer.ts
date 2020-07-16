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

import { PaginationStreamer } from './PaginationStreamer';
import { Searcher } from './Searcher';
import { ReceiptSearchCriteria } from '../searchCriteria/ReceiptSearchCriteria';
import { ResolutionStatement } from '../../model/receipt/ResolutionStatement';
import { TransactionStatement } from '../../model/receipt/TransactionStatement';

/**
 * A helper object that streams {@link Statement} using the search.
 */
export class ReceiptPaginationStreamer extends PaginationStreamer<ResolutionStatement | TransactionStatement, ReceiptSearchCriteria> {
    /**
     * Constructor
     *
     * @param searcher the receipt repository that will perform the searches
     */
    constructor(searcher: Searcher<ResolutionStatement | TransactionStatement, ReceiptSearchCriteria>) {
        super(searcher);
    }
}
