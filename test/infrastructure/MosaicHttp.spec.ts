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
    MerkleTreeLeafDTO,
    Mosaic,
    MosaicDTO,
    MosaicIds,
    MosaicInfoDTO,
    MosaicPage,
    MosaicRoutesApi,
    Pagination,
} from 'symbol-openapi-typescript-fetch-client';
import { MerkleStateInfoDTO } from 'symbol-openapi-typescript-fetch-client/src/models/MerkleStateInfoDTO';
import { deepEqual, instance, mock, reset, when } from 'ts-mockito';
import { DtoMapping } from '../../src/core/utils/DtoMapping';
import { MosaicHttp } from '../../src/infrastructure/MosaicHttp';
import { MosaicRepository } from '../../src/infrastructure/MosaicRepository';
import { MosaicPaginationStreamer } from '../../src/infrastructure/paginationStreamer/MosaicPaginationStreamer';
import { toPromise } from '../../src/infrastructure/rxUtils';
import { PublicAccount } from '../../src/model/account/PublicAccount';
import { MosaicId } from '../../src/model/mosaic/MosaicId';
import { MosaicInfo } from '../../src/model/mosaic/MosaicInfo';
import { NetworkType } from '../../src/model/network/NetworkType';

describe('MosaicHttp', () => {
    const publicAccount = PublicAccount.createFromPublicKey(
        '9801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B6',
        NetworkType.TEST_NET,
    );
    const address = publicAccount.address;
    const mosaicId = new MosaicId('941299B2B7E1291C');
    const mosaic = {} as Mosaic;
    mosaic.amount = '777';
    mosaic.id = mosaicId.toHex();

    const mosaicDto = {} as MosaicDTO;
    mosaicDto.divisibility = 6;
    mosaicDto.duration = '10';
    mosaicDto.flags = 1;
    mosaicDto.id = mosaicId.toHex();
    mosaicDto.ownerAddress = address.encoded();
    mosaicDto.revision = 0;
    mosaicDto.startHeight = '1';
    mosaicDto.supply = '100';

    const mosaicInfoDto = {} as MosaicInfoDTO;
    mosaicInfoDto.mosaic = mosaicDto;

    const url = 'http://someHost';
    const response: http.IncomingMessage = mock();
    const mosaicRoutesApi: MosaicRoutesApi = mock();
    const mosaicRepository: MosaicRepository = DtoMapping.assign(new MosaicHttp(url, NetworkType.TEST_NET), {
        mosaicRoutesApi: instance(mosaicRoutesApi),
    });

    before(() => {
        reset(response);
        reset(mosaicRoutesApi);
    });

    function assertMosaicInfo(mosaicInfo: MosaicInfo): void {
        expect(mosaicInfo).to.be.not.null;
        expect(mosaicInfo.divisibility).to.be.equals(6);
        expect(mosaicInfo.duration.toString()).to.be.equals(mosaicDto.duration);
        expect(mosaicInfo.flags.getValue()).to.be.equals(mosaicDto.flags);
        expect(mosaicInfo.startHeight.toString()).to.be.equals(mosaicDto.startHeight);
        expect(mosaicInfo.supply.toString()).to.be.equals(mosaicDto.supply);
        expect(mosaicInfo.ownerAddress.encoded()).to.be.equals(mosaicDto.ownerAddress);
        expect(mosaicInfo.revision).to.be.equals(mosaicDto.revision);
        expect(mosaicInfo.id.toHex()).to.be.equals(mosaicId.toHex());
    }

    it('getMosaic', async () => {
        when(mosaicRoutesApi.getMosaic(mosaicId.toHex())).thenReturn(Promise.resolve(mosaicInfoDto));
        const mosaicInfo = await toPromise(mosaicRepository.getMosaic(mosaicId));
        assertMosaicInfo(mosaicInfo);
    });

    it('getMosaics', async () => {
        const mosaicIds = {} as MosaicIds;
        mosaicIds.mosaicIds = [mosaicId.toHex()];
        when(mosaicRoutesApi.getMosaics(deepEqual(mosaicIds))).thenReturn(Promise.resolve([mosaicInfoDto]));
        const mosaicInfos = await toPromise(mosaicRepository.getMosaics([mosaicId]));
        assertMosaicInfo(mosaicInfos[0]);
    });

    it('searchMosaics', async () => {
        const pagination = {} as Pagination;
        pagination.pageNumber = 1;
        pagination.pageSize = 1;

        const body = {} as MosaicPage;
        body.data = [mosaicInfoDto];
        body.pagination = pagination;

        when(mosaicRoutesApi.searchMosaics(deepEqual(address.plain()), undefined, undefined, undefined, undefined)).thenReturn(
            Promise.resolve(body),
        );
        const mosaicsInfo = await toPromise(mosaicRepository.search({ ownerAddress: address }));
        assertMosaicInfo(mosaicsInfo.data[0]);
    });

    it('getMosaic - Error', async () => {
        when(mosaicRoutesApi.getMosaic(mosaicId.toHex())).thenReject(new Error('Mocked Error'));
        await mosaicRepository
            .getMosaic(mosaicId)
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });

    it('getMosaics - Error', async () => {
        const mosaicIds = {} as MosaicIds;
        mosaicIds.mosaicIds = [mosaicId.toHex()];
        when(mosaicRoutesApi.getMosaics(deepEqual(mosaicIds))).thenReject(new Error('Mocked Error'));
        await mosaicRepository
            .getMosaics([mosaicId])
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });

    it('searchMosaics - Error', async () => {
        when(mosaicRoutesApi.searchMosaics(deepEqual(address.plain()), undefined, undefined, undefined, undefined)).thenThrow(
            new Error('Mocked Error'),
        );
        await mosaicRepository
            .search({ ownerAddress: address })
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });

    it('streamer', async () => {
        const accountHttp = new MosaicHttp('url');
        expect(accountHttp.streamer() instanceof MosaicPaginationStreamer).to.be.true;
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

        when(mosaicRoutesApi.getMosaicMerkle(mosaicId.toHex())).thenReturn(Promise.resolve(merkleStateInfoDTO));
        const merkle = await toPromise(mosaicRepository.getMosaicMerkle(mosaicId));
        expect(merkle.raw).to.be.equal(merkleStateInfoDTO.raw);
        expect(merkle.tree.leaf).not.to.be.undefined;
    });
});
