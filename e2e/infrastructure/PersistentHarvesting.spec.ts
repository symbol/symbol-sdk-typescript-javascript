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

import { Account } from '../../src/model/account/Account';
import { NetworkType } from '../../src/model/network/NetworkType';
import { AccountKeyLinkTransaction } from '../../src/model/transaction/AccountKeyLinkTransaction';
import { Deadline } from '../../src/model/transaction/Deadline';
import { LinkAction } from '../../src/model/transaction/LinkAction';
import { NodeKeyLinkTransaction } from '../../src/model/transaction/NodeKeyLinkTransaction';
import { PersistentDelegationRequestTransaction } from '../../src/model/transaction/PersistentDelegationRequestTransaction';
import { VrfKeyLinkTransaction } from '../../src/model/transaction/VrfKeyLinkTransaction';
import { IntegrationTestHelper } from './IntegrationTestHelper';

describe('PersistentHarvesting', () => {
    const helper = new IntegrationTestHelper();
    let account: Account;
    let generationHash: string;
    let networkType: NetworkType;
    let remoteAccount: Account;

    const vrfKeyPair = Account.createFromPrivateKey(
        '82798EA9A2D2D202AFCCC82C40A287780BCA3C7F7A2FD5B754832804C6BE1BAA',
        NetworkType.PRIVATE_TEST,
    );

    before(() => {
        return helper.start({ openListener: true }).then(() => {
            remoteAccount = Account.generateNewAccount(helper.networkType);
            console.log(remoteAccount.privateKey, remoteAccount.publicAccount);
            account = helper.harvestingAccount;
            generationHash = helper.generationHash;
            networkType = helper.networkType;
        });
    });

    after(() => {
        return helper.close();
    });

    /**
     * =========================
     * Setup test data
     * =========================
     */

    describe('AccountKeyLinkTransaction', () => {
        it('standalone', () => {
            const accountLinkTransaction = AccountKeyLinkTransaction.create(
                Deadline.create(helper.epochAdjustment),
                remoteAccount.publicKey,
                LinkAction.Link,
                networkType,
                helper.maxFee,
            );
            const signedTransaction = accountLinkTransaction.signWith(account, generationHash);

            return helper.announce(signedTransaction);
        });
    });

    describe('VrfKeyLinkTransaction', () => {
        it('standalone', () => {
            const vrfKeyLinkTransaction = VrfKeyLinkTransaction.create(
                Deadline.create(helper.epochAdjustment),
                vrfKeyPair.publicKey,
                LinkAction.Link,
                networkType,
                helper.maxFee,
            );
            const signedTransaction = vrfKeyLinkTransaction.signWith(account, generationHash);

            return helper.announce(signedTransaction);
        });
    });

    describe('NodeKeyLinkTransaction', () => {
        it('standalone', () => {
            const nodeKeyLinkTransaction = NodeKeyLinkTransaction.create(
                Deadline.create(helper.epochAdjustment),
                'cfd84eca83508bbee954668e4aecca736caefa615367da76afe6985d695381db',
                LinkAction.Link,
                networkType,
                helper.maxFee,
            );
            const signedTransaction = nodeKeyLinkTransaction.signWith(account, generationHash);

            return helper.announce(signedTransaction);
        });
    });
    /**
     * =========================
     * Tests
     * =========================
     */

    describe('transactions', () => {
        it('should create delegated harvesting transaction', () => {
            const tx = PersistentDelegationRequestTransaction.createPersistentDelegationRequestTransaction(
                Deadline.create(helper.epochAdjustment),
                remoteAccount.privateKey,
                vrfKeyPair.privateKey,
                'cfd84eca83508bbee954668e4aecca736caefa615367da76afe6985d695381db',
                NetworkType.PRIVATE_TEST,
                helper.maxFee,
            );

            const signedTransaction = tx.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });
});
