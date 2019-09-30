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

import { ClientResponse } from 'http';
import {from as observableFrom, Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import { Address } from '../model/account/Address';
import { Metadata } from '../model/metadata/Metadata';
import { MetadataEntry } from '../model/metadata/MetadataEntry';
import { MetadataType } from '../model/metadata/MetadataType';
import {MosaicId} from '../model/mosaic/MosaicId';
import {NamespaceId} from '../model/namespace/NamespaceId';
import {UInt64} from '../model/UInt64';
import { MetadataDTO, MetadataEntriesDTO, MetadataRoutesApi } from './api';
import {Http} from './Http';
import { MetadataRepository } from './MetadataRepository';
import {NetworkHttp} from './NetworkHttp';
import { QueryParams } from './QueryParams';

/**
 * Metadata http repository.
 *
 * @since 1.0
 */
export class MetadataHttp extends Http implements MetadataRepository {
    /**
     * @internal
     * Nem2 Library metadata routes api
     */
    private metadataRoutesApi: MetadataRoutesApi;

    /**
     * Constructor
     * @param url
     * @param networkHttp
     */
    constructor(url: string, networkHttp?: NetworkHttp) {
        networkHttp = networkHttp == null ? new NetworkHttp(url) : networkHttp;
        super(networkHttp);
        this.metadataRoutesApi = new MetadataRoutesApi(url);
    }

    /**
     * Returns the account metadata given an account id.
     * @param address - Account address to be created from PublicKey or RawAddress
     * @param queryParams - Optional query parameters
     * @returns Observable<Metadata[]>
     */
    public getAccountMetadata(address: Address, queryParams?: QueryParams): Observable<Metadata[]> {
        return observableFrom(
            this.metadataRoutesApi.getAccountMetadata(address.plain(),
                                                      this.queryParams(queryParams).pageSize,
                                                      this.queryParams(queryParams).id,
                                                      this.queryParams(queryParams).order)).pipe(
            map((response: { response: ClientResponse; body: MetadataEntriesDTO; }) => {
                const metadataEntriesDTO = response.body;
                return metadataEntriesDTO.metadataEntries.map((metadataEntry) => {
                    return this.buildMetadata(metadataEntry);
                });
            }),
            catchError((error) =>  throwError(error)),
        );
    }

    /**
     * Returns the account metadata given an account id and a key
     * @param address - Account address to be created from PublicKey or RawAddress
     * @param key - Metadata key
     * @returns Observable<Metadata[]>
     */
    getAccountMetadataByKey(address: Address, key: string): Observable<Metadata[]> {
        return observableFrom(
            this.metadataRoutesApi.getAccountMetadataByKey(address.plain(), key)).pipe(
            map((response: { response: ClientResponse; body: MetadataEntriesDTO; }) => {
                const metadataEntriesDTO = response.body;
                return metadataEntriesDTO.metadataEntries.map((metadataEntry) => {
                    return this.buildMetadata(metadataEntry);
                });
            }),
            catchError((error) =>  throwError(error)),
        );
    }

    /**
     * Returns the account metadata given an account id and a key
     * @param address - Account address to be created from PublicKey or RawAddress
     * @param key - Metadata key
     * @param publicKey - Sender public key
     * @returns Observable<Metadata>
     */
    getAccountMetadataByKeyAndSender(address: Address, key: string, publicKey: string): Observable<Metadata> {
        return observableFrom(
            this.metadataRoutesApi.getAccountMetadataByKeyAndSender(address.plain(), key, publicKey)).pipe(
            map((response: { response: ClientResponse; body: MetadataDTO; }) => {
                const metadataDTO = response.body;
                return this.buildMetadata(metadataDTO);
            }),
            catchError((error) =>  throwError(error)),
        );
    }

    /**
     * Returns the mosaic metadata given a mosaic id.
     * @param mosaicId - Mosaic identifier.
     * @param queryParams - Optional query parameters
     * @returns Observable<Metadata[]>
     */
    getMosaicMetadata(mosaicId: MosaicId, queryParams?: QueryParams): Observable<Metadata[]> {
        return observableFrom(
            this.metadataRoutesApi.getMosaicMetadata(mosaicId.toHex(),
                                                     this.queryParams(queryParams).pageSize,
                                                     this.queryParams(queryParams).id,
                                                     this.queryParams(queryParams).order)).pipe(
            map((response: { response: ClientResponse; body: MetadataEntriesDTO; }) => {
                const metadataEntriesDTO = response.body;
                return metadataEntriesDTO.metadataEntries.map((metadataEntry) => {
                    return this.buildMetadata(metadataEntry);
                });
            }),
            catchError((error) =>  throwError(error)),
        );
    }

    /**
     * Returns the mosaic metadata given a mosaic id and metadata key.
     * @param mosaicId - Mosaic identifier.
     * @param key - Metadata key.
     * @returns Observable<Metadata[]>
     */
    getMosaicMetadataByKey(mosaicId: MosaicId, key: string): Observable<Metadata[]> {
        return observableFrom(
            this.metadataRoutesApi.getMosaicMetadataByKey(mosaicId.toHex(), key)).pipe(
            map((response: { response: ClientResponse; body: MetadataEntriesDTO; }) => {
                const metadataEntriesDTO = response.body;
                return metadataEntriesDTO.metadataEntries.map((metadataEntry) => {
                    return this.buildMetadata(metadataEntry);
                });
            }),
            catchError((error) =>  throwError(error)),
        );
    }

    /**
     * Returns the mosaic metadata given a mosaic id and metadata key.
     * @param mosaicId - Mosaic identifier.
     * @param key - Metadata key.
     * @param publicKey - Sender public key
     * @returns Observable<Metadata>
     */
    getMosaicMetadataByKeyAndSender(mosaicId: MosaicId, key: string, publicKey: string): Observable<Metadata> {
        return observableFrom(
            this.metadataRoutesApi.getMosaicMetadataByKeyAndSender(mosaicId.toHex(), key, publicKey)).pipe(
            map((response: { response: ClientResponse; body: MetadataDTO; }) => {
                const metadataDTO = response.body;
                return this.buildMetadata(metadataDTO);
            }),
            catchError((error) =>  throwError(error)),
        );
    }

    /**
     * Returns the mosaic metadata given a mosaic id.
     * @param namespaceId - Namespace identifier.
     * @param queryParams - Optional query parameters
     * @returns Observable<Metadata[]>
     */
    public getNamespaceMetadata(namespaceId: NamespaceId, queryParams?: QueryParams): Observable<Metadata[]> {
        return observableFrom(
            this.metadataRoutesApi.getNamespaceMetadata(namespaceId.toHex(),
                                                     this.queryParams(queryParams).pageSize,
                                                     this.queryParams(queryParams).id,
                                                     this.queryParams(queryParams).order)).pipe(
            map((response: { response: ClientResponse; body: MetadataEntriesDTO; }) => {
                const metadataEntriesDTO = response.body;
                return metadataEntriesDTO.metadataEntries.map((metadataEntry) => {
                    return this.buildMetadata(metadataEntry);
                });
            }),
            catchError((error) =>  throwError(error)),
        );
    }

    /**
     * Returns the mosaic metadata given a mosaic id and metadata key.
     * @param namespaceId - Namespace identifier.
     * @param key - Metadata key.
     * @returns Observable<Metadata[]>
     */
    public getNamespaceMetadataByKey(namespaceId: NamespaceId, key: string): Observable<Metadata[]> {
        return observableFrom(
            this.metadataRoutesApi.getNamespaceMetadataByKey(namespaceId.toHex(), key)).pipe(
            map((response: { response: ClientResponse; body: MetadataEntriesDTO; }) => {
                const metadataEntriesDTO = response.body;
                return metadataEntriesDTO.metadataEntries.map((metadataEntry) => {
                    return this.buildMetadata(metadataEntry);
                });
            }),
            catchError((error) =>  throwError(error)),
        );
    }

    /**
     * Returns the namespace metadata given a mosaic id and metadata key.
     * @param namespaceId - Namespace identifier.
     * @param key - Metadata key.
     * @param publicKey - Sender public key
     * @returns Observable<Metadata>
     */
    public getNamespaceMetadataByKeyAndSender(namespaceId: NamespaceId, key: string, publicKey: string): Observable<Metadata> {
        return observableFrom(
            this.metadataRoutesApi.getNamespaceMetadataByKeyAndSender(namespaceId.toHex(), key, publicKey)).pipe(
            map((response: { response: ClientResponse; body: MetadataDTO; }) => {
                const metadataDTO = response.body;
                return this.buildMetadata(metadataDTO);
            }),
            catchError((error) =>  throwError(error)),
        );
    }

    /**
     * Returns the mosaic metadata given a mosaic id.
     * @param namespaceId - Namespace identifier.
     * @param queryParams - Optional query parameters
     * @returns Observable<Metadata[]>
     */
    private buildMetadata(metadata: MetadataDTO): Metadata {
        const metadataEntry = metadata.metadataEntry;
        let targetId;

        switch (metadataEntry.metadataType.valueOf()) {
            case MetadataType.Mosaic:
                targetId = new MosaicId(metadataEntry.targetId);
                break;
            case MetadataType.Namespace:
                targetId = NamespaceId.createFromEncoded(metadataEntry.targetId);
                break;
            default:
                targetId = undefined;
        }
        return new Metadata(
            metadata.id,
            new MetadataEntry(
                metadataEntry.compositeHash,
                metadataEntry.senderPublicKey,
                metadataEntry.targetPublicKey,
                UInt64.fromHex(metadataEntry.scopedMetadataKey),
                metadataEntry.metadataType.valueOf(),
                metadataEntry.valueSize,
                metadataEntry.value,
                targetId,
            ),
        );
    }
}
