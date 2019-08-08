/*
 * Copyright 2019 NEM
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
import {Account} from '../../../src/model/account/Account';
import {NetworkType} from '../../../src/model/blockchain/NetworkType';
import {MosaicId} from '../../../src/model/mosaic/MosaicId';
import {Deadline} from '../../../src/model/transaction/Deadline';
import {MosaicAddressRestrictionTransaction} from '../../../src/model/transaction/MosaicAddressRestrictionTransaction';
import {UInt64} from '../../../src/model/UInt64';
import {TestingAccount} from '../../conf/conf.spec';

describe('MosaicAddressRestrictionTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = TestingAccount;
    });

    it('should createComplete an MosaicAddressRestrictionTransaction object and sign', () => {
        const mosaicId = new MosaicId(UInt64.fromUint(1).toDTO());
        const mosaicAddressRestrictionTransaction = MosaicAddressRestrictionTransaction.create(
            Deadline.create(),
            mosaicId,
            UInt64.fromUint(1),
            account.address,
            UInt64.fromUint(9),
            UInt64.fromUint(8),
            NetworkType.MIJIN_TEST,
        );
        expect(mosaicAddressRestrictionTransaction.mosaicId.toHex()).to.be.equal(mosaicId.toHex());
        expect(mosaicAddressRestrictionTransaction.restrictionKey.toHex()).to.be.equal(UInt64.fromUint(1).toHex());
        expect(mosaicAddressRestrictionTransaction.previousRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(9).toHex());
        expect(mosaicAddressRestrictionTransaction.newRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(8).toHex());
        expect(mosaicAddressRestrictionTransaction.targetAddress.plain()).to.be.equal(account.address.plain());

        const signedTransaction = mosaicAddressRestrictionTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            240,
            signedTransaction.payload.length,
        )).to.be.equal('0100000000000000010000000000000090A75B6B63D31BDA93808727940F24699AE' +
                       'CDDF17C568508BA09000000000000000800000000000000');

    });
});
