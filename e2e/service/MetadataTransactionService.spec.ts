import { expect } from 'chai';
import { Listener } from '../../src/infrastructure/Listener';
import { MetadataHttp } from '../../src/infrastructure/MetadataHttp';
import { TransactionHttp } from '../../src/infrastructure/TransactionHttp';
import { Account } from '../../src/model/account/Account';
import { NetworkType } from '../../src/model/blockchain/NetworkType';
import { MetadataType } from '../../src/model/metadata/MetadataType';
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
import { TransactionType } from '../../src/model/transaction/TransactionType';
import { UInt64 } from '../../src/model/UInt64';
import { MetadataTransactionService } from '../../src/service/MetadataTransactionService';

describe('MetadataTransactionService', () => {
    const deadline = Deadline.create();
    const key = UInt64.fromUint(123);
    const newValue = 'new test value';
    let targetAccount: Account;
    let metadataHttp: MetadataHttp;
    let transactionHttp: TransactionHttp;
    let mosaicId: MosaicId;
    let namespaceId: NamespaceId;
    let config;
    let generationHash: string;

    before((done) => {
        const path = require('path');
        require('fs').readFile(path.resolve(__dirname, '../conf/network.conf'), (err, data) => {
            if (err) {
                throw err;
            }
            const json = JSON.parse(data);
            config = json;
            targetAccount = Account.createFromPrivateKey(json.testAccount.privateKey, NetworkType.MIJIN_TEST);
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
            mosaicId = MosaicId.createFromNonce(nonce, targetAccount.publicAccount);
            const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
                Deadline.create(),
                nonce,
                mosaicId,
                MosaicFlags.create( true, true, true),
                3,
                UInt64.fromUint(1000),
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = mosaicDefinitionTransaction.signWith(targetAccount, generationHash);
            listener.confirmed(targetAccount.address).subscribe(() => {
                done();
            });
            listener.status(targetAccount.address).subscribe((error) => {
                console.log('Error:', error);
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
            const signedTransaction = registerNamespaceTransaction.signWith(targetAccount, generationHash);
            listener.confirmed(targetAccount.address).subscribe(() => {
                done();
            });
            listener.status(targetAccount.address).subscribe((error) => {
                console.log('Error:', error);
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
                targetAccount.publicKey,
                key,
                mosaicId,
                newValue.length,
                newValue,
                NetworkType.MIJIN_TEST,
            );

            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [mosaicMetadataTransaction.toAggregate(targetAccount.publicAccount)],
                NetworkType.MIJIN_TEST,
                [],
            );
            const signedTransaction = aggregateTransaction.signWith(targetAccount, generationHash);
            listener.confirmed(targetAccount.address).subscribe(() => {
                done();
            });
            listener.status(targetAccount.address).subscribe((error) => {
                console.log('Error:', error);
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
                targetAccount.publicKey,
                key,
                namespaceId,
                newValue.length,
                newValue,
                NetworkType.MIJIN_TEST,
            );

            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [namespaceMetadataTransaction.toAggregate(targetAccount.publicAccount)],
                NetworkType.MIJIN_TEST,
                [],
            );
            const signedTransaction = aggregateTransaction.signWith(targetAccount, generationHash);
            listener.confirmed(targetAccount.address).subscribe(() => {
                done();
            });
            listener.status(targetAccount.address).subscribe((error) => {
                console.log('Error:', error);
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });

    /**
     * =========================
     * Test
     * =========================
     */
    describe('Test new services', () => {
        it('should create AccountMetadataTransaction - no current metadata', (done) => {
            const metaDataService = new MetadataTransactionService(metadataHttp);

            return metaDataService.createMetadataTransaction(
                    deadline,
                    NetworkType.MIJIN_TEST,
                    MetadataType.Account,
                    targetAccount.publicAccount,
                    key.toHex(),
                    newValue,
                    targetAccount.publicAccount,
                ).subscribe((transaction: AccountMetadataTransaction) => {
                    expect(transaction.type).to.be.equal(TransactionType.ACCOUNT_METADATA_TRANSACTION);
                    expect(transaction.scopedMetadataKey.toHex()).to.be.equal(key.toHex());
                    expect(transaction.value).to.be.equal(newValue);
                    expect(transaction.targetPublicKey).to.be.equal(targetAccount.publicKey);
                    done();
            });
        });
        it('should create MosaicMetadataTransaction', (done) => {
            const metaDataService = new MetadataTransactionService(metadataHttp);

            return metaDataService.createMetadataTransaction(
                    deadline,
                    NetworkType.MIJIN_TEST,
                    MetadataType.Mosaic,
                    targetAccount.publicAccount,
                    key.toHex(),
                    newValue + '1',
                    targetAccount.publicAccount,
                    mosaicId,
                ).subscribe((transaction: MosaicMetadataTransaction) => {
                    expect(transaction.type).to.be.equal(TransactionType.MOSAIC_METADATA_TRANSACTION);
                    expect(transaction.scopedMetadataKey.toHex()).to.be.equal(key.toHex());
                    expect(transaction.valueSizeDelta).to.be.equal(1);
                    expect(transaction.value).to.be.equal(newValue + '1');
                    expect(transaction.targetPublicKey).to.be.equal(targetAccount.publicKey);
                    expect(transaction.targetMosaicId.toHex()).to.be.equal(mosaicId.toHex());
                    done();
            });
        });
        it('should create NamespaceMetadataTransaction', (done) => {
            const metaDataService = new MetadataTransactionService(metadataHttp);

            return metaDataService.createMetadataTransaction(
                    deadline,
                    NetworkType.MIJIN_TEST,
                    MetadataType.Namespace,
                    targetAccount.publicAccount,
                    key.toHex(),
                    newValue + '1',
                    targetAccount.publicAccount,
                    namespaceId,
                ).subscribe((transaction: NamespaceMetadataTransaction) => {
                    expect(transaction.type).to.be.equal(TransactionType.NAMESPACE_METADATA_TRANSACTION);
                    expect(transaction.scopedMetadataKey.toHex()).to.be.equal(key.toHex());
                    expect(transaction.valueSizeDelta).to.be.equal(1);
                    expect(transaction.value).to.be.equal(newValue + '1');
                    expect(transaction.targetPublicKey).to.be.equal(targetAccount.publicKey);
                    expect(transaction.targetNamespaceId.toHex()).to.be.equal(namespaceId.toHex());
                    done();
            });
        });
    });
});
