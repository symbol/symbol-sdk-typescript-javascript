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
    MerklePathItemDTO,
    MerkleProofInfoDTO,
    PositionEnum,
    ReceiptRoutesApi,
    StatementsDTO,
} from 'symbol-openapi-typescript-fetch-client';
import { instance, mock, reset, when } from 'ts-mockito';
import { DtoMapping } from '../../src/core/utils/DtoMapping';
import { ReceiptHttp } from '../../src/infrastructure/ReceiptHttp';
import { PublicAccount } from '../../src/model/account/PublicAccount';
import { UInt64 } from '../../src/model/model';
import { NetworkType } from '../../src/model/network/NetworkType';

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
        const statementDto = {} as StatementsDTO;
        statementDto.addressResolutionStatements = [];
        statementDto.transactionStatements = [];
        statementDto.mosaicResolutionStatements = [];

        when(receiptRoutesApi.getBlockReceipts('1')).thenReturn(Promise.resolve(statementDto));

        const statement = await receiptRepository.getBlockReceipts(UInt64.fromUint(1)).toPromise();
        expect(statement).to.be.not.null;
        expect(statement.addressResolutionStatements.length).to.be.equal(0);
        expect(statement.mosaicResolutionStatements.length).to.be.equal(0);
        expect(statement.transactionStatements.length).to.be.equal(0);
    });

    it('getMerkleReceipts', async () => {
        const merkleProofInfoDto = {} as MerkleProofInfoDTO;
        const merklePathDto = {} as MerklePathItemDTO;
        merklePathDto.hash = 'merkleHash';
        merklePathDto.position = PositionEnum.Left;
        merkleProofInfoDto.merklePath = [merklePathDto];

        when(receiptRoutesApi.getMerkleReceipts('1', 'Hash')).thenReturn(Promise.resolve(merkleProofInfoDto));

        const proof = await receiptRepository.getMerkleReceipts(UInt64.fromUint(1), 'Hash').toPromise();
        expect(proof).to.be.not.null;
        expect(proof.merklePath!.length).to.be.greaterThan(0);
        expect(proof.merklePath![0].hash).to.be.equal('merkleHash');
        expect(proof.merklePath![0].position!.toString()).to.be.equal('left');
    });

    it('getBlockReceipt - Error', async () => {
        when(receiptRoutesApi.getBlockReceipts('1')).thenReject(new Error('Mocked Error'));
        await receiptRepository
            .getBlockReceipts(UInt64.fromUint(1))
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });

    it('getMerkleReceipts - Error', async () => {
        when(receiptRoutesApi.getMerkleReceipts('1', 'Hash')).thenReject(new Error('Mocked Error'));
        await receiptRepository
            .getMerkleReceipts(UInt64.fromUint(1), 'Hash')
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });
});
