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
    MetadataEntryDTO,
    MetadataRoutesApi,
    MetadataTypeEnum,
    Order,
    MetadataInfoDTO,
    MetadataPage,
    Pagination,
} from 'symbol-openapi-typescript-fetch-client';
import { instance, mock, reset, when } from 'ts-mockito';
import { DtoMapping } from '../../src/core/utils/DtoMapping';
import { MetadataHttp } from '../../src/infrastructure/MetadataHttp';
import { MetadataRepository } from '../../src/infrastructure/MetadataRepository';
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

    const pagination = {} as Pagination;
    pagination.pageNumber = 1;
    pagination.pageSize = 1;
    pagination.totalEntries = 1;
    pagination.totalPages = 1;

    const metadataDTOMosaic = {} as MetadataInfoDTO;
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

    const metadataPageMosaic = {} as MetadataPage;
    metadataPageMosaic.data = [metadataDTOMosaic];
    metadataPageMosaic.pagination = pagination;

    const metadataDTOAddress = {} as MetadataInfoDTO;
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

    const metadataPageAccount = {} as MetadataPage;
    metadataPageAccount.data = [metadataDTOAddress];
    metadataPageAccount.pagination = pagination;

    const metadataDTONamespace = {} as MetadataInfoDTO;
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

    const metadataPageNamespace = {} as MetadataPage;
    metadataPageNamespace.data = [metadataDTONamespace];
    metadataPageNamespace.pagination = pagination;

    const metadataPage = {} as MetadataPage;
    metadataPage.data = [metadataDTOMosaic, metadataDTOAddress, metadataDTONamespace];
    metadataPage.pagination = pagination;

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

    function assertMetadataInfo(metadataInfo: Metadata, dto: MetadataInfoDTO): void {
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
        when(
            metadataRoutesApi.searchMetadataEntries(
                undefined,
                address.plain(),
                undefined,
                undefined,
                undefined,
                undefined,
                1,
                undefined,
                Order.Asc,
            ),
        ).thenReturn(Promise.resolve(metadataPage));
        const metadatas = await metadataRepository.search({ targetAddress: address, pageNumber: 1, order: Order.Asc }).toPromise();
        expect(metadatas.data.length).to.be.equals(3);
        assertMetadataInfo(metadatas.data[0], metadataDTOMosaic);
        assertMetadataInfo(metadatas.data[1], metadataDTOAddress);
        assertMetadataInfo(metadatas.data[2], metadataDTONamespace);
    });

    it('getAccountMetadataByKey', async () => {
        when(
            metadataRoutesApi.searchMetadataEntries(
                undefined,
                address.plain(),
                'aaa',
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        ).thenReturn(Promise.resolve(metadataPage));
        const metadatas = await metadataRepository.search({ targetAddress: address, scopedMetadataKey: 'aaa' }).toPromise();
        assertMetadataInfo(metadatas.data[0], metadataDTOMosaic);
        assertMetadataInfo(metadatas.data[1], metadataDTOAddress);
        assertMetadataInfo(metadatas.data[2], metadataDTONamespace);
    });

    it('getAccountMetadataByKeyAndSender', async () => {
        when(
            metadataRoutesApi.searchMetadataEntries(
                address.plain(),
                address.plain(),
                'aaa',
                undefined,
                MetadataTypeEnum.NUMBER_0,
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        ).thenReturn(Promise.resolve(metadataPageMosaic));
        const metadata = await metadataRepository
            .search({
                sourceAddress: address,
                scopedMetadataKey: 'aaa',
                targetAddress: address,
                metadataType: MetadataType.Account,
            })
            .toPromise();
        assertMetadataInfo(metadata.data[0], metadataDTOMosaic);
    });

    it('getMosaicMetadata', async () => {
        when(
            metadataRoutesApi.searchMetadataEntries(
                undefined,
                undefined,
                undefined,
                mosaicId.toHex(),
                MetadataTypeEnum.NUMBER_1.valueOf(),
                2,
                undefined,
                undefined,
                Order.Desc,
            ),
        ).thenReturn(Promise.resolve(metadataPage));
        const metadatas = await metadataRepository
            .search({
                targetId: mosaicId,
                metadataType: MetadataType.Mosaic,
                pageSize: 2,
                order: Order.Desc,
            })
            .toPromise();
        expect(metadatas.data.length).to.be.equals(3);
        assertMetadataInfo(metadatas.data[0], metadataDTOMosaic);
        assertMetadataInfo(metadatas.data[1], metadataDTOAddress);
        assertMetadataInfo(metadatas.data[2], metadataDTONamespace);
    });

    it('getMosaicMetadataByKey', async () => {
        when(
            metadataRoutesApi.searchMetadataEntries(
                undefined,
                undefined,
                'aaa',
                mosaicId.toHex(),
                MetadataTypeEnum.NUMBER_1,
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        ).thenReturn(Promise.resolve(metadataPage));
        const metadatas = await metadataRepository
            .search({ targetId: mosaicId, scopedMetadataKey: 'aaa', metadataType: MetadataType.Mosaic })
            .toPromise();
        assertMetadataInfo(metadatas.data[0], metadataDTOMosaic);
        assertMetadataInfo(metadatas.data[1], metadataDTOAddress);
        assertMetadataInfo(metadatas.data[2], metadataDTONamespace);
    });

    it('getMosaicMetadataByKeyAndSender', async () => {
        when(
            metadataRoutesApi.searchMetadataEntries(
                address.plain(),
                undefined,
                'aaa',
                mosaicId.toHex(),
                MetadataTypeEnum.NUMBER_1,
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        ).thenReturn(Promise.resolve(metadataPageMosaic));
        const metadata = await metadataRepository
            .search({ targetId: mosaicId, scopedMetadataKey: 'aaa', sourceAddress: address, metadataType: MetadataType.Mosaic })
            .toPromise();
        assertMetadataInfo(metadata.data[0], metadataDTOMosaic);
    });

    it('getNamespaceMetadata', async () => {
        when(
            metadataRoutesApi.searchMetadataEntries(
                undefined,
                undefined,
                undefined,
                namespaceId.toHex(),
                MetadataTypeEnum.NUMBER_2.valueOf(),
                2,
                undefined,
                undefined,
                Order.Desc,
            ),
        ).thenReturn(Promise.resolve(metadataPage));
        const metadatas = await metadataRepository
            .search({
                targetId: namespaceId,
                metadataType: MetadataType.Namespace,
                pageSize: 2,
                order: Order.Desc,
            })
            .toPromise();
        expect(metadatas.data.length).to.be.equals(3);
        assertMetadataInfo(metadatas.data[0], metadataDTOMosaic);
        assertMetadataInfo(metadatas.data[1], metadataDTOAddress);
        assertMetadataInfo(metadatas.data[2], metadataDTONamespace);
    });

    it('getNamespaceMetadataByKey', async () => {
        when(
            metadataRoutesApi.searchMetadataEntries(
                undefined,
                undefined,
                'bbb',
                namespaceId.toHex(),
                MetadataTypeEnum.NUMBER_2.valueOf(),
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        ).thenReturn(Promise.resolve(metadataPage));
        const metadatas = await metadataRepository
            .search({ targetId: namespaceId, scopedMetadataKey: 'bbb', metadataType: MetadataType.Namespace })
            .toPromise();
        assertMetadataInfo(metadatas.data[0], metadataDTOMosaic);
        assertMetadataInfo(metadatas.data[1], metadataDTOAddress);
        assertMetadataInfo(metadatas.data[2], metadataDTONamespace);
    });

    it('getNamespaceMetadataByKeyAndSender', async () => {
        when(
            metadataRoutesApi.searchMetadataEntries(
                address.plain(),
                undefined,
                'cccc',
                namespaceId.toHex(),
                MetadataTypeEnum.NUMBER_2.valueOf(),
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        ).thenReturn(Promise.resolve(metadataPageNamespace));
        const metadata = await metadataRepository
            .search({ sourceAddress: address, targetId: namespaceId, scopedMetadataKey: 'cccc', metadataType: MetadataType.Namespace })
            .toPromise();
        assertMetadataInfo(metadata.data[0], metadataDTONamespace);
    });

    it('Address meta no previous value', (done) => {
        when(
            metadataRoutesApi.searchMetadataEntries(
                address.plain(),
                address.plain(),
                '85BBEA6CC462B244',
                undefined,
                MetadataTypeEnum.NUMBER_0,
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        ).thenReturn(Promise.reject(notFoundResponse));
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
        when(
            metadataRoutesApi.searchMetadataEntries(
                address.plain(),
                undefined,
                '85BBEA6CC462B244',
                mosaicId.toHex(),
                MetadataTypeEnum.NUMBER_1,
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        ).thenReturn(Promise.reject(notFoundResponse));
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
        when(
            metadataRoutesApi.searchMetadataEntries(
                address.plain(),
                undefined,
                '85BBEA6CC462B244',
                namespaceId.toHex(),
                MetadataTypeEnum.NUMBER_2,
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        ).thenReturn(Promise.reject(notFoundResponse));
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
        when(
            metadataRoutesApi.searchMetadataEntries(
                address.plain(),
                address.plain(),
                '85BBEA6CC462B244',
                undefined,
                MetadataTypeEnum.NUMBER_0,
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        ).thenReturn(Promise.reject(notFoundResponse));
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
        when(
            metadataRoutesApi.searchMetadataEntries(
                address.plain(),
                undefined,
                '85BBEA6CC462B244',
                mosaicId.toHex(),
                MetadataTypeEnum.NUMBER_1,
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        ).thenReturn(Promise.reject(notFoundResponse));
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
        when(
            metadataRoutesApi.searchMetadataEntries(
                address.plain(),
                undefined,
                '85BBEA6CC462B244',
                namespaceId.toHex(),
                MetadataTypeEnum.NUMBER_2,
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        ).thenReturn(Promise.reject(notFoundResponse));
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
