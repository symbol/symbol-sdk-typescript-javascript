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
import { MosaicFlags } from '../../../src/model/mosaic/MosaicFlags';
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import { MosaicNonce } from '../../../src/model/mosaic/MosaicNonce';
import { NetworkType } from '../../../src/model/network/NetworkType';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { MosaicDefinitionTransaction } from '../../../src/model/transaction/MosaicDefinitionTransaction';
import { UInt64 } from '../../../src/model/UInt64';
import { TestingAccount } from '../../conf/conf.spec';

describe('MosaicDefinitionTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    const epochAdjustment = Duration.ofSeconds(1573430400);
    before(() => {
        account = TestingAccount;
    });

    it('should default maxFee field be set to 0', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(epochAdjustment),
            MosaicNonce.createFromUint8Array(new Uint8Array([0xe6, 0xde, 0x84, 0xb8])), // nonce
            new MosaicId(UInt64.fromUint(1).toDTO()), // ID
            MosaicFlags.create(true, true, true),
            3,
            UInt64.fromUint(1000),
            NetworkType.MIJIN_TEST,
        );

        expect(mosaicDefinitionTransaction.maxFee.higher).to.be.equal(0);
        expect(mosaicDefinitionTransaction.maxFee.lower).to.be.equal(0);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(epochAdjustment),
            MosaicNonce.createFromUint8Array(new Uint8Array([0xe6, 0xde, 0x84, 0xb8])), // nonce
            new MosaicId(UInt64.fromUint(1).toDTO()), // ID
            MosaicFlags.create(true, true, true),
            3,
            UInt64.fromUint(1000),
            NetworkType.MIJIN_TEST,
            new UInt64([1, 0]),
        );

        expect(mosaicDefinitionTransaction.maxFee.higher).to.be.equal(0);
        expect(mosaicDefinitionTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should createComplete an MosaicDefinitionTransaction object and sign it with flags 7', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(epochAdjustment),
            MosaicNonce.createFromUint8Array(new Uint8Array([0xe6, 0xde, 0x84, 0xb8])), // nonce
            new MosaicId(UInt64.fromUint(1).toDTO()), // ID
            MosaicFlags.create(true, true, true),
            3,
            UInt64.fromUint(1000),
            NetworkType.MIJIN_TEST,
        );

        expect(mosaicDefinitionTransaction.duration!.lower).to.be.equal(1000);
        expect(mosaicDefinitionTransaction.duration!.higher).to.be.equal(0);
        expect(mosaicDefinitionTransaction.divisibility).to.be.equal(3);
        expect(mosaicDefinitionTransaction.flags.supplyMutable).to.be.equal(true);
        expect(mosaicDefinitionTransaction.flags.transferable).to.be.equal(true);
        expect(mosaicDefinitionTransaction.flags.restrictable).to.be.equal(true);

        const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '0100000000000000E803000000000000E6DE84B80703',
        );
    });

    it('should createComplete an MosaicDefinitionTransaction object and sign it with flags 0', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(epochAdjustment),
            MosaicNonce.createFromUint8Array(new Uint8Array([0xe6, 0xde, 0x84, 0xb8])), // nonce
            new MosaicId(UInt64.fromUint(1).toDTO()), // ID
            MosaicFlags.create(false, false, false),
            3,
            UInt64.fromUint(1000),
            NetworkType.MIJIN_TEST,
        );

        expect(mosaicDefinitionTransaction.duration!.lower).to.be.equal(1000);
        expect(mosaicDefinitionTransaction.duration!.higher).to.be.equal(0);
        expect(mosaicDefinitionTransaction.divisibility).to.be.equal(3);
        expect(mosaicDefinitionTransaction.flags.supplyMutable).to.be.equal(false);
        expect(mosaicDefinitionTransaction.flags.transferable).to.be.equal(false);
        expect(mosaicDefinitionTransaction.flags.restrictable).to.be.equal(false);

        const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '0100000000000000E803000000000000E6DE84B80003',
        );
    });

    describe('size', () => {
        it('should return 150 for MosaicDefinition transaction byte size', () => {
            const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
                Deadline.create(epochAdjustment),
                MosaicNonce.createFromUint8Array(new Uint8Array([0xe6, 0xde, 0x84, 0xb8])), // nonce
                new MosaicId(UInt64.fromUint(1).toDTO()), // ID
                MosaicFlags.create(true, true, false),
                3,
                UInt64.fromUint(1000),
                NetworkType.MIJIN_TEST,
            );
            expect(mosaicDefinitionTransaction.size).to.be.equal(150);
            expect(Convert.hexToUint8(mosaicDefinitionTransaction.serialize()).length).to.be.equal(mosaicDefinitionTransaction.size);
        });
        it('should set payload size', () => {
            const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
                Deadline.create(epochAdjustment),
                MosaicNonce.createFromUint8Array(new Uint8Array([0xe6, 0xde, 0x84, 0xb8])), // nonce
                new MosaicId(UInt64.fromUint(1).toDTO()), // ID
                MosaicFlags.create(true, true, false),
                3,
                UInt64.fromUint(1000),
                NetworkType.MIJIN_TEST,
            );
            expect(mosaicDefinitionTransaction.size).to.be.equal(150);
            expect(Convert.hexToUint8(mosaicDefinitionTransaction.serialize()).length).to.be.equal(mosaicDefinitionTransaction.size);
            expect(mosaicDefinitionTransaction.setPayloadSize(10).size).to.be.equal(10);
        });
    });

    it('should createComplete an MosaicDefinitionTransaction object and sign it without duration', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(epochAdjustment),
            MosaicNonce.createFromUint8Array(new Uint8Array([0xe6, 0xde, 0x84, 0xb8])), // nonce
            new MosaicId(UInt64.fromUint(1).toDTO()), // ID
            MosaicFlags.create(false, false, false),
            3,
            UInt64.fromUint(0),
            NetworkType.MIJIN_TEST,
        );

        expect(mosaicDefinitionTransaction.divisibility).to.be.equal(3);
        expect(mosaicDefinitionTransaction.flags.supplyMutable).to.be.equal(false);
        expect(mosaicDefinitionTransaction.flags.transferable).to.be.equal(false);
        expect(mosaicDefinitionTransaction.flags.restrictable).to.be.equal(false);

        const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '01000000000000000000000000000000E6DE84B80003',
        );
    });

    it('Test set maxFee using multiplier', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(epochAdjustment),
            MosaicNonce.createFromUint8Array(new Uint8Array([0xe6, 0xde, 0x84, 0xb8])), // nonce
            new MosaicId(UInt64.fromUint(1).toDTO()), // ID
            MosaicFlags.create(false, false, false),
            3,
            UInt64.fromUint(0),
            NetworkType.MIJIN_TEST,
        ).setMaxFee(2);
        expect(mosaicDefinitionTransaction.maxFee.compact()).to.be.equal(300);

        const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);
        expect(signedTransaction.hash).not.to.be.undefined;
    });

    it('Notify Account', () => {
        const tx = MosaicDefinitionTransaction.create(
            Deadline.create(epochAdjustment),
            MosaicNonce.createFromUint8Array(new Uint8Array([0xe6, 0xde, 0x84, 0xb8])), // nonce
            new MosaicId(UInt64.fromUint(1).toDTO()), // ID
            MosaicFlags.create(false, false, false),
            3,
            UInt64.fromUint(0),
            NetworkType.MIJIN_TEST,
        );

        Object.assign(tx, { signer: account.publicAccount });
        expect(tx.shouldNotifyAccount(account.address)).to.be.true;
    });
});
