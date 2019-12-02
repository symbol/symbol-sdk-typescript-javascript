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

import {from as observableFrom, Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {PublicAccount} from '../model/account/PublicAccount';
import {BlockInfo} from '../model/blockchain/BlockInfo';
import { MerklePathItem } from '../model/blockchain/MerklePathItem';
import { MerkleProofInfo } from '../model/blockchain/MerkleProofInfo';
import { NetworkType } from '../model/blockchain/NetworkType';
import {Transaction} from '../model/transaction/Transaction';
import {UInt64} from '../model/UInt64';
import { BlockRoutesApi } from './api';
import {BlockRepository} from './BlockRepository';
import {Http} from './Http';
import {QueryParams} from './QueryParams';
import {CreateTransactionFromDTO, extractBeneficiary} from './transaction/CreateTransactionFromDTO';

/**
 * Blocks returned limits:
 * N_25: 25 blocks.
 * N_50: 50 blocks.
 * N_75: 75 blocks.
 * N_100: 100 blocks.
 */
export enum LimitType {
    N_25 = 25,
    N_50 = 50,
    N_75 = 75,
    N_100 = 100,

}
/**
 * Blockchain http repository.
 *
 * @since 1.0
 */
export class BlockHttp extends Http implements BlockRepository {
    /**
     * @internal
     * Nem2 Library block routes api
     */
    private blockRoutesApi: BlockRoutesApi;

    /**
     * Constructor
     * @param url
     * @param networkType
     */
    constructor(url: string, networkType?: NetworkType) {
        super(url, networkType);
        this.blockRoutesApi = new BlockRoutesApi(url);
    }

    /**
     * Gets a BlockInfo for a given block height
     * @param height - Block height
     * @returns Observable<BlockInfo>
     */
    public getBlockByHeight(height: string): Observable<BlockInfo> {
        return observableFrom(this.blockRoutesApi.getBlockByHeight(height)).pipe(
            map(({body}) => {
                const blockDTO = body;
                const networkType = parseInt((blockDTO.block.version as number).toString(16).substr(0, 2), 16);
                return new BlockInfo(
                    blockDTO.meta.hash,
                    blockDTO.meta.generationHash,
                    UInt64.fromNumericString(blockDTO.meta.totalFee),
                    blockDTO.meta.numTransactions,
                    blockDTO.block.signature,
                    PublicAccount.createFromPublicKey(blockDTO.block.signerPublicKey, networkType),
                    networkType,
                    parseInt((blockDTO.block.version as number).toString(16).substr(2, 2), 16), // Tx version
                    blockDTO.block.type,
                    UInt64.fromNumericString(blockDTO.block.height),
                    UInt64.fromNumericString(blockDTO.block.timestamp),
                    UInt64.fromNumericString(blockDTO.block.difficulty),
                    blockDTO.block.feeMultiplier,
                    blockDTO.block.previousBlockHash,
                    blockDTO.block.transactionsHash,
                    blockDTO.block.receiptsHash,
                    blockDTO.block.stateHash,
                    extractBeneficiary(blockDTO, networkType),
                );
            }),
            catchError((error) =>  throwError(this.errorHandling(error))),
        );
    }

    /**
     * Gets array of transactions included in a block for a block height
     * @param height - Block height
     * @param queryParams - (Optional) Query params
     * @returns Observable<Transaction[]>
     */
    public getBlockTransactions(height: string,
                                queryParams?: QueryParams): Observable<Transaction[]> {
        return observableFrom(
            this.blockRoutesApi.getBlockTransactions(height,
                                                     this.queryParams(queryParams).pageSize,
                                                     this.queryParams(queryParams).id,
                                                     this.queryParams(queryParams).order))
                .pipe(map(({body}) => body.map((transactionDTO) => {
                        return CreateTransactionFromDTO(transactionDTO);
                    })),
                catchError((error) =>  throwError(this.errorHandling(error))),
        );
    }

    /**
     * Gets array of BlockInfo for a block height with limit
     * @param height - Block height from which will be the first block in the array
     * @param limit - Number of blocks returned. Limit value only available in 25, 50. 75 and 100. (default 25)
     * @returns Observable<BlockInfo[]>
     */
    public getBlocksByHeightWithLimit(height: string, limit: LimitType = LimitType.N_25): Observable<BlockInfo[]> {
        return observableFrom(
            this.blockRoutesApi.getBlocksByHeightWithLimit(height, limit)).pipe(
                map(({body}) => body.map((blockDTO) => {
                        const networkType = parseInt((blockDTO.block.version as number).toString(16).substr(0, 2), 16);
                        return new BlockInfo(
                            blockDTO.meta.hash,
                            blockDTO.meta.generationHash,
                            UInt64.fromNumericString(blockDTO.meta.totalFee),
                            blockDTO.meta.numTransactions,
                            blockDTO.block.signature,
                            PublicAccount.createFromPublicKey(blockDTO.block.signerPublicKey, networkType),
                            networkType,
                            parseInt((blockDTO.block.version as number).toString(16).substr(2, 2), 16), // Tx version
                            blockDTO.block.type,
                            UInt64.fromNumericString(blockDTO.block.height),
                            UInt64.fromNumericString(blockDTO.block.timestamp),
                            UInt64.fromNumericString(blockDTO.block.difficulty),
                            blockDTO.block.feeMultiplier,
                            blockDTO.block.previousBlockHash,
                            blockDTO.block.transactionsHash,
                            blockDTO.block.receiptsHash,
                            blockDTO.block.stateHash,
                            extractBeneficiary(blockDTO, networkType),
                        );
                    })),
                catchError((error) =>  throwError(this.errorHandling(error))),
        );
    }

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
    public getMerkleTransaction(height: string, hash: string): Observable<MerkleProofInfo> {
        return observableFrom(
            this.blockRoutesApi.getMerkleTransaction(height, hash)).pipe(
                map(({body}) => new MerkleProofInfo(
                        body.merklePath!.map((payload) => new MerklePathItem(payload.position, payload.hash)),
                    )),
                catchError((error) =>  throwError(this.errorHandling(error))),
        );
    }
}
