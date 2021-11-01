/*
 * Copyright 2018 NEM
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
import { NamespaceId } from '../../../src/model/namespace/NamespaceId';
import { NetworkType } from '../../../src/model/network/NetworkType';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { NamespaceRegistrationTransaction } from '../../../src/model/transaction/NamespaceRegistrationTransaction';
import { UInt64 } from '../../../src/model/UInt64';
import { TestingAccount } from '../../conf/conf.spec';

describe('NamespaceRegistrationTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    const epochAdjustment = 1573430400;
    before(() => {
        account = TestingAccount;
    });

    it('should default maxFee field be set to 0', () => {
        const registerNamespaceTransaction = NamespaceRegistrationTransaction.createRootNamespace(
            Deadline.create(epochAdjustment),
            'root-test-namespace',
            UInt64.fromUint(1000),
            NetworkType.TEST_NET,
        );

        expect(registerNamespaceTransaction.maxFee.higher).to.be.equal(0);
        expect(registerNamespaceTransaction.maxFee.lower).to.be.equal(0);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const registerNamespaceTransaction = NamespaceRegistrationTransaction.createRootNamespace(
            Deadline.create(epochAdjustment),
            'root-test-namespace',
            UInt64.fromUint(1000),
            NetworkType.TEST_NET,
            new UInt64([1, 0]),
        );

        expect(registerNamespaceTransaction.maxFee.higher).to.be.equal(0);
        expect(registerNamespaceTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should createComplete an root NamespaceRegistrationTransaction object and sign it', () => {
        const registerNamespaceTransaction = NamespaceRegistrationTransaction.createRootNamespace(
            Deadline.create(epochAdjustment),
            'root-test-namespace',
            UInt64.fromUint(1000),
            NetworkType.TEST_NET,
        );

        expect(registerNamespaceTransaction.duration!.lower).to.be.equal(1000);
        expect(registerNamespaceTransaction.duration!.higher).to.be.equal(0);

        const signedTransaction = registerNamespaceTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            'E803000000000000CFCBE72D994BE69B0013726F6F742D746573742D6E616D657370616365',
        );
    });

    it('should createComplete an sub NamespaceRegistrationTransaction object and sign it', () => {
        const registerNamespaceTransaction = NamespaceRegistrationTransaction.createSubNamespace(
            Deadline.create(epochAdjustment),
            'root-test-namespace',
            'parent-test-namespace',
            NetworkType.TEST_NET,
        );

        const signedTransaction = registerNamespaceTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '4DF55E7F6D8FB7FF924207DF2CA1BBF30113726F6F742D746573742D6E616D657370616365',
        );
    });

    it('should createComplete an sub NamespaceRegistrationTransaction object and sign it - ParentId', () => {
        const registerNamespaceTransaction = NamespaceRegistrationTransaction.createSubNamespace(
            Deadline.create(epochAdjustment),
            'root-test-namespace',
            new NamespaceId([929036875, 2226345261]),
            NetworkType.TEST_NET,
        );

        const signedTransaction = registerNamespaceTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '4BFA5F372D55B384EE393014E8B74B9C0113726F6F742D746573742D6E616D657370616365',
        );
    });

    describe('size', () => {
        it('should return 165 for NamespaceRegistrationTransaction with name of 19 bytes', () => {
            const registerNamespaceTransaction = NamespaceRegistrationTransaction.createRootNamespace(
                Deadline.create(epochAdjustment),
                'root-test-namespace',
                UInt64.fromUint(1000),
                NetworkType.TEST_NET,
            );
            expect(registerNamespaceTransaction.size).to.be.equal(165);
            expect(Convert.hexToUint8(registerNamespaceTransaction.serialize()).length).to.be.equal(registerNamespaceTransaction.size);
        });
        it('should set payload size', () => {
            const registerNamespaceTransaction = NamespaceRegistrationTransaction.createRootNamespace(
                Deadline.create(epochAdjustment),
                'root-test-namespace',
                UInt64.fromUint(1000),
                NetworkType.TEST_NET,
            );
            expect(registerNamespaceTransaction.size).to.be.equal(165);
            expect(Convert.hexToUint8(registerNamespaceTransaction.serialize()).length).to.be.equal(registerNamespaceTransaction.size);
            expect(registerNamespaceTransaction.setPayloadSize(10).size).to.be.equal(10);
        });
    });

    it('Test set maxFee using multiplier', () => {
        const registerNamespaceTransaction = NamespaceRegistrationTransaction.createRootNamespace(
            Deadline.create(epochAdjustment),
            'root-test-namespace',
            UInt64.fromUint(1000),
            NetworkType.TEST_NET,
        ).setMaxFee(2);
        expect(registerNamespaceTransaction.maxFee.compact()).to.be.equal(330);

        const signedTransaction = registerNamespaceTransaction.signWith(account, generationHash);
        expect(signedTransaction.hash).not.to.be.undefined;
    });

    it('Notify Account', () => {
        const tx = NamespaceRegistrationTransaction.createRootNamespace(
            Deadline.create(epochAdjustment),
            'root-test-namespace',
            UInt64.fromUint(1000),
            NetworkType.TEST_NET,
        );

        Object.assign(tx, { signer: account.publicAccount });
        expect(tx.shouldNotifyAccount(account.address)).to.be.true;
    });

    it('Sub namespacename craetd by different type of parent id', () => {
        const parentNamespace = 'parent';
        const childNamespace = 'child';
        const parentId = new NamespaceId(parentNamespace);

        const subNameSpaceTransactionStringParent = NamespaceRegistrationTransaction.createSubNamespace(
            Deadline.create(1573430400),
            childNamespace,
            parentNamespace,
            NetworkType.TEST_NET,
            UInt64.fromUint(100000),
        );
        const subNameSpaceTransactionIdParent = NamespaceRegistrationTransaction.createSubNamespace(
            Deadline.create(1573430400),
            childNamespace,
            parentId,
            NetworkType.TEST_NET,
            UInt64.fromUint(100000),
        );

        expect(subNameSpaceTransactionStringParent.namespaceId.equals(subNameSpaceTransactionIdParent.namespaceId)).to.be.true;
    });
});
