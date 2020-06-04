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
import { CreateStatementFromDTO } from '../../../src/infrastructure/receipt/CreateReceiptFromDTO';
import { Account } from '../../../src/model/account/Account';
import { Address } from '../../../src/model/account/Address';
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import { NamespaceId } from '../../../src/model/namespace/NamespaceId';
import { NetworkType } from '../../../src/model/network/NetworkType';
import { ReceiptType } from '../../../src/model/receipt/ReceiptType';
import { UInt64 } from '../../../src/model/UInt64';

describe('Receipt - CreateStatementFromDTO', () => {
    let account: Account;
    let statementDto;

    before(() => {
        account = Account.createFromPrivateKey('D242FB34C2C4DD36E995B9C865F93940065E326661BA5A4A247331D211FE3A3D', NetworkType.MIJIN_TEST);
        statementDto = {
            transactionStatements: [
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
                                targetAddress: account.address.encoded(),
                                mosaicId: '85BBEA6CC462B244',
                                amount: '1000',
                            },
                        ],
                    },
                },
            ],
            addressResolutionStatements: [
                {
                    statement: {
                        height: '1488',
                        unresolved: '9103B60AAF27626883000000000000000000000000000000',
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
                },
                {
                    statement: {
                        height: '1488',
                        unresolved: '917E7E29A01014C2F3000000000000000000000000000000',
                        resolutionEntries: [
                            {
                                source: {
                                    primaryId: 2,
                                    secondaryId: 0,
                                },
                                resolved: '9103B60AAF27626883000000000000000000000000000000',
                            },
                        ],
                    },
                },
            ],
            mosaicResolutionStatements: [
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
            ],
        };
    });
    it('should create Statement', () => {
        const statement = CreateStatementFromDTO(statementDto);
        const unresolvedAddress = statement.addressResolutionStatements[0].unresolved as NamespaceId;
        const unresolvedMosaicId = statement.mosaicResolutionStatements[0].unresolved as NamespaceId;

        expect(statement.transactionStatements.length).to.be.equal(1);
        expect(statement.addressResolutionStatements.length).to.be.equal(2);
        expect(statement.mosaicResolutionStatements.length).to.be.equal(2);

        expect(statement.transactionStatements[0].receipts.length).to.be.equal(1);
        deepEqual(statement.transactionStatements[0].height, UInt64.fromNumericString('52'));
        expect(statement.transactionStatements[0].source.primaryId).to.be.equal(0);
        expect(statement.transactionStatements[0].source.secondaryId).to.be.equal(0);
        expect(statement.transactionStatements[0].receipts[0].type).to.be.equal(ReceiptType.Harvest_Fee);

        deepEqual(statement.addressResolutionStatements[0].height, UInt64.fromNumericString('1488'));
        deepEqual(unresolvedAddress.toHex(), '83686227AF0AB603');
        expect(statement.addressResolutionStatements[0].resolutionEntries.length).to.be.equal(1);
        expect((statement.addressResolutionStatements[0].resolutionEntries[0].resolved as Address).plain()).to.be.equal(
            Address.createFromEncoded('917E7E29A01014C2F3000000000000000000000000000000').plain(),
        );

        deepEqual(statement.mosaicResolutionStatements[0].height, UInt64.fromNumericString('1506'));
        deepEqual(unresolvedMosaicId.toHex(), '85BBEA6CC462B244');
        expect(statement.mosaicResolutionStatements[0].resolutionEntries.length).to.be.equal(1);
        deepEqual((statement.mosaicResolutionStatements[0].resolutionEntries[0].resolved as MosaicId).toHex(), '941299B2B7E1291C');
    });
});
