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
import { AccountRestrictions } from '../../../src/model/account/AccountRestrictions';
import { AccountRestrictionsInfo } from '../../../src/model/account/AccountRestrictionsInfo';
import { AccountRestriction } from '../../../src/model/account/AccountRestriction';
import {Address} from '../../../src/model/account/Address';
import { RestrictionModificationType } from '../../../src/model/account/RestrictionModificationType';
import { RestrictionType } from '../../../src/model/account/RestrictionType';

describe('AccountPropertiesInfo', () => {

    it('should createComplete an AccountPropertiesInfo object', () => {

        const accountPropertiesInfoDTO = {
            meta: {id: '12345'},
            accountProperties: {
                address: '9050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142',
                properties: [{
                    propertyType: RestrictionType.AllowAddress,
                    values: [{modificationType: RestrictionModificationType.Add,
                              value: 'SDUP5PLHDXKBX3UU5Q52LAY4WYEKGEWC6IB3VBFM',
                             }],
                }],
            },
        };

        const accountPropertiesInfo = new AccountRestrictionsInfo(
            accountPropertiesInfoDTO.meta,
            new AccountRestrictions(Address.createFromEncoded(accountPropertiesInfoDTO.accountProperties.address),
                                  accountPropertiesInfoDTO.accountProperties.properties.map((prop) =>
                                            new AccountRestriction(prop.propertyType, prop.values))),
        );

        deepEqual(accountPropertiesInfo.meta.id, accountPropertiesInfoDTO.meta.id);
        deepEqual(accountPropertiesInfo.accountRestrictions.address,
                    Address.createFromEncoded(accountPropertiesInfoDTO.accountProperties.address));
        deepEqual(accountPropertiesInfo.accountRestrictions.restrictions.length,
            accountPropertiesInfoDTO.accountProperties.properties.length);
        deepEqual(accountPropertiesInfo.accountRestrictions.restrictions[0].values[0],
            accountPropertiesInfoDTO.accountProperties.properties[0].values[0]);
    });
});
