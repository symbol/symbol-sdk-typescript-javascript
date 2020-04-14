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
import { MerkleProofInfo } from '../model/blockchain/MerkleProofInfo';
import { Statement } from '../model/receipt/Statement';

/**
 * Receipt interface repository.
 *
 * @since 1.0
 */
export interface ReceiptRepository {
    /**
     * Get receipts from a block
     * Returns the receipts linked to a block.
     * @param {BigInt} height The height of the block.
     * @return Observable<Statement>
     */
    getBlockReceipts(height: bigint): Observable<Statement>;

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
    getMerkleReceipts(height: bigint, hash: string): Observable<MerkleProofInfo>;
}
