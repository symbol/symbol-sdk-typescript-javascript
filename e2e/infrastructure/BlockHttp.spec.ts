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

import {assert, expect} from 'chai';
import {BlockHttp} from '../../src/infrastructure/BlockHttp';
import { Listener, ReceiptHttp, TransactionHttp } from '../../src/infrastructure/infrastructure';
import {QueryParams} from '../../src/infrastructure/QueryParams';
import { Account } from '../../src/model/account/Account';
import { NetworkType } from '../../src/model/blockchain/NetworkType';
import { PlainMessage } from '../../src/model/message/PlainMessage';
import { NetworkCurrencyMosaic } from '../../src/model/mosaic/NetworkCurrencyMosaic';
import { Deadline } from '../../src/model/transaction/Deadline';
import { Transaction } from '../../src/model/transaction/Transaction';
import { TransferTransaction } from '../../src/model/transaction/TransferTransaction';

describe('BlockHttp', () => {
    let account: Account;
    let account2: Account;
    let blockHttp: BlockHttp;
    let receiptHttp: ReceiptHttp;
    let transactionHttp: TransactionHttp;
    let blockReceiptHash = '';
    let blockTransactionHash = '';
    let config;
    let chainHeight;
    let generationHash: string;
    before((done) => {
        const path = require('path');
        require('fs').readFile(path.resolve(__dirname, '../conf/network.conf'), (err, data) => {
            if (err) {
                throw err;
            }
            const json = JSON.parse(data);
            config = json;
            account = Account.createFromPrivateKey(json.testAccount.privateKey, NetworkType.MIJIN_TEST);
            account2 = Account.createFromPrivateKey(json.testAccount2.privateKey, NetworkType.MIJIN_TEST);
            blockHttp = new BlockHttp(json.apiUrl);
            transactionHttp = new TransactionHttp(json.apiUrl);
            receiptHttp = new ReceiptHttp(json.apiUrl);
            generationHash = json.generationHash;
            done();
        });
    });

    /**
     * =========================
     * Setup Test Data
     * =========================
     */

    describe('Setup Test Data', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });

        it('Announce TransferTransaction', (done) => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(),
                account2.address,
                [NetworkCurrencyMosaic.createAbsolute(1)],
                PlainMessage.create('test-message'),
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = transferTransaction.signWith(account, generationHash);

            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                chainHeight = transaction.transactionInfo!.height.toString();
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });

    describe('getBlockByHeight', () => {
        it('should return block info given height', (done) => {
            blockHttp.getBlockByHeight('1')
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
            blockHttp.getBlockTransactions('1')
                .subscribe((transactions) => {
                    nextId = transactions[0].transactionInfo!.id;
                    firstId = transactions[1].transactionInfo!.id;
                    expect(transactions.length).to.be.greaterThan(0);
                    done();
                });
        });

        it('should return block transactions data given height with paginated transactionId', (done) => {
            blockHttp.getBlockTransactions('1', new QueryParams(10, nextId))
                .subscribe((transactions) => {
                    expect(transactions[0].transactionInfo!.id).to.be.equal(firstId);
                    expect(transactions.length).to.be.greaterThan(0);
                    done();
                });
        });
    });

    describe('getBlocksByHeightWithLimit', () => {
        it('should return block info given height and limit', (done) => {
            blockHttp.getBlocksByHeightWithLimit(chainHeight, 50)
                .subscribe((blocksInfo) => {
                    expect(blocksInfo.length).to.be.greaterThan(0);
                    done();
                });
        });
    });
    describe('getMerkleReceipts', () => {
        it('should return Merkle Receipts', (done) => {
            receiptHttp.getMerkleReceipts(chainHeight, blockReceiptHash)
                .subscribe((merkleReceipts) => {
                    expect(merkleReceipts.merklePath).not.to.be.null;
                    done();
                });
        });
    });
    describe('getMerkleTransaction', () => {
        it('should return Merkle Transaction', (done) => {
            blockHttp.getMerkleTransaction(chainHeight, blockTransactionHash)
                .subscribe((merkleTransactionss) => {
                    expect(merkleTransactionss.merklePath).not.to.be.null;
                    done();
                });
        });
    });

    describe('getBlockReceipts', () => {
        it('should return block receipts', (done) => {
            receiptHttp.getBlockReceipts(chainHeight)
                .subscribe((statement) => {
                    expect(statement.transactionStatements).not.to.be.null;
                    expect(statement.transactionStatements.length).to.be.greaterThan(0);
                    done();
                });
        });
    });
});
