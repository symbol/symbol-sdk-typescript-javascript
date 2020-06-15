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

import { instance, mock } from 'ts-mockito';
import { TransactionPaginationStreamer } from '../../../src/infrastructure/paginationStreamer/TransactionPaginationStreamer';
import { TransactionRepository } from '../../../src/infrastructure/TransactionRepository';
import { PaginationStreamerTestHelper } from './PaginationStreamerTestHelper';
import { TransactionSearchGroup } from '../../../src/infrastructure/TransactionSearchGroup';

describe('TransactionPaginationStreamer', () => {
    it('basicMultiPageTest', () => {
        const transactionRepositoryMock: TransactionRepository = mock();
        const streamer = new TransactionPaginationStreamer(instance(transactionRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), transactionRepositoryMock, {
            group: TransactionSearchGroup.Confirmed,
        });
        return tester.basicMultiPageTest();
    });

    it('basicSinglePageTest', () => {
        const transactionRepositoryMock: TransactionRepository = mock();
        const streamer = new TransactionPaginationStreamer(instance(transactionRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), transactionRepositoryMock, {
            group: TransactionSearchGroup.Confirmed,
        });
        return tester.basicSinglePageTest();
    });

    it('limitToTwoPages', () => {
        const transactionRepositoryMock: TransactionRepository = mock();
        const streamer = new TransactionPaginationStreamer(instance(transactionRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), transactionRepositoryMock, {
            group: TransactionSearchGroup.Confirmed,
        });
        return tester.limitToTwoPages();
    });

    it('multipageWithLimit', () => {
        const transactionRepositoryMock: TransactionRepository = mock();
        const streamer = new TransactionPaginationStreamer(instance(transactionRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), transactionRepositoryMock, {
            group: TransactionSearchGroup.Confirmed,
        });
        return tester.multipageWithLimit();
    });

    it('limitToThreePages', () => {
        const transactionRepositoryMock: TransactionRepository = mock();
        const streamer = new TransactionPaginationStreamer(instance(transactionRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), transactionRepositoryMock, {
            group: TransactionSearchGroup.Confirmed,
        });
        return tester.limitToThreePages();
    });

    it('basicMultiPageTest', () => {
        const transactionRepositoryMock: TransactionRepository = mock();
        const streamer = new TransactionPaginationStreamer(instance(transactionRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), transactionRepositoryMock, {
            group: TransactionSearchGroup.Confirmed,
        });
        return tester.basicMultiPageTest();
    });

    it('basicSinglePageTest', () => {
        const transactionRepositoryMock: TransactionRepository = mock();
        const streamer = new TransactionPaginationStreamer(instance(transactionRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), transactionRepositoryMock, {
            group: TransactionSearchGroup.Unconfirmed,
        });
        return tester.basicSinglePageTest();
    });

    it('limitToTwoPages', () => {
        const transactionRepositoryMock: TransactionRepository = mock();
        const streamer = new TransactionPaginationStreamer(instance(transactionRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), transactionRepositoryMock, {
            group: TransactionSearchGroup.Unconfirmed,
        });
        return tester.limitToTwoPages();
    });

    it('multipageWithLimit', () => {
        const transactionRepositoryMock: TransactionRepository = mock();
        const streamer = new TransactionPaginationStreamer(instance(transactionRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), transactionRepositoryMock, {
            group: TransactionSearchGroup.Unconfirmed,
        });
        return tester.multipageWithLimit();
    });

    it('limitToThreePages', () => {
        const transactionRepositoryMock: TransactionRepository = mock();
        const streamer = new TransactionPaginationStreamer(instance(transactionRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), transactionRepositoryMock, {
            group: TransactionSearchGroup.Unconfirmed,
        });
        return tester.limitToThreePages();
    });

    it('basicSinglePageTest', () => {
        const transactionRepositoryMock: TransactionRepository = mock();
        const streamer = new TransactionPaginationStreamer(instance(transactionRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), transactionRepositoryMock, {
            group: TransactionSearchGroup.Partial,
        });
        return tester.basicSinglePageTest();
    });

    it('limitToTwoPages', () => {
        const transactionRepositoryMock: TransactionRepository = mock();
        const streamer = new TransactionPaginationStreamer(instance(transactionRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), transactionRepositoryMock, {
            group: TransactionSearchGroup.Partial,
        });
        return tester.limitToTwoPages();
    });

    it('multipageWithLimit', () => {
        const transactionRepositoryMock: TransactionRepository = mock();
        const streamer = new TransactionPaginationStreamer(instance(transactionRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), transactionRepositoryMock, {
            group: TransactionSearchGroup.Unconfirmed,
        });
        return tester.multipageWithLimit();
    });

    it('limitToThreePages', () => {
        const transactionRepositoryMock: TransactionRepository = mock();
        const streamer = new TransactionPaginationStreamer(instance(transactionRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), transactionRepositoryMock, {
            group: TransactionSearchGroup.Partial,
        });
        return tester.limitToThreePages();
    });
});
