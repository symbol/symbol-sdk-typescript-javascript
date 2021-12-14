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

import { toPromise } from '../../src/infrastructure/rxUtils';
import { Account } from '../../src/model/account';
import { NetworkType } from '../../src/model/network';
import {
    AccountKeyLinkTransaction,
    Deadline,
    LinkAction,
    NodeKeyLinkTransaction,
    PersistentDelegationRequestTransaction,
    VrfKeyLinkTransaction,
} from '../../src/model/transaction';
import { IntegrationTestHelper } from './IntegrationTestHelper';

describe('PersistentHarvesting', () => {
    const helper = new IntegrationTestHelper();
    let account: Account;
    let generationHash: string;
    let networkType: NetworkType;
    let vrfAccount: Account;
    let remoteAccount: Account;
    let nodePublicKey: string;

    before(() => {
        return helper.start({ openListener: true }).then(() => {
            networkType = helper.networkType;
            remoteAccount = Account.createFromPrivateKey('CC798EA9A2D2D202AFCCC82C40A287780BCA3C7F7A2FD5B754832804C6BE1BAA', networkType);
            vrfAccount = Account.createFromPrivateKey('AA798EA9A2D2D202AFCCC82C40A287780BCA3C7F7A2FD5B754832804C6BE1BAA', networkType);
            account = helper.account;
            generationHash = helper.generationHash;
            nodePublicKey = helper.bootstrapAddresses.nodes![0].transport!.publicKey;
            console.log('Remote: ', remoteAccount.publicAccount);
            console.log('VRF: ', vrfAccount.publicAccount);
            console.log('Node Public Key: ', nodePublicKey);
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
        it('standalone', async () => {
            const accountInfo = await toPromise(helper.repositoryFactory.createAccountRepository().getAccountInfo(account.address));
            const publicKey = accountInfo.supplementalPublicKeys?.linked?.publicKey;
            if (publicKey) {
                if (publicKey == remoteAccount.publicKey) {
                    return;
                }
                throw new Error(`Account ${accountInfo.address.plain()} already linked to another Remote public key ${publicKey}`);
            }

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
        it('standalone', async () => {
            const accountInfo = await toPromise(helper.repositoryFactory.createAccountRepository().getAccountInfo(account.address));

            const publicKey = accountInfo.supplementalPublicKeys?.vrf?.publicKey;
            if (publicKey) {
                if (publicKey == vrfAccount.publicKey) {
                    return;
                }
                throw new Error(`Account ${accountInfo.address.plain()} already linked to another VRF public key ${publicKey}`);
            }

            const vrfKeyLinkTransaction = VrfKeyLinkTransaction.create(
                Deadline.create(helper.epochAdjustment),
                vrfAccount.publicKey,
                LinkAction.Link,
                networkType,
                helper.maxFee,
            );
            const signedTransaction = vrfKeyLinkTransaction.signWith(account, generationHash);

            return helper.announce(signedTransaction);
        });
    });

    describe('NodeKeyLinkTransaction', () => {
        it('standalone', async () => {
            const nodePublicKey = helper.bootstrapAddresses.nodes![0].transport!.publicKey;

            const accountInfo = await toPromise(helper.repositoryFactory.createAccountRepository().getAccountInfo(account.address));

            const publicKey = accountInfo.supplementalPublicKeys?.node?.publicKey;
            if (publicKey) {
                if (publicKey == nodePublicKey) {
                    return;
                }
                throw new Error(`Account ${accountInfo.address.plain()} already linked to another Node public key ${publicKey}`);
            }

            const nodeKeyLinkTransaction = NodeKeyLinkTransaction.create(
                Deadline.create(helper.epochAdjustment),
                nodePublicKey,
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
        it('should create delegated harvesting transaction', async () => {
            const nodePublicKey = helper.bootstrapAddresses.nodes![0].transport!.publicKey;
            const tx = PersistentDelegationRequestTransaction.createPersistentDelegationRequestTransaction(
                Deadline.create(helper.epochAdjustment),
                remoteAccount.privateKey,
                vrfAccount.privateKey,
                nodePublicKey,
                networkType,
                helper.maxFee,
            );

            const signedTransaction = tx.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });
});
