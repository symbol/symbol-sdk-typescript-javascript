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

import { Observable } from 'rxjs/internal/Observable';
import { Address } from '../model/account/Address';
import { MosaicId } from '../model/mosaic/MosaicId';
import { AccountRestrictionsInfo } from '../model/restriction/AccountRestrictionsInfo';
import { MosaicAddressRestriction } from '../model/restriction/MosaicAddressRestriction';
import { MosaicGlobalRestriction } from '../model/restriction/MosaicGlobalRestriction';

export interface RestrictionRepository {
    /**
     * Gets Account restrictions.
     * @param address list of addresses
     * @returns Observable<AccountRestrictionsInfo>
     */
    getAccountRestrictions(address: Address): Observable<AccountRestrictionsInfo>;

    /**
     * Gets Account restrictions.
     * @param addresses list of addresses
     * @returns Observable<AccountRestrictionsInfo[]>
     */
    getAccountRestrictionsFromAccounts(addresses: Address[]): Observable<AccountRestrictionsInfo[]>;

    /**
     * Get mosaic address restriction.
     * @summary Get mosaic address restrictions for a given mosaic and account identifier.
     * @param mosaicId Mosaic identifier.
     * @param address address
     * @returns Observable<MosaicAddressRestriction>
     */
    getMosaicAddressRestriction(mosaicId: MosaicId, address: Address): Observable<MosaicAddressRestriction>;

    /**
     * Get mosaic address restrictions.
     * @summary Get mosaic address restrictions for a given mosaic and account identifiers array
     * @param mosaicId Mosaic identifier.
     * @param addresses list of addresses
     * @returns Observable<MosaicAddressRestriction[]>
     */
    getMosaicAddressRestrictions(mosaicId: MosaicId, address: Address[]): Observable<MosaicAddressRestriction[]>;

    /**
     * Get mosaic global restriction.
     * @summary Get mosaic global restrictions for a given mosaic identifier.
     * @param mosaicId Mosaic identifier.
     * @returns Observable<MosaicGlobalRestriction>
     */
    getMosaicGlobalRestriction(mosaicId: MosaicId): Observable<MosaicGlobalRestriction>;

    /**
     * Get mosaic global restrictions.
     * @summary Get mosaic global restrictions for a given list of mosaics.
     * @param mosaicIds List of mosaic identifier.
     * @returns Observable<MosaicGlobalRestriction[]>
     */
    getMosaicGlobalRestrictions(mosaicIds: MosaicId[]): Observable<MosaicGlobalRestriction[]>;
}
