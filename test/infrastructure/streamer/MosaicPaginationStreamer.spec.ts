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
import { MosaicRepository } from '../../../src/infrastructure/MosaicRepository';
import { MosaicPaginationStreamer } from '../../../src/infrastructure/paginationStreamer/MosaicPaginationStreamer';
import { PaginationStreamerTestHelper } from './PaginationStreamerTestHelper';

describe('MosaicPaginationStreamer', () => {
    it('basicMultiPageTest', () => {
        const mosaicRepositoryMock: MosaicRepository = mock();
        const streamer = new MosaicPaginationStreamer(instance(mosaicRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), mosaicRepositoryMock, {});
        return tester.basicMultiPageTest();
    });

    it('basicSinglePageTest', () => {
        const mosaicRepositoryMock: MosaicRepository = mock();
        const streamer = new MosaicPaginationStreamer(instance(mosaicRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), mosaicRepositoryMock, {});
        return tester.basicSinglePageTest();
    });

    it('limitToTwoPages', () => {
        const mosaicRepositoryMock: MosaicRepository = mock();
        const streamer = new MosaicPaginationStreamer(instance(mosaicRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), mosaicRepositoryMock, {});
        return tester.limitToTwoPages();
    });

    it('multipageWithLimit', () => {
        const mosaicRepositoryMock: MosaicRepository = mock();
        const streamer = new MosaicPaginationStreamer(instance(mosaicRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), mosaicRepositoryMock, {});
        return tester.multipageWithLimit();
    });

    it('limitToThreePages', () => {
        const mosaicRepositoryMock: MosaicRepository = mock();
        const streamer = new MosaicPaginationStreamer(instance(mosaicRepositoryMock));
        const tester = new PaginationStreamerTestHelper(streamer, mock(), mosaicRepositoryMock, {});
        return tester.limitToThreePages();
    });
});
