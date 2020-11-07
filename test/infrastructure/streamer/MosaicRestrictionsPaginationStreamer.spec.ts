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
import { RestrictionMosaicPaginationStreamer } from '../../../src/infrastructure/paginationStreamer/RestrictionMosaicPaginationStreamer';
import { RestrictionMosaicRepository } from '../../../src/infrastructure/RestrictionMosaicRepository';
import { PaginationStreamerTestHelper } from './PaginationStreamerTestHelper';

describe('MosaicRestrictionPaginationStreamer - transaction', () => {
    it('basicMultiPageTest', () => {
        const mosaicRestrictionRepositoryMock: RestrictionMosaicRepository = mock();
        const streamer = RestrictionMosaicPaginationStreamer.MosaicRestrictions(instance(mosaicRestrictionRepositoryMock));
        const tester = new PaginationStreamerTestHelper(
            streamer,
            mock(),
            { search: mosaicRestrictionRepositoryMock.searchMosaicRestrictions },
            {},
        );
        return tester.basicMultiPageTest();
    });

    it('basicSinglePageTest', () => {
        const mosaicRestrictionRepositoryMock: RestrictionMosaicRepository = mock();
        const streamer = RestrictionMosaicPaginationStreamer.MosaicRestrictions(instance(mosaicRestrictionRepositoryMock));
        const tester = new PaginationStreamerTestHelper(
            streamer,
            mock(),
            { search: mosaicRestrictionRepositoryMock.searchMosaicRestrictions },
            {},
        );
        return tester.basicSinglePageTest();
    });

    it('limitToTwoPages', () => {
        const mosaicRestrictionRepositoryMock: RestrictionMosaicRepository = mock();
        const streamer = RestrictionMosaicPaginationStreamer.MosaicRestrictions(instance(mosaicRestrictionRepositoryMock));
        const tester = new PaginationStreamerTestHelper(
            streamer,
            mock(),
            { search: mosaicRestrictionRepositoryMock.searchMosaicRestrictions },
            {},
        );
        return tester.limitToTwoPages();
    });

    it('multipageWithLimit', () => {
        const mosaicRestrictionRepositoryMock: RestrictionMosaicRepository = mock();
        const streamer = RestrictionMosaicPaginationStreamer.MosaicRestrictions(instance(mosaicRestrictionRepositoryMock));
        const tester = new PaginationStreamerTestHelper(
            streamer,
            mock(),
            { search: mosaicRestrictionRepositoryMock.searchMosaicRestrictions },
            {},
        );
        return tester.multipageWithLimit();
    });

    it('limitToThreePages', () => {
        const mosaicRestrictionRepositoryMock: RestrictionMosaicRepository = mock();
        const streamer = RestrictionMosaicPaginationStreamer.MosaicRestrictions(instance(mosaicRestrictionRepositoryMock));
        const tester = new PaginationStreamerTestHelper(
            streamer,
            mock(),
            { search: mosaicRestrictionRepositoryMock.searchMosaicRestrictions },
            {},
        );
        return tester.limitToThreePages();
    });
});
