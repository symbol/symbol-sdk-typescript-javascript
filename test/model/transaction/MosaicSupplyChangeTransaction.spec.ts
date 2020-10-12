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
import { Duration } from 'js-joda';
import { Convert } from '../../../src/core/format';
import { Account } from '../../../src/model/account/Account';
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import { MosaicSupplyChangeAction } from '../../../src/model/mosaic/MosaicSupplyChangeAction';
import { NamespaceId } from '../../../src/model/namespace/NamespaceId';
import { NetworkType } from '../../../src/model/network/NetworkType';
import { ReceiptSource } from '../../../src/model/receipt/ReceiptSource';
import { ResolutionEntry } from '../../../src/model/receipt/ResolutionEntry';
import { ResolutionStatement } from '../../../src/model/receipt/ResolutionStatement';
import { ResolutionType } from '../../../src/model/receipt/ResolutionType';
import { Statement } from '../../../src/model/receipt/Statement';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { MosaicSupplyChangeTransaction } from '../../../src/model/transaction/MosaicSupplyChangeTransaction';
import { TransactionInfo } from '../../../src/model/transaction/TransactionInfo';
import { UInt64 } from '../../../src/model/UInt64';
import { TestingAccount } from '../../conf/conf.spec';

describe('MosaicSupplyChangeTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    let statement: Statement;
    const unresolvedMosaicId = new NamespaceId('mosaic');
    const resolvedMosaicId = new MosaicId('0DC67FBE1CAD29E5');
    const epochAdjustment = Duration.ofSeconds(1573430400);
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

    it('should default maxFee field be set to 0', () => {
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
            Deadline.create(epochAdjustment),
            mosaicId,
            MosaicSupplyChangeAction.Increase,
            UInt64.fromUint(10),
            NetworkType.PRIVATE_TEST,
        );

        expect(mosaicSupplyChangeTransaction.maxFee.higher).to.be.equal(0);
        expect(mosaicSupplyChangeTransaction.maxFee.lower).to.be.equal(0);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
            Deadline.create(epochAdjustment),
            mosaicId,
            MosaicSupplyChangeAction.Increase,
            UInt64.fromUint(10),
            NetworkType.PRIVATE_TEST,
            new UInt64([1, 0]),
        );

        expect(mosaicSupplyChangeTransaction.maxFee.higher).to.be.equal(0);
        expect(mosaicSupplyChangeTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should createComplete an MosaicSupplyChangeTransaction object and sign it', () => {
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
            Deadline.create(epochAdjustment),
            mosaicId,
            MosaicSupplyChangeAction.Increase,
            UInt64.fromUint(10),
            NetworkType.PRIVATE_TEST,
        );

        expect(mosaicSupplyChangeTransaction.action).to.be.equal(MosaicSupplyChangeAction.Increase);
        expect(mosaicSupplyChangeTransaction.delta.lower).to.be.equal(10);
        expect(mosaicSupplyChangeTransaction.delta.higher).to.be.equal(0);
        expect(mosaicSupplyChangeTransaction.mosaicId.id.lower).to.be.equal(2262289484);
        expect(mosaicSupplyChangeTransaction.mosaicId.id.higher).to.be.equal(3405110546);

        const signedTransaction = mosaicSupplyChangeTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '4CCCD78612DDF5CA0A0000000000000001',
        );
    });

    describe('size', () => {
        it('should return 145 for MosaicSupplyChange transaction byte size', () => {
            const mosaicId = new MosaicId([2262289484, 3405110546]);
            const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
                Deadline.create(epochAdjustment),
                mosaicId,
                MosaicSupplyChangeAction.Increase,
                UInt64.fromUint(10),
                NetworkType.PRIVATE_TEST,
            );
            expect(mosaicSupplyChangeTransaction.size).to.be.equal(145);
            expect(Convert.hexToUint8(mosaicSupplyChangeTransaction.serialize()).length).to.be.equal(mosaicSupplyChangeTransaction.size);
        });
        it('should set payload size', () => {
            const mosaicId = new MosaicId([2262289484, 3405110546]);
            const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
                Deadline.create(epochAdjustment),
                mosaicId,
                MosaicSupplyChangeAction.Increase,
                UInt64.fromUint(10),
                NetworkType.PRIVATE_TEST,
            );
            expect(mosaicSupplyChangeTransaction.size).to.be.equal(145);
            expect(Convert.hexToUint8(mosaicSupplyChangeTransaction.serialize()).length).to.be.equal(mosaicSupplyChangeTransaction.size);
            expect(mosaicSupplyChangeTransaction.setPayloadSize(10).size).to.be.equal(10);
        });
    });

    it('Test set maxFee using multiplier', () => {
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
            Deadline.create(epochAdjustment),
            mosaicId,
            MosaicSupplyChangeAction.Increase,
            UInt64.fromUint(10),
            NetworkType.PRIVATE_TEST,
        ).setMaxFee(2);
        expect(mosaicSupplyChangeTransaction.maxFee.compact()).to.be.equal(290);
        const signedTransaction = mosaicSupplyChangeTransaction.signWith(account, generationHash);
        expect(signedTransaction.hash).not.to.be.undefined;
    });

    it('Test resolveAlias can resolve', () => {
        const mosaicSupplyChangeTransaction = new MosaicSupplyChangeTransaction(
            NetworkType.PRIVATE_TEST,
            1,
            Deadline.createFromDTO('1'),
            UInt64.fromUint(0),
            unresolvedMosaicId,
            MosaicSupplyChangeAction.Increase,
            UInt64.fromUint(10),
            '',
            account.publicAccount,
            new TransactionInfo(UInt64.fromUint(2), 0, ''),
        ).resolveAliases(statement);
        expect(mosaicSupplyChangeTransaction.mosaicId instanceof MosaicId).to.be.true;
        expect((mosaicSupplyChangeTransaction.mosaicId as MosaicId).equals(resolvedMosaicId)).to.be.true;

        const signedTransaction = mosaicSupplyChangeTransaction.signWith(account, generationHash);
        expect(signedTransaction.hash).not.to.be.undefined;
    });

    it('Notify Account', () => {
        const tx = MosaicSupplyChangeTransaction.create(
            Deadline.create(epochAdjustment),
            new MosaicId([2262289484, 3405110546]),
            MosaicSupplyChangeAction.Increase,
            UInt64.fromUint(10),
            NetworkType.PRIVATE_TEST,
        );

        Object.assign(tx, { signer: account.publicAccount });
        expect(tx.shouldNotifyAccount(account.address)).to.be.true;
    });
});
