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

import {expect} from 'chai';
import {Account} from '../../../src/model/account/Account';
import {NetworkType} from '../../../src/model/blockchain/NetworkType';
import {MosaicId} from '../../../src/model/mosaic/MosaicId';
import {MosaicNonce} from '../../../src/model/mosaic/MosaicNonce';
import {MosaicProperties} from '../../../src/model/mosaic/MosaicProperties';
import {Deadline} from '../../../src/model/transaction/Deadline';
import {MosaicDefinitionTransaction} from '../../../src/model/transaction/MosaicDefinitionTransaction';
import {UInt64} from '../../../src/model/UInt64';
import {TestingAccount} from '../../conf/conf.spec';

describe('MosaicDefinitionTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = TestingAccount;
    });

    it('should default maxFee field be set to 0', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(),
            new MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])), // nonce
            new MosaicId(UInt64.fromUint(1).toDTO()), // ID
            MosaicProperties.create({
                supplyMutable: true,
                transferable: true,
                divisibility: 3,
                restrictable: true,
                duration: UInt64.fromUint(1000),
            }),
            NetworkType.MIJIN_TEST,
        );

        expect(mosaicDefinitionTransaction.maxFee.higher).to.be.equal(0);
        expect(mosaicDefinitionTransaction.maxFee.lower).to.be.equal(0);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(),
            new MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])), // nonce
            new MosaicId(UInt64.fromUint(1).toDTO()), // ID
            MosaicProperties.create({
                supplyMutable: true,
                transferable: true,
                divisibility: 3,
                restrictable: true,
                duration: UInt64.fromUint(1000),
            }),
            NetworkType.MIJIN_TEST,
            new UInt64([1, 0]),
        );

        expect(mosaicDefinitionTransaction.maxFee.higher).to.be.equal(0);
        expect(mosaicDefinitionTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should createComplete an MosaicDefinitionTransaction object and sign it with flags 7', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(),
            new MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])), // nonce
            new MosaicId(UInt64.fromUint(1).toDTO()), // ID
            MosaicProperties.create({
                supplyMutable: true,
                transferable: true,
                divisibility: 3,
                restrictable: true,
                duration: UInt64.fromUint(1000),
            }),
            NetworkType.MIJIN_TEST,
        );

        expect(mosaicDefinitionTransaction.mosaicProperties.duration!.lower).to.be.equal(1000);
        expect(mosaicDefinitionTransaction.mosaicProperties.duration!.higher).to.be.equal(0);
        expect(mosaicDefinitionTransaction.mosaicProperties.divisibility).to.be.equal(3);
        expect(mosaicDefinitionTransaction.mosaicProperties.supplyMutable).to.be.equal(true);
        expect(mosaicDefinitionTransaction.mosaicProperties.transferable).to.be.equal(true);
        expect(mosaicDefinitionTransaction.mosaicProperties.restrictable).to.be.equal(true);

        const signedTransaction = mosaicDefinitionTransaction.signWithCatbuffer(account, generationHash);

        expect(signedTransaction.payload.substring(
            240,
            signedTransaction.payload.length,
        )).to.be.equal('E6DE84B801000000000000000703E803000000000000');

    });

    it('should createComplete an MosaicDefinitionTransaction object and sign it with flags 0', () => {

        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(),
            new MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])), // nonce
            new MosaicId(UInt64.fromUint(1).toDTO()), // ID
            MosaicProperties.create({
                supplyMutable: false,
                transferable: false,
                divisibility: 3,
                duration: UInt64.fromUint(1000),
            }),
            NetworkType.MIJIN_TEST,
        );

        expect(mosaicDefinitionTransaction.mosaicProperties.duration!.lower).to.be.equal(1000);
        expect(mosaicDefinitionTransaction.mosaicProperties.duration!.higher).to.be.equal(0);
        expect(mosaicDefinitionTransaction.mosaicProperties.divisibility).to.be.equal(3);
        expect(mosaicDefinitionTransaction.mosaicProperties.supplyMutable).to.be.equal(false);
        expect(mosaicDefinitionTransaction.mosaicProperties.transferable).to.be.equal(false);
        expect(mosaicDefinitionTransaction.mosaicProperties.restrictable).to.be.equal(false);

        const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            240,
            signedTransaction.payload.length,
        )).to.be.equal('E6DE84B801000000000000000003E803000000000000');

    });

    describe('size', () => {
        it('should return 144 for MosaicDefinition transaction byte size', () => {
            const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
                Deadline.create(),
                new MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])), // nonce
                new MosaicId(UInt64.fromUint(1).toDTO()), // ID
                MosaicProperties.create({
                    supplyMutable: true,
                    transferable: true,
                    divisibility: 3,
                    duration: UInt64.fromUint(1000),
                }),
                NetworkType.MIJIN_TEST,
            );
            expect(mosaicDefinitionTransaction.size).to.be.equal(144);
        });
    });

    it('should createComplete an MosaicDefinitionTransaction object and sign it without duration', () => {

        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(),
            new MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])), // nonce
            new MosaicId(UInt64.fromUint(1).toDTO()), // ID
            MosaicProperties.create({
                supplyMutable: false,
                transferable: false,
                divisibility: 3,
            }),
            NetworkType.MIJIN_TEST,
        );

        expect(mosaicDefinitionTransaction.mosaicProperties.divisibility).to.be.equal(3);
        expect(mosaicDefinitionTransaction.mosaicProperties.supplyMutable).to.be.equal(false);
        expect(mosaicDefinitionTransaction.mosaicProperties.transferable).to.be.equal(false);
        expect(mosaicDefinitionTransaction.mosaicProperties.restrictable).to.be.equal(false);

        const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            240,
            signedTransaction.payload.length,
        )).to.be.equal('E6DE84B8010000000000000000030000000000000000');

    });
});
