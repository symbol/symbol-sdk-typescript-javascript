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
import { firstValueFrom } from 'rxjs';
import { NodeRepository } from '../../src/infrastructure/NodeRepository';
import { IntegrationTestHelper } from './IntegrationTestHelper';

describe('NodeHttp', () => {
    let nodeRepository: NodeRepository;
    const helper = new IntegrationTestHelper();

    before(() => {
        return helper.start({ openListener: false }).then(() => {
            nodeRepository = helper.repositoryFactory.createNodeRepository();
        });
    });

    after(() => {
        return helper.close();
    });

    describe('getNodeInfo', () => {
        it('should return node info FER', async () => {
            const nodeInfo = await firstValueFrom(nodeRepository.getNodeInfo());
            expect(nodeInfo.friendlyName).not.to.be.undefined;
            expect(nodeInfo.host).not.to.be.undefined;
            expect(nodeInfo.networkIdentifier).not.to.be.undefined;
            expect(nodeInfo.port).not.to.be.undefined;
            expect(nodeInfo.publicKey).not.to.be.undefined;
            expect(nodeInfo.roles).not.to.be.undefined;
            expect(nodeInfo.version).not.to.be.undefined;
            expect(nodeInfo.nodePublicKey).not.to.be.undefined;
        });
    });

    describe('getNodePeers', () => {
        it('should return node peers', async () => {
            const nodeInfo = await firstValueFrom(nodeRepository.getNodePeers());
            expect(nodeInfo[0].friendlyName).not.to.be.undefined;
            expect(nodeInfo[0].host).not.to.be.undefined;
            expect(nodeInfo[0].networkIdentifier).not.to.be.undefined;
            expect(nodeInfo[0].port).not.to.be.undefined;
            expect(nodeInfo[0].publicKey).not.to.be.undefined;
            expect(nodeInfo[0].roles).not.to.be.undefined;
            expect(nodeInfo[0].version).not.to.be.undefined;
        });
    });

    describe('getNodeTime', () => {
        it('should return node time', async () => {
            const nodeTime = await firstValueFrom(nodeRepository.getNodeTime());
            expect(nodeTime.receiveTimeStamp).not.to.be.undefined;
            expect(nodeTime.sendTimeStamp).not.to.be.undefined;
        });
    });

    describe('getStorageInfo', () => {
        it('should return storage info', async () => {
            const blockchainStorageInfo = await firstValueFrom(nodeRepository.getStorageInfo());
            expect(blockchainStorageInfo.numBlocks).to.be.greaterThan(0);
            expect(blockchainStorageInfo.numTransactions).to.be.greaterThan(0);
            expect(blockchainStorageInfo.numAccounts).to.be.greaterThan(0);
        });
    });

    describe('getServerInfo', () => {
        it('should return server info', async () => {
            const serverInfo = await firstValueFrom(nodeRepository.getServerInfo());
            expect(serverInfo.restVersion).not.to.be.null;
            expect(serverInfo.sdkVersion).not.to.be.null;
        });
    });

    describe('getNodeHealth', () => {
        it('should return node health', async () => {
            const health = await firstValueFrom(nodeRepository.getNodeHealth());
            expect(health.apiNode).not.to.be.null;
            expect(health.db).not.to.be.null;
        });
    });

    describe('getUnlockedAccount', () => {
        it('should return unlocked account', async () => {
            const unlockedAccount = await firstValueFrom(nodeRepository.getUnlockedAccount());
            expect(unlockedAccount).not.to.be.null;
            expect(unlockedAccount.length).greaterThan(0);
        });
    });
});
