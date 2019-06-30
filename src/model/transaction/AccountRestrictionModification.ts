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

import { Address } from '../account/Address';
import { RestrictionModificationType } from '../account/RestrictionModificationType';
import { MosaicId } from '../mosaic/MosaicId';
import { TransactionType } from './TransactionType';

export class AccountRestrictionModification<T> {

    /**
     * Constructor
     * @param modificationType
     * @param value
     */
    constructor(
                /**
                 * Modification type.
                 */
                public readonly modificationType: RestrictionModificationType,
                /**
                 * Modification value (Address, Mosaic or Transaction Type).
                 */
                public readonly value: T) {

    }

    /**
     * Create an address filter for account property modification
     * @param modificationType - modification type. 0: Add, 1: Remove
     * @param address - modification value (Address)
     * @returns {AccountRestrictionModification}
     */
    public static createForAddress(modificationType: RestrictionModificationType,
                                   address: Address): AccountRestrictionModification<string> {
        return new AccountRestrictionModification<string>(modificationType, address.plain());
    }
    /**
     * Create an mosaic filter for account property modification
     * @param modificationType - modification type. 0: Add, 1: Remove
     * @param mosaicId - modification value (Mosaic)
     * @returns {AccountRestrictionModification}
     */
    public static createForMosaic(modificationType: RestrictionModificationType,
                                  mosaicId: MosaicId): AccountRestrictionModification<number[]> {
    return new AccountRestrictionModification<number[]>(modificationType, mosaicId.id.toDTO());
    }

    /**
     * Create an entity type filter for account property modification
     * @param modificationType - modification type. 0: Add, 1: Remove
     * @param entityType - modification value (Transaction Type)
     * @returns {AccountRestrictionModification}
     */
    public static createForEntityType(modificationType: RestrictionModificationType,
                                      entityType: number): AccountRestrictionModification<TransactionType> {
    return new AccountRestrictionModification<TransactionType>(modificationType, entityType);
    }

    /**
     * @internal
     */
    toDTO() {
        return {
            value: this.value,
            type: this.modificationType,
        };
    }
}
