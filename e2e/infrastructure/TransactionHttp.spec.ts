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
import {Crypto} from '../../src/core/crypto';
import { Convert as convert } from '../../src/core/format';
import { TransactionMapping } from '../../src/core/utils/TransactionMapping';
import {AccountHttp} from '../../src/infrastructure/AccountHttp';
import { NamespaceHttp } from '../../src/infrastructure/infrastructure';
import {Listener} from '../../src/infrastructure/Listener';
import {TransactionHttp} from '../../src/infrastructure/TransactionHttp';
import {Account} from '../../src/model/account/Account';
import { AccountRestrictionType } from '../../src/model/account/AccountRestrictionType';
import { RestrictionModificationType } from '../../src/model/account/RestrictionModificationType';
import {NetworkType} from '../../src/model/blockchain/NetworkType';
import { Mosaic } from '../../src/model/mosaic/Mosaic';
import {MosaicId} from '../../src/model/mosaic/MosaicId';
import {MosaicNonce} from '../../src/model/mosaic/MosaicNonce';
import {MosaicProperties} from '../../src/model/mosaic/MosaicProperties';
import { MosaicRestrictionType } from '../../src/model/mosaic/MosaicRestrictionType';
import {MosaicSupplyType} from '../../src/model/mosaic/MosaicSupplyType';
import {NetworkCurrencyMosaic} from '../../src/model/mosaic/NetworkCurrencyMosaic';
import { AliasAction } from '../../src/model/namespace/AliasAction';
import { NamespaceId } from '../../src/model/namespace/NamespaceId';
import { AccountAddressRestrictionTransaction } from '../../src/model/transaction/AccountAddressRestrictionTransaction';
import { AccountLinkTransaction } from '../../src/model/transaction/AccountLinkTransaction';
import { AccountMosaicRestrictionTransaction } from '../../src/model/transaction/AccountMosaicRestrictionTransaction';
import { AccountOperationRestrictionTransaction } from '../../src/model/transaction/AccountOperationRestrictionTransaction';
import { AccountRestrictionModification } from '../../src/model/transaction/AccountRestrictionModification';
import { AccountRestrictionTransaction } from '../../src/model/transaction/AccountRestrictionTransaction';
import { AddressAliasTransaction } from '../../src/model/transaction/AddressAliasTransaction';
import {AggregateTransaction} from '../../src/model/transaction/AggregateTransaction';
import {CosignatureSignedTransaction} from '../../src/model/transaction/CosignatureSignedTransaction';
import { CosignatureTransaction } from '../../src/model/transaction/CosignatureTransaction';
import {Deadline} from '../../src/model/transaction/Deadline';
import { HashLockTransaction } from '../../src/model/transaction/HashLockTransaction';
import {HashType} from '../../src/model/transaction/HashType';
import { LinkAction } from '../../src/model/transaction/LinkAction';
import {LockFundsTransaction} from '../../src/model/transaction/LockFundsTransaction';
import { MosaicAddressRestrictionTransaction } from '../../src/model/transaction/MosaicAddressRestrictionTransaction';
import { MosaicAliasTransaction } from '../../src/model/transaction/MosaicAliasTransaction';
import {MosaicDefinitionTransaction} from '../../src/model/transaction/MosaicDefinitionTransaction';
import { MosaicGlobalRestrictionTransaction } from '../../src/model/transaction/MosaicGlobalRestrictionTransaction';
import {MosaicSupplyChangeTransaction} from '../../src/model/transaction/MosaicSupplyChangeTransaction';
import { PlainMessage } from '../../src/model/transaction/PlainMessage';
import {RegisterNamespaceTransaction} from '../../src/model/transaction/RegisterNamespaceTransaction';
import {SecretLockTransaction} from '../../src/model/transaction/SecretLockTransaction';
import {SecretProofTransaction} from '../../src/model/transaction/SecretProofTransaction';
import { SignedTransaction } from '../../src/model/transaction/SignedTransaction';
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
                    restrictable: true,
                    duration: UInt64.fromUint(1000),
                }),
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);
            listener.confirmed(account.address).subscribe((transaction: MosaicDefinitionTransaction) => {
                expect(transaction.mosaicId, 'MosaicId').not.to.be.undefined;
                expect(transaction.nonce, 'Nonce').not.to.be.undefined;
                expect(transaction.mosaicProperties.divisibility, 'Divisibility').not.to.be.undefined;
                expect(transaction.mosaicProperties.duration, 'Duration').not.to.be.undefined;
                expect(transaction.mosaicProperties.supplyMutable, 'SupplyMutable').not.to.be.undefined;
                expect(transaction.mosaicProperties.transferable, 'Transferable').not.to.be.undefined;
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
                    restrictable: true,
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

    describe('MosaicGlobalRestrictionTransaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });

        it('standalone', (done) => {
            const mosaicGlobalRestrictionTransaction = MosaicGlobalRestrictionTransaction.create(
                Deadline.create(),
                mosaicId,
                new MosaicId(UInt64.fromUint(0).toDTO()),
                UInt64.fromUint(60641),
                UInt64.fromUint(0),
                MosaicRestrictionType.NONE,
                UInt64.fromUint(0),
                MosaicRestrictionType.GE,
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = mosaicGlobalRestrictionTransaction.signWith(account, generationHash);

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
    describe('MosaicGlobalRestrictionTransaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregate', (done) => {
            const mosaicGlobalRestrictionTransaction = MosaicGlobalRestrictionTransaction.create(
                Deadline.create(),
                mosaicId,
                new MosaicId(UInt64.fromUint(0).toDTO()),
                UInt64.fromUint(60641),
                UInt64.fromUint(0),
                MosaicRestrictionType.GE,
                UInt64.fromUint(1),
                MosaicRestrictionType.GE,
                NetworkType.MIJIN_TEST,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [mosaicGlobalRestrictionTransaction.toAggregate(account.publicAccount)],
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

    describe('MosaicAddressRestrictionTransaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregate', (done) => {
            const mosaicAddressRestrictionTransaction = MosaicAddressRestrictionTransaction.create(
                Deadline.create(),
                mosaicId,
                UInt64.fromUint(60641),
                account3.address,
                UInt64.fromHex('FFFFFFFFFFFFFFFF'),
                UInt64.fromUint(2),
                NetworkType.MIJIN_TEST,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [mosaicAddressRestrictionTransaction.toAggregate(account.publicAccount)],
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

            listener.confirmed(account.address).subscribe((transaction: TransferTransaction) => {
                expect(transaction.message, 'Message').not.to.be.undefined;
                expect(transaction.mosaics, 'Mosaic').not.to.be.undefined;
                expect(transaction.recipient, 'Recipient').not.to.be.undefined;
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
    describe('AccountRestrictionTransaction - Outgoing Address', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });

        it('standalone', (done) => {
            const addressRestrictionFilter = AccountRestrictionModification.createForAddress(
                RestrictionModificationType.Add,
                account3.address,
            );
            const addressModification = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
                Deadline.create(),
                AccountRestrictionType.BlockOutgoingAddress,
                [addressRestrictionFilter],
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = addressModification.signWith(account, generationHash);

            listener.confirmed(account.address).subscribe((transaction: AccountAddressRestrictionTransaction) => {
                expect(transaction.modifications, 'Modifications').not.to.be.undefined;
                expect(transaction.modifications[0].modificationType, 'Modifications.ModificationType').not.to.be.undefined;
                expect(transaction.modifications[0].value, 'Modifications.Value').not.to.be.undefined;
                expect(transaction.restrictionType, 'RestrictionType').not.to.be.undefined;
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
    describe('AccountRestrictionTransaction - Outgoing Address', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregate', (done) => {
            const addressRestrictionFilter = AccountRestrictionModification.createForAddress(
                RestrictionModificationType.Remove,
                account3.address,
            );
            const addressModification = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
                Deadline.create(),
                AccountRestrictionType.BlockOutgoingAddress,
                [addressRestrictionFilter],
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

    describe('AccountRestrictionTransaction - Incoming Address', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });

        it('standalone', (done) => {
            const addressRestrictionFilter = AccountRestrictionModification.createForAddress(
                RestrictionModificationType.Add,
                account3.address,
            );
            const addressModification = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
                Deadline.create(),
                AccountRestrictionType.BlockIncomingAddress,
                [addressRestrictionFilter],
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = addressModification.signWith(account, generationHash);

            listener.confirmed(account.address).subscribe((transaction: AccountAddressRestrictionModificationTransaction) => {
                expect(transaction.modifications, 'Modifications').not.to.be.undefined;
                expect(transaction.modifications[0].modificationType, 'Modifications.ModificationType').not.to.be.undefined;
                expect(transaction.modifications[0].value, 'Modifications.Value').not.to.be.undefined;
                expect(transaction.restrictionType, 'RestrictionType').not.to.be.undefined;
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
    describe('AccountRestrictionTransaction - Incoming Address', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregate', (done) => {
            const addressRestrictionFilter = AccountRestrictionModification.createForAddress(
                RestrictionModificationType.Remove,
                account3.address,
            );
            const addressModification = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
                Deadline.create(),
                AccountRestrictionType.BlockIncomingAddress,
                [addressRestrictionFilter],
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
    describe('AccountRestrictionTransaction - Mosaic', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });

        it('standalone', (done) => {
            const mosaicRestrictionFilter = AccountRestrictionModification.createForMosaic(
                RestrictionModificationType.Add,
                mosaicId,
            );
            const addressModification = AccountRestrictionTransaction.createMosaicRestrictionModificationTransaction(
                Deadline.create(),
                AccountRestrictionType.BlockMosaic,
                [mosaicRestrictionFilter],
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = addressModification.signWith(account, generationHash);

            listener.confirmed(account.address).subscribe((transaction: AccountMosaicRestrictionTransaction) => {
                expect(transaction.modifications, 'Modifications').not.to.be.undefined;
                expect(transaction.modifications[0].modificationType, 'Modifications.ModificationType').not.to.be.undefined;
                expect(transaction.modifications[0].value, 'Modifications.Value').not.to.be.undefined;
                expect(transaction.restrictionType, 'RestrictionType').not.to.be.undefined;
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
    describe('AccountRestrictionTransaction - Mosaic', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregate', (done) => {
            const mosaicRestrictionFilter = AccountRestrictionModification.createForMosaic(
                RestrictionModificationType.Remove,
                mosaicId,
            );
            const addressModification = AccountRestrictionTransaction.createMosaicRestrictionModificationTransaction(
                Deadline.create(),
                AccountRestrictionType.BlockMosaic,
                [mosaicRestrictionFilter],
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
    describe('AccountRestrictionTransaction - Incoming Operation', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });

        it('standalone', (done) => {
            const operationRestrictionFilter = AccountRestrictionModification.createForOperation(
                RestrictionModificationType.Add,
                TransactionType.LINK_ACCOUNT,
            );
            const addressModification = AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(
                Deadline.create(),
                AccountRestrictionType.BlockIncomingTransactionType,
                [operationRestrictionFilter],
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = addressModification.signWith(account3, generationHash);

            listener.confirmed(account3.address).subscribe((transaction: AccountOperationRestrictionTransaction) => {
                expect(transaction.modifications, 'Modifications').not.to.be.undefined;
                expect(transaction.modifications[0].modificationType, 'Modifications.ModificationType').not.to.be.undefined;
                expect(transaction.modifications[0].value, 'Modifications.Value').not.to.be.undefined;
                expect(transaction.restrictionType, 'RestrictionType').not.to.be.undefined;
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
    describe('AccountRestrictionTransaction - Incoming Operation', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregate', (done) => {
            const operationRestrictionFilter = AccountRestrictionModification.createForOperation(
                RestrictionModificationType.Remove,
                TransactionType.LINK_ACCOUNT,
            );
            const addressModification = AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(
                Deadline.create(),
                AccountRestrictionType.BlockIncomingTransactionType,
                [operationRestrictionFilter],
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

    describe('AccountRestrictionTransaction - Outgoing Operation', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });

        it('standalone', (done) => {
            const operationRestrictionFilter = AccountRestrictionModification.createForOperation(
                RestrictionModificationType.Add,
                TransactionType.LINK_ACCOUNT,
            );
            const addressModification = AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(
                Deadline.create(),
                AccountRestrictionType.BlockOutgoingTransactionType,
                [operationRestrictionFilter],
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = addressModification.signWith(account3, generationHash);

            listener.confirmed(account3.address).subscribe((transaction: AccountOperationRestrictionModificationTransaction) => {
                expect(transaction.modifications, 'Modifications').not.to.be.undefined;
                expect(transaction.modifications[0].modificationType, 'Modifications.ModificationType').not.to.be.undefined;
                expect(transaction.modifications[0].value, 'Modifications.Value').not.to.be.undefined;
                expect(transaction.restrictionType, 'RestrictionType').not.to.be.undefined;
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
    describe('AccountRestrictionTransaction - Outgoing Operation', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregate', (done) => {
            const operationRestrictionFilter = AccountRestrictionModification.createForOperation(
                RestrictionModificationType.Remove,
                TransactionType.LINK_ACCOUNT,
            );
            const addressModification = AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(
                Deadline.create(),
                AccountRestrictionType.BlockOutgoingTransactionType,
                [operationRestrictionFilter],
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

            listener.confirmed(account.address).subscribe((transaction: AccountLinkTransaction) => {
                expect(transaction.remoteAccountKey, 'RemoteAccountKey').not.to.be.undefined;
                expect(transaction.linkAction, 'LinkAction').not.to.be.undefined;
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
            listener.confirmed(account.address).subscribe((transaction: RegisterNamespaceTransaction) => {
                expect(transaction.namespaceId, 'NamespaceId').not.to.be.undefined;
                expect(transaction.namespaceName, 'NamespaceName').not.to.be.undefined;
                expect(transaction.namespaceType, 'NamespaceType').not.to.be.undefined;
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
                AliasAction.Link,
                namespaceId,
                account.address,
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = addressAliasTransaction.signWith(account, generationHash);

            listener.confirmed(account.address).subscribe((transaction: AddressAliasTransaction) => {
                expect(transaction.namespaceId, 'NamespaceId').not.to.be.undefined;
                expect(transaction.aliasAction, 'AliasAction').not.to.be.undefined;
                expect(transaction.address, 'Address').not.to.be.undefined;
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
                AliasAction.Unlink,
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
            listener.confirmed(account.address).subscribe((transaction: MosaicSupplyChangeTransaction) => {
                expect(transaction.delta, 'Delta').not.to.be.undefined;
                expect(transaction.direction, 'Direction').not.to.be.undefined;
                expect(transaction.mosaicId, 'MosaicId').not.to.be.undefined;
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
                AliasAction.Link,
                namespaceId,
                mosaicId,
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = mosaicAliasTransaction.signWith(account, generationHash);

            listener.confirmed(account.address).subscribe((transaction: MosaicAliasTransaction) => {
                expect(transaction.namespaceId, 'NamespaceId').not.to.be.undefined;
                expect(transaction.aliasAction, 'AliasAction').not.to.be.undefined;
                expect(transaction.mosaicId, 'MosaicId').not.to.be.undefined;
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
            const signedTransaction = account.sign(aggregateTransaction, generationHash);
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
            transactionHttp.announce(hashLockTransaction.signWith(account, generationHash));
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
                AliasAction.Unlink,
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
                    tx.toAggregate(account.publicAccount),
                ],
                NetworkType.MIJIN_TEST,
                [],
            );
            const signedTx = account.sign(aggTx, generationHash);
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
                sha3_256.create().update(Crypto.randomBytes(20)).hex(),
                account2.address,
                NetworkType.MIJIN_TEST,
            );
            listener.confirmed(account.address).subscribe((transaction: SecretLockTransaction) => {
                expect(transaction.mosaic, 'Mosaic').not.to.be.undefined;
                expect(transaction.duration, 'Duration').not.to.be.undefined;
                expect(transaction.hashType, 'HashType').not.to.be.undefined;
                expect(transaction.secret, 'Secret').not.to.be.undefined;
                expect(transaction.recipient, 'Recipient').not.to.be.undefined;
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
                sha3_256.create().update(Crypto.randomBytes(20)).hex(),
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
                sha3_256.create().update(Crypto.randomBytes(20)).hex(),
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
                sha3_256.create().update(Crypto.randomBytes(20)).hex(),
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
            const secretSeed = String.fromCharCode.apply(null, Crypto.randomBytes(20));
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
            const secretSeed = String.fromCharCode.apply(null, Crypto.randomBytes(20));
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
                sha3_256.create().update(Crypto.randomBytes(20)).hex(),
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
                sha3_256.create().update(Crypto.randomBytes(20)).hex(),
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
            const secretSeed = Crypto.randomBytes(20);
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
                listener.confirmed(account2.address).subscribe((transaction: SecretProofTransaction) => {
                    expect(transaction.secret, 'Secret').not.to.be.undefined;
                    expect(transaction.recipient, 'Recipient').not.to.be.undefined;
                    expect(transaction.hashType, 'HashType').not.to.be.undefined;
                    expect(transaction.proof, 'Proof').not.to.be.undefined;
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
                const signedTx = secretProofTransaction.signWith(account2, generationHash);
                transactionHttp.announce(signedTx);
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
            const secretSeed = Crypto.randomBytes(20);
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
                transactionHttp.announce(aggregateSecretProofTransaction.signWith(account2, generationHash));
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
            const secretSeed = Crypto.randomBytes(20);
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
            const secretSeed = Crypto.randomBytes(20);
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
                transactionHttp.announce(aggregateSecretProofTransaction.signWith(account2, generationHash));
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
                const signedTx = secretProofTransaction.signWith(account2, generationHash);
                transactionHttp.announce(signedTx);
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
                transactionHttp.announce(aggregateSecretProofTransaction.signWith(account2, generationHash));
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
                transactionHttp.announce(aggregateSecretProofTransaction.signWith(account2, generationHash));
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            transactionHttp.announce(secretLockTransaction.signWith(account, generationHash));
        });
    });

    describe('SignTransactionGivenSignatures', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('Announce cosign signatures given', (done) => {

            /**
             * @see https://github.com/nemtech/nem2-sdk-typescript-javascript/issues/112
             */
            // AliceAccount: account
            // BobAccount: account

            const sendAmount = NetworkCurrencyMosaic.createRelative(1000);
            const backAmount = NetworkCurrencyMosaic.createRelative(1);

            const aliceTransferTransaction = TransferTransaction.create(Deadline.create(), account2.address, [sendAmount],
                                                                        PlainMessage.create('payout'), NetworkType.MIJIN_TEST);
            const bobTransferTransaction   = TransferTransaction.create(Deadline.create(), account.address, [backAmount],
                                                                        PlainMessage.create('payout'), NetworkType.MIJIN_TEST);

            // 01. Alice creates the aggregated tx and sign it. Then payload send to Bob
            const aggregateTransaction = AggregateTransaction.createComplete(
                Deadline.create(),
                [
                    aliceTransferTransaction.toAggregate(account.publicAccount),
                    bobTransferTransaction.toAggregate(account2.publicAccount),
                ],
                NetworkType.MIJIN_TEST,
                [],
            );

            const aliceSignedTransaction = aggregateTransaction.signWith(account, generationHash);

            // 02 Bob cosigns the tx and sends it back to Alice
            const signedTxBob = CosignatureTransaction.signTransactionPayload(account2, aliceSignedTransaction.payload, generationHash);

            // 03. Alice collects the cosignatures, recreate, sign, and announces the transaction
            const cosignatureSignedTransactions = [
                new CosignatureSignedTransaction(signedTxBob.parentHash, signedTxBob.signature, signedTxBob.signer),
            ];
            const recreatedTx = TransactionMapping.createFromPayload(aliceSignedTransaction.payload) as AggregateTransaction;

            const signedTransaction = recreatedTx.signTransactionGivenSignatures(account, cosignatureSignedTransactions, generationHash);

            listener.confirmed(account.address).subscribe(() => {
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
                    expect(transactionStatus.height!.lower).to.be.greaterThan(0);
                    expect(transactionStatus.height!.higher).to.be.equal(0);
                    done();
                });
        });
    });

    describe('getTransactionsStatuses', () => {
        it('should return transaction status given array of transactionHash', (done) => {
            transactionHttp.getTransactionsStatuses([transactionHash])
                .subscribe((transactionStatuses) => {
                    expect(transactionStatuses[0].group).to.be.equal('confirmed');
                    expect(transactionStatuses[0].height!.lower).to.be.greaterThan(0);
                    expect(transactionStatuses[0].height!.higher).to.be.equal(0);
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
