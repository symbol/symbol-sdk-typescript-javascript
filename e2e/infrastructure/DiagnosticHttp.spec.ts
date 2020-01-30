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
import { DiagnosticRepository } from '../../src/infrastructure/DiagnosticRepository';
import { IntegrationTestHelper } from './IntegrationTestHelper';

describe('DiagnosticHttp', () => {
    const helper = new IntegrationTestHelper();
    let diagnosticRepository: DiagnosticRepository;

    before(() => {
        return helper.start().then(() => {
            diagnosticRepository = helper.repositoryFactory.createDiagnosticRepository();
        });
    });

    describe('getDiagnosticStorage', () => {
        it('should return diagnostic storage', async () => {
            const blockchainStorageInfo = await diagnosticRepository.getDiagnosticStorage().toPromise();
            expect(blockchainStorageInfo.numBlocks).to.be.greaterThan(0);
            expect(blockchainStorageInfo.numTransactions).to.be.greaterThan(0);
            expect(blockchainStorageInfo.numAccounts).to.be.greaterThan(0);
        });
    });

    describe('getServerInfo', () => {
        it('should return diagnostic storage', async () => {
            const serverInfo = await diagnosticRepository.getServerInfo().toPromise();
            expect(serverInfo.restVersion).not.to.be.null;
            expect(serverInfo.sdkVersion).not.to.be.null;
        });
    });
});
