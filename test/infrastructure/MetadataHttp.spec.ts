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
    MetadataDTO,
    MetadataEntriesDTO,
    MetadataEntryDTO,
    MetadataRoutesApi,
    MetadataTypeEnum,
} from 'symbol-openapi-typescript-node-client';
import { instance, mock, reset, when } from 'ts-mockito';
import { DtoMapping } from '../../src/core/utils/DtoMapping';
import { MetadataHttp } from '../../src/infrastructure/MetadataHttp';
import { MetadataRepository } from '../../src/infrastructure/MetadataRepository';
import { QueryParams } from '../../src/infrastructure/QueryParams';
import { Address } from '../../src/model/account/Address';
import { Metadata } from '../../src/model/metadata/Metadata';
import { MetadataType } from '../../src/model/metadata/MetadataType';
import { MosaicId } from '../../src/model/mosaic/MosaicId';
import { NamespaceId } from '../../src/model/namespace/NamespaceId';
import { Order } from 'symbol-openapi-typescript-node-client/dist/model/order';

describe('MetadataHttp', () => {
    const address = Address.createFromRawAddress('MCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPR72DYSX');
    const mosaicId = new MosaicId('941299B2B7E1291C');
    const namespaceId = new NamespaceId('some.address');

    const metadataDTOMosaic = new MetadataDTO();
    metadataDTOMosaic.id = 'aaa';

    const metadataEntryDtoMosaic = new MetadataEntryDTO();
    metadataEntryDtoMosaic.compositeHash = '1';
    metadataEntryDtoMosaic.metadataType = MetadataTypeEnum.NUMBER_1;
    metadataEntryDtoMosaic.scopedMetadataKey = '123451234512345A';
    metadataEntryDtoMosaic.senderPublicKey = 'aSenderPublicKey1';
    metadataEntryDtoMosaic.targetPublicKey = 'aTargetPublicKey1';
    metadataEntryDtoMosaic.value = 'value1';
    metadataEntryDtoMosaic.targetId = '941299B2B7E1291C' as any;
    metadataDTOMosaic.metadataEntry = metadataEntryDtoMosaic;

    const metadataDTOAddress = new MetadataDTO();
    metadataDTOAddress.id = 'bbb';

    const metadataEntryDtoAddress = new MetadataEntryDTO();
    metadataEntryDtoAddress.compositeHash = '2';
    metadataEntryDtoAddress.metadataType = MetadataTypeEnum.NUMBER_0;
    metadataEntryDtoAddress.scopedMetadataKey = '123451234512345B';
    metadataEntryDtoAddress.senderPublicKey = 'aSenderPublicKey2';
    metadataEntryDtoAddress.targetPublicKey = 'aTargetPublicKey2';
    metadataEntryDtoAddress.value = 'value1';
    metadataEntryDtoAddress.targetId = '941299B2B7E1291D' as any;
    metadataDTOAddress.metadataEntry = metadataEntryDtoAddress;

    const metadataDTONamespace = new MetadataDTO();
    metadataDTONamespace.id = 'ccc';

    const metadataEntryDtoNamespace = new MetadataEntryDTO();
    metadataEntryDtoNamespace.compositeHash = '3';
    metadataEntryDtoNamespace.metadataType = MetadataTypeEnum.NUMBER_2;
    metadataEntryDtoNamespace.scopedMetadataKey = '123451234512345C';
    metadataEntryDtoNamespace.senderPublicKey = 'aSenderPublicKey3';
    metadataEntryDtoNamespace.targetPublicKey = 'aTargetPublicKey3';
    metadataEntryDtoNamespace.value = 'value1';
    metadataEntryDtoNamespace.targetId = '941299B2B7E1291E' as any;
    metadataDTONamespace.metadataEntry = metadataEntryDtoNamespace;

    const metadataEntriesDTO = new MetadataEntriesDTO();
    metadataEntriesDTO.metadataEntries = [metadataDTOMosaic, metadataDTOAddress, metadataDTONamespace];

    const url = 'http://someHost';
    const response: http.IncomingMessage = mock();
    const metadataRoutesApi: MetadataRoutesApi = mock();
    const metadataRepository: MetadataRepository = DtoMapping.assign(new MetadataHttp(url), {
        metadataRoutesApi: instance(metadataRoutesApi),
    });
    before(() => {
        reset(response);
        reset(metadataRoutesApi);
    });

    function assertMetadataInfo(metadataInfo: Metadata, dto: MetadataDTO): void {
        expect(metadataInfo).to.be.not.null;
        expect(metadataInfo.id).to.be.equals(dto.id);
        if (metadataInfo.metadataEntry.metadataType === MetadataType.Mosaic) {
            expect(metadataInfo.metadataEntry.targetId!.toHex()).to.be.equals(dto.metadataEntry.targetId);
        }
        if (metadataInfo.metadataEntry.metadataType === MetadataType.Account) {
            expect(metadataInfo.metadataEntry.targetId).to.be.undefined;
        }
        if (metadataInfo.metadataEntry.metadataType === MetadataType.Namespace) {
            expect(metadataInfo.metadataEntry.targetId!.toHex()).to.be.equals(dto.metadataEntry.targetId);
        }
        expect(metadataInfo.metadataEntry.targetPublicKey).to.be.equals(dto.metadataEntry.targetPublicKey);
        expect(metadataInfo.metadataEntry.scopedMetadataKey.toHex()).to.be.equals(dto.metadataEntry.scopedMetadataKey);
        expect(metadataInfo.metadataEntry.compositeHash).to.be.equals(dto.metadataEntry.compositeHash);
    }

    it('getAccountMetadata', async () => {
        when(metadataRoutesApi.getAccountMetadata(address.plain(), 1, Order.Desc, 'a')).thenReturn(
            Promise.resolve({
                response,
                body: metadataEntriesDTO,
            }),
        );
        const metadatas = await metadataRepository
            .getAccountMetadata(
                address,
                new QueryParams({
                    pageSize: 1,
                    id: 'a',
                }),
            )
            .toPromise();
        expect(metadatas.length).to.be.equals(3);
        assertMetadataInfo(metadatas[0], metadataDTOMosaic);
        assertMetadataInfo(metadatas[1], metadataDTOAddress);
        assertMetadataInfo(metadatas[2], metadataDTONamespace);
    });

    it('getAccountMetadataByKey', async () => {
        when(metadataRoutesApi.getAccountMetadataByKey(address.plain(), 'aaa')).thenReturn(
            Promise.resolve({
                response,
                body: metadataEntriesDTO,
            }),
        );
        const metadatas = await metadataRepository.getAccountMetadataByKey(address, 'aaa').toPromise();
        assertMetadataInfo(metadatas[0], metadataDTOMosaic);
        assertMetadataInfo(metadatas[1], metadataDTOAddress);
        assertMetadataInfo(metadatas[2], metadataDTONamespace);
    });

    it('getAccountMetadataByKeyAndSender', async () => {
        when(metadataRoutesApi.getAccountMetadataByKeyAndSender(address.plain(), 'aaa', 'sender')).thenReturn(
            Promise.resolve({
                response,
                body: metadataDTOMosaic,
            }),
        );
        const metadata = await metadataRepository.getAccountMetadataByKeyAndSender(address, 'aaa', 'sender').toPromise();
        assertMetadataInfo(metadata, metadataDTOMosaic);
    });

    it('getMosaicMetadata', async () => {
        when(metadataRoutesApi.getMosaicMetadata(mosaicId.toHex(), 1, 'a', Order.Desc)).thenReturn(
            Promise.resolve({
                response,
                body: metadataEntriesDTO,
            }),
        );
        const metadatas = await metadataRepository
            .getMosaicMetadata(
                mosaicId,
                new QueryParams({
                    pageSize: 1,
                    id: 'a',
                }),
            )
            .toPromise();
        expect(metadatas.length).to.be.equals(3);
        assertMetadataInfo(metadatas[0], metadataDTOMosaic);
        assertMetadataInfo(metadatas[1], metadataDTOAddress);
        assertMetadataInfo(metadatas[2], metadataDTONamespace);
    });

    it('getMosaicMetadataByKey', async () => {
        when(metadataRoutesApi.getMosaicMetadataByKey(mosaicId.toHex(), 'aaa')).thenReturn(
            Promise.resolve({
                response,
                body: metadataEntriesDTO,
            }),
        );
        const metadatas = await metadataRepository.getMosaicMetadataByKey(mosaicId, 'aaa').toPromise();
        assertMetadataInfo(metadatas[0], metadataDTOMosaic);
        assertMetadataInfo(metadatas[1], metadataDTOAddress);
        assertMetadataInfo(metadatas[2], metadataDTONamespace);
    });

    it('getMosaicMetadataByKeyAndSender', async () => {
        when(metadataRoutesApi.getMosaicMetadataByKeyAndSender(mosaicId.toHex(), 'aaa', 'sender')).thenReturn(
            Promise.resolve({
                response,
                body: metadataDTOMosaic,
            }),
        );
        const metadata = await metadataRepository.getMosaicMetadataByKeyAndSender(mosaicId, 'aaa', 'sender').toPromise();
        assertMetadataInfo(metadata, metadataDTOMosaic);
    });

    it('getNamespaceMetadata', async () => {
        when(metadataRoutesApi.getNamespaceMetadata(namespaceId.toHex(), 2, 'a', Order.Desc)).thenReturn(
            Promise.resolve({
                response,
                body: metadataEntriesDTO,
            }),
        );
        const metadatas = await metadataRepository
            .getNamespaceMetadata(
                namespaceId,
                new QueryParams({
                    pageSize: 2,
                    id: 'a',
                }),
            )
            .toPromise();
        expect(metadatas.length).to.be.equals(3);
        assertMetadataInfo(metadatas[0], metadataDTOMosaic);
        assertMetadataInfo(metadatas[1], metadataDTOAddress);
        assertMetadataInfo(metadatas[2], metadataDTONamespace);
    });

    it('getNamespaceMetadataByKey', async () => {
        when(metadataRoutesApi.getNamespaceMetadataByKey(namespaceId.toHex(), 'bbb')).thenReturn(
            Promise.resolve({
                response,
                body: metadataEntriesDTO,
            }),
        );
        const metadatas = await metadataRepository.getNamespaceMetadataByKey(namespaceId, 'bbb').toPromise();
        assertMetadataInfo(metadatas[0], metadataDTOMosaic);
        assertMetadataInfo(metadatas[1], metadataDTOAddress);
        assertMetadataInfo(metadatas[2], metadataDTONamespace);
    });

    it('getNamespaceMetadataByKeyAndSender', async () => {
        when(metadataRoutesApi.getNamespaceMetadataByKeyAndSender(namespaceId.toHex(), 'cccc', 'sender1')).thenReturn(
            Promise.resolve({
                response,
                body: metadataDTOMosaic,
            }),
        );
        const metadata = await metadataRepository.getNamespaceMetadataByKeyAndSender(namespaceId, 'cccc', 'sender1').toPromise();
        assertMetadataInfo(metadata, metadataDTOMosaic);
    });
});
