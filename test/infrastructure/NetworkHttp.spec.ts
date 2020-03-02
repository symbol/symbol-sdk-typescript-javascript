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
import { NetworkFeesDTO, NetworkRoutesApi, NetworkTypeDTO, NodeInfoDTO, NodeRoutesApi } from 'symbol-openapi-typescript-node-client';
import { instance, mock, reset, when } from 'ts-mockito';
import { DtoMapping } from '../../src/core/utils/DtoMapping';
import { NetworkHttp } from '../../src/infrastructure/NetworkHttp';
import { NodeHttp } from '../../src/infrastructure/NodeHttp';
import { NetworkType } from '../../src/model/blockchain/NetworkType';

describe('NetworkHttp', () => {
    const url = 'http://someHost';

    const response: http.IncomingMessage = mock();
    const nodeRoutesApi: NodeRoutesApi = mock();
    const networkRoutesApi: NetworkRoutesApi = mock();
    const nodeHttp = DtoMapping.assign(new NodeHttp(url), {nodeRoutesApi: instance(nodeRoutesApi)});
    const networkRepository = DtoMapping.assign(new NetworkHttp(url), {
        networkRoutesApi: instance(networkRoutesApi),
        nodeHttp,
    });

    before(() => {
        reset(response);
        reset(nodeRoutesApi);
        reset(networkRoutesApi);
    });

    it('getNetworkFees', async () => {

        const body = new NetworkFeesDTO();
        body.averageFeeMultiplier = 1;
        body.highestFeeMultiplier = 2;
        body.lowestFeeMultiplier = 3;
        body.medianFeeMultiplier = 4;

        when(networkRoutesApi.getNetworkFees()).thenReturn(Promise.resolve({response, body}));

        const networkFees = await networkRepository.getNetworkFees().toPromise();
        expect(networkFees).to.be.not.null;
        expect(networkFees.averageFeeMultiplier).to.be.equals(1);
        expect(networkFees.highestFeeMultiplier).to.be.equals(2);
        expect(networkFees.lowestFeeMultiplier).to.be.equals(3);
        expect(networkFees.medianFeeMultiplier).to.be.equals(4);
    });

    it('getNetworkType', async () => {

        const body = new NodeInfoDTO();
        body.networkIdentifier = NetworkType.MIJIN_TEST;

        when(nodeRoutesApi.getNodeInfo()).thenReturn(Promise.resolve({response, body}));

        const networkType = await networkRepository.getNetworkType().toPromise();
        expect(networkType).to.be.equals(NetworkType.MIJIN_TEST);
    });

    it('getNetworkName', async () => {

        const body = new NetworkTypeDTO();
        body.name = 'Some Name';
        body.description = 'Some Description';

        when(networkRoutesApi.getNetworkType()).thenReturn(Promise.resolve({response, body}));

        const networkName = await networkRepository.getNetworkName().toPromise();
        expect(networkName.description).to.be.equals(body.description);
        expect(networkName.name).to.be.equals(body.name);
    });

});
