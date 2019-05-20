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

import {expect} from 'chai';
import {BlockHttp} from '../../src/infrastructure/BlockHttp';
import {QueryParams} from '../../src/infrastructure/QueryParams';

describe('BlockHttp', () => {
    let blockHttp: BlockHttp;
    let blockReceiptHash = '';
    let blockTransactionHash = '';
    before((done) => {
        const path = require('path');
        require('fs').readFile(path.resolve(__dirname, '../conf/network.conf'), (err, data) => {
            if (err) {
                throw err;
            }
            const json = JSON.parse(data);
            blockHttp = new BlockHttp(json.apiUrl);
            done();
        });
    });
    describe('getBlockByHeight', () => {
        it('should return block info given height', (done) => {
            blockHttp.getBlockByHeight(1)
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
            blockHttp.getBlockTransactions(1)
                .subscribe((transactions) => {
                    nextId = transactions[0].transactionInfo!.id;
                    firstId = transactions[1].transactionInfo!.id;
                    expect(transactions.length).to.be.greaterThan(0);
                    done();
                });
        });

        it('should return block transactions data given height with paginated transactionId', (done) => {
            blockHttp.getBlockTransactions(1, new QueryParams(10, nextId))
                .subscribe((transactions) => {
                    expect(transactions[0].transactionInfo!.id).to.be.equal(firstId);
                    expect(transactions.length).to.be.greaterThan(0);
                    done();
                });
        });
    });

    describe('getBlocksByHeightWithLimit', () => {
        it('should return block info given height and limit', (done) => {
            blockHttp.getBlocksByHeightWithLimit(1, 50)
                .subscribe((blocksInfo) => {
                    expect(blocksInfo.length).to.be.greaterThan(0);
                    done();
                });
        });
    });
    describe('getMerkleReceipts', () => {
        it('should return Merkle Receipts', (done) => {
            blockHttp.getMerkleReceipts(1, blockReceiptHash)
                .subscribe((merkleReceipts) => {
                    expect(merkleReceipts.type).not.to.be.null;
                    expect(merkleReceipts.payload).not.to.be.null;
                    done();
                });
        });
    });
    describe('getMerkleTransaction', () => {
        it('should return Merkle Transaction', (done) => {
            blockHttp.getMerkleTransaction(1, blockTransactionHash)
                .subscribe((merkleTransactionss) => {
                    expect(merkleTransactionss.type).not.to.be.null;
                    expect(merkleTransactionss.payload).not.to.be.null;
                    done();
                });
        });
    });

    // describe('getBlockReceipts', () => {
    //     it('should return block receipts', (done) => {
    //         blockHttp.(1, '')
    //             .subscribe((merkleTransactionss) => {
    //                 expect(merkleTransactionss.type).not.to.be.null;
    //                 expect(merkleTransactionss.payload).not.to.be.null;
    //                 done();
    //             });
    //     });
    // });
});
