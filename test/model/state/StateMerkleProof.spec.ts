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

import { expect } from 'chai';
import { MerkleTree } from '../../../src';
import { StateMerkleProof } from '../../../src/model/state/StateMerkleProof';

describe('StateMerkleProof', () => {
    it('should createComplete an HashLockInfo object', () => {
        const proof = new StateMerkleProof('hash', new MerkleTree([]), 'hash', undefined, false);

        expect(proof.leafValue).to.be.undefined;
        expect(proof.stateHash).to.be.equal('hash');
        expect(proof.rootHash).to.be.equal('hash');
        expect(proof.merkleTree.branches.length).to.be.equal(0);
        expect(proof.merkleTree.leaf).to.be.undefined;
    });
});
