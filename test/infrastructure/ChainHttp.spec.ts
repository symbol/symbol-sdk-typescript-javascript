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
import { ChainInfoDTO, ChainInfoDTOLatestFinalizedBlock, ChainRoutesApi } from 'symbol-openapi-typescript-fetch-client';
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

    it('getChainInfo', async () => {
        const chainInfoDTO = {} as ChainInfoDTO;
        chainInfoDTO.height = '1';
        chainInfoDTO.finalizedHeight = '1';
        chainInfoDTO.scoreLow = '2';
        chainInfoDTO.scoreHigh = '3';
        const finalizedBlockDto = {} as ChainInfoDTOLatestFinalizedBlock;
        finalizedBlockDto.finalizationEpoch = 1;
        finalizedBlockDto.finalizationPoint = 1;
        finalizedBlockDto.hash = 'hash';
        finalizedBlockDto.height = '1';
        chainInfoDTO.latestFinalizedBlock = finalizedBlockDto;
        when(chainRoutesApi.getChainInfo()).thenReturn(Promise.resolve(chainInfoDTO));
        const info = await chainRepository.getChainInfo().toPromise();
        expect(info).to.be.not.null;
        expect(info.height.toString()).to.be.equals('1');
        expect(info.finalizedHeight.toString()).to.be.equals('1');
        expect(info.scoreLow.toString()).to.be.equals('2');
        expect(info.scoreHigh.toString()).to.be.equals('3');
        expect(info.latestFinalizedBlock.height.toString()).to.be.equals('1');
        expect(info.latestFinalizedBlock.hash).to.be.equals('hash');
        expect(info.latestFinalizedBlock.finalizationPoint).to.be.equals(1);
        expect(info.latestFinalizedBlock.finalizationEpoch).to.be.equals(1);
    });
});
