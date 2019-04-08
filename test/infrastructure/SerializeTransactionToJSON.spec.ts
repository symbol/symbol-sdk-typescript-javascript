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

import {deepEqual} from 'assert';
import { expect } from 'chai';
import { sha3_256 } from 'js-sha3';
import { convert } from 'nem2-library';
import { TransactionMapping } from '../../src/core/utils/TransactionMapping';
import { Account } from '../../src/model/account/Account';
import { Address } from '../../src/model/account/Address';
import { PropertyModificationType } from '../../src/model/account/PropertyModificationType';
import { PropertyType } from '../../src/model/account/PropertyType';
import { PublicAccount } from '../../src/model/account/PublicAccount';
import { NetworkType } from '../../src/model/blockchain/NetworkType';
import { MosaicId } from '../../src/model/mosaic/MosaicId';
import { MosaicNonce } from '../../src/model/mosaic/MosaicNonce';
import { MosaicProperties } from '../../src/model/mosaic/MosaicProperties';
import { MosaicSupplyType } from '../../src/model/mosaic/MosaicSupplyType';
import { NetworkCurrencyMosaic } from '../../src/model/mosaic/NetworkCurrencyMosaic';
import { AliasActionType } from '../../src/model/namespace/AliasActionType';
import { NamespaceId } from '../../src/model/namespace/NamespaceId';
import { NamespaceType } from '../../src/model/namespace/NamespaceType';
import { AccountLinkTransaction } from '../../src/model/transaction/AccountLinkTransaction';
import { AccountPropertyTransaction } from '../../src/model/transaction/AccountPropertyTransaction';
import { AddressAliasTransaction } from '../../src/model/transaction/AddressAliasTransaction';
import { AggregateTransaction } from '../../src/model/transaction/AggregateTransaction';
import { Deadline } from '../../src/model/transaction/Deadline';
import { HashType } from '../../src/model/transaction/HashType';
import { LinkAction } from '../../src/model/transaction/LinkAction';
import { LockFundsTransaction } from '../../src/model/transaction/LockFundsTransaction';
import { ModifyAccountPropertyAddressTransaction } from '../../src/model/transaction/ModifyAccountPropertyAddressTransaction';
import { ModifyMultisigAccountTransaction } from '../../src/model/transaction/ModifyMultisigAccountTransaction';
import { MosaicAliasTransaction } from '../../src/model/transaction/MosaicAliasTransaction';
import { MosaicDefinitionTransaction } from '../../src/model/transaction/MosaicDefinitionTransaction';
import { MosaicSupplyChangeTransaction } from '../../src/model/transaction/MosaicSupplyChangeTransaction';
import { MultisigCosignatoryModification } from '../../src/model/transaction/MultisigCosignatoryModification';
import { MultisigCosignatoryModificationType } from '../../src/model/transaction/MultisigCosignatoryModificationType';
import { PlainMessage } from '../../src/model/transaction/PlainMessage';
import { RegisterNamespaceTransaction } from '../../src/model/transaction/RegisterNamespaceTransaction';
import { SecretLockTransaction } from '../../src/model/transaction/SecretLockTransaction';
import { SecretProofTransaction } from '../../src/model/transaction/SecretProofTransaction';
import { TransactionType } from '../../src/model/transaction/TransactionType' ;
import { TransferTransaction } from '../../src/model/transaction/TransferTransaction';
import { UInt64 } from '../../src/model/UInt64';
import { TestingAccount } from '../conf/conf.spec';

describe('SerializeTransactionToJSON', () => {
    let account: Account;

    before(() => {
        account = TestingAccount;
    });

    it('should create AccountLinkTransaction', () => {
        const accountLinkTransaction = AccountLinkTransaction.create(
            Deadline.create(),
            account.publicKey,
            LinkAction.Link,
            NetworkType.MIJIN_TEST,
        );

        const json = accountLinkTransaction.toJSON();

        expect(json.transaction.remoteAccountKey).to.be.equal(account.publicKey);
        expect(json.transaction.linkAction).to.be.equal(LinkAction.Link);
    });

    it('should create AccountPropertyAddressTransaction', () => {
        const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressPropertyFilter = AccountPropertyTransaction.createAddressFilter(
            PropertyModificationType.Add,
            address,
        );
        const addressPropertyTransaction = AccountPropertyTransaction.createAddressPropertyModificationTransaction(
            Deadline.create(),
            PropertyType.AllowAddress,
            [addressPropertyFilter],
            NetworkType.MIJIN_TEST,
        );

        const json = addressPropertyTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.MODIFY_ACCOUNT_PROPERTY_ADDRESS);
        expect(json.transaction.propertyType).to.be.equal(PropertyType.AllowAddress);
        expect(json.transaction.modifications.length).to.be.equal(1);
    });

    it('should create AccountPropertyMosaicTransaction', () => {
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicPropertyFilter = AccountPropertyTransaction.createMosaicFilter(
            PropertyModificationType.Add,
            mosaicId,
        );
        const mosaicPropertyTransaction = AccountPropertyTransaction.createMosaicPropertyModificationTransaction(
            Deadline.create(),
            PropertyType.AllowMosaic,
            [mosaicPropertyFilter],
            NetworkType.MIJIN_TEST,
        );

        const json = mosaicPropertyTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.MODIFY_ACCOUNT_PROPERTY_MOSAIC);
        expect(json.transaction.propertyType).to.be.equal(PropertyType.AllowMosaic);
        expect(json.transaction.modifications.length).to.be.equal(1);
    });

    it('should create AccountPropertyMosaicTransaction', () => {
        const entityType = TransactionType.ADDRESS_ALIAS;
        const entityTypePropertyFilter = AccountPropertyTransaction.createEntityTypeFilter(
            PropertyModificationType.Add,
            entityType,
        );
        const entityTypePropertyTransaction = AccountPropertyTransaction.createEntityTypePropertyModificationTransaction(
            Deadline.create(),
            PropertyType.AllowTransaction,
            [entityTypePropertyFilter],
            NetworkType.MIJIN_TEST,
        );

        const json = entityTypePropertyTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.MODIFY_ACCOUNT_PROPERTY_ENTITY_TYPE);
        expect(json.transaction.propertyType).to.be.equal(PropertyType.AllowTransaction);
        expect(json.transaction.modifications.length).to.be.equal(1);
    });

    it('should create AddressAliasTransaction', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressAliasTransaction = AddressAliasTransaction.create(
            Deadline.create(),
            AliasActionType.Link,
            namespaceId,
            address,
            NetworkType.MIJIN_TEST,
        );

        const json = addressAliasTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.ADDRESS_ALIAS);
        expect(json.transaction.aliasAction).to.be.equal(AliasActionType.Link);
    });

    it('should create MosaicAliasTransaction', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicAliasTransaction = MosaicAliasTransaction.create(
            Deadline.create(),
            AliasActionType.Link,
            namespaceId,
            mosaicId,
            NetworkType.MIJIN_TEST,
        );
        const json = mosaicAliasTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.MOSAIC_ALIAS);
        expect(json.transaction.aliasAction).to.be.equal(AliasActionType.Link);

    });

    it('should create MosaicDefinitionTransaction', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(),
            new MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])), // nonce
            new MosaicId(UInt64.fromUint(1).toDTO()), // ID
            MosaicProperties.create({
                supplyMutable: false,
                transferable: false,
                levyMutable: false,
                divisibility: 3,
                duration: UInt64.fromUint(1000),
            }),
            NetworkType.MIJIN_TEST,
        );

        const json = mosaicDefinitionTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.MOSAIC_DEFINITION);
        expect(json.transaction.properties.length).to.be.equal(3);
        expect(new UInt64(json.transaction.properties[1].value).compact()).to.be.equal(UInt64.fromUint(3).compact());
        expect(new UInt64(json.transaction.properties[2].value).compact()).to.be.equal(UInt64.fromUint(1000).compact());
        expect(new UInt64(json.transaction.properties[2].value).lower).to.be.equal(UInt64.fromUint(1000).lower);

    });

    it('should create MosaicDefinitionTransaction without duration', () => {
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(),
            new MosaicNonce(new Uint8Array([0xE6, 0xDE, 0x84, 0xB8])), // nonce
            new MosaicId(UInt64.fromUint(1).toDTO()), // ID
            MosaicProperties.create({
                supplyMutable: false,
                transferable: false,
                levyMutable: false,
                divisibility: 3,
            }),
            NetworkType.MIJIN_TEST,
        );

        const json = mosaicDefinitionTransaction.toJSON();

        expect(json.type).to.be.equal(TransactionType.MOSAIC_DEFINITION);
        expect(json.mosaicProperties.supplyMutable).to.be.equal(false);
        expect(json.mosaicProperties.transferable).to.be.equal(false);
        expect(json.mosaicProperties.levyMutable).to.be.equal(false);
        expect(json.mosaicProperties.divisibility).to.be.equal(3);

    });

    it('should create MosaicSupplyChangeTransaction', () => {
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
            Deadline.create(),
            mosaicId,
            MosaicSupplyType.Increase,
            UInt64.fromUint(10),
            NetworkType.MIJIN_TEST,
        );

        const json = mosaicSupplyChangeTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.MOSAIC_SUPPLY_CHANGE);
        expect(json.transaction.direction).to.be.equal(MosaicSupplyType.Increase);

    });

    it('should create TransferTransaction', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [
                NetworkCurrencyMosaic.createRelative(100),
            ],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        const json = transferTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.TRANSFER);
        expect(json.transaction.message.payload).to.be.equal('test-message');
        expect(json.transaction.message.type).to.be.equal(0);

    });

    it('should create SecretLockTransaction', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const recipient = Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL');
        const secretLockTransaction = SecretLockTransaction.create(
            Deadline.create(),
            NetworkCurrencyMosaic.createAbsolute(10),
            UInt64.fromUint(100),
            HashType.Op_Sha3_256,
            sha3_256.create().update(convert.hexToUint8(proof)).hex(),
            recipient,
            NetworkType.MIJIN_TEST,
        );

        const json = secretLockTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.SECRET_LOCK);
        expect(json.transaction.hashAlgorithm).to.be.equal(HashType.Op_Sha3_256);

    });

    it('should create SecretProofTransaction', () => {
        const proof = 'B778A39A3663719DFC5E48C9D78431B1E45C2AF9DF538782BF199C189DABEAC7';
        const secretProofTransaction = SecretProofTransaction.create(
            Deadline.create(),
            HashType.Op_Sha3_256,
            sha3_256.create().update(convert.hexToUint8(proof)).hex(),
            proof,
            NetworkType.MIJIN_TEST,
        );

        const json = secretProofTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.SECRET_PROOF);
        expect(json.transaction.hashAlgorithm).to.be.equal(HashType.Op_Sha3_256);
        expect(json.transaction.secret).to.be.equal(sha3_256.create().update(convert.hexToUint8(proof)).hex());
        expect(json.transaction.proof).to.be.equal(proof);

    });

    it('should create ModifyMultiSigTransaction', () => {
        const modifyMultisigAccountTransaction = ModifyMultisigAccountTransaction.create(
            Deadline.create(),
            2,
            1,
            [new MultisigCosignatoryModification(
                MultisigCosignatoryModificationType.Add,
                PublicAccount.createFromPublicKey('B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6EC24',
                    NetworkType.MIJIN_TEST),
            )],
            NetworkType.MIJIN_TEST,
        );

        const json = modifyMultisigAccountTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.MODIFY_MULTISIG_ACCOUNT);
        expect(json.transaction.minApprovalDelta).to.be.equal(2);
        expect(json.transaction.minRemovalDelta).to.be.equal(1);
    });

    it('should create AggregatedTransaction - Complete', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [transferTransaction.toAggregate(account.publicAccount)],
            NetworkType.MIJIN_TEST,
            []);

        const json = aggregateTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.AGGREGATE_COMPLETE);
        expect(json.transaction.transactions.length).to.be.equal(1);
    });

    it('should create AggregatedTransaction - Bonded', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(),
            [transferTransaction.toAggregate(account.publicAccount)],
            NetworkType.MIJIN_TEST,
            []);

        const json = aggregateTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.AGGREGATE_BONDED);
        expect(json.transaction.transactions.length).to.be.equal(1);
    });

    it('should create LockFundTransaction', () => {
        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(),
            [],
            NetworkType.MIJIN_TEST,
            [],
        );
        const signedTransaction = account.sign(aggregateTransaction);
        const lockTransaction = LockFundsTransaction.create(Deadline.create(),
            NetworkCurrencyMosaic.createRelative(10),
            UInt64.fromUint(10),
            signedTransaction,
            NetworkType.MIJIN_TEST);

        const json = lockTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.LOCK);
        expect(json.transaction.hash).to.be.equal(signedTransaction.hash);
    });

    it('should create RegisterNamespaceTransaction - Root', () => {
        const registerNamespaceTransaction = RegisterNamespaceTransaction.createRootNamespace(
            Deadline.create(),
            'root-test-namespace',
            UInt64.fromUint(1000),
            NetworkType.MIJIN_TEST,
        );

        const json = registerNamespaceTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.REGISTER_NAMESPACE);

    });

    it('should create RegisterNamespaceTransaction - Sub', () => {
        const registerNamespaceTransaction = RegisterNamespaceTransaction.createSubNamespace(
            Deadline.create(),
            'root-test-namespace',
            'parent-test-namespace',
            NetworkType.MIJIN_TEST,
        );

        const json = registerNamespaceTransaction.toJSON();

        expect(json.transaction.type).to.be.equal(TransactionType.REGISTER_NAMESPACE);
    });
});
