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

import { AccountRestrictions } from '../../model/account/AccountRestrictions';
import { AccountRestrictionsInfo } from '../../model/account/AccountRestrictionsInfo';
import { AccountRestriction } from '../../model/account/AccountRestriction';
import { Address } from '../../model/account/Address';
import { RestrictionType } from '../../model/account/RestrictionType';
import { MosaicId } from '../../model/mosaic/MosaicId';

export class DtoMapping {

    /**
     * Create AccountPropertyInfo class from Json.
     * @param {object} dataJson The account property json object.
     * @returns {module: model/Account/AccountPropertiesInfo} The AccountPropertiesInfo class.
     */
    public static extractAccountPropertyFromDto(accountProperties): AccountRestrictionsInfo {
        return new AccountRestrictionsInfo(
            accountProperties.meta,
            new AccountRestrictions(Address.createFromEncoded(accountProperties.accountProperties.address),
                    accountProperties.accountProperties.properties.map((prop) => {
                        switch (prop.propertyType) {
                            case RestrictionType.AllowAddress:
                            case RestrictionType.BlockAddress:
                                return new AccountRestriction(prop.propertyType,
                                                            prop.values.map((value) => Address.createFromEncoded(value)));
                            case RestrictionType.AllowMosaic:
                            case RestrictionType.BlockMosaic:
                                return new AccountRestriction(prop.propertyType,
                                                            prop.values.map((value) => new MosaicId(value)));
                            case RestrictionType.AllowTransaction:
                            case RestrictionType.BlockTransaction:
                                return new AccountRestriction(prop.propertyType, prop.values);
                            default:
                                throw new Error(`Invalid property type: ${prop.propertyType}`);
                        }
                    })));
    }
}
