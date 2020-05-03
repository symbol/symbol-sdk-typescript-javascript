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
import { Page } from '../../src/infrastructure/infrastructure';
import { Transaction } from '../../src/model/transaction/Transaction';
import { TransferTransaction } from '../../src/model/transaction/TransferTransaction';
import { Deadline, NetworkType } from '../../src/model/model';
import { TestingAccount } from '../conf/conf.spec';
import { PlainMessage } from '../../src/model/message/PlainMessage';

describe('Page', () => {
    it('should create Page', () => {
        const account = TestingAccount;
        const page = new Page<Transaction>(
            [TransferTransaction.create(Deadline.create(), account.address, [], PlainMessage.create(''), NetworkType.TEST_NET)],
            1,
            1,
            1,
            1,
        );
        expect(page.getData().length).to.be.equal(1);
        expect(page.getPageNumber()).to.be.equal(1);
        expect(page.getPageSize()).to.be.equal(1);
        expect(page.getTotalEntries()).to.be.equal(1);
    });
});
