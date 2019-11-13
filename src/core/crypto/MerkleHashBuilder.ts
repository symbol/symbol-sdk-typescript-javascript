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

import { SignSchema } from './SignSchema';

export class MerkleHashBuilder {

    hashes: Uint8Array[] = new Array<Uint8Array>();
    hasherFactory: any;
    signSchema: SignSchema;
    length: number;

    constructor(hasherFactory: any, signSchema: SignSchema = SignSchema.SHA3, length: number = 32) {
        this.hasherFactory = hasherFactory;
        this.signSchema = signSchema;
        this.length = length;
    }

    hash(hashes: Uint8Array[]): Uint8Array {
        const hasher = this.hasherFactory(this.length, this.signSchema);
        hasher.reset();

        hashes.forEach((hashVal: Uint8Array) => {
            hasher.update(hashVal);
        });

        const hash = new Uint8Array(this.length);
        hasher.finalize(hash);
        return hash;
    }

    calculateRootHash(hashes: Uint8Array[]): Uint8Array {

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

    getRootHash(): Uint8Array {
        return this.calculateRootHash(this.hashes);
    }

    update(hash: Uint8Array): void {
        this.hashes.push(hash);
    }

}
