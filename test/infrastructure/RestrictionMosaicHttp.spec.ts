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
    RestrictionMosaicRoutesApi,
    MosaicAddressRestrictionDTO,
    MosaicAddressRestrictionEntryWrapperDTO,
    MosaicAddressRestrictionEntryDTO,
    MosaicRestrictionEntryTypeEnum,
    MosaicGlobalRestrictionDTO,
    MosaicGlobalRestrictionEntryDTO,
    MosaicGlobalRestrictionEntryWrapperDTO,
    MosaicGlobalRestrictionEntryRestrictionDTO,
    MosaicRestrictionTypeEnum,
} from 'symbol-openapi-typescript-node-client';
import { instance, mock, reset, when, deepEqual } from 'ts-mockito';
import { DtoMapping } from '../../src/core/utils/DtoMapping';
import { NetworkType } from '../../src/model/network/NetworkType';
import { PublicAccount } from '../../src/model/account/PublicAccount';
import { RestrictionMosaicHttp } from '../../src/infrastructure/RestrictionMosaicHttp';
import { MosaicId } from '../../src/model/mosaic/MosaicId';

describe('RestrictionMosaicHttp', () => {
    const publicAccount = PublicAccount.createFromPublicKey(
        '9801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B6',
        NetworkType.MIJIN_TEST,
    );
    const address = publicAccount.address;
    const mosaicId = new MosaicId('941299B2B7E1291C');
    const url = 'http://someHost';
    const response: http.IncomingMessage = mock();
    const restrictionMosaicRoutesApi: RestrictionMosaicRoutesApi = mock();
    const restrictionMosaicRepository = DtoMapping.assign(new RestrictionMosaicHttp(url), {
        restrictionMosaicRoutesApi: instance(restrictionMosaicRoutesApi),
    });

    const mosaicAddressRestrictionDto = new MosaicAddressRestrictionDTO();
    const mosaicAddressRestrictionEntryWrapperDto = new MosaicAddressRestrictionEntryWrapperDTO();
    const mosaicAddressRestrictionEntryDto = new MosaicAddressRestrictionEntryDTO();

    mosaicAddressRestrictionEntryDto.key = 'key';
    mosaicAddressRestrictionEntryDto.value = 'value';

    mosaicAddressRestrictionEntryWrapperDto.compositeHash = 'hash';
    mosaicAddressRestrictionEntryWrapperDto.entryType = MosaicRestrictionEntryTypeEnum.NUMBER_0;
    mosaicAddressRestrictionEntryWrapperDto.mosaicId = mosaicId.toHex();
    mosaicAddressRestrictionEntryWrapperDto.targetAddress = address.encoded();
    mosaicAddressRestrictionEntryWrapperDto.restrictions = [mosaicAddressRestrictionEntryDto];

    mosaicAddressRestrictionDto.mosaicRestrictionEntry = mosaicAddressRestrictionEntryWrapperDto;

    const mosaicGlobalRestrictionDto = new MosaicGlobalRestrictionDTO();
    const mosaicGlobalRestrictionEntryWrapperDto = new MosaicGlobalRestrictionEntryWrapperDTO();
    const mosaicGlobalRestrictionEntryDto = new MosaicGlobalRestrictionEntryDTO();
    const mosaicGlobalRestrictionEntryRestrictionDto = new MosaicGlobalRestrictionEntryRestrictionDTO();
    mosaicGlobalRestrictionEntryRestrictionDto.referenceMosaicId = mosaicId.toHex();
    mosaicGlobalRestrictionEntryRestrictionDto.restrictionType = MosaicRestrictionTypeEnum.NUMBER_0;
    mosaicGlobalRestrictionEntryRestrictionDto.restrictionValue = 'value';
    mosaicGlobalRestrictionEntryDto.key = 'key';
    mosaicGlobalRestrictionEntryDto.restriction = mosaicGlobalRestrictionEntryRestrictionDto;

    mosaicGlobalRestrictionEntryWrapperDto.compositeHash = 'hash';
    mosaicGlobalRestrictionEntryWrapperDto.entryType = MosaicRestrictionEntryTypeEnum.NUMBER_0;
    mosaicGlobalRestrictionEntryWrapperDto.mosaicId = mosaicId.toHex();
    mosaicGlobalRestrictionEntryWrapperDto.restrictions = [mosaicGlobalRestrictionEntryDto];

    mosaicGlobalRestrictionDto.mosaicRestrictionEntry = mosaicGlobalRestrictionEntryWrapperDto;

    before(() => {
        reset(response);
        reset(restrictionMosaicRoutesApi);
    });

    it('getMosaicAddressRestriction', async () => {
        when(restrictionMosaicRoutesApi.getMosaicAddressRestriction(mosaicId.toHex(), address.plain())).thenReturn(
            Promise.resolve({ response, body: mosaicAddressRestrictionDto }),
        );

        const restrictions = await restrictionMosaicRepository.getMosaicAddressRestriction(mosaicId, address).toPromise();
        expect(restrictions).to.be.not.null;
        expect(restrictions.compositeHash).to.be.equal('hash');
        expect(restrictions.entryType.valueOf()).to.be.equal(0);
        expect(restrictions.mosaicId.toHex()).to.be.equal(mosaicId.toHex());
        expect(restrictions.targetAddress.plain()).to.be.equal(address.plain());
        expect(restrictions.restrictions.get('key')).not.to.be.undefined;
    });

    it('getMosaicAddressRestrictions', async () => {
        when(
            restrictionMosaicRoutesApi.getMosaicAddressRestrictions(mosaicId.toHex(), deepEqual({ addresses: [address.plain()] })),
        ).thenReturn(Promise.resolve({ response, body: [mosaicAddressRestrictionDto] }));

        const restrictions = await restrictionMosaicRepository.getMosaicAddressRestrictions(mosaicId, [address]).toPromise();
        expect(restrictions).to.be.not.null;
        expect(restrictions[0].compositeHash).to.be.equal('hash');
        expect(restrictions[0].entryType.valueOf()).to.be.equal(0);
        expect(restrictions[0].mosaicId.toHex()).to.be.equal(mosaicId.toHex());
        expect(restrictions[0].targetAddress.plain()).to.be.equal(address.plain());
        expect(restrictions[0].restrictions.get('key')).not.to.be.undefined;
    });

    it('getMosaicGlobalRestriction', async () => {
        when(restrictionMosaicRoutesApi.getMosaicGlobalRestriction(mosaicId.toHex())).thenReturn(
            Promise.resolve({ response, body: mosaicGlobalRestrictionDto }),
        );

        const restrictions = await restrictionMosaicRepository.getMosaicGlobalRestriction(mosaicId).toPromise();
        expect(restrictions).to.be.not.null;
        expect(restrictions.compositeHash).to.be.equal('hash');
        expect(restrictions.entryType.valueOf()).to.be.equal(0);
        expect(restrictions.mosaicId.toHex()).to.be.equal(mosaicId.toHex());
        expect(restrictions.restrictions.get('key')).not.to.be.undefined;
    });

    it('getMosaicGlobalRestrictions', async () => {
        when(restrictionMosaicRoutesApi.getMosaicGlobalRestrictions(deepEqual({ mosaicIds: [mosaicId.toHex()] }))).thenReturn(
            Promise.resolve({ response, body: [mosaicGlobalRestrictionDto] }),
        );

        const restrictions = await restrictionMosaicRepository.getMosaicGlobalRestrictions([mosaicId]).toPromise();
        expect(restrictions).to.be.not.null;
        expect(restrictions[0].compositeHash).to.be.equal('hash');
        expect(restrictions[0].entryType.valueOf()).to.be.equal(0);
        expect(restrictions[0].mosaicId.toHex()).to.be.equal(mosaicId.toHex());
        expect(restrictions[0].restrictions.get('key')).not.to.be.undefined;
    });

    it('getMosaicAddressRestriction - Error', async () => {
        when(restrictionMosaicRoutesApi.getMosaicAddressRestriction(mosaicId.toHex(), address.plain())).thenReject(
            new Error('Mocked Error'),
        );
        await restrictionMosaicRepository
            .getMosaicAddressRestriction(mosaicId, address)
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });

    it('getMosaicAddressRestrictions - Error', async () => {
        when(
            restrictionMosaicRoutesApi.getMosaicAddressRestrictions(mosaicId.toHex(), deepEqual({ addresses: [address.plain()] })),
        ).thenReject(new Error('Mocked Error'));
        await restrictionMosaicRepository
            .getMosaicAddressRestrictions(mosaicId, [address])
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });

    it('getMosaicGlobalRestriction - Error', async () => {
        when(restrictionMosaicRoutesApi.getMosaicGlobalRestriction(mosaicId.toHex())).thenReject(new Error('Mocked Error'));
        await restrictionMosaicRepository
            .getMosaicGlobalRestriction(mosaicId)
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });

    it('getMosaicGlobalRestriction - Error', async () => {
        when(restrictionMosaicRoutesApi.getMosaicGlobalRestrictions(deepEqual({ mosaicIds: [mosaicId.toHex()] }))).thenReject(
            new Error('Mocked Error'),
        );
        await restrictionMosaicRepository
            .getMosaicGlobalRestrictions([mosaicId])
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });
});
