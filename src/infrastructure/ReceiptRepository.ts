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

import { Searcher } from './paginationStreamer/Searcher';
import { ReceiptSearchCriteria, ResolutionStatementSearchCriteria } from './searchCriteria/ResolutionStatementSearchCriteria';
import { TransactionStatement } from '../model/receipt/TransactionStatement';
import { ResolutionStatement } from '../model/receipt/ResolutionStatement';
import { Observable } from 'rxjs';
import { Page } from './Page';
import { TransactionStatementSearchCriteria } from './searchCriteria/TransactionStatementSearchCriteria';
import { UnresolvedAddress, UnresolvedMosaicId } from '../model/model';

/**
 * Receipt interface repository.
 *
 * @since 1.0
 */
// export type ReceiptRepository = Searcher<ResolutionStatement | TransactionStatement, ReceiptSearchCriteria>;

export interface ReceiptRepository {
    /**
     * Returns a transaction statements page based on the criteria.
     *
     * @param criteria the criteria
     * @return a page of {@link TransactionStatement}
     */
    searchReceipts(criteria: TransactionStatementSearchCriteria): Observable<Page<TransactionStatement>>;

    /**
     * Returns an addresses resolution statements page based on the criteria.
     *
     * @param criteria the criteria
     * @return a page of {@link AddressResolutionStatement}
     */
    searchAddressResolutionStatements(
        criteria: ResolutionStatementSearchCriteria,
    ): Observable<Page<ResolutionStatement<UnresolvedAddress>>>;

    /**
     * Returns an mosaic resoslution statements page based on the criteria.
     *
     * @param criteria the criteria
     * @return a page of {@link MosaicResolutionStatement}
     */
    searchMosaicResolutionStatements(
        criteria: ResolutionStatementSearchCriteria,
    ): Observable<Page<ResolutionStatement<UnresolvedMosaicId>>>;
}
