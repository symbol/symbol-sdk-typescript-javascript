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
import {NetworkHarvestLocal} from '../../../src/model/mosaic/NetworkHarvestLocal';
import {NamespaceId} from '../../../src/model/namespace/NamespaceId';
import { BigIntUtilities } from '../../../src/core/format/BigIntUtilities';

describe('NetworkHarvestLocal', () => {

    it('should createComplete an NetworkHarvestLocal object', () => {

        const currency = NetworkHarvestLocal.createRelative(1000);

        deepEqual(BigIntUtilities.BigIntToHex(currency.id.id), '941299B2B7E1291C');
        expect(currency.amount).to.be.equal(BigInt(1000 * 1000));
    });

    it('should set amount in smallest unit when toDTO()', () => {

        const currency = NetworkHarvestLocal.createRelative(1000);
        expect(BigInt(currency.toDTO().amount)).to.be.equal(BigInt(1000 * 1000));
    });

    it('should have valid statics', () => {
        deepEqual(NetworkHarvestLocal.NAMESPACE_ID.id, new NamespaceId(BigIntUtilities.HexToBigInt('941299B2B7E1291C')).id);
        expect(NetworkHarvestLocal.DIVISIBILITY).to.be.equal(3);
        expect(NetworkHarvestLocal.TRANSFERABLE).to.be.equal(true);
        expect(NetworkHarvestLocal.SUPPLY_MUTABLE).to.be.equal(true);
    });
});
