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
import { AliasTransaction } from '../../../src/model';
import { Account } from '../../../src/model/account/Account';
import { Address } from '../../../src/model/account/Address';
import { AliasAction } from '../../../src/model/namespace/AliasAction';
import { NamespaceId } from '../../../src/model/namespace/NamespaceId';
import { AddressAliasTransaction } from '../../../src/model/transaction/AddressAliasTransaction';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { UInt64 } from '../../../src/model/UInt64';
import { TestAddress, TestingAccount, TestNetworkType } from '../../conf/conf.spec';

describe('AddressAliasTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    const epochAdjustment = 1573430400;
    before(() => {
        account = TestingAccount;
    });

    it('should default maxFee field be set to 0', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const addressAliasTransaction = AddressAliasTransaction.create(
            Deadline.create(epochAdjustment),
            AliasAction.Link,
            namespaceId,
            TestAddress,
            TestNetworkType,
        );

        expect(addressAliasTransaction.maxFee.higher).to.be.equal(0);
        expect(addressAliasTransaction.maxFee.lower).to.be.equal(0);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const addressAliasTransaction = AddressAliasTransaction.create(
            Deadline.create(epochAdjustment),
            AliasAction.Link,
            namespaceId,
            TestAddress,
            TestNetworkType,
            new UInt64([1, 0]),
        );

        expect(addressAliasTransaction.maxFee.higher).to.be.equal(0);
        expect(addressAliasTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should createComplete an AddressAliasTransaction object and sign it', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const addressAliasTransaction = AddressAliasTransaction.create(
            Deadline.create(epochAdjustment),
            AliasAction.Link,
            namespaceId,
            TestAddress,
            TestNetworkType,
        );

        expect(addressAliasTransaction.aliasAction).to.be.equal(AliasAction.Link);
        expect(addressAliasTransaction.namespaceId.id.lower).to.be.equal(33347626);
        expect(addressAliasTransaction.namespaceId.id.higher).to.be.equal(3779697293);
        expect(addressAliasTransaction.address.plain()).to.be.equal('TATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA37JGO5Q');

        const signedTransaction = addressAliasTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '2AD8FC018D9A49E19826D27E1D0A26CA4E316F901E23E55C8711DB20DFD2677601',
        );
    });

    it('should createComplete an AddressAliasTransaction using abstract', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const addressAliasTransaction = AliasTransaction.createForAddress(
            Deadline.create(epochAdjustment),
            AliasAction.Link,
            namespaceId,
            TestAddress,
            TestNetworkType,
        ) as AddressAliasTransaction;

        expect(addressAliasTransaction.aliasAction).to.be.equal(AliasAction.Link);
        expect(addressAliasTransaction.namespaceId.id.lower).to.be.equal(33347626);
        expect(addressAliasTransaction.namespaceId.id.higher).to.be.equal(3779697293);
        expect(addressAliasTransaction.address.plain()).to.be.equal('TATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA37JGO5Q');

        const signedTransaction = addressAliasTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '2AD8FC018D9A49E19826D27E1D0A26CA4E316F901E23E55C8711DB20DFD2677601',
        );
    });

    describe('size', () => {
        it('should return 161 for AggregateTransaction byte size with TransferTransaction with 1 mosaic and message NEM', () => {
            const namespaceId = new NamespaceId([33347626, 3779697293]);
            const addressAliasTransaction = AddressAliasTransaction.create(
                Deadline.create(epochAdjustment),
                AliasAction.Link,
                namespaceId,
                TestAddress,
                TestNetworkType,
            );
            expect(Convert.hexToUint8(addressAliasTransaction.serialize()).length).to.be.equal(addressAliasTransaction.size);
            expect(addressAliasTransaction.size).to.be.equal(161);
        });

        it('should set payload size', () => {
            const namespaceId = new NamespaceId([33347626, 3779697293]);
            const addressAliasTransaction = AddressAliasTransaction.create(
                Deadline.create(epochAdjustment),
                AliasAction.Link,
                namespaceId,
                TestAddress,
                TestNetworkType,
            );
            expect(Convert.hexToUint8(addressAliasTransaction.serialize()).length).to.be.equal(addressAliasTransaction.size);
            expect(addressAliasTransaction.size).to.be.equal(161);
            expect(addressAliasTransaction.setPayloadSize(10).size).to.be.equal(10);
        });
    });

    it('Test set maxFee using multiplier', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const addressAliasTransaction = AddressAliasTransaction.create(
            Deadline.create(epochAdjustment),
            AliasAction.Link,
            namespaceId,
            TestAddress,
            TestNetworkType,
        ).setMaxFee(2);
        expect(addressAliasTransaction.maxFee.compact()).to.be.equal(322);
    });

    it('Notify Account', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const tx = AddressAliasTransaction.create(
            Deadline.create(epochAdjustment),
            AliasAction.Link,
            namespaceId,
            TestAddress,
            TestNetworkType,
        );

        let canNotify = tx.shouldNotifyAccount(TestAddress);
        expect(canNotify).to.be.true;

        canNotify = tx.shouldNotifyAccount(Address.createFromRawAddress('TAMJCSC2BEW52LVAULFRRJJTSRHLI7ABRHFJZ5I'));
        expect(canNotify).to.be.false;

        Object.assign(tx, { signer: account.publicAccount });
        expect(tx.shouldNotifyAccount(account.address)).to.be.true;
    });
});
