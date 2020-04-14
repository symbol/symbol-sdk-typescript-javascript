/*
 * Copyright 2020 NEM
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
import { AmountDto, MosaicBuilder, MosaicIdDto } from 'catbuffer-typescript';
import { Convert } from '../../../src/core/format';
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import { BigIntUtilities } from '../../../src/core/format/BigIntUtilities';
import { NamespaceId } from '../../../src/model/namespace/NamespaceId';
import { AccountRestrictionTransaction } from '../../../src/model/transaction/AccountRestrictionTransaction';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { AccountRestrictionFlags } from '../../../src/model/restriction/AccountRestrictionType';
import { NetworkType } from '../../../src/model/network/NetworkType';

describe('Catbuffer - test', () => {
    it('MosaicIdDto', () => {
        const mosaicId = BigInt(20);
        const mosaicIdDto1 = new MosaicIdDto(mosaicId);
        // expect(BigIntUtilities.BigIntToUInt64(mosaicIdDto1.mosaicId)).to.deep.equal([0, 335544320]);
        expect(mosaicIdDto1.getMosaicId().toString()).to.deep.equal('20');

        expect(Convert.uint8ToHex(mosaicIdDto1.serialize())).to.eq('1400000000000000');
        const mosaicIdDto2 = MosaicIdDto.loadFromBinary(mosaicIdDto1.serialize());
        expect(Convert.uint8ToHex(mosaicIdDto2.serialize())).to.eq('1400000000000000');
        expect(mosaicIdDto2.getMosaicId().toString()).eq(mosaicIdDto1.getMosaicId().toString());
        expect(mosaicIdDto1.getMosaicId().toString()).to.deep.eq(mosaicId.toString());

        const modelMosaicId = new MosaicId(mosaicId);
        expect(modelMosaicId.toHex()).to.eq('0000000000000014');
        expect(modelMosaicId.toDTO()).to.eq('0000000000000014');
    });

    it('MosaicBuilder', () => {
        const mosaicId = BigInt(20);
        const amount = BigInt(100);
        const mosaicIdDto = new MosaicIdDto(mosaicId);
        const mosaicBuilder1 = new MosaicBuilder(mosaicIdDto, new AmountDto(amount));
        expect(Convert.uint8ToHex(mosaicBuilder1.serialize())).to.eq('14000000000000006400000000000000');
        const mosaicBuilder2 = MosaicBuilder.loadFromBinary(mosaicBuilder1.serialize());
        expect(Convert.uint8ToHex(mosaicBuilder2.serialize())).to.eq('14000000000000006400000000000000');
        expect(mosaicBuilder2.getMosaicId().getMosaicId().toString()).eq(mosaicBuilder1.getMosaicId().getMosaicId().toString());
        expect(mosaicBuilder2.getAmount().getAmount().toString()).eq(mosaicBuilder1.getAmount().getAmount().toString());
        expect(mosaicBuilder2.getMosaicId().getMosaicId().toString()).to.deep.eq('20');
        expect(mosaicBuilder2.getAmount().getAmount().toString()).to.deep.eq('100');
    });

    it('MosaicId to hex', () => {
        const mosaicId2 = new MosaicId('CAF5DD1286D7CC4C');
        expect(mosaicId2.toHex()).to.deep.eq('CAF5DD1286D7CC4C');

        const mosaicId = new MosaicId(BigIntUtilities.UInt64ToBigInt([2262289484, 3405110546]));
        expect(mosaicId.toHex()).to.deep.eq('CAF5DD1286D7CC4C');
    });

    it('NamespaceId to hex', () => {
        const namespace1 = new NamespaceId('test');
        expect(namespace1.id.toString()).be.eq('15276497235419185774');
        expect(namespace1.toHex()).to.deep.eq('D401054C1965C26E');
        expect(namespace1.id.toString()).to.deep.eq('15276497235419185774');

        const namespace2 = new NamespaceId('another.test');
        expect(namespace2.id.toString()).be.eq('16161283280124474250');
        expect(namespace2.toHex()).to.deep.eq('E04869846247738A');
    });

    it('should create AccountRestrictionMosaicTransaction', () => {
        const mosaicId = new MosaicId('CAF5DD1286D7CC4C');
        expect(mosaicId.toHex()).to.be.equal('CAF5DD1286D7CC4C');
        const mosaicRestrictionTransaction = AccountRestrictionTransaction.createMosaicRestrictionModificationTransaction(
            Deadline.createFromDTO('123'),
            AccountRestrictionFlags.AllowMosaic,
            [mosaicId],
            [],
            NetworkType.MIJIN_TEST,
        );
        expect(mosaicRestrictionTransaction.serialize()).to.eq(
            '9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000190504200000000000000007B0000000000000002000100000000004CCCD78612DDF5CA',
        );
    });
});
