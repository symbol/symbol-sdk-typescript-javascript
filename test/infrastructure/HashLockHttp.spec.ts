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
import { firstValueFrom } from 'rxjs';
import {
    HashLockEntryDTO,
    HashLockInfoDTO,
    HashLockPage,
    HashLockRoutesApi,
    MerkleStateInfoDTO,
    MerkleTreeLeafDTO,
    Pagination,
} from 'symbol-openapi-typescript-fetch-client';
import { instance, mock, reset, when } from 'ts-mockito';
import { DtoMapping } from '../../src/core/utils/DtoMapping';
import { HashLockHttp } from '../../src/infrastructure/HashLockHttp';
import { HashLockRepository } from '../../src/infrastructure/HashLockRepository';
import { HashLockPaginationStreamer } from '../../src/infrastructure/paginationStreamer/HashLockPaginationStreamer';
import { Address } from '../../src/model/account/Address';
import { HashLockInfo } from '../../src/model/lock/HashLockInfo';

describe('HashLockHttp', () => {
    const address = Address.createFromRawAddress('TATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA37JGO5Q');

    const dto = {} as HashLockInfoDTO;
    dto.id = '1';
    const lockDto = {} as HashLockEntryDTO;
    lockDto.amount = '10';
    lockDto.endHeight = '122';
    lockDto.hash = 'AAA';
    lockDto.mosaicId = '941299B2B7E1291C';
    lockDto.ownerAddress = address.encoded();
    lockDto.status = 1;
    dto.lock = lockDto;

    const url = 'http://someHost';
    const response: http.IncomingMessage = mock();
    const hashLockRoutesApi: HashLockRoutesApi = mock();
    const hashLockRepository: HashLockRepository = DtoMapping.assign(new HashLockHttp(url), {
        hashLockRoutesApi: instance(hashLockRoutesApi),
    });

    before(() => {
        reset(response);
        reset(hashLockRoutesApi);
    });

    function assertHashInfo(info: HashLockInfo): void {
        expect(info).to.be.not.null;
        expect(info.amount.toString()).to.be.equal(lockDto.amount);
        expect(info.recordId).to.be.equal(dto.id);
        expect(info.endHeight.toString()).to.be.equal(lockDto.endHeight);
        expect(info.ownerAddress.encoded()).to.be.equal(lockDto.ownerAddress);
        expect(info.hash).to.be.equal(lockDto.hash);
        expect(info.mosaicId.toHex()).to.be.equal(lockDto.mosaicId);
        expect(info.status).to.be.equal(lockDto.status);
    }

    it('getHashLockInfo', async () => {
        when(hashLockRoutesApi.getHashLock(lockDto.hash)).thenReturn(Promise.resolve(dto));
        const hashInfo = await firstValueFrom(hashLockRepository.getHashLock(lockDto.hash));
        assertHashInfo(hashInfo);
    });

    it('search', async () => {
        const pagination = {} as Pagination;
        pagination.pageNumber = 1;
        pagination.pageSize = 1;

        const body = {} as HashLockPage;
        body.data = [dto];
        body.pagination = pagination;
        when(hashLockRoutesApi.searchHashLock(address.plain(), undefined, undefined, undefined, undefined)).thenReturn(
            Promise.resolve(body),
        );
        const infos = await firstValueFrom(hashLockRepository.search({ address }));
        assertHashInfo(infos.data[0]);
    });

    it('getHashLockInfo - Error', async () => {
        when(hashLockRoutesApi.getHashLock(lockDto.hash)).thenReject(new Error('Mocked Error'));
        await firstValueFrom(hashLockRepository.getHashLock(lockDto.hash)).catch((error) => expect(error).not.to.be.undefined);
    });

    it('streamer', async () => {
        const accountHttp = new HashLockHttp('url');
        expect(accountHttp.streamer() instanceof HashLockPaginationStreamer).to.be.true;
    });

    it('Merkle', async () => {
        const merkleStateInfoDTO = {} as MerkleStateInfoDTO;
        const merkleLeafDTO = {} as MerkleTreeLeafDTO;
        merkleLeafDTO.encodedPath = 'path';
        merkleLeafDTO.leafHash = 'hash';
        merkleLeafDTO.nibbleCount = 1;
        merkleLeafDTO.path = 'path';
        merkleLeafDTO.type = 255;
        merkleLeafDTO.value = 'value';
        merkleStateInfoDTO.raw = 'raw';
        merkleStateInfoDTO.tree = [merkleLeafDTO];

        when(hashLockRoutesApi.getHashLockMerkle('hash')).thenReturn(Promise.resolve(merkleStateInfoDTO));
        const merkle = await firstValueFrom(hashLockRepository.getHashLockMerkle('hash'));
        expect(merkle.raw).to.be.equal(merkleStateInfoDTO.raw);
        expect(merkle.tree.leaf).not.to.be.undefined;
    });
});
