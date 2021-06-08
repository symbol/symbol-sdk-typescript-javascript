/*
 * Copyright 2018 NEM
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
import { ChronoUnit, Instant, ZoneId } from '@js-joda/core';
import { expect } from 'chai';
import { of as observableOf } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';
import { NodeRepository, RepositoryFactory } from '../../src/infrastructure';
import { Deadline, UInt64 } from '../../src/model';
import { NodeTime } from '../../src/model/node';
import { DeadlineService } from '../../src/service/DeadlineService';

describe('DeadlineService', () => {
    const realNow = Instant.now;
    const currentSystemMillis = Instant.parse('2021-05-31T10:20:21.154Z').toEpochMilli();
    const localtimeError = 10 * 1000; // 10 seconds diff
    const epochAdjustment = 1616694977;
    const currentServerMillis = currentSystemMillis - epochAdjustment * 1000 - localtimeError;
    before(() => {
        Instant.now = () => Instant.ofEpochMilli(currentSystemMillis);
    });

    after(() => {
        Instant.now = realNow;
    });
    const createService = () => {
        const mockNodeRepository: NodeRepository = mock<NodeRepository>();
        when(mockNodeRepository.getNodeTime()).thenReturn(
            observableOf(new NodeTime(UInt64.fromUint(currentServerMillis), UInt64.fromUint(currentServerMillis))),
        );
        const mockRepoFactory = mock<RepositoryFactory>();
        when(mockRepoFactory.getEpochAdjustment()).thenReturn(observableOf(epochAdjustment));
        when(mockRepoFactory.createNodeRepository()).thenReturn(instance(mockNodeRepository));
        const repositoryFactory = instance(mockRepoFactory);
        return DeadlineService.create(repositoryFactory);
    };

    const printDeadline = (deadline: Deadline) => deadline.toLocalDateTimeGivenTimeZone(epochAdjustment, ZoneId.UTC).toString();

    it('createDeadlines', async () => {
        const service = await createService();
        // createDeadlineUsingLocalTime is 10 seconds ahead
        expect(printDeadline(service.createDeadlineUsingOffset())).eq('2021-05-31T12:20:11.154');
        expect(printDeadline(await service.createDeadlineUsingServerTime())).eq('2021-05-31T12:20:11.154');
        expect(printDeadline(service.createDeadlineUsingLocalTime())).eq('2021-05-31T12:20:21.154');

        expect(printDeadline(service.createDeadlineUsingOffset(1))).eq('2021-05-31T11:20:11.154');
        expect(printDeadline(await service.createDeadlineUsingServerTime(1))).eq('2021-05-31T11:20:11.154');
        expect(printDeadline(service.createDeadlineUsingLocalTime(1))).eq('2021-05-31T11:20:21.154');

        expect(printDeadline(service.createDeadlineUsingOffset(5, ChronoUnit.MINUTES))).eq('2021-05-31T10:25:11.154');
        expect(printDeadline(await service.createDeadlineUsingServerTime(5, ChronoUnit.MINUTES))).eq('2021-05-31T10:25:11.154');
        expect(printDeadline(service.createDeadlineUsingLocalTime(5, ChronoUnit.MINUTES))).eq('2021-05-31T10:25:21.154');
    });
});
