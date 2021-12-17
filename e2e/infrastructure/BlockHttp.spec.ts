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
import { firstValueFrom } from 'rxjs';
import { mergeMap, take, toArray } from 'rxjs/operators';
import { Order } from '../../src/infrastructure';
import { BlockRepository } from '../../src/infrastructure/BlockRepository';
import { BlockPaginationStreamer } from '../../src/infrastructure/paginationStreamer/BlockPaginationStreamer';
import { ReceiptPaginationStreamer } from '../../src/infrastructure/paginationStreamer/ReceiptPaginationStreamer';
import { ReceiptRepository } from '../../src/infrastructure/ReceiptRepository';
import { TransactionStatement } from '../../src/model';
import { Account } from '../../src/model/account/Account';
import { PlainMessage } from '../../src/model/message/PlainMessage';
import { NetworkType } from '../../src/model/network/NetworkType';
import { Deadline } from '../../src/model/transaction/Deadline';
import { TransferTransaction } from '../../src/model/transaction/TransferTransaction';
import { UInt64 } from '../../src/model/UInt64';
import { IntegrationTestHelper } from './IntegrationTestHelper';

describe('BlockHttp', () => {
    const helper = new IntegrationTestHelper();
    let account: Account;
    let account2: Account;
    let blockRepository: BlockRepository;
    let receiptRepository: ReceiptRepository;
    let chainHeight;
    let generationHash: string;
    let networkType: NetworkType;
    let transactionHash;

    before(() => {
        return helper.start({ openListener: true }).then(() => {
            account = helper.account;
            account2 = helper.account2;
            generationHash = helper.generationHash;
            networkType = helper.networkType;
            blockRepository = helper.repositoryFactory.createBlockRepository();
            receiptRepository = helper.repositoryFactory.createReceiptRepository();
        });
    });

    after(() => {
        return helper.close();
    });

    /**
     * =========================
     * Setup Test Data
     * =========================
     */

    describe('Setup Test Data', () => {
        it('Announce TransferTransaction FER', () => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(helper.epochAdjustment),
                account2.address,
                [helper.createCurrency(1, false)],
                PlainMessage.create('test-message'),
                networkType,
                helper.maxFee,
            );
            const signedTransaction = transferTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction).then((transaction) => {
                chainHeight = transaction.transactionInfo!.height.toString();
                transactionHash = transaction.transactionInfo?.hash?.toString();
                return chainHeight;
            });
        });
    });

    describe('getBlockByHeight', () => {
        it('should return block info given height', async () => {
            const blockInfo = await firstValueFrom(blockRepository.getBlockByHeight(UInt64.fromUint(1)));
            expect(blockInfo.height.lower).to.be.equal(1);
            expect(blockInfo.height.higher).to.be.equal(0);
            expect(blockInfo.timestamp.lower).to.be.equal(0);
            expect(blockInfo.timestamp.higher).to.be.equal(0);
            expect(blockInfo.beneficiaryAddress).not.to.be.undefined;
            expect(blockInfo.statementsCount).not.to.be.undefined;
        });
    });

    describe('searchBlock', () => {
        it('should return block info given height and limit', async () => {
            const blocksInfo = await firstValueFrom(blockRepository.search({}));
            expect(blocksInfo.data.length).to.be.greaterThan(0);
        });
    });

    describe('searchBlock with streamer', () => {
        it('should return block info given height and limit', async () => {
            const streamer = new BlockPaginationStreamer(blockRepository);
            const blockInfoStreamer = await firstValueFrom(streamer.search({ pageSize: 20 }).pipe(take(20), toArray()));
            const blocksInfo = await firstValueFrom(blockRepository.search({ pageSize: 20 }));
            expect(blockInfoStreamer.length).to.be.greaterThan(0);
            deepEqual(blockInfoStreamer, blocksInfo.data);
        });
    });

    describe('getMerkleReceipts', () => {
        it('should return Merkle Receipts', async () => {
            const merkleReceipts = await firstValueFrom(
                receiptRepository.searchReceipts({ height: chainHeight }).pipe(
                    mergeMap((_) => {
                        return blockRepository.getMerkleReceipts(chainHeight, (_.data[0] as TransactionStatement).generateHash());
                    }),
                ),
            );
            expect(merkleReceipts.merklePath).not.to.be.null;
        });
    });
    describe('getMerkleTransaction', () => {
        it('should return Merkle Transaction', async () => {
            const merkleTransactionss = await firstValueFrom(blockRepository.getMerkleTransaction(chainHeight, transactionHash));
            expect(merkleTransactionss.merklePath).not.to.be.null;
        });
    });

    describe('getBlockReceipts', () => {
        it('should return block receipts', async () => {
            const statement = await firstValueFrom(receiptRepository.searchReceipts({ height: chainHeight }));
            expect(statement.data.length).to.be.greaterThan(0);
        });
    });

    describe('searchReceipt with streamer', () => {
        it('should return receipt info', async () => {
            const streamer = ReceiptPaginationStreamer.transactionStatements(receiptRepository);
            const infoStreamer = await firstValueFrom(
                streamer.search({ pageSize: 20, height: chainHeight, order: Order.Asc }).pipe(take(20), toArray()),
            );
            const info = await firstValueFrom(receiptRepository.searchReceipts({ pageSize: 20, height: chainHeight, order: Order.Asc }));
            expect(infoStreamer.length).to.be.greaterThan(0);
            deepEqual(infoStreamer[0], info.data[0]);
        });
    });
});
