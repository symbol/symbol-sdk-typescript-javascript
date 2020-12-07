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

import { Observable } from 'rxjs';
import { SecretLockInfoDTO, SecretLockRoutesApi } from 'symbol-openapi-typescript-fetch-client';
import { DtoMapping } from '../core/utils';
import { UInt64 } from '../model';
import { Address } from '../model/account';
import { MerkleStateInfo } from '../model/blockchain';
import { SecretLockInfo } from '../model/lock';
import { MosaicId } from '../model/mosaic';
import { Http } from './Http';
import { Page } from './Page';
import { SecretLockPaginationStreamer } from './paginationStreamer';
import { SecretLockSearchCriteria } from './searchCriteria';
import { SecretLockRepository } from './SecretLockRepository';

/**
 * SecretLock http repository.
 *
 * @since 1.0
 */
export class SecretLockHttp extends Http implements SecretLockRepository {
    /**
     * @internal
     * Symbol openapi typescript-node client account routes api
     */
    private secretLockRoutesApi: SecretLockRoutesApi;

    /**
     * Constructor
     * @param url Base catapult-rest url
     * @param fetchApi fetch function to be used when performing rest requests.
     */
    constructor(url: string, fetchApi?: any) {
        super(url, fetchApi);
        this.secretLockRoutesApi = new SecretLockRoutesApi(this.config());
    }

    public getSecretLock(compositeHash: string): Observable<SecretLockInfo> {
        return this.call(this.secretLockRoutesApi.getSecretLock(compositeHash), (body) => this.toSecretLockInfo(body));
    }

    public getSecretLockMerkle(compositeHash: string): Observable<MerkleStateInfo> {
        return this.call(this.secretLockRoutesApi.getSecretLockMerkle(compositeHash), DtoMapping.toMerkleStateInfo);
    }

    /**
     * Gets an array of SecretLockInfo.
     * @param criteria - SecretLock search criteria
     * @returns Observable<Page<SecretLockInfo>>
     */
    public search(criteria: SecretLockSearchCriteria): Observable<Page<SecretLockInfo>> {
        return this.call(
            this.secretLockRoutesApi.searchSecretLock(
                criteria.address?.plain(),
                criteria.secret,
                criteria.pageSize,
                criteria.pageNumber,
                criteria.offset,
                DtoMapping.mapEnum(criteria.order),
            ),
            (body) => super.toPage(body.pagination, body.data, this.toSecretLockInfo),
        );
    }

    public streamer(): SecretLockPaginationStreamer {
        return new SecretLockPaginationStreamer(this);
    }

    /**
     * This method maps a SecretLockInfoDTO from rest to the SDK's SecretLockInfo model object.
     *
     * @internal
     * @param {SecretLockInfoDTO} dto SecretLockInfoDTO the dto object from rest.
     * @returns SecretLockInfo model
     */
    private toSecretLockInfo(dto: SecretLockInfoDTO): SecretLockInfo {
        return new SecretLockInfo(
            dto.lock.version || 1,
            dto.id,
            Address.createFromEncoded(dto.lock.ownerAddress),
            new MosaicId(dto.lock.mosaicId),
            UInt64.fromNumericString(dto.lock.amount),
            UInt64.fromNumericString(dto.lock.endHeight),
            dto.lock.status.valueOf(),
            dto.lock.hashAlgorithm.valueOf(),
            dto.lock.secret,
            Address.createFromEncoded(dto.lock.recipientAddress),
            dto.lock.compositeHash,
        );
    }
}
