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

import { Observable } from 'rxjs/internal/Observable';
import { MosaicAddressRestriction } from '../../model/restriction/MosaicAddressRestriction';
import { MosaicGlobalRestriction } from '../../model/restriction/MosaicGlobalRestriction';
import { Page } from '../Page';
import { RestrictionMosaicRepository } from '../RestrictionMosaicRepository';
import { RestrictionMosaicSearchCriteria } from '../searchCriteria/RestrictionMosaicSearchCriteria';
import { PaginationStreamer } from './PaginationStreamer';

/**
 * A helper object that streams {@link RestrictionMosaic} using the search.
 */
export class RestrictionMosaicPaginationStreamer {
    /**
     * It creates a restriction mosaic streamer of MosaicRestriction objects.
     *
     * @param repository the {@link RestrictionMosaicRepository} repository
     * @return a new Pagination Streamer.
     */
    public static MosaicRestrictions(
        repository: RestrictionMosaicRepository,
    ): PaginationStreamer<MosaicAddressRestriction | MosaicGlobalRestriction, RestrictionMosaicSearchCriteria> {
        return new PaginationStreamer<MosaicAddressRestriction | MosaicGlobalRestriction, RestrictionMosaicSearchCriteria>({
            search(criteria: RestrictionMosaicSearchCriteria): Observable<Page<MosaicAddressRestriction | MosaicGlobalRestriction>> {
                return repository.searchMosaicRestrictions(criteria);
            },
        });
    }
}
