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
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import { NamespaceId } from '../../../src/model/namespace/NamespaceId';
import { ReceiptSource } from '../../../src/model/receipt/ReceiptSource';
import { ResolutionEntry } from '../../../src/model/receipt/ResolutionEntry';
import { ResolutionStatement } from '../../../src/model/receipt/ResolutionStatement';
import { ResolutionType } from '../../../src/model/receipt/ResolutionType';
import { Statement } from '../../../src/model/receipt/Statement';
import { MosaicRestrictionType } from '../../../src/model/restriction/MosaicRestrictionType';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { MosaicGlobalRestrictionTransaction } from '../../../src/model/transaction/MosaicGlobalRestrictionTransaction';
import { TransactionInfo } from '../../../src/model/transaction/TransactionInfo';
import { UInt64 } from '../../../src/model/UInt64';
import { TestingAccount, TestNetworkType } from '../../conf/conf.spec';

describe('MosaicGlobalRestrictionTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    let statement: Statement;
    const unresolvedMosaicId = new NamespaceId('mosaic');
    const resolvedMosaicId = new MosaicId('0DC67FBE1CAD29E5');
    const epochAdjustment = 1573430400;
    before(() => {
        account = TestingAccount;
        statement = new Statement(
            [],
            [],
            [
                new ResolutionStatement(ResolutionType.Mosaic, UInt64.fromUint(2), unresolvedMosaicId, [
                    new ResolutionEntry(resolvedMosaicId, new ReceiptSource(1, 0)),
                ]),
            ],
        );
    });

    it('should createComplete an MosaicGlobalRestrictionTransaction object and sign', () => {
        const mosaicId = new MosaicId(UInt64.fromUint(1).toDTO());
        const referenceMosaicId = new MosaicId(UInt64.fromUint(2).toDTO());
        const mosaicGlobalRestrictionTransaction = MosaicGlobalRestrictionTransaction.create(
            Deadline.create(epochAdjustment),
            mosaicId,
            UInt64.fromUint(1),
            UInt64.fromUint(9),
            MosaicRestrictionType.EQ,
            UInt64.fromUint(8),
            MosaicRestrictionType.GE,
            TestNetworkType,
            referenceMosaicId,
        );

        expect(mosaicGlobalRestrictionTransaction.mosaicId.toHex()).to.be.equal(mosaicId.toHex());
        expect(mosaicGlobalRestrictionTransaction.referenceMosaicId.toHex()).to.be.equal(referenceMosaicId.toHex());
        expect(mosaicGlobalRestrictionTransaction.restrictionKey.toHex()).to.be.equal(UInt64.fromUint(1).toHex());
        expect(mosaicGlobalRestrictionTransaction.previousRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(9).toHex());
        expect(mosaicGlobalRestrictionTransaction.newRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(8).toHex());
        expect(mosaicGlobalRestrictionTransaction.previousRestrictionType).to.be.equal(MosaicRestrictionType.EQ);
        expect(mosaicGlobalRestrictionTransaction.newRestrictionType).to.be.equal(MosaicRestrictionType.GE);

        const signedTransaction = mosaicGlobalRestrictionTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '010000000000000002000000000000000100000000000000090000000000000008000000000000000106',
        );
    });

    it('should createComplete an MosaicGlobalRestrictionTransaction use mosaic alias', () => {
        const namespacId = NamespaceId.createFromEncoded('9550CA3FC9B41FC5');
        const referenceMosaicId = new MosaicId(UInt64.fromUint(2).toDTO());
        const mosaicGlobalRestrictionTransaction = MosaicGlobalRestrictionTransaction.create(
            Deadline.create(epochAdjustment),
            namespacId,
            UInt64.fromUint(1),
            UInt64.fromUint(9),
            MosaicRestrictionType.EQ,
            UInt64.fromUint(8),
            MosaicRestrictionType.GE,
            TestNetworkType,
            referenceMosaicId,
        );

        expect(mosaicGlobalRestrictionTransaction.mosaicId.toHex()).to.be.equal(namespacId.toHex());
        expect(mosaicGlobalRestrictionTransaction.referenceMosaicId.toHex()).to.be.equal(referenceMosaicId.toHex());
        expect(mosaicGlobalRestrictionTransaction.restrictionKey.toHex()).to.be.equal(UInt64.fromUint(1).toHex());
        expect(mosaicGlobalRestrictionTransaction.previousRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(9).toHex());
        expect(mosaicGlobalRestrictionTransaction.newRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(8).toHex());
        expect(mosaicGlobalRestrictionTransaction.previousRestrictionType).to.be.equal(MosaicRestrictionType.EQ);
        expect(mosaicGlobalRestrictionTransaction.newRestrictionType).to.be.equal(MosaicRestrictionType.GE);

        const signedTransaction = mosaicGlobalRestrictionTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            'C51FB4C93FCA509502000000000000000100000000000000090000000000000008000000000000000106',
        );

        expect(Convert.hexToUint8(mosaicGlobalRestrictionTransaction.serialize()).length).to.be.equal(
            mosaicGlobalRestrictionTransaction.size,
        );
    });

    it('should createComplete an MosaicGlobalRestrictionTransaction use mosaic alias reference', () => {
        const namespacId = NamespaceId.createFromEncoded('9550CA3FC9B41FC5');
        const mosaicId = new MosaicId(UInt64.fromUint(1).toDTO());
        const mosaicGlobalRestrictionTransaction = MosaicGlobalRestrictionTransaction.create(
            Deadline.create(epochAdjustment),
            mosaicId,
            UInt64.fromUint(1),
            UInt64.fromUint(9),
            MosaicRestrictionType.EQ,
            UInt64.fromUint(8),
            MosaicRestrictionType.GE,
            TestNetworkType,
            namespacId,
        );

        expect(mosaicGlobalRestrictionTransaction.mosaicId.toHex()).to.be.equal(mosaicId.toHex());
        expect(mosaicGlobalRestrictionTransaction.referenceMosaicId.toHex()).to.be.equal(namespacId.toHex());
        expect(mosaicGlobalRestrictionTransaction.restrictionKey.toHex()).to.be.equal(UInt64.fromUint(1).toHex());
        expect(mosaicGlobalRestrictionTransaction.previousRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(9).toHex());
        expect(mosaicGlobalRestrictionTransaction.newRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(8).toHex());
        expect(mosaicGlobalRestrictionTransaction.previousRestrictionType).to.be.equal(MosaicRestrictionType.EQ);
        expect(mosaicGlobalRestrictionTransaction.newRestrictionType).to.be.equal(MosaicRestrictionType.GE);

        const signedTransaction = mosaicGlobalRestrictionTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '0100000000000000C51FB4C93FCA50950100000000000000090000000000000008000000000000000106',
        );
    });

    it('Test set maxFee using multiplier', () => {
        const mosaicId = new MosaicId(UInt64.fromUint(1).toDTO());
        const referenceMosaicId = new MosaicId(UInt64.fromUint(2).toDTO());
        const mosaicGlobalRestrictionTransaction = MosaicGlobalRestrictionTransaction.create(
            Deadline.create(epochAdjustment),
            mosaicId,
            UInt64.fromUint(1),
            UInt64.fromUint(9),
            MosaicRestrictionType.EQ,
            UInt64.fromUint(8),
            MosaicRestrictionType.GE,
            TestNetworkType,
            referenceMosaicId,
        ).setMaxFee(2);
        expect(mosaicGlobalRestrictionTransaction.maxFee.compact()).to.be.equal(340);

        const signedTransaction = mosaicGlobalRestrictionTransaction.signWith(account, generationHash);
        expect(signedTransaction.hash).not.to.be.undefined;
    });

    it('Test resolveAlias can resolve', () => {
        const mosaicGlobalRestrictionTransaction = new MosaicGlobalRestrictionTransaction(
            TestNetworkType,
            1,
            Deadline.createFromDTO('1'),
            UInt64.fromUint(0),
            unresolvedMosaicId,
            unresolvedMosaicId,
            UInt64.fromUint(1),
            UInt64.fromUint(9),
            MosaicRestrictionType.EQ,
            UInt64.fromUint(8),
            MosaicRestrictionType.GE,
            '',
            account.publicAccount,
            new TransactionInfo(UInt64.fromUint(2), 0, ''),
        ).resolveAliases(statement);
        expect(mosaicGlobalRestrictionTransaction.mosaicId instanceof MosaicId).to.be.true;
        expect((mosaicGlobalRestrictionTransaction.mosaicId as MosaicId).equals(resolvedMosaicId)).to.be.true;
        expect(mosaicGlobalRestrictionTransaction.referenceMosaicId instanceof MosaicId).to.be.true;
        expect((mosaicGlobalRestrictionTransaction.referenceMosaicId as MosaicId).equals(resolvedMosaicId)).to.be.true;

        const signedTransaction = mosaicGlobalRestrictionTransaction.signWith(account, generationHash);
        expect(signedTransaction.hash).not.to.be.undefined;
    });

    it('Notify Account', () => {
        const mosaicId = new MosaicId(UInt64.fromUint(1).toDTO());
        const referenceMosaicId = new MosaicId(UInt64.fromUint(2).toDTO());
        const tx = MosaicGlobalRestrictionTransaction.create(
            Deadline.create(epochAdjustment),
            mosaicId,
            UInt64.fromUint(1),
            UInt64.fromUint(9),
            MosaicRestrictionType.EQ,
            UInt64.fromUint(8),
            MosaicRestrictionType.GE,
            TestNetworkType,
            referenceMosaicId,
        );

        Object.assign(tx, { signer: account.publicAccount });
        expect(tx.shouldNotifyAccount(account.address)).to.be.true;
    });
});
