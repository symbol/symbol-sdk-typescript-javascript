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
import { ResolutionStatementInfoDTO } from 'symbol-openapi-typescript-fetch-client';
import {
    createAddressResolutionStatement,
    createMosaicResolutionStatement,
} from '../../../src/infrastructure/receipt/CreateReceiptFromDTO';
import { Account } from '../../../src/model/account/Account';
import { Address } from '../../../src/model/account/Address';
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import { ResolutionStatement } from '../../../src/model/receipt/ResolutionStatement';

describe('ResolutionStatement', () => {
    let account: Account;
    let addressResolutionStatements: ResolutionStatementInfoDTO[];
    let mosaicResolutionStatements: ResolutionStatementInfoDTO[];

    before(() => {
        addressResolutionStatements = [
            {
                id: '1',
                statement: {
                    height: '1473',
                    unresolved: '9156258DE356F030A5000000000000000000000000000000',
                    resolutionEntries: [
                        {
                            source: {
                                primaryId: 1,
                                secondaryId: 0,
                            },
                            resolved: '903CC58E8C242DCFC33DE4E2F8B434C77F93A48BA13BC3E3',
                        },
                    ],
                },
            },
        ];
        mosaicResolutionStatements = [
            {
                id: '2',
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
                        {
                            source: {
                                primaryId: 3,
                                secondaryId: 5,
                            },
                            resolved: '401F622A3111A3E4',
                        },
                    ],
                },
            },
            {
                id: '3',
                statement: {
                    height: '1473',
                    unresolved: 'E81F622A5B11A340',
                    resolutionEntries: [
                        {
                            source: {
                                primaryId: 3,
                                secondaryId: 1,
                            },
                            resolved: '756482FB80FD406C',
                        },
                    ],
                },
            },
            {
                id: '4',
                statement: {
                    height: '1500',
                    unresolved: '85BBEA6CC462B244',
                    resolutionEntries: [
                        {
                            source: {
                                primaryId: 1,
                                secondaryId: 1,
                            },
                            resolved: '0DC67FBE1CAD29E5',
                        },
                        {
                            source: {
                                primaryId: 1,
                                secondaryId: 4,
                            },
                            resolved: '7CDF3B117A3C40CC',
                        },
                        {
                            source: {
                                primaryId: 1,
                                secondaryId: 7,
                            },
                            resolved: '0DC67FBE1CAD29E5',
                        },
                        {
                            source: {
                                primaryId: 2,
                                secondaryId: 4,
                            },
                            resolved: '7CDF3B117A3C40CC',
                        },
                    ],
                },
            },
        ];
    });

    it('should get resolve entry when both primaryId and secondaryId matched', () => {
        const resolution = createAddressResolutionStatement(addressResolutionStatements[0]);

        const entry = resolution.getResolutionEntryById(1, 0);

        expect(entry!.resolved instanceof Address).to.be.true;
        expect((entry!.resolved as Address).equals(account.address)).to.be.true;
    });

    it('should get resolved entry when primaryId is greater than max', () => {
        const resolution = createMosaicResolutionStatement(mosaicResolutionStatements[0]);
        const entry = resolution.getResolutionEntryById(4, 0);
        expect(entry!.source.primaryId).to.be.equal(3);
        expect(entry!.source.secondaryId).to.be.equal(5);
        expect(entry!.resolved instanceof MosaicId).to.be.true;
        expect((entry!.resolved as MosaicId).equals(new MosaicId('401F622A3111A3E4'))).to.be.true;
    });

    it('should get resolved entry when primaryId is in middle of 2 pirmaryIds', () => {
        const resolution = createMosaicResolutionStatement(mosaicResolutionStatements[0]);
        const entry = resolution.getResolutionEntryById(2, 1);
        expect(entry!.source.primaryId).to.be.equal(1);
        expect(entry!.source.secondaryId).to.be.equal(0);
        expect(entry!.resolved instanceof MosaicId).to.be.true;
        expect((entry!.resolved as MosaicId).equals(new MosaicId('504677C3281108DB'))).to.be.true;
    });

    it('should get resolved entry when primaryId matches but not secondaryId', () => {
        const resolution = createMosaicResolutionStatement(mosaicResolutionStatements[0]);
        const entry = resolution.getResolutionEntryById(3, 6);
        expect(entry!.source.primaryId).to.be.equal(3);
        expect(entry!.source.secondaryId).to.be.equal(5);
        expect(entry!.resolved instanceof MosaicId).to.be.true;
        expect((entry!.resolved as MosaicId).equals(new MosaicId('401F622A3111A3E4'))).to.be.true;
    });

    it('should get resolved entry when primaryId matches but secondaryId less than minimum', () => {
        const resolution = createMosaicResolutionStatement(mosaicResolutionStatements[0]);
        const entry = resolution.getResolutionEntryById(3, 1);
        expect(entry!.source.primaryId).to.be.equal(1);
        expect(entry!.source.secondaryId).to.be.equal(0);
        expect(entry!.resolved instanceof MosaicId).to.be.true;
        expect((entry!.resolved as MosaicId).equals(new MosaicId('504677C3281108DB'))).to.be.true;
    });

    it('should return undefined', () => {
        const statement = createMosaicResolutionStatement(addressResolutionStatements[0]);
        const entry = statement.getResolutionEntryById(0, 0);
        expect(entry).to.be.undefined;
    });

    it('resolution change in the block (more than one AGGREGATE)', () => {
        const resolution = createMosaicResolutionStatement(mosaicResolutionStatements[2]);
        expect((resolution.getResolutionEntryById(1, 1)!.resolved as MosaicId).toHex()).to.be.equal('0DC67FBE1CAD29E5');
        expect((resolution.getResolutionEntryById(1, 4)!.resolved as MosaicId).toHex()).to.be.equal('7CDF3B117A3C40CC');
        expect((resolution.getResolutionEntryById(1, 7)!.resolved as MosaicId).toHex()).to.be.equal('0DC67FBE1CAD29E5');
        expect((resolution.getResolutionEntryById(2, 1)!.resolved as MosaicId).toHex()).to.be.equal('0DC67FBE1CAD29E5');
        expect((resolution.getResolutionEntryById(2, 4)!.resolved as MosaicId).toHex()).to.be.equal('7CDF3B117A3C40CC');

        expect((resolution.getResolutionEntryById(3, 0)!.resolved as MosaicId).toHex()).to.be.equal('7CDF3B117A3C40CC');
        expect((resolution.getResolutionEntryById(2, 2)!.resolved as MosaicId).toHex()).to.be.equal('0DC67FBE1CAD29E5');
        expect(resolution.getResolutionEntryById(1, 0)).to.be.undefined;
        expect((resolution.getResolutionEntryById(1, 6)!.resolved as MosaicId).toHex()).to.be.equal('7CDF3B117A3C40CC');
        expect((resolution.getResolutionEntryById(1, 2)!.resolved as MosaicId).toHex()).to.be.equal('0DC67FBE1CAD29E5');
    });
});
