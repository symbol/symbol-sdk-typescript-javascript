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

import { Observable } from 'rxjs';
import { MerkleStateInfo } from '../model/blockchain';
import { MosaicRestriction } from '../model/restriction/MosaicRestriction';
import { SearcherRepository } from './paginationStreamer';
import { RestrictionMosaicSearchCriteria } from './searchCriteria';

export interface RestrictionMosaicRepository extends SearcherRepository<MosaicRestriction, RestrictionMosaicSearchCriteria> {
    /**
     * Returns mosaic restrictions by composite hash
     *
     * @param compositeHash the composite hash
     * @return Observable<MosaicRestriction>
     */
    getMosaicRestrictions(compositeHash: string): Observable<MosaicRestriction>;

    /**
     * Returns mosaic restrictions by composite hash
     *
     * @param compositeHash the composite hash
     * @return Observable<MosaicRestriction>
     */
    getMosaicRestrictionsMerkle(compositeHash: string): Observable<MerkleStateInfo>;
}
