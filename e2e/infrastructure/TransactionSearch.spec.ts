/*
 * Copyright 2020 NEM
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
import { first, take, toArray } from 'rxjs/operators';
import { TransactionPaginationStreamer } from '../../src/infrastructure/paginationStreamer/TransactionPaginationStreamer';
import { TransactionSearchCriteria } from '../../src/infrastructure/searchCriteria/TransactionSearchCriteria';
import { TransactionGroup } from '../../src/infrastructure/TransactionGroup';
import { MosaicId } from '../../src/model/mosaic';
import { TransactionType } from '../../src/model/transaction/TransactionType';
import { TransferTransaction } from '../../src/model/transaction/TransferTransaction';
import { UInt64 } from '../../src/model/UInt64';
import { IntegrationTestHelper } from './IntegrationTestHelper';

describe('TransactionSearch', () => {
    const helper = new IntegrationTestHelper();

    before(() => {
        return helper.start({ openListener: false });
    });

    after(() => {
        return helper.close();
    });

    describe('searchTransactions', () => {
        it('should return transaction info given address', async () => {
            const transactionRepository = helper.repositoryFactory.createTransactionRepository();
            const account = helper.account;
            const transactions = await transactionRepository
                .search({ group: TransactionGroup.Confirmed, address: account.address } as TransactionSearchCriteria)
                .toPromise();
            expect(transactions.data.length).to.be.greaterThan(0);
        });
        it('should return transaction info given height all types', async () => {
            const transactionRepository = helper.repositoryFactory.createTransactionRepository();
            const transactions = await transactionRepository
                .search({ group: TransactionGroup.Confirmed, height: UInt64.fromUint(1) } as TransactionSearchCriteria)
                .toPromise();

            const mosaicDefinitions = transactions.data.filter((t) => t.type == TransactionType.MOSAIC_DEFINITION).length;
            const namespaceRegistration = transactions.data.filter((t) => t.type == TransactionType.NAMESPACE_REGISTRATION).length;
            const others = transactions.data.filter(
                (t) => t.type !== TransactionType.NAMESPACE_REGISTRATION && t.type !== TransactionType.MOSAIC_DEFINITION,
            ).length;
            expect(mosaicDefinitions).to.be.greaterThan(0);
            expect(namespaceRegistration).to.be.greaterThan(0);
            expect(others).to.be.greaterThan(0);
        });

        it('should return transaction info given height and namesapce, mosaic types', async () => {
            const transactionRepository = helper.repositoryFactory.createTransactionRepository();
            const transactions = await transactionRepository
                .search({
                    group: TransactionGroup.Confirmed,
                    height: UInt64.fromUint(1),
                    type: [TransactionType.MOSAIC_DEFINITION, TransactionType.NAMESPACE_REGISTRATION],
                } as TransactionSearchCriteria)
                .toPromise();
            const mosaicDefinitions = transactions.data.filter((t) => t.type == TransactionType.MOSAIC_DEFINITION).length;
            const namespaceRegistration = transactions.data.filter((t) => t.type == TransactionType.NAMESPACE_REGISTRATION).length;
            const others = transactions.data.filter(
                (t) => t.type !== TransactionType.NAMESPACE_REGISTRATION && t.type !== TransactionType.MOSAIC_DEFINITION,
            ).length;
            expect(mosaicDefinitions).to.be.greaterThan(0);
            expect(namespaceRegistration).to.be.greaterThan(0);
            expect(others).to.eq(0);
        });
    });

    describe('searchTransactions using steamer', () => {
        it('should return transaction info given address', async () => {
            const transactionRepository = helper.repositoryFactory.createTransactionRepository();
            const streamer = new TransactionPaginationStreamer(transactionRepository);
            const account = helper.account;
            const transactionsNoStreamer = await transactionRepository
                .search({ group: TransactionGroup.Confirmed, address: account.address, pageSize: 10 } as TransactionSearchCriteria)
                .toPromise();
            const transactions = await streamer
                .search({ group: TransactionGroup.Confirmed, address: account.address, pageSize: 10 })
                .pipe(take(10), toArray())
                .toPromise();
            expect(transactions.length).to.be.greaterThan(0);
            deepEqual(transactionsNoStreamer.data, transactions);
        });

        it('should return transaction info given mosaic id', async () => {
            const transactionRepository = helper.repositoryFactory.createTransactionRepository();
            const streamer = new TransactionPaginationStreamer(transactionRepository);

            const transferTransaction = (await streamer
                .search({
                    embedded: true,
                    group: TransactionGroup.Confirmed,
                    type: [TransactionType.TRANSFER],
                })
                .pipe(first())
                .toPromise()) as TransferTransaction;
            const mosaicId = transferTransaction.mosaics[0].id;

            const criteria: TransactionSearchCriteria = {
                group: TransactionGroup.Confirmed,
                pageSize: 10,
                embedded: true,
                transferMosaicId: mosaicId as MosaicId,
            };

            const transactions = await streamer.search(criteria).pipe(toArray()).toPromise();
            expect(transactions.length).to.be.greaterThan(0);

            transactions.forEach((t) => {
                const mosaicIds = (t as TransferTransaction).mosaics.map((m) => m.id.toHex());
                expect(mosaicIds.indexOf(mosaicId.toHex())).to.be.greaterThan(-1);
            });
        });

        it('should return transaction info given mosaic id and from/to amount', async () => {
            const transactionRepository = helper.repositoryFactory.createTransactionRepository();
            const streamer = new TransactionPaginationStreamer(transactionRepository);

            const transferTransaction = (await streamer
                .search({
                    embedded: true,
                    group: TransactionGroup.Confirmed,
                    type: [TransactionType.TRANSFER],
                })
                .pipe(first())
                .toPromise()) as TransferTransaction;
            const mosaic = transferTransaction.mosaics[0];
            const mosaicId = mosaic.id;

            const criteria: TransactionSearchCriteria = {
                group: TransactionGroup.Confirmed,
                fromTransferAmount: mosaic.amount,
                toTransferAmount: mosaic.amount,
                pageSize: 10,
                embedded: true,
                transferMosaicId: mosaicId as MosaicId,
            };

            const transactions = await streamer.search(criteria).pipe(toArray()).toPromise();
            expect(transactions.length).to.be.greaterThan(0);

            transactions.forEach((t) => {
                const thisTransactionMosaic = (t as TransferTransaction).mosaics.filter((m) => m.id.equals(mosaicId))[0];
                expect(thisTransactionMosaic.id).deep.eq(mosaicId);
                expect(thisTransactionMosaic.amount).deep.eq(mosaic.amount);
            });
        });

        it('should return transaction info given mosaic id and from amount', async () => {
            const transactionRepository = helper.repositoryFactory.createTransactionRepository();
            const streamer = new TransactionPaginationStreamer(transactionRepository);

            const transferTransaction = (await streamer
                .search({
                    embedded: true,
                    group: TransactionGroup.Confirmed,
                    type: [TransactionType.TRANSFER],
                })
                .pipe(first())
                .toPromise()) as TransferTransaction;
            const mosaic = transferTransaction.mosaics[0];
            const mosaicId = mosaic.id;

            const criteria: TransactionSearchCriteria = {
                group: TransactionGroup.Confirmed,
                fromTransferAmount: mosaic.amount,
                pageSize: 10,
                embedded: true,
                transferMosaicId: mosaicId as MosaicId,
            };

            const transactions = await streamer.search(criteria).pipe(toArray()).toPromise();
            expect(transactions.length).to.be.greaterThan(0);

            transactions.forEach((t) => {
                const thisTransactionMosaic = (t as TransferTransaction).mosaics.filter((m) => m.id.equals(mosaicId))[0];
                expect(thisTransactionMosaic.id).deep.eq(mosaicId);
                expect(thisTransactionMosaic.amount.compare(mosaic.amount)).to.be.greaterThan(-1);
            });
        });

        it('should return transaction info given mosaic id and to amount', async () => {
            const transactionRepository = helper.repositoryFactory.createTransactionRepository();
            const streamer = new TransactionPaginationStreamer(transactionRepository);

            const transferTransaction = (await streamer
                .search({
                    embedded: true,
                    group: TransactionGroup.Confirmed,
                    type: [TransactionType.TRANSFER],
                })
                .pipe(first())
                .toPromise()) as TransferTransaction;
            const mosaic = transferTransaction.mosaics[0];
            const mosaicId = mosaic.id;

            const criteria: TransactionSearchCriteria = {
                group: TransactionGroup.Confirmed,
                toTransferAmount: mosaic.amount,
                pageSize: 10,
                embedded: true,
                transferMosaicId: mosaicId as MosaicId,
            };

            const transactions = await streamer.search(criteria).pipe(toArray()).toPromise();
            expect(transactions.length).to.be.greaterThan(0);

            transactions.forEach((t) => {
                const thisTransactionMosaic = (t as TransferTransaction).mosaics.filter((m) => m.id.equals(mosaicId))[0];
                expect(thisTransactionMosaic.id).deep.eq(mosaicId);
                expect(thisTransactionMosaic.amount.compare(mosaic.amount)).to.be.lessThan(1);
            });
        });
    });
});
