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
import { MetadataInfoDTO, MetadataRoutesApi } from 'symbol-openapi-typescript-fetch-client';
import { Convert } from '../core/format/Convert';
import { DtoMapping } from '../core/utils/DtoMapping';
import { Address } from '../model/account/Address';
import { MerkleStateInfo } from '../model/blockchain';
import { Metadata } from '../model/metadata/Metadata';
import { MetadataEntry } from '../model/metadata/MetadataEntry';
import { MetadataType } from '../model/metadata/MetadataType';
import { MosaicId } from '../model/mosaic/MosaicId';
import { NamespaceId } from '../model/namespace/NamespaceId';
import { UInt64 } from '../model/UInt64';
import { Http } from './Http';
import { MetadataRepository } from './MetadataRepository';
import { Page } from './Page';
import { MetadataPaginationStreamer } from './paginationStreamer';
import { MetadataSearchCriteria } from './searchCriteria/MetadataSearchCriteria';

/**
 * Metadata http repository.
 *
 * @since 1.0
 */
export class MetadataHttp extends Http implements MetadataRepository {
    /**
     * @internal
     * Symbol openapi typescript-node client metadata routes api
     */
    private readonly metadataRoutesApi: MetadataRoutesApi;

    /**
     * Constructor
     * @param url Base catapult-rest url
     * @param fetchApi fetch function to be used when performing rest requests.
     */
    constructor(url: string, fetchApi?: any) {
        super(url, fetchApi);
        this.metadataRoutesApi = new MetadataRoutesApi(this.config());
    }

    /**
     * Gets an array of metadata.
     * @param criteria - Metadata search criteria
     * @returns Observable<Page<Metadata>>
     */
    public search(criteria: MetadataSearchCriteria): Observable<Page<Metadata>> {
        return this.call(
            this.metadataRoutesApi.searchMetadataEntries(
                criteria.sourceAddress?.plain(),
                criteria.targetAddress?.plain(),
                criteria.scopedMetadataKey,
                criteria.targetId?.toHex(),
                criteria.metadataType?.valueOf(),
                criteria.pageSize,
                criteria.pageNumber,
                criteria.offset,
                DtoMapping.mapEnum(criteria.order),
            ),
            (body) => super.toPage(body.pagination, body.data, this.toMetadata),
        );
    }

    /**
     * Get metadata of the given id.
     * @param compositeHash Metadata composite hash id
     * @returns Observable<Metadata>
     */
    public getMetadata(compositeHash: string): Observable<Metadata> {
        return this.call(this.metadataRoutesApi.getMetadata(compositeHash), (body) => this.toMetadata(body));
    }

    /**
     * Get metadata merkle of the given id.
     * @param compositeHash Metadata composite hash id
     * @returns Observable<MerkleStateInfo>
     */
    public getMetadataMerkle(compositeHash: string): Observable<MerkleStateInfo> {
        return this.call(this.metadataRoutesApi.getMetadataMerkle(compositeHash), DtoMapping.toMerkleStateInfo);
    }

    public streamer(): MetadataPaginationStreamer {
        return new MetadataPaginationStreamer(this);
    }

    /**
     * It maps MetadataDTO into a Metadata
     * @param metadata - the dto
     * @returns the model Metadata.
     */
    private toMetadata(metadata: MetadataInfoDTO): Metadata {
        const metadataEntry = metadata.metadataEntry;
        let targetId;

        switch (metadataEntry.metadataType.valueOf()) {
            case MetadataType.Mosaic:
                targetId = new MosaicId(metadataEntry.targetId as any);
                break;
            case MetadataType.Namespace:
                targetId = NamespaceId.createFromEncoded(metadataEntry.targetId as any);
                break;
            default:
                targetId = undefined;
        }
        return new Metadata(
            metadata.id,
            new MetadataEntry(
                metadataEntry.version || 1,
                metadataEntry.compositeHash,
                Address.createFromEncoded(metadataEntry.sourceAddress),
                Address.createFromEncoded(metadataEntry.targetAddress),
                UInt64.fromHex(metadataEntry.scopedMetadataKey),
                metadataEntry.metadataType.valueOf(),
                Convert.decodeHex(metadataEntry.value),
                targetId,
            ),
        );
    }
}
