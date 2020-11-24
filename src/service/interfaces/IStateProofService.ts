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
import { Address } from '../../model/account/Address';
import { MosaicId } from '../../model/mosaic/MosaicId';
import { NamespaceId } from '../../model/namespace/NamespaceId';
import { StateMerkleProof } from '../../model/state/StateMerkleProof';

/**
 * State Proof Service Interface
 */
export interface IStateProofService {
    /**
     * @param address Account address.
     * @returns {Observable<StateMerkleProof | undefined>}
     */
    accountProof(address: Address): Observable<StateMerkleProof | undefined>;

    /**
     * @param namespaceId Namepace Id.
     * @returns {Observable<StateMerkleProof | undefined>}
     */
    namespaceProof(namespaceId: NamespaceId): Observable<StateMerkleProof | undefined>;

    /**
     * @param mosaicId Mosaic Id.
     * @returns {Observable<StateMerkleProof | undefined>}
     */
    mosaicProof(mosaicId: MosaicId): Observable<StateMerkleProof | undefined>;

    /**
     * @param hash Hash.
     * @returns {Observable<StateMerkleProof | undefined>}
     */
    hashLockProof(hash: string): Observable<StateMerkleProof | undefined>;

    /**
     * @param compositeHash Composite hash.
     * @returns {Observable<StateMerkleProof | undefined>}
     */
    secretLockProof(compositeHash: string): Observable<StateMerkleProof | undefined>;

    /**
     * @param address Address.
     * @returns {Observable<StateMerkleProof>}
     */

    accountRestrictionProof(address: Address): Observable<StateMerkleProof | undefined>;
    /**
     * @param compositeHash Composite hash.
     * @returns {Observable<StateMerkleProof>}
     */
    mosaicRestrictionProof(compositeHash: string): Observable<StateMerkleProof | undefined>;

    /**
     * @param compositeHash Composite hash.
     * @returns {Observable<StateMerkleProof>}
     */
    metadataProof(compositeHash: string): Observable<StateMerkleProof | undefined>;
}
