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
    MerkleStateInfoDTO,
    MerkleTreeLeafDTO,
    MosaicAddressRestrictionDTO,
    MosaicAddressRestrictionEntryDTO,
    MosaicAddressRestrictionEntryWrapperDTO,
    MosaicGlobalRestrictionDTO,
    MosaicGlobalRestrictionEntryDTO,
    MosaicGlobalRestrictionEntryRestrictionDTO,
    MosaicGlobalRestrictionEntryWrapperDTO,
    MosaicRestrictionEntryTypeEnum,
    MosaicRestrictionsPage,
    MosaicRestrictionTypeEnum,
    Pagination,
    RestrictionMosaicRoutesApi,
} from 'symbol-openapi-typescript-fetch-client';
import { instance, mock, reset, when } from 'ts-mockito';
import { DtoMapping } from '../../src/core/utils';
import { RestrictionMosaicHttp, RestrictionMosaicPaginationStreamer } from '../../src/infrastructure';
import { toPromise } from '../../src/infrastructure/rxUtils';
import { UInt64 } from '../../src/model';
import { PublicAccount } from '../../src/model/account';
import { MosaicId } from '../../src/model/mosaic';
import { NetworkType } from '../../src/model/network';
import { MosaicAddressRestriction } from '../../src/model/restriction';

describe('RestrictionMosaicHttp', () => {
    const publicAccount = PublicAccount.createFromPublicKey(
        '9801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B6',
        NetworkType.TEST_NET,
    );
    const address = publicAccount.address;
    const mosaicId = new MosaicId('941299B2B7E1291C');
    const url = 'http://someHost';
    const response: http.IncomingMessage = mock();
    const restrictionMosaicRoutesApi: RestrictionMosaicRoutesApi = mock();
    const restrictionMosaicRepository = DtoMapping.assign(new RestrictionMosaicHttp(url), {
        restrictionMosaicRoutesApi: instance(restrictionMosaicRoutesApi),
    });

    const mosaicAddressRestrictionDto = {} as MosaicAddressRestrictionDTO;
    const mosaicAddressRestrictionEntryWrapperDto = {} as MosaicAddressRestrictionEntryWrapperDTO;
    const mosaicAddressRestrictionEntryDto = {} as MosaicAddressRestrictionEntryDTO;

    mosaicAddressRestrictionEntryDto.key = '10';
    mosaicAddressRestrictionEntryDto.value = '20';

    mosaicAddressRestrictionEntryWrapperDto.compositeHash = 'hash';
    mosaicAddressRestrictionEntryWrapperDto.entryType = MosaicRestrictionEntryTypeEnum.NUMBER_0;
    mosaicAddressRestrictionEntryWrapperDto.mosaicId = mosaicId.toHex();
    mosaicAddressRestrictionEntryWrapperDto.targetAddress = address.encoded();
    mosaicAddressRestrictionEntryWrapperDto.restrictions = [mosaicAddressRestrictionEntryDto];

    mosaicAddressRestrictionDto.mosaicRestrictionEntry = mosaicAddressRestrictionEntryWrapperDto;

    const mosaicGlobalRestrictionDto = {} as MosaicGlobalRestrictionDTO;
    const mosaicGlobalRestrictionEntryWrapperDto = {} as MosaicGlobalRestrictionEntryWrapperDTO;
    const mosaicGlobalRestrictionEntryDto = {} as MosaicGlobalRestrictionEntryDTO;
    const mosaicGlobalRestrictionEntryRestrictionDto = {} as MosaicGlobalRestrictionEntryRestrictionDTO;
    mosaicGlobalRestrictionEntryRestrictionDto.referenceMosaicId = mosaicId.toHex();
    mosaicGlobalRestrictionEntryRestrictionDto.restrictionType = MosaicRestrictionTypeEnum.NUMBER_0;
    mosaicGlobalRestrictionEntryRestrictionDto.restrictionValue = '200';
    mosaicGlobalRestrictionEntryDto.key = '100';
    mosaicGlobalRestrictionEntryDto.restriction = mosaicGlobalRestrictionEntryRestrictionDto;

    mosaicGlobalRestrictionEntryWrapperDto.compositeHash = 'hash';
    mosaicGlobalRestrictionEntryWrapperDto.entryType = MosaicRestrictionEntryTypeEnum.NUMBER_0;
    mosaicGlobalRestrictionEntryWrapperDto.mosaicId = mosaicId.toHex();
    mosaicGlobalRestrictionEntryWrapperDto.restrictions = [mosaicGlobalRestrictionEntryDto];

    mosaicGlobalRestrictionDto.mosaicRestrictionEntry = mosaicGlobalRestrictionEntryWrapperDto;

    const pagination = {} as Pagination;
    pagination.pageNumber = 1;
    pagination.pageSize = 1;

    const body = {} as MosaicRestrictionsPage;
    body.data = [mosaicGlobalRestrictionDto, mosaicAddressRestrictionDto];
    body.pagination = pagination;

    before(() => {
        reset(response);
        reset(restrictionMosaicRoutesApi);
    });

    it('search', async () => {
        when(
            restrictionMosaicRoutesApi.searchMosaicRestrictions(
                mosaicId.toHex(),
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        ).thenReturn(Promise.resolve(body));

        const page = await toPromise(restrictionMosaicRepository.search({ mosaicId: mosaicId }));
        expect(page).to.be.not.null;
        expect(page.data.length).to.be.equal(2);
        expect(page.data[1].compositeHash).to.be.equal('hash');
        expect(page.data[1].entryType.valueOf()).to.be.equal(0);
        expect(page.data[1].mosaicId.toHex()).to.be.equal(mosaicId.toHex());
        expect((page.data[1] as MosaicAddressRestriction).targetAddress.plain()).to.be.equal(address.plain());
        expect(page.data[1].getRestriction(UInt64.fromNumericString('10'))).not.to.be.undefined;
        expect(page.data[0]).to.be.not.null;
        expect(page.data[0].compositeHash).to.be.equal('hash');
        expect(page.data[0].entryType.valueOf()).to.be.equal(0);
        expect(page.data[0].mosaicId.toHex()).to.be.equal(mosaicId.toHex());
        expect(page.data[0].getRestriction(UInt64.fromNumericString('100'))).not.to.be.undefined;
    });

    it('search - Error', async () => {
        when(
            restrictionMosaicRoutesApi.searchMosaicRestrictions(
                mosaicId.toHex(),
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        ).thenReject(new Error('Mocked Error'));
        await restrictionMosaicRepository
            .search({ mosaicId: mosaicId })
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });

    it('streamer', async () => {
        const accountHttp = new RestrictionMosaicHttp('url');
        expect(accountHttp.streamer() instanceof RestrictionMosaicPaginationStreamer).to.be.true;
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

        when(restrictionMosaicRoutesApi.getMosaicRestrictionsMerkle('hash')).thenReturn(Promise.resolve(merkleStateInfoDTO));
        const merkle = await toPromise(restrictionMosaicRepository.getMosaicRestrictionsMerkle('hash'));
        expect(merkle.raw).to.be.equal(merkleStateInfoDTO.raw);
        expect(merkle.tree.leaf).not.to.be.undefined;
    });
});
