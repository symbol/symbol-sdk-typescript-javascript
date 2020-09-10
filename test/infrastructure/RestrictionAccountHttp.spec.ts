/*
 * Copyright 2020 NEM
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
import { expect } from 'chai';
import * as http from 'http';
import {
    AccountRestrictionDTO,
    AccountRestrictionFlagsEnum,
    AccountRestrictionsDTO,
    AccountRestrictionsInfoDTO,
    RestrictionAccountRoutesApi,
} from 'symbol-openapi-typescript-fetch-client';
import { deepEqual, instance, mock, reset, when } from 'ts-mockito';
import { DtoMapping } from '../../src/core/utils/DtoMapping';
import { RestrictionAccountHttp } from '../../src/infrastructure/RestrictionAccountHttp';
import { Address } from '../../src/model/account/Address';
import { PublicAccount } from '../../src/model/account/PublicAccount';
import { NetworkType } from '../../src/model/network/NetworkType';
import { AddressRestrictionFlag } from '../../src/model/restriction/AddressRestrictionFlag';

describe('RestrictionAccountHttp', () => {
    const publicAccount = PublicAccount.createFromPublicKey(
        '9801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B6',
        NetworkType.MIJIN_TEST,
    );
    const address = publicAccount.address;
    const url = 'http://someHost';
    const response: http.IncomingMessage = mock();
    const restrictionAccountRoutesApi: RestrictionAccountRoutesApi = mock();
    const restrictionAccountRepository = DtoMapping.assign(new RestrictionAccountHttp(url), {
        restrictionAccountRoutesApi: instance(restrictionAccountRoutesApi),
    });

    const restrictionInfo = {} as AccountRestrictionsInfoDTO;
    const restrictionsDto = {} as AccountRestrictionsDTO;
    const restriction = {} as AccountRestrictionDTO;
    restriction.restrictionFlags = AccountRestrictionFlagsEnum.NUMBER_1;
    restriction.values = [address.encoded()];
    restrictionsDto.restrictions = [restriction];
    restrictionsDto.address = address.encoded();

    restrictionInfo.accountRestrictions = restrictionsDto;

    before(() => {
        reset(response);
        reset(restrictionAccountRoutesApi);
    });

    it('getAccountRestrictions', async () => {
        when(restrictionAccountRoutesApi.getAccountRestrictions(deepEqual(address.plain()))).thenReturn(Promise.resolve(restrictionInfo));

        const restrictions = await restrictionAccountRepository.getAccountRestrictions(address).toPromise();
        expect(restrictions).to.be.not.null;
        expect(restrictions.length).to.be.greaterThan(0);
        expect(restrictions[0].restrictionFlags).to.be.equals(AddressRestrictionFlag.AllowIncomingAddress);
        expect((restrictions[0].values[0] as Address).plain()).to.be.equals(address.plain());
    });

    it('getAccountRestrictions - Error', async () => {
        when(restrictionAccountRoutesApi.getAccountRestrictions(deepEqual(address.plain()))).thenReject(new Error('Mocked Error'));
        await restrictionAccountRepository
            .getAccountRestrictions(address)
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });
});
