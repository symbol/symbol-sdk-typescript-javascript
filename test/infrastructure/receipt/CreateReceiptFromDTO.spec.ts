/*
 * Copyright 2019 NEM
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

import { deepEqual } from 'assert';
import { expect } from 'chai';
import { ResolutionStatementInfoDTO, TransactionStatementInfoDTO } from 'symbol-openapi-typescript-fetch-client';
import {
    createAddressResolutionStatement,
    createMosaicResolutionStatement,
    createTransactionStatement,
} from '../../../src/infrastructure/receipt/CreateReceiptFromDTO';
import { Account } from '../../../src/model/account/Account';
import { Address } from '../../../src/model/account/Address';
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import { NamespaceId } from '../../../src/model/namespace/NamespaceId';
import { NetworkType } from '../../../src/model/network/NetworkType';
import { ReceiptType } from '../../../src/model/receipt/ReceiptType';
import { Statement } from '../../../src/model/receipt/Statement';
import { UInt64 } from '../../../src/model/UInt64';

describe('Receipt - CreateStatementFromDTO', () => {
    let account: Account;
    let statementDto;

    before(() => {
        account = Account.createFromPrivateKey(
            'D242FB34C2C4DD36E995B9C865F93940065E326661BA5A4A247331D211FE3A3D',
            NetworkType.PRIVATE_TEST,
        );
        statementDto = {
            transactionStatements: [
                {
                    id: '1',
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
                                targetAddress: account.address.encoded(),
                                mosaicId: '85BBEA6CC462B244',
                                amount: '1000',
                            },
                        ],
                    },
                },
                {
                    id: '1',
                    statement: {
                        height: '52',
                        source: {
                            primaryId: 0,
                            secondaryId: 0,
                        },
                        receipts: [
                            {
                                version: 1,
                                type: 4685,
                                senderAddress: account.address.encoded(),
                                recipientAddress: account.address.encoded(),
                                mosaicId: '85BBEA6CC462B244',
                                amount: '1000',
                            },
                        ],
                    },
                },
                {
                    id: '1',
                    statement: {
                        height: '52',
                        source: {
                            primaryId: 0,
                            secondaryId: 0,
                        },
                        receipts: [
                            {
                                version: 1,
                                type: 16717,
                                artifactId: '85BBEA6CC462B244',
                            },
                        ],
                    },
                },
                {
                    id: '1',
                    statement: {
                        height: '52',
                        source: {
                            primaryId: 0,
                            secondaryId: 0,
                        },
                        receipts: [
                            {
                                version: 1,
                                type: 16718,
                                artifactId: '85BBEA6CC462B244',
                            },
                        ],
                    },
                },
                {
                    id: '1',
                    statement: {
                        height: '52',
                        source: {
                            primaryId: 0,
                            secondaryId: 0,
                        },
                        receipts: [
                            {
                                version: 1,
                                type: 16974,
                                artifactId: '85BBEA6CC462B244',
                            },
                        ],
                    },
                },
                {
                    id: '1',
                    statement: {
                        height: '52',
                        source: {
                            primaryId: 0,
                            secondaryId: 0,
                        },
                        receipts: [
                            {
                                version: 1,
                                type: 20803,
                                mosaicId: '85BBEA6CC462B244',
                                amount: '1000',
                            },
                        ],
                    },
                },
            ],
            addressResolutionStatements: [
                {
                    id: '1',
                    statement: {
                        height: '1488',
                        unresolved: '9103B60AAF27626883000000000000000000000000000000',
                        resolutionEntries: [
                            {
                                source: {
                                    primaryId: 4,
                                    secondaryId: 0,
                                },
                                resolved: '7826D27E1D0A26CA4E316F901E23E55C8711DB20DF5C49B5',
                            },
                        ],
                    },
                },
                {
                    id: '1',
                    statement: {
                        height: '1488',
                        unresolved: '917E7E29A01014C2F3000000000000000000000000000000',
                        resolutionEntries: [
                            {
                                source: {
                                    primaryId: 2,
                                    secondaryId: 0,
                                },
                                resolved: 'PATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA35OETNI',
                            },
                        ],
                    },
                },
            ],
            mosaicResolutionStatements: [
                {
                    id: '1',
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
                    id: '1',
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
            ],
        };
    });
    it('should create Statement', () => {
        const statement = new Statement(
            statementDto.transactionStatements.map(createTransactionStatement),
            statementDto.addressResolutionStatements.map(createAddressResolutionStatement),
            statementDto.mosaicResolutionStatements.map(createMosaicResolutionStatement),
        );

        const unresolvedAddress = statement.addressResolutionStatements[0].unresolved as NamespaceId;
        const unresolvedMosaicId = statement.mosaicResolutionStatements[0].unresolved as NamespaceId;

        expect(statement.transactionStatements.length).to.be.equal(6);
        expect(statement.addressResolutionStatements.length).to.be.equal(2);
        expect(statement.mosaicResolutionStatements.length).to.be.equal(2);

        expect(statement.transactionStatements[0].receipts.length).to.be.equal(1);
        deepEqual(statement.transactionStatements[0].height, UInt64.fromNumericString('52'));
        expect(statement.transactionStatements[0].source.primaryId).to.be.equal(0);
        expect(statement.transactionStatements[0].source.secondaryId).to.be.equal(0);
        expect(statement.transactionStatements[0].receipts[0].type).to.be.equal(ReceiptType.Harvest_Fee);

        expect(statement.transactionStatements[1].receipts.length).to.be.equal(1);
        deepEqual(statement.transactionStatements[1].height, UInt64.fromNumericString('52'));
        expect(statement.transactionStatements[1].source.primaryId).to.be.equal(0);
        expect(statement.transactionStatements[1].source.secondaryId).to.be.equal(0);
        expect(statement.transactionStatements[1].receipts[0].type).to.be.equal(ReceiptType.Mosaic_Rental_Fee);

        expect(statement.transactionStatements[2].receipts.length).to.be.equal(1);
        deepEqual(statement.transactionStatements[2].height, UInt64.fromNumericString('52'));
        expect(statement.transactionStatements[2].source.primaryId).to.be.equal(0);
        expect(statement.transactionStatements[2].source.secondaryId).to.be.equal(0);
        expect(statement.transactionStatements[2].receipts[0].type).to.be.equal(ReceiptType.Mosaic_Expired);

        expect(statement.transactionStatements[3].receipts.length).to.be.equal(1);
        deepEqual(statement.transactionStatements[3].height, UInt64.fromNumericString('52'));
        expect(statement.transactionStatements[3].source.primaryId).to.be.equal(0);
        expect(statement.transactionStatements[3].source.secondaryId).to.be.equal(0);
        expect(statement.transactionStatements[3].receipts[0].type).to.be.equal(ReceiptType.Namespace_Expired);

        expect(statement.transactionStatements[4].receipts.length).to.be.equal(1);
        deepEqual(statement.transactionStatements[4].height, UInt64.fromNumericString('52'));
        expect(statement.transactionStatements[4].source.primaryId).to.be.equal(0);
        expect(statement.transactionStatements[4].source.secondaryId).to.be.equal(0);
        expect(statement.transactionStatements[4].receipts[0].type).to.be.equal(ReceiptType.Namespace_Deleted);

        expect(statement.transactionStatements[5].receipts.length).to.be.equal(1);
        deepEqual(statement.transactionStatements[5].height, UInt64.fromNumericString('52'));
        expect(statement.transactionStatements[5].source.primaryId).to.be.equal(0);
        expect(statement.transactionStatements[5].source.secondaryId).to.be.equal(0);
        expect(statement.transactionStatements[5].receipts[0].type).to.be.equal(ReceiptType.Inflation);

        deepEqual(statement.addressResolutionStatements[0].height, UInt64.fromNumericString('1488'));
        deepEqual(unresolvedAddress.toHex(), '83686227AF0AB603');
        expect(statement.addressResolutionStatements[0].resolutionEntries.length).to.be.equal(1);
        expect((statement.addressResolutionStatements[0].resolutionEntries[0].resolved as Address).plain()).to.be.equal(
            'PATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA35OETNI',
        );

        deepEqual(statement.mosaicResolutionStatements[0].height, UInt64.fromNumericString('1506'));
        deepEqual(unresolvedMosaicId.toHex(), '85BBEA6CC462B244');
        expect(statement.mosaicResolutionStatements[0].resolutionEntries.length).to.be.equal(1);
        deepEqual((statement.mosaicResolutionStatements[0].resolutionEntries[0].resolved as MosaicId).toHex(), '941299B2B7E1291C');
    });

    it('extractUnresolvedAddress', () => {
        const dto = {
            transactionStatements: [],
            addressResolutionStatements: [
                {
                    id: '1',
                    statement: {
                        height: '1488',
                        unresolved: account.address.encoded(),
                        resolutionEntries: [
                            {
                                source: {
                                    primaryId: 4,
                                    secondaryId: 0,
                                },
                                resolved: account.address.encoded(),
                            },
                        ],
                    },
                },
            ],
            mosaicResolutionStatements: [],
        };
        const statement = createAddressResolutionStatement(dto.addressResolutionStatements[0]);
        expect((statement.unresolved as Address).plain()).to.be.equal(account.address.plain());

        const dtoJson: ResolutionStatementInfoDTO = {
            id: '1',
            statement: {
                height: '1488',
                unresolved: account.address.encoded(),
                resolutionEntries: [
                    {
                        source: {
                            primaryId: 4,
                            secondaryId: 0,
                        },
                        resolved: account.address.encoded(),
                    },
                ],
            },
        };

        const statementJson = createAddressResolutionStatement(dtoJson);
        expect((statementJson.unresolved as Address).plain()).to.be.equal(account.address.plain());

        const dtoId = {
            id: '1',
            statement: {
                height: '1488',
                unresolved: '9103B60AAF27626883000000000000000000000000000000',
                resolutionEntries: [
                    {
                        source: {
                            primaryId: 4,
                            secondaryId: 0,
                        },
                        resolved: '903CC58E8C242DCFC33DE4E2F8B434C77F93A48BA13BC3E3',
                    },
                ],
            },
        };

        const statementId = createAddressResolutionStatement(dtoId);
        expect((statementId.unresolved as NamespaceId).toHex()).to.be.equal('83686227AF0AB603');
        expect(statementId.resolutionEntries[0].resolved.encoded()).to.be.equal('903CC58E8C242DCFC33DE4E2F8B434C77F93A48BA13BC3E3');

        const dtoError: ResolutionStatementInfoDTO = {
            id: 'abc',
            statement: {
                height: '1488',
                unresolved: '',
                resolutionEntries: [
                    {
                        source: {
                            primaryId: 4,
                            secondaryId: 0,
                        },
                        resolved: '917E7E29A01014C2F3000000000000000000000000000000',
                    },
                ],
            },
        };

        expect(() => {
            createAddressResolutionStatement(dtoError);
        }).to.throw();
    });

    it('Statement - Error', () => {
        const dtoError: TransactionStatementInfoDTO = {
            id: 'ABC',
            statement: {
                height: '52',
                source: {
                    primaryId: 0,
                    secondaryId: 0,
                },
                receipts: [
                    {
                        version: 1,
                        type: 99999,
                        artifactId: '85BBEA6CC462B244',
                    },
                ],
            },
        };

        expect(() => {
            createTransactionStatement(dtoError);
        }).to.throw();
    });
});
