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
import * as CryptoJS from 'crypto-js';
import {keccak_256, sha3_256} from 'js-sha3';
import * as convert from '../../../src/core/format/Convert';
import { Account } from '../../../src/model/account/Account';
import {NetworkType} from '../../../src/model/blockchain/NetworkType';
import {Deadline} from '../../../src/model/transaction/Deadline';
import {HashType} from '../../../src/model/transaction/HashType';
import {SecretProofTransaction} from '../../../src/model/transaction/SecretProofTransaction';
import {UInt64} from '../../../src/model/UInt64';
import { TestingAccount } from '../../conf/conf.spec';

describe('SecretProofTransaction', () => {
    let account: Account;

    before(() => {
        account = TestingAccount;
    });

    it('should default maxFee field be set to 0', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const secretProofTransaction = SecretProofTransaction.create(
            Deadline.create(),
            HashType.Op_Sha3_256,
            sha3_256.create().update(convert.hexToUint8(proof)).hex(),
            account.address,
            proof,
            NetworkType.MIJIN_TEST,
        );

        expect(secretProofTransaction.maxFee.higher).to.be.equal(0);
        expect(secretProofTransaction.maxFee.lower).to.be.equal(0);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const secretProofTransaction = SecretProofTransaction.create(
            Deadline.create(),
            HashType.Op_Sha3_256,
            sha3_256.create().update(convert.hexToUint8(proof)).hex(),
            account.address,
            proof,
            NetworkType.MIJIN_TEST,
            new UInt64([1, 0]),
        );

        expect(secretProofTransaction.maxFee.higher).to.be.equal(0);
        expect(secretProofTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should be created with HashType: Op_Sha3_256 secret', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const secretProofTransaction = SecretProofTransaction.create(
            Deadline.create(),
            HashType.Op_Sha3_256,
            sha3_256.create().update(convert.hexToUint8(proof)).hex(),
            account.address,
            proof,
            NetworkType.MIJIN_TEST,
        );
        expect(secretProofTransaction.hashType).to.be.equal(0);
        expect(secretProofTransaction.secret).to.be.equal('9b3155b37159da50aa52d5967c509b410f5a36a3b1e31ecb5ac76675d79b4a5e' );
        expect(secretProofTransaction.proof).to.be.equal(proof);
    });

    it('should throw exception when the input is not related to HashType', () => {
        expect(() => {
            const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
            const secretProofTransaction = SecretProofTransaction.create(
                Deadline.create(),
                HashType.Op_Sha3_256,
                'non valid hash',
                account.address,
                proof,
                NetworkType.MIJIN_TEST,
            );
        }).to.throw(Error);
    });
    it('should be created with HashType: Op_Keccak_256 secret', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const secretProofTransaction = SecretProofTransaction.create(
            Deadline.create(),
            HashType.Op_Keccak_256,
            keccak_256.create().update(convert.hexToUint8(proof)).hex(),
            account.address,
            proof,
            NetworkType.MIJIN_TEST,
        );
        expect(secretProofTransaction.hashType).to.be.equal(1);
        expect(secretProofTransaction.secret).to.be.equal('241c1d54c18c8422def03aa16b4b243a8ba491374295a1a6965545e6ac1af314' );
        expect(secretProofTransaction.proof).to.be.equal(proof);
    });

    it('should throw exception when the input is not related to HashType', () => {
        expect(() => {
            const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
            const secretProofTransaction = SecretProofTransaction.create(
                Deadline.create(),
                HashType.Op_Keccak_256,
                'non valid hash',
                account.address,
                proof,
                NetworkType.MIJIN_TEST,
            );
        }).to.throw(Error);
    });
    it('should be created with HashType: Op_Hash_160 secret', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9';
        const secretProofTransaction = SecretProofTransaction.create(
            Deadline.create(),
            HashType.Op_Hash_160,
            CryptoJS.RIPEMD160(CryptoJS.SHA256(proof).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex),
            account.address,
            proof,
            NetworkType.MIJIN_TEST,
        );
        expect(secretProofTransaction.hashType).to.be.equal(2);
        expect(secretProofTransaction.secret).to.be.equal('3fc43d717d824302e3821de8129ea2f7786912e5' );
        expect(secretProofTransaction.proof).to.be.equal(proof);
    });

    it('should throw exception when the input is not related to HashType', () => {
        expect(() => {
            const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
            const secretProofTransaction = SecretProofTransaction.create(
                Deadline.create(),
                HashType.Op_Hash_160,
                'non valid hash',
                account.address,
                proof,
                NetworkType.MIJIN_TEST,
            );
        }).to.throw(Error);
    });

    it('should be created with HashType: Op_Hash_256 secret', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const secretProofTransaction = SecretProofTransaction.create(
            Deadline.create(),
            HashType.Op_Hash_256,
            CryptoJS.SHA256(CryptoJS.SHA256(proof).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex),
            account.address,
            proof,
            NetworkType.MIJIN_TEST,
        );
        expect(secretProofTransaction.hashType).to.be.equal(3);
        expect(secretProofTransaction.secret).to.be.equal('c346f5ecf5bcfa54ab14fad815c8239bdeb051df8835d212dba2af59f688a00e' );
        expect(secretProofTransaction.proof).to.be.equal(proof);
    });

    it('should throw exception when the input is not related to HashType', () => {
        expect(() => {
            const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
            const secretProofTransaction = SecretProofTransaction.create(
                Deadline.create(),
                HashType.Op_Hash_256,
                'non valid hash',
                account.address,
                proof,
                NetworkType.MIJIN_TEST,
            );
        }).to.throw(Error);
    });

    describe('size', () => {
        it('should return 212 for SecretProofTransaction with proof and secret both 32 bytes', () => {
            const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
            const secretProofTransaction = SecretProofTransaction.create(
                Deadline.create(),
                HashType.Op_Hash_256,
                CryptoJS.SHA256(CryptoJS.SHA256(proof).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex),
                account.address,
                proof,
                NetworkType.MIJIN_TEST,
            );
            expect(secretProofTransaction.size).to.be.equal(212);
        });
    });
});
