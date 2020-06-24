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
import { QueryParams } from '../../src/infrastructure/QueryParams';
import { Order } from '../../src/infrastructure/searchCriteria/Order';

describe('QueryParams', () => {
    it('should create QueryParams', () => {
        const queryParam = new QueryParams();
        expect(queryParam.id).to.be.undefined;
        expect(queryParam.order.toString()).to.be.equal('desc');
        expect(queryParam.pageSize).to.be.equal(10);
    });

    it('should create QueryParams with arg', () => {
        const queryParam = new QueryParams({ id: '1', order: Order.Asc, pageSize: 25 });
        expect(queryParam.id).to.be.equal('1');
        expect(queryParam.order.toString()).to.be.equal('asc');
        expect(queryParam.pageSize).to.be.equal(25);
    });

    it('should not set pageSize > 100', () => {
        expect(() => new QueryParams({ id: '1', order: Order.Asc, pageSize: 200 })).to.throw();
    });
});
