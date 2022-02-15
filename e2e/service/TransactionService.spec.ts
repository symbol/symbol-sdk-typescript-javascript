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

import { assert, expect } from 'chai';
import { firstValueFrom } from 'rxjs';
import { TransactionRepository } from '../../src/infrastructure/TransactionRepository';
import { Account, Address } from '../../src/model/account';
import { PlainMessage } from '../../src/model/message/PlainMessage';
import { Mosaic, MosaicFlags, MosaicId, MosaicNonce, MosaicSupplyChangeAction } from '../../src/model/mosaic';
import { AliasAction, NamespaceId } from '../../src/model/namespace';
import { NetworkType } from '../../src/model/network/NetworkType';
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
import { NetworkCurrencyLocal } from '../../test/model/mosaic/Currency.spec';
import { IntegrationTestHelper } from '../infrastructure/IntegrationTestHelper';

describe('TransactionService', () => {
    const helper = new IntegrationTestHelper();
    let generationHash: string;
    let addressAlias: NamespaceId;
    let mosaicAlias: NamespaceId;
    let mosaicId: MosaicId;
    let newMosaicId: MosaicId;
    let transactionHashes: string[];
    let transactionHashesMultiple: string[];
    let account: Account;
    let account2: Account;
    let account3: Account;
    let cosignAccount4: Account;
    let networkType: NetworkType;
    let transactionService: TransactionService;
    let transactionRepository: TransactionRepository;

    before(() => {
        return helper.start({ openListener: true }).then(() => {
            account = helper.account;
            account2 = helper.account2;
            account3 = helper.account3;
            cosignAccount4 = helper.cosignAccount4;
            generationHash = helper.generationHash;
            networkType = helper.networkType;
            transactionHashes = [];
            transactionHashesMultiple = [];
            transactionRepository = helper.repositoryFactory.createTransactionRepository();
            transactionService = new TransactionService(
                helper.repositoryFactory.createTransactionRepository(),
                helper.repositoryFactory.createReceiptRepository(),
            );
        });
    });

    after(() => {
        return helper.close();
    });

    function buildAggregateTransaction(): AggregateTransaction {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(helper.epochAdjustment),
            addressAlias,
            [helper.networkCurrency.createAbsolute(1), new Mosaic(mosaicAlias, UInt64.fromUint(1))],
            PlainMessage.create('test-message'),
            networkType,
            helper.maxFee,
        );
        // Unlink MosaicAlias
        const mosaicAliasTransactionUnlink = MosaicAliasTransaction.create(
            Deadline.create(helper.epochAdjustment),
            AliasAction.Unlink,
            mosaicAlias,
            mosaicId,
            networkType,
            helper.maxFee,
        );

        // Create a new Mosaic
        const nonce = MosaicNonce.createRandom();
        newMosaicId = MosaicId.createFromNonce(nonce, account.address);
        const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
            Deadline.create(helper.epochAdjustment),
            nonce,
            newMosaicId,
            MosaicFlags.create(true, true, false),
            3,
            UInt64.fromUint(0),
            networkType,
            helper.maxFee,
        );

        const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
            Deadline.create(helper.epochAdjustment),
            newMosaicId,
            MosaicSupplyChangeAction.Increase,
            UInt64.fromUint(200000),
            networkType,
            helper.maxFee,
        );

        // Link namespace with new MosaicId
        const mosaicAliasTransactionRelink = MosaicAliasTransaction.create(
            Deadline.create(helper.epochAdjustment),
            AliasAction.Link,
            mosaicAlias,
            newMosaicId,
            networkType,
            helper.maxFee,
        );

        // Use new mosaicAlias in metadata
        const mosaicMetadataTransaction = MosaicMetadataTransaction.create(
            Deadline.create(helper.epochAdjustment),
            account.address,
            UInt64.fromUint(5),
            mosaicAlias,
            10,
            new Uint8Array(10),
            networkType,
            helper.maxFee,
        );
        return AggregateTransaction.createComplete(
            Deadline.create(helper.epochAdjustment),
            [
                transferTransaction.toAggregate(account.publicAccount),
                mosaicAliasTransactionUnlink.toAggregate(account.publicAccount),
                mosaicDefinitionTransaction.toAggregate(account.publicAccount),
                mosaicSupplyChangeTransaction.toAggregate(account.publicAccount),
                mosaicAliasTransactionRelink.toAggregate(account.publicAccount),
                mosaicMetadataTransaction.toAggregate(account.publicAccount),
            ],
            networkType,
            [],
            helper.maxFee,
        );
    }

    /**
     * =========================
     * Setup test data
     * =========================
     */
    describe('Create address alias NamespaceId', () => {
        it('Announce NamespaceRegistrationTransaction', () => {
            const namespaceName = 'root-test-namespace-' + Math.floor(Math.random() * 10000);
            const registerNamespaceTransaction = NamespaceRegistrationTransaction.createRootNamespace(
                Deadline.create(helper.epochAdjustment),
                namespaceName,
                UInt64.fromUint(20),
                networkType,
                helper.maxFee,
            );
            addressAlias = new NamespaceId(namespaceName);
            const signedTransaction = registerNamespaceTransaction.signWith(account, generationHash);
            transactionHashes.push(signedTransaction.hash);
            return helper.announce(signedTransaction);
        });
    });

    describe('Create mosaic alias NamespaceId', () => {
        it('Announce NamespaceRegistrationTransaction', () => {
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
            transactionHashes.push(signedTransaction.hash);
            return helper.announce(signedTransaction);
        });
    });

    describe('Setup test AddressAlias', () => {
        it('Announce addressAliasTransaction', () => {
            const addressAliasTransaction = AddressAliasTransaction.create(
                Deadline.create(helper.epochAdjustment),
                AliasAction.Link,
                addressAlias,
                account.address,
                networkType,
                helper.maxFee,
            );
            const signedTransaction = addressAliasTransaction.signWith(account, generationHash);
            transactionHashes.push(signedTransaction.hash);

            return helper.announce(signedTransaction);
        });
    });

    describe('Setup test MosaicId', () => {
        it('Announce MosaicDefinitionTransaction', () => {
            const nonce = MosaicNonce.createRandom();
            mosaicId = MosaicId.createFromNonce(nonce, account.address);
            const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
                Deadline.create(helper.epochAdjustment),
                nonce,
                mosaicId,
                MosaicFlags.create(true, true, false),
                3,
                UInt64.fromUint(50),
                networkType,
                helper.maxFee,
            );
            const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);
            transactionHashes.push(signedTransaction.hash);

            return helper.announce(signedTransaction);
        });
    });

    describe('MosaicSupplyChangeTransaction', () => {
        it('standalone', () => {
            const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
                Deadline.create(helper.epochAdjustment),
                mosaicId,
                MosaicSupplyChangeAction.Increase,
                UInt64.fromUint(200000),
                networkType,
                helper.maxFee,
            );
            const signedTransaction = mosaicSupplyChangeTransaction.signWith(account, generationHash);
            transactionHashes.push(signedTransaction.hash);
            return helper.announce(signedTransaction);
        });
    });

    describe('Setup MosaicAlias', () => {
        it('Announce MosaicAliasTransaction', () => {
            const mosaicAliasTransaction = MosaicAliasTransaction.create(
                Deadline.create(helper.epochAdjustment),
                AliasAction.Link,
                mosaicAlias,
                mosaicId,
                networkType,
                helper.maxFee,
            );
            const signedTransaction = mosaicAliasTransaction.signWith(account, generationHash);
            transactionHashes.push(signedTransaction.hash);

            return helper.announce(signedTransaction);
        });
    });
    describe('Create Transfer with alias', () => {
        it('Announce TransferTransaction', () => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(helper.epochAdjustment),
                addressAlias,
                [NetworkCurrencyLocal.createAbsolute(1), new Mosaic(mosaicAlias, UInt64.fromUint(1))],
                PlainMessage.create('test-message'),
                networkType,
                helper.maxFee,
            );
            const signedTransaction = transferTransaction.signWith(account, generationHash);

            transactionHashes.push(signedTransaction.hash);

            return helper.announce(signedTransaction);
        });
    });

    /**
     * =====================================
     * Setup test aggregate transaction data
     * =====================================
     */

    describe('Create Aggreate TransferTransaction', () => {
        it('aggregate', () => {
            const signedTransaction = buildAggregateTransaction().signWith(account, generationHash);
            transactionHashes.push(signedTransaction.hash);
            return helper.announce(signedTransaction);
        });
    });

    /**
     * =====================================
     * Setup test Multiple transaction on same block
     * =====================================
     */

    describe('Transfer mosaic to account 3', () => {
        it('Announce TransferTransaction', () => {
            const transferTransaction = TransferTransaction.create(
                Deadline.create(helper.epochAdjustment),
                account3.address,
                [new Mosaic(mosaicAlias, UInt64.fromUint(1))],
                PlainMessage.create('test-message'),
                networkType,
                helper.maxFee,
            );
            const signedTransaction = transferTransaction.signWith(account, generationHash);
            transactionHashes.push(signedTransaction.hash);
            return helper.announce(signedTransaction);
        });
    });

    describe('Create multiple transfers with alias', () => {
        it('Announce TransferTransaction', (done) => {
            const transactions: SignedTransaction[] = [];
            // 1. Transfer A -> B
            const transaction1 = TransferTransaction.create(
                Deadline.create(helper.epochAdjustment),
                account2.address,
                [new Mosaic(mosaicAlias, UInt64.fromUint(1))],
                PlainMessage.create('test-message'),
                networkType,
                helper.maxFee,
            );
            transactions.push(transaction1.signWith(account, generationHash));

            // 2. Transfer C -> D
            const transaction2 = TransferTransaction.create(
                Deadline.create(helper.epochAdjustment),
                cosignAccount4.address,
                [new Mosaic(mosaicAlias, UInt64.fromUint(1))],
                PlainMessage.create('test-message'),
                networkType,
                helper.maxFee,
            );
            transactions.push(transaction2.signWith(account3, generationHash));

            // 3. Aggregate
            const lastSignedTx = buildAggregateTransaction().signWith(account, generationHash);
            transactions.push(lastSignedTx);

            transactions.forEach((tx) => {
                transactionHashesMultiple.push(tx.hash);
                transactionRepository.announce(tx);
            });
            helper.listener.confirmed(account.address, lastSignedTx.hash).subscribe(() => {
                done();
            });
            helper.listener.status(account.address).subscribe((error) => {
                console.log('Error:', error);
                assert(false);
                done();
            });
            helper.listener.status(account3.address).subscribe((error) => {
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
        it('call transaction service', () => {
            return firstValueFrom(transactionService.resolveAliases(transactionHashes)).then((transactions) => {
                expect(transactions.length).to.be.equal(8);
                transactions.map((tx) => {
                    if (tx instanceof TransferTransaction) {
                        expect((tx.recipientAddress as Address).plain()).to.be.equal(account.address.plain());
                        expect(tx.mosaics.find((m) => m.id.toHex() === mosaicId.toHex())).not.to.equal(undefined);
                    } else if (tx instanceof AggregateTransaction) {
                        expect(tx.innerTransactions.length).to.be.equal(6);
                        // Assert Transfer
                        expect(((tx.innerTransactions[0] as TransferTransaction).recipientAddress as Address).plain()).to.be.equal(
                            account.address.plain(),
                        );
                        expect(
                            (tx.innerTransactions[0] as TransferTransaction).mosaics.find((m) => m.id.toHex() === mosaicId.toHex()),
                        ).not.to.equal(undefined);
                        // Assert MosaicMeta
                        expect((tx.innerTransactions[4] as MosaicMetadataTransaction).targetMosaicId.toHex() === newMosaicId.toHex()).to.be
                            .true;
                    }
                    return tx;
                });
            });
        });
    });

    describe('Test resolve alias with multiple transaction in single block', () => {
        it('call transaction service', () => {
            return firstValueFrom(transactionService.resolveAliases(transactionHashesMultiple)).then((tx) => {
                expect(tx.length).to.be.equal(3);
                expect((tx[0] as TransferTransaction).mosaics[0].id.toHex()).to.be.equal(mosaicId.toHex());
                expect((tx[1] as TransferTransaction).mosaics[0].id.toHex()).to.be.equal(mosaicId.toHex());
                expect(
                    ((tx[2] as AggregateTransaction).innerTransactions[4] as MosaicMetadataTransaction).targetMosaicId.toHex(),
                ).to.be.equal(newMosaicId.toHex());
                return tx;
            });
        });
    });
});
