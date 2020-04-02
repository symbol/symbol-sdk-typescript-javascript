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
import {Convert} from '../../../src/core/format';
import { Account } from '../../../src/model/account/Account';
import { NetworkType } from '../../../src/model/network/NetworkType';
import { AccountLinkTransaction } from '../../../src/model/transaction/AccountLinkTransaction';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { LinkAction } from '../../../src/model/transaction/LinkAction';
import { TestingAccount } from '../../conf/conf.spec';

describe('AccountLinkTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
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

        expect(accountLinkTransaction.maxFee).to.be.equal(BigInt(0));
    });

    it('should filled maxFee override transaction maxFee', () => {
        const accountLinkTransaction = AccountLinkTransaction.create(
            Deadline.create(),
            account.publicKey,
            LinkAction.Link,
            NetworkType.MIJIN_TEST,
            BigInt(1),
        );

        expect(accountLinkTransaction.maxFee).to.be.equal(BigInt(1));
    });

    it('should create an AccountLinkTransaction object with link action', () => {
        const accountLinkTransaction = AccountLinkTransaction.create(
            Deadline.create(),
            account.publicKey,
            LinkAction.Link,
            NetworkType.MIJIN_TEST,
        );

        expect(accountLinkTransaction.linkAction).to.be.equal(1);
        expect(accountLinkTransaction.remotePublicKey).to.be.equal(account.publicKey);

        const signedTransaction = accountLinkTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            256,
            signedTransaction.payload.length,
        )).to.be.equal('9801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B601');
    });

    it('should create an AccountLinkTransaction object with unlink action', () => {
        const accountLinkTransaction = AccountLinkTransaction.create(
            Deadline.create(),
            account.publicKey,
            LinkAction.Unlink,
            NetworkType.MIJIN_TEST,
        );

        expect(accountLinkTransaction.linkAction).to.be.equal(0);
        expect(accountLinkTransaction.remotePublicKey).to.be.equal(account.publicKey);

        const signedTransaction = accountLinkTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            256,
            signedTransaction.payload.length,
        )).to.be.equal('9801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B600');
    });

    describe('size', () => {
        it('should return 161 for AccountLinkTransaction byte size', () => {
            const accountLinkTransaction = AccountLinkTransaction.create(
                Deadline.create(),
                account.publicKey,
                LinkAction.Unlink,
                NetworkType.MIJIN_TEST,
            );
            expect(Convert.hexToUint8(accountLinkTransaction.serialize()).length).to.be.equal(accountLinkTransaction.size);
            expect(accountLinkTransaction.size).to.be.equal(161);
        });
    });

    it('Test set maxFee using multiplier', () => {
        const accountLinkTransaction = AccountLinkTransaction.create(
            Deadline.create(),
            account.publicKey,
            LinkAction.Unlink,
            NetworkType.MIJIN_TEST,
        ).setMaxFee(2);
​
        expect(accountLinkTransaction.maxFee).to.be.equal(BigInt(322));

        const signedTransaction = accountLinkTransaction.signWith(account, generationHash);
        expect(signedTransaction.hash).not.to.be.undefined;
    });
});
