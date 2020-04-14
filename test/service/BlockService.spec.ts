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
import { of as observableOf } from 'rxjs';
import { PositionEnum } from 'symbol-openapi-typescript-node-client';
import { deepEqual, instance, mock, when } from 'ts-mockito';
import { BlockRepository } from '../../src/infrastructure/BlockRepository';
import { ReceiptRepository } from '../../src/infrastructure/ReceiptRepository';
import { RepositoryFactory } from '../../src/infrastructure/RepositoryFactory';
import { Account } from '../../src/model/account/Account';
import { BlockInfo } from '../../src/model/blockchain/BlockInfo';
import { MerklePathItem } from '../../src/model/blockchain/MerklePathItem';
import { MerkleProofInfo } from '../../src/model/blockchain/MerkleProofInfo';
import { NetworkType } from '../../src/model/network/NetworkType';
import { BlockService } from '../../src/service/BlockService';
import { TestingAccount } from '../conf/conf.spec';

describe('BlockService', () => {
    const mockBlockHash = 'D4EC16FCFE696EFDBF1820F68245C88135ACF4C6F888599C8E18BC09B9F08C7B';
    const leaf = '2717C8AAB0A21896D0C56375209E761F84383C3882F37A11D9D0159007263EB2';
    let blockService: BlockService;
    let account: Account;
    before(() => {
        account = TestingAccount;
        const mockBlockRepository = mock<BlockRepository>();
        const mockReceiptRepository = mock<ReceiptRepository>();
        const mockRepoFactory = mock<RepositoryFactory>();

        when(mockBlockRepository.getBlockByHeight(deepEqual(BigInt(1)))).thenReturn(observableOf(mockBlockInfo()));
        when(mockBlockRepository.getBlockByHeight(deepEqual(BigInt(2)))).thenReturn(observableOf(mockBlockInfo(true)));
        when(mockBlockRepository.getMerkleTransaction(deepEqual(BigInt(1)), leaf)).thenReturn(observableOf(mockMerklePath()));
        when(mockBlockRepository.getMerkleTransaction(deepEqual(BigInt(2)), leaf)).thenReturn(observableOf(mockMerklePath()));
        when(mockReceiptRepository.getMerkleReceipts(deepEqual(BigInt(1)), leaf)).thenReturn(observableOf(mockMerklePath()));
        when(mockReceiptRepository.getMerkleReceipts(deepEqual(BigInt(2)), leaf)).thenReturn(observableOf(mockMerklePath()));
        const blockRepository = instance(mockBlockRepository);
        const receiptRepository = instance(mockReceiptRepository);

        when(mockRepoFactory.createBlockRepository()).thenReturn(blockRepository);
        when(mockRepoFactory.createReceiptRepository()).thenReturn(receiptRepository);
        const repoFactory = instance(mockRepoFactory);
        blockService = new BlockService(repoFactory);
    });

    it('should validate transaction', async () => {
        const result = await blockService.validateTransactionInBlock(leaf, BigInt(1)).toPromise();
        expect(result).to.be.true;
    });

    it('should validate transaction - wrong hash', async () => {
        const result = await blockService.validateTransactionInBlock(leaf, BigInt(2)).toPromise();
        expect(result).to.be.false;
    });

    it('should validate statement', async () => {
        const result = await blockService.validateStatementInBlock(leaf, BigInt(1)).toPromise();
        expect(result).to.be.true;
    });

    it('should validate statement - wrong hash', async () => {
        const result = await blockService.validateStatementInBlock(leaf, BigInt(2)).toPromise();
        expect(result).to.be.false;
    });

    function mockBlockInfo(isFake = false): BlockInfo {
        if (isFake) {
            return new BlockInfo(
                'hash',
                'generationHash',
                BigInt('0'),
                1,
                'signature',
                account.publicAccount,
                NetworkType.MIJIN_TEST,
                0,
                0,
                BigInt(1),
                BigInt(0),
                BigInt(0),
                0,
                'previousHash',
                'fakeHash',
                'fakeHash',
                'stateHash',
                undefined,
            );
        }
        return new BlockInfo(
            'hash',
            'generationHash',
            BigInt('0'),
            1,
            'signature',
            account.publicAccount,
            NetworkType.MIJIN_TEST,
            0,
            0,
            BigInt(1),
            BigInt(0),
            BigInt(0),
            0,
            'previousHash',
            mockBlockHash,
            mockBlockHash,
            'stateHash',
            undefined,
        );
    }

    function mockMerklePath(): MerkleProofInfo {
        return new MerkleProofInfo([
            new MerklePathItem(PositionEnum.Left, 'CDE45D740536E5361F392025A44B26546A138958E69CD6F18D22908F8F11ECF2'),
            new MerklePathItem(PositionEnum.Right, '4EF55DAB8FEF9711B23DA71D2ACC58EFFF3969C3D572E06ACB898F99BED4827A'),
            new MerklePathItem(PositionEnum.Left, '1BB95470065ED69D184948A0175EDC2EAB9E86A0CEB47B648A58A02A5445AF66'),
            new MerklePathItem(PositionEnum.Right, 'D96B03809B8B198EFA5824191A979F7B85C0E9B7A6623DAFF38D4B2927EFDFB5'),
            new MerklePathItem(PositionEnum.Right, '9981EBDBCA8E36BA4D4D4A450072026AC8C85BA6497666219E0E049BE3362E51'),
        ]);
    }
});
