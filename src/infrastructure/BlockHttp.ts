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

import { from as observableFrom, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PublicAccount } from '../model/account/PublicAccount';
import { BlockInfo } from '../model/blockchain/BlockInfo';
import { MerklePathItem } from '../model/blockchain/MerklePathItem';
import { MerkleProofInfo } from '../model/blockchain/MerkleProofInfo';
import { Transaction } from '../model/transaction/Transaction';
import { UInt64 } from '../model/UInt64';
import { BlockInfoDTO, BlockRoutesApi } from './api';
import { BlockRepository } from './BlockRepository';
import { Http } from './Http';
import { QueryParams } from './QueryParams';
import {
    CreateTransactionFromDTO,
    extractBeneficiary,
} from './transaction/CreateTransactionFromDTO';

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
    private readonly blockRoutesApi: BlockRoutesApi;

    /**
     * Constructor
     * @param url
     */
    constructor(url: string) {
        super(url);
        this.blockRoutesApi = new BlockRoutesApi(url);
    }

    /**
     * Gets a BlockInfo for a given block height
     * @param height - Block height
     * @returns Observable<BlockInfo>
     */
    public getBlockByHeight(height: string): Observable<BlockInfo> {
        return observableFrom(this.blockRoutesApi.getBlockByHeight(height)).pipe(
            map(({body}) => this.toBlockInfo(body)),
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
     * @param limit - Number of blocks returned.
     * @returns Observable<BlockInfo[]>
     */
    public getBlocksByHeightWithLimit(height: string, limit: number): Observable<BlockInfo[]> {
        return observableFrom(
            this.blockRoutesApi.getBlocksByHeightWithLimit(height, limit)).pipe(
                map(({body}) => body.map((blockDTO) => this.toBlockInfo(blockDTO))),
                catchError((error) =>  throwError(this.errorHandling(error))),
        );
    }

    /**
     * This method maps a BlockInfoDTO from rest to the SDK's BlockInfo model object.
     *
     * @internal
     * @param {BlockInfoDTO} dto the dto object from rest.
     * @returns {BlockInfo} a BlockInfo model
     */
    private toBlockInfo(dto: BlockInfoDTO): BlockInfo {
        const networkType = dto.block.network.valueOf();
        return new BlockInfo(
            dto.meta.hash,
            dto.meta.generationHash,
            UInt64.fromNumericString(dto.meta.totalFee),
            dto.meta.numTransactions,
            dto.block.signature,
            PublicAccount.createFromPublicKey(dto.block.signerPublicKey, networkType),
            networkType,
            dto.block.version,
            dto.block.type,
            UInt64.fromNumericString(dto.block.height),
            UInt64.fromNumericString(dto.block.timestamp),
            UInt64.fromNumericString(dto.block.difficulty),
            dto.block.feeMultiplier,
            dto.block.previousBlockHash,
            dto.block.transactionsHash,
            dto.block.receiptsHash,
            dto.block.stateHash,
            extractBeneficiary(dto, networkType),
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
