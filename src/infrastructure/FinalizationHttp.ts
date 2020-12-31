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

import { Observable } from 'rxjs';
import { FinalizationProofDTO, FinalizationRoutesApi } from 'symbol-openapi-typescript-fetch-client';
import { BmTreeSignature } from '../model/finalization/BmTreeSignature';
import { FinalizationProof } from '../model/finalization/FinalizationProof';
import { MessageGroup } from '../model/finalization/MessageGroup';
import { ParentPublicKeySignaturePair } from '../model/finalization/ParentPublicKeySignaturePair';
import { UInt64 } from '../model/UInt64';
import { FinalizationRepository } from './FinalizationRepository';
import { Http } from './Http';

/**
 * Chian http repository.
 *
 * @since 1.0
 */
export class FinalizationHttp extends Http implements FinalizationRepository {
    /**
     * @internal
     * Symbol openapi typescript-node client Finalization routes api
     */
    private finalizationRoutesApi: FinalizationRoutesApi;

    /**
     * Constructor
     * @param url Base catapult-rest url
     * @param fetchApi fetch function to be used when performing rest requests.
     */
    constructor(url: string, fetchApi?: any) {
        super(url, fetchApi);
        this.finalizationRoutesApi = new FinalizationRoutesApi(this.config());
    }

    /**
     * Gets finalization proof for the greatest height associated with the given epoch.
     * @param epoch Finalization epoch
     * @returns Observable<UInt64>
     */
    public getFinalizationProofAtEpoch(epoch: number): Observable<FinalizationProof> {
        return this.call(this.finalizationRoutesApi.getFinalizationProofAtEpoch(epoch), (body) => this.toFinalizationProof(body));
    }

    /**
     * Gets finalization proof at the given height.
     * @param height Block height
     * @returns Observable<BlockchainScore>
     */
    public getFinalizationProofAtHeight(height: UInt64): Observable<FinalizationProof> {
        return this.call(this.finalizationRoutesApi.getFinalizationProofAtHeight(height.toString()), (body) =>
            this.toFinalizationProof(body),
        );
    }

    /**
     * This method maps a FinalizationProofDTO from rest to the SDK's FinalizationProof model object.
     *
     * @internal
     * @param {FinalizationProofDTO} dto FinalizationProofDTO the dto object from rest.
     * @returns FinalizationProof model
     */
    private toFinalizationProof(dto: FinalizationProofDTO): FinalizationProof {
        return new FinalizationProof(
            dto.version,
            dto.finalizationEpoch,
            dto.finalizationPoint,
            UInt64.fromNumericString(dto.height),
            dto.hash,
            dto.messageGroups.map(
                (mg) =>
                    new MessageGroup(
                        mg.stage.valueOf(),
                        UInt64.fromNumericString(mg.height),
                        mg.hashes,
                        mg.signatures.map(
                            (s) =>
                                new BmTreeSignature(
                                    new ParentPublicKeySignaturePair(s.root.parentPublicKey, s.root.signature),
                                    new ParentPublicKeySignaturePair(s.bottom.parentPublicKey, s.bottom.signature),
                                ),
                        ),
                    ),
            ),
        );
    }
}
