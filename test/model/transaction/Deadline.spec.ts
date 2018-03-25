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

import {expect} from 'chai';
import {ChronoUnit} from 'js-joda';
import {Deadline} from '../../../src/model/transaction/Deadline';

describe('Deadline', () => {
    it('should createComplete timestamp today', () => {
        const deadline = Deadline.create();
        const date = new Date();
        expect(deadline.value.dayOfMonth()).to.be.equal(date.getDate());
        expect(deadline.value.monthValue()).to.be.equal(date.getMonth() + 1);
        expect(deadline.value.year()).to.be.equal(date.getFullYear());
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
        const deadline = Deadline.createFromDTO([3866227606, 11]);

        expect(deadline.toDTO()[0]).to.be.equal(3866227606);
        expect(deadline.toDTO()[1]).to.be.equal(11);
    });

});
