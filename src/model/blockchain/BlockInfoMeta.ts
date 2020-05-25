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

import { UInt64 } from '../UInt64';

/**
 * The block meta data.
 */
export class BlockMeta {
    /**
     * @param hash
     * @param generationHash
     * @param totalFee
     * @param numTransactions
     * @param signature
     * @param signer
     * @param networkType
     * @param version
     * @param type
     * @param height
     * @param timestamp
     * @param difficulty
     * @param proofGamma
     * @param proofScalar
     * @param proofVerificationHash
     * @param feeMultiplier
     * @param previousBlockHash
     * @param blockTransactionsHash
     * @param blockReceiptsHash
     * @param blockStateHash
     * @param beneficiaryPublicKey
     * @param numStatements
     */
    constructor(
        /**
         * The sum of all transaction fees included in the block.
         */
        public readonly totalFee: UInt64,
        /**
         * State hash sub cache merkle roots
         */
        public readonly stateHashSubCacheMerkleRoots: string[],
        /**
         * The number of transactions included.
         */
        public readonly numTransactions: number,
        /**
         * The number of statements included.
         */
        public readonly numStatements?: number,
    ) {}
}
