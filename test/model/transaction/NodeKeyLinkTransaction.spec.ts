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
import { Address } from '../../../src/model/account/Address';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { LinkAction } from '../../../src/model/transaction/LinkAction';
import { NodeKeyLinkTransaction } from '../../../src/model/transaction/NodeKeyLinkTransaction';
import { UInt64 } from '../../../src/model/UInt64';
import { TestingAccount, TestNetworkType } from '../../conf/conf.spec';

describe('NodeKeyLinkTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    const epochAdjustment = 1573430400;
    before(() => {
        account = TestingAccount;
    });

    it('should default maxFee field be set to 0', () => {
        const nodeKeyLinkTransaction = NodeKeyLinkTransaction.create(
            Deadline.create(epochAdjustment),
            account.publicKey,
            LinkAction.Link,
            TestNetworkType,
        );

        expect(nodeKeyLinkTransaction.maxFee.higher).to.be.equal(0);
        expect(nodeKeyLinkTransaction.maxFee.lower).to.be.equal(0);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const nodeKeyLinkTransaction = NodeKeyLinkTransaction.create(
            Deadline.create(epochAdjustment),
            account.publicKey,
            LinkAction.Link,
            TestNetworkType,
            new UInt64([1, 0]),
        );

        expect(nodeKeyLinkTransaction.maxFee.higher).to.be.equal(0);
        expect(nodeKeyLinkTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should create an NodeKeyLinkTransaction object with link action', () => {
        const nodeKeyLinkTransaction = NodeKeyLinkTransaction.create(
            Deadline.create(epochAdjustment),
            account.publicKey,
            LinkAction.Link,
            TestNetworkType,
        );

        expect(nodeKeyLinkTransaction.linkAction).to.be.equal(1);
        expect(nodeKeyLinkTransaction.linkedPublicKey).to.be.equal(account.publicKey);

        const signedTransaction = nodeKeyLinkTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '2E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F01',
        );
    });

    it('should create an NodeKeyLinkTransaction object with unlink action', () => {
        const nodeKeyLinkTransaction = NodeKeyLinkTransaction.create(
            Deadline.create(epochAdjustment),
            account.publicKey,
            LinkAction.Unlink,
            TestNetworkType,
        );

        expect(nodeKeyLinkTransaction.linkAction).to.be.equal(0);
        expect(nodeKeyLinkTransaction.linkedPublicKey).to.be.equal(account.publicKey);

        const signedTransaction = nodeKeyLinkTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '2E834140FD66CF87B254A693A2C7862C819217B676D3943267156625E816EC6F00',
        );
    });

    describe('size', () => {
        it('should return 161 for NodeKeyLinkTransaction byte size', () => {
            const nodeKeyLinkTransaction = NodeKeyLinkTransaction.create(
                Deadline.create(epochAdjustment),
                account.publicKey,
                LinkAction.Unlink,
                TestNetworkType,
            );
            expect(Convert.hexToUint8(nodeKeyLinkTransaction.serialize()).length).to.be.equal(nodeKeyLinkTransaction.size);
            expect(nodeKeyLinkTransaction.size).to.be.equal(161);
        });
        it('should set payload size', () => {
            const nodeKeyLinkTransaction = NodeKeyLinkTransaction.create(
                Deadline.create(epochAdjustment),
                account.publicKey,
                LinkAction.Unlink,
                TestNetworkType,
            );
            expect(Convert.hexToUint8(nodeKeyLinkTransaction.serialize()).length).to.be.equal(nodeKeyLinkTransaction.size);
            expect(nodeKeyLinkTransaction.size).to.be.equal(161);
            expect(nodeKeyLinkTransaction.setPayloadSize(19).size).to.be.equal(19);
        });
    });

    it('Test set maxFee using multiplier', () => {
        const nodeKeyLinkTransaction = NodeKeyLinkTransaction.create(
            Deadline.create(epochAdjustment),
            account.publicKey,
            LinkAction.Unlink,
            TestNetworkType,
        ).setMaxFee(2);
        expect(nodeKeyLinkTransaction.maxFee.compact()).to.be.equal(322);

        const signedTransaction = nodeKeyLinkTransaction.signWith(account, generationHash);
        expect(signedTransaction.hash).not.to.be.undefined;
    });

    it('Notify Account', () => {
        const tx = NodeKeyLinkTransaction.create(Deadline.create(epochAdjustment), account.publicKey, LinkAction.Unlink, TestNetworkType);
        let canNotify = tx.shouldNotifyAccount(account.address);
        expect(canNotify).to.be.true;

        canNotify = tx.shouldNotifyAccount(Address.createFromRawAddress('TAMJCSC2BEW52LVAULFRRJJTSRHLI7ABRHFJZ5I'));
        expect(canNotify).to.be.false;

        Object.assign(tx, { signer: account.publicAccount });
        expect(tx.shouldNotifyAccount(account.address)).to.be.true;
    });
});
