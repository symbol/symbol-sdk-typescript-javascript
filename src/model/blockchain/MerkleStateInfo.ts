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

import { MerkleTree } from '../state/MerkleTree';

/**
 *  The merkle path information clients can use to proof the state of the given entity.
 */
export class MerkleStateInfo {
    /**
     * Constructor
     *
     * @param raw The hex information of the complete merkle tree as returned by server api. More information can be found in chapter 4.3 of the catapult whitepaper.
     * @param tree The merkle tree object parsed from raw
     */
    constructor(public readonly raw: string, public readonly tree: MerkleTree) {}
}
