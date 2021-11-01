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

import { deepEqual } from 'assert';
import { expect } from 'chai';
import { sha3_256 } from 'js-sha3';
import { Crypto } from '../../../src/core/crypto';
import { Convert } from '../../../src/core/format';
import { TransactionMapping } from '../../../src/core/utils';
import { TransactionVersion, UInt64, VotingKeyLinkTransaction } from '../../../src/model';
import { Account, Address } from '../../../src/model/account';
import { LockHashAlgorithm } from '../../../src/model/lock';
import { PlainMessage } from '../../../src/model/message';
import { MosaicFlags, MosaicId, MosaicNonce, MosaicSupplyChangeAction } from '../../../src/model/mosaic';
import { AliasAction, NamespaceId, NamespaceRegistrationType } from '../../../src/model/namespace';
import { NetworkType } from '../../../src/model/network';
import {
    AddressRestrictionFlag,
    MosaicRestrictionFlag,
    MosaicRestrictionType,
    OperationRestrictionFlag,
} from '../../../src/model/restriction';
import {
    AccountAddressRestrictionTransaction,
    AccountKeyLinkTransaction,
    AccountMetadataTransaction,
    AccountMosaicRestrictionTransaction,
    AccountOperationRestrictionTransaction,
    AccountRestrictionTransaction,
    AddressAliasTransaction,
    AggregateTransaction,
    Deadline,
    LinkAction,
    LockFundsTransaction,
    MosaicAddressRestrictionTransaction,
    MosaicAliasTransaction,
    MosaicDefinitionTransaction,
    MosaicGlobalRestrictionTransaction,
    MosaicMetadataTransaction,
    MosaicSupplyChangeTransaction,
    MultisigAccountModificationTransaction,
    NamespaceMetadataTransaction,
    NamespaceRegistrationTransaction,
    NodeKeyLinkTransaction,
    SecretLockTransaction,
    SecretProofTransaction,
    TransactionType,
    TransferTransaction,
    VrfKeyLinkTransaction,
} from '../../../src/model/transaction';
import { TestingAccount } from '../../conf/conf.spec';
import { NetworkCurrencyLocal } from '../../model/mosaic/Currency.spec';

describe('TransactionMapping - createFromPayload with optional sigature and signer', () => {
    let account: Account;
    const emtptySignature = Convert.uint8ToHex(new Uint8Array(64));
    const testSignature =
        '4CBA582B4C898FD6D218499251FE8EE1214D3715545023123F70D25389D577A96E74C1FCD07FF8F0D678A4DA5CAD8CCB173DDD9F7975A6985ADCD7AD625B170F';
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    const epochAdjustment = 1573430400;
    before(() => {
        account = TestingAccount;
    });

    it('should create AccountRestrictionAddressTransaction', () => {
        const address = Address.createFromRawAddress('TATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA37JGO5Q');
        const addressRestrictionTransaction = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
            Deadline.create(epochAdjustment),
            AddressRestrictionFlag.AllowIncomingAddress,
            [address],
            [],
            NetworkType.TEST_NET,
            undefined,
            testSignature,
            account.publicAccount,
        );
        let signedTransaction = addressRestrictionTransaction.serialize();

        let transaction = TransactionMapping.createFromPayload(signedTransaction) as AccountAddressRestrictionTransaction;

        expect(transaction.restrictionFlags).to.be.equal(AddressRestrictionFlag.AllowIncomingAddress);
        expect((transaction.restrictionAdditions[0] as Address).plain()).to.be.equal('TATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA37JGO5Q');
        expect(transaction.restrictionDeletions.length).to.be.equal(0);
        expect(transaction.signature).to.be.equal(testSignature);
        expect(transaction.signer?.publicKey).to.be.equal(account.publicKey);

        Object.assign(addressRestrictionTransaction, { signature: emtptySignature, signer: undefined });
        signedTransaction = addressRestrictionTransaction.serialize();

        transaction = TransactionMapping.createFromPayload(signedTransaction) as AccountAddressRestrictionTransaction;
        expect(transaction.signature).to.be.undefined;
        expect(transaction.signer).to.be.undefined;
    });

    it('should create AccountRestrictionMosaicTransaction', () => {
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicRestrictionTransaction = AccountRestrictionTransaction.createMosaicRestrictionModificationTransaction(
            Deadline.create(epochAdjustment),
            MosaicRestrictionFlag.AllowMosaic,
            [mosaicId],
            [],
            NetworkType.TEST_NET,
            undefined,
            testSignature,
            account.publicAccount,
        );

        let signedTransaction = mosaicRestrictionTransaction.serialize();

        let transaction = TransactionMapping.createFromPayload(signedTransaction) as AccountMosaicRestrictionTransaction;
        expect(transaction.restrictionFlags).to.be.equal(MosaicRestrictionFlag.AllowMosaic);
        expect((transaction.restrictionAdditions[0] as MosaicId).toHex()).to.be.equal(mosaicId.toHex());
        expect(transaction.restrictionDeletions.length).to.be.equal(0);
        expect(transaction.signature).to.be.equal(testSignature);
        expect(transaction.signer?.publicKey).to.be.equal(account.publicKey);

        Object.assign(mosaicRestrictionTransaction, { signature: emtptySignature, signer: undefined });
        signedTransaction = mosaicRestrictionTransaction.serialize();

        transaction = TransactionMapping.createFromPayload(signedTransaction) as AccountMosaicRestrictionTransaction;
        expect(transaction.signature).to.be.undefined;
        expect(transaction.signer).to.be.undefined;
    });

    it('should create AccountRestrictionOperationTransaction', () => {
        const operation = TransactionType.ADDRESS_ALIAS;
        const operationRestrictionTransaction = AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(
            Deadline.create(epochAdjustment),
            OperationRestrictionFlag.AllowOutgoingTransactionType,
            [operation],
            [],
            NetworkType.TEST_NET,
            undefined,
            testSignature,
            account.publicAccount,
        );

        let signedTransaction = operationRestrictionTransaction.serialize();

        let transaction = TransactionMapping.createFromPayload(signedTransaction) as AccountOperationRestrictionTransaction;
        expect(transaction.restrictionFlags).to.be.equal(OperationRestrictionFlag.AllowOutgoingTransactionType);
        expect(transaction.restrictionAdditions[0]).to.be.equal(operation);
        expect(transaction.restrictionDeletions.length).to.be.equal(0);

        expect(transaction.signature).to.be.equal(testSignature);
        expect(transaction.signer?.publicKey).to.be.equal(account.publicKey);

        Object.assign(operationRestrictionTransaction, { signature: emtptySignature, signer: undefined });
        signedTransaction = operationRestrictionTransaction.serialize();

        transaction = TransactionMapping.createFromPayload(signedTransaction) as AccountOperationRestrictionTransaction;
        expect(transaction.signature).to.be.undefined;
        expect(transaction.signer).to.be.undefined;
    });

    it('should create AddressAliasTransaction', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const address = Address.createFromRawAddress('TATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA37JGO5Q');
        const addressAliasTransaction = AddressAliasTransaction.create(
            Deadline.create(epochAdjustment),
            AliasAction.Link,
            namespaceId,
            address,
            NetworkType.TEST_NET,
            undefined,
            testSignature,
            account.publicAccount,
        );

        let signedTransaction = addressAliasTransaction.serialize();

        let transaction = TransactionMapping.createFromPayload(signedTransaction) as AddressAliasTransaction;

        expect(transaction.aliasAction).to.be.equal(AliasAction.Link);
        expect(transaction.namespaceId.id.lower).to.be.equal(33347626);
        expect(transaction.namespaceId.id.higher).to.be.equal(3779697293);
        expect(transaction.address.plain()).to.be.equal('TATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA37JGO5Q');
        expect(transaction.signature).to.be.equal(testSignature);
        expect(transaction.signer?.publicKey).to.be.equal(account.publicKey);

        Object.assign(addressAliasTransaction, { signature: emtptySignature, signer: undefined });
        signedTransaction = addressAliasTransaction.serialize();

        transaction = TransactionMapping.createFromPayload(signedTransaction) as AddressAliasTransaction;
        expect(transaction.signature).to.be.undefined;
        expect(transaction.signer).to.be.undefined;
    });

    it('should create MosaicAliasTransaction', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicAliasTransaction = MosaicAliasTransaction.create(
            Deadline.create(epochAdjustment),
            AliasAction.Link,
            namespaceId,
            mosaicId,
            NetworkType.TEST_NET,
            undefined,
            testSignature,
            account.publicAccount,
        );

        let signedTransaction = mosaicAliasTransaction.serialize();

        let transaction = TransactionMapping.createFromPayload(signedTransaction) as MosaicAliasTransaction;
        expect(transaction.aliasAction).to.be.equal(AliasAction.Link);
        expect(transaction.namespaceId.id.lower).to.be.equal(33347626);
        expect(transaction.namespaceId.id.higher).to.be.equal(3779697293);
        expect(transaction.mosaicId.id.lower).to.be.equal(2262289484);
        expect(transaction.mosaicId.id.higher).to.be.equal(3405110546);
        expect(transaction.signature).to.be.equal(testSignature);
        expect(transaction.signer?.publicKey).to.be.equal(account.publicKey);

        Object.assign(mosaicAliasTransaction, { signature: emtptySignature, signer: undefined });
        signedTransaction = mosaicAliasTransaction.serialize();

        transaction = TransactionMapping.createFromPayload(signedTransaction) as MosaicAliasTransaction;
        expect(transaction.signature).to.be.undefined;
        expect(transaction.signer).to.be.undefined;
    });

    it('should create MosaicDefinitionTransaction', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(epochAdjustment),
            MosaicNonce.createFromUint8Array(new Uint8Array([0xe6, 0xde, 0x84, 0xb8])), // nonce
            new MosaicId(UInt64.fromUint(1).toDTO()), // ID
            MosaicFlags.create(false, false, false),
            3,
            UInt64.fromUint(1000),
            NetworkType.TEST_NET,
            undefined,
            testSignature,
            account.publicAccount,
        );

        let signedTransaction = mosaicDefinitionTransaction.serialize();

        let transaction = TransactionMapping.createFromPayload(signedTransaction) as MosaicDefinitionTransaction;

        expect(transaction.duration!.lower).to.be.equal(1000);
        expect(transaction.duration!.higher).to.be.equal(0);
        expect(transaction.divisibility).to.be.equal(3);
        expect(transaction.flags.supplyMutable).to.be.equal(false);
        expect(transaction.flags.transferable).to.be.equal(false);
        expect(transaction.flags.restrictable).to.be.equal(false);
        expect(transaction.signature).to.be.equal(testSignature);
        expect(transaction.signer?.publicKey).to.be.equal(account.publicKey);

        Object.assign(mosaicDefinitionTransaction, { signature: emtptySignature, signer: undefined });
        signedTransaction = mosaicDefinitionTransaction.serialize();

        transaction = TransactionMapping.createFromPayload(signedTransaction) as MosaicDefinitionTransaction;
        expect(transaction.signature).to.be.undefined;
        expect(transaction.signer).to.be.undefined;
    });

    it('should create MosaicDefinitionTransaction - without duration', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(epochAdjustment),
            MosaicNonce.createFromUint8Array(new Uint8Array([0xe6, 0xde, 0x84, 0xb8])), // nonce
            new MosaicId(UInt64.fromUint(1).toDTO()), // ID
            MosaicFlags.create(false, false, false),
            3,
            UInt64.fromUint(0),
            NetworkType.TEST_NET,
            undefined,
            testSignature,
            account.publicAccount,
        );

        let signedTransaction = mosaicDefinitionTransaction.serialize();

        let transaction = TransactionMapping.createFromPayload(signedTransaction) as MosaicDefinitionTransaction;

        expect(transaction.divisibility).to.be.equal(3);
        expect(transaction.flags.supplyMutable).to.be.equal(false);
        expect(transaction.flags.transferable).to.be.equal(false);
        expect(transaction.flags.restrictable).to.be.equal(false);
        expect(transaction.signature).to.be.equal(testSignature);
        expect(transaction.signer?.publicKey).to.be.equal(account.publicKey);

        Object.assign(mosaicDefinitionTransaction, { signature: emtptySignature, signer: undefined });
        signedTransaction = mosaicDefinitionTransaction.serialize();

        transaction = TransactionMapping.createFromPayload(signedTransaction) as MosaicDefinitionTransaction;
        expect(transaction.signature).to.be.undefined;
        expect(transaction.signer).to.be.undefined;
    });

    it('should create MosaicSupplyChangeTransaction', () => {
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
            Deadline.create(epochAdjustment),
            mosaicId,
            MosaicSupplyChangeAction.Increase,
            UInt64.fromUint(10),
            NetworkType.TEST_NET,
            undefined,
            testSignature,
            account.publicAccount,
        );

        let signedTransaction = mosaicSupplyChangeTransaction.serialize();

        let transaction = TransactionMapping.createFromPayload(signedTransaction) as MosaicSupplyChangeTransaction;

        expect(transaction.action).to.be.equal(MosaicSupplyChangeAction.Increase);
        expect(transaction.delta.lower).to.be.equal(10);
        expect(transaction.delta.higher).to.be.equal(0);
        expect(transaction.mosaicId.id.lower).to.be.equal(2262289484);
        expect(transaction.mosaicId.id.higher).to.be.equal(3405110546);
        expect(transaction.signature).to.be.equal(testSignature);
        expect(transaction.signer?.publicKey).to.be.equal(account.publicKey);

        Object.assign(mosaicSupplyChangeTransaction, { signature: emtptySignature, signer: undefined });
        signedTransaction = mosaicSupplyChangeTransaction.serialize();

        transaction = TransactionMapping.createFromPayload(signedTransaction) as MosaicSupplyChangeTransaction;
        expect(transaction.signature).to.be.undefined;
        expect(transaction.signer).to.be.undefined;
    });

    it('should create TransferTransaction', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            Address.createFromRawAddress('TATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA37JGO5Q'),
            [NetworkCurrencyLocal.createRelative(100)],
            PlainMessage.create('test-message'),
            NetworkType.TEST_NET,
            undefined,
            testSignature,
            account.publicAccount,
        );

        let signedTransaction = transferTransaction.serialize();

        let transaction = TransactionMapping.createFromPayload(signedTransaction) as TransferTransaction;

        expect(transaction.message.payload).to.be.equal('test-message');
        expect(transaction.mosaics.length).to.be.equal(1);
        expect(transaction.recipientToString()).to.be.equal('TATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA37JGO5Q');
        expect(transaction.signature).to.be.equal(testSignature);
        expect(transaction.signer?.publicKey).to.be.equal(account.publicKey);

        Object.assign(transferTransaction, { signature: emtptySignature, signer: undefined });
        signedTransaction = transferTransaction.serialize();

        transaction = TransactionMapping.createFromPayload(signedTransaction) as TransferTransaction;
        expect(transaction.signature).to.be.undefined;
        expect(transaction.signer).to.be.undefined;
    });

    it('should create SecretLockTransaction', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const recipientAddress = Address.createFromRawAddress('TATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA37JGO5Q');
        const secretLockTransaction = SecretLockTransaction.create(
            Deadline.create(epochAdjustment),
            NetworkCurrencyLocal.createAbsolute(10),
            UInt64.fromUint(100),
            LockHashAlgorithm.Op_Sha3_256,
            sha3_256.create().update(Convert.hexToUint8(proof)).hex(),
            recipientAddress,
            NetworkType.TEST_NET,
            undefined,
            testSignature,
            account.publicAccount,
        );

        let signedTransaction = secretLockTransaction.serialize();

        let transaction = TransactionMapping.createFromPayload(signedTransaction) as SecretLockTransaction;

        expect(transaction.mosaic.amount.equals(UInt64.fromUint(10))).to.be.equal(true);
        expect(transaction.duration.equals(UInt64.fromUint(100))).to.be.equal(true);
        expect(transaction.hashAlgorithm).to.be.equal(0);
        expect(transaction.secret).to.be.equal('9B3155B37159DA50AA52D5967C509B410F5A36A3B1E31ECB5AC76675D79B4A5E');
        expect((transaction.recipientAddress as Address).plain()).to.be.equal(recipientAddress.plain());
        expect(transaction.signature).to.be.equal(testSignature);
        expect(transaction.signer?.publicKey).to.be.equal(account.publicKey);

        Object.assign(secretLockTransaction, { signature: emtptySignature, signer: undefined });
        signedTransaction = secretLockTransaction.serialize();

        transaction = TransactionMapping.createFromPayload(signedTransaction) as SecretLockTransaction;
        expect(transaction.signature).to.be.undefined;
        expect(transaction.signer).to.be.undefined;
    });

    it('should create SecretProofTransaction', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const secretProofTransaction = SecretProofTransaction.create(
            Deadline.create(epochAdjustment),
            LockHashAlgorithm.Op_Sha3_256,
            sha3_256.create().update(Convert.hexToUint8(proof)).hex(),
            account.address,
            proof,
            NetworkType.TEST_NET,
            undefined,
            testSignature,
            account.publicAccount,
        );

        let signedTransaction = secretProofTransaction.serialize();

        let transaction = TransactionMapping.createFromPayload(signedTransaction) as SecretProofTransaction;
        expect(transaction.hashAlgorithm).to.be.equal(0);
        expect(transaction.secret).to.be.equal('9B3155B37159DA50AA52D5967C509B410F5A36A3B1E31ECB5AC76675D79B4A5E');
        expect(transaction.proof).to.be.equal(proof);
        expect((transaction.recipientAddress as Address).plain()).to.be.equal(account.address.plain());
        expect(transaction.signature).to.be.equal(testSignature);
        expect(transaction.signer?.publicKey).to.be.equal(account.publicKey);

        Object.assign(secretProofTransaction, { signature: emtptySignature, signer: undefined });
        signedTransaction = secretProofTransaction.serialize();

        transaction = TransactionMapping.createFromPayload(signedTransaction) as SecretProofTransaction;
        expect(transaction.signature).to.be.undefined;
        expect(transaction.signer).to.be.undefined;
    });

    it('should create ModifyMultiSigTransaction', () => {
        const modifyMultisigAccountTransaction = MultisigAccountModificationTransaction.create(
            Deadline.create(epochAdjustment),
            2,
            1,
            [Address.createFromPublicKey('B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6EC24', NetworkType.TEST_NET)],
            [],
            NetworkType.TEST_NET,
            undefined,
            testSignature,
            account.publicAccount,
        );

        let signedTransaction = modifyMultisigAccountTransaction.serialize();

        let transaction = TransactionMapping.createFromPayload(signedTransaction) as MultisigAccountModificationTransaction;

        expect(transaction.minApprovalDelta).to.be.equal(2);
        expect(transaction.minRemovalDelta).to.be.equal(1);
        expect(
            transaction.addressAdditions[0].equals(
                Address.createFromPublicKey('B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6EC24', NetworkType.TEST_NET),
            ),
        ).to.be.true;
        expect(transaction.addressDeletions.length).to.be.equal(0);
        expect(transaction.signature).to.be.equal(testSignature);
        expect(transaction.signer?.publicKey).to.be.equal(account.publicKey);

        Object.assign(modifyMultisigAccountTransaction, { signature: emtptySignature, signer: undefined });
        signedTransaction = modifyMultisigAccountTransaction.serialize();

        transaction = TransactionMapping.createFromPayload(signedTransaction) as MultisigAccountModificationTransaction;
        expect(transaction.signature).to.be.undefined;
        expect(transaction.signer).to.be.undefined;
    });

    it('should create AggregatedTransaction - Complete', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            Address.createFromRawAddress('TATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA37JGO5Q'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.TEST_NET,
        );

        const accountLinkTransaction = AccountKeyLinkTransaction.create(
            Deadline.create(epochAdjustment),
            account.publicKey,
            LinkAction.Link,
            NetworkType.TEST_NET,
        );
        const vrfKeyLinkTransaction = VrfKeyLinkTransaction.create(
            Deadline.create(epochAdjustment),
            account.publicKey,
            LinkAction.Link,
            NetworkType.TEST_NET,
        );
        const nodeKeyLinkTransaction = NodeKeyLinkTransaction.create(
            Deadline.create(epochAdjustment),
            account.publicKey,
            LinkAction.Link,
            NetworkType.TEST_NET,
        );

        const votingKeyLinkTransaction = VotingKeyLinkTransaction.create(
            Deadline.create(epochAdjustment),
            Convert.uint8ToHex(Crypto.randomBytes(32)),
            2,
            3,
            LinkAction.Link,
            NetworkType.TEST_NET,
            TransactionVersion.VOTING_KEY_LINK,
        );
        const registerNamespaceTransaction = NamespaceRegistrationTransaction.createRootNamespace(
            Deadline.create(epochAdjustment),
            'root-test-namespace',
            UInt64.fromUint(1000),
            NetworkType.TEST_NET,
        );
        const mosaicGlobalRestrictionTransaction = MosaicGlobalRestrictionTransaction.create(
            Deadline.create(epochAdjustment),
            new MosaicId(UInt64.fromUint(1).toDTO()),
            UInt64.fromUint(4444),
            UInt64.fromUint(0),
            MosaicRestrictionType.NONE,
            UInt64.fromUint(0),
            MosaicRestrictionType.GE,
            NetworkType.TEST_NET,
        );
        const mosaicAddressRestrictionTransaction = MosaicAddressRestrictionTransaction.create(
            Deadline.create(epochAdjustment),
            new NamespaceId('test'),
            UInt64.fromUint(4444),
            account.address,
            UInt64.fromUint(0),
            NetworkType.TEST_NET,
            UInt64.fromUint(0),
        );
        const accountMetadataTransaction = AccountMetadataTransaction.create(
            Deadline.create(epochAdjustment),
            account.address,
            UInt64.fromUint(1000),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            NetworkType.TEST_NET,
        );
        const mosaicMetadataTransaction = MosaicMetadataTransaction.create(
            Deadline.create(epochAdjustment),
            account.address,
            UInt64.fromUint(1000),
            new MosaicId([2262289484, 3405110546]),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            NetworkType.TEST_NET,
        );
        const namespaceMetadataTransaction = NamespaceMetadataTransaction.create(
            Deadline.create(epochAdjustment),
            account.address,
            UInt64.fromUint(1000),
            new NamespaceId([2262289484, 3405110546]),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            NetworkType.TEST_NET,
        );

        const mosaicAliasTransaction = MosaicAliasTransaction.create(
            Deadline.create(epochAdjustment),
            AliasAction.Link,
            new NamespaceId([2262289484, 3405110546]),
            new MosaicId([2262289484, 3405110546]),
            NetworkType.TEST_NET,
        );

        const secretProofTransaction = SecretProofTransaction.create(
            Deadline.create(epochAdjustment),
            LockHashAlgorithm.Op_Sha3_256,
            sha3_256.create().update(Convert.hexToUint8('B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7')).hex(),
            account.address,
            'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7',
            NetworkType.TEST_NET,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(epochAdjustment),
            [
                transferTransaction.toAggregate(account.publicAccount),
                accountLinkTransaction.toAggregate(account.publicAccount),
                vrfKeyLinkTransaction.toAggregate(account.publicAccount),
                nodeKeyLinkTransaction.toAggregate(account.publicAccount),
                votingKeyLinkTransaction.toAggregate(account.publicAccount),
                registerNamespaceTransaction.toAggregate(account.publicAccount),
                mosaicGlobalRestrictionTransaction.toAggregate(account.publicAccount),
                mosaicAddressRestrictionTransaction.toAggregate(account.publicAccount),
                mosaicMetadataTransaction.toAggregate(account.publicAccount),
                namespaceMetadataTransaction.toAggregate(account.publicAccount),
                accountMetadataTransaction.toAggregate(account.publicAccount),
                mosaicAliasTransaction.toAggregate(account.publicAccount),
                secretProofTransaction.toAggregate(account.publicAccount),
            ],
            NetworkType.TEST_NET,
            [],
            undefined,
            testSignature,
            account.publicAccount,
        );

        let signedTransaction = aggregateTransaction.serialize();

        let transaction = TransactionMapping.createFromPayload(signedTransaction) as AggregateTransaction;

        expect(transaction.type).to.be.equal(TransactionType.AGGREGATE_COMPLETE);
        expect(transaction.innerTransactions[0].type).to.be.equal(TransactionType.TRANSFER);
        expect(transaction.innerTransactions.length).to.be.greaterThan(0);
        expect(transaction.signature).to.be.equal(testSignature);
        expect(transaction.signer?.publicKey).to.be.equal(account.publicKey);

        Object.assign(aggregateTransaction, { signature: emtptySignature, signer: undefined });
        signedTransaction = aggregateTransaction.serialize();

        transaction = TransactionMapping.createFromPayload(signedTransaction) as AggregateTransaction;
        expect(transaction.signature).to.be.undefined;
        expect(transaction.signer).to.be.undefined;
    });

    it('should create AggregatedTransaction - Bonded', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            Address.createFromRawAddress('TATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA37JGO5Q'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.TEST_NET,
        );

        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(epochAdjustment),
            [transferTransaction.toAggregate(account.publicAccount)],
            NetworkType.TEST_NET,
            [],
            undefined,
            testSignature,
            account.publicAccount,
        );

        let signedTransaction = aggregateTransaction.serialize();

        let transaction = TransactionMapping.createFromPayload(signedTransaction) as AggregateTransaction;

        expect(transaction.type).to.be.equal(TransactionType.AGGREGATE_BONDED);
        expect(transaction.innerTransactions[0].type).to.be.equal(TransactionType.TRANSFER);
        expect(transaction.signature).to.be.equal(testSignature);
        expect(transaction.signer?.publicKey).to.be.equal(account.publicKey);

        Object.assign(aggregateTransaction, { signature: emtptySignature, signer: undefined });
        signedTransaction = aggregateTransaction.serialize();

        transaction = TransactionMapping.createFromPayload(signedTransaction) as AggregateTransaction;
        expect(transaction.signature).to.be.undefined;
        expect(transaction.signer).to.be.undefined;
    });

    it('should create LockFundTransaction', () => {
        const aggregateTransaction = AggregateTransaction.createBonded(Deadline.create(epochAdjustment), [], NetworkType.TEST_NET, []);
        const signedTransaction = account.sign(aggregateTransaction, generationHash);
        const lockTransaction = LockFundsTransaction.create(
            Deadline.create(epochAdjustment),
            NetworkCurrencyLocal.createRelative(10),
            UInt64.fromUint(10),
            signedTransaction,
            NetworkType.TEST_NET,
            undefined,
            testSignature,
            account.publicAccount,
        );

        let signedLockFundTransaction = lockTransaction.serialize();

        let transaction = TransactionMapping.createFromPayload(signedLockFundTransaction) as LockFundsTransaction;

        deepEqual(transaction.mosaic.id.id, NetworkCurrencyLocal.namespaceId!.id);
        expect(transaction.mosaic.amount.compact()).to.be.equal(10000000);
        expect(transaction.hash).to.be.equal(signedTransaction.hash);
        expect(transaction.signature).to.be.equal(testSignature);
        expect(transaction.signer?.publicKey).to.be.equal(account.publicKey);

        Object.assign(aggregateTransaction, { signature: emtptySignature, signer: undefined });
        signedLockFundTransaction = aggregateTransaction.serialize();

        transaction = TransactionMapping.createFromPayload(signedLockFundTransaction) as LockFundsTransaction;
        expect(transaction.signature).to.be.undefined;
        expect(transaction.signer).to.be.undefined;
    });

    it('should create an AccountKeyLinkTransaction object with link action', () => {
        const accountLinkTransaction = AccountKeyLinkTransaction.create(
            Deadline.create(epochAdjustment),
            account.publicKey,
            LinkAction.Link,
            NetworkType.TEST_NET,
            undefined,
            testSignature,
            account.publicAccount,
        );

        let signedTransaction = accountLinkTransaction.serialize();
        let transaction = TransactionMapping.createFromPayload(signedTransaction) as AccountKeyLinkTransaction;

        expect(transaction.linkAction).to.be.equal(1);
        expect(transaction.linkedPublicKey).to.be.equal(account.publicKey);
        expect(transaction.signature).to.be.equal(testSignature);
        expect(transaction.signer?.publicKey).to.be.equal(account.publicKey);

        Object.assign(accountLinkTransaction, { signature: emtptySignature, signer: undefined });
        signedTransaction = accountLinkTransaction.serialize();

        transaction = TransactionMapping.createFromPayload(signedTransaction) as AccountKeyLinkTransaction;
        expect(transaction.signature).to.be.undefined;
        expect(transaction.signer).to.be.undefined;
    });

    it('should create an VrfKeyLinkTransaction object with link action', () => {
        const vrfKeyLinkTransaction = VrfKeyLinkTransaction.create(
            Deadline.create(epochAdjustment),
            account.publicKey,
            LinkAction.Link,
            NetworkType.TEST_NET,
            undefined,
            testSignature,
            account.publicAccount,
        );

        let signedTransaction = vrfKeyLinkTransaction.serialize();
        let transaction = TransactionMapping.createFromPayload(signedTransaction) as VrfKeyLinkTransaction;

        expect(transaction.linkAction).to.be.equal(1);
        expect(transaction.linkedPublicKey).to.be.equal(account.publicKey);
        expect(transaction.signature).to.be.equal(testSignature);
        expect(transaction.signer?.publicKey).to.be.equal(account.publicKey);

        Object.assign(vrfKeyLinkTransaction, { signature: emtptySignature, signer: undefined });
        signedTransaction = vrfKeyLinkTransaction.serialize();

        transaction = TransactionMapping.createFromPayload(signedTransaction) as VrfKeyLinkTransaction;
        expect(transaction.signature).to.be.undefined;
        expect(transaction.signer).to.be.undefined;
    });

    it('should create an NodeKeyLinkTransaction object with link action', () => {
        const nodeKeyLinkTransaction = NodeKeyLinkTransaction.create(
            Deadline.create(epochAdjustment),
            account.publicKey,
            LinkAction.Link,
            NetworkType.TEST_NET,
            undefined,
            testSignature,
            account.publicAccount,
        );

        let signedTransaction = nodeKeyLinkTransaction.serialize();
        let transaction = TransactionMapping.createFromPayload(signedTransaction) as NodeKeyLinkTransaction;

        expect(transaction.linkAction).to.be.equal(1);
        expect(transaction.linkedPublicKey).to.be.equal(account.publicKey);
        expect(transaction.signature).to.be.equal(testSignature);
        expect(transaction.signer?.publicKey).to.be.equal(account.publicKey);

        Object.assign(nodeKeyLinkTransaction, { signature: emtptySignature, signer: undefined });
        signedTransaction = nodeKeyLinkTransaction.serialize();

        transaction = TransactionMapping.createFromPayload(signedTransaction) as NodeKeyLinkTransaction;
        expect(transaction.signature).to.be.undefined;
        expect(transaction.signer).to.be.undefined;
    });

    it('should create an VotingKeyLinkTransaction object with link action', () => {
        const key = Convert.uint8ToHex(Crypto.randomBytes(32));
        const votingKeyLinkTransaction = VotingKeyLinkTransaction.create(
            Deadline.create(epochAdjustment),
            key,
            1,
            3,
            LinkAction.Link,
            NetworkType.TEST_NET,
            TransactionVersion.VOTING_KEY_LINK,
            undefined,
            testSignature,
            account.publicAccount,
        );

        let signedTransaction = votingKeyLinkTransaction.serialize();
        let transaction = TransactionMapping.createFromPayload(signedTransaction) as VotingKeyLinkTransaction;

        expect(transaction.linkAction).to.be.equal(1);
        expect(transaction.linkedPublicKey).to.be.equal(key);
        expect(transaction.startEpoch.toString()).to.be.equal('1');
        expect(transaction.endEpoch.toString()).to.be.equal('3');
        expect(transaction.signature).to.be.equal(testSignature);
        expect(transaction.signer?.publicKey).to.be.equal(account.publicKey);

        Object.assign(votingKeyLinkTransaction, { signature: emtptySignature, signer: undefined });
        signedTransaction = votingKeyLinkTransaction.serialize();

        transaction = TransactionMapping.createFromPayload(signedTransaction) as VotingKeyLinkTransaction;
        expect(transaction.signature).to.be.undefined;
        expect(transaction.signer).to.be.undefined;
    });

    it('should create NamespaceRegistrationTransaction - Root', () => {
        const registerNamespaceTransaction = NamespaceRegistrationTransaction.createRootNamespace(
            Deadline.create(epochAdjustment),
            'root-test-namespace',
            UInt64.fromUint(1000),
            NetworkType.TEST_NET,
            undefined,
            testSignature,
            account.publicAccount,
        );

        let signedTransaction = registerNamespaceTransaction.serialize();

        let transaction = TransactionMapping.createFromPayload(signedTransaction) as NamespaceRegistrationTransaction;

        expect(transaction.registrationType).to.be.equal(NamespaceRegistrationType.RootNamespace);
        expect(transaction.namespaceName).to.be.equal('root-test-namespace');
        expect(transaction.signature).to.be.equal(testSignature);
        expect(transaction.signer?.publicKey).to.be.equal(account.publicKey);

        Object.assign(registerNamespaceTransaction, { signature: emtptySignature, signer: undefined });
        signedTransaction = registerNamespaceTransaction.serialize();

        transaction = TransactionMapping.createFromPayload(signedTransaction) as NamespaceRegistrationTransaction;
        expect(transaction.signature).to.be.undefined;
        expect(transaction.signer).to.be.undefined;
    });

    it('should create NamespaceRegistrationTransaction - Sub', () => {
        const registerNamespaceTransaction = NamespaceRegistrationTransaction.createSubNamespace(
            Deadline.create(epochAdjustment),
            'root-test-namespace',
            'parent-test-namespace',
            NetworkType.TEST_NET,
            undefined,
            testSignature,
            account.publicAccount,
        );

        let signedTransaction = registerNamespaceTransaction.serialize();

        let transaction = TransactionMapping.createFromPayload(signedTransaction) as NamespaceRegistrationTransaction;

        expect(transaction.registrationType).to.be.equal(NamespaceRegistrationType.SubNamespace);
        expect(transaction.namespaceName).to.be.equal('root-test-namespace');
        expect(transaction.signature).to.be.equal(testSignature);
        expect(transaction.signer?.publicKey).to.be.equal(account.publicKey);

        Object.assign(registerNamespaceTransaction, { signature: emtptySignature, signer: undefined });
        signedTransaction = registerNamespaceTransaction.serialize();

        transaction = TransactionMapping.createFromPayload(signedTransaction) as NamespaceRegistrationTransaction;
        expect(transaction.signature).to.be.undefined;
        expect(transaction.signer).to.be.undefined;
    });

    it('should create MosaicGlobalRestrictionTransaction', () => {
        const mosaicGlobalRestrictionTransaction = MosaicGlobalRestrictionTransaction.create(
            Deadline.create(epochAdjustment),
            new MosaicId(UInt64.fromUint(1).toDTO()),
            UInt64.fromUint(4444),
            UInt64.fromUint(0),
            MosaicRestrictionType.NONE,
            UInt64.fromUint(0),
            MosaicRestrictionType.GE,
            NetworkType.TEST_NET,
            undefined,
            undefined,
            testSignature,
            account.publicAccount,
        );

        let signedTransaction = mosaicGlobalRestrictionTransaction.serialize();

        let transaction = TransactionMapping.createFromPayload(signedTransaction) as MosaicGlobalRestrictionTransaction;

        expect(transaction.type).to.be.equal(TransactionType.MOSAIC_GLOBAL_RESTRICTION);
        expect(transaction.mosaicId.toHex()).to.be.equal(new MosaicId(UInt64.fromUint(1).toDTO()).toHex());
        expect(transaction.referenceMosaicId.toHex()).to.be.equal(new MosaicId(UInt64.fromUint(0).toDTO()).toHex());
        expect(transaction.restrictionKey.toHex()).to.be.equal(UInt64.fromUint(4444).toHex());
        expect(transaction.previousRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(0).toHex());
        expect(transaction.previousRestrictionType).to.be.equal(MosaicRestrictionType.NONE);
        expect(transaction.newRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(0).toHex());
        expect(transaction.newRestrictionType).to.be.equal(MosaicRestrictionType.GE);
        expect(transaction.signature).to.be.equal(testSignature);
        expect(transaction.signer?.publicKey).to.be.equal(account.publicKey);

        Object.assign(mosaicGlobalRestrictionTransaction, { signature: emtptySignature, signer: undefined });
        signedTransaction = mosaicGlobalRestrictionTransaction.serialize();

        transaction = TransactionMapping.createFromPayload(signedTransaction) as MosaicGlobalRestrictionTransaction;
        expect(transaction.signature).to.be.undefined;
        expect(transaction.signer).to.be.undefined;
    });

    it('should create MosaicAddressRestrictionTransaction', () => {
        const mosaicAddressRestrictionTransaction = MosaicAddressRestrictionTransaction.create(
            Deadline.create(epochAdjustment),
            new MosaicId(UInt64.fromUint(1).toDTO()),
            UInt64.fromUint(4444),
            account.address,
            UInt64.fromUint(0),
            NetworkType.TEST_NET,
            UInt64.fromUint(0),
            undefined,
            testSignature,
            account.publicAccount,
        );

        let signedTransaction = mosaicAddressRestrictionTransaction.serialize();

        let transaction = TransactionMapping.createFromPayload(signedTransaction) as MosaicAddressRestrictionTransaction;

        expect(transaction.type).to.be.equal(TransactionType.MOSAIC_ADDRESS_RESTRICTION);
        expect(transaction.mosaicId.toHex()).to.be.equal(new MosaicId(UInt64.fromUint(1).toDTO()).toHex());
        expect(transaction.restrictionKey.toHex()).to.be.equal(UInt64.fromUint(4444).toHex());
        expect(transaction.targetAddressToString()).to.be.equal(account.address.plain());
        expect(transaction.previousRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(0).toHex());
        expect(transaction.newRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(0).toHex());
        expect(transaction.signature).to.be.equal(testSignature);
        expect(transaction.signer?.publicKey).to.be.equal(account.publicKey);

        Object.assign(mosaicAddressRestrictionTransaction, { signature: emtptySignature, signer: undefined });
        signedTransaction = mosaicAddressRestrictionTransaction.serialize();

        transaction = TransactionMapping.createFromPayload(signedTransaction) as MosaicAddressRestrictionTransaction;
        expect(transaction.signature).to.be.undefined;
        expect(transaction.signer).to.be.undefined;
    });

    it('should create MosaicAddressRestrictionTransaction - MosaicAlias', () => {
        const mosaicAddressRestrictionTransaction = MosaicAddressRestrictionTransaction.create(
            Deadline.create(epochAdjustment),
            new NamespaceId('test'),
            UInt64.fromUint(4444),
            account.address,
            UInt64.fromUint(0),
            NetworkType.TEST_NET,
            UInt64.fromUint(0),
            undefined,
            testSignature,
            account.publicAccount,
        );

        let signedTransaction = mosaicAddressRestrictionTransaction.serialize();

        let transaction = TransactionMapping.createFromPayload(signedTransaction) as MosaicAddressRestrictionTransaction;

        expect(transaction.type).to.be.equal(TransactionType.MOSAIC_ADDRESS_RESTRICTION);
        expect(transaction.mosaicId.toHex()).to.be.equal(new NamespaceId('test').toHex());
        expect(transaction.mosaicId instanceof NamespaceId).to.be.true;
        expect(transaction.restrictionKey.toHex()).to.be.equal(UInt64.fromUint(4444).toHex());
        expect(transaction.targetAddressToString()).to.be.equal(account.address.plain());
        expect(transaction.previousRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(0).toHex());
        expect(transaction.newRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(0).toHex());
        expect(transaction.signature).to.be.equal(testSignature);
        expect(transaction.signer?.publicKey).to.be.equal(account.publicKey);

        Object.assign(mosaicAddressRestrictionTransaction, { signature: emtptySignature, signer: undefined });
        signedTransaction = mosaicAddressRestrictionTransaction.serialize();

        transaction = TransactionMapping.createFromPayload(signedTransaction) as MosaicAddressRestrictionTransaction;
        expect(transaction.signature).to.be.undefined;
        expect(transaction.signer).to.be.undefined;
    });

    it('should create AddressMetadataTransaction', () => {
        const accountMetadataTransaction = AccountMetadataTransaction.create(
            Deadline.create(epochAdjustment),
            account.address,
            UInt64.fromUint(1000),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            NetworkType.TEST_NET,
            undefined,
            testSignature,
            account.publicAccount,
        );
        let signedTransaction = accountMetadataTransaction.serialize();

        let transaction = TransactionMapping.createFromPayload(signedTransaction) as AccountMetadataTransaction;

        expect(transaction.type).to.be.equal(TransactionType.ACCOUNT_METADATA);
        expect(transaction.targetAddress.equals(account.address)).to.be.true;
        expect(transaction.scopedMetadataKey.toHex()).to.be.equal(UInt64.fromUint(1000).toHex());
        expect(transaction.valueSizeDelta).to.be.equal(1);
        expect(Convert.uint8ToHex(transaction.value)).to.be.equal(Convert.uint8ToHex(new Uint8Array(10)));
        expect(transaction.signature).to.be.equal(testSignature);
        expect(transaction.signer?.publicKey).to.be.equal(account.publicKey);

        Object.assign(accountMetadataTransaction, { signature: emtptySignature, signer: undefined });
        signedTransaction = accountMetadataTransaction.serialize();

        transaction = TransactionMapping.createFromPayload(signedTransaction) as AccountMetadataTransaction;
        expect(transaction.signature).to.be.undefined;
        expect(transaction.signer).to.be.undefined;
    });

    it('should create MosaicMetadataTransaction', () => {
        const mosaicMetadataTransaction = MosaicMetadataTransaction.create(
            Deadline.create(epochAdjustment),
            account.address,
            UInt64.fromUint(1000),
            new MosaicId([2262289484, 3405110546]),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            NetworkType.TEST_NET,
            undefined,
            testSignature,
            account.publicAccount,
        );

        let signedTransaction = mosaicMetadataTransaction.serialize();

        let transaction = TransactionMapping.createFromPayload(signedTransaction) as MosaicMetadataTransaction;

        expect(transaction.type).to.be.equal(TransactionType.MOSAIC_METADATA);
        expect(transaction.targetAddress.equals(account.address)).to.be.true;
        expect(transaction.scopedMetadataKey.toHex()).to.be.equal(UInt64.fromUint(1000).toHex());
        expect(transaction.valueSizeDelta).to.be.equal(1);
        expect(transaction.targetMosaicId.toHex()).to.be.equal(new MosaicId([2262289484, 3405110546]).toHex());
        expect(Convert.uint8ToHex(transaction.value)).to.be.equal(Convert.uint8ToHex(new Uint8Array(10)));
        expect(transaction.signature).to.be.equal(testSignature);
        expect(transaction.signer?.publicKey).to.be.equal(account.publicKey);

        Object.assign(mosaicMetadataTransaction, { signature: emtptySignature, signer: undefined });
        signedTransaction = mosaicMetadataTransaction.serialize();

        transaction = TransactionMapping.createFromPayload(signedTransaction) as MosaicMetadataTransaction;
        expect(transaction.signature).to.be.undefined;
        expect(transaction.signer).to.be.undefined;
    });

    it('should create NamespaceMetadataTransaction', () => {
        const namespaceMetadataTransaction = NamespaceMetadataTransaction.create(
            Deadline.create(epochAdjustment),
            account.address,
            UInt64.fromUint(1000),
            new NamespaceId([2262289484, 3405110546]),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            NetworkType.TEST_NET,
            undefined,
            testSignature,
            account.publicAccount,
        );

        let signedTransaction = namespaceMetadataTransaction.serialize();

        let transaction = TransactionMapping.createFromPayload(signedTransaction) as NamespaceMetadataTransaction;

        expect(transaction.type).to.be.equal(TransactionType.NAMESPACE_METADATA);
        expect(transaction.targetAddress.equals(account.address)).to.be.true;
        expect(transaction.scopedMetadataKey.toHex()).to.be.equal(UInt64.fromUint(1000).toHex());
        expect(transaction.valueSizeDelta).to.be.equal(1);
        expect(transaction.targetNamespaceId.toHex()).to.be.equal(new NamespaceId([2262289484, 3405110546]).toHex());
        expect(Convert.uint8ToHex(transaction.value)).to.be.equal(Convert.uint8ToHex(new Uint8Array(10)));
        expect(transaction.signature).to.be.equal(testSignature);
        expect(transaction.signer?.publicKey).to.be.equal(account.publicKey);

        Object.assign(namespaceMetadataTransaction, { signature: emtptySignature, signer: undefined });
        signedTransaction = namespaceMetadataTransaction.serialize();

        transaction = TransactionMapping.createFromPayload(signedTransaction) as NamespaceMetadataTransaction;
        expect(transaction.signature).to.be.undefined;
        expect(transaction.signer).to.be.undefined;
    });

    it('should throw error with invalid type', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            Address.createFromRawAddress('TATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA37JGO5Q'),
            [NetworkCurrencyLocal.createRelative(100)],
            PlainMessage.create('test-message'),
            NetworkType.TEST_NET,
            undefined,
            testSignature,
            account.publicAccount,
        );

        const signedTransaction = transferTransaction.serialize();
        const wrongType = signedTransaction.substring(0, 219) + '0000' + signedTransaction.substring(224);

        expect(() => {
            TransactionMapping.createFromPayload(wrongType) as TransferTransaction;
        }).to.throw();
    });
});
