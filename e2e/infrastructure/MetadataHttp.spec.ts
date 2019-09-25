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

import {assert, expect} from 'chai';
import { Convert } from '../../src/core/format/Convert';
import { Listener, TransactionHttp } from '../../src/infrastructure/infrastructure';
import { MetadataHttp } from '../../src/infrastructure/MetadataHttp';
import { Account } from '../../src/model/account/Account';
import {Address} from '../../src/model/account/Address';
import {PublicAccount} from '../../src/model/account/PublicAccount';
import {NetworkType} from '../../src/model/blockchain/NetworkType';
import { MosaicFlags } from '../../src/model/mosaic/MosaicFlags';
import { MosaicId } from '../../src/model/mosaic/MosaicId';
import { MosaicNonce } from '../../src/model/mosaic/MosaicNonce';
import { NamespaceId } from '../../src/model/namespace/NamespaceId';
import { AccountMetadataTransaction } from '../../src/model/transaction/AccountMetadataTransaction';
import { AggregateTransaction } from '../../src/model/transaction/AggregateTransaction';
import { Deadline } from '../../src/model/transaction/Deadline';
import { MosaicDefinitionTransaction } from '../../src/model/transaction/MosaicDefinitionTransaction';
import { MosaicMetadataTransaction } from '../../src/model/transaction/MosaicMetadataTransaction';
import { NamespaceMetadataTransaction } from '../../src/model/transaction/NamespaceMetadataTransaction';
import { NamespaceRegistrationTransaction } from '../../src/model/transaction/NamespaceRegistrationTransaction';
import { UInt64 } from '../../src/model/UInt64';

describe('MetadataHttp', () => {
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
    let metadataHttp: MetadataHttp;
    let transactionHttp: TransactionHttp;
    let mosaicId: MosaicId;
    let namespaceId: NamespaceId;
    let generationHash: string;
    let config;

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
            multisigAccount = Account.createFromPrivateKey(json.multisigAccount.privateKey, NetworkType.MIJIN_TEST);
            cosignAccount1 = Account.createFromPrivateKey(json.cosignatoryAccount.privateKey, NetworkType.MIJIN_TEST);
            cosignAccount2 = Account.createFromPrivateKey(json.cosignatory2Account.privateKey, NetworkType.MIJIN_TEST);
            cosignAccount3 = Account.createFromPrivateKey(json.cosignatory3Account.privateKey, NetworkType.MIJIN_TEST);
            accountAddress = Address.createFromRawAddress(json.testAccount.address);
            accountPublicKey = json.testAccount.publicKey;
            publicAccount = PublicAccount.createFromPublicKey(json.testAccount.publicKey, NetworkType.MIJIN_TEST);
            generationHash = json.generationHash;
            metadataHttp = new MetadataHttp(json.apiUrl);
            transactionHttp = new TransactionHttp(json.apiUrl);
            done();
        });
    });

    /**
     * =========================
     * Setup test data
     * =========================
     */

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
                MosaicFlags.create( true, true, true),
                3,
                UInt64.fromUint(1000),
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);
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

    describe('Setup test NamespaceId', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('Announce NamespaceRegistrationTransaction', (done) => {
            const namespaceName = 'root-test-namespace-' + Math.floor(Math.random() * 10000);
            const registerNamespaceTransaction = NamespaceRegistrationTransaction.createRootNamespace(
                Deadline.create(),
                namespaceName,
                UInt64.fromUint(9),
                NetworkType.MIJIN_TEST,
            );
            namespaceId = new NamespaceId(namespaceName);
            const signedTransaction = registerNamespaceTransaction.signWith(account, generationHash);
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

    describe('AccountMetadataTransaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregate', (done) => {
            const accountMetadataTransaction = AccountMetadataTransaction.create(
                Deadline.create(),
                account.publicKey,
                UInt64.fromUint(5),
                10,
                Convert.uint8ToUtf8(new Uint8Array(10)),
                NetworkType.MIJIN_TEST,
            );

            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [accountMetadataTransaction.toAggregate(account.publicAccount)],
                NetworkType.MIJIN_TEST,
                [],
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
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

    describe('MosaicMetadataTransaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregate', (done) => {
            const mosaicMetadataTransaction = MosaicMetadataTransaction.create(
                Deadline.create(),
                account.publicKey,
                UInt64.fromUint(5),
                mosaicId,
                10,
                Convert.uint8ToUtf8(new Uint8Array(10)),
                NetworkType.MIJIN_TEST,
            );

            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [mosaicMetadataTransaction.toAggregate(account.publicAccount)],
                NetworkType.MIJIN_TEST,
                [],
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
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

    describe('NamespaceMetadataTransaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregate', (done) => {
            const namespaceMetadataTransaction = NamespaceMetadataTransaction.create(
                Deadline.create(),
                account.publicKey,
                UInt64.fromUint(5),
                namespaceId,
                10,
                Convert.uint8ToUtf8(new Uint8Array(10)),
                NetworkType.MIJIN_TEST,
            );

            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [namespaceMetadataTransaction.toAggregate(account.publicAccount)],
                NetworkType.MIJIN_TEST,
                [],
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
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

    /**
     * =========================
     * Tests
     * =========================
     */

    describe('getAccountMetadata', () => {
        it('should return metadata given a NEM Address', (done) => {
            metadataHttp.getAccountMetadata(accountAddress)
                .subscribe((metadata) => {
                    expect(metadata.length).to.be.greaterThan(0);
                    done();
                });
        });
    });

    describe('getAccountMetadataByKey', () => {
        it('should return metadata given a NEM Address and metadata key', (done) => {
            metadataHttp.getAccountMetadataByKey(accountAddress, UInt64.fromUint(5).toHex())
                .subscribe((metadata) => {
                    expect(metadata.length).to.be.greaterThan(0);
                    done();
                });
        });
    });

    describe('getAccountMetadataByKeyAndSender', () => {
        it('should return metadata given a NEM Address and metadata key and sender public key', (done) => {
            metadataHttp.getAccountMetadataByKeyAndSender(accountAddress, UInt64.fromUint(5).toHex(), account.publicKey)
                .subscribe((metadata) => {
                    expect(metadata.metadataEntry.senderPublicKey).to.be.equal(account.publicKey);
                    done();
                });
        });
    });

    describe('getMosaicMetadata', () => {
        it('should return metadata given a mosaicId', (done) => {
            metadataHttp.getMosaicMetadata(mosaicId)
                .subscribe((metadata) => {
                    expect(metadata.length).to.be.greaterThan(0);
                    done();
                });
        });
    });

    describe('getMosaicMetadataByKey', () => {
        it('should return metadata given a mosaicId and metadata key', (done) => {
            metadataHttp.getMosaicMetadataByKey(mosaicId, UInt64.fromUint(5).toHex())
                .subscribe((metadata) => {
                    expect(metadata.length).to.be.greaterThan(0);
                    done();
                });
        });
    });

    describe('getMosaicMetadataByKeyAndSender', () => {
        it('should return metadata given a mosaicId and metadata key and sender public key', (done) => {
            metadataHttp.getMosaicMetadataByKeyAndSender(mosaicId, UInt64.fromUint(5).toHex(), account.publicKey)
                .subscribe((metadata) => {
                    expect(metadata.metadataEntry.senderPublicKey).to.be.equal(account.publicKey);
                    done();
                });
        });
    });

    describe('getNamespaceMetadata', () => {
        it('should return metadata given a namespaceId', (done) => {
            metadataHttp.getNamespaceMetadata(namespaceId)
                .subscribe((metadata) => {
                    expect(metadata.length).to.be.greaterThan(0);
                    done();
                });
        });
    });

    describe('getNamespaceMetadataByKey', () => {
        it('should return metadata given a namespaceId and metadata key', (done) => {
            metadataHttp.getNamespaceMetadataByKey(namespaceId, UInt64.fromUint(5).toHex())
                .subscribe((metadata) => {
                    expect(metadata.length).to.be.greaterThan(0);
                    done();
                });
        });
    });

    describe('getNamespaceMetadataByKeyAndSender', () => {
        it('should return metadata given a namespaceId and metadata key and sender public key', (done) => {
            metadataHttp.getNamespaceMetadataByKeyAndSender(namespaceId, UInt64.fromUint(5).toHex(), account.publicKey)
                .subscribe((metadata) => {
                    expect(metadata.metadataEntry.senderPublicKey).to.be.equal(account.publicKey);
                    done();
                });
        });
    });
});
