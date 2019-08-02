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
import { AccountRestriction } from '../../../src/model/account/AccountRestriction';
import { AccountRestrictions } from '../../../src/model/account/AccountRestrictions';
import { AccountRestrictionsInfo } from '../../../src/model/account/AccountRestrictionsInfo';
import { AccountRestrictionType } from '../../../src/model/account/AccountRestrictionType';
import {Address} from '../../../src/model/account/Address';
import { RestrictionModificationType } from '../../../src/model/account/RestrictionModificationType';

describe('AccountRestrictionsInfo', () => {

    it('should createComplete an AccountRestrictionsInfo object', () => {

        const accountRestrictionsInfoDTO = {
            meta: {id: '12345'},
            accountRestrictions: {
                address: '9050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142',
                restrictions: [{
                    restrictionType: AccountRestrictionType.AllowIncomingAddress,
                    values: [{modificationType: RestrictionModificationType.Add,
                              value: 'SDUP5PLHDXKBX3UU5Q52LAY4WYEKGEWC6IB3VBFM',
                             }],
                }],
            },
        };

        const accountRestrictionsInfo = new AccountRestrictionsInfo(
            accountRestrictionsInfoDTO.meta,
            new AccountRestrictions(Address.createFromEncoded(accountRestrictionsInfoDTO.accountRestrictions.address),
                accountRestrictionsInfoDTO.accountRestrictions.restrictions.map((prop) =>
                                            new AccountRestriction(prop.restrictionType, prop.values))),
        );

        deepEqual(accountRestrictionsInfo.meta.id, accountRestrictionsInfoDTO.meta.id);
        deepEqual(accountRestrictionsInfo.accountRestrictions.address,
                    Address.createFromEncoded(accountRestrictionsInfoDTO.accountRestrictions.address));
        deepEqual(accountRestrictionsInfo.accountRestrictions.restrictions.length,
            accountRestrictionsInfoDTO.accountRestrictions.restrictions.length);
        deepEqual(accountRestrictionsInfo.accountRestrictions.restrictions[0].values[0],
            accountRestrictionsInfoDTO.accountRestrictions.restrictions[0].values[0]);
    });
});
