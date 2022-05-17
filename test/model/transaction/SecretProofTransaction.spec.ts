/*
 * Copyright 2020 NEM
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
import { sha3_256 } from '@noble/hashes/sha3';
import { bytesToHex } from '@noble/hashes/utils';
import { EmbeddedTransactionBuilder } from 'catbuffer-typescript';
import { expect } from 'chai';
import * as CryptoJS from 'crypto-js';
import { Convert, Convert as convert } from '../../../src/core/format';
import { UInt64 } from '../../../src/model';
import { Account, Address } from '../../../src/model/account';
import { LockHashAlgorithm } from '../../../src/model/lock';
import { NamespaceId } from '../../../src/model/namespace';
import { NetworkType } from '../../../src/model/network';
import { ReceiptSource, ResolutionEntry, ResolutionStatement, ResolutionType, Statement } from '../../../src/model/receipt';
import { Deadline, SecretProofTransaction, TransactionInfo, TransactionType } from '../../../src/model/transaction';
import { TestingAccount } from '../../conf/conf.spec';

describe('SecretProofTransaction', () => {
    let account: Account;
    let statement: Statement;
    const unresolvedAddress = new NamespaceId('address');
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
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
            [],
        );
    });

    it('should default maxFee field be set to 0', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const secretProofTransaction = SecretProofTransaction.create(
            Deadline.create(epochAdjustment),
            LockHashAlgorithm.Op_Sha3_256,
            bytesToHex(sha3_256(convert.hexToUint8(proof))),
            account.address,
            proof,
            NetworkType.TEST_NET,
        );

        expect(secretProofTransaction.maxFee.higher).to.be.equal(0);
        expect(secretProofTransaction.maxFee.lower).to.be.equal(0);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const secretProofTransaction = SecretProofTransaction.create(
            Deadline.create(epochAdjustment),
            LockHashAlgorithm.Op_Sha3_256,
            bytesToHex(sha3_256(convert.hexToUint8(proof))),
            account.address,
            proof,
            NetworkType.TEST_NET,
            new UInt64([1, 0]),
        );

        expect(secretProofTransaction.maxFee.higher).to.be.equal(0);
        expect(secretProofTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should be created with LockHashAlgorithm: Op_Sha3_256 secret', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const secretProofTransaction = SecretProofTransaction.create(
            Deadline.create(epochAdjustment),
            LockHashAlgorithm.Op_Sha3_256,
            bytesToHex(sha3_256(convert.hexToUint8(proof))),
            account.address,
            proof,
            NetworkType.TEST_NET,
        );
        expect(secretProofTransaction.hashAlgorithm).to.be.equal(0);
        expect(secretProofTransaction.secret).to.be.equal('9b3155b37159da50aa52d5967c509b410f5a36a3b1e31ecb5ac76675d79b4a5e');
        expect(secretProofTransaction.proof).to.be.equal(proof);
    });

    it('should throw exception when the input is not related to LockHashAlgorithm', () => {
        expect(() => {
            const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
            SecretProofTransaction.create(
                Deadline.create(epochAdjustment),
                LockHashAlgorithm.Op_Sha3_256,
                'non valid hash',
                account.address,
                proof,
                NetworkType.TEST_NET,
            );
        }).to.throw(Error);
    });

    it('should be created with LockHashAlgorithm: Op_Hash_160 secret', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9';
        const secretProofTransaction = SecretProofTransaction.create(
            Deadline.create(epochAdjustment),
            LockHashAlgorithm.Op_Hash_160,
            CryptoJS.RIPEMD160(CryptoJS.SHA256(proof).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex),
            account.address,
            proof,
            NetworkType.TEST_NET,
        );
        expect(secretProofTransaction.hashAlgorithm).to.be.equal(1);
        expect(secretProofTransaction.secret).to.be.equal('3fc43d717d824302e3821de8129ea2f7786912e5');
        expect(secretProofTransaction.proof).to.be.equal(proof);
    });

    it('should throw exception when the input is not related to LockHashAlgorithm', () => {
        expect(() => {
            const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
            SecretProofTransaction.create(
                Deadline.create(epochAdjustment),
                LockHashAlgorithm.Op_Hash_160,
                'non valid hash',
                account.address,
                proof,
                NetworkType.TEST_NET,
            );
        }).to.throw(Error);
    });

    it('should be created with LockHashAlgorithm: Op_Hash_256 secret', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const secretProofTransaction = SecretProofTransaction.create(
            Deadline.create(epochAdjustment),
            LockHashAlgorithm.Op_Hash_256,
            CryptoJS.SHA256(CryptoJS.SHA256(proof).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex),
            account.address,
            proof,
            NetworkType.TEST_NET,
        );
        expect(secretProofTransaction.hashAlgorithm).to.be.equal(2);
        expect(secretProofTransaction.secret).to.be.equal('c346f5ecf5bcfa54ab14fad815c8239bdeb051df8835d212dba2af59f688a00e');
        expect(secretProofTransaction.proof).to.be.equal(proof);
    });

    it('should throw exception when the input is not related to LockHashAlgorithm', () => {
        expect(() => {
            const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
            SecretProofTransaction.create(
                Deadline.create(epochAdjustment),
                LockHashAlgorithm.Op_Hash_256,
                'non valid hash',
                account.address,
                proof,
                NetworkType.TEST_NET,
            );
        }).to.throw(Error);
    });

    describe('size', () => {
        it('should return 219 for SecretProofTransaction with proof and secret both 32 bytes', () => {
            const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
            const secretProofTransaction = SecretProofTransaction.create(
                Deadline.create(epochAdjustment),
                LockHashAlgorithm.Op_Hash_256,
                CryptoJS.SHA256(CryptoJS.SHA256(proof).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex),
                account.address,
                proof,
                NetworkType.TEST_NET,
            );
            expect(secretProofTransaction.size).to.be.equal(219);
            expect(Convert.hexToUint8(secretProofTransaction.serialize()).length).to.be.equal(secretProofTransaction.size);
        });
    });

    it('should create and sign SecretProof Transaction', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const secretProofTransaction = SecretProofTransaction.create(
            Deadline.create(epochAdjustment),
            LockHashAlgorithm.Op_Sha3_256,
            bytesToHex(sha3_256(convert.hexToUint8(proof))),
            account.address,
            proof,
            NetworkType.TEST_NET,
        );

        const signedTx = secretProofTransaction.signWith(account, generationHash);
        expect(signedTx.payload.substring(256, signedTx.payload.length)).to.be.equal(
            '9826D27E1D0A26CA4E316F901E23E55C8711DB20DFD267769B3155B37159DA50AA52D5967C509B410F5A' +
                '36A3B1E31ECB5AC76675D79B4A5E200000B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7',
        );
    });

    it('should be created with alias address', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const recipientAddress = new NamespaceId('test');
        const secretProofTransaction = SecretProofTransaction.create(
            Deadline.create(epochAdjustment),
            LockHashAlgorithm.Op_Sha3_256,
            bytesToHex(sha3_256(convert.hexToUint8(proof))),
            recipientAddress,
            proof,
            NetworkType.TEST_NET,
        );
        expect(secretProofTransaction.hashAlgorithm).to.be.equal(0);
        expect(secretProofTransaction.secret).to.be.equal('9b3155b37159da50aa52d5967c509b410f5a36a3b1e31ecb5ac76675d79b4a5e');
        expect(secretProofTransaction.proof).to.be.equal(proof);
        expect(secretProofTransaction.recipientAddress).to.be.equal(recipientAddress);
    });

    it('Test set maxFee using multiplier', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const secretProofTransaction = SecretProofTransaction.create(
            Deadline.create(epochAdjustment),
            LockHashAlgorithm.Op_Sha3_256,
            bytesToHex(sha3_256(convert.hexToUint8(proof))),
            account.address,
            proof,
            NetworkType.TEST_NET,
        ).setMaxFee(2);
        expect(secretProofTransaction.maxFee.compact()).to.be.equal(438);
        const signedTransaction = secretProofTransaction.signWith(account, generationHash);
        expect(signedTransaction.hash).not.to.be.undefined;
    });

    it('Test resolveAlias can resolve', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const transferTransaction = new SecretProofTransaction(
            NetworkType.TEST_NET,
            1,
            Deadline.create(epochAdjustment),
            UInt64.fromUint(0),
            LockHashAlgorithm.Op_Sha3_256,
            bytesToHex(sha3_256(convert.hexToUint8(proof))),
            unresolvedAddress,
            proof,
            '',
            account.publicAccount,
            new TransactionInfo(UInt64.fromUint(2), 0, ''),
        ).resolveAliases(statement);
        expect(transferTransaction.recipientAddress instanceof Address).to.be.true;
        expect((transferTransaction.recipientAddress as Address).equals(account.address)).to.be.true;

        const signedTransaction = transferTransaction.signWith(account, generationHash);
        expect(signedTransaction.hash).not.to.be.undefined;
    });

    it('should create EmbeddedTransactionBuilder', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const secretProofTransaction = new SecretProofTransaction(
            NetworkType.TEST_NET,
            1,
            Deadline.create(epochAdjustment),
            UInt64.fromUint(0),
            LockHashAlgorithm.Op_Sha3_256,
            bytesToHex(sha3_256(convert.hexToUint8(proof))),
            unresolvedAddress,
            proof,
            '',
            account.publicAccount,
            new TransactionInfo(UInt64.fromUint(2), 0, ''),
        );
        Object.assign(secretProofTransaction, { signer: account.publicAccount });

        const embedded = secretProofTransaction.toEmbeddedTransaction();

        expect(embedded).to.be.instanceOf(EmbeddedTransactionBuilder);
        expect(Convert.uint8ToHex(embedded.signerPublicKey.publicKey)).to.be.equal(account.publicKey);
        expect(embedded.type.valueOf()).to.be.equal(TransactionType.SECRET_PROOF.valueOf());
    });

    it('should return secret bytes', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const secretProofTransaction = SecretProofTransaction.create(
            Deadline.create(epochAdjustment),
            LockHashAlgorithm.Op_Sha3_256,
            bytesToHex(sha3_256(convert.hexToUint8(proof))),
            account.address,
            proof,
            NetworkType.TEST_NET,
        );
        const secretBytes = secretProofTransaction.getSecretByte();
        expect(secretBytes).not.to.be.undefined;
        expect(Convert.uint8ToHex(secretBytes)).to.be.equal('9B3155B37159DA50AA52D5967C509B410F5A36A3B1E31ECB5AC76675D79B4A5E');
    });

    it('Notify Account', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const tx = SecretProofTransaction.create(
            Deadline.create(epochAdjustment),
            LockHashAlgorithm.Op_Sha3_256,
            bytesToHex(sha3_256(convert.hexToUint8(proof))),
            account.address,
            proof,
            NetworkType.TEST_NET,
        );
        let canNotify = tx.shouldNotifyAccount(account.address);
        expect(canNotify).to.be.true;

        canNotify = tx.shouldNotifyAccount(Address.createFromRawAddress('TAMJCSC2BEW52LVAULFRRJJTSRHLI7ABRHFJZ5I'));
        expect(canNotify).to.be.false;

        Object.assign(tx, { signer: account.publicAccount });
        expect(tx.shouldNotifyAccount(account.address)).to.be.true;
    });

    it('Notify Account with alias', () => {
        const namespaceId = new NamespaceId('test');
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const canNotify = SecretProofTransaction.create(
            Deadline.create(epochAdjustment),
            LockHashAlgorithm.Op_Sha3_256,
            bytesToHex(sha3_256(convert.hexToUint8(proof))),
            namespaceId,
            proof,
            NetworkType.TEST_NET,
        ).shouldNotifyAccount(namespaceId);
        expect(canNotify).to.be.true;
    });
});
