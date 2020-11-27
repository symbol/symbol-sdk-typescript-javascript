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
import { AccountRestrictionsBuilder } from 'catbuffer-typescript';
import { expect } from 'chai';
import { AccountRestrictionsInfoDTO } from 'symbol-openapi-typescript-fetch-client';
import { Convert } from '../../../src/core/format';
import { DtoMapping } from '../../../src/core/utils';
import { Address } from '../../../src/model/account';
import { AddressRestrictionFlag } from '../../../src/model/restriction';

describe('AccountRestrictions', () => {
    it('should createComplete an AccountRestrictionsInfo object', () => {
        const accountRestrictionsInfoDTO: AccountRestrictionsInfoDTO = {
            accountRestrictions: {
                address: '6826D27E1D0A26CA4E316F901E23E55C8711DB20DF250DEF',
                restrictions: [
                    {
                        restrictionFlags: AddressRestrictionFlag.AllowIncomingAddress as number,
                        values: ['6826D27E1D0A26CA4E316F901E23E55C8711DB20DF250DEF'],
                    },
                ],
            },
        };

        const accountRestrictionsInfo = DtoMapping.extractAccountRestrictionFromDto(accountRestrictionsInfoDTO);

        // deepEqual(accountRestrictionsInfo.id, accountRestrictionsInfoDTO.id);
        deepEqual(accountRestrictionsInfo.address, Address.createFromEncoded(accountRestrictionsInfoDTO.accountRestrictions.address));
        deepEqual(accountRestrictionsInfo.restrictions.length, accountRestrictionsInfoDTO.accountRestrictions.restrictions.length);
        deepEqual(
            accountRestrictionsInfo.restrictions[0].values[0],
            Address.createFromEncoded(accountRestrictionsInfoDTO.accountRestrictions.restrictions[0].values[0] as string),
        );

        const serialized = accountRestrictionsInfo.serialize();
        expect(Convert.uint8ToHex(serialized)).eq(
            '01006826D27E1D0A26CA4E316F901E23E55C8711DB20DF250DEF0100000000000000010001000000000000006826D27E1D0A26CA4E316F901E23E55C8711DB20DF250DEF',
        );
        deepEqual(AccountRestrictionsBuilder.loadFromBinary(serialized).serialize(), serialized);
    });
});
