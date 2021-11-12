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
import { MosaicFlags } from '../../../src/model/mosaic/MosaicFlags';

describe('MosaicFlags', () => {
    const assertFlag = (flag: number, supplyMutable: boolean, transferable: boolean, restrictable?: boolean, revokable?: boolean): void => {
        it('should create the right MosaicFlags flag ' + [flag, supplyMutable, transferable, restrictable, revokable].join(', '), () => {
            const basicAssert = (mosaicFlags: MosaicFlags): void => {
                expect(mosaicFlags.getValue()).to.be.equal(flag);
                expect(mosaicFlags.supplyMutable).to.be.equal(supplyMutable);
                expect(mosaicFlags.transferable).to.be.equal(transferable);
                expect(mosaicFlags.restrictable).to.be.equal(restrictable || false);
                expect(mosaicFlags.revokable).to.be.equal(revokable || false);
                expect(mosaicFlags.toDTO().flags).to.be.equal(flag);
            };

            basicAssert(MosaicFlags.create(supplyMutable, transferable, restrictable, revokable));
            basicAssert(new MosaicFlags(flag));
        });
    };

    assertFlag(0, false, false, false, false);
    assertFlag(1, true, false, false, false);
    assertFlag(2, false, true, false, false);
    assertFlag(3, true, true, false, false);
    assertFlag(4, false, false, true, false);
    assertFlag(5, true, false, true, false);
    assertFlag(6, false, true, true, false);
    assertFlag(7, true, true, true, false);
    assertFlag(8, false, false, false, true);
    assertFlag(9, true, false, false, true);
    assertFlag(10, false, true, false, true);
    assertFlag(11, true, true, false, true);
    assertFlag(12, false, false, true, true);
    assertFlag(13, true, false, true, true);
    assertFlag(14, false, true, true, true);
    assertFlag(15, true, true, true, true);

    //Using defaults
    assertFlag(0, false, false);
    assertFlag(1, true, false);
    assertFlag(2, false, true);
    assertFlag(3, true, true);
    assertFlag(4, false, false, true);
    assertFlag(5, true, false, true);
    assertFlag(6, false, true, true);
    assertFlag(7, true, true, true);
});
