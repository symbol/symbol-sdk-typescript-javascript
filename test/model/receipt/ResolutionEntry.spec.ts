/*
 * Copyright 2020 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { expect } from 'chai';
import { Convert } from '../../../src/core/format/Convert';
import { Address } from '../../../src/model/account/Address';
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import { ReceiptSource } from '../../../src/model/receipt/ReceiptSource';
import { ResolutionEntry } from '../../../src/model/receipt/ResolutionEntry';
import { TestingAccount } from '../../conf/conf.spec';

describe('ResolutionEntry', () => {
    const address = TestingAccount.address;
    const mosaicId = new MosaicId('941299B2B7E1291C');

    it('Should create resolution entry', () => {
        const entry = new ResolutionEntry(address, new ReceiptSource(0, 1));
        expect((entry.resolved as Address).plain()).to.be.equal(address.plain());
    });

    it('Should serialize', () => {
        const entry = new ResolutionEntry(address, new ReceiptSource(0, 1));
        const result = entry.serialize();
        expect(Convert.uint8ToHex(result)).to.be.equal('9826D27E1D0A26CA4E316F901E23E55C8711DB20DFD267760000000001000000');
    });

    it('Should serialize -  Mosaic', () => {
        const entry = new ResolutionEntry(mosaicId, new ReceiptSource(0, 1));
        const result = entry.serialize();
        expect(Convert.uint8ToHex(result)).to.be.equal('1C29E1B7B29912940000000001000000');
    });
});
