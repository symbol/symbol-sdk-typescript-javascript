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
import { NodeRepository } from '../../src/infrastructure/NodeRepository';
import { IntegrationTestHelper } from "./IntegrationTestHelper";

describe('NodeHttp', () => {
    let nodeRepository: NodeRepository;
    let helper = new IntegrationTestHelper();

    before(() => {
        return helper.start().then(() => {
            nodeRepository = helper.repositoryFactory.createNodeRepository();
        });
    });

    describe('getNodeInfo', () => {
        it('should return node info', (done) => {
            nodeRepository.getNodeInfo()
            .subscribe((nodeInfo) => {
                expect(nodeInfo.friendlyName).not.to.be.undefined;
                expect(nodeInfo.host).not.to.be.undefined;
                expect(nodeInfo.networkIdentifier).not.to.be.undefined;
                expect(nodeInfo.port).not.to.be.undefined;
                expect(nodeInfo.publicKey).not.to.be.undefined;
                expect(nodeInfo.roles).not.to.be.undefined;
                expect(nodeInfo.version).not.to.be.undefined;
                done();
            });
        });
    });

    describe('getNodeTime', () => {
        it('should return node time', (done) => {
            nodeRepository.getNodeTime()
            .subscribe((nodeTime) => {
                expect(nodeTime.receiveTimeStamp).not.to.be.undefined;
                expect(nodeTime.sendTimeStamp).not.to.be.undefined;
                done();
            });
        });
    });
});
