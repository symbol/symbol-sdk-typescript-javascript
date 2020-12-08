/*
 * Copyright 2020 NEM
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

import { MerkleTreeBranchLink } from './MerkleTreeBranchLink';
import { MerkleTreeNodeType } from './MerkleTreeNodeType';
/**
 * Merkle tree branch node.
 */
export class MerkleTreeBranch {
    /**
     * @param type
     * @param path
     * @param encodedPath
     * @param nibbleCount
     * @param linkMask
     * @param links
     * @param branchHash
     */
    constructor(
        /**
         * Merkle tree node type
         */
        public readonly type: MerkleTreeNodeType,
        /**
         * Branch node path
         */
        public readonly path: string,
        /**
         * Branch node path encoded
         */
        public readonly encodedPath: string,
        /**
         * Leaf nibble count
         */
        public readonly nibbleCount: number,
        /**
         * Branch node link bitmask
         */
        public readonly linkMask: string,
        /**
         * Branch node links
         */
        public readonly links: MerkleTreeBranchLink[],
        /**
         * Branch node hash
         */
        public readonly branchHash: string,
    ) {}
}
