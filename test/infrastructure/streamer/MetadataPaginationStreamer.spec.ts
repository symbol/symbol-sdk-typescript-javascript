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
import { MetadataPaginationStreamer } from '../../../src/infrastructure/paginationStreamer/MetadataPaginationStreamer';
import { PaginationStreamerTestHelper } from './PaginationStreamerTestHelper';
import { MetadataRepository } from '../../../src/infrastructure/MetadataRepository';

describe('MetadataPaginationStreamer', () => {
    it('basicMultiPageTest', () => {
        const metadataRepositoryMock: MetadataRepository = mock();
        const streamer = new MetadataPaginationStreamer(instance(metadataRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), metadataRepositoryMock, {});
        return tester.basicMultiPageTest();
    });

    it('basicSinglePageTest', () => {
        const metadataRepositoryMock: MetadataRepository = mock();
        const streamer = new MetadataPaginationStreamer(instance(metadataRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), metadataRepositoryMock, {});
        return tester.basicSinglePageTest();
    });

    it('limitToTwoPages', () => {
        const metadataRepositoryMock: MetadataRepository = mock();
        const streamer = new MetadataPaginationStreamer(instance(metadataRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), metadataRepositoryMock, {});
        return tester.limitToTwoPages();
    });

    it('multipageWithLimit', () => {
        const metadataRepositoryMock: MetadataRepository = mock();
        const streamer = new MetadataPaginationStreamer(instance(metadataRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), metadataRepositoryMock, {});
        return tester.multipageWithLimit();
    });

    it('limitToThreePages', () => {
        const metadataRepositoryMock: MetadataRepository = mock();
        const streamer = new MetadataPaginationStreamer(instance(metadataRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), metadataRepositoryMock, {});
        return tester.limitToThreePages();
    });
});
