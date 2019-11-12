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
import { AccountRestriction } from '../../../src/model/restriction/AccountRestriction';
import { AccountRestrictionModificationAction } from '../../../src/model/restriction/AccountRestrictionModificationAction';
import { AccountRestrictions } from '../../../src/model/restriction/AccountRestrictions';
import { AccountRestrictionFlags } from '../../../src/model/restriction/AccountRestrictionType';

describe('AccountRestrictions', () => {

    it('should createComplete an AccountRestrictions object', () => {
        const accountRestrictionsDTO = {
            address: Address.createFromEncoded('9050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142'),
            restrictions: [{
                restrictionFlags: AccountRestrictionFlags.AllowIncomingAddress,
                values: [{modificationAction: AccountRestrictionModificationAction.Add,
                          value: 'SDUP5PLHDXKBX3UU5Q52LAY4WYEKGEWC6IB3VBFM',
                         }],
            }],
        };

        const accountRestrictions = new AccountRestrictions(
            accountRestrictionsDTO.address,
            accountRestrictionsDTO.restrictions.map((r) => {
                return new AccountRestriction(
                    r.restrictionFlags,
                    r.values,
                );
            }),
        );

        expect(accountRestrictions.address).to.be.equal(accountRestrictionsDTO.address);
        deepEqual(accountRestrictions.restrictions.length, accountRestrictionsDTO.restrictions.length);
        deepEqual(accountRestrictions.restrictions[0].restrictionFlags, accountRestrictionsDTO.restrictions[0].restrictionFlags);
        deepEqual(accountRestrictions.restrictions[0].values.length, accountRestrictionsDTO.restrictions[0].values.length);
        deepEqual((accountRestrictions.restrictions[0].values[0] as any).modificationAction,
            accountRestrictionsDTO.restrictions[0].values[0].modificationAction);
        deepEqual((accountRestrictions.restrictions[0].values[0] as any).value, accountRestrictionsDTO.restrictions[0].values[0].value);
    });
});
