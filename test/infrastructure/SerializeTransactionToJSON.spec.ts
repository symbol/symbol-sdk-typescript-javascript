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
import { sha3_256 } from 'js-sha3';
import { Crypto } from '../../src/core/crypto';
import { Convert as convert, Convert } from '../../src/core/format';
import { Account } from '../../src/model/account/Account';
import { Address } from '../../src/model/account/Address';
import { PlainMessage } from '../../src/model/message/PlainMessage';
import { MosaicFlags } from '../../src/model/mosaic/MosaicFlags';
import { MosaicId } from '../../src/model/mosaic/MosaicId';
import { MosaicNonce } from '../../src/model/mosaic/MosaicNonce';
import { MosaicSupplyChangeAction } from '../../src/model/mosaic/MosaicSupplyChangeAction';
import { NetworkCurrencyLocal } from '../../src/model/mosaic/NetworkCurrencyLocal';
import { AliasAction } from '../../src/model/namespace/AliasAction';
import { NamespaceId } from '../../src/model/namespace/NamespaceId';
import { NetworkType } from '../../src/model/network/NetworkType';
import { AddressRestrictionFlag } from '../../src/model/restriction/AddressRestrictionFlag';
import { MosaicRestrictionFlag } from '../../src/model/restriction/MosaicRestrictionFlag';
import { OperationRestrictionFlag } from '../../src/model/restriction/OperationRestrictionFlag';
import { AccountKeyLinkTransaction } from '../../src/model/transaction/AccountKeyLinkTransaction';
import { AccountRestrictionTransaction } from '../../src/model/transaction/AccountRestrictionTransaction';
import { AddressAliasTransaction } from '../../src/model/transaction/AddressAliasTransaction';
import { AggregateTransaction } from '../../src/model/transaction/AggregateTransaction';
import { Deadline } from '../../src/model/transaction/Deadline';
import { LinkAction } from '../../src/model/transaction/LinkAction';
import { LockFundsTransaction } from '../../src/model/transaction/LockFundsTransaction';
import { LockHashAlgorithm } from '../../src/model/lock/LockHashAlgorithm';
import { MosaicAliasTransaction } from '../../src/model/transaction/MosaicAliasTransaction';
import { MosaicDefinitionTransaction } from '../../src/model/transaction/MosaicDefinitionTransaction';
import { MosaicSupplyChangeTransaction } from '../../src/model/transaction/MosaicSupplyChangeTransaction';
import { MultisigAccountModificationTransaction } from '../../src/model/transaction/MultisigAccountModificationTransaction';
import { NamespaceRegistrationTransaction } from '../../src/model/transaction/NamespaceRegistrationTransaction';
import { NodeKeyLinkTransaction } from '../../src/model/transaction/NodeKeyLinkTransaction';
import { SecretLockTransaction } from '../../src/model/transaction/SecretLockTransaction';
import { SecretProofTransaction } from '../../src/model/transaction/SecretProofTransaction';
import { TransactionType } from '../../src/model/transaction/TransactionType';
import { TransferTransaction } from '../../src/model/transaction/TransferTransaction';
import { VotingKeyLinkTransaction } from '../../src/model/transaction/VotingKeyLinkTransaction';
import { VrfKeyLinkTransaction } from '../../src/model/transaction/VrfKeyLinkTransaction';
import { UInt64 } from '../../src/model/UInt64';
import { TestingAccount } from '../conf/conf.spec';

describe('SerializeTransactionToJSON', () => {
    let account: Account;
    const epochAdjustment = 1573430400;
    before(() => {
        account = TestingAccount;
    });

    it('should create AccountKeyLinkTransaction', () => {
        const accountLinkTransaction = AccountKeyLinkTransaction.create(
            Deadline.create(epochAdjustment),
            account.publicKey,
            LinkAction.Link,
            NetworkType.PRIVATE_TEST,
        );

        const json = accountLinkTransaction.toJSON();

        expect(json.transaction.linkedPublicKey).to.be.equal(account.publicKey);
        expect(json.transaction.linkAction).to.be.equal(LinkAction.Link);
    });

    it('should create AccountRestrictionAddressTransaction', () => {
        const address = Address.createFromRawAddress('SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMQ');
        const addressRestrictionTransaction = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
            Deadline.create(epochAdjustment),
            AddressRestrictionFlag.AllowIncomingAddress,
            [address],
            [],
            NetworkType.PRIVATE_TEST,
        );

        const json = addressRestrictionTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.ACCOUNT_ADDRESS_RESTRICTION);
        expect(json.transaction.restrictionFlags).to.be.equal(AddressRestrictionFlag.AllowIncomingAddress);
        expect(json.transaction.restrictionAdditions.length).to.be.equal(1);
    });

    it('should create AccountRestrictionMosaicTransaction', () => {
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicRestrictionTransaction = AccountRestrictionTransaction.createMosaicRestrictionModificationTransaction(
            Deadline.create(epochAdjustment),
            MosaicRestrictionFlag.AllowMosaic,
            [mosaicId],
            [],
            NetworkType.PRIVATE_TEST,
        );

        const json = mosaicRestrictionTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.ACCOUNT_MOSAIC_RESTRICTION);
        expect(json.transaction.restrictionFlags).to.be.equal(MosaicRestrictionFlag.AllowMosaic);
        expect(json.transaction.restrictionAdditions.length).to.be.equal(1);
    });

    it('should create AccountRestrictionOperationTransaction', () => {
        const operation = TransactionType.ADDRESS_ALIAS;
        const operationRestrictionTransaction = AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(
            Deadline.create(epochAdjustment),
            OperationRestrictionFlag.AllowOutgoingTransactionType,
            [operation],
            [],
            NetworkType.PRIVATE_TEST,
        );

        const json = operationRestrictionTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.ACCOUNT_OPERATION_RESTRICTION);
        expect(json.transaction.restrictionFlags).to.be.equal(OperationRestrictionFlag.AllowOutgoingTransactionType);
        expect(json.transaction.restrictionAdditions.length).to.be.equal(1);
    });

    it('should create AddressAliasTransaction', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const address = Address.createFromRawAddress('SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMQ');
        const addressAliasTransaction = AddressAliasTransaction.create(
            Deadline.create(epochAdjustment),
            AliasAction.Link,
            namespaceId,
            address,
            NetworkType.PRIVATE_TEST,
        );

        const json = addressAliasTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.ADDRESS_ALIAS);
        expect(json.transaction.aliasAction).to.be.equal(AliasAction.Link);
    });

    it('should create MosaicAliasTransaction', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicAliasTransaction = MosaicAliasTransaction.create(
            Deadline.create(epochAdjustment),
            AliasAction.Link,
            namespaceId,
            mosaicId,
            NetworkType.PRIVATE_TEST,
        );
        const json = mosaicAliasTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.MOSAIC_ALIAS);
        expect(json.transaction.aliasAction).to.be.equal(AliasAction.Link);
    });

    it('should create MosaicDefinitionTransaction', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(epochAdjustment),
            MosaicNonce.createFromUint8Array(new Uint8Array([0xe6, 0xde, 0x84, 0xb8])), // nonce
            new MosaicId(UInt64.fromUint(1).toDTO()), // ID
            MosaicFlags.create(true, true, true),
            5,
            UInt64.fromUint(1000),
            NetworkType.PRIVATE_TEST,
        );

        const json = mosaicDefinitionTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.MOSAIC_DEFINITION);
        expect(json.transaction.flags).to.be.equal(7);
        expect(json.transaction.divisibility).to.be.equal(5);
        expect(json.transaction.duration).to.be.equal('1000');
    });

    it('should create MosaicDefinitionTransaction without duration', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(epochAdjustment),
            MosaicNonce.createFromUint8Array(new Uint8Array([0xe6, 0xde, 0x84, 0xb8])), // nonce
            new MosaicId(UInt64.fromUint(1).toDTO()), // ID
            MosaicFlags.create(true, false),
            3,
            UInt64.fromUint(0),
            NetworkType.PRIVATE_TEST,
        );

        const json = mosaicDefinitionTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.MOSAIC_DEFINITION);
        expect(json.transaction.divisibility).to.be.equal(3);
        expect(json.transaction.flags).to.be.equal(1);
    });

    it('should create MosaicSupplyChangeTransaction', () => {
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
            Deadline.create(epochAdjustment),
            mosaicId,
            MosaicSupplyChangeAction.Increase,
            UInt64.fromUint(10),
            NetworkType.PRIVATE_TEST,
        );

        const json = mosaicSupplyChangeTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.MOSAIC_SUPPLY_CHANGE);
        expect(json.transaction.action).to.be.equal(MosaicSupplyChangeAction.Increase);
    });

    it('should create TransferTransaction', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            Address.createFromRawAddress('SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMQ'),
            [NetworkCurrencyLocal.createRelative(100)],
            PlainMessage.create('test-message'),
            NetworkType.PRIVATE_TEST,
        );

        const json = transferTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.TRANSFER);
        expect(json.transaction.message).to.be.equal('00746573742D6D657373616765');
    });

    it('should create SecretLockTransaction', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const recipientAddress = Address.createFromRawAddress('SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMQ');
        const secretLockTransaction = SecretLockTransaction.create(
            Deadline.create(epochAdjustment),
            NetworkCurrencyLocal.createAbsolute(10),
            UInt64.fromUint(100),
            LockHashAlgorithm.Op_Sha3_256,
            sha3_256.create().update(convert.hexToUint8(proof)).hex(),
            recipientAddress,
            NetworkType.PRIVATE_TEST,
        );

        const json = secretLockTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.SECRET_LOCK);
        expect(json.transaction.hashAlgorithm).to.be.equal(LockHashAlgorithm.Op_Sha3_256);
    });

    it('should create SecretProofTransaction', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const secretProofTransaction = SecretProofTransaction.create(
            Deadline.create(epochAdjustment),
            LockHashAlgorithm.Op_Sha3_256,
            sha3_256.create().update(convert.hexToUint8(proof)).hex(),
            account.address,
            proof,
            NetworkType.PRIVATE_TEST,
        );

        const json = secretProofTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.SECRET_PROOF);
        expect(json.transaction.hashAlgorithm).to.be.equal(LockHashAlgorithm.Op_Sha3_256);
        expect(json.transaction.secret).to.be.equal(sha3_256.create().update(convert.hexToUint8(proof)).hex());
        expect(json.transaction.proof).to.be.equal(proof);
    });

    it('should create ModifyMultiSigTransaction', () => {
        const modifyMultisigAccountTransaction = MultisigAccountModificationTransaction.create(
            Deadline.create(epochAdjustment),
            2,
            1,
            [Address.createFromPublicKey('B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6EC24', NetworkType.PRIVATE_TEST)],
            [],
            NetworkType.PRIVATE_TEST,
        );

        const json = modifyMultisigAccountTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.MULTISIG_ACCOUNT_MODIFICATION);
        expect(json.transaction.minApprovalDelta).to.be.equal(2);
        expect(json.transaction.minRemovalDelta).to.be.equal(1);
    });

    it('should create AggregatedTransaction - Complete', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            Address.createFromRawAddress('SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMQ'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.PRIVATE_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(epochAdjustment),
            [transferTransaction.toAggregate(account.publicAccount)],
            NetworkType.PRIVATE_TEST,
            [],
        );

        const json = aggregateTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.AGGREGATE_COMPLETE);
        expect(json.transaction.transactions.length).to.be.equal(1);
    });

    it('should create AggregatedTransaction - Bonded', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            Address.createFromRawAddress('SATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA34I2PMQ'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.PRIVATE_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(epochAdjustment),
            [transferTransaction.toAggregate(account.publicAccount)],
            NetworkType.PRIVATE_TEST,
            [],
        );

        const json = aggregateTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.AGGREGATE_BONDED);
        expect(json.transaction.transactions.length).to.be.equal(1);
    });

    it('should create LockFundTransaction', () => {
        const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
        const aggregateTransaction = AggregateTransaction.createBonded(Deadline.create(epochAdjustment), [], NetworkType.PRIVATE_TEST, []);
        const signedTransaction = account.sign(aggregateTransaction, generationHash);
        const lockTransaction = LockFundsTransaction.create(
            Deadline.create(epochAdjustment),
            NetworkCurrencyLocal.createRelative(10),
            UInt64.fromUint(10),
            signedTransaction,
            NetworkType.PRIVATE_TEST,
        );

        const json = lockTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.HASH_LOCK);
        expect(json.transaction.hash).to.be.equal(signedTransaction.hash);
    });

    it('should create NamespaceRegistrationTransaction - Root', () => {
        const registerNamespaceTransaction = NamespaceRegistrationTransaction.createRootNamespace(
            Deadline.create(epochAdjustment),
            'root-test-namespace',
            UInt64.fromUint(1000),
            NetworkType.PRIVATE_TEST,
        );

        const json = registerNamespaceTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.NAMESPACE_REGISTRATION);
    });

    it('should create NamespaceRegistrationTransaction - Sub', () => {
        const registerNamespaceTransaction = NamespaceRegistrationTransaction.createSubNamespace(
            Deadline.create(epochAdjustment),
            'root-test-namespace',
            'parent-test-namespace',
            NetworkType.PRIVATE_TEST,
        );

        const json = registerNamespaceTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.NAMESPACE_REGISTRATION);
    });

    it('should create VrfKeyLinkTransaction', () => {
        const vrfKeyLinkTransaction = VrfKeyLinkTransaction.create(
            Deadline.create(epochAdjustment),
            account.publicKey,
            LinkAction.Link,
            NetworkType.PRIVATE_TEST,
        );
        const json = vrfKeyLinkTransaction.toJSON();

        expect(json.transaction.linkedPublicKey).to.be.equal(account.publicKey);
        expect(json.transaction.linkAction).to.be.equal(LinkAction.Link);
    });

    it('should create NodeKeyLinkTransaction', () => {
        const nodeKeyLinkTransaction = NodeKeyLinkTransaction.create(
            Deadline.create(epochAdjustment),
            account.publicKey,
            LinkAction.Link,
            NetworkType.PRIVATE_TEST,
        );
        const json = nodeKeyLinkTransaction.toJSON();

        expect(json.transaction.linkedPublicKey).to.be.equal(account.publicKey);
        expect(json.transaction.linkAction).to.be.equal(LinkAction.Link);
    });

    it('should create VotingKeyLinkTransaction', () => {
        const votingKey = Convert.uint8ToHex(Crypto.randomBytes(48));
        const votingKeyLinkTransaction = VotingKeyLinkTransaction.create(
            Deadline.create(epochAdjustment),
            votingKey,
            1,
            3,
            LinkAction.Link,
            NetworkType.PRIVATE_TEST,
        );

        const json = votingKeyLinkTransaction.toJSON();

        expect(json.transaction.linkedPublicKey).to.be.equal(votingKey);
        expect(json.transaction.startEpoch).to.be.equal('1');
        expect(json.transaction.endEpoch.toString()).to.be.equal('3');
        expect(json.transaction.linkAction).to.be.equal(LinkAction.Link);
    });
});
