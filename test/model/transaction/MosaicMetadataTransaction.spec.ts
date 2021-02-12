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

import { EmbeddedTransactionBuilder } from 'catbuffer-typescript';
import { expect } from 'chai';
import { Convert } from '../../../src/core/format/Convert';
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
import { MosaicMetadataTransaction } from '../../../src/model/transaction/MosaicMetadataTransaction';
import { TransactionInfo } from '../../../src/model/transaction/TransactionInfo';
import { TransactionType } from '../../../src/model/transaction/TransactionType';
import { UInt64 } from '../../../src/model/UInt64';
import { TestingAccount } from '../../conf/conf.spec';

describe('MosaicMetadataTransaction', () => {
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

    it('should default maxFee field be set to 0', () => {
        const mosaicMetadataTransaction = MosaicMetadataTransaction.create(
            Deadline.create(epochAdjustment),
            account.address,
            UInt64.fromUint(1000),
            new MosaicId([2262289484, 3405110546]),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            NetworkType.PRIVATE_TEST,
        );

        expect(mosaicMetadataTransaction.maxFee.higher).to.be.equal(0);
        expect(mosaicMetadataTransaction.maxFee.lower).to.be.equal(0);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const mosaicMetadataTransaction = MosaicMetadataTransaction.create(
            Deadline.create(epochAdjustment),
            account.address,
            UInt64.fromUint(1000),
            new MosaicId([2262289484, 3405110546]),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            NetworkType.PRIVATE_TEST,
            new UInt64([1, 0]),
        );

        expect(mosaicMetadataTransaction.maxFee.higher).to.be.equal(0);
        expect(mosaicMetadataTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should create and sign an MosaicMetadataTransaction object', () => {
        const mosaicMetadataTransaction = MosaicMetadataTransaction.create(
            Deadline.create(epochAdjustment),
            account.address,
            UInt64.fromUint(1000),
            new MosaicId([2262289484, 3405110546]),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            NetworkType.PRIVATE_TEST,
        );

        const signedTransaction = mosaicMetadataTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            'A8D66C33420E5411995BACFCA2B28CF1C9F5DD7AB181BFA8E8030000000000004CCCD78612DDF5CA01000A0000000000000000000000',
        );
    });

    it('should create and sign an MosaicMetadataTransaction object using alias', () => {
        const namespacId = NamespaceId.createFromEncoded('9550CA3FC9B41FC5');
        const mosaicMetadataTransaction = MosaicMetadataTransaction.create(
            Deadline.create(epochAdjustment),
            account.address,
            UInt64.fromUint(1000),
            namespacId,
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            NetworkType.PRIVATE_TEST,
        );

        const signedTransaction = mosaicMetadataTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            'A8D66C33420E5411995BACFCA2B28CF1C9F5DD7AB181BFA8E803000000000000C51FB4C93FCA509501000A0000000000000000000000',
        );
    });

    describe('size', () => {
        it('should return 182 for MosaicMetadataTransaction byte size', () => {
            const mosaicMetadataTransaction = MosaicMetadataTransaction.create(
                Deadline.create(epochAdjustment),
                account.address,
                UInt64.fromUint(1000),
                new MosaicId([2262289484, 3405110546]),
                1,
                Convert.uint8ToUtf8(new Uint8Array(10)),
                NetworkType.PRIVATE_TEST,
            );
            expect(mosaicMetadataTransaction.size).to.be.equal(182);
            expect(Convert.hexToUint8(mosaicMetadataTransaction.serialize()).length).to.be.equal(mosaicMetadataTransaction.size);
        });

        it('should set payload size', () => {
            const mosaicMetadataTransaction = MosaicMetadataTransaction.create(
                Deadline.create(epochAdjustment),
                account.address,
                UInt64.fromUint(1000),
                new MosaicId([2262289484, 3405110546]),
                1,
                Convert.uint8ToUtf8(new Uint8Array(10)),
                NetworkType.PRIVATE_TEST,
            );
            expect(mosaicMetadataTransaction.size).to.be.equal(182);
            expect(Convert.hexToUint8(mosaicMetadataTransaction.serialize()).length).to.be.equal(mosaicMetadataTransaction.size);
            expect(mosaicMetadataTransaction.setPayloadSize(10).size).to.be.equal(10);
        });
    });

    it('Test set maxFee using multiplier', () => {
        const mosaicMetadataTransaction = MosaicMetadataTransaction.create(
            Deadline.create(epochAdjustment),
            account.address,
            UInt64.fromUint(1000),
            new MosaicId([2262289484, 3405110546]),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            NetworkType.PRIVATE_TEST,
        ).setMaxFee(2);
        expect(mosaicMetadataTransaction.maxFee.compact()).to.be.equal(364);

        const signedTransaction = mosaicMetadataTransaction.signWith(account, generationHash);
        expect(signedTransaction.hash).not.to.be.undefined;
    });

    it('Test resolveAlias can resolve', () => {
        const mosaicMetadataTransaction = new MosaicMetadataTransaction(
            NetworkType.PRIVATE_TEST,
            1,
            Deadline.createFromDTO('1'),
            UInt64.fromUint(0),
            account.address,
            UInt64.fromUint(1000),
            unresolvedMosaicId,
            10,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            '',
            account.publicAccount,
            new TransactionInfo(UInt64.fromUint(2), 0, ''),
        ).resolveAliases(statement);
        expect(mosaicMetadataTransaction.targetMosaicId instanceof MosaicId).to.be.true;
        expect((mosaicMetadataTransaction.targetMosaicId as MosaicId).equals(resolvedMosaicId)).to.be.true;

        const signedTransaction = mosaicMetadataTransaction.signWith(account, generationHash);
        expect(signedTransaction.hash).not.to.be.undefined;
    });

    it('should create EmbeddedTransactionBuilder', () => {
        const mosaicMetadataTransaction = MosaicMetadataTransaction.create(
            Deadline.create(epochAdjustment),
            account.address,
            UInt64.fromUint(1000),
            new MosaicId([2262289484, 3405110546]),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            NetworkType.PRIVATE_TEST,
        );

        Object.assign(mosaicMetadataTransaction, { signer: account.publicAccount });

        const embedded = mosaicMetadataTransaction.toEmbeddedTransaction();

        expect(embedded).to.be.instanceOf(EmbeddedTransactionBuilder);
        expect(Convert.uint8ToHex(embedded.signerPublicKey.key)).to.be.equal(account.publicKey);
        expect(embedded.type.valueOf()).to.be.equal(TransactionType.MOSAIC_METADATA.valueOf());
    });

    it('Notify Account', () => {
        const tx = MosaicMetadataTransaction.create(
            Deadline.create(epochAdjustment),
            account.address,
            UInt64.fromUint(1000),
            new MosaicId([2262289484, 3405110546]),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            NetworkType.PRIVATE_TEST,
        );
        let canNotify = tx.shouldNotifyAccount(account.address);
        expect(canNotify).to.be.true;

        canNotify = tx.shouldNotifyAccount(Address.createFromRawAddress('VATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA35C4KNQ'));
        expect(canNotify).to.be.false;

        Object.assign(tx, { signer: account.publicAccount });
        expect(tx.shouldNotifyAccount(account.address)).to.be.true;
    });

    it('Notify Account with alias', () => {
        const alias = new NamespaceId('test');
        const wrongAlias = new NamespaceId('wrong');
        const tx = MosaicMetadataTransaction.create(
            Deadline.create(epochAdjustment),
            alias,
            UInt64.fromUint(1000),
            new MosaicId([2262289484, 3405110546]),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            NetworkType.PRIVATE_TEST,
        );
        let canNotify = tx.shouldNotifyAccount(alias);
        expect(canNotify).to.be.true;

        canNotify = tx.shouldNotifyAccount(wrongAlias);
        expect(canNotify).to.be.false;

        Object.assign(tx, { signer: account.publicAccount });
        expect(tx.shouldNotifyAccount(account.address)).to.be.true;
    });
});
