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
import { deepEqual, instance, mock, when } from 'ts-mockito';
import { BlockRepository } from '../../src/infrastructure/BlockRepository';
import { Page } from '../../src/infrastructure/Page';
import { ReceiptRepository } from '../../src/infrastructure/ReceiptRepository';
import { RepositoryFactory } from '../../src/infrastructure/RepositoryFactory';
import { TransactionGroup } from '../../src/infrastructure/TransactionGroup';
import { TransactionRepository } from '../../src/infrastructure/TransactionRepository';
import { Deadline, TransactionInfo } from '../../src/model';
import { Account } from '../../src/model/account/Account';
import { BlockInfo } from '../../src/model/blockchain/BlockInfo';
import { MerklePathItem } from '../../src/model/blockchain/MerklePathItem';
import { MerklePosition } from '../../src/model/blockchain/MerklePosition';
import { MerkleProofInfo } from '../../src/model/blockchain/MerkleProofInfo';
import { NormalBlockInfo } from '../../src/model/blockchain/NomalBlockInfo';
import { PlainMessage } from '../../src/model/message/PlainMessage';
import { NetworkType } from '../../src/model/network/NetworkType';
import { Transaction } from '../../src/model/transaction/Transaction';
import { TransferTransaction } from '../../src/model/transaction/TransferTransaction';
import { UInt64 } from '../../src/model/UInt64';
import { BlockService } from '../../src/service/BlockService';
import { TestingAccount } from '../conf/conf.spec';

describe('BlockService', () => {
    const mockBlockHash = 'D4EC16FCFE696EFDBF1820F68245C88135ACF4C6F888599C8E18BC09B9F08C7B';
    const leaf = '2717C8AAB0A21896D0C56375209E761F84383C3882F37A11D9D0159007263EB2';
    let blockService: BlockService;
    let account: Account;

    function mockBlockInfo(isFake = false): BlockInfo {
        if (isFake) {
            return new NormalBlockInfo(
                'id',
                1,
                'hash',
                'generationHash',
                UInt64.fromNumericString('0'),
                ['hash'],
                1,
                'signature',
                account.publicAccount,
                NetworkType.PRIVATE_TEST,
                0,
                0,
                UInt64.fromUint(1),
                UInt64.fromUint(0),
                UInt64.fromUint(0),
                0,
                'previousHash',
                'fakeHash',
                'fakeHash',
                'fakeHash',
                'fakeHash',
                'fakeHash',
                'stateHash',
                account.address,
                0,
                0,
            );
        }
        return new NormalBlockInfo(
            'id',
            1,
            'hash',
            'generationHash',
            UInt64.fromNumericString('0'),
            ['hash'],
            1,
            'signature',
            account.publicAccount,
            NetworkType.PRIVATE_TEST,
            0,
            0,
            UInt64.fromUint(1),
            UInt64.fromUint(0),
            UInt64.fromUint(0),
            0,
            'previousHash',
            mockBlockHash,
            mockBlockHash,
            'fakeHash',
            'fakeHash',
            'fakeHash',
            'stateHash',
            account.address,
            0,
            0,
        );
    }

    function mockMerklePath(emtpy = false): MerkleProofInfo {
        return new MerkleProofInfo(
            emtpy
                ? []
                : [
                      new MerklePathItem(MerklePosition.Left, 'CDE45D740536E5361F392025A44B26546A138958E69CD6F18D22908F8F11ECF2'),
                      new MerklePathItem(MerklePosition.Right, '4EF55DAB8FEF9711B23DA71D2ACC58EFFF3969C3D572E06ACB898F99BED4827A'),
                      new MerklePathItem(MerklePosition.Left, '1BB95470065ED69D184948A0175EDC2EAB9E86A0CEB47B648A58A02A5445AF66'),
                      new MerklePathItem(MerklePosition.Right, 'D96B03809B8B198EFA5824191A979F7B85C0E9B7A6623DAFF38D4B2927EFDFB5'),
                      new MerklePathItem(MerklePosition.Right, '9981EBDBCA8E36BA4D4D4A450072026AC8C85BA6497666219E0E049BE3362E51'),
                  ],
        );
    }

    function mockTransactions(): Page<Transaction> {
        const tx = new TransferTransaction(
            NetworkType.TEST_NET,
            1,
            Deadline.createEmtpy(),
            UInt64.fromUint(0),
            TestingAccount.address,
            [],
            PlainMessage.create(''),
            undefined,
            undefined,
            new TransactionInfo(UInt64.fromUint(1), 0, 'id', 'DCD14A040BC5096348FC55CACBD0D459DD6F81779C7E7C526EA52309BD6595F7'),
        );
        return new Page<Transaction>([tx], 1, 20);
    }

    before(() => {
        account = TestingAccount;
        const mockBlockRepository = mock<BlockRepository>();
        const mockReceiptRepository = mock<ReceiptRepository>();
        const mockTransactionReposity = mock<TransactionRepository>();
        const mockRepoFactory = mock<RepositoryFactory>();

        when(mockBlockRepository.getBlockByHeight(deepEqual(UInt64.fromUint(1)))).thenReturn(observableOf(mockBlockInfo()));
        when(mockBlockRepository.getBlockByHeight(deepEqual(UInt64.fromUint(4)))).thenReturn(observableOf(mockBlockInfo()));
        when(mockBlockRepository.getBlockByHeight(deepEqual(UInt64.fromUint(2)))).thenReturn(observableOf(mockBlockInfo(true)));
        when(mockBlockRepository.getBlockByHeight(deepEqual(UInt64.fromUint(3)))).thenReject(new Error());
        when(mockBlockRepository.getMerkleTransaction(deepEqual(UInt64.fromUint(1)), leaf)).thenReturn(observableOf(mockMerklePath()));
        when(mockBlockRepository.getMerkleTransaction(deepEqual(UInt64.fromUint(2)), leaf)).thenReturn(observableOf(mockMerklePath()));
        when(mockBlockRepository.getMerkleTransaction(deepEqual(UInt64.fromUint(3)), leaf)).thenReject(new Error());
        when(mockBlockRepository.getMerkleTransaction(deepEqual(UInt64.fromUint(4)), leaf)).thenReturn(observableOf(mockMerklePath(true)));
        when(mockBlockRepository.getMerkleReceipts(deepEqual(UInt64.fromUint(1)), leaf)).thenReturn(observableOf(mockMerklePath()));
        when(mockBlockRepository.getMerkleReceipts(deepEqual(UInt64.fromUint(2)), leaf)).thenReturn(observableOf(mockMerklePath()));
        when(mockBlockRepository.getMerkleReceipts(deepEqual(UInt64.fromUint(3)), leaf)).thenReject(new Error());
        when(
            mockTransactionReposity.search(
                deepEqual({
                    group: TransactionGroup.Confirmed,
                    height: UInt64.fromUint(1),
                    pageNumber: 1,
                }),
            ),
        ).thenReturn(observableOf(mockTransactions()));
        const blockRepository = instance(mockBlockRepository);
        const receiptRepository = instance(mockReceiptRepository);
        const transactionRepository = instance(mockTransactionReposity);

        when(mockRepoFactory.createBlockRepository()).thenReturn(blockRepository);
        when(mockRepoFactory.createReceiptRepository()).thenReturn(receiptRepository);
        when(mockRepoFactory.createTransactionRepository()).thenReturn(transactionRepository);
        const repoFactory = instance(mockRepoFactory);
        blockService = new BlockService(repoFactory);
    });

    it('should validate transaction', async () => {
        const result = await blockService.validateTransactionInBlock(leaf, UInt64.fromUint(1)).toPromise();
        expect(result).to.be.true;
    });

    it('should validate transaction - wrong hash', async () => {
        const result = await blockService.validateTransactionInBlock(leaf, UInt64.fromUint(2)).toPromise();
        expect(result).to.be.false;
    });

    it('should validate transaction - emtpy path item', async () => {
        const result = await blockService.validateTransactionInBlock(leaf, UInt64.fromUint(4)).toPromise();
        expect(result).to.be.false;
    });

    it('should validate transaction - error', async () => {
        const result = await blockService.validateTransactionInBlock(leaf, UInt64.fromUint(3)).toPromise();
        expect(result).to.be.false;
    });

    it('should validate statement', async () => {
        const result = await blockService.validateStatementInBlock(leaf, UInt64.fromUint(1)).toPromise();
        expect(result).to.be.true;
    });

    it('should validate statement - wrong hash', async () => {
        const result = await blockService.validateStatementInBlock(leaf, UInt64.fromUint(2)).toPromise();
        expect(result).to.be.false;
    });

    it('should validate statement - error', async () => {
        const result = await blockService.validateStatementInBlock(leaf, UInt64.fromUint(3)).toPromise();
        expect(result).to.be.false;
    });

    it('should calculate root transaction merkle hash', async () => {
        const result = await blockService.calculateTransactionsMerkleRootHash(UInt64.fromUint(1)).toPromise();
        expect(result).to.be.equal('DCD14A040BC5096348FC55CACBD0D459DD6F81779C7E7C526EA52309BD6595F7');
    });
});
