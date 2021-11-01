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
import { TransactionVersion, UInt64 } from '../../../src/model';
import { Account, Address } from '../../../src/model/account';
import { Deadline, LinkAction, VotingKeyLinkTransaction } from '../../../src/model/transaction';
import { TestingAccount, TestNetworkType } from '../../conf/conf.spec';

describe('VotingKeyLinkTransaction', () => {
    let account: Account;
    let votingKey: string;
    const startEpoch = 1;
    const endEpoch = 10;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    const epochAdjustment = 1573430400;
    before(() => {
        account = TestingAccount;
        votingKey = 'AAABBB205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    });

    it('should default maxFee field be set to 0', () => {
        const votingKeyLinkTransaction = VotingKeyLinkTransaction.create(
            Deadline.create(epochAdjustment),
            votingKey,
            startEpoch,
            endEpoch,
            LinkAction.Link,
            TestNetworkType,
            TransactionVersion.VOTING_KEY_LINK,
        );

        expect(votingKeyLinkTransaction.maxFee.higher).to.be.equal(0);
        expect(votingKeyLinkTransaction.maxFee.lower).to.be.equal(0);
        expect(votingKeyLinkTransaction.startEpoch.toString()).to.be.equal('1');
        expect(votingKeyLinkTransaction.endEpoch.toString()).to.be.equal('10');
    });

    it('should filled maxFee override transaction maxFee', () => {
        const votingKeyLinkTransaction = VotingKeyLinkTransaction.create(
            Deadline.create(epochAdjustment),
            votingKey,
            startEpoch,
            endEpoch,
            LinkAction.Link,
            TestNetworkType,
            3,
            new UInt64([1, 0]),
        );

        expect(votingKeyLinkTransaction.version).to.be.equal(3);
        expect(votingKeyLinkTransaction.maxFee.higher).to.be.equal(0);
        expect(votingKeyLinkTransaction.maxFee.lower).to.be.equal(1);
        expect(votingKeyLinkTransaction.startEpoch.toString()).to.be.equal('1');
        expect(votingKeyLinkTransaction.endEpoch.toString()).to.be.equal('10');
    });

    it('should create an votingKeyLinkTransaction object with link action', () => {
        const votingKeyLinkTransaction = VotingKeyLinkTransaction.create(
            Deadline.create(epochAdjustment),
            votingKey,
            startEpoch,
            endEpoch,
            LinkAction.Link,
            TestNetworkType,
            TransactionVersion.VOTING_KEY_LINK,
        );

        expect(votingKeyLinkTransaction.linkAction).to.be.equal(1);
        expect(votingKeyLinkTransaction.linkedPublicKey).to.be.equal(votingKey);
        expect(votingKeyLinkTransaction.startEpoch.toString()).to.be.equal('1');
        expect(votingKeyLinkTransaction.endEpoch.toString()).to.be.equal('10');

        const signedTransaction = votingKeyLinkTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            'AAABBB205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6010000000A00000001',
        );
    });

    it('should create an VotingKeyLinkTransaction object with unlink action', () => {
        const votingKeyLinkTransaction = VotingKeyLinkTransaction.create(
            Deadline.create(epochAdjustment),
            votingKey,
            startEpoch,
            endEpoch,
            LinkAction.Unlink,
            TestNetworkType,
            TransactionVersion.VOTING_KEY_LINK,
        );

        expect(votingKeyLinkTransaction.linkAction).to.be.equal(0);
        expect(votingKeyLinkTransaction.linkedPublicKey).to.be.equal(votingKey);
        expect(votingKeyLinkTransaction.startEpoch.toString()).to.be.equal('1');
        expect(votingKeyLinkTransaction.endEpoch.toString()).to.be.equal('10');

        const signedTransaction = votingKeyLinkTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            'AAABBB205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6010000000A00000000',
        );
    });

    it('should return 185 for VotingKeyLinkTransaction byte size', () => {
        const votingKeyLinkTransaction = VotingKeyLinkTransaction.create(
            Deadline.create(epochAdjustment),
            votingKey,
            startEpoch,
            endEpoch,
            LinkAction.Unlink,
            TestNetworkType,
            TransactionVersion.VOTING_KEY_LINK,
        );
        expect(votingKeyLinkTransaction.size).to.be.equal(169);
        expect(Convert.hexToUint8(votingKeyLinkTransaction.serialize()).length).to.be.equal(votingKeyLinkTransaction.size);
    });

    it('Test set maxFee using multiplier', () => {
        const votingKeyLinkTransaction = VotingKeyLinkTransaction.create(
            Deadline.create(epochAdjustment),
            votingKey,
            startEpoch,
            endEpoch,
            LinkAction.Unlink,
            TestNetworkType,
            TransactionVersion.VOTING_KEY_LINK,
        ).setMaxFee(2);
        expect(votingKeyLinkTransaction.maxFee.compact()).to.be.equal(338);

        const signedTransaction = votingKeyLinkTransaction.signWith(account, generationHash);
        expect(signedTransaction.hash).not.to.be.undefined;
    });

    it('Notify Account', () => {
        const tx = VotingKeyLinkTransaction.create(
            Deadline.create(epochAdjustment),
            account.publicKey,
            startEpoch,
            endEpoch,
            LinkAction.Unlink,
            TestNetworkType,
            TransactionVersion.VOTING_KEY_LINK,
        );
        let canNotify = tx.shouldNotifyAccount(account.address);
        expect(canNotify).to.be.true;

        canNotify = tx.shouldNotifyAccount(Address.createFromRawAddress('TAMJCSC2BEW52LVAULFRRJJTSRHLI7ABRHFJZ5I'));
        expect(canNotify).to.be.false;

        Object.assign(tx, { signer: account.publicAccount });
        expect(tx.shouldNotifyAccount(account.address)).to.be.true;
    });
});
