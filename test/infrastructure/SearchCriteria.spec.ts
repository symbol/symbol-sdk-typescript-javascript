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
import { SearchCriteria } from '../../src/infrastructure/SearchCriteria';
import { Order } from 'symbol-openapi-typescript-node-client';

describe('SearchCriteria', () => {
    it('should create SearchCriteria', () => {
        const criteria = new SearchCriteria();

        expect(criteria.getOrder().valueOf()).to.be.equal('desc');
        expect(criteria.getPageNumber()).to.be.equal(1);
        expect(criteria.getPageSize()).to.be.equal(10);

        criteria.setOrder(Order.Asc);
        criteria.setPageNumber(2);
        criteria.setPageSize(2);

        expect(criteria.getOrder().valueOf()).to.be.equal('asc');
        expect(criteria.getPageNumber()).to.be.equal(2);
        expect(criteria.getPageSize()).to.be.equal(2);
    });
});
