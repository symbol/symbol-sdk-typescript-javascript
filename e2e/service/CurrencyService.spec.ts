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
import { toPromise } from '../../src/infrastructure/rxUtils';
import { Currency, MosaicFlags, MosaicId, MosaicNonce } from '../../src/model/mosaic';
import { Deadline } from '../../src/model/transaction/Deadline';
import { MosaicDefinitionTransaction } from '../../src/model/transaction/MosaicDefinitionTransaction';
import { UInt64 } from '../../src/model/UInt64';
import { CurrencyService } from '../../src/service/CurrencyService';
import { NetworkCurrencyLocal, NetworkHarvestLocal } from '../../test/model/mosaic/Currency.spec';
import { IntegrationTestHelper } from '../infrastructure/IntegrationTestHelper';

describe('CurrencyService', () => {
    const helper = new IntegrationTestHelper();

    before(() => {
        return helper.start({ openListener: true });
    });

    after(() => {
        return helper.close();
    });

    describe('Load network currencies', () => {
        it('Load symbol network currencies', async () => {
            const networkCurrencyService = new CurrencyService(helper.repositoryFactory);
            const currencies = await toPromise(networkCurrencyService.getNetworkCurrencies());
            expect(currencies.currency.unresolvedMosaicId).to.be.deep.eq(currencies.currency.mosaicId);
            expect(currencies.currency.namespaceId).to.be.deep.eq(NetworkCurrencyLocal.namespaceId);
            expect(currencies.currency.unresolvedMosaicId).to.be.deep.eq(NetworkCurrencyLocal.unresolvedMosaicId);

            expect(currencies.harvest.unresolvedMosaicId).to.be.deep.eq(currencies.harvest.mosaicId);
            expect(currencies.harvest.namespaceId).to.be.deep.eq(NetworkHarvestLocal.namespaceId);
            expect(currencies.harvest.unresolvedMosaicId).to.be.deep.eq(NetworkHarvestLocal.unresolvedMosaicId);
        });

        it('Create a mosaic and load as network currency.', async () => {
            const networkCurrencyService = new CurrencyService(helper.repositoryFactory);
            const account = helper.account;
            const nonce = MosaicNonce.createRandom();
            const mosaicId = MosaicId.createFromNonce(nonce, account.address);
            const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
                Deadline.create(helper.epochAdjustment),
                nonce,
                mosaicId,
                MosaicFlags.create(true, false, true),
                4,
                UInt64.fromUint(100),
                helper.networkType,
                helper.maxFee,
            );
            await helper.announce(mosaicDefinitionTransaction.signWith(account, helper.generationHash));

            await IntegrationTestHelper.sleep(100);
            const currencies = await toPromise(networkCurrencyService.getCurrencies([mosaicId]));
            expect(currencies.length).eq(1);
            expect(currencies[0]).to.deep.eq({
                unresolvedMosaicId: mosaicId,
                namespaceId: undefined,
                mosaicId: mosaicId,
                divisibility: 4,
                transferable: false,
                supplyMutable: true,
                restrictable: true,
            } as Currency);
        });
    });
});
