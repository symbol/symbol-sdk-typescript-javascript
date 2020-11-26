/*
import { MerkleTreeBranch } from './MerkleTreeBranch';
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

import { Convert } from '../../core/format';
import { MerkleTreeBranch } from './MerkleTreeBranch';
import { MerkleTreeLeaf } from './MerkleTreeLeaf';
import { MerkleTreeNodeType } from './MerkleTreeNodeType';
import MerkleTreeParser from './MerkleTreeParser';

/**
 * Merkle tree.
 */
export class MerkleTree {
    /**
     * @param branches the branches
     * @param the leaf the leaf.
     */
    constructor(public readonly branches: MerkleTreeBranch[], public readonly leaf?: MerkleTreeLeaf) {}

    /***
     *
     * @param raw
     */
    public static fromRaw(raw: string): MerkleTree {
        const tree = new MerkleTreeParser().parseMerkleTreeFromRaw(Convert.hexToUint8(raw));
        return new MerkleTree(
            tree.filter((b) => b.type == MerkleTreeNodeType.Branch).map((b) => b as MerkleTreeBranch),
            tree.filter((b) => b.type == MerkleTreeNodeType.Leaf).map((b) => b as MerkleTreeLeaf)?.[0],
        );
    }
}
