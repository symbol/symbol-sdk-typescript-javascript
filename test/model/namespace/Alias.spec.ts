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
import { Address } from '../../../src/model/account/Address';
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import { AddressAlias } from '../../../src/model/namespace/AddressAlias';
import { AliasType } from '../../../src/model/namespace/AliasType';
import { EmptyAlias } from '../../../src/model/namespace/EmptyAlias';
import { MosaicAlias } from '../../../src/model/namespace/MosaicAlias';

describe('Alias', () => {
    let addressAliasDTO;
    let mosaicAliasDTO;
    let address;
    let address2;

    before(() => {
        address = Address.createFromRawAddress('SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMQ');
        address2 = Address.createFromRawAddress('SDR6EW2WBHJQDYMNGFX2UBZHMMZC5PGL2Z5UYYY');
        mosaicAliasDTO = {
            type: AliasType.Mosaic,
            mosaicId: new MosaicId([481110499, 231112638]),
        };
        addressAliasDTO = {
            type: AliasType.Address,
            address,
        };
    });

    it('should create an EmptyAlias object', () => {
        const alias = new EmptyAlias();
        expect(alias.type).to.be.equal(AliasType.None);
    });

    it('should create a AddressAlias object', () => {
        const alias = new AddressAlias(addressAliasDTO.address);
        expect(alias.type).to.be.equal(AliasType.Address);
        expect(alias.address).to.be.equal(addressAliasDTO.address);
    });

    it('should create a MosaicAlias object', () => {
        const alias = new MosaicAlias(mosaicAliasDTO.mosaicId);
        expect(alias.type).to.be.equal(AliasType.Mosaic);
        expect(alias.mosaicId).to.be.equal(mosaicAliasDTO.mosaicId);
    });

    it('should compare addresses in AddressAlias.equals()', () => {
        const alias1 = new AddressAlias(addressAliasDTO.address);
        const alias2 = new AddressAlias(addressAliasDTO.address);
        const alias3 = new AddressAlias(address2);

        expect(alias1.equals(alias2)).to.be.equal(true);
        expect(alias1.equals(alias3)).to.be.equal(false);
    });

    it('should compare mosaicIds in MosaicAlias.equals()', () => {
        const alias1 = new MosaicAlias(mosaicAliasDTO.mosaicId);
        const alias2 = new MosaicAlias(mosaicAliasDTO.mosaicId);
        const alias3 = new MosaicAlias(new MosaicId([481110498, 231112637]));

        expect(alias1.equals(alias2)).to.be.equal(true);
        expect(alias1.equals(alias3)).to.be.equal(false);
    });
});
