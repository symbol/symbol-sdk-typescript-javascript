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
import { UInt64 } from '../../../src/model';
import { Account, Address } from '../../../src/model/account';
import { NetworkType } from '../../../src/model/network';
import { Deadline, LinkAction, VotingKeyLinkV1Transaction } from '../../../src/model/transaction';
import { TestingAccount } from '../../conf/conf.spec';

describe('VotingKeyLinkV1Transaction', () => {
    let account: Account;
    let votingKey: string;
    const startEpoch = 1;
    const endEpoch = 10;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    const epochAdjustment = 1573430400;
    before(() => {
        account = TestingAccount;
        votingKey = '344B9146A1F8DBBD8AFC830A2AAB7A83692E73AD775159B811355B1D2C0C27120243B10A16D4B5001B2AF0ED456C82D0';
    });

    it('should default maxFee field be set to 0', () => {
        const votingKeyLinkV1Transaction = VotingKeyLinkV1Transaction.create(
            Deadline.create(epochAdjustment),
            votingKey,
            startEpoch,
            endEpoch,
            LinkAction.Link,
            NetworkType.PRIVATE_TEST,
        );

        expect(votingKeyLinkV1Transaction.maxFee.higher).to.be.equal(0);
        expect(votingKeyLinkV1Transaction.maxFee.lower).to.be.equal(0);
        expect(votingKeyLinkV1Transaction.startEpoch.toString()).to.be.equal('1');
        expect(votingKeyLinkV1Transaction.endEpoch.toString()).to.be.equal('10');
    });

    it('should filled maxFee override transaction maxFee', () => {
        const votingKeyLinkV1Transaction = VotingKeyLinkV1Transaction.create(
            Deadline.create(epochAdjustment),
            votingKey,
            startEpoch,
            endEpoch,
            LinkAction.Link,
            NetworkType.PRIVATE_TEST,
            new UInt64([1, 0]),
        );

        expect(votingKeyLinkV1Transaction.maxFee.higher).to.be.equal(0);
        expect(votingKeyLinkV1Transaction.maxFee.lower).to.be.equal(1);
        expect(votingKeyLinkV1Transaction.startEpoch.toString()).to.be.equal('1');
        expect(votingKeyLinkV1Transaction.endEpoch.toString()).to.be.equal('10');
    });

    it('should create an votingKeyLinkV1Transaction object with link action', () => {
        const votingKeyLinkV1Transaction = VotingKeyLinkV1Transaction.create(
            Deadline.create(epochAdjustment),
            votingKey,
            startEpoch,
            endEpoch,
            LinkAction.Link,
            NetworkType.PRIVATE_TEST,
        );

        expect(votingKeyLinkV1Transaction.linkAction).to.be.equal(1);
        expect(votingKeyLinkV1Transaction.linkedPublicKey).to.be.equal(votingKey);
        expect(votingKeyLinkV1Transaction.startEpoch.toString()).to.be.equal('1');
        expect(votingKeyLinkV1Transaction.endEpoch.toString()).to.be.equal('10');

        const signedTransaction = votingKeyLinkV1Transaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '344B9146A1F8DBBD8AFC830A2AAB7A83692E73AD775159B811355B1D2C0C27120243B10A16D4B5001B2AF0ED456C82D0010000000A00000001',
        );
    });

    it('should create an VotingKeyLinkV1Transaction object with unlink action', () => {
        const votingKeyLinkV1Transaction = VotingKeyLinkV1Transaction.create(
            Deadline.create(epochAdjustment),
            votingKey,
            startEpoch,
            endEpoch,
            LinkAction.Unlink,
            NetworkType.PRIVATE_TEST,
        );

        expect(votingKeyLinkV1Transaction.linkAction).to.be.equal(0);
        expect(votingKeyLinkV1Transaction.linkedPublicKey).to.be.equal(votingKey);
        expect(votingKeyLinkV1Transaction.startEpoch.toString()).to.be.equal('1');
        expect(votingKeyLinkV1Transaction.endEpoch.toString()).to.be.equal('10');

        const signedTransaction = votingKeyLinkV1Transaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '344B9146A1F8DBBD8AFC830A2AAB7A83692E73AD775159B811355B1D2C0C27120243B10A16D4B5001B2AF0ED456C82D0010000000A00000000',
        );
    });

    it('should return 185 for VotingKeyLinkV1Transaction byte size', () => {
        const votingKeyLinkV1Transaction = VotingKeyLinkV1Transaction.create(
            Deadline.create(epochAdjustment),
            votingKey,
            startEpoch,
            endEpoch,
            LinkAction.Unlink,
            NetworkType.PRIVATE_TEST,
        );
        expect(Convert.hexToUint8(votingKeyLinkV1Transaction.serialize()).length).to.be.equal(votingKeyLinkV1Transaction.size);
        expect(votingKeyLinkV1Transaction.size).to.be.equal(185);
    });

    it('Test set maxFee using multiplier', () => {
        const votingKeyLinkV1Transaction = VotingKeyLinkV1Transaction.create(
            Deadline.create(epochAdjustment),
            votingKey,
            startEpoch,
            endEpoch,
            LinkAction.Unlink,
            NetworkType.PRIVATE_TEST,
        ).setMaxFee(2);
        expect(votingKeyLinkV1Transaction.maxFee.compact()).to.be.equal(370);

        const signedTransaction = votingKeyLinkV1Transaction.signWith(account, generationHash);
        expect(signedTransaction.hash).not.to.be.undefined;
    });

    it('Notify Account', () => {
        const tx = VotingKeyLinkV1Transaction.create(
            Deadline.create(epochAdjustment),
            votingKey,
            startEpoch,
            endEpoch,
            LinkAction.Unlink,
            NetworkType.PRIVATE_TEST,
        );
        let canNotify = tx.shouldNotifyAccount(account.address);
        expect(canNotify).to.be.false;

        canNotify = tx.shouldNotifyAccount(Address.createFromRawAddress('QDR6EW2WBHJQDYMNGFX2UBZHMMZC5PGL22JZIXY'));
        expect(canNotify).to.be.false;

        Object.assign(tx, { signer: account.publicAccount });
        expect(tx.shouldNotifyAccount(account.address)).to.be.true;
    });
});
