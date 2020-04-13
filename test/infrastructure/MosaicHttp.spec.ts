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
    Mosaic,
    MosaicRoutesApi,
    MosaicInfoDTO,
    MosaicDTO,
    MosaicsInfoDTO,
    MosaicIds,
    AccountIds,
} from 'symbol-openapi-typescript-node-client';
import { instance, mock, reset, when, deepEqual } from 'ts-mockito';
import { assert } from 'chai';
import { DtoMapping } from '../../src/core/utils/DtoMapping';
import { MosaicRepository } from '../../src/infrastructure/MosaicRepository';
import { MosaicHttp } from '../../src/infrastructure/MosaicHttp';
import { NetworkType } from '../../src/model/network/NetworkType';
import { MosaicId } from '../../src/model/mosaic/MosaicId';
import { MosaicInfo } from '../../src/model/mosaic/MosaicInfo';
import { PublicAccount } from '../../src/model/account/PublicAccount';

describe('MosaicHttp', () => {
    const publicAccount = PublicAccount.createFromPublicKey(
        '9801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B6',
        NetworkType.MIJIN_TEST,
    );
    const { address } = publicAccount;
    const mosaicId = new MosaicId('941299B2B7E1291C');
    const mosaic = new Mosaic();
    mosaic.amount = '777';
    mosaic.id = mosaicId.toHex();

    const mosaicDto = new MosaicDTO();
    mosaicDto.divisibility = 6;
    mosaicDto.duration = '10';
    mosaicDto.flags = 1;
    mosaicDto.id = mosaicId.toHex();
    mosaicDto.ownerAddress = address.encoded();
    mosaicDto.ownerPublicKey = publicAccount.publicKey;
    mosaicDto.revision = 0;
    mosaicDto.startHeight = '1';
    mosaicDto.supply = '100';

    const mosaicInfoDto = new MosaicInfoDTO();
    const mosaicsInfoDto = new MosaicsInfoDTO();
    mosaicInfoDto.mosaic = mosaicDto;
    mosaicsInfoDto.mosaics = [mosaicDto];

    const url = 'http://someHost';
    const response: http.IncomingMessage = mock();
    const mosaicRoutesApi: MosaicRoutesApi = mock();
    const mosaicRepository: MosaicRepository = DtoMapping.assign(new MosaicHttp(url, NetworkType.MIJIN_TEST), {
        mosaicRoutesApi: instance(mosaicRoutesApi),
    });

    before(() => {
        reset(response);
        reset(mosaicRoutesApi);
    });

    function assertMosaicInfo(mosaicInfo: MosaicInfo) {
        expect(mosaicInfo).to.be.not.null;
        expect(mosaicInfo.divisibility).to.be.equals(6);
        expect(mosaicInfo.duration.toString()).to.be.equals(mosaicDto.duration);
        expect(mosaicInfo.flags.getValue()).to.be.equals(mosaicDto.flags);
        expect(mosaicInfo.height.toString()).to.be.equals(mosaicDto.startHeight);
        expect(mosaicInfo.supply.toString()).to.be.equals(mosaicDto.supply);
        expect(mosaicInfo.owner.publicKey).to.be.equals(mosaicDto.ownerPublicKey);
        expect(mosaicInfo.owner.address.encoded()).to.be.equals(mosaicDto.ownerAddress);
        expect(mosaicInfo.revision).to.be.equals(mosaicDto.revision);
        expect(mosaicInfo.id.toHex()).to.be.equals(mosaicId.toHex());
    }

    it('getMosaic', async () => {
        when(mosaicRoutesApi.getMosaic(mosaicId.toHex())).thenReturn(Promise.resolve({ response, body: mosaicInfoDto }));
        const mosaicInfo = await mosaicRepository.getMosaic(mosaicId).toPromise();
        assertMosaicInfo(mosaicInfo);
    });

    it('getMosaics', async () => {
        const mosaicIds = new MosaicIds();
        mosaicIds.mosaicIds = [mosaicId.toHex()];
        when(mosaicRoutesApi.getMosaics(deepEqual(mosaicIds))).thenReturn(Promise.resolve({ response, body: [mosaicInfoDto] }));
        const mosaicInfos = await mosaicRepository.getMosaics([mosaicId]).toPromise();
        assertMosaicInfo(mosaicInfos[0]);
    });

    it('getMosaicsFromAccount', async () => {
        when(mosaicRoutesApi.getMosaicsFromAccount(address.plain())).thenReturn(Promise.resolve({ response, body: mosaicsInfoDto }));
        const mosaicsInfo = await mosaicRepository.getMosaicsFromAccount(address).toPromise();
        assertMosaicInfo(mosaicsInfo[0]);
    });

    it('getMosaicsFromAccounts', async () => {
        const accountIds = new AccountIds();
        accountIds.addresses = [address.plain()];
        when(mosaicRoutesApi.getMosaicsFromAccounts(deepEqual(accountIds))).thenReturn(Promise.resolve({ response, body: mosaicsInfoDto }));
        const mosaicsInfo = await mosaicRepository.getMosaicsFromAccounts([address]).toPromise();
        assertMosaicInfo(mosaicsInfo[0]);
    });

    it('getMosaic - Error', async () => {
        when(mosaicRoutesApi.getMosaic(mosaicId.toHex())).thenThrow(new Error('Mocked Error'));
        await mosaicRepository
            .getMosaic(mosaicId)
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });

    it('getMosaics - Error', async () => {
        const mosaicIds = new MosaicIds();
        mosaicIds.mosaicIds = [mosaicId.toHex()];
        when(mosaicRoutesApi.getMosaics(deepEqual(mosaicIds))).thenThrow(new Error('Mocked Error'));
        await mosaicRepository
            .getMosaics([mosaicId])
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });

    it('getMosaicsFromAccount - Error', async () => {
        when(mosaicRoutesApi.getMosaicsFromAccount(address.plain())).thenThrow(new Error('Mocked Error'));
        await mosaicRepository
            .getMosaicsFromAccount(address)
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });

    it('getMosaicsFromAccounts - Error', async () => {
        const accountIds = new AccountIds();
        accountIds.addresses = [address.plain()];
        when(mosaicRoutesApi.getMosaicsFromAccounts(deepEqual(accountIds))).thenThrow(new Error('Mocked Error'));
        await mosaicRepository
            .getMosaicsFromAccounts([address])
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });
});
