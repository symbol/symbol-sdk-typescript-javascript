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
import { PropertyModificationType } from '../account/PropertyModificationType';
import { MosaicId } from '../mosaic/MosaicId';
import { TransactionType } from './TransactionType';

export class AccountPropertyModification<T> {

    /**
     * Constructor
     * @param modificationType
     * @param value
     */
    constructor(
                /**
                 * Modification type.
                 */
                public readonly modificationType: PropertyModificationType,
                /**
                 * Modification value (Address, Mosaic or Transaction Type).
                 */
                public readonly value: T) {

    }

    /**
     * Create an address filter for account property modification
     * @param modificationType - modification type. 0: Add, 1: Remove
     * @param address - modification value (Address)
     * @returns {AccountPropertyModification}
     */
    public static createForAddress(modificationType: PropertyModificationType,
                                   address: Address): AccountPropertyModification<string> {
        return new AccountPropertyModification<string>(modificationType, address.plain());
    }
    /**
     * Create an mosaic filter for account property modification
     * @param modificationType - modification type. 0: Add, 1: Remove
     * @param mosaicId - modification value (Mosaic)
     * @returns {AccountPropertyModification}
     */
    public static createForMosaic(modificationType: PropertyModificationType,
                                  mosaicId: MosaicId): AccountPropertyModification<number[]> {
    return new AccountPropertyModification<number[]>(modificationType, mosaicId.id.toDTO());
    }

    /**
     * Create an entity type filter for account property modification
     * @param modificationType - modification type. 0: Add, 1: Remove
     * @param entityType - modification value (Transaction Type)
     * @returns {AccountPropertyModification}
     */
    public static createForEntityType(modificationType: PropertyModificationType,
                                      entityType: number): AccountPropertyModification<TransactionType> {
    return new AccountPropertyModification<TransactionType>(modificationType, entityType);
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
