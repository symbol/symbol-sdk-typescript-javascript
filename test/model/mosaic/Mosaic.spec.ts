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

import { deepEqual } from 'assert';
import { Mosaic } from '../../../src/model/mosaic/Mosaic';
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import { UInt64 } from '../../../src/model/UInt64';

describe('Mosaic', () => {
    it('should createComplete an Mosaic object', () => {
        const mosaicDTO = {
            amount: new UInt64(1),
            mosaicId: new MosaicId([3646934825, 3576016193]),
        };

        const mosaic = new Mosaic(mosaicDTO.mosaicId, mosaicDTO.amount);

        deepEqual(mosaic.id, mosaicDTO.mosaicId);
        deepEqual(mosaic.amount, mosaicDTO.amount);
    });
});
