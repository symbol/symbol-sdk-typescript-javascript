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
import { Order, QueryParams } from '../../src/infrastructure/QueryParams';
import { TransactionType } from '../../src/model/transaction/TransactionType';

describe('QueryParams', () => {
    it('should return correct query param', () => {
        const param = new QueryParams().setId('0')
            .setOrder(Order.ASC)
            .setPageSize(10)
            .setType([TransactionType.TRANSFER, TransactionType.ACCOUNT_LINK]);

        expect(param.id).to.be.equal('0');
        expect(param.order.valueOf()).to.be.equal(Order.ASC.valueOf());
        expect(param.pageSize).to.be.equal(10);
        expect(param.convertCSV(param.type)).to.be.equal('16724,16716');
    });
});
