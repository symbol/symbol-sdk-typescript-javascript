/*
 * Copyright 2018 NEM
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

import {deepEqual} from 'assert';
import {expect} from 'chai';
import {Address} from '../../../src/model/account/Address';
import { AccountProperties, PropertyModificationType, PropertyType } from '../../../src/model/model';

describe('AccountProperties', () => {

    it('should createComplete an AccountProperties object', () => {
        const accountPropertiesDTO = {
            address: Address.createFromEncoded('9050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142'),
            properties: [{
                propertyType: PropertyType.AllowAddress,
                values: [{modificationType: PropertyModificationType.Add,
                          value: 'SDUP5PLHDXKBX3UU5Q52LAY4WYEKGEWC6IB3VBFM',
                         }],
            }],
        };

        const accountProperties = new AccountProperties(
            accountPropertiesDTO.address,
            accountPropertiesDTO.properties,
        );

        expect(accountProperties.address).to.be.equal(accountPropertiesDTO.address);
        deepEqual(accountPropertiesDTO.properties.length, accountPropertiesDTO.properties.length);
        deepEqual(accountPropertiesDTO.properties[0].propertyType, accountPropertiesDTO.properties[0].propertyType);
        deepEqual(accountPropertiesDTO.properties[0].values.length, accountPropertiesDTO.properties[0].values.length);
        deepEqual(accountPropertiesDTO.properties[0].values[0].modificationType,
            accountPropertiesDTO.properties[0].values[0].modificationType);
        deepEqual(accountPropertiesDTO.properties[0].values[0].value, accountPropertiesDTO.properties[0].values[0].value);
    });
});
