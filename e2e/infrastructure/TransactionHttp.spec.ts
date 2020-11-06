/*
 * Copyright 2020 NEM
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
import { ChronoUnit } from '@js-joda/core';
import { sha3_256 } from 'js-sha3';
import { Crypto } from '../../src/core/crypto';
import { Convert, Convert as convert } from '../../src/core/format';
import { TransactionMapping } from '../../src/core/utils/TransactionMapping';
import { NamespaceRepository } from '../../src/infrastructure/NamespaceRepository';
import { TransactionRepository } from '../../src/infrastructure/TransactionRepository';
import { Account } from '../../src/model/account/Account';
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
import { MosaicRestrictionType } from '../../src/model/restriction/MosaicRestrictionType';
import { AccountAddressRestrictionTransaction } from '../../src/model/transaction/AccountAddressRestrictionTransaction';
import { AccountKeyLinkTransaction } from '../../src/model/transaction/AccountKeyLinkTransaction';
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
import { LockHashAlgorithm } from '../../src/model/lock/LockHashAlgorithm';
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
import { TransactionSearchCriteria } from '../../src/infrastructure';
import { VrfKeyLinkTransaction } from '../../src/model/transaction/VrfKeyLinkTransaction';
import { VotingKeyLinkTransaction } from '../../src/model/transaction/VotingKeyLinkTransaction';
import { NodeKeyLinkTransaction } from '../../src/model/transaction/NodeKeyLinkTransaction';
import { TransactionPaginationStreamer } from '../../src/infrastructure/paginationStreamer/TransactionPaginationStreamer';
import { toArray, take } from 'rxjs/operators';
import { deepEqual } from 'assert';
import { AddressRestrictionFlag } from '../../src/model/restriction/AddressRestrictionFlag';
import { MosaicRestrictionFlag } from '../../src/model/restriction/MosaicRestrictionFlag';
import { OperationRestrictionFlag } from '../../src/model/restriction/OperationRestrictionFlag';
import { TransactionGroup } from '../../src/infrastructure/TransactionGroup';
import { TransactionStatusRepository } from '../../src/infrastructure/TransactionStatusRepository';
import * as ripemd160 from 'ripemd160';
import { sha256 } from 'js-sha256';
import * as secureRandom from 'secure-random';
import * as CryptoJS from 'crypto-js';

describe('TransactionHttp', () => {
    let transactionHash: string;
    let transactionId: string;

    const helper = new IntegrationTestHelper();
    let account: Account;
    let account2: Account;
    let account3: Account;
    let multisigAccount: Account;
    let cosignAccount1: Account;
    let namespaceRepository: NamespaceRepository;
    let generationHash: string;
    let networkType: NetworkType;
    let mosaicId: MosaicId;
    let networkNetworkCurrencyLocalId: MosaicId;
    let addressAlias: NamespaceId;
    let mosaicAlias: NamespaceId;
    let harvestingAccount: Account;
    let transactionRepository: TransactionRepository;
    let transactionStatusRepository: TransactionStatusRepository;
    let votingKey: string;

    const remoteAccount = Account.generateNewAccount(helper.networkType);

    before(() => {
        return helper.start({ openListener: true }).then(() => {
            account = helper.account;
            account2 = helper.account2;
            account3 = helper.account3;
            multisigAccount = helper.multisigAccount;
            cosignAccount1 = helper.cosignAccount1;
            harvestingAccount = helper.harvestingAccount;
            generationHash = helper.generationHash;
            networkType = helper.networkType;
            votingKey = Convert.uint8ToHex(Crypto.randomBytes(48));
            namespaceRepository = helper.repositoryFactory.createNamespaceRepository();
            transactionRepository = helper.repositoryFactory.createTransactionRepository();
            transactionStatusRepository = helper.repositoryFactory.createTransactionStatusRepository();
        });
    });

    after(() => {
        return helper.close();
    });

    describe('Get network currency mosaic id', () => {
        it('get mosaicId', async () => {
            networkNetworkCurrencyLocalId = (await namespaceRepository
                .getLinkedMosaicId(helper.networkCurrency!.namespaceId!)
                .toPromise()) as MosaicId;
        });
    });

    describe('MosaicDefinitionTransaction', () => {
        it('standalone', () => {
            const nonce = MosaicNonce.createRandom();
            mosaicId = MosaicId.createFromNonce(nonce, account.address);
            const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
                Deadline.create(helper.epochAdjustment),
                nonce,
                mosaicId,
                MosaicFlags.create(true, true, true),
                3,
                UInt64.fromUint(1000),
                networkType,
                helper.maxFee,
            );
            const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);
            transactionHash = signedTransaction.hash;

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
                Deadline.create(helper.epochAdjustment),
                nonce,
                MosaicId.createFromNonce(nonce, account.address),
                MosaicFlags.create(true, true, true),
                3,
                UInt64.fromUint(0),
                networkType,
                helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(helper.epochAdjustment),
                [mosaicDefinitionTransaction.toAggregate(account.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('AccountMetadataTransaction', () => {
        it('aggregate', () => {
            const accountMetadataTransaction = AccountMetadataTransaction.create(
                Deadline.create(helper.epochAdjustment),
                account.address,
                UInt64.fromUint(5),
                10,
                Convert.uint8ToUtf8(new Uint8Array(10)),
                networkType,
                helper.maxFee,
            );

            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(helper.epochAdjustment),
                [accountMetadataTransaction.toAggregate(account.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );

            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction).then((transaction: AggregateTransaction) => {
                transaction.innerTransactions.forEach((innerTx) => {
                    expect((innerTx as AccountMetadataTransaction).targetAddress, 'TargetAddress').not.to.be.undefined;
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
                Deadline.create(helper.epochAdjustment),
                account.address,
                UInt64.fromUint(5),
                mosaicId,
                10,
                Convert.uint8ToUtf8(new Uint8Array(10)),
                networkType,
                helper.maxFee,
            );

            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(helper.epochAdjustment),
                [mosaicMetadataTransaction.toAggregate(account.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction).then((transaction: AggregateTransaction) => {
                transaction.innerTransactions.forEach((innerTx) => {
                    expect((innerTx as MosaicMetadataTransaction).targetAddress, 'TargetAddress').not.to.be.undefined;
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
                Deadline.create(helper.epochAdjustment),
                namespaceName,
                UInt64.fromUint(50),
                networkType,
                helper.maxFee,
            );
            addressAlias = new NamespaceId(namespaceName);
            const signedTransaction = registerNamespaceTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction).then((transaction: NamespaceRegistrationTransaction) => {
                expect(transaction.namespaceId, 'NamespaceId').not.to.be.undefined;
                expect(transaction.namespaceName, 'NamespaceName').not.to.be.undefined;
                expect(transaction.registrationType, 'RegistrationType').not.to.be.undefined;
            });
        });
    });

    describe('NamespaceRegistrationTransaction', () => {
        it('standalone', () => {
            const namespaceName = 'root-test-namespace-' + Math.floor(Math.random() * 10000);
            const registerNamespaceTransaction = NamespaceRegistrationTransaction.createRootNamespace(
                Deadline.create(helper.epochAdjustment),
                namespaceName,
                UInt64.fromUint(50),
                networkType,
                helper.maxFee,
            );
            mosaicAlias = new NamespaceId(namespaceName);
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
                Deadline.create(helper.epochAdjustment),
                'root-test-namespace-' + Math.floor(Math.random() * 10000),
                UInt64.fromUint(5),
                networkType,
                helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(helper.epochAdjustment),
                [registerNamespaceTransaction.toAggregate(account.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('NamespaceMetadataTransaction', () => {
        it('aggregate', () => {
            const namespaceMetadataTransaction = NamespaceMetadataTransaction.create(
                Deadline.create(helper.epochAdjustment),
                account.address,
                UInt64.fromUint(5),
                addressAlias,
                10,
                Convert.uint8ToUtf8(new Uint8Array(10)),
                networkType,
                helper.maxFee,
            );

            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(helper.epochAdjustment),
                [namespaceMetadataTransaction.toAggregate(account.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction).then((transaction: AggregateTransaction) => {
                transaction.innerTransactions.forEach((innerTx) => {
                    expect((innerTx as NamespaceMetadataTransaction).targetAddress, 'TargetAddress').not.to.be.undefined;
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
                Deadline.create(helper.epochAdjustment),
                mosaicId,
                UInt64.fromUint(60641),
                UInt64.fromUint(0),
                MosaicRestrictionType.NONE,
                UInt64.fromUint(0),
                MosaicRestrictionType.GE,
                networkType,
                undefined,
                helper.maxFee,
            );
            const signedTransaction = mosaicGlobalRestrictionTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });
    describe('MosaicGlobalRestrictionTransaction', () => {
        it('aggregate', () => {
            const mosaicGlobalRestrictionTransaction = MosaicGlobalRestrictionTransaction.create(
                Deadline.create(helper.epochAdjustment),
                mosaicId,
                UInt64.fromUint(60641),
                UInt64.fromUint(0),
                MosaicRestrictionType.GE,
                UInt64.fromUint(1),
                MosaicRestrictionType.GE,
                networkType,
                undefined,
                helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(helper.epochAdjustment),
                [mosaicGlobalRestrictionTransaction.toAggregate(account.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('MosaicAddressRestrictionTransaction', () => {
        it('aggregate', () => {
            const mosaicAddressRestrictionTransaction = MosaicAddressRestrictionTransaction.create(
                Deadline.create(helper.epochAdjustment),
                mosaicId,
                UInt64.fromUint(60641),
                account3.address,
                UInt64.fromUint(2),
                networkType,
                undefined,
                helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(helper.epochAdjustment),
                [mosaicAddressRestrictionTransaction.toAggregate(account.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('TransferTransaction', () => {
        it('standalone', () => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(helper.epochAdjustment),
                account2.address,
                [helper.createCurrency(1, false)],
                PlainMessage.create('test-message'),
                networkType,
                helper.maxFee,
            );
            const signedTransaction = transferTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });
    describe('TransferTransaction', () => {
        it('aggregate', () => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(helper.epochAdjustment),
                account2.address,
                [helper.createCurrency(1, false)],
                PlainMessage.create('test-message'),
                networkType,
                helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(helper.epochAdjustment),
                [transferTransaction.toAggregate(account.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });
    describe('AccountRestrictionTransaction - Outgoing Address', () => {
        it('standalone', () => {
            const addressModification = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
                Deadline.create(helper.epochAdjustment),
                AddressRestrictionFlag.BlockOutgoingAddress,
                [account3.address],
                [],
                networkType,
                helper.maxFee,
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
                Deadline.create(helper.epochAdjustment),
                AddressRestrictionFlag.BlockOutgoingAddress,
                [],
                [account3.address],
                networkType,
                helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(helper.epochAdjustment),
                [addressModification.toAggregate(account.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('AccountRestrictionTransaction - Incoming Address', () => {
        it('standalone', () => {
            const addressModification = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
                Deadline.create(helper.epochAdjustment),
                AddressRestrictionFlag.BlockIncomingAddress,
                [account3.address],
                [],
                networkType,
                helper.maxFee,
            );
            const signedTransaction = addressModification.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });
    describe('AccountRestrictionTransaction - Incoming Address', () => {
        it('aggregate', () => {
            const addressModification = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
                Deadline.create(helper.epochAdjustment),
                AddressRestrictionFlag.BlockIncomingAddress,
                [],
                [account3.address],
                networkType,
                helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(helper.epochAdjustment),
                [addressModification.toAggregate(account.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });
    describe('AccountRestrictionTransaction - Mosaic', () => {
        it('standalone', () => {
            AccountRestrictionModification.createForMosaic(AccountRestrictionModificationAction.Add, mosaicId);
            const addressModification = AccountRestrictionTransaction.createMosaicRestrictionModificationTransaction(
                Deadline.create(helper.epochAdjustment),
                MosaicRestrictionFlag.BlockMosaic,
                [mosaicId],
                [],
                networkType,
                helper.maxFee,
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
                Deadline.create(helper.epochAdjustment),
                MosaicRestrictionFlag.BlockMosaic,
                [],
                [mosaicId],
                networkType,
                helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(helper.epochAdjustment),
                [addressModification.toAggregate(account.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('AccountRestrictionTransaction - Outgoing Operation', () => {
        it('standalone', () => {
            AccountRestrictionModification.createForOperation(AccountRestrictionModificationAction.Add, TransactionType.ACCOUNT_KEY_LINK);
            const addressModification = AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(
                Deadline.create(helper.epochAdjustment),
                OperationRestrictionFlag.BlockOutgoingTransactionType,
                [TransactionType.ACCOUNT_KEY_LINK],
                [],
                networkType,
                helper.maxFee,
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
                Deadline.create(helper.epochAdjustment),
                OperationRestrictionFlag.BlockOutgoingTransactionType,
                [],
                [TransactionType.ACCOUNT_KEY_LINK],
                networkType,
                helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(helper.epochAdjustment),
                [addressModification.toAggregate(account3.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(account3, generationHash);
            return helper.announce(signedTransaction);
        });
    });

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

            return helper.announce(signedTransaction).then((transaction: AccountKeyLinkTransaction) => {
                expect(transaction.linkedPublicKey, 'linkedPublicKey').not.to.be.undefined;
                expect(transaction.linkAction, 'LinkAction').not.to.be.undefined;
                return signedTransaction;
            });
        });
    });
    describe('AccountKeyLinkTransaction', () => {
        it('aggregate', () => {
            const accountLinkTransaction = AccountKeyLinkTransaction.create(
                Deadline.create(helper.epochAdjustment),
                remoteAccount.publicKey,
                LinkAction.Unlink,
                networkType,
                helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(helper.epochAdjustment),
                [accountLinkTransaction.toAggregate(account.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('VrfKeyLinkTransaction', () => {
        it('standalone', () => {
            const vrfKeyLinkTransaction = VrfKeyLinkTransaction.create(
                Deadline.create(helper.epochAdjustment),
                harvestingAccount.publicKey,
                LinkAction.Link,
                networkType,
                helper.maxFee,
            );
            const signedTransaction = vrfKeyLinkTransaction.signWith(account, generationHash);

            return helper.announce(signedTransaction).then((transaction: VrfKeyLinkTransaction) => {
                expect(transaction.linkedPublicKey, 'LinkedPublicKey').not.to.be.undefined;
                expect(transaction.linkAction, 'LinkAction').not.to.be.undefined;
                return signedTransaction;
            });
        });
    });
    describe('VrfKeyLinkTransaction', () => {
        it('aggregate', () => {
            const vrfKeyLinkTransaction = VrfKeyLinkTransaction.create(
                Deadline.create(helper.epochAdjustment),
                harvestingAccount.publicKey,
                LinkAction.Unlink,
                networkType,
                helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(helper.epochAdjustment),
                [vrfKeyLinkTransaction.toAggregate(account.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('NodeKeyLinkTransaction', () => {
        it('standalone', () => {
            const nodeKeyLinkTransaction = NodeKeyLinkTransaction.create(
                Deadline.create(helper.epochAdjustment),
                harvestingAccount.publicKey,
                LinkAction.Link,
                networkType,
                helper.maxFee,
            );
            const signedTransaction = nodeKeyLinkTransaction.signWith(account, generationHash);

            return helper.announce(signedTransaction).then((transaction: NodeKeyLinkTransaction) => {
                expect(transaction.linkedPublicKey, 'LinkedPublicKey').not.to.be.undefined;
                expect(transaction.linkAction, 'LinkAction').not.to.be.undefined;
                return signedTransaction;
            });
        });
    });
    describe('NodeKeyLinkTransaction', () => {
        it('aggregate', () => {
            const nodeKeyLinkTransaction = NodeKeyLinkTransaction.create(
                Deadline.create(helper.epochAdjustment),
                harvestingAccount.publicKey,
                LinkAction.Unlink,
                networkType,
                helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(helper.epochAdjustment),
                [nodeKeyLinkTransaction.toAggregate(account.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('VotingKeyLinkTransaction', () => {
        it('standalone', () => {
            const votingLinkTransaction = VotingKeyLinkTransaction.create(
                Deadline.create(helper.epochAdjustment),
                votingKey,
                100,
                300,
                LinkAction.Link,
                networkType,
                helper.maxFee,
            );
            const signedTransaction = votingLinkTransaction.signWith(account, generationHash);

            return helper.announce(signedTransaction).then((transaction: VotingKeyLinkTransaction) => {
                expect(transaction.linkedPublicKey, 'LinkedPublicKey').not.to.be.undefined;
                expect(transaction.startEpoch, 'startEpoch').not.to.be.undefined;
                expect(transaction.endEpoch, 'endEpoch').not.to.be.undefined;
                expect(transaction.linkAction, 'LinkAction').not.to.be.undefined;
                return signedTransaction;
            });
        });
    });
    describe('VotingKeyLinkTransaction', () => {
        it('aggregate', () => {
            const votingLinkTransaction = VotingKeyLinkTransaction.create(
                Deadline.create(helper.epochAdjustment),
                votingKey,
                100,
                300,
                LinkAction.Unlink,
                networkType,
                helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(helper.epochAdjustment),
                [votingLinkTransaction.toAggregate(account.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('AddressAliasTransaction', () => {
        it('standalone', () => {
            const addressAliasTransaction = AddressAliasTransaction.create(
                Deadline.create(helper.epochAdjustment),
                AliasAction.Link,
                addressAlias,
                account.address,
                networkType,
                helper.maxFee,
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
                Deadline.create(helper.epochAdjustment),
                addressAlias,
                [helper.createCurrency(1, false)],
                PlainMessage.create('test-message'),
                networkType,
                helper.maxFee,
            );
            const signedTransaction = transferTransaction.signWith(account, generationHash);

            return helper.announce(signedTransaction);
        });
    });

    describe('AddressAliasTransaction', () => {
        it('aggregate', () => {
            const addressAliasTransaction = AddressAliasTransaction.create(
                Deadline.create(helper.epochAdjustment),
                AliasAction.Unlink,
                addressAlias,
                account.address,
                networkType,
                helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(helper.epochAdjustment),
                [addressAliasTransaction.toAggregate(account.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('MosaicSupplyChangeTransaction', () => {
        it('standalone', () => {
            const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
                Deadline.create(helper.epochAdjustment),
                mosaicId,
                MosaicSupplyChangeAction.Increase,
                UInt64.fromUint(10),
                networkType,
                helper.maxFee,
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
                Deadline.create(helper.epochAdjustment),
                mosaicId,
                MosaicSupplyChangeAction.Increase,
                UInt64.fromUint(10),
                networkType,
                helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(helper.epochAdjustment),
                [mosaicSupplyChangeTransaction.toAggregate(account.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('MosaicAliasTransaction', () => {
        it('standalone', () => {
            const mosaicAliasTransaction = MosaicAliasTransaction.create(
                Deadline.create(helper.epochAdjustment),
                AliasAction.Link,
                mosaicAlias,
                mosaicId,
                networkType,
                helper.maxFee,
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
                Deadline.create(helper.epochAdjustment),
                [],
                networkType,
                [],
                helper.maxFee,
            );
            const signedTransaction = account.sign(aggregateTransaction, generationHash);
            const hashLockTransaction = HashLockTransaction.create(
                Deadline.create(helper.epochAdjustment),
                helper.networkCurrency.createRelative(10),
                UInt64.fromUint(10000),
                signedTransaction,
                networkType,
                helper.maxFee,
            );
            const hashLockSignedTransaction = hashLockTransaction.signWith(account, generationHash);
            return helper.announce(hashLockSignedTransaction);
        });
    });

    describe('MosaicAliasTransaction', () => {
        it('aggregate', () => {
            const mosaicAliasTransaction = MosaicAliasTransaction.create(
                Deadline.create(helper.epochAdjustment),
                AliasAction.Unlink,
                mosaicAlias,
                mosaicId,
                networkType,
                helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(helper.epochAdjustment),
                [mosaicAliasTransaction.toAggregate(account.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('LockFundsTransaction', () => {
        it('standalone', () => {
            const aggregateTransaction = AggregateTransaction.createBonded(
                Deadline.create(helper.epochAdjustment),
                [],
                networkType,
                [],
                helper.maxFee,
            );
            const signedTransaction = account.sign(aggregateTransaction, generationHash);
            const lockFundsTransaction = LockFundsTransaction.create(
                Deadline.create(helper.epochAdjustment),
                new Mosaic(networkNetworkCurrencyLocalId, UInt64.fromUint(10 * Math.pow(10, helper.networkCurrency.divisibility))),
                UInt64.fromUint(10000),
                signedTransaction,
                networkType,
                helper.maxFee,
            );

            return helper.announce(lockFundsTransaction.signWith(account, generationHash));
        });
    });
    describe('LockFundsTransaction', () => {
        it('aggregate', () => {
            const aggregateTransaction = AggregateTransaction.createBonded(
                Deadline.create(helper.epochAdjustment),
                [],
                networkType,
                [],
                helper.maxFee,
            );
            const signedTransaction = account.sign(aggregateTransaction, generationHash);
            const lockFundsTransaction = LockFundsTransaction.create(
                Deadline.create(helper.epochAdjustment),
                new Mosaic(networkNetworkCurrencyLocalId, UInt64.fromUint(10 * Math.pow(10, helper.networkCurrency.divisibility))),
                UInt64.fromUint(10),
                signedTransaction,
                networkType,
                helper.maxFee,
            );
            const aggregateLockFundsTransaction = AggregateTransaction.createComplete(
                Deadline.create(helper.epochAdjustment),
                [lockFundsTransaction.toAggregate(account.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );
            return helper.announce(aggregateLockFundsTransaction.signWith(account, generationHash));
        });
    });

    describe('Aggregate Complete Transaction', () => {
        it('should announce aggregated complete transaction', () => {
            const tx = TransferTransaction.create(
                Deadline.create(helper.epochAdjustment),
                account2.address,
                [],
                PlainMessage.create('Hi'),
                networkType,
                helper.maxFee,
            );
            const aggTx = AggregateTransaction.createComplete(
                Deadline.create(helper.epochAdjustment),
                [tx.toAggregate(account.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );
            const signedTransaction = account.sign(aggTx, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('SecretLockTransaction', () => {
        it('standalone', () => {
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(helper.epochAdjustment),
                helper.createCurrency(10, false),
                UInt64.fromUint(100),
                LockHashAlgorithm.Op_Sha3_256,
                sha3_256.create().update(Crypto.randomBytes(20)).hex(),
                account2.address,
                networkType,
                helper.maxFee,
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
                Deadline.create(helper.epochAdjustment),
                helper.createCurrency(10, false),
                UInt64.fromUint(100),
                LockHashAlgorithm.Op_Sha3_256,
                sha3_256.create().update(Crypto.randomBytes(20)).hex(),
                account2.address,
                networkType,
                helper.maxFee,
            );
            const aggregateSecretLockTransaction = AggregateTransaction.createComplete(
                Deadline.create(helper.epochAdjustment),
                [secretLockTransaction.toAggregate(account.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );
            return helper.announce(aggregateSecretLockTransaction.signWith(account, generationHash));
        });
    });

    describe('HashType: Op_Hash_160', () => {
        it('standalone', () => {
            const secretSeed = String.fromCharCode.apply(null, Crypto.randomBytes(20));
            const secret = CryptoJS.RIPEMD160(CryptoJS.SHA256(secretSeed).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex);
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(helper.epochAdjustment),
                helper.createCurrency(10, false),
                UInt64.fromUint(100),
                LockHashAlgorithm.Op_Hash_160,
                secret,
                account2.address,
                networkType,
                helper.maxFee,
            );
            return helper.announce(secretLockTransaction.signWith(account, generationHash));
        });
    });
    describe('HashType: Op_Hash_160', () => {
        it('aggregate', () => {
            const secretSeed = String.fromCharCode.apply(null, Crypto.randomBytes(20));
            const secret = CryptoJS.RIPEMD160(CryptoJS.SHA256(secretSeed).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex);
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(helper.epochAdjustment),
                helper.createCurrency(10, false),
                UInt64.fromUint(100),
                LockHashAlgorithm.Op_Hash_160,
                secret,
                account2.address,
                networkType,
                helper.maxFee,
            );
            const aggregateSecretLockTransaction = AggregateTransaction.createComplete(
                Deadline.create(helper.epochAdjustment),
                [secretLockTransaction.toAggregate(account.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );
            return helper.announce(aggregateSecretLockTransaction.signWith(account, generationHash));
        });
    });
    describe('HashType: Op_Hash_256', () => {
        it('standalone', () => {
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(helper.epochAdjustment),
                helper.createCurrency(10, false),
                UInt64.fromUint(100),
                LockHashAlgorithm.Op_Hash_256,
                sha3_256.create().update(Crypto.randomBytes(20)).hex(),
                account2.address,
                networkType,
                helper.maxFee,
            );
            return helper.announce(secretLockTransaction.signWith(account, generationHash));
        });
    });
    describe('HashType: Op_Hash_256', () => {
        it('aggregate', () => {
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(helper.epochAdjustment),
                helper.createCurrency(10, false),
                UInt64.fromUint(100),
                LockHashAlgorithm.Op_Hash_256,
                sha3_256.create().update(Crypto.randomBytes(20)).hex(),
                account2.address,
                networkType,
                helper.maxFee,
            );
            const aggregateSecretLockTransaction = AggregateTransaction.createComplete(
                Deadline.create(helper.epochAdjustment),
                [secretLockTransaction.toAggregate(account.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );

            return helper.announce(aggregateSecretLockTransaction.signWith(account, generationHash));
        });
    });
    describe('SecretProofTransaction - HashType: Op_Sha3_256', () => {
        it('standalone', () => {
            const secretSeed = Crypto.randomBytes(20);
            const secret = LockHashUtils.Op_Sha3_256(secretSeed);
            const proof = convert.uint8ToHex(secretSeed);

            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(helper.epochAdjustment, 1, ChronoUnit.HOURS),
                helper.createCurrency(10, false),
                UInt64.fromUint(11),
                LockHashAlgorithm.Op_Sha3_256,
                secret,
                account2.address,
                networkType,
                helper.maxFee,
            );

            const signedSecretLockTx = secretLockTransaction.signWith(account, generationHash);

            return helper.announce(signedSecretLockTx).then(() => {
                const secretProofTransaction = SecretProofTransaction.create(
                    Deadline.create(helper.epochAdjustment),
                    LockHashAlgorithm.Op_Sha3_256,
                    secret,
                    account2.address,
                    proof,
                    networkType,
                    helper.maxFee,
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
                Deadline.create(helper.epochAdjustment),
                helper.createCurrency(10, false),
                UInt64.fromUint(100),
                LockHashAlgorithm.Op_Sha3_256,
                secret,
                account2.address,
                networkType,
                helper.maxFee,
            );

            return helper.announce(secretLockTransaction.signWith(account, generationHash)).then(() => {
                const secretProofTransaction = SecretProofTransaction.create(
                    Deadline.create(helper.epochAdjustment),
                    LockHashAlgorithm.Op_Sha3_256,
                    secret,
                    account2.address,
                    proof,
                    networkType,
                    helper.maxFee,
                );
                const aggregateSecretProofTransaction = AggregateTransaction.createComplete(
                    Deadline.create(helper.epochAdjustment),
                    [secretProofTransaction.toAggregate(account2.publicAccount)],
                    networkType,
                    [],
                    helper.maxFee,
                );
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
                Deadline.create(helper.epochAdjustment),
                helper.createCurrency(10, false),
                UInt64.fromUint(100),
                LockHashAlgorithm.Op_Hash_160,
                secret,
                account2.address,
                networkType,
                helper.maxFee,
            );

            return helper.announce(secretLockTransaction.signWith(account, generationHash)).then(() => {
                const secretProofTransaction = SecretProofTransaction.create(
                    Deadline.create(helper.epochAdjustment),
                    LockHashAlgorithm.Op_Hash_160,
                    secret,
                    account2.address,
                    proof,
                    networkType,
                    helper.maxFee,
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
                Deadline.create(helper.epochAdjustment),
                helper.createCurrency(10, false),
                UInt64.fromUint(100),
                LockHashAlgorithm.Op_Hash_160,
                secret,
                account2.address,
                networkType,
                helper.maxFee,
            );
            const secretProofTransaction = SecretProofTransaction.create(
                Deadline.create(helper.epochAdjustment),
                LockHashAlgorithm.Op_Hash_160,
                secret,
                account2.address,
                proof,
                networkType,
                helper.maxFee,
            );
            const aggregateSecretProofTransaction = AggregateTransaction.createComplete(
                Deadline.create(helper.epochAdjustment),
                [secretProofTransaction.toAggregate(account2.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );

            return helper
                .announce(secretLockTransaction.signWith(account, generationHash))
                .then(() => helper.announce(aggregateSecretProofTransaction.signWith(account2, generationHash)));
        });
    });
    describe('SecretProofTransaction - HashType: Op_Hash_256', () => {
        it('standalone', () => {
            const randomBytes = secureRandom.randomBuffer(32);
            const secretSeed = randomBytes.toString('hex');
            // const secret = sha256(Buffer.from(hash, 'hex'));
            const secret = LockHashUtils.Op_Hash_256(randomBytes);
            const proof = secretSeed;
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(helper.epochAdjustment),
                helper.createCurrency(1, false),
                UInt64.fromUint(100),
                LockHashAlgorithm.Op_Hash_256,
                secret,
                account2.address,
                networkType,
                helper.maxFee,
            );

            const secretProofTransaction = SecretProofTransaction.create(
                Deadline.create(helper.epochAdjustment),
                LockHashAlgorithm.Op_Hash_256,
                secret,
                account2.address,
                proof,
                networkType,
                helper.maxFee,
            );

            return helper
                .announce(secretLockTransaction.signWith(account, generationHash))
                .then(() => helper.announce(secretProofTransaction.signWith(account2, generationHash)));
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
                Deadline.create(helper.epochAdjustment),
                helper.createCurrency(10, false),
                UInt64.fromUint(100),
                LockHashAlgorithm.Op_Hash_256,
                secret,
                account2.address,
                networkType,
                helper.maxFee,
            );
            const secretProofTransaction = SecretProofTransaction.create(
                Deadline.create(helper.epochAdjustment),
                LockHashAlgorithm.Op_Hash_256,
                secret,
                account2.address,
                proof,
                networkType,
                helper.maxFee,
            );
            const aggregateSecretProofTransaction = AggregateTransaction.createComplete(
                Deadline.create(helper.epochAdjustment),
                [secretProofTransaction.toAggregate(account2.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );
            return helper
                .announce(secretLockTransaction.signWith(account, generationHash))
                .then(() => helper.announce(aggregateSecretProofTransaction.signWith(account2, generationHash)));
        });
    });

    describe('SignTransactionGivenSignatures', () => {
        it('Announce cosign signatures given', () => {
            /**
             * @see https://github.com/nemtech/symbol-sdk-typescript-javascript/issues/112
             */
            // AliceAccount: account
            // BobAccount: account

            const sendAmount = helper.createCurrency(1000);
            const backAmount = helper.createCurrency(1);

            const aliceTransferTransaction = TransferTransaction.create(
                Deadline.create(helper.epochAdjustment),
                account2.address,
                [sendAmount],
                PlainMessage.create('payout'),
                networkType,
                helper.maxFee,
            );
            const bobTransferTransaction = TransferTransaction.create(
                Deadline.create(helper.epochAdjustment),
                account.address,
                [backAmount],
                PlainMessage.create('payout'),
                networkType,
                helper.maxFee,
            );

            // 01. Alice creates the aggregated tx and sign it. Then payload send to Bob
            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(helper.epochAdjustment),
                [aliceTransferTransaction.toAggregate(account.publicAccount), bobTransferTransaction.toAggregate(account2.publicAccount)],
                networkType,
                [],
                helper.maxFee,
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

    describe('getTransaction', () => {
        it('should return transaction info given transactionHash', async () => {
            const transaction = await transactionRepository.getTransaction(transactionHash, TransactionGroup.Confirmed).toPromise();
            expect(transaction.transactionInfo!.hash).to.be.equal(transactionHash);
            transactionId = transaction.transactionInfo?.id!;
        });

        it('should return transaction info given transactionId', async () => {
            const transaction = await transactionRepository.getTransaction(transactionId, TransactionGroup.Confirmed).toPromise();
            expect(transaction.transactionInfo!.hash).to.be.equal(transactionHash);
            expect(transaction.transactionInfo!.id).to.be.equal(transactionId);
        });
    });

    describe('getTransactionsById', () => {
        it('should return transaction info given array of transactionHash', async () => {
            const transactions = await transactionRepository.getTransactionsById([transactionHash], TransactionGroup.Confirmed).toPromise();
            expect(transactions[0].transactionInfo!.hash).to.be.equal(transactionHash);
            expect(transactions[0].transactionInfo!.id).to.be.equal(transactionId);
        });

        it('should return transaction info given array of transactionId', async () => {
            const transactions = await transactionRepository.getTransactionsById([transactionId], TransactionGroup.Confirmed).toPromise();
            expect(transactions[0].transactionInfo!.hash).to.be.equal(transactionHash);
            expect(transactions[0].transactionInfo!.id).to.be.equal(transactionId);
        });
    });

    describe('getTransactionStatus', () => {
        it('should return transaction status given transactionHash', async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const transactionStatus = await transactionStatusRepository.getTransactionStatus(transactionHash).toPromise();
            expect(transactionStatus.group).to.be.equal('confirmed');
            expect(transactionStatus.height!.lower).to.be.greaterThan(0);
            expect(transactionStatus.height!.higher).to.be.equal(0);
        });
    });

    describe('getTransactionsStatuses', () => {
        it('should return transaction status given array of transactionHash', async () => {
            const transactionStatuses = await transactionStatusRepository.getTransactionStatuses([transactionHash]).toPromise();
            expect(transactionStatuses[0].group).to.be.equal('confirmed');
            expect(transactionStatuses[0].height!.lower).to.be.greaterThan(0);
            expect(transactionStatuses[0].height!.higher).to.be.equal(0);
        });
    });

    describe('announce', () => {
        it('should return success when announce', async () => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(helper.epochAdjustment),
                account2.address,
                [helper.createCurrency(1, false)],
                PlainMessage.create('test-message'),
                networkType,
                helper.maxFee,
            );
            const signedTransaction = transferTransaction.signWith(account, generationHash);
            const transactionAnnounceResponse = await transactionRepository.announce(signedTransaction).toPromise();
            expect(transactionAnnounceResponse.message).to.be.equal('packet 9 was pushed to the network via /transactions');
        });
    });

    describe('announceAggregateBonded', () => {
        it('should return success when announceAggregateBonded', async () => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(helper.epochAdjustment),
                account2.address,
                [helper.createCurrency(1)],
                PlainMessage.create('test-message'),
                networkType,
                helper.maxFee,
            );
            const aggregateTransaction = AggregateTransaction.createBonded(
                Deadline.create(helper.epochAdjustment, 2, ChronoUnit.MINUTES),
                [transferTransaction.toAggregate(multisigAccount.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(cosignAccount1, generationHash);
            const transactionAnnounceResponse = await transactionRepository.announceAggregateBonded(signedTransaction).toPromise();
            expect(transactionAnnounceResponse.message).to.be.equal('packet 256 was pushed to the network via /transactions/partial');
        });
    });

    describe('announceAggregateBondedCosignature', () => {
        it('should return success when announceAggregateBondedCosignature', async () => {
            const payload = new CosignatureSignedTransaction('', '', '');
            const transactionAnnounceResponse = await transactionRepository.announceAggregateBondedCosignature(payload).toPromise();
            expect(transactionAnnounceResponse.message).to.be.equal('packet 257 was pushed to the network via /transactions/cosignature');
        });
    });

    describe('getTransactionEffectiveFee', () => {
        it('should return effective paid fee given transactionHash', async () => {
            const effectiveFee = await transactionRepository.getTransactionEffectiveFee(transactionHash).toPromise();
            expect(effectiveFee).to.not.be.undefined;
            expect(effectiveFee).not.to.be.equal(0);
        });
    });

    describe('searchTransactions', () => {
        it('should return transaction info given address', async () => {
            const transactions = await transactionRepository
                .search({ group: TransactionGroup.Confirmed, address: account.address } as TransactionSearchCriteria)
                .toPromise();
            expect(transactions.data.length).to.be.greaterThan(0);
        });
        it('should return transaction info given height all types', async () => {
            const transactions = await transactionRepository
                .search({ group: TransactionGroup.Confirmed, height: UInt64.fromUint(1) } as TransactionSearchCriteria)
                .toPromise();

            const mosaicDefinitions = transactions.data.filter((t) => t.type == TransactionType.MOSAIC_DEFINITION).length;
            const namespaceRegistration = transactions.data.filter((t) => t.type == TransactionType.NAMESPACE_REGISTRATION).length;
            const others = transactions.data.filter(
                (t) => t.type !== TransactionType.NAMESPACE_REGISTRATION && t.type !== TransactionType.MOSAIC_DEFINITION,
            ).length;
            expect(mosaicDefinitions).to.be.greaterThan(0);
            expect(namespaceRegistration).to.be.greaterThan(0);
            expect(others).to.be.greaterThan(0);
        });

        it('should return transaction info given height and namesapce, mosaic types', async () => {
            const transactions = await transactionRepository
                .search({
                    group: TransactionGroup.Confirmed,
                    height: UInt64.fromUint(1),
                    type: [TransactionType.MOSAIC_DEFINITION, TransactionType.NAMESPACE_REGISTRATION],
                } as TransactionSearchCriteria)
                .toPromise();
            const mosaicDefinitions = transactions.data.filter((t) => t.type == TransactionType.MOSAIC_DEFINITION).length;
            const namespaceRegistration = transactions.data.filter((t) => t.type == TransactionType.NAMESPACE_REGISTRATION).length;
            const others = transactions.data.filter(
                (t) => t.type !== TransactionType.NAMESPACE_REGISTRATION && t.type !== TransactionType.MOSAIC_DEFINITION,
            ).length;
            expect(mosaicDefinitions).to.be.greaterThan(0);
            expect(namespaceRegistration).to.be.greaterThan(0);
            expect(others).to.eq(0);
        });
    });

    describe('searchTransactions using steamer', () => {
        it('should return transaction info given address', async () => {
            const streamer = new TransactionPaginationStreamer(transactionRepository);
            const transactionsNoStreamer = await transactionRepository
                .search({ group: TransactionGroup.Confirmed, address: account.address, pageSize: 10 } as TransactionSearchCriteria)
                .toPromise();
            const transactions = await streamer
                .search({ group: TransactionGroup.Confirmed, address: account.address, pageSize: 10 })
                .pipe(take(10), toArray())
                .toPromise();
            expect(transactions.length).to.be.greaterThan(0);
            deepEqual(transactionsNoStreamer.data, transactions);
        });
    });
});
