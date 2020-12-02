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
import { Convert } from '../core/format';
import { BlockRepository, RepositoryFactory } from '../infrastructure';
import {
    AccountInfo,
    AccountRestrictions,
    HashLockInfo,
    MerkleStateInfo,
    MerkleTree,
    Metadata,
    MosaicInfo,
    MultisigAccountInfo,
    NamespaceId,
    NamespaceInfo,
    NamespaceRegistrationType,
    SecretLockInfo,
} from '../model';
import { Address } from '../model/account';
import { MosaicId } from '../model/mosaic';
import { MosaicRestriction } from '../model/restriction';
import { StateMerkleProof } from '../model/state';

/**
 * State Proof Service Interface
 */
export class StateProofService {
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
    public accountById(address: Address): Observable<StateMerkleProof> {
        const accountRepo = this.repositoryFactory.createAccountRepository();
        return accountRepo.getAccountInfo(address).pipe(mergeMap((info) => this.account(info)));
    }

    public account(info: AccountInfo): Observable<StateMerkleProof> {
        const accountRepo = this.repositoryFactory.createAccountRepository();
        return accountRepo.getAccountInfoMerkle(info.address).pipe(map((merkle) => this.toProof(info.serialize(), merkle)));
    }

    /**
     * Namespace proof can only be verified at root level
     * @param namespaceId Namepace Id.
     * @returns {Observable<StateMerkleProof>}
     */
    public namespaceById(namespaceId: NamespaceId): Observable<StateMerkleProof> {
        const namespaceRepo = this.repositoryFactory.createNamespaceRepository();
        return namespaceRepo.getNamespace(namespaceId).pipe(
            mergeMap((namespace) => {
                if (namespace.registrationType !== NamespaceRegistrationType.RootNamespace) {
                    throw new Error('Namespace proof can only be verified at root level.');
                }
                return this.namespaces(namespace);
            }),
        );
    }

    public namespaces(root: NamespaceInfo): Observable<StateMerkleProof> {
        if (root.registrationType !== NamespaceRegistrationType.RootNamespace) {
            throw new Error('Namespace proof can only be verified at root level.');
        }
        const namespaceRepo = this.repositoryFactory.createNamespaceRepository();
        return namespaceRepo
            .streamer()
            .search({ level0: root.id })
            .pipe(toArray())
            .pipe(
                mergeMap((fullPath) => {
                    return namespaceRepo.getNamespaceMerkle(root.id).pipe(
                        map((merkle) => {
                            return this.toProof(root.serialize(fullPath), merkle);
                        }),
                    );
                }),
            );
    }

    /**
     * @param mosaicId Mosaic Id.
     * @returns {Observable<StateMerkleProof>}
     */
    public mosaicById(mosaicId: MosaicId): Observable<StateMerkleProof> {
        const mosaicRepo = this.repositoryFactory.createMosaicRepository();
        return mosaicRepo.getMosaic(mosaicId).pipe(
            mergeMap((info) => {
                return this.mosaic(info);
            }),
        );
    }

    public mosaic(info: MosaicInfo): Observable<StateMerkleProof> {
        const mosaicRepo = this.repositoryFactory.createMosaicRepository();
        return mosaicRepo.getMosaicMerkle(info.id).pipe(
            map((merkle) => {
                return this.toProof(info.serialize(), merkle);
            }),
        );
    }

    /**
     * @param address Multisig account address.
     * @returns {Observable<StateMerkleProof>}
     */
    public multisigById(address: Address): Observable<StateMerkleProof> {
        const multisigRepo = this.repositoryFactory.createMultisigRepository();
        return multisigRepo.getMultisigAccountInfo(address).pipe(
            mergeMap((info) => {
                return this.multisig(info);
            }),
        );
    }

    public multisig(info: MultisigAccountInfo): Observable<StateMerkleProof> {
        const multisigRepo = this.repositoryFactory.createMultisigRepository();
        return multisigRepo.getMultisigAccountInfoMerkle(info.accountAddress).pipe(
            map((merkle) => {
                return this.toProof(info.serialize(), merkle);
            }),
        );
    }

    /**
     * @param compositeHash Composite hash.
     * @returns {Observable<StateMerkleProof>}
     */
    public secretLockById(compositeHash: string): Observable<StateMerkleProof> {
        const secretLockRepo = this.repositoryFactory.createSecretLockRepository();
        return secretLockRepo.getSecretLock(compositeHash).pipe(
            mergeMap((info) => {
                return this.secretLock(info);
            }),
        );
    }

    public secretLock(info: SecretLockInfo): Observable<StateMerkleProof> {
        const secretLockRepo = this.repositoryFactory.createSecretLockRepository();
        return secretLockRepo.getSecretLockMerkle(info.compositeHash).pipe(
            map((merkle) => {
                return this.toProof(info.serialize(), merkle);
            }),
        );
    }

    /**
     * @param hash hashs.
     * @returns {Observable<StateMerkleProof>}
     */
    public hashLockById(hash: string): Observable<StateMerkleProof> {
        const hashLockRepo = this.repositoryFactory.createHashLockRepository();
        return hashLockRepo.getHashLock(hash).pipe(mergeMap((info) => this.hashLock(info)));
    }

    public hashLock(info: HashLockInfo): Observable<StateMerkleProof> {
        const hashLockRepo = this.repositoryFactory.createHashLockRepository();
        return hashLockRepo.getHashLockMerkle(info.hash).pipe(
            map((merkle) => {
                return this.toProof(info.serialize(), merkle);
            }),
        );
    }

    /**
     * @param address Address.
     * @returns {Observable<StateMerkleProof>}
     */
    public accountRestrictionById(address: Address): Observable<StateMerkleProof> {
        const restrictionRepo = this.repositoryFactory.createRestrictionAccountRepository();
        return restrictionRepo.getAccountRestrictions(address).pipe(
            mergeMap((info) => {
                return restrictionRepo.getAccountRestrictionsMerkle(address).pipe(
                    map((merkle) => {
                        return this.toProof(info.serialize(), merkle);
                    }),
                );
            }),
        );
    }

    public accountRestriction(info: AccountRestrictions): Observable<StateMerkleProof> {
        const restrictionRepo = this.repositoryFactory.createRestrictionAccountRepository();
        return restrictionRepo.getAccountRestrictionsMerkle(info.address).pipe(
            map((merkle) => {
                return this.toProof(info.serialize(), merkle);
            }),
        );
    }
    /**
     * @param compositeHash Composite hash.
     * @returns {Observable<StateMerkleProof>}
     */
    public mosaicRestrictionById(compositeHash: string): Observable<StateMerkleProof> {
        const restrictionRepo = this.repositoryFactory.createRestrictionMosaicRepository();
        return restrictionRepo.getMosaicRestrictions(compositeHash).pipe(mergeMap((info) => this.mosaicRestriction(info)));
    }

    public mosaicRestriction(info: MosaicRestriction): Observable<StateMerkleProof> {
        const restrictionRepo = this.repositoryFactory.createRestrictionMosaicRepository();
        return restrictionRepo
            .getMosaicRestrictionsMerkle(info.compositeHash)
            .pipe(map((merkle) => this.toProof(info.serialize(), merkle)));
    }

    /**
     * @param compositeHash Composite hash.
     * @returns {Observable<StateMerkleProof>}
     */
    public metadataById(compositeHash: string): Observable<StateMerkleProof> {
        const metaDataRepo = this.repositoryFactory.createMetadataRepository();
        return metaDataRepo.getMetadata(compositeHash).pipe(mergeMap((info) => this.metadata(info)));
    }

    public metadata(info: Metadata): Observable<StateMerkleProof> {
        const metaDataRepo = this.repositoryFactory.createMetadataRepository();
        return metaDataRepo
            .getMetadataMerkle(info.metadataEntry.compositeHash)
            .pipe(map((merkle) => this.toProof(info.metadataEntry.serialize(), merkle)));
    }

    private toProof(serialized: Uint8Array, merkle: MerkleStateInfo): StateMerkleProof {
        const hash = Convert.uint8ToHex(serialized);
        const stateHash = sha3_256.create().update(Convert.hexToUint8(hash)).hex().toUpperCase();
        const valid = stateHash === merkle.tree.leaf?.value;
        return new StateMerkleProof(stateHash, merkle.tree, this.getRootHash(merkle.tree), merkle.tree.leaf?.value, valid);
    }

    private getRootHash(tree: MerkleTree): string {
        return tree.branches.length ? tree.branches[0].branchHash : tree?.leaf!.leafHash;
    }
}
