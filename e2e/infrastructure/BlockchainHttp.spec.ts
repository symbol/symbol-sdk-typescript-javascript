// /*
//  * Copyright 2018 NEM
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */

// import {expect} from 'chai';
// import {BlockchainHttp} from '../../src/infrastructure/BlockchainHttp';
// import {QueryParams} from '../../src/infrastructure/QueryParams';
// describe('BlockchainHttp', () => {
//     let blockchainHttp: BlockchainHttp;
//     before((done) => {
//         const path = require('path');
//         require('fs').readFile(path.resolve(__dirname, '../conf/network.conf'), (err, data) => {
//             if (err) {
//                 throw err;
//             }
//             const json = JSON.parse(data);
//             blockchainHttp = new BlockchainHttp(json.apiUrl);
//             done();
//         });
//     });
//     describe('getBlockByHeight', () => {
//         it('should return block info given height', (done) => {
//             blockchainHttp.getBlockByHeight(1)
//                 .subscribe((blockInfo) => {
//                     expect(blockInfo.height.lower).to.be.equal(1);
//                     expect(blockInfo.height.higher).to.be.equal(0);
//                     expect(blockInfo.timestamp.lower).to.be.equal(0);
//                     expect(blockInfo.timestamp.higher).to.be.equal(0);
//                     done();
//                 });
//         });
//     });

//     describe('getBlockTransactions', () => {
//         let nextId: string;
//         let firstId: string;

//         it('should return block transactions data given height', (done) => {
//             blockchainHttp.getBlockTransactions(1)
//                 .subscribe((transactions) => {
//                     nextId = transactions[0].transactionInfo!.id;
//                     firstId = transactions[1].transactionInfo!.id;
//                     expect(transactions.length).to.be.greaterThan(0);
//                     done();
//                 });
//         });

//         it('should return block transactions data given height with paginated transactionId', (done) => {
//             blockchainHttp.getBlockTransactions(1, new QueryParams(10, nextId))
//                 .subscribe((transactions) => {
//                     expect(transactions[0].transactionInfo!.id).to.be.equal(firstId);
//                     expect(transactions.length).to.be.greaterThan(0);
//                     done();
//                 });
//         });
//     });

//     describe('getBlocksByHeightWithLimit', () => {
//         it('should return block info given height and limit', (done) => {
//             blockchainHttp.getBlocksByHeightWithLimit(1, 50)
//                 .subscribe((blocksInfo) => {
//                     expect(blocksInfo.length).to.be.greaterThan(0);
//                     done();
//                 });
//         });
//     });

//     describe('getBlockchainHeight', () => {
//         it('should return blockchain height', (done) => {
//             blockchainHttp.getBlockchainHeight()
//                 .subscribe((height) => {
//                     expect(height.lower).to.be.greaterThan(0);
//                     done();
//                 });
//         });
//     });

//     describe('getBlockchainScore', () => {
//         it('should return blockchain score', (done) => {
//             blockchainHttp.getBlockchainScore()
//                 .subscribe((blockchainScore) => {
//                     expect(blockchainScore.scoreLow).to.not.be.equal(undefined);
//                     expect(blockchainScore.scoreHigh.lower).to.be.equal(0);
//                     expect(blockchainScore.scoreHigh.higher).to.be.equal(0);
//                     done();
//                 });
//         });
//     });

//     describe('getDiagnosticStorage', () => {
//         it('should return blockchain diagnostic storage', (done) => {
//             blockchainHttp.getDiagnosticStorage()
//                 .subscribe((blockchainStorageInfo) => {
//                     expect(blockchainStorageInfo.numBlocks).to.be.greaterThan(0);
//                     expect(blockchainStorageInfo.numTransactions).to.be.greaterThan(0);
//                     expect(blockchainStorageInfo.numAccounts).to.be.greaterThan(0);
//                     done();
//                 });
//         });
//     });
// });
