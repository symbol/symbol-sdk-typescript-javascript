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

import { assert, expect } from 'chai';
import { ReceiptRepository } from '../../src/infrastructure/ReceiptRepository';
import { TransactionRepository } from '../../src/infrastructure/TransactionRepository';
import { Account } from '../../src/model/account/Account';
import { PlainMessage } from '../../src/model/message/PlainMessage';
import { NetworkType } from '../../src/model/network/NetworkType';
import { Deadline } from '../../src/model/transaction/Deadline';
import { TransferTransaction } from '../../src/model/transaction/TransferTransaction';
import { UInt64 } from '../../src/model/UInt64';
import { BlockService } from '../../src/service/BlockService';
import { NetworkCurrencyLocal } from '../../test/model/mosaic/NetworkCurrency.spec';
import { IntegrationTestHelper } from '../infrastructure/IntegrationTestHelper';
import { TransactionGroup } from '../../src/infrastructure/TransactionGroup';
import { TransactionStatement } from '../../src/model/receipt/TransactionStatement';
import { BlockRepository } from '../../src/infrastructure/BlockRepository';

describe('BlockService', () => {
    const helper = new IntegrationTestHelper();
    let generationHash: string;
    let account: Account;
    let account2: Account;
    let networkType: NetworkType;
    let transactionHash: string;
    let blockService: BlockService;
    let transactionRepository: TransactionRepository;
    let receiptRepository: ReceiptRepository;
    let blockRepository: BlockRepository;

    before(() => {
        return helper.start({ openListener: true }).then(() => {
            account = helper.account;
            account2 = helper.account2;
            generationHash = helper.generationHash;
            networkType = helper.networkType;
            transactionRepository = helper.repositoryFactory.createTransactionRepository();
            receiptRepository = helper.repositoryFactory.createReceiptRepository();
            blockRepository = helper.repositoryFactory.createBlockRepository();
            blockService = new BlockService(helper.repositoryFactory);
        });
    });

    after(() => {
        return helper.close();
    });

    /**
     * =========================
     * Setup test data
     * =========================
     */
    describe('Create a transfer', () => {
        it('Announce TransferTransaction', () => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(helper.epochAdjustment),
                account2.address,
                [NetworkCurrencyLocal.createAbsolute(1)],
                PlainMessage.create('test-message'),
                networkType,
                helper.maxFee,
            );

            const signedTransaction = transferTransaction.signWith(account, generationHash);
            transactionHash = signedTransaction.hash;
            return helper.announce(signedTransaction);
        });
    });

    /**
     * =========================
     * Test
     * =========================
     */

    describe('Validate transactions', () => {
        it('call block service', async () => {
            const transaction = await transactionRepository.getTransaction(transactionHash, TransactionGroup.Confirmed).toPromise();
            const transactionInfo = transaction.transactionInfo;
            if (transactionInfo && transactionInfo.height !== undefined) {
                const validationResult = await blockService.validateTransactionInBlock(transactionHash, transactionInfo.height).toPromise();
                expect(validationResult).to.be.true;
            } else {
                assert(false, `Transaction (hash: ${transactionHash}) not found`);
            }
        });
    });

    describe('Validate receipt', () => {
        it('call block service', async () => {
            const statements = await receiptRepository.searchReceipts({ height: UInt64.fromUint(1) }).toPromise();
            const statement = statements.data[0] as TransactionStatement;
            const validationResult = await blockService.validateStatementInBlock(statement.generateHash(), UInt64.fromUint(1)).toPromise();
            expect(validationResult).to.be.true;
        });
    });

    describe('Calculate merkler transaction root hash', () => {
        it('Calculate merkler transaction root hash', async () => {
            const calculated = await blockService.calculateTransactionsMerkleRootHash(UInt64.fromUint(1)).toPromise();
            const block = await blockRepository.getBlockByHeight(UInt64.fromUint(1)).toPromise();
            const rootHash = block.blockTransactionsHash;
            expect(rootHash).to.be.equal(calculated);
        });
    });
});
