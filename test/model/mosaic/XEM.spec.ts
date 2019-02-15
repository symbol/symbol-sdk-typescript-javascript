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
import {MosaicId} from '../../../src/model/mosaic/MosaicId';
import {XEM} from '../../../src/model/mosaic/XEM';
import {NamespaceId} from '../../../src/model/namespace/NamespaceId';

describe('XEM', () => {

    it('should createComplete an XEM object', () => {

        const xem = XEM.createRelative(1000);

        deepEqual(xem.id.id.toHex(), '0dc67fbe1cad29e3');
        expect(xem.amount.compact()).to.be.equal(1000 * 1000000);
    });

    it('should set amount in microxem when toDTO()', () => {

        const xem = XEM.createRelative(1000);
        expect(xem.toDTO().amount[0]).to.be.equal(1000 * 1000000);
    });

    it('should have valid statics', () => {
        deepEqual(XEM.MOSAIC_ID.id, new MosaicId([481110499, 231112638]).id);
    });
});
