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
import { ImportanceBlockFooter } from '../../../src/model/blockchain/ImportanceBlockFooter';
import { UInt64 } from '../../../src/model/UInt64';

describe('BlockFooter', () => {
    it('should createComplete an blockFooter object', () => {
        const importanceBlockInfoDto = {
            votingEligibleAccountsCount: 1,
            harvestingEligibleAccountsCount: '1',
            totalVotingBalance: '1',
            previousImportanceBlockHash: 'hash',
        };
        const info = new ImportanceBlockFooter(
            importanceBlockInfoDto.votingEligibleAccountsCount,
            UInt64.fromNumericString(importanceBlockInfoDto.harvestingEligibleAccountsCount),
            UInt64.fromNumericString(importanceBlockInfoDto.totalVotingBalance),
            importanceBlockInfoDto.previousImportanceBlockHash,
        );

        expect(info).to.be.not.null;
        expect(info.votingEligibleAccountsCount).to.be.equals(1);
        expect(info.harvestingEligibleAccountsCount.toString()).to.be.equals('1');
        expect(info.totalVotingBalance.toString()).to.be.equals('1');
        expect(info.previousImportanceBlockHash).to.be.equals('hash');
    });
});
