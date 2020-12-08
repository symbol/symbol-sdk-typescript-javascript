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
import { AddressResolutionStatement, MosaicIdResolutionStatement, TransactionStatement } from '../../model/receipt';
import { Page } from '../Page';
import { ReceiptRepository } from '../ReceiptRepository';
import { ResolutionStatementSearchCriteria, TransactionStatementSearchCriteria } from '../searchCriteria';
import { PaginationStreamer } from './PaginationStreamer';

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
        return new PaginationStreamer<TransactionStatement, TransactionStatementSearchCriteria>({
            search(criteria: TransactionStatementSearchCriteria): Observable<Page<TransactionStatement>> {
                return repository.searchReceipts(criteria);
            },
        });
    }

    /**
     * It creates a transaction statement streamer of AddressResolutionStatement objects.
     *
     * @param repository the {@link ReceiptRepository} repository
     * @return a new Pagination Streamer.
     */
    public static addressResolutionStatements(
        repository: ReceiptRepository,
    ): PaginationStreamer<AddressResolutionStatement, ResolutionStatementSearchCriteria> {
        return new PaginationStreamer<AddressResolutionStatement, ResolutionStatementSearchCriteria>({
            search(criteria: ResolutionStatementSearchCriteria): Observable<Page<AddressResolutionStatement>> {
                return repository.searchAddressResolutionStatements(criteria);
            },
        });
    }

    /**
     * It creates a mosaic resolution statement streamer of MosaicResolutionStatement objects.
     *
     * @param repository the {@link ReceiptRepository} repository
     * @return a new Pagination Streamer.
     */
    public static mosaicResolutionStatements(
        repository: ReceiptRepository,
    ): PaginationStreamer<MosaicIdResolutionStatement, ResolutionStatementSearchCriteria> {
        return new PaginationStreamer<MosaicIdResolutionStatement, ResolutionStatementSearchCriteria>({
            search(criteria: ResolutionStatementSearchCriteria): Observable<Page<MosaicIdResolutionStatement>> {
                return repository.searchMosaicResolutionStatements(criteria);
            },
        });
    }
}
