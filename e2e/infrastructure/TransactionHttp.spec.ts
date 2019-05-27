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
import {assert, expect} from 'chai';
import * as CryptoJS from 'crypto-js';
import {ChronoUnit} from 'js-joda';
import {keccak_256, sha3_256} from 'js-sha3';
import {convert, nacl_catapult} from 'nem2-library';
import {AccountHttp} from '../../src/infrastructure/AccountHttp';
import { NamespaceHttp } from '../../src/infrastructure/infrastructure';
import {Listener} from '../../src/infrastructure/Listener';
import {TransactionHttp} from '../../src/infrastructure/TransactionHttp';
import {Account} from '../../src/model/account/Account';
import {Address} from '../../src/model/account/Address';
import { PropertyModificationType } from '../../src/model/account/PropertyModificationType';
import { PropertyType } from '../../src/model/account/PropertyType';
import {PublicAccount} from '../../src/model/account/PublicAccount';
import {NetworkType} from '../../src/model/blockchain/NetworkType';
import { Mosaic } from '../../src/model/mosaic/Mosaic';
import {MosaicId} from '../../src/model/mosaic/MosaicId';
import {MosaicNonce} from '../../src/model/mosaic/MosaicNonce';
import {MosaicProperties} from '../../src/model/mosaic/MosaicProperties';
import {MosaicSupplyType} from '../../src/model/mosaic/MosaicSupplyType';
import {NetworkCurrencyMosaic} from '../../src/model/mosaic/NetworkCurrencyMosaic';
import { AliasActionType } from '../../src/model/namespace/AliasActionType';
import { NamespaceId } from '../../src/model/namespace/NamespaceId';
import { AccountLinkTransaction } from '../../src/model/transaction/AccountLinkTransaction';
import { AccountPropertyModification } from '../../src/model/transaction/AccountPropertyModification';
import { AccountPropertyTransaction } from '../../src/model/transaction/AccountPropertyTransaction';
import { AddressAliasTransaction } from '../../src/model/transaction/AddressAliasTransaction';
import {AggregateTransaction} from '../../src/model/transaction/AggregateTransaction';
import {CosignatureSignedTransaction} from '../../src/model/transaction/CosignatureSignedTransaction';
import {CosignatureTransaction} from '../../src/model/transaction/CosignatureTransaction';
import {Deadline} from '../../src/model/transaction/Deadline';
import { HashLockTransaction } from '../../src/model/transaction/HashLockTransaction';
import {HashType} from '../../src/model/transaction/HashType';
import { LinkAction } from '../../src/model/transaction/LinkAction';
import {LockFundsTransaction} from '../../src/model/transaction/LockFundsTransaction';
import {ModifyMultisigAccountTransaction} from '../../src/model/transaction/ModifyMultisigAccountTransaction';
import { MosaicAliasTransaction } from '../../src/model/transaction/MosaicAliasTransaction';
import {MosaicDefinitionTransaction} from '../../src/model/transaction/MosaicDefinitionTransaction';
import {MosaicSupplyChangeTransaction} from '../../src/model/transaction/MosaicSupplyChangeTransaction';
import {MultisigCosignatoryModification} from '../../src/model/transaction/MultisigCosignatoryModification';
import {MultisigCosignatoryModificationType} from '../../src/model/transaction/MultisigCosignatoryModificationType';
import {EmptyMessage, PlainMessage} from '../../src/model/transaction/PlainMessage';
import {RegisterNamespaceTransaction} from '../../src/model/transaction/RegisterNamespaceTransaction';
import {SecretLockTransaction} from '../../src/model/transaction/SecretLockTransaction';
import {SecretProofTransaction} from '../../src/model/transaction/SecretProofTransaction';
import {SignedTransaction} from '../../src/model/transaction/SignedTransaction';
import {Transaction} from '../../src/model/transaction/Transaction';
import {TransactionType} from '../../src/model/transaction/TransactionType';
import {TransferTransaction} from '../../src/model/transaction/TransferTransaction';
import {UInt64} from '../../src/model/UInt64';

describe('TransactionHttp', () => {
    let transactionHash;
    let transactionId;

    let account: Account;
    let account2: Account;
    let account3: Account;
    let testAccountNoBalance: Account;
    let harvestingAccount: Account;
    let transactionHttp: TransactionHttp;
    let multisigAccount: Account;
    let cosignAccount1: Account;
    let cosignAccount2: Account;
    let cosignAccount3: Account;
    let mosaicId: MosaicId;
    let namespaceId: NamespaceId;
    let networkCurrencyMosaicId: MosaicId;
    let accountHttp: AccountHttp;
    let namespaceHttp: NamespaceHttp;
    let config;
    const secureRandom = require('secure-random');
    const sha256 = require('js-sha256');
    const ripemd160 = require('ripemd160');
    let generationHash: string;

    before((done) => {
        const path = require('path');
        require('fs').readFile(path.resolve(__dirname, '../conf/network.conf'), (err, data) => {
            if (err) {
                throw err;
            }
            const json = JSON.parse(data);
            config = json;
            account = Account.createFromPrivateKey(json.testAccount.privateKey, NetworkType.MIJIN_TEST);
            account2 = Account.createFromPrivateKey(json.testAccount2.privateKey, NetworkType.MIJIN_TEST);
            account3 = Account.createFromPrivateKey(json.testAccount3.privateKey, NetworkType.MIJIN_TEST);
            testAccountNoBalance = Account.createFromPrivateKey(json.testAccountNoBalance.privateKey, NetworkType.MIJIN_TEST);
            harvestingAccount = Account.createFromPrivateKey(json.harvestingAccount.privateKey, NetworkType.MIJIN_TEST);
            multisigAccount = Account.createFromPrivateKey(json.multisigAccount.privateKey, NetworkType.MIJIN_TEST);
            cosignAccount1 = Account.createFromPrivateKey(json.cosignatoryAccount.privateKey, NetworkType.MIJIN_TEST);
            cosignAccount2 = Account.createFromPrivateKey(json.cosignatory2Account.privateKey, NetworkType.MIJIN_TEST);
            cosignAccount3 = Account.createFromPrivateKey(json.cosignatory3Account.privateKey, NetworkType.MIJIN_TEST);
            accountHttp = new AccountHttp(json.apiUrl);
            transactionHttp = new TransactionHttp(json.apiUrl);
            namespaceHttp = new NamespaceHttp(json.apiUrl);
            generationHash = json.generationHash;
            done();
        });
    });
    describe('Get network currency mosaic id', () => {
        it('get mosaicId', (done) => {
            namespaceHttp.getLinkedMosaicId(new NamespaceId('cat.currency')).subscribe((networkMosaicId) => {
                networkCurrencyMosaicId = networkMosaicId;
                done();
            });
        });
    });
    describe('MosaicDefinitionTransaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('standalone', (done) => {
            const nonce = MosaicNonce.createRandom();
            mosaicId = MosaicId.createFromNonce(nonce, account.publicAccount);
            const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
                Deadline.create(),
                nonce,
                mosaicId,
                MosaicProperties.create({
                    supplyMutable: true,
                    transferable: true,
                    divisibility: 3,
                }),
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });
    describe('MosaicDefinitionTransaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregate', (done) => {
            const nonce = MosaicNonce.createRandom();
            const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
                Deadline.create(),
                nonce,
                MosaicId.createFromNonce(nonce, account.publicAccount),
                MosaicProperties.create({
                    supplyMutable: true,
                    transferable: true,
                    divisibility: 3,
                }),
                NetworkType.MIJIN_TEST,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [mosaicDefinitionTransaction.toAggregate(account.publicAccount)],
                NetworkType.MIJIN_TEST,
                []);
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });
    describe('TransferTransaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });

        it('standalone', (done) => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(),
                account2.address,
                [NetworkCurrencyMosaic.createAbsolute(1)],
                PlainMessage.create('test-message'),
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = transferTransaction.signWith(account, generationHash);

            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });
    describe('TransferTransaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregate', (done) => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(),
                account2.address,
                [NetworkCurrencyMosaic.createAbsolute(1)],
                PlainMessage.create('test-message'),
                NetworkType.MIJIN_TEST,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [transferTransaction.toAggregate(account.publicAccount)],
                NetworkType.MIJIN_TEST,
                [],
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });
    describe('AccountPropertyTransaction - Address', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });

        it('standalone', (done) => {
            const addressPropertyFilter = AccountPropertyModification.createForAddress(
                PropertyModificationType.Add,
                account3.address,
            );
            const addressModification = AccountPropertyTransaction.createAddressPropertyModificationTransaction(
                Deadline.create(),
                PropertyType.BlockAddress,
                [addressPropertyFilter],
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = addressModification.signWith(account, generationHash);

            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });
    describe('AccountPropertyTransaction - Address', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregate', (done) => {
            const addressPropertyFilter = AccountPropertyModification.createForAddress(
                PropertyModificationType.Remove,
                account3.address,
            );
            const addressModification = AccountPropertyTransaction.createAddressPropertyModificationTransaction(
                Deadline.create(),
                PropertyType.BlockAddress,
                [addressPropertyFilter],
                NetworkType.MIJIN_TEST,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [addressModification.toAggregate(account.publicAccount)],
                NetworkType.MIJIN_TEST,
                [],
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });
    describe('AccountPropertyTransaction - Mosaic', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });

        it('standalone', (done) => {
            const mosaicPropertyFilter = AccountPropertyModification.createForMosaic(
                PropertyModificationType.Add,
                mosaicId,
            );
            const addressModification = AccountPropertyTransaction.createMosaicPropertyModificationTransaction(
                Deadline.create(),
                PropertyType.BlockMosaic,
                [mosaicPropertyFilter],
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = addressModification.signWith(account, generationHash);

            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });
    describe('AccountPropertyTransaction - Mosaic', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregate', (done) => {
            const mosaicPropertyFilter = AccountPropertyModification.createForMosaic(
                PropertyModificationType.Remove,
                mosaicId,
            );
            const addressModification = AccountPropertyTransaction.createMosaicPropertyModificationTransaction(
                Deadline.create(),
                PropertyType.BlockMosaic,
                [mosaicPropertyFilter],
                NetworkType.MIJIN_TEST,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [addressModification.toAggregate(account.publicAccount)],
                NetworkType.MIJIN_TEST,
                [],
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });
    describe('AccountPropertyTransaction - EntityType', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });

        it('standalone', (done) => {
            const entityTypePropertyFilter = AccountPropertyModification.createForEntityType(
                PropertyModificationType.Add,
                TransactionType.LINK_ACCOUNT,
            );
            const addressModification = AccountPropertyTransaction.createEntityTypePropertyModificationTransaction(
                Deadline.create(),
                PropertyType.BlockTransaction,
                [entityTypePropertyFilter],
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = addressModification.signWith(account3, generationHash);

            listener.confirmed(account3.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account3.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });
    describe('AccountPropertyTransaction - EntityType', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregate', (done) => {
            const entityTypePropertyFilter = AccountPropertyModification.createForEntityType(
                PropertyModificationType.Remove,
                TransactionType.LINK_ACCOUNT,
            );
            const addressModification = AccountPropertyTransaction.createEntityTypePropertyModificationTransaction(
                Deadline.create(),
                PropertyType.BlockTransaction,
                [entityTypePropertyFilter],
                NetworkType.MIJIN_TEST,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [addressModification.toAggregate(account3.publicAccount)],
                NetworkType.MIJIN_TEST,
                [],
            );
            const signedTransaction = aggregateTransaction.signWith(account3, generationHash);
            listener.confirmed(account3.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account3.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });
    describe('AccountLinkTransaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });

        it('standalone', (done) => {
            const accountLinkTransaction = AccountLinkTransaction.create(
                Deadline.create(),
                harvestingAccount.publicKey,
                LinkAction.Link,
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = accountLinkTransaction.signWith(account, generationHash);

            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });
    describe('AccountLinkTransaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregate', (done) => {
            const accountLinkTransaction = AccountLinkTransaction.create(
                Deadline.create(),
                harvestingAccount.publicKey,
                LinkAction.Unlink,
                NetworkType.MIJIN_TEST,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [accountLinkTransaction.toAggregate(account.publicAccount)],
                NetworkType.MIJIN_TEST,
                [],
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });
    describe('RegisterNamespaceTransaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('standalone', (done) => {
            const namespaceName = 'root-test-namespace-' + Math.floor(Math.random() * 10000);
            const registerNamespaceTransaction = RegisterNamespaceTransaction.createRootNamespace(
                Deadline.create(),
                namespaceName,
                UInt64.fromUint(1000),
                NetworkType.MIJIN_TEST,
            );
            namespaceId = new NamespaceId(namespaceName);
            const signedTransaction = registerNamespaceTransaction.signWith(account, generationHash);
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });
    describe('RegisterNamespaceTransaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregate', (done) => {
            const registerNamespaceTransaction = RegisterNamespaceTransaction.createRootNamespace(
                Deadline.create(),
                'root-test-namespace-' + Math.floor(Math.random() * 10000),
                UInt64.fromUint(1000),
                NetworkType.MIJIN_TEST,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [registerNamespaceTransaction.toAggregate(account.publicAccount)],
                NetworkType.MIJIN_TEST,
                []);
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });
    describe('AddressAliasTransaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });

        it('standalone', (done) => {
            const addressAliasTransaction = AddressAliasTransaction.create(
                Deadline.create(),
                AliasActionType.Link,
                namespaceId,
                account.address,
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = addressAliasTransaction.signWith(account, generationHash);

            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });
    describe('AddressAliasTransaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregate', (done) => {
            const addressAliasTransaction = AddressAliasTransaction.create(
                Deadline.create(),
                AliasActionType.Unlink,
                namespaceId,
                account.address,
                NetworkType.MIJIN_TEST,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [addressAliasTransaction.toAggregate(account.publicAccount)],
                NetworkType.MIJIN_TEST,
                [],
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });

    describe('MosaicSupplyChangeTransaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('standalone', (done) => {
            const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
                Deadline.create(),
                mosaicId,
                MosaicSupplyType.Increase,
                UInt64.fromUint(10),
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = mosaicSupplyChangeTransaction.signWith(account, generationHash);
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account3.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });
    describe('MosaicSupplyChangeTransaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregate', (done) => {
            const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
                Deadline.create(),
                mosaicId,
                MosaicSupplyType.Increase,
                UInt64.fromUint(10),
                NetworkType.MIJIN_TEST,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [mosaicSupplyChangeTransaction.toAggregate(account.publicAccount)],
                NetworkType.MIJIN_TEST,
                []);
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account3.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });

    describe('MosaicAliasTransaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });

        it('standalone', (done) => {
            const mosaicAliasTransaction = MosaicAliasTransaction.create(
                Deadline.create(),
                AliasActionType.Link,
                namespaceId,
                mosaicId,
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = mosaicAliasTransaction.signWith(account, generationHash);

            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });

    describe('HashLockTransaction - MosaicAlias', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('standalone', (done) => {
            const aggregateTransaction = AggregateTransaction.createBonded(
                Deadline.create(),
                [],
                NetworkType.MIJIN_TEST,
                [],
            );
            const signedTransaction = account.sign(aggregateTransaction);
            const hashLockTransaction = HashLockTransaction.create(Deadline.create(),
                new Mosaic(new NamespaceId('cat.currency'), UInt64.fromUint(10 * Math.pow(10, NetworkCurrencyMosaic.DIVISIBILITY))),
                UInt64.fromUint(10000),
                signedTransaction,
                NetworkType.MIJIN_TEST);

            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(hashLockTransaction.signWith(account));
        });
    });

    describe('MosaicAliasTransaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregate', (done) => {
            const mosaicAliasTransaction = MosaicAliasTransaction.create(
                Deadline.create(),
                AliasActionType.Unlink,
                namespaceId,
                mosaicId,
                NetworkType.MIJIN_TEST,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [mosaicAliasTransaction.toAggregate(account.publicAccount)],
                NetworkType.MIJIN_TEST,
                [],
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });

    describe('LockFundsTransaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('standalone', (done) => {
            const aggregateTransaction = AggregateTransaction.createBonded(
                Deadline.create(),
                [],
                NetworkType.MIJIN_TEST,
                [],
            );
            const signedTransaction = account.sign(aggregateTransaction, generationHash);
            const lockFundsTransaction = LockFundsTransaction.create(Deadline.create(),
                new Mosaic(networkCurrencyMosaicId, UInt64.fromUint(10 * Math.pow(10, NetworkCurrencyMosaic.DIVISIBILITY))),
                UInt64.fromUint(10000),
                signedTransaction,
                NetworkType.MIJIN_TEST);

            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(lockFundsTransaction.signWith(account, generationHash));
        });
    });
    describe('LockFundsTransaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregate', (done) => {
            const aggregateTransaction = AggregateTransaction.createBonded(
                Deadline.create(),
                [],
                NetworkType.MIJIN_TEST,
                [],
            );
            const signedTransaction = account.sign(aggregateTransaction, generationHash);
            const lockFundsTransaction = LockFundsTransaction.create(Deadline.create(),
                new Mosaic(networkCurrencyMosaicId, UInt64.fromUint(10 * Math.pow(10, NetworkCurrencyMosaic.DIVISIBILITY))),
                UInt64.fromUint(10),
                signedTransaction,
                NetworkType.MIJIN_TEST);
            const aggregateLockFundsTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [lockFundsTransaction.toAggregate(account.publicAccount)],
                NetworkType.MIJIN_TEST,
                []);
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(aggregateLockFundsTransaction.signWith(account, generationHash));
        });
    });

    describe('Aggregate Complete Transaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('should announce aggregated complete transaction', (done) => {
            const signerAccount = account;

            const tx = TransferTransaction.create(
                Deadline.create(),
                account2.address,
                [],
                PlainMessage.create('Hi'),
                NetworkType.MIJIN_TEST,
            );
            const aggTx = AggregateTransaction.createComplete(
                Deadline.create(),
                [
                    tx.toAggregate(signerAccount.publicAccount),
                ],
                NetworkType.MIJIN_TEST,
                [],
            );
            const signedTx = signerAccount.sign(aggTx, generationHash);
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(signedTx);
        });
    });

    describe('SecretLockTransaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('standalone', (done) => {
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                NetworkCurrencyMosaic.createAbsolute(10),
                UInt64.fromUint(100),
                HashType.Op_Sha3_256,
                sha3_256.create().update(nacl_catapult.randomBytes(20)).hex(),
                account2.address,
                NetworkType.MIJIN_TEST,
            );
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(secretLockTransaction.signWith(account, generationHash));
        });
    });
    describe('HashType: Op_Sha3_256', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });

        it('aggregate', (done) => {
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                NetworkCurrencyMosaic.createAbsolute(10),
                UInt64.fromUint(100),
                HashType.Op_Sha3_256,
                sha3_256.create().update(nacl_catapult.randomBytes(20)).hex(),
                account2.address,
                NetworkType.MIJIN_TEST,
            );
            const aggregateSecretLockTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [secretLockTransaction.toAggregate(account.publicAccount)],
                NetworkType.MIJIN_TEST,
                []);
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(aggregateSecretLockTransaction.signWith(account, generationHash));
        });
    });
    describe('HashType: Keccak_256', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('standalone', (done) => {
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                NetworkCurrencyMosaic.createAbsolute(10),
                UInt64.fromUint(100),
                HashType.Op_Keccak_256,
                sha3_256.create().update(nacl_catapult.randomBytes(20)).hex(),
                account2.address,
                NetworkType.MIJIN_TEST,
            );
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(secretLockTransaction.signWith(account, generationHash));
        });
    });
    describe('HashType: Keccak_256', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregate', (done) => {
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                NetworkCurrencyMosaic.createAbsolute(10),
                UInt64.fromUint(100),
                HashType.Op_Keccak_256,
                sha3_256.create().update(nacl_catapult.randomBytes(20)).hex(),
                account2.address,
                NetworkType.MIJIN_TEST,
            );
            const aggregateSecretLockTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [secretLockTransaction.toAggregate(account.publicAccount)],
                NetworkType.MIJIN_TEST,
                []);
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(aggregateSecretLockTransaction.signWith(account, generationHash));
        });
    });
    describe('HashType: Op_Hash_160', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('standalone', (done) => {
            const secretSeed = String.fromCharCode.apply(null, nacl_catapult.randomBytes(20));
            const secret = CryptoJS.RIPEMD160(CryptoJS.SHA256(secretSeed).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex);
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                NetworkCurrencyMosaic.createAbsolute(10),
                UInt64.fromUint(100),
                HashType.Op_Hash_160,
                secret,
                account2.address,
                NetworkType.MIJIN_TEST,
            );
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(secretLockTransaction.signWith(account, generationHash));
        });
    });
    describe('HashType: Op_Hash_160', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregate', (done) => {
            const secretSeed = String.fromCharCode.apply(null, nacl_catapult.randomBytes(20));
            const secret = CryptoJS.RIPEMD160(CryptoJS.SHA256(secretSeed).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex);
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                NetworkCurrencyMosaic.createAbsolute(10),
                UInt64.fromUint(100),
                HashType.Op_Hash_160,
                secret,
                account2.address,
                NetworkType.MIJIN_TEST,
            );
            const aggregateSecretLockTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [secretLockTransaction.toAggregate(account.publicAccount)],
                NetworkType.MIJIN_TEST,
                []);
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(aggregateSecretLockTransaction.signWith(account, generationHash));
        });
    });
    describe('HashType: Op_Hash_256', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('standalone', (done) => {
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                NetworkCurrencyMosaic.createAbsolute(10),
                UInt64.fromUint(100),
                HashType.Op_Hash_256,
                sha3_256.create().update(nacl_catapult.randomBytes(20)).hex(),
                account2.address,
                NetworkType.MIJIN_TEST,
            );
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(secretLockTransaction.signWith(account, generationHash));
        });
    });
    describe('HashType: Op_Hash_256', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregate', (done) => {
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                NetworkCurrencyMosaic.createAbsolute(10),
                UInt64.fromUint(100),
                HashType.Op_Hash_256,
                sha3_256.create().update(nacl_catapult.randomBytes(20)).hex(),
                account2.address,
                NetworkType.MIJIN_TEST,
            );
            const aggregateSecretLockTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [secretLockTransaction.toAggregate(account.publicAccount)],
                NetworkType.MIJIN_TEST,
                []);
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(aggregateSecretLockTransaction.signWith(account, generationHash));
        });
    });
    describe('SecretProofTransaction - HashType: Op_Sha3_256', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('standalone', (done) => {
            const secretSeed = nacl_catapult.randomBytes(20);
            const secret = sha3_256.create().update(secretSeed).hex();
            const proof = convert.uint8ToHex(secretSeed);

            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(1, ChronoUnit.HOURS),
                NetworkCurrencyMosaic.createAbsolute(10),
                UInt64.fromUint(11),
                HashType.Op_Sha3_256,
                secret,
                account2.address,
                NetworkType.MIJIN_TEST,
            );
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                const secretProofTransaction = SecretProofTransaction.create(
                    Deadline.create(),
                    HashType.Op_Sha3_256,
                    secret,
                    account2.address,
                    proof,
                    NetworkType.MIJIN_TEST,
                );
                const signedTx = secretProofTransaction.signWith(account2, generationHash);
                transactionHttp.announce(signedTx);
            });
            listener.confirmed(account2.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account2.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            const signedSecretLockTx = secretLockTransaction.signWith(account, generationHash);
            transactionHttp.announce(signedSecretLockTx);
        });
    });
    describe('SecretProofTransaction - HashType: Op_Sha3_256', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregate', (done) => {
            const secretSeed = nacl_catapult.randomBytes(20);
            const secret = sha3_256.create().update(secretSeed).hex();
            const proof = convert.uint8ToHex(secretSeed);
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                NetworkCurrencyMosaic.createAbsolute(10),
                UInt64.fromUint(100),
                HashType.Op_Sha3_256,
                secret,
                account2.address,
                NetworkType.MIJIN_TEST,
            );
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                listener.confirmed(account2.address).subscribe((transaction: Transaction) => {
                    done();
                });
                const secretProofTransaction = SecretProofTransaction.create(
                    Deadline.create(),
                    HashType.Op_Sha3_256,
                    secret,
                    account2.address,
                    proof,
                    NetworkType.MIJIN_TEST,
                );
                const aggregateSecretProofTransaction = AggregateTransaction.createComplete(Deadline.create(),
                    [secretProofTransaction.toAggregate(account2.publicAccount)],
                    NetworkType.MIJIN_TEST,
                    []);
                transactionHttp.announce(aggregateSecretProofTransaction.signWith(account2,generationHash));
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(secretLockTransaction.signWith(account, generationHash));
        });
    });
    describe('SecretProofTransaction - HashType: Op_Keccak_256', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('standalone', (done) => {
            const secretSeed = nacl_catapult.randomBytes(20);
            const secret = keccak_256.create().update(secretSeed).hex();
            const proof = convert.uint8ToHex(secretSeed);
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                NetworkCurrencyMosaic.createAbsolute(10),
                UInt64.fromUint(100),
                HashType.Op_Keccak_256,
                secret,
                account2.address,
                NetworkType.MIJIN_TEST,
            );
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                listener.confirmed(account2.address).subscribe((transaction: Transaction) => {
                    done();
                });
                const secretProofTransaction = SecretProofTransaction.create(
                    Deadline.create(),
                    HashType.Op_Keccak_256,
                    secret,
                    account2.address,
                    proof,
                    NetworkType.MIJIN_TEST,
                );
                transactionHttp.announce(secretProofTransaction.signWith(account2, generationHash));
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(secretLockTransaction.signWith(account, generationHash));
        });
    });
    describe('SecretProofTransaction - HashType: Op_Keccak_256', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregate', (done) => {
            const secretSeed = nacl_catapult.randomBytes(20);
            const secret = keccak_256.create().update(secretSeed).hex();
            const proof = convert.uint8ToHex(secretSeed);
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                NetworkCurrencyMosaic.createAbsolute(10),
                UInt64.fromUint(100),
                HashType.Op_Keccak_256,
                secret,
                account2.address,
                NetworkType.MIJIN_TEST,
            );
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                listener.confirmed(account2.address).subscribe((transaction: Transaction) => {
                    done();
                });
                const secretProofTransaction = SecretProofTransaction.create(
                    Deadline.create(),
                    HashType.Op_Keccak_256,
                    secret,
                    account2.address,
                    proof,
                    NetworkType.MIJIN_TEST,
                );
                const aggregateSecretProofTransaction = AggregateTransaction.createComplete(Deadline.create(),
                    [secretProofTransaction.toAggregate(account2.publicAccount)],
                    NetworkType.MIJIN_TEST,
                    []);
                transactionHttp.announce(aggregateSecretProofTransaction.signWith(account2,generationHash));
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(secretLockTransaction.signWith(account, generationHash));
        });
    });
    describe('SecretProofTransaction - HashType: Op_Hash_160', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('standalone', (done) => {
            const randomBytes = secureRandom.randomBuffer(32);
            const secretSeed = randomBytes.toString('hex');
            const hash = sha256(Buffer.from(secretSeed, 'hex'));
            const secret = new ripemd160().update(Buffer.from(hash, 'hex')).digest('hex');
            const proof = secretSeed;
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                NetworkCurrencyMosaic.createAbsolute(10),
                UInt64.fromUint(100),
                HashType.Op_Hash_160,
                secret,
                account2.address,
                NetworkType.MIJIN_TEST,
            );
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                const secretProofTransaction = SecretProofTransaction.create(
                    Deadline.create(),
                    HashType.Op_Hash_160,
                    secret,
                    account2.address,
                    proof,
                    NetworkType.MIJIN_TEST,
                );
                const signedTx = secretProofTransaction.signWith(account2, generationHash);
                transactionHttp.announce(signedTx);
            });
            listener.confirmed(account2.address).subscribe((transaction: Transaction) => {
                done();
            });
            listener.status(account2.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(secretLockTransaction.signWith(account, generationHash));
        });
    });
    describe('SecretProofTransaction - HashType: Op_Hash_160', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregate', (done) => {
            const randomBytes = secureRandom.randomBuffer(32);
            const secretSeed = randomBytes.toString('hex');
            const hash = sha256(Buffer.from(secretSeed, 'hex'));
            const secret = new ripemd160().update(Buffer.from(hash, 'hex')).digest('hex');
            const proof = secretSeed;
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                NetworkCurrencyMosaic.createAbsolute(10),
                UInt64.fromUint(100),
                HashType.Op_Hash_160,
                secret,
                account2.address,
                NetworkType.MIJIN_TEST,
            );
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                listener.confirmed(account2.address).subscribe((transaction: Transaction) => {
                    done();
                });
                listener.status(account2.address).subscribe((error) => {
                    console.log('Error:', error);
                    assert(false);
                    done();
                });
                const secretProofTransaction = SecretProofTransaction.create(
                    Deadline.create(),
                    HashType.Op_Hash_160,
                    secret,
                    account2.address,
                    proof,
                    NetworkType.MIJIN_TEST,
                );
                const aggregateSecretProofTransaction = AggregateTransaction.createComplete(Deadline.create(),
                    [secretProofTransaction.toAggregate(account2.publicAccount)],
                    NetworkType.MIJIN_TEST,
                    []);
                transactionHttp.announce(aggregateSecretProofTransaction.signWith(account2,generationHash));
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(secretLockTransaction.signWith(account, generationHash));
        });
    });
    describe('SecretProofTransaction - HashType: Op_Hash_256', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('standalone', (done) => {
            const randomBytes = secureRandom.randomBuffer(32);
            const secretSeed = randomBytes.toString('hex');
            const hash = sha256(Buffer.from(secretSeed, 'hex'));
            const secret = sha256(Buffer.from(hash, 'hex'));
            const proof = secretSeed;
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                NetworkCurrencyMosaic.createAbsolute(10),
                UInt64.fromUint(100),
                HashType.Op_Hash_256,
                secret,
                account2.address,
                NetworkType.MIJIN_TEST,
            );
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                listener.confirmed(account2.address).subscribe((transaction: Transaction) => {
                    done();
                });
                listener.status(account2.address).subscribe((error) => {
                    console.log('Error:', error);
                    assert(false);
                    done();
                });
                const secretProofTransaction = SecretProofTransaction.create(
                    Deadline.create(),
                    HashType.Op_Hash_256,
                    secret,
                    account2.address,
                    proof,
                    NetworkType.MIJIN_TEST,
                );
                transactionHttp.announce(secretProofTransaction.signWith(account2, generationHash));
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(secretLockTransaction.signWith(account, generationHash));
        });
    });
    describe('SecretProofTransaction - HashType: Op_Hash_256', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregate', (done) => {
            const randomBytes = secureRandom.randomBuffer(32);
            const secretSeed = randomBytes.toString('hex');
            const hash = sha256(Buffer.from(secretSeed, 'hex'));
            const secret = sha256(Buffer.from(hash, 'hex'));
            const proof = secretSeed;
            const secretLockTransaction = SecretLockTransaction.create(
                Deadline.create(),
                NetworkCurrencyMosaic.createAbsolute(10),
                UInt64.fromUint(100),
                HashType.Op_Hash_256,
                secret,
                account2.address,
                NetworkType.MIJIN_TEST,
            );
            listener.confirmed(account.address).subscribe((transaction: Transaction) => {
                listener.confirmed(account2.address).subscribe((transaction: Transaction) => {
                    done();
                });
                listener.status(account2.address).subscribe((error) => {
                    console.log('Error:', error);
                    assert(false);
                    done();
                });
                const secretProofTransaction = SecretProofTransaction.create(
                    Deadline.create(),
                    HashType.Op_Hash_256,
                    secret,
                    account2.address,
                    proof,
                    NetworkType.MIJIN_TEST,
                );
                const aggregateSecretProofTransaction = AggregateTransaction.createComplete(Deadline.create(),
                    [secretProofTransaction.toAggregate(account2.publicAccount)],
                    NetworkType.MIJIN_TEST,
                    []);
                transactionHttp.announce(aggregateSecretProofTransaction.signWith(account2,generationHash));
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(secretLockTransaction.signWith(account, generationHash));
        });
    });

    describe('transactions', () => {
        it('should call transactions successfully', (done) => {
            accountHttp.transactions(account.publicAccount).subscribe((transactions) => {
                const transaction = transactions[0];
                transactionId = transaction.transactionInfo!.id;
                transactionHash = transaction.transactionInfo!.hash;
                done();
            });
        });
    });

    describe('getTransaction', () => {
        it('should return transaction info given transactionHash', (done) => {
            transactionHttp.getTransaction(transactionHash)
                .subscribe((transaction) => {
                    expect(transaction.transactionInfo!.hash).to.be.equal(transactionHash);
                    expect(transaction.transactionInfo!.id).to.be.equal(transactionId);
                    done();
                });
        });

        it('should return transaction info given transactionId', (done) => {
            transactionHttp.getTransaction(transactionId)
                .subscribe((transaction) => {
                    expect(transaction.transactionInfo!.hash).to.be.equal(transactionHash);
                    expect(transaction.transactionInfo!.id).to.be.equal(transactionId);
                    done();
                });
        });
    });

    describe('getTransactions', () => {
        it('should return transaction info given array of transactionHash', (done) => {
            transactionHttp.getTransactions([transactionHash])
                .subscribe((transactions) => {
                    expect(transactions[0].transactionInfo!.hash).to.be.equal(transactionHash);
                    expect(transactions[0].transactionInfo!.id).to.be.equal(transactionId);
                    done();
                });
        });

        it('should return transaction info given array of transactionId', (done) => {
            transactionHttp.getTransactions([transactionId])
                .subscribe((transactions) => {
                    expect(transactions[0].transactionInfo!.hash).to.be.equal(transactionHash);
                    expect(transactions[0].transactionInfo!.id).to.be.equal(transactionId);
                    done();
                });
        });
    });

    describe('getTransactionStatus', () => {
        it('should return transaction status given transactionHash', (done) => {
            transactionHttp.getTransactionStatus(transactionHash)
                .subscribe((transactionStatus) => {
                    expect(transactionStatus.group).to.be.equal('confirmed');
                    expect(transactionStatus.height.lower).to.be.greaterThan(0);
                    expect(transactionStatus.height.higher).to.be.equal(0);
                    done();
                });
        });
    });

    describe('getTransactionsStatuses', () => {
        it('should return transaction status given array of transactionHash', (done) => {
            transactionHttp.getTransactionsStatuses([transactionHash])
                .subscribe((transactionStatuses) => {
                    expect(transactionStatuses[0].group).to.be.equal('confirmed');
                    expect(transactionStatuses[0].height.lower).to.be.greaterThan(0);
                    expect(transactionStatuses[0].height.higher).to.be.equal(0);
                    done();
                });
        });
    });

    describe('announce', () => {
        it('should return success when announce', (done) => {
            const transferTransaction = TransferTransaction.create(
                        Deadline.create(),
                        account2.address,
                        [NetworkCurrencyMosaic.createAbsolute(1)],
                        PlainMessage.create('test-message'),
                        NetworkType.MIJIN_TEST,
                    );
            const signedTransaction = transferTransaction.signWith(account, generationHash);
            transactionHttp.announce(signedTransaction)
                .subscribe((transactionAnnounceResponse) => {
                    expect(transactionAnnounceResponse.message)
                        .to.be.equal('packet 9 was pushed to the network via /transaction');
                    done();
                });
        });
    });

    describe('announceAggregateBonded', () => {
        it('should return success when announceAggregateBonded', (done) => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(),
                account2.address,
                [NetworkCurrencyMosaic.createRelative(1)],
                PlainMessage.create('test-message'),
                NetworkType.MIJIN_TEST,
            );
            const aggregateTransaction = AggregateTransaction.createBonded(
                Deadline.create(2, ChronoUnit.MINUTES),
                [transferTransaction.toAggregate(multisigAccount.publicAccount)],
                NetworkType.MIJIN_TEST,
                []);
            const signedTransaction = aggregateTransaction.signWith(cosignAccount1, generationHash);
            transactionHttp.announceAggregateBonded(signedTransaction)
                .subscribe((transactionAnnounceResponse) => {
                    expect(transactionAnnounceResponse.message)
                        .to.be.equal('packet 500 was pushed to the network via /transaction/partial');
                    done();
                });
        });
    });

    describe('announceAggregateBondedCosignature', () => {
        it('should return success when announceAggregateBondedCosignature', (done) => {
            const payload = new CosignatureSignedTransaction('', '', '');
            transactionHttp.announceAggregateBondedCosignature(payload)
                .subscribe((transactionAnnounceResponse) => {
                    expect(transactionAnnounceResponse.message)
                        .to.be.equal('packet 501 was pushed to the network via /transaction/cosignature');
                    done();
                });
        });
    });

    describe('getTransactionEffectiveFee', () => {
        it('should return effective paid fee given transactionHash', (done) => {
            transactionHttp.getTransactionEffectiveFee(transactionHash)
                .subscribe((effectiveFee) => {
                    expect(effectiveFee).to.not.be.undefined;
                    expect(effectiveFee).to.be.equal(0);
                    done();
                });
        });
    });
    // describe('announceSync', () => {
    //     it('should return insufficient balance error', (done) => {
    //         const aggregateTransaction = AggregateTransaction.createBonded(
    //                         Deadline.create(),
    //                         [],
    //                         NetworkType.MIJIN_TEST,
    //                         [],
    //                     );
    //         const signedTransaction = account.sign(aggregateTransaction);

    //         const lockFundsTransaction = LockFundsTransaction.create(Deadline.create(),
    //             NetworkCurrencyMosaic.createAbsolute(0),
    //             UInt64.fromUint(10000),
    //             signedTransaction,
    //             NetworkType.MIJIN_TEST);

    //         transactionHttp
    //             .announceSync(lockFundsTransaction.signWith(account, generationHash))
    //             .subscribe((shouldNotBeCalled) => {
    //                 throw new Error('should not be called');
    //             }, (err) => {
    //                 console.log(err);
    //                 expect(err.status).to.be.equal('Failure_LockHash_Invalid_Mosaic_Amount');
    //                 done();
    //             });
    //     });
    // });
});
