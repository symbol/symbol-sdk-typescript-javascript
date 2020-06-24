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
import {
    MetadataDTO,
    MetadataEntriesDTO,
    MetadataEntryDTO,
    MetadataRoutesApi,
    MetadataTypeEnum,
    Order,
} from 'symbol-openapi-typescript-fetch-client';
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
import { NetworkType } from '../../src/model/network/NetworkType';
import { AccountMetadataTransaction } from '../../src/model/transaction/AccountMetadataTransaction';
import { Deadline } from '../../src/model/transaction/Deadline';
import { MosaicMetadataTransaction } from '../../src/model/transaction/MosaicMetadataTransaction';
import { NamespaceMetadataTransaction } from '../../src/model/transaction/NamespaceMetadataTransaction';
import { TransactionType } from '../../src/model/transaction/TransactionType';
import { UInt64 } from '../../src/model/UInt64';
import { MetadataTransactionService } from '../../src/service/MetadataTransactionService';

describe('MetadataHttp', () => {
    const address = Address.createFromRawAddress('SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMQ');
    const mosaicId = new MosaicId('941299B2B7E1291C');
    const namespaceId = new NamespaceId('some.address');

    const metadataDTOMosaic = {} as MetadataDTO;
    metadataDTOMosaic.id = 'aaa';

    const metadataEntryDtoMosaic = {} as MetadataEntryDTO;
    metadataEntryDtoMosaic.compositeHash = '1';
    metadataEntryDtoMosaic.metadataType = MetadataTypeEnum.NUMBER_1;
    metadataEntryDtoMosaic.scopedMetadataKey = '123451234512345A';
    metadataEntryDtoMosaic.sourceAddress = address.encoded();
    metadataEntryDtoMosaic.targetAddress = address.encoded();
    metadataEntryDtoMosaic.value = 'value1';
    metadataEntryDtoMosaic.targetId = '941299B2B7E1291C' as any;
    metadataDTOMosaic.metadataEntry = metadataEntryDtoMosaic;

    const metadataDTOAddress = {} as MetadataDTO;
    metadataDTOAddress.id = 'bbb';

    const metadataEntryDtoAddress = {} as MetadataEntryDTO;
    metadataEntryDtoAddress.compositeHash = '2';
    metadataEntryDtoAddress.metadataType = MetadataTypeEnum.NUMBER_0;
    metadataEntryDtoAddress.scopedMetadataKey = '123451234512345B';
    metadataEntryDtoAddress.sourceAddress = address.encoded();
    metadataEntryDtoAddress.targetAddress = address.encoded();
    metadataEntryDtoAddress.value = 'value1';
    metadataEntryDtoAddress.targetId = '941299B2B7E1291D' as any;
    metadataDTOAddress.metadataEntry = metadataEntryDtoAddress;

    const metadataDTONamespace = {} as MetadataDTO;
    metadataDTONamespace.id = 'ccc';

    const metadataEntryDtoNamespace = {} as MetadataEntryDTO;
    metadataEntryDtoNamespace.compositeHash = '3';
    metadataEntryDtoNamespace.metadataType = MetadataTypeEnum.NUMBER_2;
    metadataEntryDtoNamespace.scopedMetadataKey = '123451234512345C';
    metadataEntryDtoNamespace.sourceAddress = address.encoded();
    metadataEntryDtoNamespace.targetAddress = address.encoded();
    metadataEntryDtoNamespace.value = 'value1';
    metadataEntryDtoNamespace.targetId = '941299B2B7E1291E' as any;
    metadataDTONamespace.metadataEntry = metadataEntryDtoNamespace;

    const metadataEntriesDTO = {} as MetadataEntriesDTO;
    metadataEntriesDTO.metadataEntries = [metadataDTOMosaic, metadataDTOAddress, metadataDTONamespace];

    const url = 'http://someHost';
    const notFoundResponse = {
        status: 404,
        statusText: 'Not Found',
        json: (): Promise<any> => Promise.reject({ theBodyError: 'internal error' }),
    };
    const metadataRoutesApi: MetadataRoutesApi = mock();
    const metadataRepository: MetadataRepository = DtoMapping.assign(new MetadataHttp(url), {
        metadataRoutesApi: instance(metadataRoutesApi),
    });
    before(() => {
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
        expect(metadataInfo.metadataEntry.sourceAddress.encoded()).to.be.equals(dto.metadataEntry.sourceAddress);
        expect(metadataInfo.metadataEntry.targetAddress.encoded()).to.be.equals(dto.metadataEntry.targetAddress);
        expect(metadataInfo.metadataEntry.scopedMetadataKey.toHex()).to.be.equals(dto.metadataEntry.scopedMetadataKey);
        expect(metadataInfo.metadataEntry.compositeHash).to.be.equals(dto.metadataEntry.compositeHash);
    }

    it('getAccountMetadata', async () => {
        when(metadataRoutesApi.getAccountMetadata(address.plain(), 1, Order.Desc, 'a')).thenReturn(Promise.resolve(metadataEntriesDTO));
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
        when(metadataRoutesApi.getAccountMetadataByKey(address.plain(), 'aaa')).thenReturn(Promise.resolve(metadataEntriesDTO));
        const metadatas = await metadataRepository.getAccountMetadataByKey(address, 'aaa').toPromise();
        assertMetadataInfo(metadatas[0], metadataDTOMosaic);
        assertMetadataInfo(metadatas[1], metadataDTOAddress);
        assertMetadataInfo(metadatas[2], metadataDTONamespace);
    });

    it('getAccountMetadataByKeyAndSender', async () => {
        when(metadataRoutesApi.getAccountMetadataByKeyAndSender(address.plain(), 'aaa', address.plain())).thenReturn(
            Promise.resolve(metadataDTOMosaic),
        );
        const metadata = await metadataRepository.getAccountMetadataByKeyAndSender(address, 'aaa', address).toPromise();
        assertMetadataInfo(metadata, metadataDTOMosaic);
    });

    it('getMosaicMetadata', async () => {
        when(metadataRoutesApi.getMosaicMetadata(mosaicId.toHex(), 1, 'a', Order.Desc)).thenReturn(Promise.resolve(metadataEntriesDTO));
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
        when(metadataRoutesApi.getMosaicMetadataByKey(mosaicId.toHex(), 'aaa')).thenReturn(Promise.resolve(metadataEntriesDTO));
        const metadatas = await metadataRepository.getMosaicMetadataByKey(mosaicId, 'aaa').toPromise();
        assertMetadataInfo(metadatas[0], metadataDTOMosaic);
        assertMetadataInfo(metadatas[1], metadataDTOAddress);
        assertMetadataInfo(metadatas[2], metadataDTONamespace);
    });

    it('getMosaicMetadataByKeyAndSender', async () => {
        when(metadataRoutesApi.getMosaicMetadataByKeyAndSender(mosaicId.toHex(), 'aaa', address.plain())).thenReturn(
            Promise.resolve(metadataDTOMosaic),
        );
        const metadata = await metadataRepository.getMosaicMetadataByKeyAndSender(mosaicId, 'aaa', address).toPromise();
        assertMetadataInfo(metadata, metadataDTOMosaic);
    });

    it('getNamespaceMetadata', async () => {
        when(metadataRoutesApi.getNamespaceMetadata(namespaceId.toHex(), 2, 'a', Order.Desc)).thenReturn(
            Promise.resolve(metadataEntriesDTO),
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
        when(metadataRoutesApi.getNamespaceMetadataByKey(namespaceId.toHex(), 'bbb')).thenReturn(Promise.resolve(metadataEntriesDTO));
        const metadatas = await metadataRepository.getNamespaceMetadataByKey(namespaceId, 'bbb').toPromise();
        assertMetadataInfo(metadatas[0], metadataDTOMosaic);
        assertMetadataInfo(metadatas[1], metadataDTOAddress);
        assertMetadataInfo(metadatas[2], metadataDTONamespace);
    });

    it('getNamespaceMetadataByKeyAndSender', async () => {
        when(metadataRoutesApi.getNamespaceMetadataByKeyAndSender(namespaceId.toHex(), 'cccc', address.plain())).thenReturn(
            Promise.resolve(metadataDTOMosaic),
        );
        const metadata = await metadataRepository.getNamespaceMetadataByKeyAndSender(namespaceId, 'cccc', address).toPromise();
        assertMetadataInfo(metadata, metadataDTOMosaic);
    });

    it('Address meta no previous value', (done) => {
        when(metadataRoutesApi.getAccountMetadataByKeyAndSender(address.plain(), '85BBEA6CC462B244', address.plain())).thenReturn(
            Promise.reject(notFoundResponse),
        );
        const metadataTransactionService = new MetadataTransactionService(metadataRepository);
        metadataTransactionService
            .createMetadataTransaction(
                Deadline.create(),
                NetworkType.MIJIN_TEST,
                MetadataType.Account,
                address,
                UInt64.fromHex('85BBEA6CC462B244'),
                'test',
                address,
            )
            .subscribe((transaction: AccountMetadataTransaction) => {
                expect(transaction.type).to.be.equal(TransactionType.ACCOUNT_METADATA);
                expect(transaction.scopedMetadataKey.toHex()).to.be.equal('85BBEA6CC462B244');
                done();
            });
    });

    it('Mosaic meta no previous value', (done) => {
        when(metadataRoutesApi.getMosaicMetadataByKeyAndSender(mosaicId.toHex(), '85BBEA6CC462B244', address.plain())).thenReturn(
            Promise.reject(notFoundResponse),
        );
        const metadataTransactionService = new MetadataTransactionService(metadataRepository);
        metadataTransactionService
            .createMetadataTransaction(
                Deadline.create(),
                NetworkType.MIJIN_TEST,
                MetadataType.Mosaic,
                address,
                UInt64.fromHex('85BBEA6CC462B244'),
                'test',
                address,
                mosaicId,
            )
            .subscribe((transaction: MosaicMetadataTransaction) => {
                expect(transaction.type).to.be.equal(TransactionType.MOSAIC_METADATA);
                expect(transaction.scopedMetadataKey.toHex()).to.be.equal('85BBEA6CC462B244');
                done();
            });
    });

    it('Namespace meta no previous value', (done) => {
        when(metadataRoutesApi.getNamespaceMetadataByKeyAndSender(namespaceId.toHex(), '85BBEA6CC462B244', address.plain())).thenReturn(
            Promise.reject(notFoundResponse),
        );
        const metadataTransactionService = new MetadataTransactionService(metadataRepository);
        metadataTransactionService
            .createMetadataTransaction(
                Deadline.create(),
                NetworkType.MIJIN_TEST,
                MetadataType.Namespace,
                address,
                UInt64.fromHex('85BBEA6CC462B244'),
                'test',
                address,
                namespaceId,
            )
            .subscribe((transaction: NamespaceMetadataTransaction) => {
                expect(transaction.type).to.be.equal(TransactionType.NAMESPACE_METADATA);
                expect(transaction.scopedMetadataKey.toHex()).to.be.equal('85BBEA6CC462B244');
                done();
            });
    });

    it('Address meta no previous value Error', async () => {
        when(metadataRoutesApi.getAccountMetadataByKeyAndSender(address.plain(), '85BBEA6CC462B244', address.plain())).thenReturn(
            Promise.reject(notFoundResponse),
        );
        const metadataTransactionService = new MetadataTransactionService(metadataRepository);
        await metadataTransactionService
            .createMetadataTransaction(
                Deadline.create(),
                NetworkType.MIJIN_TEST,
                MetadataType.Account,
                address,
                UInt64.fromHex('85BBEA6CC462B244'),
                'test',
                address,
            )
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });

    it('Mosaic meta no previous value', async () => {
        when(metadataRoutesApi.getMosaicMetadataByKeyAndSender(mosaicId.toHex(), '85BBEA6CC462B244', address.plain())).thenReturn(
            Promise.reject(notFoundResponse),
        );
        const metadataTransactionService = new MetadataTransactionService(metadataRepository);
        await metadataTransactionService
            .createMetadataTransaction(
                Deadline.create(),
                NetworkType.MIJIN_TEST,
                MetadataType.Mosaic,
                address,
                UInt64.fromHex('85BBEA6CC462B244'),
                'test',
                address,
                mosaicId,
            )
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });

    it('Namespace meta no previous value', async () => {
        when(metadataRoutesApi.getNamespaceMetadataByKeyAndSender(namespaceId.toHex(), '85BBEA6CC462B244', address.plain())).thenReturn(
            Promise.reject(notFoundResponse),
        );
        const metadataTransactionService = new MetadataTransactionService(metadataRepository);
        await metadataTransactionService
            .createMetadataTransaction(
                Deadline.create(),
                NetworkType.MIJIN_TEST,
                MetadataType.Namespace,
                address,
                UInt64.fromHex('85BBEA6CC462B244'),
                'test',
                address,
                namespaceId,
            )
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });
});
