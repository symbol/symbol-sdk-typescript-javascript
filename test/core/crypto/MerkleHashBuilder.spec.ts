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
import { Crypto, MerkleHashBuilder } from '../../../src/core/crypto';
import { Convert } from '../../../src/core/format';

describe('MerkleHashBuilder', () => {
    const calculateMerkleHash = (hashes) => {
        const builder = new MerkleHashBuilder(32);
        hashes.forEach((embeddedHash) => builder.update(embeddedHash));
        return builder.getRootHash();
    };

    const assertMerkleHash = (expectedHashHex, hashesHex) => {
        // Act:
        const calculatedHash = calculateMerkleHash(hashesHex.map(Convert.hexToUint8));

        // Assert:
        expect(expectedHashHex).to.equal(Convert.uint8ToHex(calculatedHash));
    };

    it('fill 0s for empty merkle tree', () => {
        assertMerkleHash('0000000000000000000000000000000000000000000000000000000000000000', []);
    });

    it('return first hash given single child', () => {
        const randomHashHex = Convert.uint8ToHex(Crypto.randomBytes(32));
        assertMerkleHash(randomHashHex, [randomHashHex]);
    });

    it('can create from balanced tree', () => {
        assertMerkleHash('7D853079F5F9EE30BDAE49C4956AF20CDF989647AFE971C069AC263DA1FFDF7E', [
            '36C8213162CDBC78767CF43D4E06DDBE0D3367B6CEAEAEB577A50E2052441BC8',
            '8A316E48F35CDADD3F827663F7535E840289A16A43E7134B053A86773E474C28',
            '6D80E71F00DFB73B358B772AD453AEB652AE347D3E098AE269005A88DA0B84A7',
            '2AE2CA59B5BB29721BFB79FE113929B6E52891CAA29CBF562EBEDC46903FF681',
            '421D6B68A6DF8BB1D5C9ACF7ED44515E77945D42A491BECE68DA009B551EE6CE',
            '7A1711AF5C402CFEFF87F6DA4B9C738100A7AC3EDAD38D698DF36CA3FE883480',
            '1E6516B2CC617E919FAE0CF8472BEB2BFF598F19C7A7A7DC260BC6715382822C',
            '410330530D04A277A7C96C1E4F34184FDEB0FFDA63563EFD796C404D7A6E5A20',
        ]);
    });

    it('can build from unbalanced tree', () => {
        assertMerkleHash('DEFB4BF7ACF2145500087A02C88F8D1FCF27B8DEF4E0FDABE09413D87A3F0D09', [
            '36C8213162CDBC78767CF43D4E06DDBE0D3367B6CEAEAEB577A50E2052441BC8',
            '8A316E48F35CDADD3F827663F7535E840289A16A43E7134B053A86773E474C28',
            '6D80E71F00DFB73B358B772AD453AEB652AE347D3E098AE269005A88DA0B84A7',
            '2AE2CA59B5BB29721BFB79FE113929B6E52891CAA29CBF562EBEDC46903FF681',
            '421D6B68A6DF8BB1D5C9ACF7ED44515E77945D42A491BECE68DA009B551EE6CE',
        ]);
    });

    it('changing sub hash order changes merkle hash', () => {
        // Arrange:
        const seed1: Uint8Array[] = [];
        for (let i = 0; i < 8; ++i) {
            seed1.push(new Uint8Array(Crypto.randomBytes(32)));
        }

        // - swap 5 and 3
        // eslint-disable-next-line prettier/prettier
        const seed2 = [
            seed1[0], seed1[1], seed1[2], seed1[5],
            seed1[4], seed1[3], seed1[6], seed1[7]
        ];

        // Act:
        const rootHash1 = calculateMerkleHash(seed1);
        const rootHash2 = calculateMerkleHash(seed2);

        // Assert:
        expect(Convert.uint8ToHex(rootHash1)).not.to.equal(Convert.uint8ToHex(rootHash2));
    });

    it('changing sub hash changes merkle tree', () => {
        // Arrange:
        const seed1: Uint8Array[] = [];
        for (let i = 0; i < 8; ++i) {
            seed1.push(new Uint8Array(Crypto.randomBytes(32)));
        }

        // eslint-disable-next-line prettier/prettier
        const seed2 = [
            seed1[0], seed1[1], seed1[2], seed1[3],
            new Uint8Array(Crypto.randomBytes(32)), seed1[5], seed1[6], seed1[7]
        ];

        // Act:
        const rootHash1 = calculateMerkleHash(seed1);
        const rootHash2 = calculateMerkleHash(seed2);

        // Assert:
        expect(Convert.uint8ToHex(rootHash1)).not.to.equal(Convert.uint8ToHex(rootHash2));
    });
});
