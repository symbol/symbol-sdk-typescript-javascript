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

import { AccountRestrictions } from '../../model/restriction';
import { RestrictionAccountSearchCriteria } from '../searchCriteria/RestrictionAccountSearchCriteria';
import { PaginationStreamer } from './PaginationStreamer';
import { Searcher } from './Searcher';

/**
 * A helper object that streams {@link AccountRestrictions} using the search.
 */
export class RestrictionAccountPaginationStreamer extends PaginationStreamer<AccountRestrictions, RestrictionAccountSearchCriteria> {
    /**
     * Constructor
     *
     * @param searcher the account repository that will perform the searches
     */
    constructor(searcher: Searcher<AccountRestrictions, RestrictionAccountSearchCriteria>) {
        super(searcher);
    }
}
