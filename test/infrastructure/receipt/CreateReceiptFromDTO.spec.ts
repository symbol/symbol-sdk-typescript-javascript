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
import {Account} from '../../../src/model/account/Account';
import { Address } from '../../../src/model/account/Address';
import { NetworkType } from '../../../src/model/blockchain/NetworkType';
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import { AddressAlias } from '../../../src/model/namespace/AddressAlias';
import { MosaicAlias } from '../../../src/model/namespace/MosaicAlias';
import { ReceiptType } from '../../../src/model/receipt/ReceiptType';

describe('Receipt - CreateStatementFromDTO', () => {
    let account: Account;
    let account2: Account;
    let statementDto;
    const netWorkType = NetworkType.MIJIN_TEST;

    before(() => {
        account = Account.createFromPrivateKey('D242FB34C2C4DD36E995B9C865F93940065E326661BA5A4A247331D211FE3A3D', NetworkType.MIJIN_TEST);
        account2 = Account.createFromPrivateKey('E5DCCEBDB01A8B03A7DB7BA5888E2E33FD4617B5F6FED48C4C09C0780F422713', NetworkType.MIJIN_TEST);
        statementDto = {transactionStatements:  [
            {
                height: [52, 0],
                source: {
                  primaryId: 0,
                  secondaryId: 0,
                },
                receipts: [
                    {
                        version: 1,
                        type: 8515,
                        account: account.publicKey,
                        mosaicId: [3646934825, 3576016193],
                        amount: [1000, 0],
                    },
                ],
            },
        ],
        addressResolutionStatements: [
            {
                height: [1488, 0],
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
            {
                height: [1488, 0],
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
        ],
        mosaicResolutionStatements: [
            {
                height: [
                  1506,
                  0,
                ],
                unresolved: [4014740460, 2448037180],
                resolutionEntries: [
                  {
                    source: {
                      primaryId: 1,
                      secondaryId: 0,
                    },
                    resolved: [2553890912, 2234768168],
                  },
                ],
            },
            {
                height: [
                  1506,
                  0,
                ],
                unresolved: [
                  2234768168,
                  2553890912,
                ],
                resolutionEntries: [
                  {
                    source: {
                      primaryId: 5,
                      secondaryId: 0,
                    },
                    resolved: [2553890912, 2234768168],
                  },
                ],
            },
        ]};
    });
    it('should create Statement', () => {
        const statement = CreateStatementFromDTO(statementDto, netWorkType);
        const unresolvedAddress = statement.addressResolutionStatements[0].unresolved as Address;
        const unresolvedMosaicId = statement.mosaicResolutionStatements[0].unresolved as MosaicId;

        expect(statement.transactionStatements.length).to.be.equal(1);
        expect(statement.addressResolutionStatements.length).to.be.equal(2);
        expect(statement.mosaicResolutionStatements.length).to.be.equal(2);

        expect(statement.transactionStatements[0].receipts.length).to.be.equal(1);
        deepEqual(statement.transactionStatements[0].height, [52, 0]);
        expect(statement.transactionStatements[0].source.primaryId).to.be.equal(0);
        expect(statement.transactionStatements[0].source.secondaryId).to.be.equal(0);
        expect(statement.transactionStatements[0].receipts[0].type).to.be.equal(ReceiptType.Harvest_Fee);

        deepEqual(statement.addressResolutionStatements[0].height, [1488, 0]);
        deepEqual(unresolvedAddress.plain(),
                Address.createFromEncoded('9103B60AAF2762688300000000000000000000000000000000').plain());
        expect(statement.addressResolutionStatements[0].resolutionEntries.length).to.be.equal(1);
        expect((statement.addressResolutionStatements[0].resolutionEntries[0].resolved as AddressAlias)
                .address.plain()).to.be.equal(Address.createFromEncoded('917E7E29A01014C2F300000000000000000000000000000000').plain());

        deepEqual(statement.mosaicResolutionStatements[0].height, [1506, 0]);
        deepEqual(unresolvedMosaicId.toDTO().id, [4014740460, 2448037180]);
        expect(statement.mosaicResolutionStatements[0].resolutionEntries.length).to.be.equal(1);
        deepEqual((statement.mosaicResolutionStatements[0].resolutionEntries[0].resolved as MosaicAlias)
                .mosaicId.id.toDTO(), [2553890912, 2234768168]);
    });
});
