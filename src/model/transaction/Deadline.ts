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

import { ChronoUnit, Instant, LocalDateTime, ZoneId } from 'js-joda';

/**
 * The deadline of the transaction. The deadline is given as the number of seconds elapsed since the creation of the nemesis block.
 * If a transaction does not get included in a block before the deadline is reached, it is deleted.
 */
export class Deadline {
    /**
     * @type {number}
     */
    public static timestampNemesisBlock = 1573430400;

    /**
     * Deadline value
     */
    public value: LocalDateTime;

    /**
     * Create deadline model
     * @param deadline
     * @param chronoUnit
     * @returns {Deadline}
     */
    public static create(deadline = 2, chronoUnit: ChronoUnit = ChronoUnit.HOURS): Deadline {
        const networkTimeStamp = new Date().getTime();
        const timeStampDateTime = LocalDateTime.ofInstant(Instant.ofEpochMilli(networkTimeStamp), ZoneId.SYSTEM);
        const deadlineDateTime = timeStampDateTime.plus(deadline, chronoUnit);

        if (deadline <= 0) {
            throw new Error('deadline should be greater than 0');
        } else if (timeStampDateTime.plus(24, ChronoUnit.HOURS).compareTo(deadlineDateTime) !== 1) {
            throw new Error('deadline should be less than 24 hours');
        }

        return new Deadline(deadlineDateTime);
    }

    /**
     * @internal
     * @param value
     * @returns {Deadline}
     */
    public static createFromDTO(value: string): Deadline {
        const uint64Value = BigInt(value);
        const dateSeconds = Number(uint64Value);
        const deadline = LocalDateTime.ofInstant(
            Instant.ofEpochMilli(Math.round(dateSeconds + Deadline.timestampNemesisBlock * 1000)),
            ZoneId.SYSTEM,
        );
        return new Deadline(deadline);
    }

    /**
     * @internal
     * @param value
     * @returns {Deadline}
     */
    public static createFromBigInt(value: bigint): Deadline {
        const dateSeconds = Number(value);
        const deadline = LocalDateTime.ofInstant(
            Instant.ofEpochMilli(Math.round(dateSeconds + Deadline.timestampNemesisBlock * 1000)),
            ZoneId.SYSTEM,
        );
        return new Deadline(deadline);
    }

    /**
     * @param deadline
     */
    private constructor(deadline: LocalDateTime) {
        this.value = deadline;
    }

    /**
     * @internal
     */
    public toDTO(): bigint {
        return BigInt(this.value.atZone(ZoneId.SYSTEM).toInstant().toEpochMilli() - Deadline.timestampNemesisBlock * 1000);
    }

    /**
     * @internal
     */
    public toBigInt(): bigint {
        return BigInt(this.value.atZone(ZoneId.SYSTEM).toInstant().toEpochMilli() - Deadline.timestampNemesisBlock * 1000);
    }

    /**
     * @internal
     */
    public toString(): string {
        return BigInt(this.value.atZone(ZoneId.SYSTEM).toInstant().toEpochMilli() - Deadline.timestampNemesisBlock * 1000).toString();
    }
}
