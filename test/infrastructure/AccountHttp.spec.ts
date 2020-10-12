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
    AccountLinkPublicKeyDTO,
    AccountLinkVotingKeyDTO,
    Pagination,
    AccountPage,
} from 'symbol-openapi-typescript-fetch-client';
import { deepEqual, instance, mock, reset, when } from 'ts-mockito';
import { DtoMapping } from '../../src/core/utils/DtoMapping';
import { AccountHttp } from '../../src/infrastructure/AccountHttp';
import { AccountRepository } from '../../src/infrastructure/AccountRepository';
import { AccountInfo } from '../../src/model/account/AccountInfo';
import { AccountType } from '../../src/model/account/AccountType';
import { Address } from '../../src/model/account/Address';
import { MosaicId } from '../../src/model/mosaic/MosaicId';

describe('AccountHttp', () => {
    const address = Address.createFromRawAddress('QATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA367I6OQ');

    const mosaic = {} as Mosaic;
    mosaic.amount = '777';
    mosaic.id = '941299B2B7E1291C';

    const activityBucketDTO = {} as ActivityBucketDTO;
    activityBucketDTO.beneficiaryCount = 1;
    activityBucketDTO.rawScore = '2';
    activityBucketDTO.startHeight = '3';
    activityBucketDTO.totalFeesPaid = '4';

    const accountDTO = {} as AccountDTO;
    accountDTO.accountType = AccountTypeEnum.NUMBER_1;
    accountDTO.address = address.encoded();
    accountDTO.addressHeight = '111';
    accountDTO.importance = '222';
    accountDTO.importanceHeight = '333';
    accountDTO.publicKeyHeight = '444';
    const accountKeyDto: AccountLinkPublicKeyDTO = { publicKey: 'abc' };
    const accountVotingKeyDto: AccountLinkVotingKeyDTO = { publicKey: 'abc', startEpoch: 1, endEpoch: 3 };
    accountDTO.supplementalPublicKeys = {
        linked: accountKeyDto,
        node: accountKeyDto,
        vrf: accountKeyDto,
        voting: { publicKeys: [accountVotingKeyDto] },
    };
    accountDTO.publicKey = 'AAA';
    accountDTO.activityBuckets = [];
    accountDTO.mosaics = [mosaic];
    accountDTO.activityBuckets = [activityBucketDTO];

    const accountInfoDto = {} as AccountInfoDTO;
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
        expect(accountInfo.supplementalPublicKeys.linked?.publicKey).to.be.equals('abc');
        expect(accountInfo.supplementalPublicKeys.node?.publicKey).to.be.equals('abc');
        expect(accountInfo.supplementalPublicKeys.vrf?.publicKey).to.be.equals('abc');
        expect(accountInfo.supplementalPublicKeys.voting?.length).to.be.equals(1);
        expect(accountInfo.supplementalPublicKeys.voting![0].publicKey).to.be.equals('abc');
        expect(accountInfo.supplementalPublicKeys.voting![0].endEpoch.toString()).to.be.equals('3');
        expect(accountInfo.supplementalPublicKeys.voting![0].startEpoch.toString()).to.be.equals('1');
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
        when(accountRoutesApi.getAccountInfo(address.plain())).thenReturn(Promise.resolve(accountInfoDto));
        const accountInfo = await accountRepository.getAccountInfo(address).toPromise();
        assertAccountInfo(accountInfo);
    });

    it('getAccountsInfo', async () => {
        const accountIds = {} as AccountIds;
        accountIds.addresses = [address.plain()];
        when(accountRoutesApi.getAccountsInfo(deepEqual(accountIds))).thenReturn(Promise.resolve([accountInfoDto]));
        const accountInfos = await accountRepository.getAccountsInfo([address]).toPromise();
        assertAccountInfo(accountInfos[0]);
    });

    it('searchAccounts', async () => {
        const pagination = {} as Pagination;
        pagination.pageNumber = 1;
        pagination.pageSize = 1;

        const body = {} as AccountPage;
        body.data = [accountInfoDto];
        body.pagination = pagination;
        when(accountRoutesApi.searchAccounts(undefined, undefined, undefined, undefined, undefined, mosaic.id)).thenReturn(
            Promise.resolve(body),
        );
        const infos = await accountRepository.search({ mosaicId: new MosaicId(mosaic.id) }).toPromise();
        assertAccountInfo(infos.data[0]);
    });

    it('getAccountInfo - Error', async () => {
        when(accountRoutesApi.getAccountInfo(address.plain())).thenReject(new Error('Mocked Error'));
        await accountRepository
            .getAccountInfo(address)
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });

    it('getAccountsInfo - Error', async () => {
        const accountIds = {} as AccountIds;
        accountIds.addresses = [address.plain()];
        when(accountRoutesApi.getAccountsInfo(deepEqual(accountIds))).thenReject(new Error('Mocked Error'));
        await accountRepository
            .getAccountsInfo([address])
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });
});
