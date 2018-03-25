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
import {MosaicName} from '../../../src/model/mosaic/MosaicName';
import {NamespaceId} from '../../../src/model/namespace/NamespaceId';

describe('MosaicName', () => {

    it('should createComplete an MosaicName object', () => {
        const mosaicNameDTO = {
            mosaicId: new MosaicId([ 3646934825, 3576016193 ]),
            name: 'xem',
            parentId: new NamespaceId([ 929036875, 2226345261 ]),
        };

        const mosaicName = new MosaicName(
            mosaicNameDTO.mosaicId,
            mosaicNameDTO.parentId,
            mosaicNameDTO.name,
        );

        deepEqual(mosaicName.mosaicId, mosaicNameDTO.mosaicId);
        deepEqual(mosaicName.namespaceId, mosaicNameDTO.parentId);
        expect(mosaicName.name).to.be.equal(mosaicNameDTO.name);
    });
});
