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

import { AccountProperties } from '../../model/account/AccountProperties';
import { AccountPropertiesInfo } from '../../model/account/AccountPropertiesInfo';
import { AccountProperty } from '../../model/account/AccountProperty';
import { Address } from '../../model/account/Address';
import { PropertyType } from '../../model/account/PropertyType';
import { MosaicId } from '../../model/mosaic/MosaicId';

export class DtoMapping {

    /**
     * Create AccountPropertyInfo class from Json.
     * @param {object} dataJson The account property json object.
     * @returns {module: model/Account/AccountPropertiesInfo} The AccountPropertiesInfo class.
     */
    public static extractAccountPropertyFromDto(accountProperties): AccountPropertiesInfo {
        return new AccountPropertiesInfo(
            accountProperties.meta,
            new AccountProperties(Address.createFromEncoded(accountProperties.accountProperties.address),
                    accountProperties.accountProperties.properties.map((prop) => {
                        switch (prop.propertyType) {
                            case PropertyType.AllowAddress:
                            case PropertyType.BlockAddress:
                                return new AccountProperty(prop.propertyType,
                                                            prop.values.map((value) => Address.createFromEncoded(value)));
                            case PropertyType.AllowMosaic:
                            case PropertyType.BlockMosaic:
                                return new AccountProperty(prop.propertyType,
                                                            prop.values.map((value) => new MosaicId(value)));
                            case PropertyType.AllowTransaction:
                            case PropertyType.BlockTransaction:
                                return new AccountProperty(prop.propertyType, prop.values);
                            default:
                                throw new Error(`Invalid property type: ${prop.propertyType}`);
                        }
                    })));
    }
}
