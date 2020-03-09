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
import { BlockRepository } from '../../src/infrastructure/BlockRepository';
import { QueryParams } from '../../src/infrastructure/QueryParams';
import { ReceiptRepository } from '../../src/infrastructure/ReceiptRepository';
import { Account } from '../../src/model/account/Account';
import { NetworkType } from '../../src/model/network/NetworkType';
import { PlainMessage } from '../../src/model/message/PlainMessage';
import { NetworkCurrencyLocal } from '../../src/model/mosaic/NetworkCurrencyLocal';
import { Deadline } from '../../src/model/transaction/Deadline';
import { TransactionInfo } from '../../src/model/transaction/TransactionInfo';
import { TransferTransaction } from '../../src/model/transaction/TransferTransaction';
import { UInt64 } from '../../src/model/UInt64';
import { IntegrationTestHelper } from './IntegrationTestHelper';

describe('BlockHttp', () => {
    const helper = new IntegrationTestHelper();
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

    /**
     * =========================
     * Setup Test Data
     * =========================
     */

    describe('Setup Test Data', () => {

        it('Announce TransferTransaction', () => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(),
                account2.address,
                [NetworkCurrencyLocal.createAbsolute(1)],
                PlainMessage.create('test-message'),
                networkType,
                helper.maxFee,
            );
            const signedTransaction = transferTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction).then((transaction) => {
                chainHeight = transaction.transactionInfo!.height.toString();
                return chainHeight;
            });
        });
    });

    describe('getBlockByHeight', () => {
        it('should return block info given height', async () => {
            const blockInfo = await blockRepository.getBlockByHeight(UInt64.fromUint(1)).toPromise();
            blockReceiptHash = blockInfo.blockReceiptsHash;
            blockTransactionHash = blockInfo.blockTransactionsHash;
            expect(blockInfo.height.lower).to.be.equal(1);
            expect(blockInfo.height.higher).to.be.equal(0);
            expect(blockInfo.timestamp.lower).to.be.equal(0);
            expect(blockInfo.timestamp.higher).to.be.equal(0);
            expect(blockInfo.beneficiaryPublicKey).not.to.be.undefined;
            expect(blockInfo.numStatements).not.to.be.undefined;
        });
    });

    describe('getBlockTransactions', () => {
        let nextId: string;
        let firstId: string;

        it('should return block transactions data given height', async () => {
            const transactions = await blockRepository.getBlockTransactions(UInt64.fromUint(1)).toPromise();
            nextId = transactions[0].transactionInfo!.id;
            firstId = transactions[1].transactionInfo!.id;
            expect(transactions.length).to.be.greaterThan(0);
        });

        it('should return block transactions data given height with paginated transactionId', async () => {
            const transactions = await blockRepository.getBlockTransactions(UInt64.fromUint(1),
                new QueryParams({ pageSize: 10, id: nextId})).toPromise();
            expect(transactions[0].transactionInfo!.id).to.be.equal(firstId);
            expect(transactions.length).to.be.greaterThan(0);
        });
    });

    describe('getBlocksByHeightWithLimit', () => {
        it('should return block info given height and limit', async () => {
            const blocksInfo = await blockRepository.getBlocksByHeightWithLimit(chainHeight, 50).toPromise();
            expect(blocksInfo.length).to.be.greaterThan(0);
        });
    });
    describe('getMerkleReceipts', () => {
        it('should return Merkle Receipts', async () => {
            const merkleReceipts = await receiptRepository.getBlockReceipts(chainHeight).pipe(
                mergeMap((_) => {
                    return receiptRepository.getMerkleReceipts(chainHeight, _.transactionStatements[0].generateHash());
                })).toPromise();
            expect(merkleReceipts.merklePath).not.to.be.null;
        });
    });
    describe('getMerkleTransaction', () => {
        it('should return Merkle Transaction', async () => {
            const merkleTransactionss = await blockRepository.getBlockTransactions(chainHeight).pipe(
                mergeMap((_) => {
                    const hash = (_[0].transactionInfo as TransactionInfo).hash;
                    if (hash) {
                        return blockRepository.getMerkleTransaction(chainHeight, hash);
                    }
                    // If reaching this line, something is not right
                    throw new Error('Tansacation hash is undefined');
                })).toPromise();
            expect(merkleTransactionss.merklePath).not.to.be.null;
        });
    });

    describe('getBlockReceipts', () => {
        it('should return block receipts', async () => {
            const statement = await receiptRepository.getBlockReceipts(chainHeight).toPromise();
            expect(statement.transactionStatements).not.to.be.null;
            expect(statement.transactionStatements.length).to.be.greaterThan(0);
        });
    });
});
