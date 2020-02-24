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
import { TransactionFilter } from '../../src/infrastructure/TransactionFilter';
import { TransactionType } from '../../src/model/transaction/TransactionType';

describe('TransactionFilter', () => {
    it('should return correct query param', () => {
        const param = new TransactionFilter({
            types: [TransactionType.TRANSFER, TransactionType.ACCOUNT_LINK],
        });

        expect(param.convertCSV(param.types)).to.be.equal('16724,16716');
    });
});
