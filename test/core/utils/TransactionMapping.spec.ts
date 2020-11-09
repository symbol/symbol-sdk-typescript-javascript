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
import { Convert } from '../../../src/core/format';
import { DtoMapping, TransactionMapping } from '../../../src/core/utils';
import { MessageMarker, Transaction, UInt64 } from '../../../src/model';
import { Account, Address } from '../../../src/model/account';
import { LockHashAlgorithm } from '../../../src/model/lock';
import { EncryptedMessage, MessageType, PlainMessage } from '../../../src/model/message';
import { Mosaic, MosaicFlags, MosaicId, MosaicNonce, MosaicSupplyChangeAction } from '../../../src/model/mosaic';
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
    VotingKeyLinkTransaction,
    VrfKeyLinkTransaction,
} from '../../../src/model/transaction';
import { TestingAccount } from '../../conf/conf.spec';
import { NetworkCurrencyLocal } from '../../model/mosaic/Currency.spec';

const assertSerialization = (t: Transaction, expectedHex: string): void => {
    const serializedHex = t.serialize();
    expect(serializedHex).eq(expectedHex);
    const transaction = TransactionMapping.createFromPayload(serializedHex);
    expect(DtoMapping.assign(transaction, { signature: undefined, signer: undefined }).serialize()).to.be.equal(expectedHex);
};

describe('TransactionMapping - createFromPayload', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';

    before(() => {
        account = TestingAccount;
    });

    it('should create AccountRestrictionAddressTransaction', () => {
        const address = Address.createFromRawAddress('QATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA367I6OQ');
        const addressRestrictionTransaction = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
            Deadline.createFromDTO('555'),
            AddressRestrictionFlag.AllowIncomingAddress,
            [address],
            [],
            NetworkType.PRIVATE_TEST,
        );

        const signedTransaction = addressRestrictionTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as AccountAddressRestrictionTransaction;

        expect(transaction.restrictionFlags).to.be.equal(AddressRestrictionFlag.AllowIncomingAddress);
        expect((transaction.restrictionAdditions[0] as Address).plain()).to.be.equal('QATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA367I6OQ');
        expect(transaction.restrictionDeletions.length).to.be.equal(0);

        const expectedHex =
            'A000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180504100000000000000002B0200000000000001000100000000008026D27E1D0A26CA4E316F901E23E55C8711DB20DFBE8F3A';
        assertSerialization(addressRestrictionTransaction, expectedHex);
    });

    it('should create AccountRestrictionMosaicTransaction', () => {
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicRestrictionTransaction = AccountRestrictionTransaction.createMosaicRestrictionModificationTransaction(
            Deadline.createFromDTO('555'),
            MosaicRestrictionFlag.AllowMosaic,
            [mosaicId],
            [],
            NetworkType.PRIVATE_TEST,
        );

        const signedTransaction = mosaicRestrictionTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as AccountMosaicRestrictionTransaction;
        expect(transaction.restrictionFlags).to.be.equal(MosaicRestrictionFlag.AllowMosaic);
        expect((transaction.restrictionAdditions[0] as MosaicId).toHex()).to.be.equal(mosaicId.toHex());
        expect(transaction.restrictionDeletions.length).to.be.equal(0);

        const expectedHex =
            '9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180504200000000000000002B0200000000000002000100000000004CCCD78612DDF5CA';
        assertSerialization(mosaicRestrictionTransaction, expectedHex);
    });

    it('should create AccountRestrictionOperationTransaction', () => {
        const operation = TransactionType.ADDRESS_ALIAS;
        const operationRestrictionTransaction = AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(
            Deadline.createFromDTO('555'),
            OperationRestrictionFlag.AllowOutgoingTransactionType,
            [operation],
            [],
            NetworkType.PRIVATE_TEST,
        );

        const signedTransaction = operationRestrictionTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as AccountOperationRestrictionTransaction;
        expect(transaction.restrictionFlags).to.be.equal(OperationRestrictionFlag.AllowOutgoingTransactionType);
        expect(transaction.restrictionAdditions[0]).to.be.equal(operation);
        expect(transaction.restrictionDeletions.length).to.be.equal(0);

        const expectedHex =
            '8A00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180504300000000000000002B0200000000000004400100000000004E42';
        assertSerialization(operationRestrictionTransaction, expectedHex);
    });

    it('should create AddressAliasTransaction', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const address = Address.createFromRawAddress('QATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA367I6OQ');
        const addressAliasTransaction = AddressAliasTransaction.create(
            Deadline.createFromDTO('555'),
            AliasAction.Link,
            namespaceId,
            address,
            NetworkType.PRIVATE_TEST,
        );

        const signedTransaction = addressAliasTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as AddressAliasTransaction;

        expect(transaction.aliasAction).to.be.equal(AliasAction.Link);
        expect(transaction.namespaceId.id.lower).to.be.equal(33347626);
        expect(transaction.namespaceId.id.higher).to.be.equal(3779697293);
        expect(transaction.address.plain()).to.be.equal('QATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA367I6OQ');

        const expectedHex =
            'A1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001804E4200000000000000002B020000000000002AD8FC018D9A49E18026D27E1D0A26CA4E316F901E23E55C8711DB20DFBE8F3A01';
        assertSerialization(addressAliasTransaction, expectedHex);
    });

    it('should create MosaicAliasTransaction', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicAliasTransaction = MosaicAliasTransaction.create(
            Deadline.createFromDTO('555'),
            AliasAction.Link,
            namespaceId,
            mosaicId,
            NetworkType.PRIVATE_TEST,
        );

        const signedTransaction = mosaicAliasTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as MosaicAliasTransaction;
        expect(transaction.aliasAction).to.be.equal(AliasAction.Link);
        expect(transaction.namespaceId.id.lower).to.be.equal(33347626);
        expect(transaction.namespaceId.id.higher).to.be.equal(3779697293);
        expect(transaction.mosaicId.id.lower).to.be.equal(2262289484);
        expect(transaction.mosaicId.id.higher).to.be.equal(3405110546);

        const expectedHex =
            '91000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001804E4300000000000000002B020000000000002AD8FC018D9A49E14CCCD78612DDF5CA01';
        assertSerialization(mosaicAliasTransaction, expectedHex);
    });

    it('should create MosaicDefinitionTransaction', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.createFromDTO('555'),
            MosaicNonce.createFromUint8Array(new Uint8Array([0xe6, 0xde, 0x84, 0xb8])), // nonce
            new MosaicId(UInt64.fromUint(1).toDTO()), // ID
            MosaicFlags.create(false, false, false),
            3,
            UInt64.fromUint(1000),
            NetworkType.PRIVATE_TEST,
        );

        const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as MosaicDefinitionTransaction;

        expect(transaction.duration!.lower).to.be.equal(1000);
        expect(transaction.duration!.higher).to.be.equal(0);
        expect(transaction.divisibility).to.be.equal(3);
        expect(transaction.flags.supplyMutable).to.be.equal(false);
        expect(transaction.flags.transferable).to.be.equal(false);
        expect(transaction.flags.restrictable).to.be.equal(false);

        const expectedHex =
            '96000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001804D4100000000000000002B020000000000000100000000000000E803000000000000E6DE84B80003';
        assertSerialization(mosaicDefinitionTransaction, expectedHex);
    });

    it('should create MosaicDefinitionTransaction - without duration', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.createFromDTO('555'),
            MosaicNonce.createFromUint8Array(new Uint8Array([0xe6, 0xde, 0x84, 0xb8])), // nonce
            new MosaicId(UInt64.fromUint(1).toDTO()), // ID
            MosaicFlags.create(false, false, false),
            3,
            UInt64.fromUint(0),
            NetworkType.PRIVATE_TEST,
        );

        const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as MosaicDefinitionTransaction;

        expect(transaction.divisibility).to.be.equal(3);
        expect(transaction.flags.supplyMutable).to.be.equal(false);
        expect(transaction.flags.transferable).to.be.equal(false);
        expect(transaction.flags.restrictable).to.be.equal(false);

        const expectedHex =
            '96000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001804D4100000000000000002B0200000000000001000000000000000000000000000000E6DE84B80003';
        assertSerialization(mosaicDefinitionTransaction, expectedHex);
    });

    it('should create MosaicDefinitionTransaction - without duration', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.createFromDTO('555'),
            MosaicNonce.createFromUint8Array(new Uint8Array([0xe6, 0xde, 0x84, 0xb8])), // nonce
            new MosaicId(UInt64.fromUint(1).toDTO()), // ID
            MosaicFlags.create(false, false, false),
            3,
            UInt64.fromUint(0),
            NetworkType.PRIVATE_TEST,
        );

        const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as MosaicDefinitionTransaction;

        expect(transaction.divisibility).to.be.equal(3);
        expect(transaction.flags.supplyMutable).to.be.equal(false);
        expect(transaction.flags.transferable).to.be.equal(false);
        expect(transaction.flags.transferable).to.be.equal(false);

        const expectedHex =
            '96000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001804D4100000000000000002B0200000000000001000000000000000000000000000000E6DE84B80003';
        assertSerialization(mosaicDefinitionTransaction, expectedHex);
    });

    it('should create MosaicDefinitionTransaction - without duration', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.createFromDTO('555'),
            MosaicNonce.createFromUint8Array(new Uint8Array([0xe6, 0xde, 0x84, 0xb8])), // nonce
            new MosaicId(UInt64.fromUint(1).toDTO()), // ID
            MosaicFlags.create(false, false, false),
            3,
            UInt64.fromUint(0),
            NetworkType.PRIVATE_TEST,
        );

        const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as MosaicDefinitionTransaction;

        expect(transaction.divisibility).to.be.equal(3);
        expect(transaction.flags.supplyMutable).to.be.equal(false);
        expect(transaction.flags.transferable).to.be.equal(false);
        expect(transaction.flags.transferable).to.be.equal(false);

        const expectedHex =
            '96000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001804D4100000000000000002B0200000000000001000000000000000000000000000000E6DE84B80003';
        assertSerialization(mosaicDefinitionTransaction, expectedHex);
    });

    it('should create MosaicDefinitionTransaction - without duration', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.createFromDTO('555'),
            MosaicNonce.createFromUint8Array(new Uint8Array([0xe6, 0xde, 0x84, 0xb8])), // nonce
            new MosaicId(UInt64.fromUint(1).toDTO()), // ID
            MosaicFlags.create(false, false, false),
            3,
            UInt64.fromUint(0),
            NetworkType.PRIVATE_TEST,
        );

        assertSerialization(
            mosaicDefinitionTransaction,
            '96000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001804D4100000000000000002B0200000000000001000000000000000000000000000000E6DE84B80003',
        );

        const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as MosaicDefinitionTransaction;

        expect(transaction.divisibility).to.be.equal(3);
        expect(transaction.flags.supplyMutable).to.be.equal(false);
        expect(transaction.flags.transferable).to.be.equal(false);
        expect(transaction.flags.transferable).to.be.equal(false);
    });

    it('should create MosaicSupplyChangeTransaction', () => {
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
            Deadline.createFromDTO('555'),
            mosaicId,
            MosaicSupplyChangeAction.Increase,
            UInt64.fromUint(10),
            NetworkType.PRIVATE_TEST,
        );

        const signedTransaction = mosaicSupplyChangeTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as MosaicSupplyChangeTransaction;

        expect(transaction.action).to.be.equal(MosaicSupplyChangeAction.Increase);
        expect(transaction.delta.lower).to.be.equal(10);
        expect(transaction.delta.higher).to.be.equal(0);
        expect(transaction.mosaicId.id.lower).to.be.equal(2262289484);
        expect(transaction.mosaicId.id.higher).to.be.equal(3405110546);

        const expectedHex =
            '91000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001804D4200000000000000002B020000000000004CCCD78612DDF5CA0A0000000000000001';
        assertSerialization(mosaicSupplyChangeTransaction, expectedHex);
    });

    it('should create TransferTransaction', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.createFromDTO('555'),
            Address.createFromRawAddress('QATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA367I6OQ'),
            [NetworkCurrencyLocal.createRelative(100)],
            PlainMessage.create('test-message'),
            NetworkType.PRIVATE_TEST,
        );

        const signedTransaction = transferTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as TransferTransaction;

        expect(transaction.message.payload).to.be.equal('test-message');
        expect(transaction.mosaics.length).to.be.equal(1);
        expect(transaction.recipientToString()).to.be.equal('QATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA367I6OQ');

        const expectedHex =
            'BD00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180544100000000000000002B020000000000008026D27E1D0A26CA4E316F901E23E55C8711DB20DFBE8F3A0D0001000000000044B262C46CEABB8500E1F5050000000000746573742D6D657373616765';
        assertSerialization(transferTransaction, expectedHex);
    });

    it('should create SecretLockTransaction', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const recipientAddress = Address.createFromRawAddress('QCOXVZMAZJTT4I3F7EAZYGNGR77D6WPTREIM2RQ');
        const secretLockTransaction = SecretLockTransaction.create(
            Deadline.createFromDTO('555'),
            NetworkCurrencyLocal.createAbsolute(10),
            UInt64.fromUint(100),
            LockHashAlgorithm.Op_Sha3_256,
            sha3_256.create().update(Convert.hexToUint8(proof)).hex(),
            recipientAddress,
            NetworkType.PRIVATE_TEST,
        );

        const signedTransaction = secretLockTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as SecretLockTransaction;

        expect(transaction.mosaic.amount.equals(UInt64.fromUint(10))).to.be.equal(true);
        expect(transaction.duration.equals(UInt64.fromUint(100))).to.be.equal(true);
        expect(transaction.hashAlgorithm).to.be.equal(0);
        expect(transaction.secret).to.be.equal('9B3155B37159DA50AA52D5967C509B410F5A36A3B1E31ECB5AC76675D79B4A5E');
        expect((transaction.recipientAddress as Address).plain()).to.be.equal(recipientAddress.plain());

        const expectedHex =
            'D100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180524100000000000000002B02000000000000809D7AE580CA673E2365F9019C19A68FFE3F59F38910CD469B3155B37159DA50AA52D5967C509B410F5A36A3B1E31ECB5AC76675D79B4A5E44B262C46CEABB850A00000000000000640000000000000000';
        assertSerialization(secretLockTransaction, expectedHex);
    });

    it('should create SecretProofTransaction', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const secretProofTransaction = SecretProofTransaction.create(
            Deadline.createFromDTO('555'),
            LockHashAlgorithm.Op_Sha3_256,
            sha3_256.create().update(Convert.hexToUint8(proof)).hex(),
            account.address,
            proof,
            NetworkType.PRIVATE_TEST,
        );

        const signedTransaction = secretProofTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as SecretProofTransaction;
        expect(transaction.hashAlgorithm).to.be.equal(0);
        expect(transaction.secret).to.be.equal('9B3155B37159DA50AA52D5967C509B410F5A36A3B1E31ECB5AC76675D79B4A5E');
        expect(transaction.proof).to.be.equal(proof);
        expect((transaction.recipientAddress as Address).plain()).to.be.equal(account.address.plain());

        const expectedHex =
            'DB00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180524200000000000000002B0200000000000080D66C33420E5411995BACFCA2B28CF1C9F5DD7AB1A9C05C9B3155B37159DA50AA52D5967C509B410F5A36A3B1E31ECB5AC76675D79B4A5E200000B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        assertSerialization(secretProofTransaction, expectedHex);
    });

    it('should create ModifyMultiSigTransaction', () => {
        const modifyMultisigAccountTransaction = MultisigAccountModificationTransaction.create(
            Deadline.createFromDTO('555'),
            2,
            1,
            [Address.createFromPublicKey('B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6EC24', NetworkType.PRIVATE_TEST)],
            [],
            NetworkType.PRIVATE_TEST,
        );

        const signedTransaction = modifyMultisigAccountTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as MultisigAccountModificationTransaction;

        expect(transaction.minApprovalDelta).to.be.equal(2);
        expect(transaction.minRemovalDelta).to.be.equal(1);
        expect(
            transaction.addressAdditions[0].equals(
                Address.createFromPublicKey('B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6EC24', NetworkType.PRIVATE_TEST),
            ),
        ).to.be.true;
        expect(transaction.addressDeletions.length).to.be.equal(0);

        const expectedHex =
            'A000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180554100000000000000002B020000000000000102010000000000809FC4844A5206CFA44603EFA1FFC76FE9B0564D96735562';
        assertSerialization(modifyMultisigAccountTransaction, expectedHex);
    });

    it('should create AggregatedTransaction - Complete', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.createFromDTO('555'),
            Address.createFromRawAddress('QATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA367I6OQ'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.PRIVATE_TEST,
        );

        const accountLinkTransaction = AccountKeyLinkTransaction.create(
            Deadline.createFromDTO('555'),
            account.publicKey,
            LinkAction.Link,
            NetworkType.PRIVATE_TEST,
        );
        const vrfKeyLinkTransaction = VrfKeyLinkTransaction.create(
            Deadline.createFromDTO('555'),
            account.publicKey,
            LinkAction.Link,
            NetworkType.PRIVATE_TEST,
        );
        const nodeKeyLinkTransaction = NodeKeyLinkTransaction.create(
            Deadline.createFromDTO('555'),
            account.publicKey,
            LinkAction.Link,
            NetworkType.PRIVATE_TEST,
        );
        const votingKeyLinkTransaction = VotingKeyLinkTransaction.create(
            Deadline.createFromDTO('555'),
            '3D6BA38329836BFD245489FA3C5700FA6349259D06EAF92ECE2034AA0A33045B013B49349FB9E8832D24858D03A6E022',
            1,
            3,
            LinkAction.Link,
            NetworkType.PRIVATE_TEST,
        );
        const registerNamespaceTransaction = NamespaceRegistrationTransaction.createRootNamespace(
            Deadline.createFromDTO('555'),
            'root-test-namespace',
            UInt64.fromUint(1000),
            NetworkType.PRIVATE_TEST,
        );
        const mosaicGlobalRestrictionTransaction = MosaicGlobalRestrictionTransaction.create(
            Deadline.createFromDTO('555'),
            new MosaicId(UInt64.fromUint(1).toDTO()),
            UInt64.fromUint(4444),
            UInt64.fromUint(0),
            MosaicRestrictionType.NONE,
            UInt64.fromUint(0),
            MosaicRestrictionType.GE,
            NetworkType.PRIVATE_TEST,
        );
        const mosaicAddressRestrictionTransaction = MosaicAddressRestrictionTransaction.create(
            Deadline.createFromDTO('555'),
            new NamespaceId('test'),
            UInt64.fromUint(4444),
            account.address,
            UInt64.fromUint(0),
            NetworkType.PRIVATE_TEST,
            UInt64.fromUint(0),
        );
        const accountMetadataTransaction = AccountMetadataTransaction.create(
            Deadline.createFromDTO('555'),
            account.address,
            UInt64.fromUint(1000),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            NetworkType.PRIVATE_TEST,
        );
        const mosaicMetadataTransaction = MosaicMetadataTransaction.create(
            Deadline.createFromDTO('555'),
            account.address,
            UInt64.fromUint(1000),
            new MosaicId([2262289484, 3405110546]),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            NetworkType.PRIVATE_TEST,
        );
        const namespaceMetadataTransaction = NamespaceMetadataTransaction.create(
            Deadline.createFromDTO('555'),
            account.address,
            UInt64.fromUint(1000),
            new NamespaceId([2262289484, 3405110546]),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            NetworkType.PRIVATE_TEST,
        );

        const mosaicAliasTransaction = MosaicAliasTransaction.create(
            Deadline.createFromDTO('555'),
            AliasAction.Link,
            new NamespaceId([2262289484, 3405110546]),
            new MosaicId([2262289484, 3405110546]),
            NetworkType.PRIVATE_TEST,
        );

        const secretProofTransaction = SecretProofTransaction.create(
            Deadline.createFromDTO('555'),
            LockHashAlgorithm.Op_Sha3_256,
            sha3_256.create().update(Convert.hexToUint8('B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7')).hex(),
            account.address,
            'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7',
            NetworkType.PRIVATE_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.createFromDTO('555'),
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
            NetworkType.PRIVATE_TEST,
            [],
        );

        const signedTransaction = aggregateTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as AggregateTransaction;

        expect(transaction.type).to.be.equal(TransactionType.AGGREGATE_COMPLETE);
        expect(transaction.innerTransactions[0].type).to.be.equal(TransactionType.TRANSFER);
        expect(transaction.innerTransactions.length).to.be.greaterThan(0);

        const expectedHex =
            'A805000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180414100000000000000002B02000000000000AADD3F16575A7757B60700DB023526BEDC4F3C8D7123557F21626613F106569B00050000000000005D000000000000009801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B600000000018054418026D27E1D0A26CA4E316F901E23E55C8711DB20DFBE8F3A0D0000000000000000746573742D6D65737361676500000051000000000000009801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B60000000001804C419801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B6010000000000000051000000000000009801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B600000000018043429801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B6010000000000000051000000000000009801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B60000000001804C429801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B6010000000000000069000000000000009801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B600000000018043413D6BA38329836BFD245489FA3C5700FA6349259D06EAF92ECE2034AA0A33045B013B49349FB9E8832D24858D03A6E0220100000003000000010000000000000055000000000000009801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B60000000001804E41E803000000000000CFCBE72D994BE69B0013726F6F742D746573742D6E616D6573706163650000005A000000000000009801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B60000000001805141010000000000000000000000000000005C1100000000000000000000000000000000000000000000000600000000000068000000000000009801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B600000000018051426EC265194C0501D45C110000000000000000000000000000000000000000000080D66C33420E5411995BACFCA2B28CF1C9F5DD7AB1A9C05C66000000000000009801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B6000000000180444280D66C33420E5411995BACFCA2B28CF1C9F5DD7AB1A9C05CE8030000000000004CCCD78612DDF5CA01000A0000000000000000000000000066000000000000009801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B6000000000180444380D66C33420E5411995BACFCA2B28CF1C9F5DD7AB1A9C05CE8030000000000004CCCD78612DDF5CA01000A000000000000000000000000005E000000000000009801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B6000000000180444180D66C33420E5411995BACFCA2B28CF1C9F5DD7AB1A9C05CE80300000000000001000A0000000000000000000000000041000000000000009801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B60000000001804E434CCCD78612DDF5CA4CCCD78612DDF5CA01000000000000008B000000000000009801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B6000000000180524280D66C33420E5411995BACFCA2B28CF1C9F5DD7AB1A9C05C9B3155B37159DA50AA52D5967C509B410F5A36A3B1E31ECB5AC76675D79B4A5E200000B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC70000000000';
        assertSerialization(aggregateTransaction, expectedHex);
    });

    it('should create AggregatedTransaction - Bonded', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.createFromDTO('555'),
            Address.createFromRawAddress('QATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA367I6OQ'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.PRIVATE_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.createFromDTO('555'),
            [transferTransaction.toAggregate(account.publicAccount)],
            NetworkType.PRIVATE_TEST,
            [],
        );

        const signedTransaction = aggregateTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as AggregateTransaction;

        expect(transaction.type).to.be.equal(TransactionType.AGGREGATE_BONDED);
        expect(transaction.innerTransactions[0].type).to.be.equal(TransactionType.TRANSFER);

        const expectedHex =
            '0801000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180414200000000000000002B02000000000000887DE1026EA57A350FF35BD13163D4C8D5E149A3DC281D3686400AD2906D15BC60000000000000005D000000000000009801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B600000000018054418026D27E1D0A26CA4E316F901E23E55C8711DB20DFBE8F3A0D0000000000000000746573742D6D657373616765000000';
        assertSerialization(aggregateTransaction, expectedHex);
    });

    it('should create LockFundTransaction', () => {
        const aggregateTransaction = AggregateTransaction.createBonded(Deadline.createFromDTO('555'), [], NetworkType.PRIVATE_TEST, []);
        const signedTransaction = account.sign(aggregateTransaction, generationHash);
        const lockTransaction = LockFundsTransaction.create(
            Deadline.createFromDTO('555'),
            NetworkCurrencyLocal.createRelative(10),
            UInt64.fromUint(10),
            signedTransaction,
            NetworkType.PRIVATE_TEST,
        );

        const signedLockFundTransaction = lockTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedLockFundTransaction.payload) as LockFundsTransaction;

        deepEqual(transaction.mosaic.id.id, NetworkCurrencyLocal.namespaceId!.id);
        expect(transaction.mosaic.amount.compact()).to.be.equal(10000000);
        expect(transaction.hash).to.be.equal(signedTransaction.hash);

        const expectedHex =
            'A800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180414200000000000000002B0200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
        assertSerialization(aggregateTransaction, expectedHex);
    });

    it('should create an AccountKeyLinkTransaction object with link action', () => {
        const accountLinkTransaction = AccountKeyLinkTransaction.create(
            Deadline.createFromDTO('555'),
            account.publicKey,
            LinkAction.Link,
            NetworkType.PRIVATE_TEST,
        );

        assertSerialization(
            accountLinkTransaction,
            'A1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001804C4100000000000000002B020000000000009801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B601',
        );

        const signedTransaction = accountLinkTransaction.signWith(account, generationHash);
        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as AccountKeyLinkTransaction;

        expect(transaction.linkAction).to.be.equal(1);
        expect(transaction.linkedPublicKey).to.be.equal(account.publicKey);
    });

    it('should create an VrfKeyLinkTransaction object with link action', () => {
        const vrfKeyLinkTransaction = VrfKeyLinkTransaction.create(
            Deadline.createFromDTO('555'),
            account.publicKey,
            LinkAction.Link,
            NetworkType.PRIVATE_TEST,
        );

        assertSerialization(
            vrfKeyLinkTransaction,
            'A100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180434200000000000000002B020000000000009801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B601',
        );

        const signedTransaction = vrfKeyLinkTransaction.signWith(account, generationHash);
        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as VrfKeyLinkTransaction;

        expect(transaction.linkAction).to.be.equal(1);
        expect(transaction.linkedPublicKey).to.be.equal(account.publicKey);
    });

    it('should create an NodeKeyLinkTransaction object with link action', () => {
        const nodeKeyLinkTransaction = NodeKeyLinkTransaction.create(
            Deadline.createFromDTO('555'),
            account.publicKey,
            LinkAction.Link,
            NetworkType.PRIVATE_TEST,
        );

        assertSerialization(
            nodeKeyLinkTransaction,
            'A1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001804C4200000000000000002B020000000000009801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B601',
        );

        const signedTransaction = nodeKeyLinkTransaction.signWith(account, generationHash);
        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as NodeKeyLinkTransaction;

        expect(transaction.linkAction).to.be.equal(1);
        expect(transaction.linkedPublicKey).to.be.equal(account.publicKey);
    });

    it('should create an VotingKeyLinkTransaction object with link action', () => {
        const key = '3D6BA38329836BFD245489FA3C5700FA6349259D06EAF92ECE2034AA0A33045B013B49349FB9E8832D24858D03A6E022';
        const votingKeyLinkTransaction = VotingKeyLinkTransaction.create(
            Deadline.createFromDTO('555'),
            key,
            1,
            3,
            LinkAction.Link,
            NetworkType.PRIVATE_TEST,
        );

        assertSerialization(
            votingKeyLinkTransaction,
            'B900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180434100000000000000002B020000000000003D6BA38329836BFD245489FA3C5700FA6349259D06EAF92ECE2034AA0A33045B013B49349FB9E8832D24858D03A6E022010000000300000001',
        );

        const signedTransaction = votingKeyLinkTransaction.signWith(account, generationHash);
        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as VotingKeyLinkTransaction;

        expect(transaction.linkAction).to.be.equal(1);
        expect(transaction.startEpoch.toString()).to.be.equal('1');
        expect(transaction.endEpoch.toString()).to.be.equal('3');
        expect(transaction.linkedPublicKey).to.be.equal(key);
    });

    it('should create NamespaceRegistrationTransaction - Root', () => {
        const registerNamespaceTransaction = NamespaceRegistrationTransaction.createRootNamespace(
            Deadline.createFromDTO('555'),
            'root-test-namespace',
            UInt64.fromUint(1000),
            NetworkType.PRIVATE_TEST,
        );

        assertSerialization(
            registerNamespaceTransaction,
            'A5000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001804E4100000000000000002B02000000000000E803000000000000CFCBE72D994BE69B0013726F6F742D746573742D6E616D657370616365',
        );

        const signedTransaction = registerNamespaceTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as NamespaceRegistrationTransaction;

        expect(transaction.registrationType).to.be.equal(NamespaceRegistrationType.RootNamespace);
        expect(transaction.namespaceName).to.be.equal('root-test-namespace');
    });

    it('should create NamespaceRegistrationTransaction - Sub', () => {
        const registerNamespaceTransaction = NamespaceRegistrationTransaction.createSubNamespace(
            Deadline.createFromDTO('555'),
            'root-test-namespace',
            'parent-test-namespace',
            NetworkType.PRIVATE_TEST,
        );

        const signedTransaction = registerNamespaceTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTransaction.payload) as NamespaceRegistrationTransaction;

        expect(transaction.registrationType).to.be.equal(NamespaceRegistrationType.SubNamespace);
        expect(transaction.namespaceName).to.be.equal('root-test-namespace');
    });

    it('should create MosaicGlobalRestrictionTransaction', () => {
        const mosaicGlobalRestrictionTransaction = MosaicGlobalRestrictionTransaction.create(
            Deadline.createFromDTO('555'),
            new MosaicId(UInt64.fromUint(1).toDTO()),
            UInt64.fromUint(4444),
            UInt64.fromUint(0),
            MosaicRestrictionType.NONE,
            UInt64.fromUint(0),
            MosaicRestrictionType.GE,
            NetworkType.PRIVATE_TEST,
        );

        assertSerialization(
            mosaicGlobalRestrictionTransaction,
            'AA00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180514100000000000000002B02000000000000010000000000000000000000000000005C11000000000000000000000000000000000000000000000006',
        );

        const signedTx = mosaicGlobalRestrictionTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTx.payload) as MosaicGlobalRestrictionTransaction;

        expect(transaction.type).to.be.equal(TransactionType.MOSAIC_GLOBAL_RESTRICTION);
        expect(transaction.mosaicId.toHex()).to.be.equal(new MosaicId(UInt64.fromUint(1).toDTO()).toHex());
        expect(transaction.referenceMosaicId.toHex()).to.be.equal(new MosaicId(UInt64.fromUint(0).toDTO()).toHex());
        expect(transaction.restrictionKey.toHex()).to.be.equal(UInt64.fromUint(4444).toHex());
        expect(transaction.previousRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(0).toHex());
        expect(transaction.previousRestrictionType).to.be.equal(MosaicRestrictionType.NONE);
        expect(transaction.newRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(0).toHex());
        expect(transaction.newRestrictionType).to.be.equal(MosaicRestrictionType.GE);
    });

    it('should create MosaicAddressRestrictionTransaction', () => {
        const mosaicAddressRestrictionTransaction = MosaicAddressRestrictionTransaction.create(
            Deadline.createFromDTO('555'),
            new MosaicId(UInt64.fromUint(1).toDTO()),
            UInt64.fromUint(4444),
            account.address,
            UInt64.fromUint(0),
            NetworkType.PRIVATE_TEST,
            UInt64.fromUint(0),
        );

        assertSerialization(
            mosaicAddressRestrictionTransaction,
            'B800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180514200000000000000002B0200000000000001000000000000005C110000000000000000000000000000000000000000000080D66C33420E5411995BACFCA2B28CF1C9F5DD7AB1A9C05C',
        );

        const signedTx = mosaicAddressRestrictionTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTx.payload) as MosaicAddressRestrictionTransaction;

        expect(transaction.type).to.be.equal(TransactionType.MOSAIC_ADDRESS_RESTRICTION);
        expect(transaction.mosaicId.toHex()).to.be.equal(new MosaicId(UInt64.fromUint(1).toDTO()).toHex());
        expect(transaction.restrictionKey.toHex()).to.be.equal(UInt64.fromUint(4444).toHex());
        expect(transaction.targetAddressToString()).to.be.equal(account.address.plain());
        expect(transaction.previousRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(0).toHex());
        expect(transaction.newRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(0).toHex());
    });

    it('should create MosaicAddressRestrictionTransaction - MosaicAlias', () => {
        const mosaicAddressRestrictionTransaction = MosaicAddressRestrictionTransaction.create(
            Deadline.createFromDTO('555'),
            new NamespaceId('test'),
            UInt64.fromUint(4444),
            account.address,
            UInt64.fromUint(0),
            NetworkType.PRIVATE_TEST,
            UInt64.fromUint(0),
        );

        assertSerialization(
            mosaicAddressRestrictionTransaction,
            'B800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180514200000000000000002B020000000000006EC265194C0501D45C110000000000000000000000000000000000000000000080D66C33420E5411995BACFCA2B28CF1C9F5DD7AB1A9C05C',
        );

        const signedTx = mosaicAddressRestrictionTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTx.payload) as MosaicAddressRestrictionTransaction;

        expect(transaction.type).to.be.equal(TransactionType.MOSAIC_ADDRESS_RESTRICTION);
        expect(transaction.mosaicId.toHex()).to.be.equal(new NamespaceId('test').toHex());
        expect(transaction.mosaicId instanceof NamespaceId).to.be.true;
        expect(transaction.restrictionKey.toHex()).to.be.equal(UInt64.fromUint(4444).toHex());
        expect(transaction.targetAddressToString()).to.be.equal(account.address.plain());
        expect(transaction.previousRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(0).toHex());
        expect(transaction.newRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(0).toHex());
    });

    it('should create AddressMetadataTransaction', () => {
        const accountMetadataTransaction = AccountMetadataTransaction.create(
            Deadline.createFromDTO('555'),
            account.address,
            UInt64.fromUint(1000),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            NetworkType.PRIVATE_TEST,
        );

        assertSerialization(
            accountMetadataTransaction,
            'AE00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180444100000000000000002B0200000000000080D66C33420E5411995BACFCA2B28CF1C9F5DD7AB1A9C05CE80300000000000001000A0000000000000000000000',
        );

        const signedTx = accountMetadataTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTx.payload) as AccountMetadataTransaction;

        expect(transaction.type).to.be.equal(TransactionType.ACCOUNT_METADATA);
        expect(transaction.targetAddress.equals(account.address)).to.be.true;
        expect(transaction.scopedMetadataKey.toHex()).to.be.equal(UInt64.fromUint(1000).toHex());
        expect(transaction.valueSizeDelta).to.be.equal(1);
        expect(Convert.uint8ToHex(transaction.value)).to.be.equal(Convert.uint8ToHex(new Uint8Array(10)));
    });

    it('should create MosaicMetadataTransaction', () => {
        const mosaicMetadataTransaction = MosaicMetadataTransaction.create(
            Deadline.createFromDTO('555'),
            account.address,
            UInt64.fromUint(1000),
            new MosaicId([2262289484, 3405110546]),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            NetworkType.PRIVATE_TEST,
        );

        const expectedHex =
            'B600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180444200000000000000002B0200000000000080D66C33420E5411995BACFCA2B28CF1C9F5DD7AB1A9C05CE8030000000000004CCCD78612DDF5CA01000A0000000000000000000000';

        assertSerialization(mosaicMetadataTransaction, expectedHex);

        const signedTx = mosaicMetadataTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTx.payload) as MosaicMetadataTransaction;

        expect(transaction.type).to.be.equal(TransactionType.MOSAIC_METADATA);
        expect(transaction.targetAddress.equals(account.address)).to.be.true;
        expect(transaction.scopedMetadataKey.toHex()).to.be.equal(UInt64.fromUint(1000).toHex());
        expect(transaction.valueSizeDelta).to.be.equal(1);
        expect(transaction.targetMosaicId.toHex()).to.be.equal(new MosaicId([2262289484, 3405110546]).toHex());
        expect(Convert.uint8ToHex(transaction.value)).to.be.equal(Convert.uint8ToHex(new Uint8Array(10)));
    });

    it('should create NamespaceMetadataTransaction', () => {
        const namespaceMetadataTransaction = NamespaceMetadataTransaction.create(
            Deadline.createFromDTO('555'),
            account.address,
            UInt64.fromUint(1000),
            new NamespaceId([2262289484, 3405110546]),
            1,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            NetworkType.PRIVATE_TEST,
        );

        const expectedHex =
            'B600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180444300000000000000002B0200000000000080D66C33420E5411995BACFCA2B28CF1C9F5DD7AB1A9C05CE8030000000000004CCCD78612DDF5CA01000A0000000000000000000000';

        assertSerialization(namespaceMetadataTransaction, expectedHex);

        const signedTx = namespaceMetadataTransaction.signWith(account, generationHash);

        const transaction = TransactionMapping.createFromPayload(signedTx.payload) as NamespaceMetadataTransaction;

        expect(transaction.type).to.be.equal(TransactionType.NAMESPACE_METADATA);
        expect(transaction.targetAddress.equals(account.address)).to.be.true;
        expect(transaction.scopedMetadataKey.toHex()).to.be.equal(UInt64.fromUint(1000).toHex());
        expect(transaction.valueSizeDelta).to.be.equal(1);
        expect(transaction.targetNamespaceId.toHex()).to.be.equal(new NamespaceId([2262289484, 3405110546]).toHex());
        expect(Convert.uint8ToHex(transaction.value)).to.be.equal(Convert.uint8ToHex(new Uint8Array(10)));
    });

    it('should throw error with invalid type', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.createFromDTO('555'),
            Address.createFromRawAddress('QATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA367I6OQ'),
            [NetworkCurrencyLocal.createRelative(100)],
            PlainMessage.create('test-message'),
            NetworkType.PRIVATE_TEST,
        );

        const signedTransaction = transferTransaction.signWith(account, generationHash);
        const wrongType = signedTransaction.payload.substring(0, 219) + '0000' + signedTransaction.payload.substring(224);

        expect(() => {
            TransactionMapping.createFromPayload(wrongType) as TransferTransaction;
        }).to.throw();
    });
});

describe('TransactionMapping - createFromDTO (Transaction.toJSON() feed)', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = TestingAccount;
    });

    it('should create TransferTransaction - Address', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.createFromDTO('555'),
            Address.createFromRawAddress('QATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA367I6OQ'),
            [NetworkCurrencyLocal.createRelative(100)],
            PlainMessage.create('test-message'),
            NetworkType.PRIVATE_TEST,
        );

        const expectedHex =
            'BD00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180544100000000000000002B020000000000008026D27E1D0A26CA4E316F901E23E55C8711DB20DFBE8F3A0D0001000000000044B262C46CEABB8500E1F5050000000000746573742D6D657373616765';

        assertSerialization(transferTransaction, expectedHex);

        const transaction = TransactionMapping.createFromDTO(transferTransaction.toJSON()) as TransferTransaction;

        expect((transaction.recipientAddress as Address).plain()).to.be.equal('QATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA367I6OQ');
        expect(transaction.message.payload).to.be.equal('test-message');
    });

    it('should create TransferTransaction - NamespaceId', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.createFromDTO('555'),
            new NamespaceId([33347626, 3779697293]),
            [NetworkCurrencyLocal.createRelative(100)],
            PlainMessage.create('test-message'),
            NetworkType.PRIVATE_TEST,
        );

        const expectedHex =
            'BD00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180544100000000000000002B02000000000000812AD8FC018D9A49E10000000000000000000000000000000D0001000000000044B262C46CEABB8500E1F5050000000000746573742D6D657373616765';

        assertSerialization(transferTransaction, expectedHex);

        const transaction = TransactionMapping.createFromDTO(transferTransaction.toJSON()) as TransferTransaction;
        expect((transaction.recipientAddress as NamespaceId).id.toHex().toUpperCase()).to.be.equal(
            new UInt64([33347626, 3779697293]).toHex(),
        );
        expect(transaction.message.payload).to.be.equal('test-message');
    });

    it('should create TransferTransaction - Encrypted Message', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.createFromDTO('555'),
            Address.createFromRawAddress('QATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA367I6OQ'),
            [NetworkCurrencyLocal.createRelative(100)],
            new EncryptedMessage('12324556'),
            NetworkType.PRIVATE_TEST,
        );

        const expectedHex =
            'B900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180544100000000000000002B020000000000008026D27E1D0A26CA4E316F901E23E55C8711DB20DFBE8F3A090001000000000044B262C46CEABB8500E1F50500000000013132333234353536';

        assertSerialization(transferTransaction, expectedHex);

        const transaction = TransactionMapping.createFromDTO(transferTransaction.toJSON()) as TransferTransaction;

        expect((transaction.recipientAddress as Address).plain()).to.be.equal('QATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA367I6OQ');
        expect(transaction.message.type).to.be.equal(MessageType.EncryptedMessage);
    });

    it('should create AccountKeyLinkTransaction', () => {
        const accountLinkTransaction = AccountKeyLinkTransaction.create(
            Deadline.createFromDTO('555'),
            account.publicKey,
            LinkAction.Link,
            NetworkType.PRIVATE_TEST,
        );

        const transaction = TransactionMapping.createFromDTO(accountLinkTransaction.toJSON()) as AccountKeyLinkTransaction;

        expect(transaction.linkedPublicKey).to.be.equal(account.publicKey);
        expect(transaction.linkAction).to.be.equal(LinkAction.Link);
    });

    it('should create VrfKeyLinkTransaction', () => {
        const vrfKeyLinkTransaction = VrfKeyLinkTransaction.create(
            Deadline.createFromDTO('555'),
            account.publicKey,
            LinkAction.Link,
            NetworkType.PRIVATE_TEST,
        );

        const expectedHex =
            'A100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180434200000000000000002B020000000000009801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B601';

        assertSerialization(vrfKeyLinkTransaction, expectedHex);

        const transaction = TransactionMapping.createFromDTO(vrfKeyLinkTransaction.toJSON()) as VrfKeyLinkTransaction;

        expect(transaction.linkedPublicKey).to.be.equal(account.publicKey);
        expect(transaction.linkAction).to.be.equal(LinkAction.Link);
    });

    it('should create NodeKeyLinkTransaction', () => {
        const nodeKeyLinkTransaction = NodeKeyLinkTransaction.create(
            Deadline.createFromDTO('555'),
            account.publicKey,
            LinkAction.Link,
            NetworkType.PRIVATE_TEST,
        );

        const expectedHex =
            'A1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001804C4200000000000000002B020000000000009801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B601';

        assertSerialization(nodeKeyLinkTransaction, expectedHex);

        const transaction = TransactionMapping.createFromDTO(nodeKeyLinkTransaction.toJSON()) as NodeKeyLinkTransaction;

        expect(transaction.linkedPublicKey).to.be.equal(account.publicKey);
        expect(transaction.linkAction).to.be.equal(LinkAction.Link);
    });

    it('should create VotingKeyLinkTransaction', () => {
        const key = 'C614558647D02037384A2FECA80ACE95B235D9B9D90035FA46102FE79ECCBA7501746FAAD1C24A2FAB8AB3C7E6EFBD90';
        const votingKeyLinkTransaction = VotingKeyLinkTransaction.create(
            Deadline.createFromDTO('555'),
            key,
            1,
            3,
            LinkAction.Link,
            NetworkType.PRIVATE_TEST,
        );

        const expectedHex =
            'B900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180434100000000000000002B02000000000000C614558647D02037384A2FECA80ACE95B235D9B9D90035FA46102FE79ECCBA7501746FAAD1C24A2FAB8AB3C7E6EFBD90010000000300000001';

        assertSerialization(votingKeyLinkTransaction, expectedHex);

        const transaction = TransactionMapping.createFromDTO(votingKeyLinkTransaction.toJSON()) as VotingKeyLinkTransaction;

        expect(transaction.linkedPublicKey).to.be.equal(key);
        expect(transaction.startEpoch.toString()).to.be.equal('1');
        expect(transaction.endEpoch.toString()).to.be.equal('3');
        expect(transaction.linkAction).to.be.equal(LinkAction.Link);
    });
    it('should create AccountRestrictionAddressTransaction', () => {
        const address = Address.createFromRawAddress('QATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA367I6OQ');
        const addressRestrictionTransaction = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
            Deadline.createFromDTO('555'),
            AddressRestrictionFlag.AllowIncomingAddress,
            [address],
            [],
            NetworkType.PRIVATE_TEST,
        );

        const expectedHex =
            'A000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180504100000000000000002B0200000000000001000100000000008026D27E1D0A26CA4E316F901E23E55C8711DB20DFBE8F3A';

        assertSerialization(addressRestrictionTransaction, expectedHex);

        const transaction = TransactionMapping.createFromDTO(
            addressRestrictionTransaction.toJSON(),
        ) as AccountAddressRestrictionTransaction;

        expect((transaction.restrictionAdditions[0] as Address).plain()).to.be.equal('QATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA367I6OQ');
        expect(transaction.restrictionFlags).to.be.equal(AddressRestrictionFlag.AllowIncomingAddress);
        expect(transaction.restrictionDeletions.length).to.be.equal(0);
    });

    it('should create AccountRestrictionMosaicTransaction', () => {
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicRestrictionTransaction = AccountRestrictionTransaction.createMosaicRestrictionModificationTransaction(
            Deadline.createFromDTO('555'),
            MosaicRestrictionFlag.AllowMosaic,
            [mosaicId],
            [],
            NetworkType.PRIVATE_TEST,
        );

        const expectedHex =
            '9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180504200000000000000002B0200000000000002000100000000004CCCD78612DDF5CA';

        assertSerialization(mosaicRestrictionTransaction, expectedHex);

        const transaction = TransactionMapping.createFromDTO(mosaicRestrictionTransaction.toJSON()) as AccountMosaicRestrictionTransaction;

        expect(transaction.type).to.be.equal(TransactionType.ACCOUNT_MOSAIC_RESTRICTION);
        expect(transaction.restrictionFlags).to.be.equal(MosaicRestrictionFlag.AllowMosaic);
        expect(transaction.restrictionAdditions.length).to.be.equal(1);
    });

    it('should create AccountRestrictionOperationTransaction', () => {
        const operation = TransactionType.ADDRESS_ALIAS;
        const operationRestrictionTransaction = AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(
            Deadline.createFromDTO('555'),
            OperationRestrictionFlag.AllowOutgoingTransactionType,
            [operation],
            [],
            NetworkType.PRIVATE_TEST,
        );

        const expectedHex =
            '8A00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180504300000000000000002B0200000000000004400100000000004E42';
        assertSerialization(operationRestrictionTransaction, expectedHex);

        const transaction = TransactionMapping.createFromDTO(
            operationRestrictionTransaction.toJSON(),
        ) as AccountMosaicRestrictionTransaction;

        expect(transaction.type).to.be.equal(TransactionType.ACCOUNT_OPERATION_RESTRICTION);
        expect(transaction.restrictionFlags).to.be.equal(OperationRestrictionFlag.AllowOutgoingTransactionType);
        expect(transaction.restrictionAdditions.length).to.be.equal(1);
    });

    it('should create AddressAliasTransaction', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const address = Address.createFromRawAddress('QATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA367I6OQ');
        const addressAliasTransaction = AddressAliasTransaction.create(
            Deadline.createFromDTO('555'),
            AliasAction.Link,
            namespaceId,
            address,
            NetworkType.PRIVATE_TEST,
        );

        const expectedHex =
            'A1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001804E4200000000000000002B020000000000002AD8FC018D9A49E18026D27E1D0A26CA4E316F901E23E55C8711DB20DFBE8F3A01';
        assertSerialization(addressAliasTransaction, expectedHex);

        const transaction = TransactionMapping.createFromDTO(addressAliasTransaction.toJSON()) as AddressAliasTransaction;

        expect(transaction.type).to.be.equal(TransactionType.ADDRESS_ALIAS);
        expect(transaction.aliasAction).to.be.equal(AliasAction.Link);
    });

    it('should create MosaicAliasTransaction', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicAliasTransaction = MosaicAliasTransaction.create(
            Deadline.createFromDTO('555'),
            AliasAction.Link,
            namespaceId,
            mosaicId,
            NetworkType.PRIVATE_TEST,
        );

        const expectedHex =
            '91000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001804E4300000000000000002B020000000000002AD8FC018D9A49E14CCCD78612DDF5CA01';
        assertSerialization(mosaicAliasTransaction, expectedHex);

        const transaction = TransactionMapping.createFromDTO(mosaicAliasTransaction.toJSON()) as MosaicAliasTransaction;

        expect(transaction.type).to.be.equal(TransactionType.MOSAIC_ALIAS);
        expect(transaction.aliasAction).to.be.equal(AliasAction.Link);
    });

    it('should create MosaicDefinitionTransaction', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.createFromDTO('555'),
            MosaicNonce.createFromUint8Array(new Uint8Array([0xe6, 0xde, 0x84, 0xb8])), // nonce
            new MosaicId(UInt64.fromUint(1).toDTO()), // ID
            MosaicFlags.create(false, false, false),
            3,
            UInt64.fromUint(1000),
            NetworkType.PRIVATE_TEST,
        );

        const expectedHex =
            '96000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001804D4100000000000000002B020000000000000100000000000000E803000000000000E6DE84B80003';
        assertSerialization(mosaicDefinitionTransaction, expectedHex);

        const transaction = TransactionMapping.createFromDTO(mosaicDefinitionTransaction.toJSON()) as MosaicDefinitionTransaction;

        expect(transaction.type).to.be.equal(TransactionType.MOSAIC_DEFINITION);
        expect(transaction.flags.supplyMutable).to.be.equal(false);
        expect(transaction.flags.transferable).to.be.equal(false);
        expect(transaction.flags.transferable).to.be.equal(false);
        expect(transaction.divisibility).to.be.equal(3);
    });

    it('should create MosaicSupplyChangeTransaction', () => {
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
            Deadline.createFromDTO('555'),
            mosaicId,
            MosaicSupplyChangeAction.Increase,
            UInt64.fromUint(10),
            NetworkType.PRIVATE_TEST,
        );

        const expectedHex =
            '91000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001804D4200000000000000002B020000000000004CCCD78612DDF5CA0A0000000000000001';
        assertSerialization(mosaicSupplyChangeTransaction, expectedHex);

        const transaction = TransactionMapping.createFromDTO(mosaicSupplyChangeTransaction.toJSON()) as MosaicSupplyChangeTransaction;

        expect(transaction.type).to.be.equal(TransactionType.MOSAIC_SUPPLY_CHANGE);
        expect(transaction.action).to.be.equal(MosaicSupplyChangeAction.Increase);
    });

    it('should create SecretLockTransaction', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const recipientAddress = Address.createFromRawAddress('QCOXVZMAZJTT4I3F7EAZYGNGR77D6WPTREIM2RQ');
        const secretLockTransaction = SecretLockTransaction.create(
            Deadline.createFromDTO('555'),
            NetworkCurrencyLocal.createAbsolute(10),
            UInt64.fromUint(100),
            LockHashAlgorithm.Op_Sha3_256,
            sha3_256.create().update(Convert.hexToUint8(proof)).hex(),
            recipientAddress,
            NetworkType.PRIVATE_TEST,
        );

        const expectedHex =
            'D100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180524100000000000000002B02000000000000809D7AE580CA673E2365F9019C19A68FFE3F59F38910CD469B3155B37159DA50AA52D5967C509B410F5A36A3B1E31ECB5AC76675D79B4A5E44B262C46CEABB850A00000000000000640000000000000000';
        assertSerialization(secretLockTransaction, expectedHex);

        const transaction = TransactionMapping.createFromDTO(secretLockTransaction.toJSON()) as SecretLockTransaction;

        expect(transaction.type).to.be.equal(TransactionType.SECRET_LOCK);
        expect(transaction.hashAlgorithm).to.be.equal(LockHashAlgorithm.Op_Sha3_256);
    });

    it('should create SecretLockTransaction - Address alias', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const recipientAddress = new NamespaceId('test');
        const secretLockTransaction = SecretLockTransaction.create(
            Deadline.createFromDTO('555'),
            NetworkCurrencyLocal.createAbsolute(10),
            UInt64.fromUint(100),
            LockHashAlgorithm.Op_Sha3_256,
            sha3_256.create().update(Convert.hexToUint8(proof)).hex(),
            recipientAddress,
            NetworkType.PRIVATE_TEST,
        );

        const expectedHex =
            'D100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180524100000000000000002B02000000000000816EC265194C0501D40000000000000000000000000000009B3155B37159DA50AA52D5967C509B410F5A36A3B1E31ECB5AC76675D79B4A5E44B262C46CEABB850A00000000000000640000000000000000';
        assertSerialization(secretLockTransaction, expectedHex);

        const transaction = TransactionMapping.createFromDTO(secretLockTransaction.toJSON()) as SecretLockTransaction;

        expect(transaction.type).to.be.equal(TransactionType.SECRET_LOCK);
        expect(transaction.hashAlgorithm).to.be.equal(LockHashAlgorithm.Op_Sha3_256);
        expect((transaction.recipientAddress as NamespaceId).id.toHex()).to.be.equal(recipientAddress.toHex());
    });

    it('should create SecretLockTransaction - resolved Mosaic', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const recipientAddress = Address.createFromRawAddress('QCOXVZMAZJTT4I3F7EAZYGNGR77D6WPTREIM2RQ');
        const secretLockTransaction = SecretLockTransaction.create(
            Deadline.createFromDTO('555'),
            new Mosaic(new MosaicId([1, 1]), UInt64.fromUint(10)),
            UInt64.fromUint(100),
            LockHashAlgorithm.Op_Sha3_256,
            sha3_256.create().update(Convert.hexToUint8(proof)).hex(),
            recipientAddress,
            NetworkType.PRIVATE_TEST,
        );

        const expectedHex =
            'D100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180524100000000000000002B02000000000000809D7AE580CA673E2365F9019C19A68FFE3F59F38910CD469B3155B37159DA50AA52D5967C509B410F5A36A3B1E31ECB5AC76675D79B4A5E01000000010000000A00000000000000640000000000000000';
        assertSerialization(secretLockTransaction, expectedHex);

        const transaction = TransactionMapping.createFromDTO(secretLockTransaction.toJSON()) as SecretLockTransaction;

        expect(transaction.type).to.be.equal(TransactionType.SECRET_LOCK);
        expect(transaction.hashAlgorithm).to.be.equal(LockHashAlgorithm.Op_Sha3_256);
        expect(transaction.mosaic.id.toHex()).to.be.equal(new MosaicId([1, 1]).toHex());
    });

    it('should create SecretProofTransaction', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const secretProofTransaction = SecretProofTransaction.create(
            Deadline.createFromDTO('555'),
            LockHashAlgorithm.Op_Sha3_256,
            sha3_256.create().update(Convert.hexToUint8(proof)).hex(),
            account.address,
            proof,
            NetworkType.PRIVATE_TEST,
        );

        const expectedHex =
            'DB00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180524200000000000000002B0200000000000080D66C33420E5411995BACFCA2B28CF1C9F5DD7AB1A9C05C9B3155B37159DA50AA52D5967C509B410F5A36A3B1E31ECB5AC76675D79B4A5E200000B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        assertSerialization(secretProofTransaction, expectedHex);

        const transaction = TransactionMapping.createFromDTO(secretProofTransaction.toJSON()) as SecretProofTransaction;

        expect(transaction.type).to.be.equal(TransactionType.SECRET_PROOF);
        expect(transaction.hashAlgorithm).to.be.equal(LockHashAlgorithm.Op_Sha3_256);
        expect(transaction.secret).to.be.equal(sha3_256.create().update(Convert.hexToUint8(proof)).hex());
        deepEqual(transaction.recipientAddress, account.address);
        expect(transaction.proof).to.be.equal(proof);
    });

    it('should create SecretProofTransaction - Address alias', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const recipientAddress = new NamespaceId('test');
        const secretProofTransaction = SecretProofTransaction.create(
            Deadline.createFromDTO('555'),
            LockHashAlgorithm.Op_Sha3_256,
            sha3_256.create().update(Convert.hexToUint8(proof)).hex(),
            recipientAddress,
            proof,
            NetworkType.PRIVATE_TEST,
        );

        const expectedHex =
            'DB00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180524200000000000000002B02000000000000816EC265194C0501D40000000000000000000000000000009B3155B37159DA50AA52D5967C509B410F5A36A3B1E31ECB5AC76675D79B4A5E200000B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        assertSerialization(secretProofTransaction, expectedHex);

        const transaction = TransactionMapping.createFromDTO(secretProofTransaction.toJSON()) as SecretProofTransaction;

        expect(transaction.type).to.be.equal(TransactionType.SECRET_PROOF);
        expect(transaction.hashAlgorithm).to.be.equal(LockHashAlgorithm.Op_Sha3_256);
        expect(transaction.secret).to.be.equal(sha3_256.create().update(Convert.hexToUint8(proof)).hex());
        expect(transaction.proof).to.be.equal(proof);
        expect((transaction.recipientAddress as NamespaceId).id.toHex()).to.be.equal(recipientAddress.toHex());
    });

    it('should create ModifyMultiSigTransaction', () => {
        const modifyMultisigAccountTransaction = MultisigAccountModificationTransaction.create(
            Deadline.createFromDTO('555'),
            2,
            1,
            [Address.createFromPublicKey('B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6EC24', NetworkType.PRIVATE_TEST)],
            [],
            NetworkType.PRIVATE_TEST,
        );

        const expectedHex =
            'A000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180554100000000000000002B020000000000000102010000000000809FC4844A5206CFA44603EFA1FFC76FE9B0564D96735562';
        assertSerialization(modifyMultisigAccountTransaction, expectedHex);

        const transaction = TransactionMapping.createFromDTO(
            modifyMultisigAccountTransaction.toJSON(),
        ) as MultisigAccountModificationTransaction;

        expect(transaction.type).to.be.equal(TransactionType.MULTISIG_ACCOUNT_MODIFICATION);
        expect(transaction.minApprovalDelta).to.be.equal(2);
        expect(transaction.minRemovalDelta).to.be.equal(1);
    });

    it('should create AggregatedTransaction - Complete', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.createFromDTO('555'),
            Address.createFromRawAddress('QATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA367I6OQ'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.PRIVATE_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.createFromDTO('555'),
            [transferTransaction.toAggregate(account.publicAccount)],
            NetworkType.PRIVATE_TEST,
            [],
        );

        const expectedHex =
            '0801000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180414100000000000000002B02000000000000887DE1026EA57A350FF35BD13163D4C8D5E149A3DC281D3686400AD2906D15BC60000000000000005D000000000000009801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B600000000018054418026D27E1D0A26CA4E316F901E23E55C8711DB20DFBE8F3A0D0000000000000000746573742D6D657373616765000000';
        assertSerialization(aggregateTransaction, expectedHex);

        const transaction = TransactionMapping.createFromDTO(aggregateTransaction.toJSON()) as AggregateTransaction;

        expect(transaction.type).to.be.equal(TransactionType.AGGREGATE_COMPLETE);
        expect(transaction.innerTransactions.length).to.be.equal(1);
    });

    it('should create AggregatedTransaction - Bonded', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.createFromDTO('555'),
            Address.createFromRawAddress('QATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA367I6OQ'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.PRIVATE_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.createFromDTO('555'),
            [transferTransaction.toAggregate(account.publicAccount)],
            NetworkType.PRIVATE_TEST,
            [],
        );

        const expectedHex =
            '0801000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180414200000000000000002B02000000000000887DE1026EA57A350FF35BD13163D4C8D5E149A3DC281D3686400AD2906D15BC60000000000000005D000000000000009801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B600000000018054418026D27E1D0A26CA4E316F901E23E55C8711DB20DFBE8F3A0D0000000000000000746573742D6D657373616765000000';
        assertSerialization(aggregateTransaction, expectedHex);

        const transaction = TransactionMapping.createFromDTO(aggregateTransaction.toJSON()) as AggregateTransaction;

        expect(transaction.type).to.be.equal(TransactionType.AGGREGATE_BONDED);
        expect(transaction.innerTransactions.length).to.be.equal(1);
    });

    it('should create LockFundTransaction', () => {
        const aggregateTransaction = AggregateTransaction.createBonded(Deadline.createFromDTO('555'), [], NetworkType.PRIVATE_TEST, []);
        const signedTransaction = account.sign(aggregateTransaction, generationHash);
        const lockTransaction = LockFundsTransaction.create(
            Deadline.createFromDTO('555'),
            NetworkCurrencyLocal.createRelative(10),
            UInt64.fromUint(10),
            signedTransaction,
            NetworkType.PRIVATE_TEST,
        );

        const expectedHex =
            'B800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180484100000000000000002B0200000000000044B262C46CEABB8580969800000000000A000000000000001CA06931628814A9424220A13EE6B37F6F82C334EADEF62CAE7AE5F3C99602A9';
        assertSerialization(lockTransaction, expectedHex);

        const transaction = TransactionMapping.createFromDTO(lockTransaction.toJSON()) as LockFundsTransaction;

        expect(transaction.type).to.be.equal(TransactionType.HASH_LOCK);
        expect(transaction.hash).to.be.equal(signedTransaction.hash);
    });

    it('should create NamespaceRegistrationTransaction - Root', () => {
        const registerNamespaceTransaction = NamespaceRegistrationTransaction.createRootNamespace(
            Deadline.createFromDTO('555'),
            'root-test-namespace',
            UInt64.fromUint(1000),
            NetworkType.PRIVATE_TEST,
        );

        const expectedHex =
            'A5000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001804E4100000000000000002B02000000000000E803000000000000CFCBE72D994BE69B0013726F6F742D746573742D6E616D657370616365';
        assertSerialization(registerNamespaceTransaction, expectedHex);

        const transaction = TransactionMapping.createFromDTO(registerNamespaceTransaction.toJSON()) as NamespaceRegistrationTransaction;

        expect(transaction.type).to.be.equal(TransactionType.NAMESPACE_REGISTRATION);
    });

    it('should create NamespaceRegistrationTransaction - Sub', () => {
        const registerNamespaceTransaction = NamespaceRegistrationTransaction.createSubNamespace(
            Deadline.createFromDTO('555'),
            'root-test-namespace',
            new NamespaceId([4294967295, 4294967295]),
            NetworkType.PRIVATE_TEST,
        );

        const expectedHex =
            'A5000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001804E4100000000000000002B02000000000000FFFFFFFFFFFFFFFFCFCBE72D994BE69B0113726F6F742D746573742D6E616D657370616365';
        assertSerialization(registerNamespaceTransaction, expectedHex);

        const transaction = TransactionMapping.createFromDTO(registerNamespaceTransaction.toJSON()) as NamespaceRegistrationTransaction;

        expect(transaction.type).to.be.equal(TransactionType.NAMESPACE_REGISTRATION);
    });

    it('should create MosaicGlobalRestrictionTransaction', () => {
        const mosaicGlobalRestrictionTransaction = MosaicGlobalRestrictionTransaction.create(
            Deadline.createFromDTO('555'),
            new MosaicId(UInt64.fromUint(1).toDTO()),
            UInt64.fromUint(4444),
            UInt64.fromUint(0),
            MosaicRestrictionType.NONE,
            UInt64.fromUint(0),
            MosaicRestrictionType.GE,
            NetworkType.PRIVATE_TEST,
        );

        const expectedHex =
            'AA00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180514100000000000000002B02000000000000010000000000000000000000000000005C11000000000000000000000000000000000000000000000006';
        assertSerialization(mosaicGlobalRestrictionTransaction, expectedHex);

        const transaction = TransactionMapping.createFromDTO(
            mosaicGlobalRestrictionTransaction.toJSON(),
        ) as MosaicGlobalRestrictionTransaction;

        expect(transaction.type).to.be.equal(TransactionType.MOSAIC_GLOBAL_RESTRICTION);
        expect(transaction.mosaicId.id.compact()).to.be.equal(1);
        expect(transaction.referenceMosaicId.id.compact()).to.be.equal(0);
        expect(transaction.restrictionKey.toHex()).to.be.equal(UInt64.fromUint(4444).toHex());
        expect(transaction.previousRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(0).toHex());
        expect(transaction.previousRestrictionType).to.be.equal(MosaicRestrictionType.NONE);
        expect(transaction.newRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(0).toHex());
        expect(transaction.newRestrictionType).to.be.equal(MosaicRestrictionType.GE);
    });

    it('should create MosaicAddressRestrictionTransaction', () => {
        const mosaicAddressRestrictionTransaction = MosaicAddressRestrictionTransaction.create(
            Deadline.createFromDTO('555'),
            new MosaicId(UInt64.fromUint(1).toDTO()),
            UInt64.fromUint(4444),
            account.address,
            UInt64.fromUint(0),
            NetworkType.PRIVATE_TEST,
            UInt64.fromUint(0),
        );

        const expectedHex =
            'B800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180514200000000000000002B0200000000000001000000000000005C110000000000000000000000000000000000000000000080D66C33420E5411995BACFCA2B28CF1C9F5DD7AB1A9C05C';
        assertSerialization(mosaicAddressRestrictionTransaction, expectedHex);

        const transaction = TransactionMapping.createFromDTO(
            mosaicAddressRestrictionTransaction.toJSON(),
        ) as MosaicAddressRestrictionTransaction;

        expect(transaction.type).to.be.equal(TransactionType.MOSAIC_ADDRESS_RESTRICTION);
        expect(transaction.mosaicId.id.compact()).to.be.equal(1);
        expect(transaction.restrictionKey.toHex()).to.be.equal(UInt64.fromUint(4444).toHex());
        expect(transaction.targetAddressToString()).to.be.equal(account.address.plain());
        expect(transaction.previousRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(0).toHex());
        expect(transaction.newRestrictionValue.toHex()).to.be.equal(UInt64.fromUint(0).toHex());
    });

    it('should create AddressMetadataTransaction', () => {
        const accountMetadataTransaction = AccountMetadataTransaction.create(
            Deadline.createFromDTO('555'),
            account.address,
            UInt64.fromUint(1000),
            1,
            'Test Value',
            NetworkType.PRIVATE_TEST,
        );

        const expectedHex =
            'AE00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180444100000000000000002B0200000000000080D66C33420E5411995BACFCA2B28CF1C9F5DD7AB1A9C05CE80300000000000001000A00546573742056616C7565';
        assertSerialization(accountMetadataTransaction, expectedHex);

        const transaction = TransactionMapping.createFromDTO(accountMetadataTransaction.toJSON()) as AccountMetadataTransaction;

        expect(transaction.type).to.be.equal(TransactionType.ACCOUNT_METADATA);
        expect(transaction.targetAddress.equals(account.address)).to.be.true;
        expect(transaction.scopedMetadataKey.toHex()).to.be.equal(UInt64.fromUint(1000).toHex());
        expect(transaction.valueSizeDelta).to.be.equal(1);
        expect(transaction.value).to.be.equal('Test Value');
    });

    it('should create MosaicMetadataTransaction', () => {
        const mosaicMetadataTransaction = MosaicMetadataTransaction.create(
            Deadline.createFromDTO('555'),
            account.address,
            UInt64.fromUint(1000),
            new MosaicId([2262289484, 3405110546]),
            1,
            'Test Value',
            NetworkType.PRIVATE_TEST,
        );

        const expectedHex =
            'B600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180444200000000000000002B0200000000000080D66C33420E5411995BACFCA2B28CF1C9F5DD7AB1A9C05CE8030000000000004CCCD78612DDF5CA01000A00546573742056616C7565';
        assertSerialization(mosaicMetadataTransaction, expectedHex);

        const transaction = TransactionMapping.createFromDTO(mosaicMetadataTransaction.toJSON()) as MosaicMetadataTransaction;

        expect(transaction.type).to.be.equal(TransactionType.MOSAIC_METADATA);
        expect(transaction.targetAddress.equals(account.address)).to.be.true;
        expect(transaction.scopedMetadataKey.toHex()).to.be.equal(UInt64.fromUint(1000).toHex());
        expect(transaction.valueSizeDelta).to.be.equal(1);
        expect(transaction.targetMosaicId.toHex()).to.be.equal(new MosaicId([2262289484, 3405110546]).toHex());
        expect(transaction.value).to.be.equal('Test Value');
    });

    it('should create NamespaceMetadataTransaction', () => {
        const namespaceMetadataTransaction = NamespaceMetadataTransaction.create(
            Deadline.createFromDTO('555'),
            account.address,
            UInt64.fromUint(1000),
            new NamespaceId([2262289484, 3405110546]),
            1,
            'Test Value',
            NetworkType.PRIVATE_TEST,
        );

        const expectedHex =
            'B600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180444300000000000000002B0200000000000080D66C33420E5411995BACFCA2B28CF1C9F5DD7AB1A9C05CE8030000000000004CCCD78612DDF5CA01000A00546573742056616C7565';
        assertSerialization(namespaceMetadataTransaction, expectedHex);

        const transaction = TransactionMapping.createFromDTO(namespaceMetadataTransaction.toJSON()) as NamespaceMetadataTransaction;

        expect(transaction.type).to.be.equal(TransactionType.NAMESPACE_METADATA);
        expect(transaction.targetAddress.equals(account.address)).to.be.true;
        expect(transaction.scopedMetadataKey.toString()).to.be.equal(UInt64.fromUint(1000).toString());
        expect(transaction.valueSizeDelta).to.be.equal(1);
        expect(transaction.targetNamespaceId.toHex()).to.be.equal(new NamespaceId([2262289484, 3405110546]).toHex());
        expect(transaction.value).to.be.equal('Test Value');
    });

    it('should create from payload with persistent delegate message', () => {
        const transferTransaction = TransactionMapping.createFromPayload(
            '2401000000000000B69B5CB2CE79B5E06117D246E84CB21095BAC0E78A4F01E2D4E3F068EF2E3370B907495FE6BC9A130D05A8BDB49E8AD398FBA40569C921907297AB0D5778C00D2D13E2FDC654936417899AB63D709B9A7A603BA1D20557AA06CE5B2C9242F035000000000198544140420F00000000009A19B31107000000981E13520236DBBD06F8C08710289BD9CF598A01C29E04668400000000000000E201735761802AFECBD67E2DBA5D69157CE32874EFDD680E41B1BFFD12B781F84E8AD883920BBB50EA38AFE078E99EE5EE4BDFDA77E8C101EBD3100C0D471673471A61B23E513FC7E21F7803316B906A688F14AA75002913A3B57DD13469BC27CF8C82FD5C4C76867011AEDC7C4870D8C5AF9C175F0DA5A8E2AD3A327D868BFBA34A5E3D',
        ) as TransferTransaction;

        expect(transferTransaction.message.type).eq(MessageType.PersistentHarvestingDelegationMessage);
        expect(transferTransaction.message.payload).eq(
            MessageMarker.PersistentDelegationUnlock +
                'CBD67E2DBA5D69157CE32874EFDD680E41B1BFFD12B781F84E8AD883920BBB50EA38AFE078E99EE5EE4BDFDA77E8C101EBD3100C0D471673471A61B23E513FC7E21F7803316B906A688F14AA75002913A3B57DD13469BC27CF8C82FD5C4C76867011AEDC7C4870D8C5AF9C175F0DA5A8E2AD3A327D868BFBA34A5E3D',
        );
    });
});
