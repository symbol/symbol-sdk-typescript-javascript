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
import { ChronoUnit, Instant, LocalDateTime, ZoneId } from 'js-joda';
import { Deadline } from '../../../src/model/transaction/Deadline';

describe('Deadline', () => {
    it('should createComplete timestamp today', () => {
        const deadline = Deadline.create();

        // avoid SYSTEM and UTC differences
        const networkTimeStamp = (new Date()).getTime();
        const timestampLocal = LocalDateTime.ofInstant(Instant.ofEpochMilli(networkTimeStamp), ZoneId.SYSTEM);
        const reproducedDate = timestampLocal.plus(2, ChronoUnit.HOURS);

        expect(deadline.value.dayOfMonth()).to.be.equal(reproducedDate.dayOfMonth());
        expect(deadline.value.monthValue()).to.be.equal(reproducedDate.monthValue());
        expect(deadline.value.year()).to.be.equal(reproducedDate.year());
    });

    it('should throw error deadline smaller than timeStamp', () => {
        expect(() => {
            Deadline.create(-3);
        }).to.throw(Error);
    });

    it('should throw error deadline greater than 24h', () => {
        expect(() => {
            Deadline.create(2, ChronoUnit.DAYS);
        }).to.throw(Error);
    });

    it('should createComplete date with Deadline array', () => {
        const deadline = Deadline.createFromDTO('51110867862');
        expect(deadline.toDTO().toString()).to.be.equal('51110867862');
    });

    it('make sure epochAdjustment is correct', () => {
        const epochAdjustment = new Date(Deadline.timestampNemesisBlock * 1000);

        expect(epochAdjustment.getUTCFullYear()).to.be.equal(2019);
        expect(epochAdjustment.getUTCMonth() + 1).to.be.equal(11);
        expect(epochAdjustment.getUTCDate()).to.be.equal(11);
        expect(epochAdjustment.getUTCHours()).to.be.equal(0);
        expect(epochAdjustment.getUTCMinutes()).to.be.equal(0);
        expect(epochAdjustment.toUTCString()).to.be.equal('Mon, 11 Nov 2019 00:00:00 GMT');
    });
});
