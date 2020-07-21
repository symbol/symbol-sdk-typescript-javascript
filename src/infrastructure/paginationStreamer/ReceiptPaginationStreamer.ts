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
import { ResolutionStatementSearchCriteria } from '../searchCriteria/ResolutionStatementSearchCriteria';
import { ResolutionStatement } from '../../model/receipt/ResolutionStatement';
import { TransactionStatement } from '../../model/receipt/TransactionStatement';
import { TransactionStatementSearchCriteria } from '../searchCriteria/TransactionStatementSearchCriteria';
import { ReceiptRepository } from '../ReceiptRepository';
import { UnresolvedAddress, UnresolvedMosaicId } from '../../model/model';

/**
 * A helper object that streams {@link Statement} using the search.
 */
export class ReceiptPaginationStreamer {
    /**
     * It creates a transaction statement streamer of TransactionStatement objects.
     *
     * @param repository the {@link ReceiptRepository} repository
     * @return a new Pagination Streamer.
     */
    public static transactionStatements(
        repository: ReceiptRepository,
    ): PaginationStreamer<TransactionStatement, TransactionStatementSearchCriteria> {
        return new PaginationStreamer<TransactionStatement, TransactionStatementSearchCriteria>((criteria) =>
            repository.searchReceipts(criteria),
        );
    }

    /**
     * It creates a transaction statement streamer of AddressResolutionStatement objects.
     *
     * @param repository the {@link ReceiptRepository} repository
     * @return a new Pagination Streamer.
     */
    public static addresseResolutionStatements(
        repository: ReceiptRepository,
    ): PaginationStreamer<ResolutionStatement<UnresolvedAddress>, ResolutionStatementSearchCriteria> {
        return new PaginationStreamer<ResolutionStatement<UnresolvedAddress>, ResolutionStatementSearchCriteria>((criteria) =>
            repository.searchAddressResolutionStatements(criteria),
        );
    }

    /**
     * It creates a mosaic resolution statement streamer of MosaicResolutionStatement objects.
     *
     * @param repository the {@link ReceiptRepository} repository
     * @return a new Pagination Streamer.
     */
    public static mosaicResolutionStatements(
        repository: ReceiptRepository,
    ): PaginationStreamer<ResolutionStatement<UnresolvedMosaicId>, ResolutionStatementSearchCriteria> {
        return new PaginationStreamer<ResolutionStatement<UnresolvedMosaicId>, ResolutionStatementSearchCriteria>((criteria) =>
            repository.searchMosaicResolutionStatements(criteria),
        );
    }
}
