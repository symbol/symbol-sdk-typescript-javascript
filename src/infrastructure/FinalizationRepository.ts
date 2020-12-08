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
import { FinalizationProof } from '../model/finalization/FinalizationProof';
import { UInt64 } from '../model/UInt64';

/**
 * Finalization interface repository.
 *
 * @since 1.0
 */
export interface FinalizationRepository {
    /**
     * Gets finalization proof for the greatest height associated with the given epoch.
     * @param epoch Finalization epoch
     * @returns Observable<UInt64>
     */
    getFinalizationProofAtEpoch(epoch: number): Observable<FinalizationProof>;

    /**
     * Gets finalization proof at the given height.
     * @param height Block height
     * @returns Observable<BlockchainScore>
     */
    getFinalizationProofAtHeight(height: UInt64): Observable<FinalizationProof>;
}
