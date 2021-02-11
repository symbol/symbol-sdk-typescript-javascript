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
import { ChainInfoDTO, ChainRoutesApi } from 'symbol-openapi-typescript-fetch-client';
import { ChainInfo } from '../model/blockchain/ChainInfo';
import { FinalizedBlock } from '../model/blockchain/FinalizedBlock';
import { UInt64 } from '../model/UInt64';
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
        return this.call(
            this.chainRoutesApi.getChainInfo(),
            (body: ChainInfoDTO) =>
                new ChainInfo(
                    UInt64.fromNumericString(body.height),
                    UInt64.fromNumericString(body.scoreLow),
                    UInt64.fromNumericString(body.scoreHigh),
                    new FinalizedBlock(
                        UInt64.fromNumericString(body.latestFinalizedBlock.height),
                        body.latestFinalizedBlock.hash,
                        body.latestFinalizedBlock.finalizationPoint,
                        body.latestFinalizedBlock.finalizationEpoch,
                    ),
                ),
        );
    }
}
