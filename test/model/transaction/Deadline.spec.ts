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

import { expect } from 'chai';
import { ChronoUnit, Instant, LocalDateTime, ZoneId } from '@js-joda/core';
import { Deadline } from '../../../src/model/transaction/Deadline';

describe('Deadline', () => {
    const epochAdjustment = 1573430400;

    it('should createComplete timestamp today', () => {
        const deadline = Deadline.create(epochAdjustment);

        // avoid SYSTEM and UTC differences
        const networkTimeStamp = new Date().getTime();
        const timestampLocal = LocalDateTime.ofInstant(Instant.ofEpochMilli(networkTimeStamp), ZoneId.SYSTEM);
        const reproducedDate = timestampLocal.plus(2, ChronoUnit.HOURS);

        expect(deadline.toLocalDateTime(epochAdjustment).dayOfMonth()).to.be.equal(reproducedDate.dayOfMonth());
        expect(deadline.toLocalDateTime(epochAdjustment).monthValue()).to.be.equal(reproducedDate.monthValue());
        expect(deadline.toLocalDateTime(epochAdjustment).year()).to.be.equal(reproducedDate.year());
    });

    it('should throw error deadline smaller than timeStamp', () => {
        expect(() => {
            Deadline.create(epochAdjustment, -3);
        }).to.throw(Error);
    });

    it('should createComplete date with Deadline array', () => {
        const deadline = Deadline.createFromDTO('51110867862');

        expect(deadline.toDTO()[0]).to.be.equal(3866227606);
        expect(deadline.toDTO()[1]).to.be.equal(11);
    });

    it('should createComplete empty deadline', () => {
        const deadline = Deadline.createEmtpy();
        expect(deadline.adjustedValue).to.be.equal(LocalDateTime.MIN.second());
    });

    it('make sure epochAdjustment is correct', () => {
        const epochAdjustment = new Date(1573430400 * 1000);

        expect(epochAdjustment.getUTCFullYear()).to.be.equal(2019);
        expect(epochAdjustment.getUTCMonth() + 1).to.be.equal(11);
        expect(epochAdjustment.getUTCDate()).to.be.equal(11);
        expect(epochAdjustment.getUTCHours()).to.be.equal(0);
        expect(epochAdjustment.getUTCMinutes()).to.be.equal(0);
        expect(epochAdjustment.toUTCString()).to.be.equal('Mon, 11 Nov 2019 00:00:00 GMT');
    });

    it('should create local date time - default time zone', () => {
        const deadline = Deadline.createFromDTO('1');
        const datetime = deadline.toLocalDateTime(epochAdjustment);
        const datetimeSystemZone = deadline.toLocalDateTimeGivenTimeZone(epochAdjustment, ZoneId.SYSTEM);
        expect(datetime.month().value()).to.be.equal(11);
        expect(datetime).to.be.deep.eq(datetimeSystemZone);
    });

    it('should create local date time - customer time zone', () => {
        const deadline = Deadline.createFromDTO('1');
        const datetime = deadline.toLocalDateTimeGivenTimeZone(epochAdjustment, ZoneId.of('UTC-2'));
        expect(datetime.year()).to.be.equal(2019);
        expect(datetime.month().value()).to.be.equal(11);
        expect(datetime.dayOfMonth()).to.be.equal(10);
        expect(datetime.hour()).to.be.equal(22);
        expect(datetime.second()).to.be.equal(0);
        expect(datetime.minute()).to.be.equal(0);
    });
});
