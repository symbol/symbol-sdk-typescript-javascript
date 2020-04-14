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
import { ChainRoutesApi, ChainScoreDTO, HeightInfoDTO } from 'symbol-openapi-typescript-node-client';
import { instance, mock, reset, when } from 'ts-mockito';
import { DtoMapping } from '../../src/core/utils/DtoMapping';
import { ChainHttp } from '../../src/infrastructure/ChainHttp';
import { ChainRepository } from '../../src/infrastructure/ChainRepository';

describe('ChainHttp', () => {
    const url = 'http://someHost';
    const response: http.IncomingMessage = mock();
    const chainRoutesApi: ChainRoutesApi = mock();
    const chainRepository: ChainRepository = DtoMapping.assign(new ChainHttp(url), {
        chainRoutesApi: instance(chainRoutesApi),
    });

    before(() => {
        reset(response);
        reset(chainRoutesApi);
    });

    it('getBlockchainHeight', async () => {
        const heightInfoDTO = new HeightInfoDTO();
        heightInfoDTO.height = '3';
        when(chainRoutesApi.getChainHeight()).thenReturn(Promise.resolve({ response, body: heightInfoDTO }));
        const heightInfo = await chainRepository.getBlockchainHeight().toPromise();
        expect(heightInfo).to.be.not.null;
        expect(heightInfo.toString()).to.be.equals('3');
    });

    it('getChainScore', async () => {
        const chainScoreDTO = new ChainScoreDTO();
        chainScoreDTO.scoreLow = '2';
        chainScoreDTO.scoreHigh = '3';
        when(chainRoutesApi.getChainScore()).thenReturn(Promise.resolve({ response, body: chainScoreDTO }));
        const chainScore = await chainRepository.getChainScore().toPromise();
        expect(chainScore).to.be.not.null;
        expect(chainScore.scoreLow.toString()).to.be.equals('2');
        expect(chainScore.scoreHigh.toString()).to.be.equals('3');
    });
});
