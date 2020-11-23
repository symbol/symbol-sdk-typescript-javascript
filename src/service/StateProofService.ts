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

import { sha3_256 } from 'js-sha3';
import { Observable } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { Convert } from '../core/format/Convert';
import { NamespacePaginationStreamer } from '../infrastructure/paginationStreamer/NamespacePaginationStreamer';
import { RepositoryFactory } from '../infrastructure/RepositoryFactory';
import { NamespaceId, NamespaceRegistrationType } from '../model';
import { Address } from '../model/account/Address';
import { MosaicId } from '../model/mosaic/MosaicId';
import { StateMerkleProof } from '../model/state/StateMerkleProof';

/**
 * State Proof Service Interface
 */
export class StateProofService {
    private readonly version = '0100'; // TODO: to add version in catbuffer
    /**
     * Constructor
     * @param repositoryFactory
     */
    constructor(private readonly repositoryFactory: RepositoryFactory) {}

    /**
     * @param address Account address.
     * @returns {Observable<StateMerkleProof>}
     */
    public accountProof(address: Address): Observable<StateMerkleProof | undefined> {
        const accountRepo = this.repositoryFactory.createAccountRepository();
        return accountRepo.getAccountInfo(address).pipe(
            mergeMap((info) => {
                return accountRepo.getAccountsInfoMerkle(address).pipe(
                    map((merkle) => {
                        const hash = this.version + Convert.uint8ToHex(info.serialize());
                        const stateHash = sha3_256.create().update(Convert.hexToUint8(hash)).hex().toUpperCase();
                        if (stateHash === merkle.tree.leaf.value) {
                            return new StateMerkleProof(stateHash, merkle.tree, merkle.tree.branches[0].branchHash);
                        }
                    }),
                );
            }),
        );
    }

    /**
     * @param namespaceId Namepace Id.
     * @returns {Observable<StateMerkleProof>}
     */
    public namespaceProof(namespaceId: NamespaceId): Observable<StateMerkleProof | undefined> {
        const namespaceRepo = this.repositoryFactory.createNamespaceRepository();
        const streamer = new NamespacePaginationStreamer(namespaceRepo);
        return namespaceRepo.getNamespace(namespaceId).pipe(
            mergeMap((root) => {
                return streamer
                    .search({ level0: namespaceId, registrationType: NamespaceRegistrationType.SubNamespace })
                    .pipe(toArray())
                    .pipe(
                        mergeMap((children) => {
                            return namespaceRepo.getNamespaceMerkle(namespaceId).pipe(
                                map((merkle) => {
                                    const hash = this.version + Convert.uint8ToHex(root.serialize(children));
                                    const stateHash = sha3_256.create().update(Convert.hexToUint8(hash)).hex().toUpperCase();
                                    //TODO: serialization seems not correct
                                    if (stateHash === merkle.tree.leaf.value) {
                                        return new StateMerkleProof(stateHash, merkle.tree, merkle.tree.branches[0].branchHash);
                                    }
                                }),
                            );
                        }),
                    );
            }),
        );
    }

    /**
     * @param mosaicId Mosaic Id.
     * @returns {Observable<StateMerkleProof>}
     */
    public mosaicProof(mosaicId: MosaicId): Observable<StateMerkleProof | undefined> {
        const mosaicRepo = this.repositoryFactory.createMosaicRepository();
        return mosaicRepo.getMosaic(mosaicId).pipe(
            mergeMap((info) => {
                return mosaicRepo.getMosaicMerkle(mosaicId).pipe(
                    map((merkle) => {
                        const hash = this.version + Convert.uint8ToHex(info.serialize());
                        const stateHash = sha3_256.create().update(Convert.hexToUint8(hash)).hex().toUpperCase();
                        if (stateHash === merkle.tree.leaf.value) {
                            return new StateMerkleProof(stateHash, merkle.tree, merkle.tree.branches[0].branchHash);
                        }
                    }),
                );
            }),
        );
    }

    /**
     * @param address Multisig account address.
     * @returns {Observable<StateMerkleProof>}
     */
    public multisigProof(address: Address): Observable<StateMerkleProof | undefined> {
        const multisigRepo = this.repositoryFactory.createMultisigRepository();
        return multisigRepo.getMultisigAccountInfo(address).pipe(
            mergeMap((info) => {
                return multisigRepo.getMultisigAccountInfoMerkle(address).pipe(
                    map((merkle) => {
                        const hash = this.version + Convert.uint8ToHex(info.serialize());
                        const stateHash = sha3_256.create().update(Convert.hexToUint8(hash)).hex().toUpperCase();
                        console.log(stateHash);
                        if (stateHash === merkle.tree.leaf.value) {
                            return new StateMerkleProof(stateHash, merkle.tree, merkle.tree.branches[0].branchHash);
                        }
                    }),
                );
            }),
        );
    }

    // /**
    //  * @param compositeHash Composite hash.
    //  * @returns {Observable<StateMerkleProof>}
    //  */
    // public hashLockProof(compositeHash: string): Observable<StateMerkleProof>;

    // /**
    //  * @param compositeHash Composite hash.
    //  * @returns {Observable<StateMerkleProof>}
    //  */
    // public secretLockProof(compositeHash: string): Observable<StateMerkleProof>;

    // /**
    //  * @param address Account address.
    //  * @returns {Observable<StateMerkleProof>}
    //  */
    // public propertyProof(): Observable<StateMerkleProof>;
}
