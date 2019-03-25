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
import { Account } from '../../../src/model/account/Account';
import { NetworkType } from '../../../src/model/blockchain/NetworkType';
import { AccountLinkTransaction } from '../../../src/model/transaction/AccountLinkTransaction';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { LinkAction } from '../../../src/model/transaction/LinkAction';
import { UInt64 } from '../../../src/model/UInt64';
import { TestingAccount } from '../../conf/conf.spec';

describe('AccountLinkTransaction', () => {
    let account: Account;

    before(() => {
        account = TestingAccount;
    });

    it('should default maxFee field be set to 0', () => {
        const accountLinkTransaction = AccountLinkTransaction.create(
            Deadline.create(),
            account.publicKey,
            LinkAction.Link,
            NetworkType.MIJIN_TEST,
        );

        expect(accountLinkTransaction.maxFee.higher).to.be.equal(0);
        expect(accountLinkTransaction.maxFee.lower).to.be.equal(0);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const accountLinkTransaction = AccountLinkTransaction.create(
            Deadline.create(),
            account.publicKey,
            LinkAction.Link,
            NetworkType.MIJIN_TEST,
            new UInt64([1, 0])
        );

        expect(accountLinkTransaction.maxFee.higher).to.be.equal(0);
        expect(accountLinkTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should create an AccountLinkTransaction object with link action', () => {
        const accountLinkTransaction = AccountLinkTransaction.create(
            Deadline.create(),
            account.publicKey,
            LinkAction.Link,
            NetworkType.MIJIN_TEST,
        );

        expect(accountLinkTransaction.linkAction).to.be.equal(0);
        expect(accountLinkTransaction.remoteAccountKey).to.be.equal(account.publicKey);

        const signedTransaction = accountLinkTransaction.signWith(account);

        expect(signedTransaction.payload.substring(
            240,
            signedTransaction.payload.length,
        )).to.be.equal('C2F93346E27CE6AD1A9F8F5E3066F8326593A406BDF357ACB041E2F9AB402EFE00');
    });

    it('should create an AccountLinkTransaction object with unlink action', () => {
        const accountLinkTransaction = AccountLinkTransaction.create(
            Deadline.create(),
            account.publicKey,
            LinkAction.Unlink,
            NetworkType.MIJIN_TEST,
        );

        expect(accountLinkTransaction.linkAction).to.be.equal(1);
        expect(accountLinkTransaction.remoteAccountKey).to.be.equal(account.publicKey);

        const signedTransaction = accountLinkTransaction.signWith(account);

        expect(signedTransaction.payload.substring(
            240,
            signedTransaction.payload.length,
        )).to.be.equal('C2F93346E27CE6AD1A9F8F5E3066F8326593A406BDF357ACB041E2F9AB402EFE01');
    });

    describe('size', () => {
        it('should return 153 for AccountLinkTransaction byte size', () => {
            const accountLinkTransaction = AccountLinkTransaction.create(
                Deadline.create(),
                account.publicKey,
                LinkAction.Unlink,
                NetworkType.MIJIN_TEST,
            );
            expect(accountLinkTransaction.size).to.be.equal(153);
        });
    });
});
