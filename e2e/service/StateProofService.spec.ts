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

import { expect } from "chai";
import { MosaicId } from '../../src/model/mosaic';
import { StateProofService } from '../../src/service';
import { IntegrationTestHelper } from '../infrastructure/IntegrationTestHelper';

describe('StateProofService', () => {
    const helper = new IntegrationTestHelper();

    before(() => {
        return helper.start({ openListener: false });
    });

    after(() => {
        return helper.close();
    });

    describe('Merkles', () => {
        it('Mosaics', async () => {
            const service = new StateProofService(helper.repositoryFactory);
            const page = await helper.repositoryFactory.createMosaicRepository().search({}).toPromise();

            const promises = page.data.map(async (m) => {
                const merkle = await service.mosaicProof(m.id).toPromise();
                expect(merkle).to.not.undefined;
                console.log(JSON.stringify(merkle, null, 2));
            });
            await Promise.all(promises);
        });
    });
});
