/*
 * Copyright 2019 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { expect } from 'chai';
import { UnresolvedMapping } from '../../../src/core/utils/UnresolvedMapping';
import { CreateStatementFromDTO } from '../../../src/infrastructure/receipt/CreateReceiptFromDTO';
import { Account } from '../../../src/model/account/Account';
import { Address, MosaicId, NamespaceId, ResolutionType } from '../../../src/model/model';
import { NetworkType } from '../../../src/model/network/NetworkType';

describe('Statement', () => {
    let account: Account;
    let transactionStatementsDTO;
    let addressResolutionStatementsDTO;
    let mosaicResolutionStatementsDTO;
    let statementDTO;

    before(() => {
        account = Account.createFromPrivateKey('81C18245507F9C15B61BDEDAFA2C10D9DC2C4E401E573A10935D45AA2A461FD5', NetworkType.MIJIN_TEST);
        transactionStatementsDTO = [
            {
                statement: {
                    height: '1473',
                    source: {
                        primaryId: 0,
                        secondaryId: 0,
                    },
                    receipts: [
                        {
                            version: 1,
                            type: 8515,
                            targetPublicKey: 'B2708D49C46F8AB5CDBD7A09C959EEA12E4A782592F3D1D3D17D54622E655D7F',
                            mosaicId: '504677C3281108DB',
                            amount: '0',
                        },
                    ],
                },
            },
        ];
        addressResolutionStatementsDTO = [
            {
                statement: {
                    height: '1473',
                    unresolved: '9156258DE356F030A500000000000000000000000000000000',
                    resolutionEntries: [
                        {
                            source: {
                                primaryId: 1,
                                secondaryId: 0,
                            },
                            resolved: '90AB9480887275E559F3BCA87E6158AA7AFF339BE85E77A0F3',
                        },
                    ],
                },
            },
        ];
        mosaicResolutionStatementsDTO = [
            {
                statement: {
                    height: '1473',
                    unresolved: '85BBEA6CC462B244',
                    resolutionEntries: [
                        {
                            source: {
                                primaryId: 1,
                                secondaryId: 0,
                            },
                            resolved: '504677C3281108DB',
                        },
                    ],
                },
            },
            {
                statement: {
                    height: '1473',
                    unresolved: 'E81F622A5B11A340',
                    resolutionEntries: [
                        {
                            source: {
                                primaryId: 1,
                                secondaryId: 0,
                            },
                            resolved: '756482FB80FD406C',
                        },
                    ],
                },
            },
        ];

        statementDTO = {
            transactionStatements: transactionStatementsDTO,
            addressResolutionStatements: addressResolutionStatementsDTO,
            mosaicResolutionStatements: mosaicResolutionStatementsDTO,
        };
    });

    it('should get resolved address from receipt', () => {
        const unresolvedAddress = UnresolvedMapping.toUnresolvedAddress('9156258DE356F030A500000000000000000000000000000000');
        const statement = CreateStatementFromDTO(statementDTO, NetworkType.MIJIN_TEST);
        const resolved = statement.resolveAddress(unresolvedAddress as NamespaceId, '1473', 0);

        expect(resolved instanceof Address).to.be.true;
        expect((resolved as Address).equals(account.address)).to.be.true;
    });

    it('should get resolved address from receipt without Harvesting_Fee', () => {
        const statementWithoutHarvesting = {
            transactionStatements: [],
            addressResolutionStatements: [
                {
                    statement: {
                        height: '1473',
                        unresolved: '9156258DE356F030A500000000000000000000000000000000',
                        resolutionEntries: [
                            {
                                source: {
                                    primaryId: 1,
                                    secondaryId: 0,
                                },
                                resolved: '90AB9480887275E559F3BCA87E6158AA7AFF339BE85E77A0F3',
                            },
                        ],
                    },
                },
            ],
            mosaicResolutionStatements: [],
        };
        const unresolvedAddress = UnresolvedMapping.toUnresolvedAddress('9156258DE356F030A500000000000000000000000000000000');
        const statement = CreateStatementFromDTO(statementWithoutHarvesting, NetworkType.MIJIN_TEST);
        const resolved = statement.resolveAddress(unresolvedAddress as NamespaceId, '1473', 0);

        expect(resolved instanceof Address).to.be.true;
        expect((resolved as Address).equals(account.address)).to.be.true;
    });

    it('should get resolved mosaic from receipt', () => {
        const unresolvedMosaic = UnresolvedMapping.toUnresolvedMosaic('E81F622A5B11A340');
        const statement = CreateStatementFromDTO(statementDTO, NetworkType.MIJIN_TEST);
        const resolved = statement.resolveMosaicId(unresolvedMosaic as NamespaceId, '1473', 0);

        expect(resolved instanceof MosaicId).to.be.true;
        expect((resolved as MosaicId).equals(new MosaicId('756482FB80FD406C'))).to.be.true;
    });

    it('should get resolved mosaic from receipt without Harvesting_Fee', () => {
        const statementWithoutHarvesting = {
            transactionStatements: [],
            addressResolutionStatements: [],
            mosaicResolutionStatements: [
                {
                    statement: {
                        height: '1473',
                        unresolved: '85BBEA6CC462B244',
                        resolutionEntries: [
                            {
                                source: {
                                    primaryId: 1,
                                    secondaryId: 0,
                                },
                                resolved: '504677C3281108DB',
                            },
                        ],
                    },
                },
                {
                    statement: {
                        height: '1473',
                        unresolved: 'E81F622A5B11A340',
                        resolutionEntries: [
                            {
                                source: {
                                    primaryId: 1,
                                    secondaryId: 0,
                                },
                                resolved: '756482FB80FD406C',
                            },
                        ],
                    },
                },
            ],
        };
        const unresolvedMosaic = UnresolvedMapping.toUnresolvedMosaic('E81F622A5B11A340');
        const statement = CreateStatementFromDTO(statementWithoutHarvesting, NetworkType.MIJIN_TEST);
        const resolved = statement.resolveMosaicId(unresolvedMosaic as NamespaceId, '1473', 0);

        expect(resolved instanceof MosaicId).to.be.true;
        expect((resolved as MosaicId).equals(new MosaicId('756482FB80FD406C'))).to.be.true;
    });
});
