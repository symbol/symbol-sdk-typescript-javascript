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

import {ChronoUnit, Instant, LocalDateTime, ZoneId} from 'js-joda';
import {UInt64} from '../UInt64';

/**
 * The deadline of the transaction. The deadline is given as the number of seconds elapsed since the creation of the nemesis block.
 * If a transaction does not get included in a block before the deadline is reached, it is deleted.
 */
export class Deadline {

    /**
     * @type {number}
     */
    public static timestampNemesisBlock = 1459468800;

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
    public static create(deadline: number = 2, chronoUnit: ChronoUnit = ChronoUnit.HOURS): Deadline {
        const networkTimeStamp = (new Date()).getTime();
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
    public static createFromDTO(value: string | number[]): Deadline {
        const uint64Value = 'string' === typeof value ? UInt64.fromNumericString(value) : new UInt64(value);
        const dateSeconds = uint64Value.compact();
        const deadline = LocalDateTime.ofInstant(
            Instant.ofEpochMilli(Math.round(dateSeconds + Deadline.timestampNemesisBlock * 1000)),
            ZoneId.SYSTEM);
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
    public toDTO(): number[] {
        return UInt64.fromUint(
            (this.value.atZone(ZoneId.SYSTEM).toInstant().toEpochMilli() - Deadline.timestampNemesisBlock * 1000),
        ).toDTO();
    }

    /**
     * @internal
     */
    public toString(): string {
        return UInt64.fromUint(
            (this.value.atZone(ZoneId.SYSTEM).toInstant().toEpochMilli() - Deadline.timestampNemesisBlock * 1000),
        ).toString();
    }
}
