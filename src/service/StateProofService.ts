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
import { catchError, map, mergeMap, toArray } from 'rxjs/operators';
import { Convert } from '../core/format/Convert';
import { BlockRepository } from '../infrastructure/BlockRepository';
import { Http } from '../infrastructure/Http';
import { NamespacePaginationStreamer } from '../infrastructure/paginationStreamer/NamespacePaginationStreamer';
import { RepositoryFactory } from '../infrastructure/RepositoryFactory';
import { MerkleTree, NamespaceId, NamespaceRegistrationType } from '../model';
import { Address } from '../model/account/Address';
import { MosaicId } from '../model/mosaic/MosaicId';
import { StateMerkleProof } from '../model/state/StateMerkleProof';

/**
 * State Proof Service Interface
 */
export class StateProofService {
    private readonly version = '0100'; // TODO: to add version in catbuffer
    private blockRepo: BlockRepository;
    /**
     * Constructor
     * @param repositoryFactory
     */
    constructor(private readonly repositoryFactory: RepositoryFactory) {
        this.blockRepo = repositoryFactory.createBlockRepository();
    }

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
                        if (stateHash === merkle.tree.leaf?.value) {
                            return new StateMerkleProof(stateHash, merkle.tree, this.getRootHash(merkle.tree));
                        }
                    }),
                );
            }),
            catchError(Http.errorHandling),
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
                                    if (stateHash === merkle.tree.leaf?.value) {
                                        return new StateMerkleProof(stateHash, merkle.tree, this.getRootHash(merkle.tree));
                                    }
                                }),
                            );
                        }),
                    );
            }),
            catchError(Http.errorHandling),
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
                        if (stateHash === merkle.tree.leaf?.value) {
                            return new StateMerkleProof(stateHash, merkle.tree, this.getRootHash(merkle.tree));
                        }
                    }),
                );
            }),
            catchError(Http.errorHandling),
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
                        if (stateHash === merkle.tree.leaf?.value) {
                            return new StateMerkleProof(stateHash, merkle.tree, this.getRootHash(merkle.tree));
                        }
                    }),
                );
            }),
            catchError(Http.errorHandling),
        );
    }

    /**
     * @param compositeHash Composite hash.
     * @returns {Observable<StateMerkleProof>}
     */
    public secretLockProof(compositeHash: string): Observable<StateMerkleProof | undefined> {
        const secretLockRepo = this.repositoryFactory.createSecretLockRepository();
        return secretLockRepo.getSecretLock(compositeHash).pipe(
            mergeMap((info) => {
                return secretLockRepo.getSecretLockMerkle(compositeHash).pipe(
                    map((merkle) => {
                        const hash = this.version + Convert.uint8ToHex(info.serialize());
                        const stateHash = sha3_256.create().update(Convert.hexToUint8(hash)).hex().toUpperCase();
                        if (stateHash === merkle.tree.leaf?.value) {
                            return new StateMerkleProof(stateHash, merkle.tree, this.getRootHash(merkle.tree));
                        }
                    }),
                );
            }),
            catchError(Http.errorHandling),
        );
    }

    /**
     * @param hash hashs.
     * @returns {Observable<StateMerkleProof>}
     */
    public hashLockProof(hash: string): Observable<StateMerkleProof | undefined> {
        const hashLockRepo = this.repositoryFactory.createHashLockRepository();
        return hashLockRepo.getHashLock(hash).pipe(
            mergeMap((info) => {
                return hashLockRepo.getHashLockMerkle(hash).pipe(
                    map((merkle) => {
                        const hash = this.version + Convert.uint8ToHex(info.serialize());
                        const stateHash = sha3_256.create().update(Convert.hexToUint8(hash)).hex().toUpperCase();
                        if (stateHash === merkle.tree.leaf?.value) {
                            return new StateMerkleProof(stateHash, merkle.tree, this.getRootHash(merkle.tree));
                        }
                    }),
                );
            }),
            catchError(Http.errorHandling),
        );
    }

    /**
     * @param address Address.
     * @returns {Observable<StateMerkleProof>}
     */
    public accountRestrictionProof(address: Address): Observable<StateMerkleProof | undefined> {
        const restrictionRepo = this.repositoryFactory.createRestrictionAccountRepository();
        return restrictionRepo.getAccountRestrictions(address).pipe(
            mergeMap((info) => {
                return restrictionRepo.getAccountRestrictionsMerkle(address).pipe(
                    map((merkle) => {
                        const hash = this.version + Convert.uint8ToHex(info.serialize());
                        const stateHash = sha3_256.create().update(Convert.hexToUint8(hash)).hex().toUpperCase();
                        if (stateHash === merkle.tree.leaf?.value) {
                            return new StateMerkleProof(stateHash, merkle.tree, this.getRootHash(merkle.tree));
                        }
                    }),
                );
            }),
            catchError(Http.errorHandling),
        );
    }
    /**
     * @param compositeHash Composite hash.
     * @returns {Observable<StateMerkleProof>}
     */
    public mosaicRestrictionProof(compositeHash: string): Observable<StateMerkleProof | undefined> {
        const restrictionRepo = this.repositoryFactory.createRestrictionMosaicRepository();
        return restrictionRepo.getMosaicRestrictions(compositeHash).pipe(
            mergeMap((info) => {
                return restrictionRepo.getMosaicRestrictionsMerkle(compositeHash).pipe(
                    map((merkle) => {
                        const hash = this.version + Convert.uint8ToHex(info.serialize());
                        const stateHash = sha3_256.create().update(Convert.hexToUint8(hash)).hex().toUpperCase();
                        if (stateHash === merkle.tree.leaf?.value) {
                            return new StateMerkleProof(stateHash, merkle.tree, this.getRootHash(merkle.tree));
                        }
                    }),
                );
            }),
            catchError(Http.errorHandling),
        );
    }

    /**
     * @param compositeHash Composite hash.
     * @returns {Observable<StateMerkleProof>}
     */
    public metadataProof(compositeHash: string): Observable<StateMerkleProof | undefined> {
        const metaDataRepo = this.repositoryFactory.createMetadataRepository();
        return metaDataRepo.getMetadata(compositeHash).pipe(
            mergeMap((info) => {
                return metaDataRepo.getMetadataMerkle(compositeHash).pipe(
                    map((merkle) => {
                        const hash = this.version + Convert.uint8ToHex(info.metadataEntry.serialize());
                        const stateHash = sha3_256.create().update(Convert.hexToUint8(hash)).hex().toUpperCase();
                        if (stateHash === merkle.tree.leaf?.value) {
                            return new StateMerkleProof(stateHash, merkle.tree, this.getRootHash(merkle.tree));
                        }
                    }),
                );
            }),
            catchError(Http.errorHandling),
        );
    }

    /**
     * Get merkle tree root hash
     * @param tree merkle tree
     * @returns {string} root hash
     */
    private getRootHash(tree: MerkleTree): string {
        return tree.branches.length ? tree.branches[0].branchHash : tree.leaf!.leafHash;
    }
}
