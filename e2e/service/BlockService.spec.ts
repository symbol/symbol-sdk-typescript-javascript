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
import { NetworkType } from '../../src/model/blockchain/NetworkType';
import { PlainMessage } from '../../src/model/message/PlainMessage';
import { NetworkCurrencyMosaic } from '../../src/model/mosaic/NetworkCurrencyMosaic';
import { Deadline } from '../../src/model/transaction/Deadline';
import { TransferTransaction } from '../../src/model/transaction/TransferTransaction';
import { UInt64 } from '../../src/model/UInt64';
import { BlockService } from '../../src/service/BlockService';
import { IntegrationTestHelper } from '../infrastructure/IntegrationTestHelper';

describe('BlockService', () => {
    const helper = new IntegrationTestHelper();
    let generationHash: string;
    let account: Account;
    let account2: Account;
    let account3: Account;
    let networkType: NetworkType;
    let transactionHash: string;
    let blockService: BlockService;
    let transactionRepository: TransactionRepository;
    let receiptRepository: ReceiptRepository;

    before(() => {
        return helper.start().then(() => {
            account = helper.account;
            account2 = helper.account2;
            account3 = helper.account3;
            generationHash = helper.generationHash;
            networkType = helper.networkType;
            transactionRepository = helper.repositoryFactory.createTransactionRepository();
            receiptRepository = helper.repositoryFactory.createReceiptRepository();
            blockService = new BlockService(helper.repositoryFactory.createBlockRepository(), receiptRepository);
        });
    });
    before(() => {
        return helper.listener.open();
    });

    after(() => {
        helper.listener.close();
    });

    /**
     * =========================
     * Setup test data
     * =========================
     */
    describe('Create a transfer', () => {
        it('Announce TransferTransaction', () => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(),
                account2.address,
                [NetworkCurrencyMosaic.createAbsolute(1)],
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

    describe('Validate transansaction', () => {
        it('call block service', () => {
            return transactionRepository.getTransaction(transactionHash).subscribe(
                (transaction) => {
                    const transactionInfo = transaction.transactionInfo;
                    if (transactionInfo && transactionInfo.height !== undefined) {
                        const validationResult = blockService.validateTransactionInBlock(transactionHash, transactionInfo.height);
                        expect(validationResult).to.be.true;
                    }
                    assert(false, `Transaction (hash: ${transactionHash}) not found`);
                },
            );
        });
    });

    describe('Validate receipt', () => {
        it('call block service', () => {
            return receiptRepository.getBlockReceipts(UInt64.fromUint(1)).subscribe(
                (statement) => {
                    const receipt = statement.transactionStatements[0];
                    const validationResult = blockService.validateReceiptInBlock(receipt.generateHash(), UInt64.fromUint(1));
                    expect(validationResult).to.be.true;
                },
            );
        });
    });

});
