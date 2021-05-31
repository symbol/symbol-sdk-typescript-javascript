/*
 * Copyright 2021 NEM
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

import { ChronoUnit, Duration, Instant } from '@js-joda/core';
import { RepositoryFactory } from '../infrastructure';
import { Deadline, defaultChronoUnit, defaultDeadline } from '../model/transaction';

/**
 * A factory service that allows the client to generate Deadline objects based on different strategies.
 *
 * The main issue is that sometimes the local computer time is not in sync, the created deadlines may be too old or too in the future and rejected by the server.
 */
export class DeadlineService {
    /**
     * The difference in milliseconds between the server and the local time. It used to create "server" deadline without asking for the server time every time a new deadline is created.
     */
    private localTimeOffset: number;

    /**
     * Private constructor, use the create static method
     *
     * @param repositoryFactory the repository factory to call the rest servers.
     * @param epochAdjustment the server epochAdjustment
     * @param serverTime the latest known server time to calculate the remote and local time difference.
     */
    private constructor(
        private readonly repositoryFactory: RepositoryFactory,
        private readonly epochAdjustment: number,
        serverTime: number,
    ) {
        this.localTimeOffset = Instant.now().minusSeconds(epochAdjustment).toEpochMilli() - serverTime;
    }

    /**
     * It creates a deadline by querying the current time to the server each time. This is the most accurate but less efficient way.
     *
     * @param deadline the deadline value
     * @param chronoUnit the unit of the value.
     */
    public async createDeadlineUsingServerTime(deadline = defaultDeadline, chronoUnit: ChronoUnit = defaultChronoUnit): Promise<Deadline> {
        const serverTime = (await this.repositoryFactory.createNodeRepository().getNodeTime().toPromise()).receiveTimeStamp.compact();
        return Deadline.createFromAdjustedValue(Duration.ofMillis(serverTime).plus(deadline, chronoUnit).toMillis());
    }

    /**
     * It creates a deadline using the known difference between the local and server time.
     *
     * @param deadline the deadline value
     * @param chronoUnit the unit of the value.
     */
    public createDeadlineUsingOffset(deadline = defaultDeadline, chronoUnit: ChronoUnit = defaultChronoUnit): Deadline {
        return Deadline.createFromAdjustedValue(
            Instant.now().plus(deadline, chronoUnit).minusMillis(this.localTimeOffset).minusSeconds(this.epochAdjustment).toEpochMilli(),
        );
    }

    /**
     * It creates a deadline using the local time. If the local system time is not in sync, the Deadline may be rejected by the server.
     *
     * @param deadline the deadline value
     * @param chronoUnit the unit of the value.
     */
    public createDeadlineUsingLocalTime(deadline = defaultDeadline, chronoUnit: ChronoUnit = defaultChronoUnit): Deadline {
        return Deadline.create(this.epochAdjustment, deadline, chronoUnit);
    }

    /**
     * Factory method of this object.
     *
     * @param repositoryFactory the repository factory to call the rest servers.
     */
    public static async create(repositoryFactory: RepositoryFactory): Promise<DeadlineService> {
        const epochAdjustment = await repositoryFactory.getEpochAdjustment().toPromise();
        const serverTime = (await repositoryFactory.createNodeRepository().getNodeTime().toPromise()).receiveTimeStamp.compact();
        return new DeadlineService(repositoryFactory, epochAdjustment, serverTime);
    }
}
