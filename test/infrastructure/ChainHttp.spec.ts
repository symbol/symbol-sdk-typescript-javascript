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
import { ChainInfoDTO, ChainRoutesApi, FinalizedBlockDTO } from 'symbol-openapi-typescript-fetch-client';
import { instance, mock, reset, when } from 'ts-mockito';
import { DtoMapping } from '../../src/core/utils/DtoMapping';
import { ChainHttp } from '../../src/infrastructure/ChainHttp';
import { ChainRepository } from '../../src/infrastructure/ChainRepository';
import { toPromise } from '../../src/infrastructure/rxUtils';

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
        chainInfoDTO.scoreLow = '2';
        chainInfoDTO.scoreHigh = '3';
        const finalizedBlockDto = {} as FinalizedBlockDTO;
        finalizedBlockDto.finalizationEpoch = 1;
        finalizedBlockDto.finalizationPoint = 2;
        finalizedBlockDto.hash = 'hash';
        finalizedBlockDto.height = '1';
        chainInfoDTO.latestFinalizedBlock = finalizedBlockDto;
        when(chainRoutesApi.getChainInfo()).thenReturn(Promise.resolve(chainInfoDTO));
        const info = await toPromise(chainRepository.getChainInfo());
        expect(info).to.be.not.null;
        expect(info.height.toString()).to.be.equals(chainInfoDTO.height);
        expect(info.scoreLow.toString()).to.be.equals(chainInfoDTO.scoreLow);
        expect(info.scoreHigh.toString()).to.be.equals(chainInfoDTO.scoreHigh);
        expect(info.latestFinalizedBlock.height.toString()).to.be.equals(finalizedBlockDto.height);
        expect(info.latestFinalizedBlock.hash).to.be.equals(finalizedBlockDto.hash);
        expect(info.latestFinalizedBlock.finalizationPoint).to.be.equals(finalizedBlockDto.finalizationPoint);
        expect(info.latestFinalizedBlock.finalizationEpoch).to.be.equals(finalizedBlockDto.finalizationEpoch);
    });
});
