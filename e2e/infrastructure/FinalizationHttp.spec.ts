/*
 * Copyright 2018 NEM
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
import { FinalizationRepository } from '../../src/infrastructure/FinalizationRepository';
import { toPromise } from '../../src/infrastructure/rxUtils';
import { UInt64 } from '../../src/model/UInt64';
import { IntegrationTestHelper } from './IntegrationTestHelper';

describe('FinalizationHttp', () => {
    let finalizationRepository: FinalizationRepository;
    const helper = new IntegrationTestHelper();

    before(() => {
        return helper.start({ openListener: false }).then(() => {
            finalizationRepository = helper.repositoryFactory.createFinalizationRepository();
        });
    });

    after(() => {
        return helper.close();
    });

    describe('getFinalizationProofAtEpoch', () => {
        it('should return finalization proof at epoch', async () => {
            const dto = await toPromise(finalizationRepository.getFinalizationProofAtEpoch(1));
            expect(dto).not.to.be.null;
            expect(dto.height).to.deep.eq(UInt64.fromUint(1));
            expect(dto.version).to.eq(1);
            expect(dto.finalizationEpoch).to.eq(1);
            expect(dto.finalizationPoint).to.eq(1);
            expect(dto.hash).not.to.be.null;
        });
    });

    describe('getNetworkName', () => {
        it('should return finalization proof at height', async () => {
            const dto = await toPromise(finalizationRepository.getFinalizationProofAtHeight(UInt64.fromUint(1)));
            expect(dto).not.to.be.null;
            expect(dto.height).to.deep.eq(UInt64.fromUint(1));
            expect(dto.version).to.eq(1);
            expect(dto.finalizationEpoch).to.eq(1);
            expect(dto.finalizationPoint).to.eq(1);
            expect(dto.hash).not.to.be.null;
        });
    });
});
