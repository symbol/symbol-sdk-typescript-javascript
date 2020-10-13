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
import { Convert } from '../../../src/core/format';
import { Account } from '../../../src/model/account/Account';
import { NetworkType } from '../../../src/model/network/NetworkType';
import { AccountKeyLinkTransaction } from '../../../src/model/transaction/AccountKeyLinkTransaction';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { LinkAction } from '../../../src/model/transaction/LinkAction';
import { UInt64 } from '../../../src/model/UInt64';
import { TestingAccount } from '../../conf/conf.spec';
import { Address } from '../../../src/model/account/Address';

describe('AccountKeyLinkTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    const epochAdjustment = 1573430400;
    before(() => {
        account = TestingAccount;
    });

    it('should default maxFee field be set to 0', () => {
        const accountKeyLinkTransaction = AccountKeyLinkTransaction.create(
            Deadline.create(epochAdjustment),
            account.publicKey,
            LinkAction.Link,
            NetworkType.MIJIN_TEST,
        );

        expect(accountKeyLinkTransaction.maxFee.higher).to.be.equal(0);
        expect(accountKeyLinkTransaction.maxFee.lower).to.be.equal(0);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const accountKeyLinkTransaction = AccountKeyLinkTransaction.create(
            Deadline.create(epochAdjustment),
            account.publicKey,
            LinkAction.Link,
            NetworkType.MIJIN_TEST,
            new UInt64([1, 0]),
        );

        expect(accountKeyLinkTransaction.maxFee.higher).to.be.equal(0);
        expect(accountKeyLinkTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should create an AccountKeyLinkTransaction object with link action', () => {
        const accountKeyLinkTransaction = AccountKeyLinkTransaction.create(
            Deadline.create(epochAdjustment),
            account.publicKey,
            LinkAction.Link,
            NetworkType.MIJIN_TEST,
        );

        expect(accountKeyLinkTransaction.linkAction).to.be.equal(1);
        expect(accountKeyLinkTransaction.linkedPublicKey).to.be.equal(account.publicKey);

        const signedTransaction = accountKeyLinkTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '9801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B601',
        );
    });

    it('should create an AccountKeyLinkTransaction object with unlink action', () => {
        const accountKeyLinkTransaction = AccountKeyLinkTransaction.create(
            Deadline.create(epochAdjustment),
            account.publicKey,
            LinkAction.Unlink,
            NetworkType.MIJIN_TEST,
        );

        expect(accountKeyLinkTransaction.linkAction).to.be.equal(0);
        expect(accountKeyLinkTransaction.linkedPublicKey).to.be.equal(account.publicKey);

        const signedTransaction = accountKeyLinkTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '9801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B600',
        );
    });

    describe('size', () => {
        it('should return 161 for AccountKeyLinkTransaction byte size', () => {
            const accountKeyLinkTransaction = AccountKeyLinkTransaction.create(
                Deadline.create(epochAdjustment),
                account.publicKey,
                LinkAction.Unlink,
                NetworkType.MIJIN_TEST,
            );
            expect(Convert.hexToUint8(accountKeyLinkTransaction.serialize()).length).to.be.equal(accountKeyLinkTransaction.size);
            expect(accountKeyLinkTransaction.size).to.be.equal(161);
        });

        it('should create payload size', () => {
            const accountKeyLinkTransaction = AccountKeyLinkTransaction.create(
                Deadline.create(epochAdjustment),
                account.publicKey,
                LinkAction.Unlink,
                NetworkType.MIJIN_TEST,
            );
            expect(Convert.hexToUint8(accountKeyLinkTransaction.serialize()).length).to.be.equal(accountKeyLinkTransaction.size);
            expect(accountKeyLinkTransaction.size).to.be.equal(161);
            expect(accountKeyLinkTransaction.setPayloadSize(10).size).to.be.equal(10);
        });
    });

    it('Test set maxFee using multiplier', () => {
        const accountKeyLinkTransaction = AccountKeyLinkTransaction.create(
            Deadline.create(epochAdjustment),
            account.publicKey,
            LinkAction.Unlink,
            NetworkType.MIJIN_TEST,
        ).setMaxFee(2);
        expect(accountKeyLinkTransaction.maxFee.compact()).to.be.equal(322);

        const signedTransaction = accountKeyLinkTransaction.signWith(account, generationHash);
        expect(signedTransaction.hash).not.to.be.undefined;
    });

    it('Notify Account', () => {
        const tx = AccountKeyLinkTransaction.create(
            Deadline.create(epochAdjustment),
            account.publicKey,
            LinkAction.Unlink,
            NetworkType.MIJIN_TEST,
        );
        let canNotify = tx.shouldNotifyAccount(account.address);
        expect(canNotify).to.be.true;

        canNotify = tx.shouldNotifyAccount(Address.createFromRawAddress('SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMQ'));
        expect(canNotify).to.be.false;

        Object.assign(tx, { signer: account.publicAccount });
        expect(tx.shouldNotifyAccount(account.address)).to.be.true;
    });
});
