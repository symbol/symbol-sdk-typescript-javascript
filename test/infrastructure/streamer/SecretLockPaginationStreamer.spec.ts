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
import { SecretLockPaginationStreamer } from '../../../src/infrastructure/paginationStreamer/SecretLockPaginationStreamer';
import { PaginationStreamerTestHelper } from './PaginationStreamerTestHelper';
import { SecretLockRepository } from '../../../src/infrastructure/SecretLockRepository';
import { Address } from '../../../src/model/account/Address';

describe('SecretLockPaginationStreamer', () => {
    const address = Address.createFromRawAddress('SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMQ');

    it('basicMultiPageTest', () => {
        const SecretLockRepositoryMock: SecretLockRepository = mock();
        const streamer = new SecretLockPaginationStreamer(instance(SecretLockRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), SecretLockRepositoryMock, { address });
        return tester.basicMultiPageTest();
    });

    it('basicSinglePageTest', () => {
        const SecretLockRepositoryMock: SecretLockRepository = mock();
        const streamer = new SecretLockPaginationStreamer(instance(SecretLockRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), SecretLockRepositoryMock, { address });
        return tester.basicSinglePageTest();
    });

    it('limitToTwoPages', () => {
        const SecretLockRepositoryMock: SecretLockRepository = mock();
        const streamer = new SecretLockPaginationStreamer(instance(SecretLockRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), SecretLockRepositoryMock, { address });
        return tester.limitToTwoPages();
    });

    it('multipageWithLimit', () => {
        const SecretLockRepositoryMock: SecretLockRepository = mock();
        const streamer = new SecretLockPaginationStreamer(instance(SecretLockRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), SecretLockRepositoryMock, { address });
        return tester.multipageWithLimit();
    });

    it('limitToThreePages', () => {
        const SecretLockRepositoryMock: SecretLockRepository = mock();
        const streamer = new SecretLockPaginationStreamer(instance(SecretLockRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), SecretLockRepositoryMock, { address });
        return tester.limitToThreePages();
    });
});
