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
    AccountNamesDTO,
    AccountsNamesDTO,
    AliasDTO,
    AliasTypeEnum,
    MosaicNamesDTO,
    MosaicsNamesDTO,
    NamespaceDTO,
    NamespaceInfoDTO,
    NamespaceMetaDTO,
    NamespaceNameDTO,
    NamespaceRoutesApi,
    Pagination,
    NamespacePage,
} from 'symbol-openapi-typescript-fetch-client';
import { deepEqual, instance, mock, reset, when } from 'ts-mockito';
import { DtoMapping } from '../../src/core/utils/DtoMapping';
import { NamespaceHttp } from '../../src/infrastructure/NamespaceHttp';
import { NamespaceRepository } from '../../src/infrastructure/NamespaceRepository';
import { PublicAccount } from '../../src/model/account/PublicAccount';
import { MosaicId } from '../../src/model/mosaic/MosaicId';
import { NamespaceId } from '../../src/model/namespace/NamespaceId';
import { NamespaceInfo } from '../../src/model/namespace/NamespaceInfo';
import { NetworkType } from '../../src/model/network/NetworkType';

describe('NamespaceHttp', () => {
    const publicAccount = PublicAccount.createFromPublicKey(
        '9801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B6',
        NetworkType.PRIVATE_TEST,
    );
    const address = publicAccount.address;
    const mosaicId = new MosaicId('941299B2B7E1291C');
    const namespaceId = new NamespaceId('testnamespace');
    const namespaceMetaDto = {} as NamespaceMetaDTO;
    namespaceMetaDto.active = true;
    namespaceMetaDto.index = 0;

    const namespaceDto = {} as NamespaceDTO;
    const aliasDtoAddress = {} as AliasDTO;
    aliasDtoAddress.address = address.encoded();
    aliasDtoAddress.type = AliasTypeEnum.NUMBER_2;

    namespaceDto.alias = aliasDtoAddress;
    namespaceDto.depth = 1;
    namespaceDto.endHeight = '12';
    namespaceDto.level0 = namespaceId.toHex();
    namespaceDto.ownerAddress = address.encoded();
    namespaceDto.parentId = namespaceId.toHex();
    namespaceDto.registrationType = 0;
    namespaceDto.startHeight = '10';

    const namespaceInfoDto = {} as NamespaceInfoDTO;
    namespaceInfoDto.meta = namespaceMetaDto;
    namespaceInfoDto.namespace = namespaceDto;
    namespaceInfoDto.id = '1';

    const aliasDtoMosaic = {} as AliasDTO;
    aliasDtoMosaic.mosaicId = mosaicId.toHex();
    aliasDtoMosaic.type = AliasTypeEnum.NUMBER_1;
    const namespaceDtoMosaic = {} as NamespaceDTO;
    namespaceDtoMosaic.alias = aliasDtoMosaic;
    namespaceDtoMosaic.depth = 1;
    namespaceDtoMosaic.endHeight = '12';
    namespaceDtoMosaic.level0 = namespaceId.toHex();
    namespaceDtoMosaic.ownerAddress = address.encoded();
    namespaceDtoMosaic.parentId = namespaceId.toHex();
    namespaceDtoMosaic.registrationType = 0;
    namespaceDtoMosaic.startHeight = '10';

    const namespaceInfoDtoMosaic = {} as NamespaceInfoDTO;
    namespaceInfoDtoMosaic.meta = namespaceMetaDto;
    namespaceInfoDtoMosaic.namespace = namespaceDtoMosaic;

    const url = 'http://someHost';
    const response: http.IncomingMessage = mock();
    const namespaceRoutesApi: NamespaceRoutesApi = mock();
    const namespaceRepository: NamespaceRepository = DtoMapping.assign(new NamespaceHttp(url, NetworkType.PRIVATE_TEST), {
        namespaceRoutesApi: instance(namespaceRoutesApi),
    });

    function assertNamespaceInfo(namespace: NamespaceInfo): void {
        expect(namespace.active).to.be.true;
        expect(namespace.alias.address?.plain()).to.be.equal(address.plain());
        expect(namespace.alias.mosaicId).to.be.undefined;
        expect(namespace.alias.type).to.be.equal(2);
        expect(namespace.depth).to.be.equal(1);
        expect(namespace.endHeight.toString()).to.be.equal('12');
        expect(namespace.startHeight.toString()).to.be.equal('10');
        expect(namespace.metaId).to.be.equal('1');
        expect(namespace.index).to.be.equal(0);
        expect(namespace.levels[0].toHex()).to.be.equal(namespaceId.toHex());
        expect(namespace.isRoot()).to.be.true;
        expect(namespace.ownerAddress.plain()).to.be.equal(address.plain());
    }

    before(() => {
        reset(response);
        reset(namespaceRoutesApi);
    });

    it('getAccountNames', async () => {
        const accountsNamesDto = {} as AccountsNamesDTO;
        const accountNamesDto = {} as AccountNamesDTO;
        accountNamesDto.address = address.encoded();
        accountNamesDto.names = ['name1', 'name2'];
        accountsNamesDto.accountNames = [accountNamesDto];

        when(namespaceRoutesApi.getAccountsNames(deepEqual({ addresses: [address.plain()] }))).thenReturn(
            Promise.resolve(accountsNamesDto),
        );
        const accountNames = await namespaceRepository.getAccountsNames([address]).toPromise();
        expect(accountNames.length).to.be.greaterThan(0);
        expect(accountNames[0].address.plain()).to.be.equal(address.plain());
        expect(accountNames[0].names.map((n) => n.name).join(',')).to.be.equal(['name1', 'name2'].join(','));
    });

    it('getMosaicNames', async () => {
        const mosaicsNamesDto = {} as MosaicsNamesDTO;
        const mosaicNamesDto = {} as MosaicNamesDTO;
        mosaicNamesDto.mosaicId = mosaicId.toHex();
        mosaicNamesDto.names = ['name1', 'name2'];
        mosaicsNamesDto.mosaicNames = [mosaicNamesDto];

        when(namespaceRoutesApi.getMosaicsNames(deepEqual({ mosaicIds: [mosaicId.toHex()] }))).thenReturn(Promise.resolve(mosaicsNamesDto));
        const names = await namespaceRepository.getMosaicsNames([mosaicId]).toPromise();
        expect(names.length).to.be.greaterThan(0);
        expect(names[0].mosaicId.toHex()).to.be.equal(mosaicId.toHex());
        expect(names[0].names.map((n) => n.name).join(',')).to.be.equal(['name1', 'name2'].join(','));
    });

    it('getNamespace', async () => {
        when(namespaceRoutesApi.getNamespace(deepEqual(namespaceId.toHex()))).thenReturn(Promise.resolve(namespaceInfoDto));
        const namespace = await namespaceRepository.getNamespace(namespaceId).toPromise();
        assertNamespaceInfo(namespace);
    });

    it('getNamespaceName', async () => {
        const namespaceNameParent = {} as NamespaceNameDTO;
        namespaceNameParent.id = namespaceId.toHex();
        namespaceNameParent.name = 'parent';

        const namespaceNameChild = {} as NamespaceNameDTO;
        namespaceNameChild.id = new NamespaceId('child').toHex();
        namespaceNameChild.name = 'child';
        namespaceNameChild.parentId = namespaceId.toHex();

        when(namespaceRoutesApi.getNamespacesNames(deepEqual({ namespaceIds: [namespaceId.toHex()] }))).thenReturn(
            Promise.resolve([namespaceNameParent, namespaceNameChild]),
        );
        const namespace = await namespaceRepository.getNamespacesNames([namespaceId]).toPromise();
        expect(namespace.length).to.be.equal(2);
        expect(namespace[0].name).to.be.equal('parent');
        expect(namespace[0].namespaceId.toHex()).to.be.equal(namespaceId.toHex());
        expect(namespace[0].parentId).to.be.undefined;
        expect(namespace[1].name).to.be.equal('child');
        expect(namespace[1].parentId!.toHex()).to.be.equal(namespaceId.toHex());
        expect(namespace[1].namespaceId.toHex()).to.be.equal(new NamespaceId('child').toHex());
    });

    it('getLinkedAddress', async () => {
        when(namespaceRoutesApi.getNamespace(deepEqual(namespaceId.toHex()))).thenReturn(Promise.resolve(namespaceInfoDto));
        const namespaces = await namespaceRepository.getLinkedAddress(namespaceId).toPromise();

        expect(namespaces?.plain()).to.be.equal(address.plain());
    });

    it('getLinkedMosaicId', async () => {
        when(namespaceRoutesApi.getNamespace(deepEqual(namespaceId.toHex()))).thenReturn(Promise.resolve(namespaceInfoDtoMosaic));
        const namespaces = await namespaceRepository.getLinkedMosaicId(namespaceId).toPromise();

        expect(namespaces?.toHex()).to.be.equal(mosaicId.toHex());
    });

    it('getLinkedMosaicId - Error', async () => {
        when(namespaceRoutesApi.getNamespace(deepEqual(namespaceId.toHex()))).thenReturn(Promise.resolve(namespaceInfoDto));
        await namespaceRepository
            .getLinkedMosaicId(namespaceId)
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });

    it('getLinkedAddress - Error', async () => {
        when(namespaceRoutesApi.getNamespace(deepEqual(namespaceId.toHex()))).thenReturn(Promise.resolve(namespaceInfoDtoMosaic));
        await namespaceRepository
            .getLinkedAddress(namespaceId)
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });

    it('searchNameapsces', async () => {
        const pagination = {} as Pagination;
        pagination.pageNumber = 1;
        pagination.pageSize = 1;

        const body = {} as NamespacePage;
        body.data = [namespaceInfoDto];
        body.pagination = pagination;
        when(
            namespaceRoutesApi.searchNamespaces(
                deepEqual(address.plain()),
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        ).thenReturn(Promise.resolve(body));
        const infos = await namespaceRepository.search({ ownerAddress: address }).toPromise();
        assertNamespaceInfo(infos.data[0]);
    });
});
