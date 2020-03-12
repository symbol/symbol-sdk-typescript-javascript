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
import { ChainRoutesApi } from 'symbol-openapi-typescript-node-client';
import { BlockchainScore } from '../model/blockchain/BlockchainScore';
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
     * @param url
     */
    constructor(url: string) {
        super(url);
        this.chainRoutesApi = new ChainRoutesApi(url);
        this.chainRoutesApi.useQuerystring = true;
    }

    /**
     * Gets current blockchain height
     * @returns Observable<UInt64>
     */
    public getBlockchainHeight(): Observable<UInt64> {
        return this.call(this.chainRoutesApi.getChainHeight(), (body) => UInt64.fromNumericString(body.height));
    }

    /**
     * Gets current blockchain score
     * @returns Observable<BlockchainScore>
     */
    public getChainScore(): Observable<BlockchainScore> {
        return this.call(this.chainRoutesApi.getChainScore(), (body) => new BlockchainScore(
            UInt64.fromNumericString(body.scoreLow),
            UInt64.fromNumericString(body.scoreHigh),
            ),
        );
    }
}
