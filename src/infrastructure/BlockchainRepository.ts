/*
 * Copyright 2018 NEM
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
import {BlockchainScore} from '../model/blockchain/BlockchainScore';
import {BlockchainStorageInfo} from '../model/blockchain/BlockchainStorageInfo';
import {BlockInfo} from '../model/blockchain/BlockInfo';
import { Receipt } from '../model/receipt/Receipt';
import {Transaction} from '../model/transaction/Transaction';
import {UInt64} from '../model/UInt64';
import {QueryParams} from './QueryParams';

/**
 * Blockchain interface repository.
 *
 * @since 1.0
 */
export interface BlockchainRepository {

    /**
     * Gets a BlockInfo for a given block height
     * @param height - Block height
     * @returns Observable<BlockInfo>
     */
    getBlockByHeight(height: number): Observable<BlockInfo>;

    /**
     * Gets array of transactions included in a block for a block height
     * @param height - Block height
     * @param queryParams - (Optional) Query params
     * @returns Observable<Transaction[]>
     */
    getBlockTransactions(height: number,
                         queryParams?: QueryParams): Observable<Transaction[]>;

    /**
     * Gets array of BlockInfo for a block height with limit
     * @param height - Block height from which will be the first block in the array
     * @param limit - Number of blocks returned
     * @returns Observable<BlockInfo[]>
     */
    getBlocksByHeightWithLimit(height: number, limit: number): Observable<BlockInfo[]>;

    /**
     * Gets current blockchain height
     * @returns Observable<UInt64>
     */
    getBlockchainHeight(): Observable<UInt64>;

    /**
     * Gets current blockchain score
     * @returns Observable<BlockchainScore>
     */
    getBlockchainScore(): Observable<BlockchainScore>;

    /**
     * Gets blockchain storage info.
     * @returns Observable<BlockchainStorageInfo>
     */
    getDiagnosticStorage(): Observable<BlockchainStorageInfo>;

    /**
     * Gets list of receipts for a block height
     * @returns Observable<Receipt[]>
     */
   // getReceipts(height: number): Observable<Receipt[]>;
}
