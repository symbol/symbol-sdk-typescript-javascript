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

import { AccountHttp } from '../../src/infrastructure/AccountHttp';
import { MosaicHttp } from '../../src/infrastructure/MosaicHttp';
import { Address } from '../../src/model/account/Address';
import { MosaicService } from '../../src/service/MosaicService';

describe('MosaicService', () => {
    let accountAddress: Address;
    let accountHttp: AccountHttp;
    let mosaicHttp: MosaicHttp;

    before((done) => {
        const path = require('path');
        require('fs').readFile(path.resolve(__dirname, '../conf/network.conf'), (err, data) => {
            if (err) {
                throw err;
            }
            const json = JSON.parse(data);
            accountAddress = Address.createFromRawAddress(json.testAccount.address);
            accountHttp = new AccountHttp(json.apiUrl);
            mosaicHttp = new MosaicHttp(json.apiUrl);
            done();
        });
    });
    it('should return the mosaic list skipping the expired mosaics', (done) => {
        const mosaicService = new MosaicService(accountHttp, mosaicHttp);

        const address = accountAddress;

        return mosaicService.mosaicsAmountViewFromAddress(address).subscribe((amountViews) => {
            const views = amountViews.map((v) => {
                return {mosaicId: v.fullName(), amount: v.relativeAmount()};
            });
            console.log(views);
            done();
        });
    });
});
