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
import * as CryptoJS from 'crypto-js';
import { ChronoUnit } from 'js-joda';
import { keccak_256, sha3_256 } from 'js-sha3';
import { Crypto } from '../../src/core/crypto';
import { Convert, Convert as convert } from '../../src/core/format';
import { TransactionMapping } from '../../src/core/utils/TransactionMapping';
import { AccountRepository } from '../../src/infrastructure/AccountRepository';
import { MultisigRepository } from '../../src/infrastructure/MultisigRepository';
import { NamespaceRepository } from '../../src/infrastructure/NamespaceRepository';
import { RepositoryFactory } from '../../src/infrastructure/RepositoryFactory';
import { TransactionRepository } from '../../src/infrastructure/TransactionRepository';
import { Account } from '../../src/model/account/Account';
import { Address } from '../../src/model/account/Address';
import { PublicAccount } from '../../src/model/account/PublicAccount';
import { PlainMessage } from '../../src/model/message/PlainMessage';
import { Mosaic } from '../../src/model/mosaic/Mosaic';
import { MosaicFlags } from '../../src/model/mosaic/MosaicFlags';
import { MosaicId } from '../../src/model/mosaic/MosaicId';
import { MosaicNonce } from '../../src/model/mosaic/MosaicNonce';
import { MosaicSupplyChangeAction } from '../../src/model/mosaic/MosaicSupplyChangeAction';
import { AliasAction } from '../../src/model/namespace/AliasAction';
import { NamespaceId } from '../../src/model/namespace/NamespaceId';
import { NetworkType } from '../../src/model/network/NetworkType';
import { AccountRestrictionModificationAction } from '../../src/model/restriction/AccountRestrictionModificationAction';
import { AccountRestrictionFlags } from '../../src/model/restriction/AccountRestrictionType';
import { MosaicRestrictionType } from '../../src/model/restriction/MosaicRestrictionType';
import { AccountAddressRestrictionTransaction } from '../../src/model/transaction/AccountAddressRestrictionTransaction';
import { AccountLinkTransaction } from '../../src/model/transaction/AccountLinkTransaction';
import { AccountMetadataTransaction } from '../../src/model/transaction/AccountMetadataTransaction';
import { AccountMosaicRestrictionTransaction } from '../../src/model/transaction/AccountMosaicRestrictionTransaction';
import { AccountOperationRestrictionTransaction } from '../../src/model/transaction/AccountOperationRestrictionTransaction';
import { AccountRestrictionModification } from '../../src/model/transaction/AccountRestrictionModification';
import { AccountRestrictionTransaction } from '../../src/model/transaction/AccountRestrictionTransaction';
import { AddressAliasTransaction } from '../../src/model/transaction/AddressAliasTransaction';
import { AggregateTransaction } from '../../src/model/transaction/AggregateTransaction';
import { CosignatureSignedTransaction } from '../../src/model/transaction/CosignatureSignedTransaction';
import { CosignatureTransaction } from '../../src/model/transaction/CosignatureTransaction';
import { Deadline } from '../../src/model/transaction/Deadline';
import { HashLockTransaction } from '../../src/model/transaction/HashLockTransaction';
import { LockHashAlgorithm } from '../../src/model/transaction/LockHashAlgorithm';
import { LinkAction } from '../../src/model/transaction/LinkAction';
import { LockFundsTransaction } from '../../src/model/transaction/LockFundsTransaction';
import { MosaicAddressRestrictionTransaction } from '../../src/model/transaction/MosaicAddressRestrictionTransaction';
import { MosaicAliasTransaction } from '../../src/model/transaction/MosaicAliasTransaction';
import { MosaicDefinitionTransaction } from '../../src/model/transaction/MosaicDefinitionTransaction';
import { MosaicGlobalRestrictionTransaction } from '../../src/model/transaction/MosaicGlobalRestrictionTransaction';
import { MosaicMetadataTransaction } from '../../src/model/transaction/MosaicMetadataTransaction';
import { MosaicSupplyChangeTransaction } from '../../src/model/transaction/MosaicSupplyChangeTransaction';
import { NamespaceMetadataTransaction } from '../../src/model/transaction/NamespaceMetadataTransaction';
import { NamespaceRegistrationTransaction } from '../../src/model/transaction/NamespaceRegistrationTransaction';
import { SecretLockTransaction } from '../../src/model/transaction/SecretLockTransaction';
import { SecretProofTransaction } from '../../src/model/transaction/SecretProofTransaction';
import { TransactionType } from '../../src/model/transaction/TransactionType';
import { TransferTransaction } from '../../src/model/transaction/TransferTransaction';
import { UInt64 } from '../../src/model/UInt64';
import { IntegrationTestHelper } from './IntegrationTestHelper';
import { LockHashUtils } from '../../src/core/utils/LockHashUtils';

describe('TransactionHttp', () => {
    let transactionHash;
    let transactionId;

    const helper = new IntegrationTestHelper();
    let account: Account;
    let account2: Account;
    let account3: Account;
    let multisigAccount: Account;
    let cosignAccount1: Account;
    let cosignAccount2: Account;
    let cosignAccount3: Account;
    let accountAddress: Address;
    let accountPublicKey: string;
    let publicAccount: PublicAccount;
    let repositoryFactory: RepositoryFactory;
    let accountRepository: AccountRepository;
    let multisigRepository: MultisigRepository;
    let namespaceRepository: NamespaceRepository;
    let generationHash: string;
    let networkType: NetworkType;
    let mosaicId: MosaicId;
    let NetworkCurrencyLocalId: MosaicId;
    let namespaceId: NamespaceId;
    let harvestingAccount: Account;
    let transactionRepository: TransactionRepository;
    const secureRandom = require('secure-random');
    const sha256 = require('js-sha256');
    const ripemd160 = require('ripemd160');

    before(() => {
        return helper.start().then(() => {
            account = helper.account;
            account2 = helper.account2;
            account3 = helper.account3;
            multisigAccount = helper.multisigAccount;
            cosignAccount1 = helper.cosignAccount1;
            cosignAccount2 = helper.cosignAccount2;
            cosignAccount3 = helper.cosignAccount3;
            accountAddress = helper.account.address;
            harvestingAccount = helper.harvestingAccount;
            accountPublicKey = helper.account.publicKey;
            publicAccount = helper.account.publicAccount;
            generationHash = helper.generationHash;
            networkType = helper.networkType;
            repositoryFactory = helper.repositoryFactory;
            accountRepository = helper.repositoryFactory.createAccountRepository();
            multisigRepository = helper.repositoryFactory.createMultisigRepository();
            namespaceRepository = helper.repositoryFactory.createNamespaceRepository();
            transactionRepository = helper.repositoryFactory.createTransactionRepository();
        });
    });
    before(() => {
        return helper.listener.open();
    });

    after(() => {
        helper.listener.close();
    });

    describe('Get network currency mosaic id', () => {
        it('get mosaicId', async () => {
            NetworkCurrencyLocalId =
                (await namespaceRepository.getLinkedMosaicId(new NamespaceId('cat.currency')).toPromise()) as MosaicId;
        });
    });

    describe('MosaicDefinitionTransaction', () => {

        it('standalone', () => {
            const nonce = MosaicNonce.createRandom();
            mosaicId = MosaicId.createFromNonce(nonce, account.publicAccount);
            const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
                Deadline.create(),
                nonce,
                mosaicId,
                MosaicFlags.create(true, true, true),
                3,
                UInt64.fromUint(1000),
                networkType,
                helper.maxFee,
            );
            const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);

            return helper.announce(signedTransaction).then((transaction: MosaicDefinitionTransaction) => {
                expect(transaction.mosaicId, 'MosaicId').not.to.be.undefined;
                expect(transaction.nonce, 'Nonce').not.to.be.undefined;
                expect(transaction.divisibility, 'Divisibility').not.to.be.undefined;
                expect(transaction.duration, 'Duration').not.to.be.undefined;
                expect(transaction.flags.supplyMutable, 'SupplyMutable').not.to.be.undefined;
                expect(transaction.flags.transferable, 'Transferable').not.to.be.undefined;
                expect(transaction.flags.restrictable, 'Restrictable').not.to.be.undefined;
            });
        });
    });

    describe('MosaicDefinitionTransaction', () => {

        it('aggregate', () => {
            const nonce = MosaicNonce.createRandom();
            const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
                Deadline.create(),
                nonce,
                MosaicId.createFromNonce(nonce, account.publicAccount),
                MosaicFlags.create(true, true, true),
                3,
                UInt64.fromUint(0),
                networkType,
                helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [mosaicDefinitionTransaction.toAggregate(account.publicAccount)],
                networkType,
                [], helper.maxFee);
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('AccountMetadataTransaction', () => {

        it('aggregate', () => {
            const accountMetadataTransaction = AccountMetadataTransaction.create(
                Deadline.create(),
                account.publicKey,
                UInt64.fromUint(5),
                10,
                Convert.uint8ToUtf8(new Uint8Array(10)),
                networkType,
                helper.maxFee,
            );

            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [accountMetadataTransaction.toAggregate(account.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );

            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction).then((transaction: AggregateTransaction) => {
                transaction.innerTransactions.forEach((innerTx) => {
                    expect((innerTx as AccountMetadataTransaction).targetPublicKey, 'TargetPublicKey').not.to.be.undefined;
                    expect((innerTx as AccountMetadataTransaction).scopedMetadataKey, 'ScopedMetadataKey').not.to.be.undefined;
                    expect((innerTx as AccountMetadataTransaction).valueSizeDelta, 'ValueSizeDelta').not.to.be.undefined;
                    expect((innerTx as AccountMetadataTransaction).value, 'Value').not.to.be.undefined;
                });
            });
        });
    });

    describe('MosaicMetadataTransaction', () => {

        it('aggregate', () => {
            const mosaicMetadataTransaction = MosaicMetadataTransaction.create(
                Deadline.create(),
                account.publicKey,
                UInt64.fromUint(5),
                mosaicId,
                10,
                Convert.uint8ToUtf8(new Uint8Array(10)),
                networkType, helper.maxFee,
            );

            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [mosaicMetadataTransaction.toAggregate(account.publicAccount)],
                networkType,
                [], helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction).then((transaction: AggregateTransaction) => {
                transaction.innerTransactions.forEach((innerTx) => {
                    expect((innerTx as MosaicMetadataTransaction).targetPublicKey, 'TargetPublicKey').not.to.be.undefined;
                    expect((innerTx as MosaicMetadataTransaction).scopedMetadataKey, 'ScopedMetadataKey').not.to.be.undefined;
                    expect((innerTx as MosaicMetadataTransaction).valueSizeDelta, 'ValueSizeDelta').not.to.be.undefined;
                    expect((innerTx as MosaicMetadataTransaction).value, 'Value').not.to.be.undefined;
                    expect((innerTx as MosaicMetadataTransaction).targetMosaicId, 'TargetMosaicId').not.to.be.undefined;
                });

            });
        });
    });

    describe('NamespaceRegistrationTransaction', () => {
        it('standalone', () => {
            const namespaceName = 'root-test-namespace-' + Math.floor(Math.random() * 10000);
            const registerNamespaceTransaction = NamespaceRegistrationTransaction.createRootNamespace(
                Deadline.create(),
                namespaceName,
                UInt64.fromUint(10),
                networkType, helper.maxFee,
            );
            namespaceId = new NamespaceId(namespaceName);
            const signedTransaction = registerNamespaceTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction).then((transaction: NamespaceRegistrationTransaction) => {
                expect(transaction.namespaceId, 'NamespaceId').not.to.be.undefined;
                expect(transaction.namespaceName, 'NamespaceName').not.to.be.undefined;
                expect(transaction.registrationType, 'RegistrationType').not.to.be.undefined;
            });
        });
    });

    describe('NamespaceRegistrationTransaction', () => {

        it('aggregate', () => {
            const registerNamespaceTransaction = NamespaceRegistrationTransaction.createRootNamespace(
                Deadline.create(),
                'root-test-namespace-' + Math.floor(Math.random() * 10000),
                UInt64.fromUint(5),
                networkType, helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [registerNamespaceTransaction.toAggregate(account.publicAccount)],
                networkType,
                [], helper.maxFee);
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('NamespaceMetadataTransaction', () => {
        it('aggregate', () => {
            const namespaceMetadataTransaction = NamespaceMetadataTransaction.create(
                Deadline.create(),
                account.publicKey,
                UInt64.fromUint(5),
                namespaceId,
                10,
                Convert.uint8ToUtf8(new Uint8Array(10)),
                networkType, helper.maxFee,
            );

            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [namespaceMetadataTransaction.toAggregate(account.publicAccount)],
                networkType,
                [], helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction).then((transaction: AggregateTransaction) => {
                transaction.innerTransactions.forEach((innerTx) => {
                    expect((innerTx as NamespaceMetadataTransaction).targetPublicKey, 'TargetPublicKey').not.to.be.undefined;
                    expect((innerTx as NamespaceMetadataTransaction).scopedMetadataKey, 'ScopedMetadataKey').not.to.be.undefined;
                    expect((innerTx as NamespaceMetadataTransaction).valueSizeDelta, 'ValueSizeDelta').not.to.be.undefined;
                    expect((innerTx as NamespaceMetadataTransaction).value, 'Value').not.to.be.undefined;
                    expect((innerTx as NamespaceMetadataTransaction).targetNamespaceId, 'TargetNamespaceId').not.to.be.undefined;
                });
            });
        });
    });

    describe('MosaicGlobalRestrictionTransaction', () => {
        it('standalone', () => {
            const mosaicGlobalRestrictionTransaction = MosaicGlobalRestrictionTransaction.create(
                Deadline.create(),
                mosaicId,
                UInt64.fromUint(60641),
                UInt64.fromUint(0),
                MosaicRestrictionType.NONE,
                UInt64.fromUint(0),
                MosaicRestrictionType.GE,
                networkType, undefined, helper.maxFee,
            );
            const signedTransaction = mosaicGlobalRestrictionTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });
    describe('MosaicGlobalRestrictionTransaction', () => {
        it('aggregate', () => {
            const mosaicGlobalRestrictionTransaction = MosaicGlobalRestrictionTransaction.create(
                Deadline.create(),
                mosaicId,
                UInt64.fromUint(60641),
                UInt64.fromUint(0),
                MosaicRestrictionType.GE,
                UInt64.fromUint(1),
                MosaicRestrictionType.GE,
                networkType, undefined, helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [mosaicGlobalRestrictionTransaction.toAggregate(account.publicAccount)],
                networkType,
                [], helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('MosaicAddressRestrictionTransaction', () => {

        it('aggregate', () => {
            const mosaicAddressRestrictionTransaction = MosaicAddressRestrictionTransaction.create(
                Deadline.create(),
                mosaicId,
                UInt64.fromUint(60641),
                account3.address,
                UInt64.fromUint(2),
                networkType, helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [mosaicAddressRestrictionTransaction.toAggregate(account.publicAccount)],
                networkType,
                [], helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('TransferTransaction', () => {
        it('standalone', () => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(),
                account2.address,
                [helper.createNetworkCurrency(1, false)],
                PlainMessage.create('test-message'),
                networkType, helper.maxFee,
            );
            const signedTransaction = transferTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });
    describe('TransferTransaction', () => {
        it('aggregate', () => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(),
                account2.address,
                [helper.createNetworkCurrency(1, false)],
                PlainMessage.create('test-message'),
                networkType, helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [transferTransaction.toAggregate(account.publicAccount)],
                networkType,
                [], helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });
    describe('AccountRestrictionTransaction - Outgoing Address', () => {
        it('standalone', () => {
            const addressModification = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
                Deadline.create(),
                AccountRestrictionFlags.BlockOutgoingAddress,
                [account3.address],
                [],
                networkType, helper.maxFee,
            );
            const signedTransaction = addressModification.signWith(account, generationHash);

            return helper.announce(signedTransaction).then((transaction: AccountAddressRestrictionTransaction) => {
                expect(transaction.restrictionAdditions, 'RestrictionAdditions').not.to.be.undefined;
                expect(transaction.restrictionFlags, 'RestrictionFlags').not.to.be.undefined;
            });
        });
    });
    describe('AccountRestrictionTransaction - Outgoing Address', () => {

        it('aggregate', () => {
            const addressModification = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
                Deadline.create(),
                AccountRestrictionFlags.BlockOutgoingAddress,
                [],
                [account3.address],
                networkType, helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [addressModification.toAggregate(account.publicAccount)],
                networkType,
                [], helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('AccountRestrictionTransaction - Incoming Address', () => {

        it('standalone', () => {
            const addressModification = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
                Deadline.create(),
                AccountRestrictionFlags.BlockIncomingAddress,
                [account3.address],
                [],
                networkType, helper.maxFee,
            );
            const signedTransaction = addressModification.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });
    describe('AccountRestrictionTransaction - Incoming Address', () => {
        it('aggregate', () => {
            const addressModification = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
                Deadline.create(),
                AccountRestrictionFlags.BlockIncomingAddress,
                [],
                [account3.address],
                networkType, helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [addressModification.toAggregate(account.publicAccount)],
                networkType,
                [], helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });
    describe('AccountRestrictionTransaction - Mosaic', () => {

        it('standalone', () => {
            AccountRestrictionModification.createForMosaic(
                AccountRestrictionModificationAction.Add,
                mosaicId,
            );
            const addressModification = AccountRestrictionTransaction.createMosaicRestrictionModificationTransaction(
                Deadline.create(),
                AccountRestrictionFlags.BlockMosaic,
                [mosaicId],
                [],
                networkType, helper.maxFee,
            );
            const signedTransaction = addressModification.signWith(account, generationHash);

            return helper.announce(signedTransaction).then((transaction: AccountMosaicRestrictionTransaction) => {
                expect(transaction.restrictionAdditions, 'RestrictionAdditions').not.to.be.undefined;
                expect(transaction.restrictionDeletions, 'RestrictionDeletions').not.to.be.undefined;
                expect(transaction.restrictionFlags, 'RestrictionFlags').not.to.be.undefined;
            });
        });
    });
    describe('AccountRestrictionTransaction - Mosaic', () => {

        it('aggregate', () => {
            const addressModification = AccountRestrictionTransaction.createMosaicRestrictionModificationTransaction(
                Deadline.create(),
                AccountRestrictionFlags.BlockMosaic,
                [],
                [mosaicId],
                networkType, helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [addressModification.toAggregate(account.publicAccount)],
                networkType,
                [], helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });
    describe('AccountRestrictionTransaction - Incoming Operation', () => {

        it('standalone', () => {
            const addressModification = AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(
                Deadline.create(),
                AccountRestrictionFlags.BlockIncomingTransactionType,
                [TransactionType.ACCOUNT_LINK],
                [],
                networkType, helper.maxFee,
            );
            const signedTransaction = addressModification.signWith(account3, generationHash);

            return helper.announce(signedTransaction).then((transaction: AccountOperationRestrictionTransaction) => {
                expect(transaction.restrictionAdditions, 'RestrictionAdditions').not.to.be.undefined;
                expect(transaction.restrictionDeletions, 'RestrictionDeletions').not.to.be.undefined;
                expect(transaction.restrictionFlags, 'RestrictionFlags').not.to.be.undefined;
            });
        });
    });
    describe('AccountRestrictionTransaction - Incoming Operation', () => {

        it('aggregate', () => {
            const addressModification = AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(
                Deadline.create(),
                AccountRestrictionFlags.BlockIncomingTransactionType,
                [],
                [TransactionType.ACCOUNT_LINK],
                networkType, helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [addressModification.toAggregate(account3.publicAccount)],
                networkType,
                [], helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(account3, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('AccountRestrictionTransaction - Outgoing Operation', () => {

        it('standalone', () => {
            AccountRestrictionModification.createForOperation(
                AccountRestrictionModificationAction.Add,
                TransactionType.ACCOUNT_LINK,
            );
            const addressModification = AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(
                Deadline.create(),
                AccountRestrictionFlags.BlockOutgoingTransactionType,
                [TransactionType.ACCOUNT_LINK],
                [],
                networkType, helper.maxFee,
            );
            const signedTransaction = addressModification.signWith(account3, generationHash);

            return helper.announce(signedTransaction).then((transaction: AccountOperationRestrictionTransaction) => {
                expect(transaction.restrictionAdditions, 'RestrictionAdditions').not.to.be.undefined;
                expect(transaction.restrictionDeletions, 'RestrictionDeletions').not.to.be.undefined;
                expect(transaction.restrictionFlags, 'RestrictionFlags').not.to.be.undefined;
            });

        });
    });
    describe('AccountRestrictionTransaction - Outgoing Operation', () => {

        it('aggregate', () => {
            const addressModification = AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(
                Deadline.create(),
                AccountRestrictionFlags.BlockOutgoingTransactionType,
                [],
                [TransactionType.ACCOUNT_LINK],
                networkType, helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [addressModification.toAggregate(account3.publicAccount)],
                networkType,
                [], helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(account3, generationHash);
            return helper.announce(signedTransaction);

        });
    });

    describe('AccountLinkTransaction', () => {

        it('standalone', () => {
            const accountLinkTransaction = AccountLinkTransaction.create(
                Deadline.create(),
                harvestingAccount.publicKey,
                LinkAction.Link,
                networkType, helper.maxFee,
            );
            const signedTransaction = accountLinkTransaction.signWith(account, generationHash);

            return helper.announce(signedTransaction).then((transaction: AccountLinkTransaction) => {
                expect(transaction.remotePublicKey, 'RemotePublicKey').not.to.be.undefined;
                expect(transaction.linkAction, 'LinkAction').not.to.be.undefined;
                return signedTransaction;
            });

        });
    });
    describe('AccountLinkTransaction', () => {

        it('aggregate', () => {
            const accountLinkTransaction = AccountLinkTransaction.create(
                Deadline.create(),
                harvestingAccount.publicKey,
                LinkAction.Unlink,
                networkType, helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [accountLinkTransaction.toAggregate(account.publicAccount)],
                networkType,
                [], helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('AddressAliasTransaction', () => {

        it('standalone', () => {
            const addressAliasTransaction = AddressAliasTransaction.create(
                Deadline.create(),
                AliasAction.Link,
                namespaceId,
                account.address,
                networkType, helper.maxFee,
            );
            const signedTransaction = addressAliasTransaction.signWith(account, generationHash);

            return helper.announce(signedTransaction).then((transaction: AddressAliasTransaction) => {
                expect(transaction.namespaceId, 'NamespaceId').not.to.be.undefined;
                expect(transaction.aliasAction, 'AliasAction').not.to.be.undefined;
                expect(transaction.address, 'Address').not.to.be.undefined;

            });
        });
    });

    describe('Transfer Transaction using address alias', () => {

        it('Announce TransferTransaction', () => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(),
                namespaceId,
                [helper.createNetworkCurrency(1, false)],
                PlainMessage.create('test-message'),
                networkType, helper.maxFee,
            );
            const signedTransaction = transferTransaction.signWith(account, generationHash);

            return helper.announce(signedTransaction);
        });
    });

    describe('AddressAliasTransaction', () => {

        it('aggregate', () => {
            const addressAliasTransaction = AddressAliasTransaction.create(
                Deadline.create(),
                AliasAction.Unlink,
                namespaceId,
                account.address,
                networkType, helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [addressAliasTransaction.toAggregate(account.publicAccount)],
                networkType,
                [], helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('MosaicSupplyChangeTransaction', () => {

        it('standalone', () => {
            const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
                Deadline.create(),
                mosaicId,
                MosaicSupplyChangeAction.Increase,
                UInt64.fromUint(10),
                networkType, helper.maxFee,
            );
            const signedTransaction = mosaicSupplyChangeTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction).then((transaction: MosaicSupplyChangeTransaction) => {
                expect(transaction.delta, 'Delta').not.to.be.undefined;
                expect(transaction.action, 'Action').not.to.be.undefined;
                expect(transaction.mosaicId, 'MosaicId').not.to.be.undefined;
            });

        });
    });
    describe('MosaicSupplyChangeTransaction', () => {

        it('aggregate', () => {
            const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
                Deadline.create(),
                mosaicId,
                MosaicSupplyChangeAction.Increase,
                UInt64.fromUint(10),
                networkType, helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [mosaicSupplyChangeTransaction.toAggregate(account.publicAccount)],
                networkType,
                [], helper.maxFee);
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });

    });

    describe('MosaicAliasTransaction', () => {

        it('standalone', () => {
            const mosaicAliasTransaction = MosaicAliasTransaction.create(
                Deadline.create(),
                AliasAction.Link,
                namespaceId,
                mosaicId,
                networkType, helper.maxFee,
            );
            const signedTransaction = mosaicAliasTransaction.signWith(account, generationHash);

            return helper.announce(signedTransaction).then((transaction: MosaicAliasTransaction) => {
                expect(transaction.namespaceId, 'NamespaceId').not.to.be.undefined;
                expect(transaction.aliasAction, 'AliasAction').not.to.be.undefined;
                expect(transaction.mosaicId, 'MosaicId').not.to.be.undefined;
            });
        });
    });

    describe('HashLockTransaction - MosaicAlias', () => {

        it('standalone', () => {
            const aggregateTransaction = AggregateTransaction.createBonded(
                Deadline.create(),
                [],
                networkType,
                [], helper.maxFee,
            );
            const signedTransaction = account.sign(aggregateTransaction, generationHash);
            const hashLockTransaction = HashLockTransaction.create(Deadline.create(),
                new Mosaic(new NamespaceId('cat.currency'), UInt64.fromUint(10 * Math.pow(10, helper.networkCurrencyDivisibility))),
                UInt64.fromUint(10000),
                signedTransaction,
                networkType, helper.maxFee);
            const hashLockSignedTransaction = hashLockTransaction.signWith(account, generationHash);
            return helper.announce(hashLockSignedTransaction);
        });
    });

    describe('MosaicAliasTransaction', () => {

        it('aggregate', () => {
            const mosaicAliasTransaction = MosaicAliasTransaction.create(
                Deadline.create(),
                AliasAction.Unlink,
                namespaceId,
                mosaicId,
                networkType, helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [mosaicAliasTransaction.toAggregate(account.publicAccount)],
                networkType,
                [], helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('LockFundsTransaction', () => {

        it('standalone', () => {
            const aggregateTransaction = AggregateTransaction.createBonded(
                Deadline.create(),
                [],
                networkType,
                [], helper.maxFee,
            );
            const signedTransaction = account.sign(aggregateTransaction, generationHash);
            const lockFundsTransaction = LockFundsTransaction.create(Deadline.create(),
                new Mosaic(NetworkCurrencyLocalId, UInt64.fromUint(10 * Math.pow(10, helper.networkCurrencyDivisibility))),
                UInt64.fromUint(10000),
                signedTransaction,
                networkType, helper.maxFee);

            return helper.announce(lockFundsTransaction.signWith(account, generationHash));
        });
    });
    describe('LockFundsTransaction', () => {

        it('aggregate', () => {
            const aggregateTransaction = AggregateTransaction.createBonded(
                Deadline.create(),
                [],
                networkType,
                [], helper.maxFee,
            );
            const signedTransaction = account.sign(aggregateTransaction, generationHash);
            const lockFundsTransaction = LockFundsTransaction.create(Deadline.create(),
                new Mosaic(NetworkCurrencyLocalId, UInt64.fromUint(10 * Math.pow(10, helper.networkCurrencyDivisibility))),
                UInt64.fromUint(10),
                signedTransaction,
                networkType, helper.maxFee);
            const aggregateLockFundsTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [lockFundsTransaction.toAggregate(account.publicAccount)],
                networkType,
                [], helper.maxFee);
            return helper.announce(aggregateLockFundsTransaction.signWith(account, generationHash));
        });
    });

    describe('Aggregate Complete Transaction', () => {

        it('should announce aggregated complete transaction', () => {
            const tx = TransferTransaction.create(
                Deadline.create(),
                account2.address,
                [],
                PlainMessage.create('Hi'),
                networkType, helper.maxFee,
            );
            const aggTx = AggregateTransaction.createComplete(
                Deadline.create(),
                [
                    tx.toAggregate(account.publicAccount),
                ],
                networkType,
                [], helper.maxFee,
            );
            const signedTransaction = account.sign(aggTx, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('SecretLockTransaction', () => {

        it('standalone', () => {
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                helper.createNetworkCurrency(10, false),
                UInt64.fromUint(100),
                LockHashAlgorithm.Op_Sha3_256,
                sha3_256.create().update(Crypto.randomBytes(20)).hex(),
                account2.address,
                networkType, helper.maxFee,
            );
            const signedTransaction = secretLockTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction).then((transaction: SecretLockTransaction) => {
                expect(transaction.mosaic, 'Mosaic').not.to.be.undefined;
                expect(transaction.duration, 'Duration').not.to.be.undefined;
                expect(transaction.hashAlgorithm, 'HashAlgorithm').not.to.be.undefined;
                expect(transaction.secret, 'Secret').not.to.be.undefined;
                expect(transaction.recipientAddress, 'RecipientAddress').not.to.be.undefined;
            });
        });
    });
    describe('HashType: Op_Sha3_256', () => {

        it('aggregate', () => {
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                helper.createNetworkCurrency(10, false),
                UInt64.fromUint(100),
                LockHashAlgorithm.Op_Sha3_256,
                sha3_256.create().update(Crypto.randomBytes(20)).hex(),
                account2.address,
                networkType, helper.maxFee,
            );
            const aggregateSecretLockTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [secretLockTransaction.toAggregate(account.publicAccount)],
                networkType,
                [], helper.maxFee);
            return helper.announce(aggregateSecretLockTransaction.signWith(account, generationHash));
        });
    });

    describe('HashType: Op_Hash_160', () => {

        it('standalone', () => {
            const secretSeed = String.fromCharCode.apply(null, Crypto.randomBytes(20));
            const secret = CryptoJS.RIPEMD160(CryptoJS.SHA256(secretSeed).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex);
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                helper.createNetworkCurrency(10, false),
                UInt64.fromUint(100),
                LockHashAlgorithm.Op_Hash_160,
                secret,
                account2.address,
                networkType, helper.maxFee,
            );
            return helper.announce(secretLockTransaction.signWith(account, generationHash));
        });
    });
    describe('HashType: Op_Hash_160', () => {

        it('aggregate', () => {
            const secretSeed = String.fromCharCode.apply(null, Crypto.randomBytes(20));
            const secret = CryptoJS.RIPEMD160(CryptoJS.SHA256(secretSeed).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex);
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                helper.createNetworkCurrency(10, false),
                UInt64.fromUint(100),
                LockHashAlgorithm.Op_Hash_160,
                secret,
                account2.address,
                networkType, helper.maxFee,
            );
            const aggregateSecretLockTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [secretLockTransaction.toAggregate(account.publicAccount)],
                networkType,
                [], helper.maxFee);
            return helper.announce(aggregateSecretLockTransaction.signWith(account, generationHash));
        });
    });
    describe('HashType: Op_Hash_256', () => {

        it('standalone', () => {
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                helper.createNetworkCurrency(10, false),
                UInt64.fromUint(100),
                LockHashAlgorithm.Op_Hash_256,
                sha3_256.create().update(Crypto.randomBytes(20)).hex(),
                account2.address,
                networkType, helper.maxFee,
            );
            return helper.announce(secretLockTransaction.signWith(account, generationHash));
        });
    });
    describe('HashType: Op_Hash_256', () => {

        it('aggregate', () => {
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                helper.createNetworkCurrency(10, false),
                UInt64.fromUint(100),
                LockHashAlgorithm.Op_Hash_256,
                sha3_256.create().update(Crypto.randomBytes(20)).hex(),
                account2.address,
                networkType, helper.maxFee,
            );
            const aggregateSecretLockTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [secretLockTransaction.toAggregate(account.publicAccount)],
                networkType,
                [], helper.maxFee);

            return helper.announce(aggregateSecretLockTransaction.signWith(account, generationHash));
        });
    });
    describe('SecretProofTransaction - HashType: Op_Sha3_256', () => {

        it('standalone', () => {
            const secretSeed = Crypto.randomBytes(20);
            const secret = LockHashUtils.Op_Sha3_256(secretSeed);
            const proof = convert.uint8ToHex(secretSeed);

            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(1, ChronoUnit.HOURS),
                helper.createNetworkCurrency(10, false),
                UInt64.fromUint(11),
                LockHashAlgorithm.Op_Sha3_256,
                secret,
                account2.address,
                networkType, helper.maxFee,
            );

            const signedSecretLockTx = secretLockTransaction.signWith(account, generationHash);

            return helper.announce(signedSecretLockTx).then(() => {
                const secretProofTransaction = SecretProofTransaction.create(
                    Deadline.create(),
                    LockHashAlgorithm.Op_Sha3_256,
                    secret,
                    account2.address,
                    proof,
                    networkType, helper.maxFee,
                );
                const signedTx = secretProofTransaction.signWith(account2, generationHash);
                return helper.announce(signedTx).then((transaction: SecretProofTransaction) => {
                    expect(transaction.secret, 'Secret').not.to.be.undefined;
                    expect(transaction.recipientAddress, 'RecipientAddress').not.to.be.undefined;
                    expect(transaction.hashAlgorithm, 'HashAlgorithm').not.to.be.undefined;
                    expect(transaction.proof, 'Proof').not.to.be.undefined;
                });
            });

        });
    });
    describe('SecretProofTransaction - HashType: Op_Sha3_256', () => {

        it('aggregate', () => {
            const secretSeed = Crypto.randomBytes(20);
            const secret = sha3_256.create().update(secretSeed).hex();
            const proof = convert.uint8ToHex(secretSeed);
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                helper.createNetworkCurrency(10, false),
                UInt64.fromUint(100),
                LockHashAlgorithm.Op_Sha3_256,
                secret,
                account2.address,
                networkType, helper.maxFee,
            );

            return helper.announce(secretLockTransaction.signWith(account, generationHash)).then(() => {
                const secretProofTransaction = SecretProofTransaction.create(
                    Deadline.create(),
                    LockHashAlgorithm.Op_Sha3_256,
                    secret,
                    account2.address,
                    proof,
                    networkType, helper.maxFee,
                );
                const aggregateSecretProofTransaction = AggregateTransaction.createComplete(Deadline.create(),
                    [secretProofTransaction.toAggregate(account2.publicAccount)],
                    networkType, [], helper.maxFee);
                return helper.announce(aggregateSecretProofTransaction.signWith(account2, generationHash));
            });

        });
    });
    describe('SecretProofTransaction - HashType: Op_Hash_160', () => {

        it('standalone', () => {
            const randomBytes = secureRandom.randomBuffer(32);
            const secretSeed = randomBytes.toString('hex');
            const secret = LockHashUtils.Op_Hash_160(randomBytes);
            const proof = secretSeed;
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                helper.createNetworkCurrency(10, false),
                UInt64.fromUint(100),
                LockHashAlgorithm.Op_Hash_160,
                secret,
                account2.address,
                networkType, helper.maxFee,
            );

            return helper.announce(secretLockTransaction.signWith(account, generationHash)).then(() => {
                const secretProofTransaction = SecretProofTransaction.create(
                    Deadline.create(),
                    LockHashAlgorithm.Op_Hash_160,
                    secret,
                    account2.address,
                    proof,
                    networkType, helper.maxFee,
                );
                const signedTx = secretProofTransaction.signWith(account2, generationHash);
                return helper.announce(signedTx);
            });
        });
    });
    describe('SecretProofTransaction - HashType: Op_Hash_160', () => {

        it('aggregate', () => {
            const randomBytes = secureRandom.randomBuffer(32);
            const secretSeed = randomBytes.toString('hex');
            const hash = sha256(Buffer.from(secretSeed, 'hex'));
            const secret = new ripemd160().update(Buffer.from(hash, 'hex')).digest('hex');
            const proof = secretSeed;
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                helper.createNetworkCurrency(10, false),
                UInt64.fromUint(100),
                LockHashAlgorithm.Op_Hash_160,
                secret,
                account2.address,
                networkType, helper.maxFee,
            );
            const secretProofTransaction = SecretProofTransaction.create(
                Deadline.create(),
                LockHashAlgorithm.Op_Hash_160,
                secret,
                account2.address,
                proof,
                networkType, helper.maxFee,
            );
            const aggregateSecretProofTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [secretProofTransaction.toAggregate(account2.publicAccount)],
                networkType,
                [], helper.maxFee);

            return helper.announce(secretLockTransaction.signWith(account, generationHash)).then(
                () => helper.announce(aggregateSecretProofTransaction.signWith(account2, generationHash)));
        });
    });
    describe('SecretProofTransaction - HashType: Op_Hash_256', () => {

        it('standalone', () => {
            const randomBytes = secureRandom.randomBuffer(32);
            const secretSeed = randomBytes.toString('hex');
            const hash = sha256(Buffer.from(secretSeed, 'hex'));
           // const secret = sha256(Buffer.from(hash, 'hex'));
            const secret = LockHashUtils.Op_Hash_256(randomBytes);
            const proof = secretSeed;
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                helper.createNetworkCurrency(1, false),
                UInt64.fromUint(100),
                LockHashAlgorithm.Op_Hash_256,
                secret,
                account2.address,
                networkType, helper.maxFee,
            );

            const secretProofTransaction = SecretProofTransaction.create(
                Deadline.create(),
                LockHashAlgorithm.Op_Hash_256,
                secret,
                account2.address,
                proof,
                networkType, helper.maxFee,
            );

            return helper.announce(secretLockTransaction.signWith(account, generationHash)).then(() =>
                helper.announce(secretProofTransaction.signWith(account2, generationHash)));
        });
    });
    describe('SecretProofTransaction - HashType: Op_Hash_256', () => {

        it('aggregate', () => {
            const randomBytes = secureRandom.randomBuffer(32);
            const secretSeed = randomBytes.toString('hex');
            const hash = sha256(Buffer.from(secretSeed, 'hex'));
            const secret = sha256(Buffer.from(hash, 'hex'));
            const proof = secretSeed;
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                helper.createNetworkCurrency(10, false),
                UInt64.fromUint(100),
                LockHashAlgorithm.Op_Hash_256,
                secret,
                account2.address,
                networkType, helper.maxFee,
            );
            const secretProofTransaction = SecretProofTransaction.create(
                Deadline.create(),
                LockHashAlgorithm.Op_Hash_256,
                secret,
                account2.address,
                proof,
                networkType, helper.maxFee,
            );
            const aggregateSecretProofTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [secretProofTransaction.toAggregate(account2.publicAccount)],
                networkType,
                [], helper.maxFee);
            return helper.announce(secretLockTransaction.signWith(account, generationHash)).then(() =>
                helper.announce(aggregateSecretProofTransaction.signWith(account2, generationHash)));
        });
    });

    describe('SignTransactionGivenSignatures', () => {

        it('Announce cosign signatures given', () => {

            /**
             * @see https://github.com/nemtech/symbol-sdk-typescript-javascript/issues/112
             */
                // AliceAccount: account
                // BobAccount: account

            const sendAmount = helper.createNetworkCurrency(1000);
            const backAmount = helper.createNetworkCurrency(1);

            const aliceTransferTransaction = TransferTransaction.create(Deadline.create(), account2.address, [sendAmount],
                PlainMessage.create('payout'), networkType, helper.maxFee);
            const bobTransferTransaction = TransferTransaction.create(Deadline.create(), account.address, [backAmount],
                PlainMessage.create('payout'), networkType, helper.maxFee);

            // 01. Alice creates the aggregated tx and sign it. Then payload send to Bob
            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(),
                [
                    aliceTransferTransaction.toAggregate(account.publicAccount),
                    bobTransferTransaction.toAggregate(account2.publicAccount),
                ],
                networkType,
                [], helper.maxFee,
            );

            const aliceSignedTransaction = aggregateTransaction.signWith(account, generationHash);

            // 02 Bob cosigns the tx and sends it back to Alice
            const signedTxBob = CosignatureTransaction.signTransactionPayload(account2, aliceSignedTransaction.payload, generationHash);

            // 03. Alice collects the cosignatures, recreate, sign, and announces the transaction
            const cosignatureSignedTransactions = [
                new CosignatureSignedTransaction(signedTxBob.parentHash, signedTxBob.signature, signedTxBob.signerPublicKey),
            ];
            const recreatedTx = TransactionMapping.createFromPayload(aliceSignedTransaction.payload) as AggregateTransaction;

            const signedTransaction = recreatedTx.signTransactionGivenSignatures(account, cosignatureSignedTransactions, generationHash);

            return helper.announce(signedTransaction);
        });
    });

    describe('transactions', () => {
        it('should call transactions successfully', async () => {
            const transactions = await accountRepository.getAccountTransactions(account.publicAccount.address).toPromise();
            const transaction = transactions[0];
            transactionId = transaction.transactionInfo!.id;
            transactionHash = transaction.transactionInfo!.hash;
        });
    });

    describe('getTransaction', () => {
        it('should return transaction info given transactionHash', async () => {
            const transaction = await transactionRepository.getTransaction(transactionHash).toPromise();
            expect(transaction.transactionInfo!.hash).to.be.equal(transactionHash);
            expect(transaction.transactionInfo!.id).to.be.equal(transactionId);
        });

        it('should return transaction info given transactionId', async () => {
            const transaction = await transactionRepository.getTransaction(transactionId).toPromise();
            expect(transaction.transactionInfo!.hash).to.be.equal(transactionHash);
            expect(transaction.transactionInfo!.id).to.be.equal(transactionId);
        });
    });

    describe('getTransactions', () => {
        it('should return transaction info given array of transactionHash', async () => {
            const transactions = await transactionRepository.getTransactions([transactionHash]).toPromise();
            expect(transactions[0].transactionInfo!.hash).to.be.equal(transactionHash);
            expect(transactions[0].transactionInfo!.id).to.be.equal(transactionId);
        });

        it('should return transaction info given array of transactionId', async () => {
            const transactions = await transactionRepository.getTransactions([transactionId]).toPromise();
            expect(transactions[0].transactionInfo!.hash).to.be.equal(transactionHash);
            expect(transactions[0].transactionInfo!.id).to.be.equal(transactionId);
        });
    });

    describe('getTransactionStatus', () => {
        it('should return transaction status given transactionHash', async () => {
            const transactionStatus = await transactionRepository.getTransactionStatus(transactionHash).toPromise();
            expect(transactionStatus.group).to.be.equal('confirmed');
            expect(transactionStatus.height!.lower).to.be.greaterThan(0);
            expect(transactionStatus.height!.higher).to.be.equal(0);
        });
    });

    describe('getTransactionsStatuses', () => {
        it('should return transaction status given array of transactionHash', async () => {
            const transactionStatuses = await transactionRepository.getTransactionsStatuses([transactionHash]).toPromise();
            expect(transactionStatuses[0].group).to.be.equal('confirmed');
            expect(transactionStatuses[0].height!.lower).to.be.greaterThan(0);
            expect(transactionStatuses[0].height!.higher).to.be.equal(0);
        });
    });

    describe('announce', () => {
        it('should return success when announce', async () => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(),
                account2.address,
                [helper.createNetworkCurrency(1, false)],
                PlainMessage.create('test-message'),
                networkType, helper.maxFee,
            );
            const signedTransaction = transferTransaction.signWith(account, generationHash);
            const transactionAnnounceResponse = await transactionRepository.announce(signedTransaction).toPromise();
            expect(transactionAnnounceResponse.message).to.be.equal('packet 9 was pushed to the network via /transaction');
        });
    });

    describe('announceAggregateBonded', () => {
        it('should return success when announceAggregateBonded', async () => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(),
                account2.address,
                [helper.createNetworkCurrency(1)],
                PlainMessage.create('test-message'),
                networkType, helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createBonded(
                Deadline.create(2, ChronoUnit.MINUTES),
                [transferTransaction.toAggregate(multisigAccount.publicAccount)],
                networkType,
                [], helper.maxFee);
            const signedTransaction = aggregateTransaction.signWith(cosignAccount1, generationHash);
            const transactionAnnounceResponse = await transactionRepository.announceAggregateBonded(signedTransaction).toPromise();
            expect(transactionAnnounceResponse.message)
            .to.be.equal('packet 500 was pushed to the network via /transaction/partial');
        });
    });

    describe('announceAggregateBondedCosignature', () => {
        it('should return success when announceAggregateBondedCosignature', async () => {
            const payload = new CosignatureSignedTransaction('', '', '');
            const transactionAnnounceResponse = await transactionRepository.announceAggregateBondedCosignature(payload).toPromise();
            expect(transactionAnnounceResponse.message).to.be.equal('packet 501 was pushed to the network via /transaction/cosignature');
        });
    });

    describe('getTransactionEffectiveFee', () => {
        it('should return effective paid fee given transactionHash', async () => {
            const effectiveFee = await transactionRepository.getTransactionEffectiveFee(transactionHash).toPromise();
            expect(effectiveFee).to.not.be.undefined;
            expect(effectiveFee).to.be.equal(0);
        });
    });
});
