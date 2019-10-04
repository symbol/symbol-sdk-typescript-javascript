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

import {Observable} from 'rxjs';
import { Address } from '../model/account/Address';
import { Metadata } from '../model/metadata/Metadata';
import {MosaicId} from '../model/mosaic/MosaicId';
import { NamespaceId } from '../model/namespace/NamespaceId';
import { QueryParams } from './QueryParams';

/**
 * Metadata interface repository.
 *
 * @since 1.0
 */
export interface MetadataRepository {

    /**
     * Returns the account metadata given an account id.
     * @param address - Account address to be created from PublicKey or RawAddress
     * @param queryParams - Optional query parameters
     * @returns Observable<Metadata[]>
     */
    getAccountMetadata(address: Address, queryParams?: QueryParams): Observable<Metadata[]>;

    /**
     * Returns the account metadata given an account id and a key
     * @param address - Account address to be created from PublicKey or RawAddress
     * @param key - Metadata key
     * @returns Observable<Metadata[]>
     */
    getAccountMetadataByKey(address: Address, key: string): Observable<Metadata[]>;

    /**
     * Returns the account metadata given an account id and a key
     * @param address - Account address to be created from PublicKey or RawAddress
     * @param key - Metadata key
     * @param publicKey - Sender public key
     * @returns Observable<Metadata>
     */
    getAccountMetadataByKeyAndSender(address: Address, key: string, publicKey: string): Observable<Metadata>;

    /**
     * Returns the mosaic metadata given a mosaic id.
     * @param mosaicId - Mosaic identifier.
     * @param queryParams - Optional query parameters
     * @returns Observable<Metadata[]>
     */
    getMosaicMetadata(mosaicId: MosaicId, queryParams?: QueryParams): Observable<Metadata[]>;

    /**
     * Returns the mosaic metadata given a mosaic id and metadata key.
     * @param mosaicId - Mosaic identifier.
     * @param key - Metadata key.
     * @returns Observable<Metadata[]>
     */
    getMosaicMetadataByKey(mosaicId: MosaicId, key: string): Observable<Metadata[]>;

    /**
     * Returns the mosaic metadata given a mosaic id and metadata key.
     * @param mosaicId - Mosaic identifier.
     * @param key - Metadata key.
     * @param publicKey - Sender public key
     * @returns Observable<Metadata>
     */
    getMosaicMetadataByKeyAndSender(mosaicId: MosaicId, key: string, publicKey: string): Observable<Metadata>;

    /**
     * Returns the mosaic metadata given a mosaic id.
     * @param namespaceId - Namespace identifier.
     * @param queryParams - Optional query parameters
     * @returns Observable<Metadata[]>
     */
    getNamespaceMetadata(namespaceId: NamespaceId, queryParams?: QueryParams): Observable<Metadata[]>;

    /**
     * Returns the mosaic metadata given a mosaic id and metadata key.
     * @param namespaceId - Namespace identifier.
     * @param key - Metadata key.
     * @returns Observable<Metadata[]>
     */
    getNamespaceMetadataByKey(namespaceId: NamespaceId, key: string): Observable<Metadata[]>;

    /**
     * Returns the namespace metadata given a mosaic id and metadata key.
     * @param namespaceId - Namespace identifier.
     * @param key - Metadata key.
     * @param publicKey - Sender public key
     * @returns Observable<Metadata>
     */
    getNamespaceMetadataByKeyAndSender(namespaceId: NamespaceId,
                                       key: string,
                                       publicKey: string): Observable<Metadata>;
}
