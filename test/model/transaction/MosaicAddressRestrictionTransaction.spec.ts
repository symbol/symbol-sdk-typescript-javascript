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

import { expect } from 'chai';
import { Convert } from '../../../src/core/format';
import { Account } from '../../../src/model/account/Account';
import { Address } from '../../../src/model/account/Address';
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import { NamespaceId } from '../../../src/model/namespace/NamespaceId';
import { NetworkType } from '../../../src/model/network/NetworkType';
import { ReceiptSource } from '../../../src/model/receipt/ReceiptSource';
import { ResolutionEntry } from '../../../src/model/receipt/ResolutionEntry';
import { ResolutionStatement } from '../../../src/model/receipt/ResolutionStatement';
import { ResolutionType } from '../../../src/model/receipt/ResolutionType';
import { Statement } from '../../../src/model/receipt/Statement';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { MosaicAddressRestrictionTransaction } from '../../../src/model/transaction/MosaicAddressRestrictionTransaction';
import { TransactionInfo } from '../../../src/model/transaction/TransactionInfo';
import { UInt64 } from '../../../src/model/UInt64';
import { TestingAccount } from '../../conf/conf.spec';

describe('MosaicAddressRestrictionTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    let statement: Statement;
    const unresolvedAddress = new NamespaceId('address');
    const unresolvedMosaicId = new NamespaceId('mosaic');
    const resolvedMosaicId = new MosaicId('0DC67FBE1CAD29E5');
    const epochAdjustment = 1573430400;
    before(() => {
        account = TestingAccount;
        statement = new Statement(
            [],
            [
                new ResolutionStatement(ResolutionType.Address, UInt64.fromUint(2), unresolvedAddress, [
                    new ResolutionEntry(account.address, new ReceiptSource(1, 0)),
                ]),
            ],
            [
                new ResolutionStatement(ResolutionType.Mosaic, UInt64.fromUint(2), unresolvedMosaicId, [
                    new ResolutionEntry(resolvedMosaicId, new ReceiptSource(1, 0)),
                ]),
            ],
        );
    });

    it('should createComplete an MosaicAddressRestrictionTransaction object and sign', () => {
        const mosaicId = new MosaicId(UInt64.fromUint(1).toDTO());
        const mosaicAddressRestrictionTransaction = MosaicAddressRestrictionTransaction.create(
            Deadline.create(epochAdjustment),
            mosaicId,
            UInt64.fromUint(1),
            account.address,
            UInt64.fromUint(8),
            NetworkType.TEST_NET,
            UInt64.fromUint(9),
        );
        expect(mosaicAddressRestrictionTransaction.mosaicId.toHex()).to.be.equal(mosaicId.toHex());
        expect(mosaicAddressRestrictionTransaction.restrictionKey.toHex()).to.be.equal(UInt64.fromUint(1).toHex());
        expect(mosaicAddressRestrictionTransaction.previousRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(9).toHex());
        expect(mosaicAddressRestrictionTransaction.newRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(8).toHex());
        expect(mosaicAddressRestrictionTransaction.targetAddressToString()).to.be.equal(account.address.plain());

        const signedTransaction = mosaicAddressRestrictionTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '01000000000000000100000000000000090000000000000008000000000000009826D27E1D0A26CA4E316F901E23E55C8711DB20DFD26776',
        );
    });

    it('should createComplete an MosaicAddressRestrictionTransaction use mosaic alias', () => {
        const namespacId = NamespaceId.createFromEncoded('9550CA3FC9B41FC5');
        const mosaicAddressRestrictionTransaction = MosaicAddressRestrictionTransaction.create(
            Deadline.create(epochAdjustment),
            namespacId,
            UInt64.fromUint(1),
            account.address,
            UInt64.fromUint(8),
            NetworkType.TEST_NET,
            UInt64.fromUint(9),
        );
        expect(mosaicAddressRestrictionTransaction.mosaicId.toHex()).to.be.equal(namespacId.toHex());
        expect(mosaicAddressRestrictionTransaction.restrictionKey.toHex()).to.be.equal(UInt64.fromUint(1).toHex());
        expect(mosaicAddressRestrictionTransaction.previousRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(9).toHex());
        expect(mosaicAddressRestrictionTransaction.newRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(8).toHex());
        expect(mosaicAddressRestrictionTransaction.targetAddressToString()).to.be.equal(account.address.plain());

        const signedTransaction = mosaicAddressRestrictionTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            'C51FB4C93FCA50950100000000000000090000000000000008000000000000009826D27E1D0A26CA4E316F901E23E55C8711DB20DFD26776',
        );
    });

    it('should createComplete an MosaicAddressRestrictionTransaction use address alias', () => {
        const mosaicId = new MosaicId(UInt64.fromUint(1).toDTO());
        const namespacId = NamespaceId.createFromEncoded('9550CA3FC9B41FC5');
        const mosaicAddressRestrictionTransaction = MosaicAddressRestrictionTransaction.create(
            Deadline.create(epochAdjustment),
            mosaicId,
            UInt64.fromUint(1),
            namespacId,
            UInt64.fromUint(8),
            NetworkType.TEST_NET,
            UInt64.fromUint(9),
        );
        expect(mosaicAddressRestrictionTransaction.mosaicId.toHex()).to.be.equal(mosaicId.toHex());
        expect(mosaicAddressRestrictionTransaction.restrictionKey.toHex()).to.be.equal(UInt64.fromUint(1).toHex());
        expect(mosaicAddressRestrictionTransaction.previousRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(9).toHex());
        expect(mosaicAddressRestrictionTransaction.newRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(8).toHex());
        expect(mosaicAddressRestrictionTransaction.targetAddressToString()).to.be.equal(namespacId.toHex());

        const signedTransaction = mosaicAddressRestrictionTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '010000000000000001000000000000000900000000000000080000000000000099C51FB4C93FCA5095000000000000000000000000000000',
        );
    });

    it('should format targetAddress payload with 8 bytes binary namespaceId - targetAddressToString', () => {
        const transaction = MosaicAddressRestrictionTransaction.create(
            Deadline.create(epochAdjustment),
            new MosaicId(UInt64.fromUint(1).toDTO()),
            UInt64.fromUint(1),
            new NamespaceId('nem.owner'),
            UInt64.fromUint(8),
            NetworkType.TEST_NET,
            UInt64.fromUint(9),
        );

        // test targetAddressToString with NamespaceId recipient
        expect(transaction.targetAddressToString()).to.be.equal('D85742D268617751');

        const signedTransaction = transaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, 304)).to.be.equal('010000000000000001000000000000000900000000000000');

        expect(Convert.hexToUint8(transaction.serialize()).length).to.be.equal(transaction.size);
    });

    it('Test set maxFee using multiplier', () => {
        const transaction = MosaicAddressRestrictionTransaction.create(
            Deadline.create(epochAdjustment),
            new MosaicId(UInt64.fromUint(1).toDTO()),
            UInt64.fromUint(1),
            new NamespaceId('nem.owner'),
            UInt64.fromUint(8),
            NetworkType.TEST_NET,
            UInt64.fromUint(9),
        ).setMaxFee(2);
        expect(transaction.maxFee.compact()).to.be.equal(368);

        const signedTransaction = transaction.signWith(account, generationHash);
        expect(signedTransaction.hash).not.to.be.undefined;
    });

    it('Test resolveAlias can resolve', () => {
        const transaction = new MosaicAddressRestrictionTransaction(
            NetworkType.TEST_NET,
            1,
            Deadline.createFromDTO('1'),
            UInt64.fromUint(0),
            unresolvedMosaicId,
            UInt64.fromUint(8),
            unresolvedAddress,
            UInt64.fromUint(8),
            UInt64.fromUint(9),
            '',
            account.publicAccount,
            new TransactionInfo(UInt64.fromUint(2), 0, ''),
        ).resolveAliases(statement);
        expect(transaction.targetAddress instanceof Address).to.be.true;
        expect(transaction.mosaicId instanceof MosaicId).to.be.true;
        expect((transaction.targetAddress as Address).equals(account.address)).to.be.true;
        expect((transaction.mosaicId as MosaicId).equals(resolvedMosaicId)).to.be.true;

        const signedTransaction = transaction.signWith(account, generationHash);
        expect(signedTransaction.hash).not.to.be.undefined;
    });
});
