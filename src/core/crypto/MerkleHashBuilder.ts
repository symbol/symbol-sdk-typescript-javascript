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
import { SHA3Hasher } from './SHA3Hasher';

export class MerkleHashBuilder {
    /**
     * The list of hashes used to calculate root hash.
     *
     * @var {Uint8Array}
     */
    protected hashes: Uint8Array[] = new Array<Uint8Array>();

    /**
     * Constructor
     * @param length Hash size
     */
    constructor(
        /**
         * Length of produced merkle hash in bytes.
         *
         * @var {number}
         */
        public readonly length: number,
    ) {}

    /**
     * Hash inner transactions
     *
     * @internal
     * @param hashes Inner transaction hashes
     * @return {Uint8Array}
     */
    protected hash(hashes: Uint8Array[]): Uint8Array {
        const hasher = SHA3Hasher.createHasher(this.length);
        hasher.reset();

        hashes.forEach((hashVal: Uint8Array) => {
            hasher.update(hashVal);
        });

        const hash = new Uint8Array(this.length);
        hasher.finalize(hash);
        return hash;
    }

    /**
     * Get root hash of Merkle Tree
     *
     * @internal
     * @param {Uint8Array[]} hashes Inner transaction hashes
     * @return {Uint8Array}
     */
    protected calculateRootHash(hashes: Uint8Array[]): Uint8Array {
        if (hashes.length === 0) {
            return new Uint8Array(this.length);
        }

        let numRemainingHashes = hashes.length;
        while (numRemainingHashes > 1) {
            for (let i = 0; i < numRemainingHashes; i += 2) {
                if (i + 1 < numRemainingHashes) {
                    hashes.splice(i / 2, 0, this.hash([hashes[i], hashes[i + 1]]));
                    continue;
                }

                // if there is an odd number of hashes, duplicate the last one
                hashes.splice(i / 2, 0, this.hash([hashes[i], hashes[i]]));
                ++numRemainingHashes;
            }
            numRemainingHashes /= 2;
        }
        return hashes[0];
    }

    /**
     * Get root hash of Merkle tree
     *
     * @return {Uint8Array}
     */
    public getRootHash(): Uint8Array {
        return this.calculateRootHash(this.hashes);
    }

    /**
     * Update hashes array (add hash)
     *
     * @param hash Inner transaction hash buffer
     * @return {MerkleHashBuilder}
     */
    public update(hash: Uint8Array): MerkleHashBuilder {
        this.hashes.push(hash);
        return this;
    }
}
