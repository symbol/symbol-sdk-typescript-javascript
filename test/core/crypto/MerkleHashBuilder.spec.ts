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

import { expect } from 'chai';
import { MerkleHashBuilder } from '../../../src/core/crypto';
import { Convert } from '../../../src/core/format';

describe('MerkleHashBuilder should', () => {
    it('fill 0s for empty merkle tree', () => {
        // Arrange:
        const builder = new MerkleHashBuilder(32);

        const rootHash = builder.getRootHash();

        expect(Convert.uint8ToHex(rootHash)).equal('0000000000000000000000000000000000000000000000000000000000000000');

    });

    it('return first hash given single child', () => {
        // Arrange:
        const builder = new MerkleHashBuilder(32);

        builder.update(Convert.hexToUint8('215B158F0BD416B596271BCE527CD9DC8E4A639CC271D896F9156AF6F441EEB9'));

        const rootHash = builder.getRootHash();

        expect(Convert.uint8ToHex(rootHash)).equal('215B158F0BD416B596271BCE527CD9DC8E4A639CC271D896F9156AF6F441EEB9');

    });

    it('create correct merkle hash given two children', () => {
        // Arrange:
        const builder = new MerkleHashBuilder(32);

        builder.update(Convert.hexToUint8('215b158f0bd416b596271bce527cd9dc8e4a639cc271d896f9156af6f441eeb9'));
        builder.update(Convert.hexToUint8('976c5ce6bf3f797113e5a3a094c7801c885daf783c50563ffd3ca6a5ef580e25'));

        const rootHash = builder.getRootHash();

        expect(Convert.uint8ToHex(rootHash).toLocaleLowerCase()).equal('1c704e3ac99b124f92d2648649ec72c7a19ea4e2bb24f669b976180a295876fa');

    });

    it('create correct merkle hash given three children', () => {
        // Arrange:
        const builder = new MerkleHashBuilder(32);

        builder.update(Convert.hexToUint8('215b158f0bd416b596271bce527cd9dc8e4a639cc271d896f9156af6f441eeb9'));
        builder.update(Convert.hexToUint8('976c5ce6bf3f797113e5a3a094c7801c885daf783c50563ffd3ca6a5ef580e25'));
        builder.update(Convert.hexToUint8('e926cc323886d47234bb0b49219c81e280e8a65748b437c2ae83b09b37a5aaf2'));

        const rootHash = builder.getRootHash();

        expect(Convert.uint8ToHex(rootHash).toLocaleLowerCase()).equal('5dc17b2409d50bcc7c1faa720d0ec8b79a1705d0c517bcc0bdbd316540974d5e');

    });

});
