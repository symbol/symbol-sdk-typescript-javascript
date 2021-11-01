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
import { Address } from '../../../src/model/account/Address';
import { PublicAccount } from '../../../src/model/account/PublicAccount';
import { NewBlock } from '../../../src/model/blockchain/NewBlock';
import { NetworkType } from '../../../src/model/network/NetworkType';
import { UInt64 } from '../../../src/model/UInt64';

describe('NewBlock', () => {
    it('should createComplete an NewBlock object', () => {
        const blockDTO = {
            block: {
                blockTransactionsHash: '702090BA31CEF9E90C62BBDECC0CCCC0F88192B6625839382850357F70DD68A0',
                blockReceiptsHash: '702090BA31CEF9E90C62BBDECC0CCCC0F88192B6625839382850357F70DD68A0',
                stateHash: '702090BA31CEF9E90C62BBDECC0CCCC0F88192B6625839382850357F70DD68A0',
                difficulty: new UInt64([276447232, 23283]),
                proofGamma: 'AC1A6E1D8DE5B17D2C6B1293F1CAD3829EEACF38D09311BB3C8E5A880092DE26',
                proofScalar: 'AC1A6E1D8DE5B17D2C6B1293F1CAD3829EEACF38D09311BB3C8E5A880092DE26',
                proofVerificationHash: 'AC1A6E1D8DE5B17D2C6B1293F1CAD382',
                feeMultiplier: 1,
                height: new UInt64([1, 0]),
                previousBlockHash: '0000000000000000000000000000000000000000000000000000000000000000',
                signature:
                    '37351C8244AC166BE6664E3FA954E99A3239AC46E51E2B32CEA1C72DD0851100A7731868' +
                    'E932E1A9BEF8A27D48E1FFEE401E933EB801824373E7537E51733E0F',
                signerPublicKey: 'B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF',
                beneficiaryAddress: Address.createFromPublicKey(
                    'B4F12E7C9F6946091E2CB8B6D3A12B50D17CCBBF646386EA27CE2946A7423DCF',
                    NetworkType.TEST_NET,
                ).encoded(),
                timestamp: new UInt64([0, 0]),
                type: 32768,
                version: 1,
                network: 144,
            },
            meta: {
                generationHash: '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6',
                hash: '24E92B511B54EDB48A4850F9B42485FDD1A30589D92C775632DDDD71D7D1D691',
            },
        };

        const blockInfo = new NewBlock(
            blockDTO.meta.hash,
            blockDTO.meta.generationHash,
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
        );

        expect(blockInfo.hash).to.be.equal(blockDTO.meta.hash);
        expect(blockInfo.generationHash).to.be.equal(blockDTO.meta.generationHash);
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
        expect(blockInfo.beneficiaryAddress?.encoded()).to.be.equal(blockDTO.block.beneficiaryAddress);
        expect(blockInfo.proofGamma).to.be.equal(blockDTO.block.proofGamma);
        expect(blockInfo.proofScalar).to.be.equal(blockDTO.block.proofScalar);
        expect(blockInfo.proofVerificationHash).to.be.equal(blockDTO.block.proofVerificationHash);
    });
});
