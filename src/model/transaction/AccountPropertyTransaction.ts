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

import { PropertyType } from '../account/PropertyType';
import { NetworkType } from '../blockchain/NetworkType';
import { UInt64 } from '../UInt64';
import { AccountPropertyModification } from './AccountPropertyModification';
import { Deadline } from './Deadline';
import { ModifyAccountPropertyAddressTransaction } from './ModifyAccountPropertyAddressTransaction';
import { ModifyAccountPropertyEntityTypeTransaction } from './ModifyAccountPropertyEntityTypeTransaction';
import { ModifyAccountPropertyMosaicTransaction } from './ModifyAccountPropertyMosaicTransaction';
import { TransactionType } from './TransactionType';

export class AccountPropertyTransaction {
    /**
     * Create an address modification transaction object
     * @param deadline - The deadline to include the transaction.
     * @param propertyType - Type of account property transaction
     * @param modification - array of address modifications
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {ModifyAccountPropertyAddressTransaction}
     */
    public static createAddressPropertyModificationTransaction(
        deadline: Deadline,
        propertyType: PropertyType,
        modifications: Array<AccountPropertyModification<string>>,
        networkType: NetworkType,
        maxFee: UInt64 = new UInt64([0, 0])
    ): ModifyAccountPropertyAddressTransaction {
        if (![PropertyType.AllowAddress, PropertyType.BlockAddress].includes(propertyType)) {
            throw new Error ('Property type is not allowed.');
        }
        return ModifyAccountPropertyAddressTransaction.create(
            deadline,
            propertyType,
            modifications,
            networkType,
            maxFee,
        );
    }

    /**
     * Create an mosaic modification transaction object
     * @param deadline - The deadline to include the transaction.
     * @param propertyType - Type of account property transaction
     * @param modification - array of mosaic modifications
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {ModifyAccountPropertyMosaicTransaction}
     */
    public static createMosaicPropertyModificationTransaction(
        deadline: Deadline,
        propertyType: PropertyType,
        modifications: Array<AccountPropertyModification<number[]>>,
        networkType: NetworkType,
        maxFee: UInt64 = new UInt64([0, 0])
    ): ModifyAccountPropertyMosaicTransaction {
        if (![PropertyType.AllowMosaic, PropertyType.BlockMosaic].includes(propertyType)) {
            throw new Error ('Property type is not allowed.');
        }
        return ModifyAccountPropertyMosaicTransaction.create(
            deadline,
            propertyType,
            modifications,
            networkType,
            maxFee,
        );
    }

    /**
     * Create an entity type modification transaction object
     * @param deadline - The deadline to include the transaction.
     * @param propertyType - Type of account property transaction
     * @param modification - array of entity type modifications
     * @param networkType - The network type.
     * @param maxFee - (Optional) Max fee defined by the sender
     * @returns {ModifyAccountPropertyEntityTypeTransaction}
     */
    public static createEntityTypePropertyModificationTransaction(
        deadline: Deadline,
        propertyType: PropertyType,
        modifications: Array<AccountPropertyModification<TransactionType>>,
        networkType: NetworkType,
        maxFee: UInt64 = new UInt64([0, 0])
    ): ModifyAccountPropertyEntityTypeTransaction {
        if (![PropertyType.AllowTransaction, PropertyType.BlockTransaction].includes(propertyType)) {
            throw new Error ('Property type is not allowed.');
        }
        return ModifyAccountPropertyEntityTypeTransaction.create(
            deadline,
            propertyType,
            modifications,
            networkType,
            maxFee,
        );
    }
}
