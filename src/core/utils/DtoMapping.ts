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

import { Address } from '../../model/account/Address';
import { MosaicId } from '../../model/mosaic/MosaicId';
import { AccountRestriction } from '../../model/restriction/AccountRestriction';
import { AccountRestrictions } from '../../model/restriction/AccountRestrictions';
import { AccountRestrictionsInfo } from '../../model/restriction/AccountRestrictionsInfo';
import { AddressRestrictionFlag } from '../../model/restriction/AddressRestrictionFlag';
import { MosaicRestrictionFlag } from '../../model/restriction/MosaicRestrictionFlag';
import { OperationRestrictionFlag } from '../../model/restriction/OperationRestrictionFlag';

export class DtoMapping {
    /**
     * Create AccountRestrictionsInfo class from Json.
     * @param {object} dataJson The account restriction json object.
     * @returns {module: model/Account/AccountRestrictionsInfo} The AccountRestrictionsInfo class.
     */
    public static extractAccountRestrictionFromDto(accountRestrictions): AccountRestrictionsInfo {
        return new AccountRestrictionsInfo(
            accountRestrictions.meta,
            new AccountRestrictions(
                Address.createFromEncoded(accountRestrictions.accountRestrictions.address),
                accountRestrictions.accountRestrictions.restrictions.map((prop) => {
                    switch (prop.restrictionFlags) {
                        case AddressRestrictionFlag.AllowIncomingAddress:
                        case AddressRestrictionFlag.BlockIncomingAddress:
                        case AddressRestrictionFlag.AllowOutgoingAddress:
                        case AddressRestrictionFlag.BlockOutgoingAddress:
                            return new AccountRestriction(
                                prop.restrictionFlags,
                                prop.values.map((value) => Address.createFromEncoded(value)),
                            );
                        case MosaicRestrictionFlag.AllowMosaic:
                        case MosaicRestrictionFlag.BlockMosaic:
                            return new AccountRestriction(
                                prop.restrictionFlags,
                                prop.values.map((value) => new MosaicId(value)),
                            );
                        case OperationRestrictionFlag.AllowOutgoingTransactionType:
                        case OperationRestrictionFlag.BlockOutgoingTransactionType:
                            return new AccountRestriction(prop.restrictionFlags, prop.values);
                        default:
                            throw new Error(`Invalid restriction type: ${prop.restrictionFlags}`);
                    }
                }),
            ),
        );
    }

    /**
     * Creates a copy of the first object adding the attributes of the second object.
     * @param object the object to be cloned
     * @param attributes the extra attributes to be added to the object.
     * @returns a copy of the first object with the new attributes added.
     */
    public static assign<T>(object: T, attributes: any): T {
        return Object.assign({ __proto__: Object.getPrototypeOf(object) }, object, attributes);
    }

    /**
     * Map one enum type to another by value
     * @param value enum value to be mapped
     */
    public static mapEnum<E1, E2>(value: E1 | undefined): E2 {
        return (value as unknown) as E2;
    }
}
