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

import { firstValueFrom } from 'rxjs';
import { AccountRepository, MosaicRepository } from '../../src/infrastructure';
import { Address } from '../../src/model/account';
import { MosaicService } from '../../src/service';
import { IntegrationTestHelper } from '../infrastructure/IntegrationTestHelper';

describe('MosaicService', () => {
    let accountAddress: Address;
    let accountRepository: AccountRepository;
    let mosaicRepository: MosaicRepository;
    const helper = new IntegrationTestHelper();

    before(() => {
        return helper.start({ openListener: false }).then(() => {
            accountAddress = helper.account.address;
            accountRepository = helper.repositoryFactory.createAccountRepository();
            mosaicRepository = helper.repositoryFactory.createMosaicRepository();
        });
    });

    after(() => {
        return helper.close();
    });

    it('should return the mosaic list skipping the expired mosaics', () => {
        const mosaicService = new MosaicService(accountRepository, mosaicRepository);
        return firstValueFrom(mosaicService.mosaicsAmountViewFromAddress(accountAddress)).then((amountViews) => {
            return amountViews.map((v) => {
                return { mosaicId: v.fullName(), amount: v.relativeAmount() };
            });
        });
    });
});
