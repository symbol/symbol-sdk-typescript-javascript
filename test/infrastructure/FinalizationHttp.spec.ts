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
    FinalizationRoutesApi,
    MessageGroup,
    StageEnum,
    ParentPublicKeySignaturePair,
    BmTreeSignature,
} from 'symbol-openapi-typescript-fetch-client';
import { instance, mock, reset, when } from 'ts-mockito';
import { DtoMapping } from '../../src/core/utils/DtoMapping';
import { FinalizationProofDTO } from 'symbol-openapi-typescript-fetch-client';
import { FinalizationProof } from '../../src/model/finalization/FinalizationProof';
import { deepEqual } from 'assert';
import { FinalizationHttp } from '../../src/infrastructure/FinalizationHttp';
import { UInt64 } from '../../src/model/UInt64';

describe('FinalizationHttp', () => {
    const url = 'http://someHost';
    const response: http.IncomingMessage = mock();
    const finalizationRoutesApi: FinalizationRoutesApi = mock();
    const finalizationRepository = DtoMapping.assign(new FinalizationHttp(url), { finalizationRoutesApi: instance(finalizationRoutesApi) });

    const dto = {} as FinalizationProofDTO;
    dto.finalizationEpoch = 1;
    dto.finalizationPoint = 1;
    dto.hash = 'proofhash';
    dto.height = '1';
    dto.version = 1;

    const mg = {} as MessageGroup;
    mg.hashes = ['mghash'];
    mg.height = '1';
    mg.stage = StageEnum.NUMBER_0;

    const ps = {} as ParentPublicKeySignaturePair;
    ps.parentPublicKey = 'pubKey';
    ps.signature = 'signature';

    const tree = {} as BmTreeSignature;
    tree.bottom = ps;
    tree.top = ps;
    tree.root = ps;

    mg.signatures = [tree];
    dto.messageGroups = [mg];

    before(() => {
        reset(response);
        reset(finalizationRoutesApi);
    });

    const assertDto = (model: FinalizationProof): void => {
        expect(model).to.be.not.null;
        expect(model.version).to.be.equals(dto.version);
        expect(model.finalizationEpoch).to.be.equals(dto.finalizationEpoch);
        expect(model.finalizationPoint).to.be.equals(dto.finalizationPoint);
        expect(model.hash).to.be.equals(dto.hash);
        expect(model.height.toString()).to.be.equals(dto.height);

        expect(model.messageGroups[0].height.toString()).to.be.equals(dto.messageGroups[0].height);
        expect(model.messageGroups[0].stage.valueOf()).to.be.equals(dto.messageGroups[0].stage.valueOf());
        expect(model.messageGroups[0].hashes[0]).to.be.equals(dto.messageGroups[0].hashes[0]);
        deepEqual(model.messageGroups[0].signatures, dto.messageGroups[0].signatures);
    };

    it('getFinalizationProofAtEpoch', async () => {
        when(finalizationRoutesApi.getFinalizationProofAtEpoch(1)).thenReturn(Promise.resolve(dto));
        const model = await finalizationRepository.getFinalizationProofAtEpoch(1).toPromise();
        assertDto(model);
    });

    it('getFinalizationProofAtHeight', async () => {
        when(finalizationRoutesApi.getFinalizationProofAtHeight('1')).thenReturn(Promise.resolve(dto));
        const model = await finalizationRepository.getFinalizationProofAtHeight(UInt64.fromUint(1)).toPromise();
        assertDto(model);
    });

    it('getFinalizationProofAtEpoch - Error', async () => {
        when(finalizationRoutesApi.getFinalizationProofAtEpoch(1)).thenReject(new Error('Mocked Error'));
        await finalizationRepository
            .getFinalizationProofAtEpoch(1)
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });

    it('getFinalizationProofAtHeight - Error', async () => {
        when(finalizationRoutesApi.getFinalizationProofAtHeight('1')).thenReject(new Error('Mocked Error'));
        await finalizationRepository
            .getFinalizationProofAtHeight(UInt64.fromUint(1))
            .toPromise()
            .catch((error) => expect(error).not.to.be.undefined);
    });
});
