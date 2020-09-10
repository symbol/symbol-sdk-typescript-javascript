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
import { HashLockPaginationStreamer } from '../../../src/infrastructure/paginationStreamer/HashLockPaginationStreamer';
import { PaginationStreamerTestHelper } from './PaginationStreamerTestHelper';
import { HashLockRepository } from '../../../src/infrastructure/HashLockRepository';
import { Address } from '../../../src/model/account/Address';

describe('HashLockPaginationStreamer', () => {
    const address = Address.createFromRawAddress('SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMQ');

    it('basicMultiPageTest', () => {
        const hashLockRepositoryMock: HashLockRepository = mock();
        const streamer = new HashLockPaginationStreamer(instance(hashLockRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), hashLockRepositoryMock, { address });
        return tester.basicMultiPageTest();
    });

    it('basicSinglePageTest', () => {
        const hashLockRepositoryMock: HashLockRepository = mock();
        const streamer = new HashLockPaginationStreamer(instance(hashLockRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), hashLockRepositoryMock, { address });
        return tester.basicSinglePageTest();
    });

    it('limitToTwoPages', () => {
        const hashLockRepositoryMock: HashLockRepository = mock();
        const streamer = new HashLockPaginationStreamer(instance(hashLockRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), hashLockRepositoryMock, { address });
        return tester.limitToTwoPages();
    });

    it('multipageWithLimit', () => {
        const hashLockRepositoryMock: HashLockRepository = mock();
        const streamer = new HashLockPaginationStreamer(instance(hashLockRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), hashLockRepositoryMock, { address });
        return tester.multipageWithLimit();
    });

    it('limitToThreePages', () => {
        const hashLockRepositoryMock: HashLockRepository = mock();
        const streamer = new HashLockPaginationStreamer(instance(hashLockRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), hashLockRepositoryMock, { address });
        return tester.limitToThreePages();
    });
});
