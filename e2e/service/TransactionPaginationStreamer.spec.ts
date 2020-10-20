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

import { concatMap, map, mergeMap, toArray } from 'rxjs/operators';
import { TransactionPaginationStreamer } from '../../src/infrastructure/paginationStreamer/TransactionPaginationStreamer';
import { RepositoryFactory } from '../../src/infrastructure/RepositoryFactory';
import { TransactionSearchCriteria } from '../../src/infrastructure/searchCriteria/TransactionSearchCriteria';
import { TransactionGroup } from '../../src/infrastructure/TransactionGroup';
import { TransactionRepository } from '../../src/infrastructure/TransactionRepository';
import { Account, Address } from '../../src/model/account';
import { BlockInfo } from '../../src/model/blockchain/BlockInfo';
import { MosaicId } from '../../src/model/mosaic';
import { NamespaceId } from '../../src/model/namespace';
import { NetworkType } from '../../src/model/network/NetworkType';
import { TransactionType } from '../../src/model/transaction/TransactionType';
import { TransferTransaction } from '../../src/model/transaction/TransferTransaction';
import { TransactionService } from '../../src/service/TransactionService';
import { IntegrationTestHelper } from '../infrastructure/IntegrationTestHelper';

interface TransactionWithBlock {
    transaction: TransferTransaction;
    block: BlockInfo;
}

describe('TransactionPaginationStreamer', () => {
    const helper = new IntegrationTestHelper();
    let generationHash: string;
    let addressAlias: NamespaceId;
    let mosaicAlias: NamespaceId;
    let mosaicId: MosaicId;
    let newMosaicId: MosaicId;
    let transactionHashes: string[];
    let transactionHashesMultiple: string[];
    let account: Account;
    let account2: Account;
    let account3: Account;
    let cosignAccount4: Account;
    let networkType: NetworkType;
    let transactionService: TransactionService;
    let transactionRepository: TransactionRepository;

    before(() => {
        return helper.start({ openListener: true }).then(() => {
            account = helper.account;
            account2 = helper.account2;
            account3 = helper.account3;
            cosignAccount4 = helper.cosignAccount4;
            generationHash = helper.generationHash;
            networkType = helper.networkType;
            transactionHashes = [];
            transactionHashesMultiple = [];
            transactionRepository = helper.repositoryFactory.createTransactionRepository();
            transactionService = new TransactionService(
                helper.repositoryFactory.createTransactionRepository(),
                helper.repositoryFactory.createReceiptRepository(),
            );
        });
    });

    after(() => {
        return helper.close();
    });

    const getTransactionWithBlocks = (repositoryFactory: RepositoryFactory, address?: Address): Promise<TransactionWithBlock[]> => {
        const transactionRepository = repositoryFactory.createTransactionRepository();
        const blockRepository = repositoryFactory.createBlockRepository();
        const searchCriteria: TransactionSearchCriteria = {
            address: address,
            group: TransactionGroup.Confirmed,
            type: [TransactionType.TRANSFER],
            embedded: true,
            pageSize: 10,
        };

        const streamer = new TransactionPaginationStreamer(transactionRepository);
        const observableOfResults = streamer.search(searchCriteria).pipe(
            mergeMap((transaction) => {
                return blockRepository.getBlockByHeight(transaction.transactionInfo!.height!).pipe(
                    map((block) => {
                        return {
                            transaction: transaction as TransferTransaction,
                            block,
                        };
                    }),
                );
            }),
        );
        return observableOfResults.pipe(toArray()).toPromise();
    };

    describe('Get Transactions', () => {
        it('Transfer with blocks', async () => {
            const transactionWithBlock = await getTransactionWithBlocks(helper.repositoryFactory);
            console.log(transactionWithBlock.length);
        });
    });
});
