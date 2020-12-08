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
import MerkleTree from 'merkletreejs';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, toArray } from 'rxjs/operators';
import { BlockRepository } from '../infrastructure/BlockRepository';
import { TransactionPaginationStreamer } from '../infrastructure/paginationStreamer/TransactionPaginationStreamer';
import { RepositoryFactory } from '../infrastructure/RepositoryFactory';
import { TransactionGroup } from '../infrastructure/TransactionGroup';
import { TransactionRepository } from '../infrastructure/TransactionRepository';
import { MerklePathItem } from '../model/blockchain/MerklePathItem';
import { MerklePosition } from '../model/blockchain/MerklePosition';
import { UInt64 } from '../model/UInt64';
import { IBlockService } from './interfaces/IBlockService';

/**
 * Block Service
 */
export class BlockService implements IBlockService {
    private readonly blockRepository: BlockRepository;
    private readonly transactionRepository: TransactionRepository;

    /**
     * Constructor
     * @param repositoryFactory
     */
    constructor(public readonly repositoryFactory: RepositoryFactory) {
        this.blockRepository = repositoryFactory.createBlockRepository();
        this.transactionRepository = repositoryFactory.createTransactionRepository();
    }

    /**
     * Validate transaction hash in block
     * @param leaf transaction hash
     * @param height block height
     */
    public validateTransactionInBlock(leaf: string, height: UInt64): Observable<boolean> {
        const rootHashObservable = this.blockRepository.getBlockByHeight(height);
        const merklePathItemObservable = this.blockRepository.getMerkleTransaction(height, leaf);
        return combineLatest([rootHashObservable, merklePathItemObservable])
            .pipe(map((combined) => this.validateInBlock(leaf, combined[1].merklePath, combined[0].blockTransactionsHash)))
            .pipe(catchError(() => of(false)));
    }

    /**
     * Validate statement hash in block
     * @param leaf statement hash
     * @param height block height
     */
    public validateStatementInBlock(leaf: string, height: UInt64): Observable<boolean> {
        const rootHashObservable = this.blockRepository.getBlockByHeight(height);
        const merklePathItemObservable = this.blockRepository.getMerkleReceipts(height, leaf);
        return combineLatest([rootHashObservable, merklePathItemObservable])
            .pipe(map((combined) => this.validateInBlock(leaf, combined[1].merklePath, combined[0].blockReceiptsHash)))
            .pipe(catchError(() => of(false)));
    }

    /**
     * Calculate transactions merkle root hash from a block
     * @param height block height
     * @returns root hash
     */
    public calculateTransactionsMerkleRootHash(height: UInt64): Observable<string> {
        const streamer = new TransactionPaginationStreamer(this.transactionRepository);
        return streamer
            .search({ group: TransactionGroup.Confirmed, height: height })
            .pipe(map((t) => ({ index: t.transactionInfo!.index, hash: t.transactionInfo!.hash })))
            .pipe(toArray())
            .pipe(map((transactions) => this.getTransacactionMerkleRoot(transactions).toUpperCase()));
    }

    /**
     * @internal
     * Validate leaf against merkle tree in block
     * @param leaf Leaf hash in merkle tree
     * @param merklePathItem Merkle path item array
     * @param rootHash Block root hash
     */
    private validateInBlock(leaf: string, merklePathItem: MerklePathItem[] = [], rootHash: string): boolean {
        if (merklePathItem.length === 0) {
            return leaf.toUpperCase() === rootHash.toUpperCase();
        }
        const rootToCompare = merklePathItem.reduce((proofHash, pathItem) => {
            const hasher = sha3_256.create();
            // Left
            if (pathItem.position !== undefined && pathItem.position === MerklePosition.Left) {
                return hasher.update(Buffer.from(pathItem.hash + proofHash, 'hex')).hex();
            } else {
                // Right
                return hasher.update(Buffer.from(proofHash + pathItem.hash, 'hex')).hex();
            }
        }, leaf);
        return rootToCompare.toUpperCase() === rootHash.toUpperCase();
    }

    /**
     * @internal
     * Create merkle root hash for block transactions
     * @param transactions Block transactions
     * @returns calculated root hash
     */
    private getTransacactionMerkleRoot(transactions: { index: number; hash: string | undefined }[]): string {
        const leaves = transactions.sort((n1, n2) => n1.index - n2.index).map((transaction) => transaction!.hash);
        const tree = new MerkleTree(leaves, sha3_256, {
            duplicateOdd: true,
            hashLeaves: false,
            sort: false,
            sortLeaves: false,
            sortPairs: false,
            isBitcoinTree: false,
        });
        return tree.getRoot().toString('hex');
    }
}
