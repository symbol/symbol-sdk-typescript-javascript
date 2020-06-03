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
    AccountDTO,
    AccountIds,
    AccountInfoDTO,
    AccountRoutesApi,
    AccountTypeEnum,
    ActivityBucketDTO,
    Mosaic,
} from 'symbol-openapi-typescript-node-client';
import { deepEqual, instance, mock, reset, when } from 'ts-mockito';
import { DtoMapping } from '../../src/core/utils/DtoMapping';
import { AccountHttp } from '../../src/infrastructure/AccountHttp';
import { AccountRepository } from '../../src/infrastructure/AccountRepository';
import { AccountInfo } from '../../src/model/account/AccountInfo';
import { AccountType } from '../../src/model/account/AccountType';
import { Address } from '../../src/model/account/Address';
import { AccountKeyDTO } from 'symbol-openapi-typescript-node-client/dist/model/accountKeyDTO';

describe('AccountHttp', () => {
    const address = Address.createFromRawAddress('MCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPR72DYSX');

    const mosaic = new Mosaic();
    mosaic.amount = '777';
    mosaic.id = '941299B2B7E1291C';

    const activityBucketDTO = new ActivityBucketDTO();
    activityBucketDTO.beneficiaryCount = 1;
    activityBucketDTO.rawScore = '2';
    activityBucketDTO.startHeight = '3';
    activityBucketDTO.totalFeesPaid = '4';

    const accountDTO = new AccountDTO();
    accountDTO.accountType = AccountTypeEnum.NUMBER_1;
    accountDTO.address = address.encoded();
    accountDTO.addressHeight = '111';
    accountDTO.importance = '222';
    accountDTO.importanceHeight = '333';
    accountDTO.publicKeyHeight = '444';
    const accountKeyDto = new AccountKeyDTO();
    accountKeyDto.key = 'abc';
    accountKeyDto.keyType = 1;
    accountDTO.supplementalAccountKeys = [accountKeyDto];
    accountDTO.publicKey = 'AAA';
    accountDTO.activityBuckets = [];
    accountDTO.mosaics = [mosaic];
    accountDTO.activityBuckets = [activityBucketDTO];

    const accountInfoDto = new AccountInfoDTO();
    accountInfoDto.account = accountDTO;

    const url = 'http://someHost';
    const response: http.IncomingMessage = mock();
    const accountRoutesApi: AccountRoutesApi = mock();
    const accountRepository: AccountRepository = DtoMapping.assign(new AccountHttp(url), {
        accountRoutesApi: instance(accountRoutesApi),
    });

    before(() => {
        reset(response);
        reset(accountRoutesApi);
    });

    function assertAccountInfo(accountInfo: AccountInfo): void {
        expect(accountInfo).to.be.not.null;
        expect(accountInfo.accountType).to.be.equals(AccountType.Main);
        expect(accountInfo.addressHeight.toString()).to.be.equals(accountDTO.addressHeight);
        expect(accountInfo.importance.toString()).to.be.equals(accountDTO.importance);
        expect(accountInfo.importanceHeight.toString()).to.be.equals(accountDTO.importanceHeight);
        expect(accountInfo.publicKeyHeight.toString()).to.be.equals(accountDTO.publicKeyHeight);
        expect(accountInfo.publicKey).to.be.equals(accountDTO.publicKey);
        expect(accountInfo.supplementalAccountKeys[0].key).to.be.equals(accountDTO.supplementalAccountKeys[0].key);
        expect(accountInfo.supplementalAccountKeys[0].keyType.valueOf()).to.be.equals(
            accountDTO.supplementalAccountKeys[0].keyType.valueOf(),
        );
        expect(accountInfo.mosaics.length).to.be.equals(1);
        expect(accountInfo.mosaics[0].id.id.toHex()).to.be.equals(mosaic.id);
        expect(accountInfo.mosaics[0].amount.toString()).to.be.equals(mosaic.amount);

        expect(accountInfo.activityBucket.length).to.be.equals(1);
        expect(accountInfo.activityBucket[0].beneficiaryCount).to.be.equals(activityBucketDTO.beneficiaryCount);
        expect(accountInfo.activityBucket[0].rawScore.toString()).to.be.equals(activityBucketDTO.rawScore);
        expect(accountInfo.activityBucket[0].startHeight.toString()).to.be.equals(activityBucketDTO.startHeight);
        expect(accountInfo.activityBucket[0].totalFeesPaid.toString()).to.be.equals(activityBucketDTO.totalFeesPaid);
    }

    it('getAccountInfo', async () => {
        when(accountRoutesApi.getAccountInfo(address.plain())).thenReturn(Promise.resolve({ response, body: accountInfoDto }));
        const accountInfo = await accountRepository.getAccountInfo(address).toPromise();
        assertAccountInfo(accountInfo);
    });

    it('getAccountsInfo', async () => {
        const accountIds = new AccountIds();
        accountIds.addresses = [address.plain()];
        when(accountRoutesApi.getAccountsInfo(deepEqual(accountIds))).thenReturn(Promise.resolve({ response, body: [accountInfoDto] }));
        const accountInfos = await accountRepository.getAccountsInfo([address]).toPromise();
        assertAccountInfo(accountInfos[0]);
    });
});
