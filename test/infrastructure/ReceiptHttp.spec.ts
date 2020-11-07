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
    BalanceChangeReceiptDTO,
    Pagination,
    ReceiptRoutesApi,
    ReceiptTypeEnum,
    ResolutionEntryDTO,
    ResolutionStatementDTO,
    ResolutionStatementInfoDTO,
    ResolutionStatementPage,
    SourceDTO,
    TransactionStatementDTO,
    TransactionStatementInfoDTO,
    TransactionStatementPage,
} from 'symbol-openapi-typescript-fetch-client';
import { instance, mock, reset, when } from 'ts-mockito';
import { Convert } from '../../src/core/format/Convert';
import { RawAddress } from '../../src/core/format/RawAddress';
import { DtoMapping } from '../../src/core/utils/DtoMapping';
import { ReceiptHttp } from '../../src/infrastructure/ReceiptHttp';
import { MosaicId, NamespaceId, ResolutionType, UInt64 } from '../../src/model';
import { PublicAccount } from '../../src/model/account/PublicAccount';
import { NetworkType } from '../../src/model/network/NetworkType';
import { BalanceChangeReceipt } from '../../src/model/receipt/BalanceChangeReceipt';

describe('ReceiptHttp', () => {
    const publicAccount = PublicAccount.createFromPublicKey(
        '9801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B6',
        NetworkType.PRIVATE_TEST,
    );
    const address = publicAccount.address;
    const url = 'http://someHost';
    const response: http.IncomingMessage = mock();
    const receiptRoutesApi: ReceiptRoutesApi = mock();
    const receiptRepository = DtoMapping.assign(new ReceiptHttp(url, NetworkType.PRIVATE_TEST), {
        receiptRoutesApi: instance(receiptRoutesApi),
    });

    before(() => {
        reset(response);
        reset(receiptRoutesApi);
    });

    it('Search Receipt - Mosaic', async () => {
        const resolutionStatementInfoDto = {} as ResolutionStatementInfoDTO;
        resolutionStatementInfoDto.id = '1';
        const resolutionStatementDto = {} as ResolutionStatementDTO;
        resolutionStatementDto.height = '1';
        resolutionStatementDto.unresolved = new NamespaceId('test').toHex();
        const resolutionEntry = {} as ResolutionEntryDTO;
        resolutionEntry.resolved = new MosaicId('85BBEA6CC462B244').toHex();
        const source = {} as SourceDTO;
        source.primaryId = 1;
        source.secondaryId = 1;
        resolutionEntry.source = source;
        resolutionStatementDto.resolutionEntries = [resolutionEntry];
        resolutionStatementInfoDto.statement = resolutionStatementDto;

        const resolutionPage = {} as ResolutionStatementPage;
        resolutionPage.data = [resolutionStatementInfoDto];
        const pagination = {} as Pagination;
        pagination.pageNumber = 1;
        pagination.pageSize = 20;
        resolutionPage.pagination = pagination;

        when(receiptRoutesApi.searchMosaicResolutionStatements('1', undefined, undefined, undefined, undefined)).thenReturn(
            Promise.resolve(resolutionPage),
        );

        const statement = await receiptRepository
            .searchMosaicResolutionStatements({
                height: UInt64.fromUint(1),
            })
            .toPromise();
        expect(statement).to.be.not.null;
        expect(statement.data[0].height.toString()).to.be.equal('1');
        expect(statement.data[0].resolutionType.valueOf()).to.be.equal(ResolutionType.Mosaic);
        expect((statement.data[0].unresolved as NamespaceId).toHex()).to.be.equal(new NamespaceId('test').toHex());
    });

    it('Search Receipt - Address', async () => {
        const resolutionStatementInfoDto = {} as ResolutionStatementInfoDTO;
        resolutionStatementInfoDto.id = '1';
        const resolutionStatementDto = {} as ResolutionStatementDTO;
        resolutionStatementDto.height = '1';
        resolutionStatementDto.unresolved = Convert.uint8ToHex(
            RawAddress.aliasToRecipient(Convert.hexToUint8(new NamespaceId('test').toHex()), NetworkType.PRIVATE_TEST),
        );
        const resolutionEntry = {} as ResolutionEntryDTO;
        resolutionEntry.resolved = address.encoded();
        const source = {} as SourceDTO;
        source.primaryId = 1;
        source.secondaryId = 1;
        resolutionEntry.source = source;
        resolutionStatementDto.resolutionEntries = [resolutionEntry];
        resolutionStatementInfoDto.statement = resolutionStatementDto;

        const resolutionPage = {} as ResolutionStatementPage;
        resolutionPage.data = [resolutionStatementInfoDto];
        const pagination = {} as Pagination;
        pagination.pageNumber = 1;
        pagination.pageSize = 20;
        resolutionPage.pagination = pagination;

        when(receiptRoutesApi.searchAddressResolutionStatements('1', undefined, undefined, undefined, undefined)).thenReturn(
            Promise.resolve(resolutionPage),
        );

        const statement = await receiptRepository
            .searchAddressResolutionStatements({
                height: UInt64.fromUint(1),
            })
            .toPromise();
        expect(statement).to.be.not.null;
        expect(statement.data[0].height.toString()).to.be.equal('1');
        expect(statement.data[0].resolutionType.valueOf()).to.be.equal(ResolutionType.Address);
        expect((statement.data[0].unresolved as NamespaceId).toHex()).to.be.equal(new NamespaceId('test').toHex());
        expect(statement.data[0].resolutionEntries[0].resolved.plain()).to.be.equal(address.plain());
    });

    it('Search Receipt - Transaction', async () => {
        const transactionStatementInfoDto = {} as TransactionStatementInfoDTO;
        transactionStatementInfoDto.id = '1';
        const transactionStatementDto = {} as TransactionStatementDTO;
        transactionStatementDto.height = '1';
        const receipt = {} as BalanceChangeReceiptDTO;
        receipt.amount = '100';
        receipt.mosaicId = '85BBEA6CC462B244';
        receipt.targetAddress = address.encoded();
        receipt.type = ReceiptTypeEnum.NUMBER_20803;
        receipt.version = 1;
        transactionStatementDto.receipts = [receipt];
        const source = {} as SourceDTO;
        source.primaryId = 1;
        source.secondaryId = 1;
        transactionStatementDto.source = source;
        transactionStatementInfoDto.statement = transactionStatementDto;

        const resolutionPage = {} as TransactionStatementPage;
        resolutionPage.data = [transactionStatementInfoDto];
        const pagination = {} as Pagination;
        pagination.pageNumber = 1;
        pagination.pageSize = 20;
        resolutionPage.pagination = pagination;

        when(
            receiptRoutesApi.searchReceipts(
                '1',
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        ).thenReturn(Promise.resolve(resolutionPage));

        const statement = await receiptRepository
            .searchReceipts({
                height: UInt64.fromUint(1),
            })
            .toPromise();
        expect(statement).to.be.not.null;
        expect(statement.data[0].height.toString()).to.be.equal('1');
        expect((statement.data[0].receipts[0] as BalanceChangeReceipt).amount.toString()).to.be.equal('100');
    });

    it('searchResolutionTransaction - Error', async () => {
        when(
            receiptRoutesApi.searchReceipts(
                '1',
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        ).thenReject(new Error('Mocked Error'));
        await receiptRepository
            .searchReceipts({ height: UInt64.fromUint(1) })
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });

    it('searchResolutionMosaic - Error', async () => {
        when(receiptRoutesApi.searchMosaicResolutionStatements('1', undefined, undefined, undefined, undefined)).thenReject(
            new Error('Mocked Error'),
        );
        await receiptRepository
            .searchMosaicResolutionStatements({ height: UInt64.fromUint(1) })
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });

    it('searchResolutionAddress - Error', async () => {
        when(receiptRoutesApi.searchAddressResolutionStatements('1', undefined, undefined, undefined, undefined)).thenReject(
            new Error('Mocked Error'),
        );
        await receiptRepository
            .searchAddressResolutionStatements({ height: UInt64.fromUint(1) })
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });
});
