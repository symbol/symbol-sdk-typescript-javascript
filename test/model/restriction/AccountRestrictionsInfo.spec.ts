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

import { deepEqual } from 'assert';
import { Address } from '../../../src/model/account/Address';
import { AccountRestriction } from '../../../src/model/restriction/AccountRestriction';
import { AccountRestrictionModificationAction } from '../../../src/model/restriction/AccountRestrictionModificationAction';
import { AccountRestrictions } from '../../../src/model/restriction/AccountRestrictions';
import { AccountRestrictionsInfo } from '../../../src/model/restriction/AccountRestrictionsInfo';
import { AddressRestrictionFlag } from '../../../src/model/restriction/AddressRestrictionFlag';

describe('AccountRestrictionsInfo', () => {
    it('should createComplete an AccountRestrictionsInfo object', () => {
        const accountRestrictionsInfoDTO = {
            meta: { id: '12345' },
            accountRestrictions: {
                address: '6826D27E1D0A26CA4E316F901E23E55C8711DB20DF250DEF',
                restrictions: [
                    {
                        restrictionFlags: AddressRestrictionFlag.AllowIncomingAddress,
                        values: [
                            {
                                modificationAction: AccountRestrictionModificationAction.Add,
                                value: 'SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMQ',
                            },
                        ],
                    },
                ],
            },
        };

        const accountRestrictionsInfo = new AccountRestrictionsInfo(
            accountRestrictionsInfoDTO.meta,
            new AccountRestrictions(
                Address.createFromEncoded(accountRestrictionsInfoDTO.accountRestrictions.address),
                accountRestrictionsInfoDTO.accountRestrictions.restrictions.map(
                    (prop) => new AccountRestriction(prop.restrictionFlags, prop.values),
                ),
            ),
        );

        deepEqual(accountRestrictionsInfo.meta.id, accountRestrictionsInfoDTO.meta.id);
        deepEqual(
            accountRestrictionsInfo.accountRestrictions.address,
            Address.createFromEncoded(accountRestrictionsInfoDTO.accountRestrictions.address),
        );
        deepEqual(
            accountRestrictionsInfo.accountRestrictions.restrictions.length,
            accountRestrictionsInfoDTO.accountRestrictions.restrictions.length,
        );
        deepEqual(
            accountRestrictionsInfo.accountRestrictions.restrictions[0].values[0],
            accountRestrictionsInfoDTO.accountRestrictions.restrictions[0].values[0],
        );
    });
});
