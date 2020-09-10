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
    Pagination,
    SecretLockInfoDTO,
    SecretLockEntryDTO,
    SecretLockRoutesApi,
    SecretLockPage,
    LockHashAlgorithmEnum,
} from 'symbol-openapi-typescript-fetch-client';
import { instance, mock, reset, when } from 'ts-mockito';
import { DtoMapping } from '../../src/core/utils/DtoMapping';
import { SecretLockHttp } from '../../src/infrastructure/SecretLockHttp';
import { SecretLockRepository } from '../../src/infrastructure/SecretLockRepository';
import { Address } from '../../src/model/account/Address';
import { SecretLockInfo } from '../../src/model/lock/SecretLockInfo';

describe('SecretLockHttp', () => {
    const address = Address.createFromRawAddress('SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMQ');

    const dto = {} as SecretLockInfoDTO;
    dto.id = '1';
    const lockDto = {} as SecretLockEntryDTO;
    lockDto.amount = '10';
    lockDto.endHeight = '122';
    lockDto.compositeHash = 'AAA';
    lockDto.mosaicId = '941299B2B7E1291C';
    lockDto.ownerAddress = address.encoded();
    lockDto.status = 1;
    lockDto.hashAlgorithm = LockHashAlgorithmEnum.NUMBER_0;
    lockDto.recipientAddress = address.encoded();
    lockDto.secret = 'secret';
    dto.lock = lockDto;

    const url = 'http://someHost';
    const response: http.IncomingMessage = mock();
    const secretLockRoutesApi: SecretLockRoutesApi = mock();
    const secretLockRepository: SecretLockRepository = DtoMapping.assign(new SecretLockHttp(url), {
        secretLockRoutesApi: instance(secretLockRoutesApi),
    });

    before(() => {
        reset(response);
        reset(secretLockRoutesApi);
    });

    function assertHashInfo(info: SecretLockInfo): void {
        expect(info).to.be.not.null;
        expect(info.amount.toString()).to.be.equal(lockDto.amount);
        expect(info.recordId).to.be.equal(dto.id);
        expect(info.endHeight.toString()).to.be.equal(lockDto.endHeight);
        expect(info.ownerAddress.encoded()).to.be.equal(lockDto.ownerAddress);
        expect(info.compositeHash).to.be.equal(lockDto.compositeHash);
        expect(info.secret).to.be.equal(lockDto.secret);
        expect(info.hashAlgorithm.valueOf()).to.be.equal(lockDto.hashAlgorithm.valueOf());
        expect(info.recipientAddress.encoded()).to.be.equal(lockDto.recipientAddress);
        expect(info.mosaicId.toHex()).to.be.equal(lockDto.mosaicId);
        expect(info.status).to.be.equal(lockDto.status);
    }

    it('getSecretLockInfo', async () => {
        when(secretLockRoutesApi.getSecretLock(lockDto.secret)).thenReturn(Promise.resolve(dto));
        const hashInfo = await secretLockRepository.getSecretLock(lockDto.secret).toPromise();
        assertHashInfo(hashInfo);
    });

    it('search', async () => {
        const pagination = {} as Pagination;
        pagination.pageNumber = 1;
        pagination.pageSize = 1;

        const body = {} as SecretLockPage;
        body.data = [dto];
        body.pagination = pagination;
        when(secretLockRoutesApi.searchSecretLock(address.plain(), undefined, undefined, undefined, undefined)).thenReturn(
            Promise.resolve(body),
        );
        const infos = await secretLockRepository.search({ address }).toPromise();
        assertHashInfo(infos.data[0]);
    });

    it('getSecretLockInfo - Error', async () => {
        when(secretLockRoutesApi.getSecretLock(lockDto.secret)).thenReject(new Error('Mocked Error'));
        await secretLockRepository
            .getSecretLock(lockDto.secret)
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });
});
