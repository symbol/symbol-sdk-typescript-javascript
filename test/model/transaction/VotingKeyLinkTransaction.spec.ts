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
import { VotingKeyLinkTransaction } from '../../../src/model/transaction/VotingKeyLinkTransaction';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { LinkAction } from '../../../src/model/transaction/LinkAction';
import { UInt64 } from '../../../src/model/UInt64';
import { TestingAccount } from '../../conf/conf.spec';
import { Address } from '../../../src/model/account/Address';

describe('VotingKeyLinkTransaction', () => {
    let account: Account;
    let votingKey: string;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = TestingAccount;
        votingKey = '344B9146A1F8DBBD8AFC830A2AAB7A83692E73AD775159B811355B1D2C0C27120243B10A16D4B5001B2AF0ED456C82D0';
    });

    it('should default maxFee field be set to 0', () => {
        const votingKeyLinkTransaction = VotingKeyLinkTransaction.create(
            Deadline.create(),
            votingKey,
            LinkAction.Link,
            NetworkType.MIJIN_TEST,
        );

        expect(votingKeyLinkTransaction.maxFee.higher).to.be.equal(0);
        expect(votingKeyLinkTransaction.maxFee.lower).to.be.equal(0);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const votingKeyLinkTransaction = VotingKeyLinkTransaction.create(
            Deadline.create(),
            votingKey,
            LinkAction.Link,
            NetworkType.MIJIN_TEST,
            new UInt64([1, 0]),
        );

        expect(votingKeyLinkTransaction.maxFee.higher).to.be.equal(0);
        expect(votingKeyLinkTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should create an votingKeyLinkTransaction object with link action', () => {
        const votingKeyLinkTransaction = VotingKeyLinkTransaction.create(
            Deadline.create(),
            votingKey,
            LinkAction.Link,
            NetworkType.MIJIN_TEST,
        );

        expect(votingKeyLinkTransaction.linkAction).to.be.equal(1);
        expect(votingKeyLinkTransaction.linkedPublicKey).to.be.equal(votingKey);

        const signedTransaction = votingKeyLinkTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '344B9146A1F8DBBD8AFC830A2AAB7A83692E73AD775159B811355B1D2C0C27120243B10A16D4B5001B2AF0ED456C82D001',
        );
    });

    it('should create an VotingKeyLinkTransaction object with unlink action', () => {
        const votingKeyLinkTransaction = VotingKeyLinkTransaction.create(
            Deadline.create(),
            votingKey,
            LinkAction.Unlink,
            NetworkType.MIJIN_TEST,
        );

        expect(votingKeyLinkTransaction.linkAction).to.be.equal(0);
        expect(votingKeyLinkTransaction.linkedPublicKey).to.be.equal(votingKey);

        const signedTransaction = votingKeyLinkTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '344B9146A1F8DBBD8AFC830A2AAB7A83692E73AD775159B811355B1D2C0C27120243B10A16D4B5001B2AF0ED456C82D000',
        );
    });

    describe('size', () => {
        it('should return 161 for VotingKeyLinkTransaction byte size', () => {
            const votingKeyLinkTransaction = VotingKeyLinkTransaction.create(
                Deadline.create(),
                votingKey,
                LinkAction.Unlink,
                NetworkType.MIJIN_TEST,
            );
            expect(Convert.hexToUint8(votingKeyLinkTransaction.serialize()).length).to.be.equal(votingKeyLinkTransaction.size);
            expect(votingKeyLinkTransaction.size).to.be.equal(177);
        });
    });

    it('Test set maxFee using multiplier', () => {
        const votingKeyLinkTransaction = VotingKeyLinkTransaction.create(
            Deadline.create(),
            votingKey,
            LinkAction.Unlink,
            NetworkType.MIJIN_TEST,
        ).setMaxFee(2);
        expect(votingKeyLinkTransaction.maxFee.compact()).to.be.equal(354);

        const signedTransaction = votingKeyLinkTransaction.signWith(account, generationHash);
        expect(signedTransaction.hash).not.to.be.undefined;
    });

    it('Notify Account', () => {
        const tx = VotingKeyLinkTransaction.create(Deadline.create(), account.publicKey, LinkAction.Unlink, NetworkType.MIJIN_TEST);
        let canNotify = tx.NotifyAccount(account.address);
        expect(canNotify).to.be.true;

        canNotify = tx.NotifyAccount(Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKB'));
        expect(canNotify).to.be.false;

        Object.assign(tx, { signer: account.publicAccount });
        expect(tx.NotifyAccount(account.address)).to.be.true;
    });
});
