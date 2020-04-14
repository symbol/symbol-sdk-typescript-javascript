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
import { Convert } from '../../../src/core/format/Convert';
import { Account } from '../../../src/model/account/Account';
import { NetworkType } from '../../../src/model/network/NetworkType';
import { AccountMetadataTransaction } from '../../../src/model/transaction/AccountMetadataTransaction';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { TestingAccount } from '../../conf/conf.spec';
import { EmbeddedTransactionBuilder } from 'catbuffer-typescript/builders/EmbeddedTransactionBuilder';
import { TransactionType } from '../../../src/model/transaction/TransactionType';
import { deepEqual } from 'assert';

describe('AccountMetadataTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = TestingAccount;
    });

    it('should default maxFee field be set to 0', () => {
        const accountMetadataTransaction = AccountMetadataTransaction.create(
            Deadline.create(),
            account.publicKey,
            BigInt(1000),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            NetworkType.MIJIN_TEST,
        );

        expect(accountMetadataTransaction.maxFee).to.be.equal(BigInt(0));
    });

    it('should filled maxFee override transaction maxFee', () => {
        const accountMetadataTransaction = AccountMetadataTransaction.create(
            Deadline.create(),
            account.publicKey,
            BigInt(1000),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            NetworkType.MIJIN_TEST,
            BigInt(1),
        );

        expect(accountMetadataTransaction.maxFee).to.be.equal(BigInt(1));
    });

    it('should create and sign an AccountMetadataTransaction object', () => {
        const accountMetadataTransaction = AccountMetadataTransaction.create(
            Deadline.create(),
            account.publicKey,
            BigInt(1000),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = accountMetadataTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '9801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B6E80300000000000001000A0000000000000000000000',
        );
    });

    describe('size', () => {
        it('should return 182 for AccountMetadataTransaction byte size', () => {
            const accountMetadataTransaction = AccountMetadataTransaction.create(
                Deadline.create(),
                account.publicKey,
                BigInt(1000),
                1,
                Convert.uint8ToUtf8(new Uint8Array(10)),
                NetworkType.MIJIN_TEST,
            );

            expect(Convert.hexToUint8(accountMetadataTransaction.serialize()).length).to.be.equal(accountMetadataTransaction.size);
            expect(accountMetadataTransaction.size).to.be.equal(182);

            const signedTransaction = accountMetadataTransaction.signWith(account, generationHash);
            expect(signedTransaction.hash).not.to.be.undefined;
        });
    });

    it('should create EmbeddedTransactionBuilder', () => {
        const accountMetadataTransaction = AccountMetadataTransaction.create(
            Deadline.create(),
            account.publicKey,
            BigInt(1000),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            NetworkType.MIJIN_TEST,
        );

        Object.assign(accountMetadataTransaction, { signer: account.publicAccount });

        const embedded = accountMetadataTransaction.toEmbeddedTransaction();

        expect(embedded).to.be.instanceOf(EmbeddedTransactionBuilder);
        expect(Convert.uint8ToHex(embedded.signerPublicKey.key)).to.be.equal(account.publicKey);
        expect(embedded.type.valueOf()).to.be.equal(TransactionType.ACCOUNT_METADATA.valueOf());
    });

    it('should resolve alias', () => {
        const accountMetadataTransaction = AccountMetadataTransaction.create(
            Deadline.create(),
            account.publicKey,
            BigInt(1000),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            NetworkType.MIJIN_TEST,
        );

        const resolved = accountMetadataTransaction.resolveAliases();

        expect(resolved).to.be.instanceOf(AccountMetadataTransaction);
        deepEqual(accountMetadataTransaction, resolved);
    });
});
