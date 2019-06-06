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

import {from as observableFrom, Observable} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';
import {PublicAccount} from '../model/account/PublicAccount';
import {BlockInfo} from '../model/blockchain/BlockInfo';
import { MerklePathItem } from '../model/blockchain/MerklePathItem';
import { MerkleProofInfo } from '../model/blockchain/MerkleProofInfo';
import { MerkleProofInfoPayload } from '../model/blockchain/MerkleProofInfoPayload';
import { Statement } from '../model/receipt/Statement';
import {Transaction} from '../model/transaction/Transaction';
import {UInt64} from '../model/UInt64';
import {BlockRepository} from './BlockRepository';
import {Http} from './Http';
import { NetworkHttp } from './NetworkHttp';
import {QueryParams} from './QueryParams';
import { CreateStatementFromDTO } from './receipt/CreateReceiptFromDTO';
import {CreateTransactionFromDTO, extractBeneficiary} from './transaction/CreateTransactionFromDTO';

/**
 * Blockchain http repository.
 *
 * @since 1.0
 */
export class BlockHttp extends Http implements BlockRepository {

    /**
     * Constructor
     * @param url
     */
    constructor(url: string, networkHttp?: NetworkHttp) {
        networkHttp = networkHttp == null ? new NetworkHttp(url) : networkHttp;
        super(url, networkHttp);
    }

    /**
     * Gets a BlockInfo for a given block height
     * @param height - Block height
     * @returns Observable<BlockInfo>
     */
    public getBlockByHeight(height: number): Observable<BlockInfo> {
        const postBody = null;

        // verify the required parameter 'height' is set
        if (height === undefined || height === null) {
            throw new Error('Missing the required parameter \'height\' when calling getBlockByHeight');
        }

        const pathParams = { height };
        const queryParams = {
        };
        const headerParams = {
        };
        const formParams = {
        };

        const authNames = [];
        const contentTypes = [];
        const accepts = ['application/json'];

        const response = this.apiClient.callApi(
            '/block/{height}', 'GET',
            pathParams, queryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts);
        return observableFrom(response).pipe(map((blockDTO: any) => {
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
                blockDTO.block.feeMultiplier,
                blockDTO.block.previousBlockHash,
                blockDTO.block.blockTransactionsHash,
                blockDTO.block.blockReceiptsHash,
                blockDTO.block.stateHash,
                extractBeneficiary(blockDTO, networkType),
            );
        }));
    }

    /**
     * Gets array of transactions included in a block for a block height
     * @param height - Block height
     * @param queryParams - (Optional) Query params
     * @returns Observable<Transaction[]>
     */
    public getBlockTransactions(height: number,
                                queryParams?: QueryParams): Observable<Transaction[]> {
        const postBody = null;

        // verify the required parameter 'height' is set
        if (height === undefined || height === null) {
            throw new Error('Missing the required parameter \'height\' when calling getBlockTransactions');
        }

        const pathParams = { height };
        const headerParams = {
        };
        const formParams = {
        };

        const authNames = [];
        const contentTypes = [];
        const accepts = ['application/json'];

        const response = this.apiClient.callApi(
            '/block/{height}/transactions', 'GET',
            pathParams, queryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts);
        return observableFrom(response).pipe(map((transactionsDTO: any) => {
            return transactionsDTO.map((transactionDTO) => {
                return CreateTransactionFromDTO(transactionDTO);
            });
        }));
    }

    /**
     * Gets array of BlockInfo for a block height with limit
     * @param height - Block height from which will be the first block in the array
     * @param limit - Number of blocks returned
     * @returns Observable<BlockInfo[]>
     */
    public getBlocksByHeightWithLimit(height: number, limit: number = 1): Observable<BlockInfo[]> {
        const postBody = null;

        // verify the required parameter 'height' is set
        if (height === undefined || height === null) {
            throw new Error('Missing the required parameter \'height\' when calling getBlocksByHeightWithLimit');
        }

        // verify the required parameter 'limit' is set
        if (limit === undefined || limit === null) {
            throw new Error('Missing the required parameter \'limit\' when calling getBlocksByHeightWithLimit');
        }

        const pathParams = {
            height,
            limit,
        };
        const queryParams = {
        };
        const headerParams = {
        };
        const formParams = {
        };

        const authNames = [];
        const contentTypes = [];
        const accepts = ['application/json'];

        const response = this.apiClient.callApi(
            '/blocks/{height}/limit/{limit}', 'GET',
            pathParams, queryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts);
        return observableFrom(response).pipe(map((blocksDTO: any) => {
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
                    blockDTO.block.feeMultiplier,
                    blockDTO.block.previousBlockHash,
                    blockDTO.block.blockTransactionsHash,
                    blockDTO.block.blockReceiptsHash,
                    blockDTO.block.stateHash,
                    extractBeneficiary(blockDTO, networkType),
                );
            });
        }));
    }

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
    public getMerkleReceipts(height: number, hash: string): Observable<MerkleProofInfo> {
        const postBody = null;

        // verify the required parameter 'height' is set
        if (height === undefined || height === null) {
            throw new Error('Missing the required parameter \'height\' when calling getMerkleReceipts');
        }

        // verify the required parameter 'hash' is set
        if (hash === undefined || hash === null) {
            throw new Error('Missing the required parameter \'hash\' when calling getMerkleReceipts');
        }

        const pathParams = {
            height,
            hash,
        };
        const queryParams = {
        };
        const headerParams = {
        };
        const formParams = {
        };

        const authNames = [];
        const contentTypes = [];
        const accepts = ['application/json'];

        const response = this.apiClient.callApi(
            '/block/{height}/receipt/{hash}/merkle', 'GET',
            pathParams, queryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts);
        return observableFrom(response).pipe(map((merkleProofReceipt: any) => {
                return new MerkleProofInfo(
                    new MerkleProofInfoPayload(
                        merkleProofReceipt.payload.merklePath.map((payload) => new MerklePathItem(payload.position, payload.hash))),
                    merkleProofReceipt.type,
                );
        }));
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
    public getMerkleTransaction(height: number, hash: string): Observable<MerkleProofInfo> {
        const postBody = null;

        // verify the required parameter 'height' is set
        if (height === undefined || height === null) {
            throw new Error('Missing the required parameter \'height\' when calling getMerkleTransaction');
        }

        // verify the required parameter 'hash' is set
        if (hash === undefined || hash === null) {
            throw new Error('Missing the required parameter \'hash\' when calling getMerkleTransaction');
        }

        const pathParams = {
            height,
            hash,
        };
        const queryParams = {
        };
        const headerParams = {
        };
        const formParams = {
        };

        const authNames = [];
        const contentTypes = [];
        const accepts = ['application/json'];

        const response = this.apiClient.callApi(
            '/block/{height}/transaction/{hash}/merkle', 'GET',
            pathParams, queryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts);
        return observableFrom(response).pipe(map((merkleProofReceipt: any) => {
                return new MerkleProofInfo(
                    new MerkleProofInfoPayload(
                        merkleProofReceipt.payload.merklePath.map((payload) => new MerklePathItem(payload.position, payload.hash))),
                    merkleProofReceipt.type,
                );
        }));
    }

    /**
     * Gets an array receipts for a block height.
     * @param height - Block height from which will be the first block in the array
     * @param queryParams - (Optional) Query params
     * @returns Observable<Statement>
     */
    public getBlockReceipts(height: number): Observable<Statement> {
        const postBody = null;

        // verify the required parameter 'height' is set
        if (height === undefined || height === null) {
            throw new Error('Missing the required parameter \'height\' when calling getBlockReceipts');
        }

        const pathParams = {
            height,
        };
        const queryParams = {
        };
        const headerParams = {
        };
        const formParams = {
        };

        const authNames = [];
        const contentTypes = [];
        const accepts = ['application/json'];

        const response = this.apiClient.callApi(
            '/block/{height}/receipts', 'GET',
            pathParams, queryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts);
        return this.getNetworkTypeObservable().pipe(
            mergeMap((networkType) => observableFrom(response).pipe(
                    map((receiptDTO) => {
                        return CreateStatementFromDTO(receiptDTO, networkType);
                    }),
                ),
            ),
        );
    }
}
