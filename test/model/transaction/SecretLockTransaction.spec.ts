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
import * as CryptoJS from 'crypto-js';
import {keccak_256, sha3_256} from 'js-sha3';
import {Convert, Convert as convert} from '../../../src/core/format';
import { Account } from '../../../src/model/account/Account';
import {Address} from '../../../src/model/account/Address';
import {NetworkType} from '../../../src/model/blockchain/NetworkType';
import {NetworkCurrencyMosaic} from '../../../src/model/mosaic/NetworkCurrencyMosaic';
import { NamespaceId } from '../../../src/model/namespace/NamespaceId';
import {Deadline} from '../../../src/model/transaction/Deadline';
import {HashType} from '../../../src/model/transaction/HashType';
import {SecretLockTransaction} from '../../../src/model/transaction/SecretLockTransaction';
import {UInt64} from '../../../src/model/UInt64';
import { TestingAccount } from '../../conf/conf.spec';

describe('SecretLockTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = TestingAccount;
    });
    it('should default maxFee field be set to 0', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const recipientAddress = Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL');
        const secretLockTransaction = SecretLockTransaction.create(
            Deadline.create(),
            NetworkCurrencyMosaic.createAbsolute(10),
            UInt64.fromUint(100),
            HashType.Op_Sha3_256,
            sha3_256.create().update(convert.hexToUint8(proof)).hex(),
            recipientAddress,
            NetworkType.MIJIN_TEST,
        );

        expect(secretLockTransaction.maxFee.higher).to.be.equal(0);
        expect(secretLockTransaction.maxFee.lower).to.be.equal(0);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const recipientAddress = Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL');
        const secretLockTransaction = SecretLockTransaction.create(
            Deadline.create(),
            NetworkCurrencyMosaic.createAbsolute(10),
            UInt64.fromUint(100),
            HashType.Op_Sha3_256,
            sha3_256.create().update(convert.hexToUint8(proof)).hex(),
            recipientAddress,
            NetworkType.MIJIN_TEST,
            new UInt64([1, 0]),
        );

        expect(secretLockTransaction.maxFee.higher).to.be.equal(0);
        expect(secretLockTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should be created with HashType: Op_Sha3_256 secret', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const recipientAddress = Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL');
        const secretLockTransaction = SecretLockTransaction.create(
            Deadline.create(),
            NetworkCurrencyMosaic.createAbsolute(10),
            UInt64.fromUint(100),
            HashType.Op_Sha3_256,
            sha3_256.create().update(convert.hexToUint8(proof)).hex(),
            recipientAddress,
            NetworkType.MIJIN_TEST,
        );
        deepEqual(secretLockTransaction.mosaic.id.id, NetworkCurrencyMosaic.NAMESPACE_ID.id);
        expect(secretLockTransaction.mosaic.amount.equals(UInt64.fromUint(10))).to.be.equal(true);
        expect(secretLockTransaction.duration.equals(UInt64.fromUint(100))).to.be.equal(true);
        expect(secretLockTransaction.hashType).to.be.equal(0);
        expect(secretLockTransaction.secret).to.be.equal('9b3155b37159da50aa52d5967c509b410f5a36a3b1e31ecb5ac76675d79b4a5e');
        expect(secretLockTransaction.recipientAddress).to.be.equal(recipientAddress);
    });

    it('should be created and sign SecretLock Transaction', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const recipientAddress = Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL');
        const secretLockTransaction = SecretLockTransaction.create(
            Deadline.create(),
            NetworkCurrencyMosaic.createAbsolute(10),
            UInt64.fromUint(100),
            HashType.Op_Sha3_256,
            sha3_256.create().update(convert.hexToUint8(proof)).hex(),
            recipientAddress,
            NetworkType.MIJIN_TEST,
        );
        const signedTx = secretLockTransaction.signWith(account, generationHash);
        expect(signedTx.payload.substring(
            240,
            signedTx.payload.length,
        )).to.be.equal(
            '44B262C46CEABB850A000000000000006400000000000000009B3155B37159DA50AA52D5967C509B41' +
            '0F5A36A3B1E31ECB5AC76675D79B4A5E90C2337113E6D8F15B56E0821149299F340C01706FC1CAD6CB');
    });

    it('should throw exception when the input is not related to HashTyp: Op_Sha3_256', () => {
        expect(() => {
            const recipientAddress = Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL');
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                NetworkCurrencyMosaic.createAbsolute(10),
                UInt64.fromUint(100),
                HashType.Op_Sha3_256,
                'non valid hash',
                recipientAddress,
                NetworkType.MIJIN_TEST,
            );
        }).to.throw(Error);
    });

    it('should be created with HashType: Op_Keccak_256 secret', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const recipientAddress = Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL');
        const secretLockTransaction = SecretLockTransaction.create(
            Deadline.create(),
            NetworkCurrencyMosaic.createAbsolute(10),
            UInt64.fromUint(100),
            HashType.Op_Keccak_256,
            keccak_256.create().update(convert.hexToUint8(proof)).hex(),
            recipientAddress,
            NetworkType.MIJIN_TEST,
        );
        deepEqual(secretLockTransaction.mosaic.id.id, NetworkCurrencyMosaic.NAMESPACE_ID.id);
        expect(secretLockTransaction.mosaic.amount.equals(UInt64.fromUint(10))).to.be.equal(true);
        expect(secretLockTransaction.duration.equals(UInt64.fromUint(100))).to.be.equal(true);
        expect(secretLockTransaction.hashType).to.be.equal(1);
        expect(secretLockTransaction.secret).to.be.equal('241c1d54c18c8422def03aa16b4b243a8ba491374295a1a6965545e6ac1af314');
        expect(secretLockTransaction.recipientAddress).to.be.equal(recipientAddress);
    });

    it('should throw exception when the input is not related to HashTyp: Op_Keccak_256', () => {
        expect(() => {
            const recipientAddress = Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL');
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                NetworkCurrencyMosaic.createAbsolute(10),
                UInt64.fromUint(100),
                HashType.Op_Keccak_256,
                'non valid hash',
                recipientAddress,
                NetworkType.MIJIN_TEST,
            );
        }).to.throw(Error);
    });
    it('should be created with HashType: Op_Hash_160 secret', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9';
        const recipientAddress = Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL');
        const secretLockTransaction = SecretLockTransaction.create(
            Deadline.create(),
            NetworkCurrencyMosaic.createAbsolute(10),
            UInt64.fromUint(100),
            HashType.Op_Hash_160,
            CryptoJS.RIPEMD160(CryptoJS.SHA256(proof).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex),
            recipientAddress,
            NetworkType.MIJIN_TEST,
        );
        deepEqual(secretLockTransaction.mosaic.id.id, NetworkCurrencyMosaic.NAMESPACE_ID.id);
        expect(secretLockTransaction.mosaic.amount.equals(UInt64.fromUint(10))).to.be.equal(true);
        expect(secretLockTransaction.duration.equals(UInt64.fromUint(100))).to.be.equal(true);
        expect(secretLockTransaction.hashType).to.be.equal(2);
        expect(secretLockTransaction.secret).to.be.equal('3fc43d717d824302e3821de8129ea2f7786912e5');
        expect(secretLockTransaction.recipientAddress).to.be.equal(recipientAddress);
    });

    it('should throw exception when the input is not related to HashTyp: Op_Hash_160', () => {
        expect(() => {
            const recipientAddress = Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL');
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                NetworkCurrencyMosaic.createAbsolute(10),
                UInt64.fromUint(100),
                HashType.Op_Hash_160,
                'non valid hash',
                recipientAddress,
                NetworkType.MIJIN_TEST,
            );
        }).to.throw(Error);
    });
    it('should be created with HashType: Op_Hash_256 secret', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const recipientAddress = Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL');
        const secretLockTransaction = SecretLockTransaction.create(
            Deadline.create(),
            NetworkCurrencyMosaic.createAbsolute(10),
            UInt64.fromUint(100),
            HashType.Op_Hash_256,
            CryptoJS.SHA256(CryptoJS.SHA256(proof).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex),
            recipientAddress,
            NetworkType.MIJIN_TEST,
        );
        deepEqual(secretLockTransaction.mosaic.id.id, NetworkCurrencyMosaic.NAMESPACE_ID.id);
        expect(secretLockTransaction.mosaic.amount.equals(UInt64.fromUint(10))).to.be.equal(true);
        expect(secretLockTransaction.duration.equals(UInt64.fromUint(100))).to.be.equal(true);
        expect(secretLockTransaction.hashType).to.be.equal(3);
        expect(secretLockTransaction.secret).to.be.equal('c346f5ecf5bcfa54ab14fad815c8239bdeb051df8835d212dba2af59f688a00e');
        expect(secretLockTransaction.recipientAddress).to.be.equal(recipientAddress);
    });

    it('should throw exception when the input is not related to HashTyp: Op_Hash_256', () => {
        expect(() => {
            const recipientAddress = Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL');
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                NetworkCurrencyMosaic.createAbsolute(10),
                UInt64.fromUint(100),
                HashType.Op_Hash_256,
                'non valid hash',
                recipientAddress,
                NetworkType.MIJIN_TEST,
            );
        }).to.throw(Error);
    });

    describe('size', () => {
        it('should return 202 for SecretLockTransaction with proof of 32 bytes', () => {
            const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
            const recipientAddress = Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL');
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                NetworkCurrencyMosaic.createAbsolute(10),
                UInt64.fromUint(100),
                HashType.Op_Hash_256,
                CryptoJS.SHA256(CryptoJS.SHA256(proof).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex),
                recipientAddress,
                NetworkType.MIJIN_TEST,
            );
            expect(secretLockTransaction.size).to.be.equal(202);
            expect(Convert.hexToUint8(secretLockTransaction.serialize()).length).to.be.equal(secretLockTransaction.size);
        });
    });

    it('should be created with alias address', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const recipientAddress = new NamespaceId('test');
        const secretLockTransaction = SecretLockTransaction.create(
            Deadline.create(),
            NetworkCurrencyMosaic.createAbsolute(10),
            UInt64.fromUint(100),
            HashType.Op_Sha3_256,
            sha3_256.create().update(convert.hexToUint8(proof)).hex(),
            recipientAddress,
            NetworkType.MIJIN_TEST,
        );
        deepEqual(secretLockTransaction.mosaic.id.id, NetworkCurrencyMosaic.NAMESPACE_ID.id);
        expect(secretLockTransaction.mosaic.amount.equals(UInt64.fromUint(10))).to.be.equal(true);
        expect(secretLockTransaction.duration.equals(UInt64.fromUint(100))).to.be.equal(true);
        expect(secretLockTransaction.hashType).to.be.equal(0);
        expect(secretLockTransaction.secret).to.be.equal('9b3155b37159da50aa52d5967c509b410f5a36a3b1e31ecb5ac76675d79b4a5e');
        expect(secretLockTransaction.recipientAddress).to.be.equal(recipientAddress);
    });
});
