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

import { expect } from 'chai';
import { mergeMap } from 'rxjs/operators';
import { BlockHttp } from '../../src/infrastructure/BlockHttp';
import { QueryParams } from '../../src/infrastructure/QueryParams';
import { Account } from '../../src/model/account/Account';
import { NetworkType } from '../../src/model/blockchain/NetworkType';
import { PlainMessage } from '../../src/model/message/PlainMessage';
import { NetworkCurrencyMosaic } from '../../src/model/mosaic/NetworkCurrencyMosaic';
import { Deadline } from '../../src/model/transaction/Deadline';
import { TransactionInfo } from '../../src/model/transaction/TransactionInfo';
import { TransferTransaction } from '../../src/model/transaction/TransferTransaction';
import { IntegrationTestHelper } from "./IntegrationTestHelper";
import { BlockRepository } from "../../src/infrastructure/BlockRepository";
import { ReceiptRepository } from "../../src/infrastructure/ReceiptRepository";

describe('BlockHttp', () => {
    let helper = new IntegrationTestHelper();
    let account: Account;
    let account2: Account;
    let blockRepository: BlockRepository;
    let receiptRepository: ReceiptRepository;
    let blockReceiptHash = '';
    let blockTransactionHash = '';
    let chainHeight;
    let generationHash: string;
    let networkType: NetworkType;

    before(() => {
        return helper.start().then(() => {
            account = helper.account;
            account2 = helper.account2;
            generationHash = helper.generationHash;
            networkType = helper.networkType;
            blockRepository = helper.repositoryFactory.createBlockRepository();
            receiptRepository = helper.repositoryFactory.createReceiptRepository();
        });
    });

    before(() => {
        return helper.listener.open();
    });

    after(() => {
        helper.listener.close();
    });
    afterEach((done) => {
        // cold down
        setTimeout(done, 200);
    });

    /**
     * =========================
     * Setup Test Data
     * =========================
     */

    describe('Setup Test Data', () => {


        it('Announce TransferTransaction', (done) => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(),
                account2.address,
                [NetworkCurrencyMosaic.createAbsolute(1)],
                PlainMessage.create('test-message'),
                networkType,
                helper.maxFee
            );
            const signedTransaction = transferTransaction.signWith(account, generationHash);
            helper.announce(signedTransaction).then(transaction => {
                chainHeight = transaction.transactionInfo!.height.toString();
                return transaction;
            });
        });
    });

    describe('getBlockByHeight', () => {
        it('should return block info given height', (done) => {
            blockRepository.getBlockByHeight('1')
            .subscribe((blockInfo) => {
                blockReceiptHash = blockInfo.blockReceiptsHash;
                blockTransactionHash = blockInfo.blockTransactionsHash;
                expect(blockInfo.height.lower).to.be.equal(1);
                expect(blockInfo.height.higher).to.be.equal(0);
                expect(blockInfo.timestamp.lower).to.be.equal(0);
                expect(blockInfo.timestamp.higher).to.be.equal(0);
                done();
            });
        });
    });

    describe('getBlockTransactions', () => {
        let nextId: string;
        let firstId: string;

        it('should return block transactions data given height', (done) => {
            blockRepository.getBlockTransactions('1')
            .subscribe((transactions) => {
                nextId = transactions[0].transactionInfo!.id;
                firstId = transactions[1].transactionInfo!.id;
                expect(transactions.length).to.be.greaterThan(0);
                done();
            });
        });

        it('should return block transactions data given height with paginated transactionId', (done) => {
            blockRepository.getBlockTransactions('1', new QueryParams(10, nextId))
            .subscribe((transactions) => {
                expect(transactions[0].transactionInfo!.id).to.be.equal(firstId);
                expect(transactions.length).to.be.greaterThan(0);
                done();
            });
        });
    });

    describe('getBlocksByHeightWithLimit', () => {
        it('should return block info given height and limit', (done) => {
            blockRepository.getBlocksByHeightWithLimit(chainHeight, 50)
            .subscribe((blocksInfo) => {
                expect(blocksInfo.length).to.be.greaterThan(0);
                done();
            });
        });
    });
    describe('getMerkleReceipts', () => {
        it('should return Merkle Receipts', (done) => {
            receiptRepository.getBlockReceipts(chainHeight).pipe(
                mergeMap((_) => {
                    return receiptRepository.getMerkleReceipts(chainHeight, _.transactionStatements[0].generateHash());
                }))
            .subscribe((merkleReceipts) => {
                expect(merkleReceipts.merklePath).not.to.be.null;
                done();
            });
        });
    });
    describe('getMerkleTransaction', () => {
        it('should return Merkle Transaction', (done) => {
            blockRepository.getBlockTransactions(chainHeight).pipe(
                mergeMap((_) => {
                    const hash = (_[0].transactionInfo as TransactionInfo).hash;
                    if (hash) {
                        return blockRepository.getMerkleTransaction(chainHeight, hash);
                    }
                    // If reaching this line, something is not right
                    throw new Error('Tansacation hash is undefined');
                }))
            .subscribe((merkleTransactionss) => {
                expect(merkleTransactionss.merklePath).not.to.be.null;
                done();
            });
        });
    });

    describe('getBlockReceipts', () => {
        it('should return block receipts', (done) => {
            receiptRepository.getBlockReceipts(chainHeight)
            .subscribe((statement) => {
                expect(statement.transactionStatements).not.to.be.null;
                expect(statement.transactionStatements.length).to.be.greaterThan(0);
                done();
            });
        });
    });
});
