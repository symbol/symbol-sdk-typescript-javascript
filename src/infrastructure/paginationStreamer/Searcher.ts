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
import { Page } from '../Page';
import { SearchCriteria } from '../searchCriteria/SearchCriteria';

/**
 *  Objects of this interface know how to search symbol objects based on a criteria returning a page of these objects.
 * @param <E> The entity model type
 * @param <C> The type of the criteria with the search filter
 */
export interface Searcher<E, C extends SearchCriteria> {
    /**
     * It searches entities of a type based on a criteria.
     *
     * @param criteria the criteria
     * @return a page of entities.
     */
    search(criteria: C): Observable<Page<E>>;
}
