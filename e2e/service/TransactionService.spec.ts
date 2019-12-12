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

import { assert } from 'chai';
import { expect } from 'chai';
import { Convert } from '../../src/core/format/Convert';
import { Listener } from '../../src/infrastructure/Listener';
import { NamespaceHttp } from '../../src/infrastructure/NamespaceHttp';
import { TransactionHttp } from '../../src/infrastructure/TransactionHttp';
import { Account } from '../../src/model/account/Account';
import { Address } from '../../src/model/account/Address';
import { NetworkType } from '../../src/model/blockchain/NetworkType';
import { PlainMessage } from '../../src/model/message/PlainMessage';
import { Mosaic } from '../../src/model/mosaic/Mosaic';
import { MosaicFlags } from '../../src/model/mosaic/MosaicFlags';
import { MosaicId } from '../../src/model/mosaic/MosaicId';
import { MosaicNonce } from '../../src/model/mosaic/MosaicNonce';
import { MosaicSupplyChangeAction } from '../../src/model/mosaic/MosaicSupplyChangeAction';
import { NetworkCurrencyMosaic } from '../../src/model/mosaic/NetworkCurrencyMosaic';
import { AliasAction } from '../../src/model/namespace/AliasAction';
import { NamespaceId } from '../../src/model/namespace/NamespaceId';
import { AddressAliasTransaction } from '../../src/model/transaction/AddressAliasTransaction';
import { AggregateTransaction } from '../../src/model/transaction/AggregateTransaction';
import { Deadline } from '../../src/model/transaction/Deadline';
import { MosaicAliasTransaction } from '../../src/model/transaction/MosaicAliasTransaction';
import { MosaicDefinitionTransaction } from '../../src/model/transaction/MosaicDefinitionTransaction';
import { MosaicMetadataTransaction } from '../../src/model/transaction/MosaicMetadataTransaction';
import { MosaicSupplyChangeTransaction } from '../../src/model/transaction/MosaicSupplyChangeTransaction';
import { NamespaceRegistrationTransaction } from '../../src/model/transaction/NamespaceRegistrationTransaction';
import { SignedTransaction } from '../../src/model/transaction/SignedTransaction';
import { TransferTransaction } from '../../src/model/transaction/TransferTransaction';
import { UInt64 } from '../../src/model/UInt64';
import { TransactionService } from '../../src/service/TransactionService';
import { ReceiptHttp } from "../../src/infrastructure/ReceiptHttp";

describe('TransactionService', () => {
    let account: Account;
    let account2: Account;
    let account3: Account;
    let account4: Account;
    let url: string;
    let generationHash: string;
    let namespaceHttp: NamespaceHttp;
    let addressAlias: NamespaceId;
    let mosaicAlias: NamespaceId;
    let mosaicId: MosaicId;
    let newMosaicId: MosaicId;
    let transactionHttp: TransactionHttp;
    let config;
    let transactionHashes: string[];
    let transactionHashesMultiple: string[];

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
            account4 = Account.createFromPrivateKey(json.cosignatory4Account.privateKey, NetworkType.MIJIN_TEST);
            url = json.apiUrl;
            generationHash = json.generationHash;
            namespaceHttp = new NamespaceHttp(json.apiUrl);
            transactionHttp = new TransactionHttp(json.apiUrl);
            transactionHashes = [];
            transactionHashesMultiple = [];
            done();
        });
    });

    /**
     * =========================
     * Setup test data
     * =========================
     */
    describe('Create address alias NamespaceId', () => {
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
                UInt64.fromUint(20),
                NetworkType.MIJIN_TEST,
            );
            addressAlias = new NamespaceId(namespaceName);
            const signedTransaction = registerNamespaceTransaction.signWith(account, generationHash);
            transactionHashes.push(signedTransaction.hash);
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

    describe('Create mosaic alias NamespaceId', () => {
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
                UInt64.fromUint(50),
                NetworkType.MIJIN_TEST,
            );
            mosaicAlias = new NamespaceId(namespaceName);
            const signedTransaction = registerNamespaceTransaction.signWith(account, generationHash);
            transactionHashes.push(signedTransaction.hash);
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

    describe('Setup test AddressAlias', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });

        it('Announce addressAliasTransaction', (done) => {
            const addressAliasTransaction = AddressAliasTransaction.create(
                Deadline.create(),
                AliasAction.Link,
                addressAlias,
                account.address,
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = addressAliasTransaction.signWith(account, generationHash);
            transactionHashes.push(signedTransaction.hash);
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

    describe('Setup test MosaicId', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('Announce MosaicDefinitionTransaction', (done) => {
            const nonce = MosaicNonce.createRandom();
            mosaicId = MosaicId.createFromNonce(nonce, account.publicAccount);
            const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
                Deadline.create(),
                nonce,
                mosaicId,
                MosaicFlags.create(true, true, false),
                3,
                UInt64.fromUint(50),
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);
            transactionHashes.push(signedTransaction.hash);
            listener.confirmed(account.address).subscribe(() => {
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
                MosaicSupplyChangeAction.Increase,
                UInt64.fromUint(200000),
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = mosaicSupplyChangeTransaction.signWith(account, generationHash);
            transactionHashes.push(signedTransaction.hash);
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

    describe('Setup MosaicAlias', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });

        it('Announce MosaicAliasTransaction', (done) => {
            const mosaicAliasTransaction = MosaicAliasTransaction.create(
                Deadline.create(),
                AliasAction.Link,
                mosaicAlias,
                mosaicId,
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = mosaicAliasTransaction.signWith(account, generationHash);
            transactionHashes.push(signedTransaction.hash);
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
    describe('Create Transfer with alias', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });

        it('Announce TransferTransaction', (done) => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(),
                addressAlias,
                [
                    NetworkCurrencyMosaic.createAbsolute(1),
                    new Mosaic(mosaicAlias, UInt64.fromUint(1)),
                ],
                PlainMessage.create('test-message'),
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = transferTransaction.signWith(account, generationHash);

            transactionHashes.push(signedTransaction.hash);

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
     * =====================================
     * Setup test aggregate transaction data
     * =====================================
     */

    describe('Create Aggreate TransferTransaction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('aggregate', (done) => {
            const signedTransaction = buildAggregateTransaction().signWith(account, generationHash);
            transactionHashes.push(signedTransaction.hash);
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
     * =====================================
     * Setup test Multiple transaction on same block
     * =====================================
     */

    describe('Transfer mosaic to account 3', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });

        it('Announce TransferTransaction', (done) => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(),
                account3.address,
                [
                    new Mosaic(mosaicAlias, UInt64.fromUint(200)),
                ],
                PlainMessage.create('test-message'),
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = transferTransaction.signWith(account, generationHash);

            transactionHashes.push(signedTransaction.hash);

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

    describe('Create multiple transfers with alias', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });

        it('Announce TransferTransaction', (done) => {
            const transactions: SignedTransaction[] = [];
            // 1. Transfer A -> B
            const transaction1 = TransferTransaction.create(
                Deadline.create(),
                account2.address,
                [
                    new Mosaic(mosaicAlias, UInt64.fromUint(1)),
                ],
                PlainMessage.create('test-message'),
                NetworkType.MIJIN_TEST,
            );
            transactions.push(transaction1.signWith(account, generationHash));

            // 2. Transfer C -> D
            const transaction2 = TransferTransaction.create(
                Deadline.create(),
                account4.address,
                [
                    new Mosaic(mosaicAlias, UInt64.fromUint(1)),
                ],
                PlainMessage.create('test-message'),
                NetworkType.MIJIN_TEST,
            );
            transactions.push(transaction2.signWith(account3, generationHash));

            // 3. Aggregate
            const lastSignedTx = buildAggregateTransaction().signWith(account, generationHash);
            transactions.push(lastSignedTx);

            transactions.forEach((tx) => {
                transactionHashesMultiple.push(tx.hash);
                transactionHttp.announce(tx);
            });
            listener.confirmed(account.address, lastSignedTx.hash).subscribe(() => {
                done();
            });
            listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            listener.status(account3.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
        });
    });

    /**
     * =========================
     * Test
     * =========================
     */

    describe('should return resolved transaction', () => {
        it('call transaction service', (done) => {
            const transactionService = new TransactionService(new TransactionHttp(url), new ReceiptHttp(url));
            transactionService.resolveAliases(transactionHashes).subscribe((transactions) => {
                expect(transactions.length).to.be.equal(8);
                transactions.map((tx) => {
                    if (tx instanceof TransferTransaction) {
                        expect((tx.recipientAddress as Address).plain()).to.be.equal(account.address.plain());
                        expect(tx.mosaics.find((m) => m.id.toHex() === mosaicId.toHex())).not.to.equal(undefined);
                    } else if (tx instanceof AggregateTransaction) {
                        expect(tx.innerTransactions.length).to.be.equal(5);
                        // Assert Transfer
                        expect(((tx.innerTransactions[0] as TransferTransaction).recipientAddress as Address)
                            .plain()).to.be.equal(account.address.plain());
                        expect((tx.innerTransactions[0] as TransferTransaction).mosaics
                            .find((m) => m.id.toHex() === mosaicId.toHex())).not.to.equal(undefined);
                        // Assert MosaicMeta
                        expect((tx.innerTransactions[4] as MosaicMetadataTransaction)
                            .targetMosaicId.toHex() === newMosaicId.toHex()).to.be.true;
                    }
                });
            },
            done());
        });
    });

    describe('Test resolve alias with multiple transaction in single block', () => {
        it('call transaction service', (done) => {
            const transactionService = new TransactionService(new TransactionHttp(url), new ReceiptHttp(url));
            transactionService.resolveAliases(transactionHashesMultiple).subscribe((tx) => {
                expect(tx.length).to.be.equal(3);
                expect((tx[0] as TransferTransaction).mosaics[0].id.toHex()).to.be.equal(mosaicId.toHex());
                expect((tx[1] as TransferTransaction).mosaics[0].id.toHex()).to.be.equal(mosaicId.toHex());
                expect(((tx[2] as AggregateTransaction).innerTransactions[4] as MosaicMetadataTransaction)
                    .targetMosaicId.toHex()).to.be.equal(newMosaicId.toHex());
            },
            done());
        });
    });

    function buildAggregateTransaction(): AggregateTransaction {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            addressAlias,
            [
                NetworkCurrencyMosaic.createAbsolute(1),
                new Mosaic(mosaicAlias, UInt64.fromUint(1)),
            ],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );
        // Unlink MosaicAlias
        const mosaicAliasTransactionUnlink = MosaicAliasTransaction.create(
            Deadline.create(),
            AliasAction.Unlink,
            mosaicAlias,
            mosaicId,
            NetworkType.MIJIN_TEST,
        );

        // Create a new Mosaic
        const nonce = MosaicNonce.createRandom();
        newMosaicId = MosaicId.createFromNonce(nonce, account.publicAccount);
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(),
            nonce,
            newMosaicId,
            MosaicFlags.create(true, true, false),
            3,
            UInt64.fromUint(0),
            NetworkType.MIJIN_TEST,
        );

        // Link namespace with new MosaicId
        const mosaicAliasTransactionRelink = MosaicAliasTransaction.create(
            Deadline.create(),
            AliasAction.Link,
            mosaicAlias,
            newMosaicId,
            NetworkType.MIJIN_TEST,
        );

        // Use new mosaicAlias in metadata
        const mosaicMetadataTransaction = MosaicMetadataTransaction.create(
            Deadline.create(),
            account.publicKey,
            UInt64.fromUint(5),
            mosaicAlias,
            10,
            Convert.uint8ToUtf8(new Uint8Array(10)),
            NetworkType.MIJIN_TEST,
        );
        return AggregateTransaction.createComplete(Deadline.create(),
            [
                transferTransaction.toAggregate(account.publicAccount),
                mosaicAliasTransactionUnlink.toAggregate(account.publicAccount),
                mosaicDefinitionTransaction.toAggregate(account.publicAccount),
                mosaicAliasTransactionRelink.toAggregate(account.publicAccount),
                mosaicMetadataTransaction.toAggregate(account.publicAccount),

            ],
            NetworkType.MIJIN_TEST,
            [],
        );
    }

});
