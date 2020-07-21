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
import { ReceiptPaginationStreamer } from '../../../src/infrastructure/paginationStreamer/ReceiptPaginationStreamer';
import { PaginationStreamerTestHelper } from './PaginationStreamerTestHelper';
import { ReceiptRepository } from '../../../src/infrastructure/ReceiptRepository';

describe('ReceiptPaginationStreamer', () => {
    it('basicMultiPageTest', () => {
        const receiptRepositoryMock: ReceiptRepository = mock();
        const streamer = ReceiptPaginationStreamer.transactionStatements(instance(receiptRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), { search: receiptRepositoryMock.searchReceipts }, {});
        return tester.basicMultiPageTest();
    });

    it('basicSinglePageTest', () => {
        const receiptRepositoryMock: ReceiptRepository = mock();
        const streamer = ReceiptPaginationStreamer.transactionStatements(instance(receiptRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), { search: receiptRepositoryMock.searchReceipts }, {});
        return tester.basicSinglePageTest();
    });

    it('limitToTwoPages', () => {
        const receiptRepositoryMock: ReceiptRepository = mock();
        const streamer = ReceiptPaginationStreamer.transactionStatements(instance(receiptRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), { search: receiptRepositoryMock.searchReceipts }, {});
        return tester.limitToTwoPages();
    });

    it('multipageWithLimit', () => {
        const receiptRepositoryMock: ReceiptRepository = mock();
        const streamer = ReceiptPaginationStreamer.transactionStatements(instance(receiptRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), { search: receiptRepositoryMock.searchReceipts }, {});
        return tester.multipageWithLimit();
    });

    it('limitToThreePages', () => {
        const receiptRepositoryMock: ReceiptRepository = mock();
        const streamer = ReceiptPaginationStreamer.transactionStatements(instance(receiptRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), { search: receiptRepositoryMock.searchReceipts }, {});
        return tester.limitToThreePages();
    });
});
