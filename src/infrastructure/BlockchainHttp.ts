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

import {BlockchainRoutesApi} from 'nem2-library';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {PublicAccount} from '../model/account/PublicAccount';
import {BlockchainScore} from '../model/blockchain/BlockchainScore';
import {BlockchainStorageInfo} from '../model/blockchain/BlockchainStorageInfo';
import {BlockInfo} from '../model/blockchain/BlockInfo';
import {Transaction} from '../model/transaction/Transaction';
import {UInt64} from '../model/UInt64';
import {BlockchainRepository} from './BlockchainRepository';
import {Http} from './Http';
import {QueryParams} from './QueryParams';
import {CreateTransactionFromDTO} from './transaction/CreateTransactionFromDTO';

/**
 * Blockchain http repository.
 *
 * @since 1.0
 */
export class BlockchainHttp extends Http implements BlockchainRepository {
    /**
     * @internal
     * Nem2 Library blockchain routes api
     */
    private blockchainRoutesApi: BlockchainRoutesApi;

    /**
     * Constructor
     * @param url
     */
    constructor(url: string) {
        super(url);
        this.blockchainRoutesApi = new BlockchainRoutesApi(this.apiClient);
    }

    /**
     * Gets a BlockInfo for a given block height
     * @param height - Block height
     * @returns Observable<BlockInfo>
     */
    public getBlockByHeight(height: number): Observable<BlockInfo> {
        return Observable.fromPromise(this.blockchainRoutesApi.getBlockByHeight(height)).map((blockDTO) => {
            const networkType = parseInt(blockDTO.block.version.toString(16).substr(0, 2), 16);
            return new BlockInfo(
                blockDTO.meta.hash,
                blockDTO.meta.generationHash,
                new UInt64(blockDTO.meta.totalFee),
                blockDTO.meta.numTransactions,
                blockDTO.block.signature,
                PublicAccount.createFromPublicKey(blockDTO.block.signer, networkType),
                networkType,
                parseInt(blockDTO.block.version.toString(16).substr(2, 2), 16), // Tx version
                blockDTO.block.type,
                new UInt64(blockDTO.block.height),
                new UInt64(blockDTO.block.timestamp),
                new UInt64(blockDTO.block.difficulty),
                blockDTO.block.previousBlockHash,
                blockDTO.block.blockTransactionsHash,
            );
        });
    }

    /**
     * Gets array of transactions included in a block for a block height
     * @param height - Block height
     * @param queryParams - (Optional) Query params
     * @returns Observable<Transaction[]>
     */
    public getBlockTransactions(height: number,
                                queryParams?: QueryParams): Observable<Transaction[]> {
        return Observable.fromPromise(
            this.blockchainRoutesApi.getBlockTransactions(height, queryParams != null ? queryParams : {})).map((transactionsDTO) => {
            return transactionsDTO.map((transactionDTO) => {
                return CreateTransactionFromDTO(transactionDTO);
            });
        });
    }

    /**
     * Gets array of BlockInfo for a block height with limit
     * @param height - Block height from which will be the first block in the array
     * @param limit - Number of blocks returned
     * @returns Observable<BlockInfo[]>
     */
    public getBlocksByHeightWithLimit(height: number, limit: number = 1): Observable<BlockInfo[]> {
        return Observable.fromPromise(
            this.blockchainRoutesApi.getBlocksByHeightWithLimit(height, limit)).map((blocksDTO) => {
            return blocksDTO.map((blockDTO) => {
                const networkType = parseInt(blockDTO.block.version.toString(16).substr(0, 2), 16);
                return new BlockInfo(
                    blockDTO.meta.hash,
                    blockDTO.meta.generationHash,
                    new UInt64(blockDTO.meta.totalFee),
                    blockDTO.meta.numTransactions,
                    blockDTO.block.signature,
                    PublicAccount.createFromPublicKey(blockDTO.block.signer, networkType),
                    networkType,
                    parseInt(blockDTO.block.version.toString(16).substr(2, 2), 16), // Tx version
                    blockDTO.block.type,
                    new UInt64(blockDTO.block.height),
                    new UInt64(blockDTO.block.timestamp),
                    new UInt64(blockDTO.block.difficulty),
                    blockDTO.block.previousBlockHash,
                    blockDTO.block.blockTransactionsHash,
                );
            });
        });
    }

    /**
     * Gets current blockchain height
     * @returns Observable<UInt64>
     */
    public getBlockchainHeight(): Observable<UInt64> {
        return Observable.fromPromise(this.blockchainRoutesApi.getBlockchainHeight()).map((heightDTO) => {
            return new UInt64(heightDTO.height);
        });
    }

    /**
     * Gets current blockchain score
     * @returns Observable<BlockchainScore>
     */
    public getBlockchainScore(): Observable<BlockchainScore> {
        return Observable.fromPromise(this.blockchainRoutesApi.getBlockchainScore()).map((blockchainScoreDTO) => {
            return new BlockchainScore(
                new UInt64(blockchainScoreDTO.scoreLow),
                new UInt64(blockchainScoreDTO.scoreHigh),
            );
        });
    }

    /**
     * Gets blockchain storage info.
     * @returns Observable<BlockchainStorageInfo>
     */
    public getDiagnosticStorage(): Observable<BlockchainStorageInfo> {
        return Observable.fromPromise(
            this.blockchainRoutesApi.getDiagnosticStorage()).map((blockchainStorageInfoDTO) => {
            return new BlockchainStorageInfo(
                blockchainStorageInfoDTO.numBlocks,
                blockchainStorageInfoDTO.numTransactions,
                blockchainStorageInfoDTO.numAccounts,
            );
        });
    }
}
