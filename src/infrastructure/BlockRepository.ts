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
import { UInt64 } from '../model';
import { BlockInfo, MerkleProofInfo } from '../model/blockchain';
import { SearcherRepository } from './paginationStreamer';
import { BlockSearchCriteria } from './searchCriteria';

/**
 * Blockchain interface repository.
 *
 * @since 1.0
 */
export interface BlockRepository extends SearcherRepository<BlockInfo, BlockSearchCriteria> {
    /**
     * Gets a BlockInfo for a given block height
     * @param height - Block height
     * @returns Observable<BlockInfo>
     */
    getBlockByHeight(height: UInt64): Observable<BlockInfo>;

    /**
     * Get the merkle path for a given a transaction and block
     * Returns the merkle path for a [transaction](https://nemtech.github.io/concepts/transaction.html)
     * included in a block. The path is the complementary data needed to calculate the merkle root.
     * A client can compare if the calculated root equals the one recorded in the block header,
     * verifying that the transaction was included in the block.
     * @param height The height of the block.
     * @param hash The hash of the transaction.
     * @return Observable<MerkleProofInfo>
     */
    getMerkleTransaction(height: UInt64, hash: string): Observable<MerkleProofInfo>;

    /**
     * Get the merkle path for a given a receipt statement hash and block
     * Returns the merkle path for a [receipt statement or resolution](https://nemtech.github.io/concepts/receipt.html)
     * linked to a block. The path is the complementary data needed to calculate the merkle root.
     * A client can compare if the calculated root equals the one recorded in the block header,
     * verifying that the receipt was linked with the block.
     * @param height The height of the block.
     * @param hash The hash of the receipt statement or resolution.
     * @return Observable<MerkleProofInfo>
     */
    getMerkleReceipts(height: UInt64, hash: string): Observable<MerkleProofInfo>;
}
