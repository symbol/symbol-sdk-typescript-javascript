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

import { AccountRepository } from '../../src/infrastructure/AccountRepository';
import { MosaicRepository } from '../../src/infrastructure/MosaicRepository';
import { Address } from '../../src/model/account/Address';
import { NetworkType } from '../../src/model/blockchain/NetworkType';
import { MosaicService } from '../../src/service/MosaicService';
import { IntegrationTestHelper } from '../infrastructure/IntegrationTestHelper';

describe('MosaicService', () => {
    let accountAddress: Address;
    let accountRepository: AccountRepository;
    let mosaicRepository: MosaicRepository;
    let generationHash: string;
    const helper = new IntegrationTestHelper();
    let networkType: NetworkType;

    before(() => {
        return helper.start().then(() => {
            accountAddress = helper.account.address;
            generationHash = helper.generationHash;
            networkType = helper.networkType;
            accountRepository = helper.repositoryFactory.createAccountRepository();
            mosaicRepository = helper.repositoryFactory.createMosaicRepository();
        });
    });
    it('should return the mosaic list skipping the expired mosaics', (done) => {
        const mosaicService = new MosaicService(accountRepository, mosaicRepository);
        return mosaicService.mosaicsAmountViewFromAddress(accountAddress).subscribe((amountViews) => {
            const views = amountViews.map((v) => {
                return {mosaicId: v.fullName(), amount: v.relativeAmount()};
            });
            console.log(views);
            done();
        });
    });
});
