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
import { Address } from '../model/account/Address';
import { MosaicId } from '../model/mosaic/MosaicId';
import { MosaicInfo } from '../model/mosaic/MosaicInfo';

/**
 * Mosaic interface repository.
 *
 * @since 1.0
 */
export interface MosaicRepository {
    /**
     * Gets a MosaicInfo for a given mosaicId
     * @param mosaicId - Mosaic id
     * @returns Observable<MosaicInfo>
     */
    getMosaic(mosaicId: MosaicId): Observable<MosaicInfo>;

    /**
     * Gets MosaicInfo for different mosaicIds.
     * @param mosaicIds - Array of mosaic ids
     * @returns Observable<MosaicInfo[]>
     */
    getMosaics(mosaicIds: MosaicId[]): Observable<MosaicInfo[]>;

    /**
     * Gets mosaics created for a given address.
     * @summary Get mosaics created for given address
     * @param address Address
     */
    getMosaicsFromAccount(address: Address): Observable<MosaicInfo[]>;

    /**
     * Gets mosaics created for a given array of addresses.
     * @summary Get mosaics created for given array of addresses
     * @param addresses Address
     */
    getMosaicsFromAccounts(addresses: Address[]): Observable<MosaicInfo[]>;
}
