/*
 * Copyright 2018 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { deepEqual } from 'assert';
import { expect } from 'chai';
import { DtoMapping } from '../../../src/core/utils/DtoMapping';

describe('MerkleTree', () => {
    const merkleStateDTO = {
        raw:
            '00000082F44AB1A5C28DC667A4AB0C1CF4FCC1D872E4FCBAB6F23F930DD5178829BCED41B' +
            '00876C8227C1ED98E870FACF99B53F5AD191D4DE0BC622EE5632D3ADB5C39D0FF3F785F565' +
            'CC8239D316CF31138B168E7ED4B0D75459C487E0F5851A384053A5E0053C7CA6CCA284CCDB' +
            '302A8A3CBBF4E60D18BC5D3CA83626DD918E8DF8F860E67',
        tree: [
            {
                type: 0,
                path: '',
                encodedPath: '00',
                nibbleCount: 0,
                linkMask: '8200',
                links: [
                    {
                        bit: '9',
                        link: 'F44AB1A5C28DC667A4AB0C1CF4FCC1D872E4FCBAB6F23F930DD5178829BCED41',
                    },
                    {
                        bit: 'F',
                        link: 'B00876C8227C1ED98E870FACF99B53F5AD191D4DE0BC622EE5632D3ADB5C39D0',
                    },
                ],
                branchHash: 'B982D5394C24C3D59D2D8679A2EABD4C25D8CAB62A8BC16B43C9FC9344682D44',
            },
            {
                type: 255,
                path: '785F565CC8239D316CF31138B168E7ED4B0D75459C487E0F5851A384053A5E00',
                encodedPath: '3785F565CC8239D316CF31138B168E7ED4B0D75459C487E0F5851A384053A5E0',
                nibbleCount: 63,
                value: '53C7CA6CCA284CCDB302A8A3CBBF4E60D18BC5D3CA83626DD918E8DF8F860E67',
                leafHash: 'B00876C8227C1ED98E870FACF99B53F5AD191D4DE0BC622EE5632D3ADB5C39D0',
            },
        ],
    };

    it('should createComplete an MerkleTree object', () => {
        const tree = DtoMapping.toMerkleStateInfo(merkleStateDTO);

        deepEqual(tree.raw, merkleStateDTO.raw);
        expect(tree.tree.branches.length).to.be.equal(1);
        expect(tree.tree.leaf).not.to.be.undefined;
        deepEqual(tree.tree.branches[0].branchHash, merkleStateDTO.tree[0].branchHash);
        deepEqual(tree.tree.branches[0].encodedPath, merkleStateDTO.tree[0].encodedPath);
        deepEqual(tree.tree.branches[0].path, merkleStateDTO.tree[0].path);
        deepEqual(tree.tree.branches[0].linkMask, merkleStateDTO.tree[0].linkMask);
        deepEqual(tree.tree.leaf?.type.valueOf(), merkleStateDTO.tree[1].type);
        deepEqual(tree.tree.leaf?.leafHash, merkleStateDTO.tree[1].leafHash);
        deepEqual(tree.tree.leaf?.encodedPath, merkleStateDTO.tree[1].encodedPath);
        deepEqual(tree.tree.leaf?.path, merkleStateDTO.tree[1].path);
        deepEqual(tree.tree.leaf?.value, merkleStateDTO.tree[1].value);
    });
});
