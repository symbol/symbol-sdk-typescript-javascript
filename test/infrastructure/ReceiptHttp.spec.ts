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
import * as http from 'http';
import {
    MerklePathItemDTO,
    MerkleProofInfoDTO,
    PositionEnum,
    ReceiptRoutesApi,
    StatementsDTO,
} from 'symbol-openapi-typescript-node-client';
import { instance, mock, reset, when } from 'ts-mockito';
import { DtoMapping } from '../../src/core/utils/DtoMapping';
import { ReceiptHttp } from '../../src/infrastructure/ReceiptHttp';
import { ReceiptRepository } from '../../src/infrastructure/ReceiptRepository';
import { expect } from 'chai';
import { Account } from '../../src/model/account/Account';
import { NetworkType } from '../../src/model/network/NetworkType';
import { TransactionStatementDTO } from 'symbol-openapi-typescript-node-client/model/transactionStatementDTO';
import { ResolutionStatementDTO } from 'symbol-openapi-typescript-node-client/model/resolutionStatementDTO';

describe('ReceiptHttp', () => {
    const url = 'http://someHost';
    const response: http.IncomingMessage = mock();
    const receiptRoutesApi: ReceiptRoutesApi = mock();
    const networkType = NetworkType.MIJIN_TEST;
    const receiptRepository: ReceiptRepository = DtoMapping.assign(new ReceiptHttp(url, networkType), {
        receiptRoutesApi: instance(receiptRoutesApi),
    });

    const account = Account.createFromPrivateKey('D242FB34C2C4DD36E995B9C865F93940065E326661BA5A4A247331D211FE3A3D', networkType);
    const transactionStatementsDTO: TransactionStatementDTO[] = [
        {
            statement: {
                height: '52',
                source: {
                    primaryId: 0,
                    secondaryId: 0,
                },
                receipts: [
                    {
                        version: 1,
                        type: 8515,
                        targetPublicKey: account.publicKey,
                        mosaicId: '85BBEA6CC462B244',
                        amount: '1000',
                    },
                ],
            },
        },
    ];
    const addressResolutionStatementsDTO: ResolutionStatementDTO[] = [
        {
            statement: {
                height: '1488',
                unresolved: '9103B60AAF2762688300000000000000000000000000000000',
                resolutionEntries: [
                    {
                        source: {
                            primaryId: 4,
                            secondaryId: 0,
                        },
                        resolved: '917E7E29A01014C2F300000000000000000000000000000000',
                    },
                ],
            },
        },
        {
            statement: {
                height: '1488',
                unresolved: '917E7E29A01014C2F300000000000000000000000000000000',
                resolutionEntries: [
                    {
                        source: {
                            primaryId: 2,
                            secondaryId: 0,
                        },
                        resolved: '9103B60AAF2762688300000000000000000000000000000000',
                    },
                ],
            },
        },
    ];
    const mosaicResolutionStatementsDTO: ResolutionStatementDTO[] = [
        {
            statement: {
                height: '1506',
                unresolved: '85BBEA6CC462B244',
                resolutionEntries: [
                    {
                        source: {
                            primaryId: 1,
                            secondaryId: 0,
                        },
                        resolved: '941299B2B7E1291C',
                    },
                ],
            },
        },
        {
            statement: {
                height: '1506',
                unresolved: '85BBEA6CC462B244',
                resolutionEntries: [
                    {
                        source: {
                            primaryId: 5,
                            secondaryId: 0,
                        },
                        resolved: '941299B2B7E1291C',
                    },
                ],
            },
        },
    ];

    before(() => {
        reset(response);
        reset(receiptRoutesApi);
    });

    const statementDTO: StatementsDTO = {
        transactionStatements: transactionStatementsDTO,
        addressResolutionStatements: addressResolutionStatementsDTO,
        mosaicResolutionStatements: mosaicResolutionStatementsDTO,
    };

    it('getMerkleReceipts', async () => {
        const merkleProofInfoDTO = new MerkleProofInfoDTO();
        const merlePathDto = new MerklePathItemDTO();
        merlePathDto.position = PositionEnum.Left;
        merlePathDto.hash = 'bcd';
        merkleProofInfoDTO.merklePath = [merlePathDto];
        when(receiptRoutesApi.getMerkleReceipts('1', 'abc')).thenReturn(
            Promise.resolve({
                response,
                body: merkleProofInfoDTO,
            }),
        );
        const merkleProofInfo = await receiptRepository.getMerkleReceipts(BigInt(1), 'abc').toPromise();
        expect(merkleProofInfo.merklePath && merkleProofInfo.merklePath.length).to.be.equals(1);
        expect(merkleProofInfo.merklePath && merkleProofInfo.merklePath[0].position).to.be.equals(PositionEnum.Left);
        expect(merkleProofInfo.merklePath && merkleProofInfo.merklePath[0].hash).to.be.equals('bcd');
    });

    it('getBlockReceipts', async () => {
        when(receiptRoutesApi.getBlockReceipts('1')).thenReturn(
            Promise.resolve({
                response,
                body: statementDTO,
            }),
        );
        const statements = await receiptRepository.getBlockReceipts(BigInt(1)).toPromise();
        expect(statements.transactionStatements.length).to.be.equals(1);
        expect(statements.addressResolutionStatements.length).to.be.equals(2);
        expect(statements.mosaicResolutionStatements.length).to.be.equals(2);
    });
});
