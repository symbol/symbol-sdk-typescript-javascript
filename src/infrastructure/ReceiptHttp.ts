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
import { ReceiptRoutesApi } from 'symbol-openapi-typescript-fetch-client';
import { DtoMapping } from '../core/utils/DtoMapping';
import { MerklePathItem } from '../model/blockchain/MerklePathItem';
import { MerkleProofInfo } from '../model/blockchain/MerkleProofInfo';
import { Statement } from '../model/receipt/Statement';
import { UInt64 } from '../model/UInt64';
import { Http } from './Http';
import { CreateStatementFromDTO } from './receipt/CreateReceiptFromDTO';
import { ReceiptRepository } from './ReceiptRepository';

/**
 * Receipt http repository.
 *
 * @since 1.0
 */
export class ReceiptHttp extends Http implements ReceiptRepository {
    /**
     * @internal
     * Symbol openapi typescript-node client receipt routes api
     */
    private readonly receiptRoutesApi: ReceiptRoutesApi;

    /**
     * Constructor
     * @param url Base catapult-rest url
     * @param fetchApi fetch function to be used when performing rest requests.
     */
    constructor(url: string, fetchApi?: any) {
        super(url, fetchApi);
        this.receiptRoutesApi = new ReceiptRoutesApi(this.config());
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
            this.receiptRoutesApi.getMerkleReceipts(height.toString(), hash),
            (body) =>
                new MerkleProofInfo(
                    body.merklePath!.map((payload) => new MerklePathItem(DtoMapping.mapEnum(payload.position), payload.hash)),
                ),
        );
    }

    /**
     * Gets an array receipts for a block height.
     * @param height - Block height from which will be the first block in the array
     * @param queryParams - (Optional) Query params
     * @returns Observable<Statement>
     */
    public getBlockReceipts(height: UInt64): Observable<Statement> {
        return this.call(this.receiptRoutesApi.getBlockReceipts(height.toString()), (body) => CreateStatementFromDTO(body));
    }
}
