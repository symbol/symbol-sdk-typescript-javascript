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

import { expect } from 'chai';
import { ChainRepository } from '../../src/infrastructure/ChainRepository';
import { IntegrationTestHelper } from './IntegrationTestHelper';

describe('ChainHttp', () => {
    const helper = new IntegrationTestHelper();
    let chainRepository: ChainRepository;

    before(() => {
        return helper.start().then(() => {
            chainRepository = helper.repositoryFactory.createChainRepository();
        });
    });

    describe('getChainInfo', () => {
        it('should return blockchain score', async () => {
            const info = await chainRepository.getChainInfo().toPromise();
            expect(info.scoreLow).to.not.be.equal(undefined);
            expect(info.scoreHigh.lower).to.be.equal(0);
            expect(info.scoreHigh.higher).to.be.equal(0);
        });
    });
});
