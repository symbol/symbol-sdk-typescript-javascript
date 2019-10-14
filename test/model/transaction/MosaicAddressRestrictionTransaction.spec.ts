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
import { NamespaceId } from '../../../src/model/namespace/NamespaceId';
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
            UInt64.fromUint(8),
            NetworkType.MIJIN_TEST,
            UInt64.fromUint(9),
        );
        expect(mosaicAddressRestrictionTransaction.mosaicId.toHex()).to.be.equal(mosaicId.toHex());
        expect(mosaicAddressRestrictionTransaction.restrictionKey.toHex()).to.be.equal(UInt64.fromUint(1).toHex());
        expect(mosaicAddressRestrictionTransaction.previousRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(9).toHex());
        expect(mosaicAddressRestrictionTransaction.newRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(8).toHex());
        expect(mosaicAddressRestrictionTransaction.targetAddressToString()).to.be.equal(account.address.plain());

        const signedTransaction = mosaicAddressRestrictionTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            240,
            signedTransaction.payload.length,
        )).to.be.equal('0100000000000000010000000000000090A75B6B63D31BDA93808727940F24699AE' +
                       'CDDF17C568508BA09000000000000000800000000000000');
    });

    it('should createComplete an MosaicAddressRestrictionTransaction use mosaic alias', () => {
        const namespacId = NamespaceId.createFromEncoded('9550CA3FC9B41FC5');
        const mosaicAddressRestrictionTransaction = MosaicAddressRestrictionTransaction.create(
            Deadline.create(),
            namespacId,
            UInt64.fromUint(1),
            account.address,
            UInt64.fromUint(8),
            NetworkType.MIJIN_TEST,
            UInt64.fromUint(9),
        );
        expect(mosaicAddressRestrictionTransaction.mosaicId.toHex()).to.be.equal(namespacId.toHex());
        expect(mosaicAddressRestrictionTransaction.restrictionKey.toHex()).to.be.equal(UInt64.fromUint(1).toHex());
        expect(mosaicAddressRestrictionTransaction.previousRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(9).toHex());
        expect(mosaicAddressRestrictionTransaction.newRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(8).toHex());
        expect(mosaicAddressRestrictionTransaction.targetAddressToString()).to.be.equal(account.address.plain());

        const signedTransaction = mosaicAddressRestrictionTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            240,
            signedTransaction.payload.length,
        )).to.be.equal('C51FB4C93FCA5095010000000000000090A75B6B63D31BDA93808727940F24699AE' +
                       'CDDF17C568508BA09000000000000000800000000000000');
    });

    it('should createComplete an MosaicAddressRestrictionTransaction use address alias', () => {
        const mosaicId = new MosaicId(UInt64.fromUint(1).toDTO());
        const namespacId = NamespaceId.createFromEncoded('9550CA3FC9B41FC5');
        const mosaicAddressRestrictionTransaction = MosaicAddressRestrictionTransaction.create(
            Deadline.create(),
            mosaicId,
            UInt64.fromUint(1),
            namespacId,
            UInt64.fromUint(8),
            NetworkType.MIJIN_TEST,
            UInt64.fromUint(9),
        );
        expect(mosaicAddressRestrictionTransaction.mosaicId.toHex()).to.be.equal(mosaicId.toHex());
        expect(mosaicAddressRestrictionTransaction.restrictionKey.toHex()).to.be.equal(UInt64.fromUint(1).toHex());
        expect(mosaicAddressRestrictionTransaction.previousRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(9).toHex());
        expect(mosaicAddressRestrictionTransaction.newRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(8).toHex());
        expect(mosaicAddressRestrictionTransaction.targetAddressToString()).to.be.equal(namespacId.toHex());

        const signedTransaction = mosaicAddressRestrictionTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            240,
            signedTransaction.payload.length,
        )).to.be.equal('0100000000000000010000000000000091C51FB4C93FCA509500000000000000000' +
                       '00000000000000009000000000000000800000000000000');
    });

    it('should format targetAddress payload with 8 bytes binary namespaceId - targetAddressToString', () => {
        const transaction = MosaicAddressRestrictionTransaction.create(
            Deadline.create(),
            new MosaicId(UInt64.fromUint(1).toDTO()),
            UInt64.fromUint(1),
            new NamespaceId('nem.owner'),
            UInt64.fromUint(8),
            NetworkType.MIJIN_TEST,
            UInt64.fromUint(9),
        );

        // test targetAddressToString with NamespaceId recipient
        expect(transaction.targetAddressToString()).to.be.equal('D85742D268617751');

        const signedTransaction = transaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            240,
            288,
        )).to.be.equal('010000000000000001000000000000009151776168D24257');
    });
});
