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
import { BlockInfoDTO, BlockRoutesApi, ImportanceBlockDTO } from 'symbol-openapi-typescript-fetch-client';
import { DtoMapping } from '../core/utils/DtoMapping';
import { Address } from '../model/account/Address';
import { PublicAccount } from '../model/account/PublicAccount';
import { BlockInfo } from '../model/blockchain/BlockInfo';
import { BlockType } from '../model/blockchain/BlockType';
import { MerklePathItem } from '../model/blockchain/MerklePathItem';
import { MerkleProofInfo } from '../model/blockchain/MerkleProofInfo';
import { NemesisImportanceBlockInfo } from '../model/blockchain/NemesisImportanceBlockInfo';
import { NormalBlockInfo } from '../model/blockchain/NomalBlockInfo';
import { UInt64 } from '../model/UInt64';
import { BlockRepository } from './BlockRepository';
import { Http } from './Http';
import { Page } from './Page';
import { BlockPaginationStreamer } from './paginationStreamer';
import { BlockSearchCriteria } from './searchCriteria/BlockSearchCriteria';

/**
 * Blockchain http repository.
 *
 * @since 1.0
 */
export class BlockHttp extends Http implements BlockRepository {
    /**
     * @internal
     * Symbol openapi typescript-node client block routes api
     */
    private readonly blockRoutesApi: BlockRoutesApi;

    /**
     * Constructor
     * @param url Base catapult-rest url
     * @param fetchApi fetch function to be used when performing rest requests.
     */
    constructor(url: string, fetchApi?: any) {
        super(url, fetchApi);
        this.blockRoutesApi = new BlockRoutesApi(this.config());
    }

    /**
     * Gets a BlockInfo for a given block height
     * @param height - Block height
     * @returns Observable<BlockInfo>
     */
    public getBlockByHeight(height: UInt64): Observable<BlockInfo> {
        return this.call(this.blockRoutesApi.getBlockByHeight(height.toString()), (body) => this.toBlockInfo(body));
    }

    /**
     * Gets an array of blocks.
     * @param criteria - Block search criteria
     * @returns Observable<BlockInfo[]>
     */
    public search(criteria: BlockSearchCriteria): Observable<Page<BlockInfo>> {
        return this.call(
            this.blockRoutesApi.searchBlocks(
                criteria.signerPublicKey,
                criteria.beneficiaryAddress,
                criteria.pageSize,
                criteria.pageNumber,
                criteria.offset,
                DtoMapping.mapEnum(criteria.order),
                DtoMapping.mapEnum(criteria.orderBy),
            ),
            (body) => super.toPage(body.pagination, body.data, this.toBlockInfo),
        );
    }

    public streamer(): BlockPaginationStreamer {
        return new BlockPaginationStreamer(this);
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
        const blockType = dto.block.type;
        const normalBlock = new NormalBlockInfo(
            dto.id ?? '',
            dto.block.size,
            dto.meta.hash,
            dto.meta.generationHash,
            UInt64.fromNumericString(dto.meta.totalFee),
            dto.meta.stateHashSubCacheMerkleRoots,
            dto.meta.totalTransactionsCount,
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
            dto.block.proofGamma,
            dto.block.proofScalar,
            dto.block.proofVerificationHash,
            Address.createFromEncoded(dto.block.beneficiaryAddress),
            dto.meta.transactionsCount,
            dto.meta.statementsCount,
        );
        if (blockType === BlockType.NormalBlock.valueOf()) {
            return normalBlock;
        } else if ([BlockType.ImportanceBlock.valueOf(), BlockType.NemesisBlock.valueOf()].includes(blockType)) {
            const importanceBlockInfoDto = dto.block as ImportanceBlockDTO;
            return DtoMapping.assign(normalBlock, {
                votingEligibleAccountsCount: importanceBlockInfoDto.votingEligibleAccountsCount,
                harvestingEligibleAccountsCount: importanceBlockInfoDto.harvestingEligibleAccountsCount
                    ? UInt64.fromNumericString(importanceBlockInfoDto.harvestingEligibleAccountsCount)
                    : undefined,
                totalVotingBalance: importanceBlockInfoDto.totalVotingBalance
                    ? UInt64.fromNumericString(importanceBlockInfoDto.totalVotingBalance)
                    : undefined,
                previousImportanceBlockHash: importanceBlockInfoDto.previousImportanceBlockHash,
            }) as NemesisImportanceBlockInfo;
        } else {
            throw new Error(`Block type: ${blockType} invalid.`);
        }
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
    public getMerkleTransaction(height: UInt64, hash: string): Observable<MerkleProofInfo> {
        return this.call(
            this.blockRoutesApi.getMerkleTransaction(height.toString(), hash),
            (body) =>
                new MerkleProofInfo(
                    body.merklePath!.map((payload) => new MerklePathItem(DtoMapping.mapEnum(payload.position), payload.hash)),
                ),
        );
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
    public getMerkleReceipts(height: UInt64, hash: string): Observable<MerkleProofInfo> {
        return this.call(
            this.blockRoutesApi.getMerkleReceipts(height.toString(), hash),
            (body) =>
                new MerkleProofInfo(
                    body.merklePath!.map((payload) => new MerklePathItem(DtoMapping.mapEnum(payload.position), payload.hash)),
                ),
        );
    }
}
