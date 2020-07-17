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
    AccountRestrictionDTO,
    AccountRestrictionFlagsEnum,
    AccountRestrictionsDTO,
    AccountRestrictionsInfoDTO,
    ReceiptRoutesApi,
    ResolutionStatementDTO,
    ResolutionEntryDTO,
    SourceDTO,
    ResolutionStatementPage,
} from 'symbol-openapi-typescript-fetch-client';
import { instance, mock, reset, when } from 'ts-mockito';
import { DtoMapping } from '../../src/core/utils/DtoMapping';
import { ReceiptHttp } from '../../src/infrastructure/ReceiptHttp';
import { PublicAccount } from '../../src/model/account/PublicAccount';
import { UInt64, NamespaceId, MosaicId, StatementType, ResolutionType } from '../../src/model/model';
import { NetworkType } from '../../src/model/network/NetworkType';
import { ResolutionStatementInfoDTO } from 'symbol-openapi-typescript-fetch-client';
import { Pagination } from 'symbol-openapi-typescript-fetch-client';
import { ResolutionStatement } from '../../src/model/receipt/ResolutionStatement';

describe('ReceiptHttp', () => {
    const publicAccount = PublicAccount.createFromPublicKey(
        '9801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B6',
        NetworkType.MIJIN_TEST,
    );
    const address = publicAccount.address;
    const url = 'http://someHost';
    const response: http.IncomingMessage = mock();
    const receiptRoutesApi: ReceiptRoutesApi = mock();
    const receiptRepository = DtoMapping.assign(new ReceiptHttp(url, NetworkType.MIJIN_TEST), {
        receiptRoutesApi: instance(receiptRoutesApi),
    });

    const restrictionInfo = {} as AccountRestrictionsInfoDTO;
    const restrictionsDto = {} as AccountRestrictionsDTO;
    const restriction = {} as AccountRestrictionDTO;
    restriction.restrictionFlags = AccountRestrictionFlagsEnum.NUMBER_1;
    restriction.values = [address.encoded()];
    restrictionsDto.restrictions = [restriction];
    restrictionsDto.address = address.encoded();

    restrictionInfo.accountRestrictions = restrictionsDto;

    before(() => {
        reset(response);
        reset(receiptRoutesApi);
    });

    it('getBlockReceipt', async () => {
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
        pagination.totalEntries = 1;
        pagination.totalPages = 1;
        resolutionPage.pagination = pagination;

        when(receiptRoutesApi.searchMosaicResolutionStatements('1', undefined, undefined, undefined, undefined)).thenReturn(
            Promise.resolve(resolutionPage),
        );

        const statement = await receiptRepository
            .search({
                statementType: StatementType.MosaicResolutionStatement,
                height: UInt64.fromUint(1),
            })
            .toPromise();
        expect(statement).to.be.not.null;
        expect((statement.data[0] as ResolutionStatement).height.toString()).to.be.equal('1');
        expect((statement.data[0] as ResolutionStatement).resolutionType.valueOf()).to.be.equal(ResolutionType.Mosaic);
        expect(((statement.data[0] as ResolutionStatement).unresolved as NamespaceId).toHex()).to.be.equal(new NamespaceId('test').toHex());
    });

    it('getBlockReceipt - Error', async () => {
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
            .search({ statementType: StatementType.TransactionStatement, height: UInt64.fromUint(1) })
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });

    it('getBlockReceipt - Error no type', async () => {
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
        expect(() => {
            receiptRepository.search({ height: UInt64.fromUint(1) }).toPromise();
        }).to.throw(Error, `Search criteria 'StatementType' must be provided.`);
    });
});
