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

import { SHA3Hasher } from '../../core/crypto';
import { Convert } from '../../core/format';
import { MerkleTreeBranch } from './MerkleTreeBranch';
import { MerkleTreeBranchLink } from './MerkleTreeBranchLink';
import { MerkleTreeLeaf } from './MerkleTreeLeaf';

export default class MerkleTreeParser {
    /**
     * Decompose a bitmask to get number of bit's indices
     * @param {number} mask bitmask
     * @returns {string[]} array of the indices of bits
     */
    getBitsFromMask(mask): string[] {
        const intValue = parseInt(`0x${Convert.uint8ToHex(mask.reverse())}`, 16);
        let index = 0;
        const bits: string[] = [];
        for (let i = 1; i <= intValue; i *= 2) {
            if (0 < (intValue & i)) {
                // bit value: i.toString(16)
                bits.push(index.toString(16).toUpperCase());
            }
            index++;
        }
        return bits;
    }

    /**
     * Calculate path length from given nibbles count
     * @param {number} nibbleCount Nibbles count
     * @returns {number} the length of the path
     */
    getPathLength(nibbleCount): number {
        // 1 nibble = 0.5 bytes.
        // Round up to the whole bytes
        return Math.ceil(parseFloat(nibbleCount) / 2);
    }

    /**
     * Is branch node
     * @param {number} marker node marker
     * @returns {boolean} if tree node is branch
     */
    isBranch(marker): boolean {
        return 0 === marker;
    }

    /**
     * Is leaf node
     * @param {number} marker node marker
     * @returns {boolean} if tree node is leaf
     */
    isLeaf(marker): boolean {
        return 255 === marker;
    }

    /**
     * Recursively parse raw tree
     * @param {Uint8Array} raw raw tree buffer
     * @returns {Array} merkle tree
     */
    public parseMerkleTreeFromRaw(raw: Uint8Array): (MerkleTreeBranch | MerkleTreeLeaf)[] {
        if (!raw.length) {
            return [];
        }
        const marker = raw[0];
        const nibbleCount = raw[1];
        const pathLength = this.getPathLength(nibbleCount);
        const path = raw.slice(2, 2 + pathLength);
        if (this.isBranch(marker)) {
            const [lessBranch, branch] = this.parseBranch(raw.slice(2 + pathLength), path, nibbleCount);
            return [branch, ...this.parseMerkleTreeFromRaw(lessBranch)];
        }
        if (this.isLeaf(marker)) {
            const [lessLeaf, leaf] = this.parseLeaf(raw.slice(2 + pathLength), path, nibbleCount);
            return [leaf, ...this.parseMerkleTreeFromRaw(lessLeaf)];
        }
        throw new Error(`${Convert.uint8ToHex(raw)} is not a branch or a leaf!`);
    }

    /**
     * Parse branch tree node
     * @param {Uint8Array} offsetRaw partial raw buffer
     * @param {Uint8Array} path merkle tree path
     * @param {number} nibbleCount number of nibbles
     * @returns {Uint8Array} unprocess raw buffer
     */
    parseBranch(offsetRaw: Uint8Array, path: Uint8Array, nibbleCount: number): [Uint8Array, MerkleTreeBranch] {
        const linkMask = offsetRaw.slice(0, 2); // little endian
        const bits = this.getBitsFromMask(linkMask);
        const linksRaw = offsetRaw.slice(2, 2 + 32 * bits.length);
        const links: MerkleTreeBranchLink[] = [];
        for (let i = 0; i < bits.length; i++) {
            links.push({
                bit: bits[i],
                link: Convert.uint8ToHex(linksRaw.slice(i * 32, i * 32 + 32)),
            });
        }
        const encodedPath = Convert.uint8ToHex(this.encodePath(path, nibbleCount, false));
        const branch: MerkleTreeBranch = {
            type: 0,
            path: Convert.uint8ToHex(path),
            encodedPath,
            nibbleCount,
            linkMask: Convert.uint8ToHex(linkMask),
            links,
            branchHash: this.getBranchHash(encodedPath, links),
        };
        const remaining = offsetRaw.slice(2 + 32 * bits.length);
        return [remaining, branch];
    }

    /**
     * Parse leaf tree node
     * @param {Uint8Array} offsetRaw partial raw buffer
     * @param {Uint8Array} path merkle tree path
     * @param {number} nibbleCount number of nibbles
     * @returns {Uint8Array} unprocess raw buffer
     */
    parseLeaf(offsetRaw: Uint8Array, path: Uint8Array, nibbleCount: number): [Uint8Array, MerkleTreeLeaf] {
        const value = Convert.uint8ToHex(offsetRaw.slice(0, 32));
        const encodedPath = Convert.uint8ToHex(this.encodePath(path, nibbleCount, true));
        const leaf: MerkleTreeLeaf = {
            type: 255,
            path: Convert.uint8ToHex(path),
            encodedPath,
            nibbleCount,
            value,
            leafHash: this.getLeafHash(encodedPath, value),
        };
        return [offsetRaw.slice(32), leaf];
    }

    /**
     * Encode path depends on node type and nibble count
     * @param {Uint8Array} path path buffer
     * @param {number} nibbleCount number of nibbles
     * @param {boolean} isLeaf is leaf node
     * @returns {Uint8Array} encoded path
     */
    encodePath(path: Uint8Array, nibbleCount: number, isLeaf: boolean): Uint8Array {
        const encodedKey = new Uint8Array(Math.floor(nibbleCount / 2) + 1);
        encodedKey[0] = isLeaf ? 0x20 : 0; // set leaf flag
        let i = 0;
        if (1 === nibbleCount % 2) {
            // set odd flag and merge in first nibble
            encodedKey[0] = encodedKey[0] | 0x10 | this.nibbleAt(path, 0);
            ++i;
        }

        for (; i < nibbleCount; i += 2) {
            encodedKey[Math.floor(i / 2) + 1] = (this.nibbleAt(path, i) << 4) + this.nibbleAt(path, i + 1);
        }

        return encodedKey;
    }

    /**
     * Get byte at given nibble index
     * @param {Uint8Array} path path buffer
     * @param {number} index nibble index
     * @returns {number} byte
     */
    nibbleAt(path: Uint8Array, index: number): number {
        const byte = path[Math.floor(index / 2)];
        return 0 === index % 2 ? (byte & 0xf0) >> 4 : byte & 0x0f;
    }

    /**
     * Calculate branch hash. Hash(encodedPath + 16 links)
     * @param {string} encodedPath encoded path of the branch in hexadecimal format
     * @param {Array} links branch links array
     * @returns {string} branch hash (Hash(encodedPath + links))
     */
    getBranchHash(encodedPath: string, links: MerkleTreeBranchLink[]): string {
        const branchLinks = Array(16).fill(Convert.uint8ToHex(new Uint8Array(32)));
        links.forEach((link) => {
            branchLinks[parseInt(`0x${link.bit}`, 16)] = link.link;
        });
        return SHA3Hasher.getHasher(32)
            .update(Convert.hexToUint8(encodedPath + branchLinks.join('')))
            .hex()
            .toUpperCase();
    }

    /**
     * Calculate leaf hash. Hash(encodedPath + leaf value)
     * @param {string} encodedPath encoded path of the leaf in hexadecimal format
     * @param {Array} leafValue leaf value
     * @returns {string} leaf hash (Hash(encodedPath + leaf value))
     */
    getLeafHash(encodedPath: string, leafValue): string {
        return SHA3Hasher.getHasher(32)
            .update(Convert.hexToUint8(encodedPath + leafValue))
            .hex()
            .toUpperCase();
    }
}
