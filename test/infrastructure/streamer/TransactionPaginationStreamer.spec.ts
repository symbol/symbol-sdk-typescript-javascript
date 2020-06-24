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
import { TransactionGroup } from '../../../src/infrastructure/TransactionGroup';
import { TransactionRepository } from '../../../src/infrastructure/TransactionRepository';
import { PaginationStreamerTestHelper } from './PaginationStreamerTestHelper';

describe('TransactionPaginationStreamer', () => {
    it('basicMultiPageTest', () => {
        const transactionRepositoryMock: TransactionRepository = mock();
        const streamer = new TransactionPaginationStreamer(instance(transactionRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), transactionRepositoryMock, {
            group: TransactionGroup.Confirmed,
        });
        return tester.basicMultiPageTest();
    });

    it('basicSinglePageTest', () => {
        const transactionRepositoryMock: TransactionRepository = mock();
        const streamer = new TransactionPaginationStreamer(instance(transactionRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), transactionRepositoryMock, {
            group: TransactionGroup.Confirmed,
        });
        return tester.basicSinglePageTest();
    });

    it('limitToTwoPages', () => {
        const transactionRepositoryMock: TransactionRepository = mock();
        const streamer = new TransactionPaginationStreamer(instance(transactionRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), transactionRepositoryMock, {
            group: TransactionGroup.Confirmed,
        });
        return tester.limitToTwoPages();
    });

    it('multipageWithLimit', () => {
        const transactionRepositoryMock: TransactionRepository = mock();
        const streamer = new TransactionPaginationStreamer(instance(transactionRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), transactionRepositoryMock, {
            group: TransactionGroup.Confirmed,
        });
        return tester.multipageWithLimit();
    });

    it('limitToThreePages', () => {
        const transactionRepositoryMock: TransactionRepository = mock();
        const streamer = new TransactionPaginationStreamer(instance(transactionRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), transactionRepositoryMock, {
            group: TransactionGroup.Confirmed,
        });
        return tester.limitToThreePages();
    });

    it('basicMultiPageTest', () => {
        const transactionRepositoryMock: TransactionRepository = mock();
        const streamer = new TransactionPaginationStreamer(instance(transactionRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), transactionRepositoryMock, {
            group: TransactionGroup.Confirmed,
        });
        return tester.basicMultiPageTest();
    });

    it('basicSinglePageTest', () => {
        const transactionRepositoryMock: TransactionRepository = mock();
        const streamer = new TransactionPaginationStreamer(instance(transactionRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), transactionRepositoryMock, {
            group: TransactionGroup.Unconfirmed,
        });
        return tester.basicSinglePageTest();
    });

    it('limitToTwoPages', () => {
        const transactionRepositoryMock: TransactionRepository = mock();
        const streamer = new TransactionPaginationStreamer(instance(transactionRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), transactionRepositoryMock, {
            group: TransactionGroup.Unconfirmed,
        });
        return tester.limitToTwoPages();
    });

    it('multipageWithLimit', () => {
        const transactionRepositoryMock: TransactionRepository = mock();
        const streamer = new TransactionPaginationStreamer(instance(transactionRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), transactionRepositoryMock, {
            group: TransactionGroup.Unconfirmed,
        });
        return tester.multipageWithLimit();
    });

    it('limitToThreePages', () => {
        const transactionRepositoryMock: TransactionRepository = mock();
        const streamer = new TransactionPaginationStreamer(instance(transactionRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), transactionRepositoryMock, {
            group: TransactionGroup.Unconfirmed,
        });
        return tester.limitToThreePages();
    });

    it('basicSinglePageTest', () => {
        const transactionRepositoryMock: TransactionRepository = mock();
        const streamer = new TransactionPaginationStreamer(instance(transactionRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), transactionRepositoryMock, {
            group: TransactionGroup.Partial,
        });
        return tester.basicSinglePageTest();
    });

    it('limitToTwoPages', () => {
        const transactionRepositoryMock: TransactionRepository = mock();
        const streamer = new TransactionPaginationStreamer(instance(transactionRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), transactionRepositoryMock, {
            group: TransactionGroup.Partial,
        });
        return tester.limitToTwoPages();
    });

    it('multipageWithLimit', () => {
        const transactionRepositoryMock: TransactionRepository = mock();
        const streamer = new TransactionPaginationStreamer(instance(transactionRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), transactionRepositoryMock, {
            group: TransactionGroup.Unconfirmed,
        });
        return tester.multipageWithLimit();
    });

    it('limitToThreePages', () => {
        const transactionRepositoryMock: TransactionRepository = mock();
        const streamer = new TransactionPaginationStreamer(instance(transactionRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), transactionRepositoryMock, {
            group: TransactionGroup.Partial,
        });
        return tester.limitToThreePages();
    });
});
