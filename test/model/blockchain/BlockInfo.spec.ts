/*
 * Copyright 2018 NEM
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

import { deepEqual } from 'assert';
import { expect } from 'chai';
import { BlockType } from '../../../src';
import { Address } from '../../../src/model/account/Address';
import { PublicAccount } from '../../../src/model/account/PublicAccount';
import { NormalBlockInfo } from '../../../src/model/blockchain/NomalBlockInfo';
import { UInt64 } from '../../../src/model/UInt64';

describe('BlockInfo', () => {
    it('should createComplete an NormalBlockInfo object', () => {
        const blockDTO = {
            id: '12345',
            block: {
                size: 1,
                blockTransactionsHash: '702090BA31CEF9E90C62BBDECC0CCCC0F88192B6625839382850357F70DD68A0',
                blockReceiptsHash: '702090BA31CEF9E90C62BBDECC0CCCC0F88192B6625839382850357F70DD68A0',
                stateHash: '702090BA31CEF9E90C62BBDECC0CCCC0F88192B6625839382850357F70DD68A0',
                difficulty: UInt64.fromNumberArray([276447232, 23283]),
                proofGamma: 'AC1A6E1D8DE5B17D2C6B1293F1CAD3829EEACF38D09311BB3C8E5A880092DE26',
                proofScalar: 'AC1A6E1D8DE5B17D2C6B1293F1CAD3829EEACF38D09311BB3C8E5A880092DE26',
                proofVerificationHash: 'AC1A6E1D8DE5B17D2C6B1293F1CAD382',
                feeMultiplier: 1,
                height: new UInt64(1),
                previousBlockHash: '0000000000000000000000000000000000000000000000000000000000000000',
                signature:
                    '37351C8244AC166BE6664E3FA954E99A3239AC46E51E2B32CEA1C72DD0851100A7731868' +
                    'E932E1A9BEF8A27D48E1FFEE401E933EB801824373E7537E51733E0F',
                signerPublicKey: 'B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF',
                beneficiaryAddress: '7826D27E1D0A26CA4E316F901E23E55C8711DB20DF5C49B5',
                timestamp: new UInt64(0),
                type: BlockType.NormalBlock,
                version: 1,
                network: 144,
            },
            meta: {
                generationHash: '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6',
                hash: '24E92B511B54EDB48A4850F9B42485FDD1A30589D92C775632DDDD71D7D1D691',
                totalTransactionsCount: 35,
                transactionsCount: 25,
                statementsCount: 1,
                totalFee: new UInt64(0),
                stateHashSubCacheMerkleRoots: ['45FF761839D7219296341925EBA3BF4832BA9B3E29C854B83E6445D5F3E1DAB7'],
            },
        };

        const blockInfo = new NormalBlockInfo(
            blockDTO.id,
            blockDTO.block.size,
            blockDTO.meta.hash,
            blockDTO.meta.generationHash,
            blockDTO.meta.totalFee,
            blockDTO.meta.stateHashSubCacheMerkleRoots,
            blockDTO.meta.totalTransactionsCount,
            blockDTO.block.signature,
            PublicAccount.createFromPublicKey(blockDTO.block.signerPublicKey, blockDTO.block.network),
            blockDTO.block.network,
            blockDTO.block.version, // Tx version
            blockDTO.block.type,
            blockDTO.block.height,
            blockDTO.block.timestamp,
            blockDTO.block.difficulty,
            blockDTO.block.feeMultiplier,
            blockDTO.block.previousBlockHash,
            blockDTO.block.blockTransactionsHash,
            blockDTO.block.blockReceiptsHash,
            blockDTO.block.stateHash,
            blockDTO.block.proofGamma,
            blockDTO.block.proofScalar,
            blockDTO.block.proofVerificationHash,
            Address.createFromEncoded(blockDTO.block.beneficiaryAddress),
            blockDTO.meta.transactionsCount,
            blockDTO.meta.statementsCount,
        );

        expect(blockInfo.recordId).to.be.equal(blockDTO.id);
        expect(blockInfo.size).to.be.equal(blockDTO.block.size);
        expect(blockInfo.hash).to.be.equal(blockDTO.meta.hash);
        expect(blockInfo.generationHash).to.be.equal(blockDTO.meta.generationHash);
        deepEqual(blockInfo.totalFee, blockDTO.meta.totalFee);
        expect(blockInfo.totalTransactionsCount).to.be.equal(blockDTO.meta.totalTransactionsCount);
        expect(blockInfo.signature).to.be.equal(blockDTO.block.signature);
        expect(blockInfo.signer.publicKey).to.be.equal(blockDTO.block.signerPublicKey);
        expect(blockInfo.networkType).to.be.equal(blockDTO.block.network);
        expect(blockInfo.version).to.be.equal(blockDTO.block.version);
        expect(blockInfo.type).to.be.equal(blockDTO.block.type);
        deepEqual(blockInfo.height, blockDTO.block.height);
        deepEqual(blockInfo.timestamp, blockDTO.block.timestamp);
        deepEqual(blockInfo.difficulty, blockDTO.block.difficulty);
        expect(blockInfo.feeMultiplier).to.be.equal(blockDTO.block.feeMultiplier);
        expect(blockInfo.previousBlockHash).to.be.equal(blockDTO.block.previousBlockHash);
        expect(blockInfo.blockTransactionsHash).to.be.equal(blockDTO.block.blockTransactionsHash);
        expect(blockInfo.blockReceiptsHash).to.be.equal(blockDTO.block.blockReceiptsHash);
        expect(blockInfo.stateHash).to.be.equal(blockDTO.block.stateHash);
        expect(blockInfo.beneficiaryAddress?.plain()).to.be.equal(Address.createFromEncoded(blockDTO.block.beneficiaryAddress).plain());
        expect(blockInfo.statementsCount).to.be.equal(blockDTO.meta.statementsCount);
        expect(blockInfo.transactionsCount).to.be.equal(blockDTO.meta.transactionsCount);
        expect(blockInfo.proofScalar).to.be.equal(blockDTO.block.proofScalar);
        expect(blockInfo.proofVerificationHash).to.be.equal(blockDTO.block.proofVerificationHash);
        expect(blockInfo.stateHashSubCacheMerkleRoots.length).to.be.equal(1);
        expect(blockInfo.stateHashSubCacheMerkleRoots[0]).to.be.equal('45FF761839D7219296341925EBA3BF4832BA9B3E29C854B83E6445D5F3E1DAB7');
    });
});
