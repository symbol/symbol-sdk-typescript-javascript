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

import { concat, Observable } from 'rxjs';
import { defer } from 'rxjs/internal/observable/defer';
import { from } from 'rxjs/internal/observable/from';
import { mergeMap } from 'rxjs/operators';
import { SearchCriteria } from '../searchCriteria/SearchCriteria';
import { Searcher } from './Searcher';

/**
 * Utility helper that stream pages of searches into an Observable.
 *
 * A streamer will help users to walk through searches without knowing the underlying pagination implementation.
 */
export class PaginationStreamer<E, C extends SearchCriteria> {
    /**
     * Constructor
     *
     * @param searcher the searcher repository
     */
    constructor(
        /**
         * The search method, likely to be the search method of entity's repository
         */
        private readonly searcher: Searcher<E, C>,
    ) {}

    /**
     * Main method of the helper, it streams the results in observable only loading the pages when necessary.
     *
     * @param criteria the criteria
     * @return the observable of entities.
     */
    public search(criteria: C): Observable<E> {
        return this.searchInternal(criteria, 1);
    }

    private searchInternal(criteria: C, pageNumber: number): Observable<E> {
        criteria.pageNumber = pageNumber;
        return defer(() => {
            const observable = this.searcher.search(criteria);
            return observable.pipe(
                mergeMap((page) => {
                    if (page.isLastPage) {
                        return from(page.data);
                    } else {
                        return concat(from(page.data), this.searchInternal(criteria, pageNumber + 1));
                    }
                }),
            );
        });
    }
}

/**
 * An object that knows how to create a stremer.
 */
export interface StreamerFactory<E, C extends SearchCriteria> {
    /**
     * It creates a streamer for this searcher.
     */
    streamer(): PaginationStreamer<E, C>;
}

/**
 * An object that knows how to create a stremer from it's own searcher.
 */
export interface SearcherRepository<E, C extends SearchCriteria> extends StreamerFactory<E, C>, Searcher<E, C> {}
