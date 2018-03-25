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
import {deepEqual} from 'assert';
import {expect} from 'chai';
import {Id} from '../../../src/model/Id';
import {MosaicId} from '../../../src/model/mosaic/MosaicId';

describe('MosaicId', () => {

    it('should be created from full name', () => {
        const id = new MosaicId('nem:xem');
        deepEqual(id.id, new Id([3646934825, 3576016193]));
        expect(id.fullName).to.be.equal('nem:xem');
    });

    it('should be created from id', () => {
        const id = new MosaicId([3646934825, 3576016193]);
        deepEqual(id.id, new Id([3646934825, 3576016193]));
        expect(id.fullName).to.be.equal(undefined);
    });
});
