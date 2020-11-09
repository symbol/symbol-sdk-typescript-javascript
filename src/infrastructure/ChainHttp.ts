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
import { ChainInfoDTO, ChainRoutesApi, FinalizedBlockDTO } from 'symbol-openapi-typescript-fetch-client';
import { UInt64 } from '../model';
import { ChainInfo, FinalizedBlock } from '../model/blockchain';
import { ChainRepository } from './ChainRepository';
import { Http } from './Http';

/**
 * Chian http repository.
 *
 * @since 1.0
 */
export class ChainHttp extends Http implements ChainRepository {
    /**
     * @internal
     * Symbol openapi typescript-node client chain routes api
     */
    private chainRoutesApi: ChainRoutesApi;

    /**
     * Constructor
     * @param url Base catapult-rest url
     * @param fetchApi fetch function to be used when performing rest requests.
     */
    constructor(url: string, fetchApi?: any) {
        super(url, fetchApi);
        this.chainRoutesApi = new ChainRoutesApi(this.config());
    }

    /**
     * Gets current blockchain info
     * @returns Observable<ChainInfo>
     */
    public getChainInfo(): Observable<ChainInfo> {
        return this.call(this.chainRoutesApi.getChainInfo(), (body: ChainInfoDTO) => ChainHttp.toChainInfo(body));
    }

    public static toChainInfo(dto: ChainInfoDTO) {
        return new ChainInfo(
            UInt64.fromNumericString(dto.height),
            UInt64.fromNumericString(dto.scoreLow),
            UInt64.fromNumericString(dto.scoreHigh),
            ChainHttp.toFinalizationBlock(dto.latestFinalizedBlock),
        );
    }

    public static toFinalizationBlock(dto: FinalizedBlockDTO) {
        return new FinalizedBlock(UInt64.fromNumericString(dto.height), dto.hash, dto.finalizationPoint, dto.finalizationPoint);
    }
}
