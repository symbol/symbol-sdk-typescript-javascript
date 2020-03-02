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
import * as http from 'http';
import {
    CommunicationTimestampsDTO,
    NodeHealthDTO,
    NodeHealthInfoDTO,
    NodeInfoDTO,
    NodeRoutesApi,
    NodeStatusEnum,
    NodeTimeDTO,
    RolesTypeEnum,
    ServerDTO,
    ServerInfoDTO,
    StorageInfoDTO
} from 'symbol-openapi-typescript-node-client';
import { instance, mock, reset, when } from 'ts-mockito';
import { DtoMapping } from '../../src/core/utils/DtoMapping';
import { NodeHttp } from '../../src/infrastructure/NodeHttp';
import { NetworkType } from '../../src/model/blockchain/NetworkType';

describe('NodeHttp', () => {

    const url = 'http://someHost';
    const response: http.IncomingMessage = mock();
    const nodeRoutesApi: NodeRoutesApi = mock();
    const nodeRepository = DtoMapping.assign(new NodeHttp(url), {nodeRoutesApi: instance(nodeRoutesApi)});

    before(() => {
        reset(response);
        reset(nodeRoutesApi);
    });

    it('getNodeHealth', async () => {

        const body = new NodeHealthInfoDTO();
        body.status = new NodeHealthDTO();
        body.status.apiNode = NodeStatusEnum.Down;
        body.status.db = NodeStatusEnum.Up;

        when(nodeRoutesApi.getNodeHealth()).thenReturn(Promise.resolve({response, body}));

        const nodeHealth = await nodeRepository.getNodeHealth().toPromise();
        expect(nodeHealth).to.be.not.null;
        expect(nodeHealth.apiNode).to.be.equals(NodeStatusEnum.Down);
        expect(nodeHealth.db).to.be.equals(NodeStatusEnum.Up);
    });

    it('getServerInfo', async () => {

        const body = new ServerInfoDTO();
        body.serverInfo = new ServerDTO();
        body.serverInfo.restVersion = 'Some Rest Version';
        body.serverInfo.sdkVersion = 'Some SDK Version';

        when(nodeRoutesApi.getServerInfo()).thenReturn(Promise.resolve({response, body}));

        const serverInfo = await nodeRepository.getServerInfo().toPromise();
        expect(serverInfo).to.be.not.null;
        expect(serverInfo.restVersion).to.be.equals(body.serverInfo.restVersion);
        expect(serverInfo.sdkVersion).to.be.equals(body.serverInfo.sdkVersion);
    });

    it('getNodeInfo', async () => {

        const body = new NodeInfoDTO();
        body.networkIdentifier = NetworkType.TEST_NET;
        body.friendlyName = 'Some Friendly name';
        body.networkGenerationHash = 'Some Gen Hash';
        body.host = 'Some Host';
        body.port = 1234;
        body.publicKey = 'Some Public Key';
        body.roles = RolesTypeEnum.NUMBER_1;
        body.version = 4567;

        when(nodeRoutesApi.getNodeInfo()).thenReturn(Promise.resolve({response, body}));

        const nodeInfo = await nodeRepository.getNodeInfo().toPromise();
        expect(nodeInfo).to.be.not.null;
        expect(nodeInfo).to.deep.equal(body);
    });

    it('getNodePeers', async () => {

        const body = new NodeInfoDTO();
        body.networkIdentifier = NetworkType.TEST_NET;
        body.friendlyName = 'Some Friendly name';
        body.networkGenerationHash = 'Some Gen Hash';
        body.host = 'Some Host';
        body.port = 1234;
        body.publicKey = 'Some Public Key';
        body.roles = RolesTypeEnum.NUMBER_1;
        body.version = 4567;

        when(nodeRoutesApi.getNodePeers()).thenReturn(Promise.resolve({response, body: [body]}));

        const nodeInfoList = await nodeRepository.getNodePeers().toPromise();
        const nodeInfo = nodeInfoList[0];
        expect(nodeInfo).to.be.not.null;
        expect(nodeInfo).to.deep.equal(body);
    });

    it('getNodeTime', async () => {

        const body = new NodeTimeDTO();
        body.communicationTimestamps = new CommunicationTimestampsDTO();
        body.communicationTimestamps.receiveTimestamp = '1111';
        body.communicationTimestamps.sendTimestamp = '2222';

        when(nodeRoutesApi.getNodeTime()).thenReturn(Promise.resolve({response, body}));

        const nodeTime = await nodeRepository.getNodeTime().toPromise();
        expect(nodeTime).to.be.not.null;
        expect(nodeTime.receiveTimeStamp).to.deep.equals([1111, 0]);
        expect(nodeTime.sendTimeStamp).to.deep.equals([2222, 0]);
    });

    it('getNodeTim When No Timestamp', async () => {

        const body = new NodeTimeDTO();
        body.communicationTimestamps = new CommunicationTimestampsDTO();
        body.communicationTimestamps.receiveTimestamp = '1111';

        when(nodeRoutesApi.getNodeTime()).thenReturn(Promise.resolve({response, body}));

        try {
            await nodeRepository.getNodeTime().toPromise();
        } catch (e) {
            expect(e.message).to.deep.equals('Error: Node time not available');
        }
    });

    it('getStorageInfo', async () => {

        const body = new StorageInfoDTO();
        body.numAccounts = 1;
        body.numBlocks = 2;
        body.numTransactions = 3;

        when(nodeRoutesApi.getNodeStorage()).thenReturn(Promise.resolve({response, body}));

        const storageInfo = await nodeRepository.getStorageInfo().toPromise();
        expect(storageInfo).to.deep.equals(body);
    });

    it('getStorageInfo on Exception', async () => {

        when(nodeRoutesApi.getNodeStorage()).thenReturn(Promise.reject({
            response: {statusCode: 500, statusMessage: 'Some Error'},
            body: 'The Body',
        }));
        try {
            await nodeRepository.getStorageInfo().toPromise();
        } catch (e) {
            expect(e.message).to.deep.equals('{"statusCode":500,"errorDetails":{"statusCode":500,"statusMessage":"Some Error"},"body":"The Body"}');
        }

    });
});
