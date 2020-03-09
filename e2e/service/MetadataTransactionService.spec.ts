import { expect } from 'chai';
import { Convert } from '../../src/core/format';
import { MetadataRepository } from '../../src/infrastructure/MetadataRepository';
import { Account } from '../../src/model/account/Account';
import { NetworkType } from '../../src/model/network/NetworkType';
import { MetadataType } from '../../src/model/metadata/MetadataType';
import { MosaicFlags } from '../../src/model/mosaic/MosaicFlags';
import { MosaicId } from '../../src/model/mosaic/MosaicId';
import { MosaicNonce } from '../../src/model/mosaic/MosaicNonce';
import { NamespaceId } from '../../src/model/namespace/NamespaceId';
import { AggregateTransaction } from '../../src/model/transaction/AggregateTransaction';
import { Deadline } from '../../src/model/transaction/Deadline';
import { MosaicDefinitionTransaction } from '../../src/model/transaction/MosaicDefinitionTransaction';
import { MosaicMetadataTransaction } from '../../src/model/transaction/MosaicMetadataTransaction';
import { NamespaceMetadataTransaction } from '../../src/model/transaction/NamespaceMetadataTransaction';
import { NamespaceRegistrationTransaction } from '../../src/model/transaction/NamespaceRegistrationTransaction';
import { TransactionType } from '../../src/model/transaction/TransactionType';
import { UInt64 } from '../../src/model/UInt64';
import { MetadataTransactionService } from '../../src/service/MetadataTransactionService';
import { IntegrationTestHelper } from '../infrastructure/IntegrationTestHelper';

describe('MetadataTransactionService', () => {
    const deadline = Deadline.create();
    const key = UInt64.fromUint(123);
    const newValue = 'new test value';

    const helper = new IntegrationTestHelper();
    let networkType: NetworkType;

    let targetAccount: Account;
    let metadataRepository: MetadataRepository;
    let mosaicId: MosaicId;
    let namespaceId: NamespaceId;
    let generationHash: string;

    before(() => {
        return helper.start().then(() => {
            targetAccount = helper.account;
            generationHash = helper.generationHash;
            networkType = helper.networkType;
            metadataRepository = helper.repositoryFactory.createMetadataRepository();
        });
    });

    before(() => {
        return helper.listener.open();
    });

    after(() => {
        helper.listener.close();
    });

    /**
     * =========================
     * Setup test data
     * =========================
     */

    describe('MosaicDefinitionTransaction', () => {

        it('standalone', () => {
            const nonce = MosaicNonce.createRandom();
            mosaicId = MosaicId.createFromNonce(nonce, targetAccount.publicAccount);
            const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
                Deadline.create(),
                nonce,
                mosaicId,
                MosaicFlags.create(true, true, true),
                3,
                UInt64.fromUint(1000),
                networkType, helper.maxFee,
            );
            const signedTransaction = mosaicDefinitionTransaction.signWith(targetAccount, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('Setup test NamespaceId', () => {

        it('Announce NamespaceRegistrationTransaction', () => {
            const namespaceName = 'root-test-namespace-' + Math.floor(Math.random() * 10000);
            const registerNamespaceTransaction = NamespaceRegistrationTransaction.createRootNamespace(
                Deadline.create(),
                namespaceName,
                UInt64.fromUint(9),
                networkType, helper.maxFee,
            );
            namespaceId = new NamespaceId(namespaceName);
            const signedTransaction = registerNamespaceTransaction.signWith(targetAccount, generationHash);

            return helper.announce(signedTransaction);
        });
    });

    describe('MosaicMetadataTransaction', () => {

        it('aggregate', () => {
            const mosaicMetadataTransaction = MosaicMetadataTransaction.create(
                Deadline.create(),
                targetAccount.publicKey,
                key,
                mosaicId,
                newValue.length,
                newValue,
                networkType,
                helper.maxFee,
            );

            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [mosaicMetadataTransaction.toAggregate(targetAccount.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(targetAccount, generationHash);

            return helper.announce(signedTransaction);
        });
    });

    describe('NamespaceMetadataTransaction', () => {

        it('aggregate', () => {
            const namespaceMetadataTransaction = NamespaceMetadataTransaction.create(
                Deadline.create(),
                targetAccount.publicKey,
                key,
                namespaceId,
                newValue.length,
                newValue,
                networkType,
            );

            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [namespaceMetadataTransaction.toAggregate(targetAccount.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(targetAccount, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    /**
     * =========================
     * Test
     * =========================
     */
    describe('Test new services', () => {

        it('should create AccountMetadataTransaction - no current metadata', async () => {
            const metaDataService = new MetadataTransactionService(metadataRepository);

            const transaction = await metaDataService.createMetadataTransaction(
                deadline,
                networkType,
                MetadataType.Account,
                targetAccount.publicAccount,
                key,
                newValue,
                targetAccount.publicAccount,
            ).toPromise();

            expect(transaction.type).to.be.equal(TransactionType.ACCOUNT_METADATA);
            expect(transaction.scopedMetadataKey.toHex()).to.be.equal(key.toHex());
            expect(transaction.value).to.be.equal(newValue);
            expect(transaction.targetPublicKey).to.be.equal(targetAccount.publicKey);
        });

        it('should create MosaicMetadataTransaction', async () => {
            const metaDataService = new MetadataTransactionService(metadataRepository);
            const updateValue = newValue + 'delta';
            const transaction = await metaDataService.createMetadataTransaction(
                deadline,
                networkType,
                MetadataType.Mosaic,
                targetAccount.publicAccount,
                key,
                updateValue,
                targetAccount.publicAccount,
                mosaicId,
            ).toPromise() as MosaicMetadataTransaction;
            expect(transaction.type).to.be.equal(TransactionType.MOSAIC_METADATA);
            expect(transaction.scopedMetadataKey.toHex()).to.be.equal(key.toHex());
            expect(transaction.valueSizeDelta).to.be.equal(5);
            expect(transaction.value).to.be.equals(
                Convert.decodeHex(Convert.xor(Convert.utf8ToUint8(newValue), Convert.utf8ToUint8(updateValue))));
            expect(transaction.targetPublicKey).to.be.equal(targetAccount.publicKey);
            expect(transaction.targetMosaicId.toHex()).to.be.equal(mosaicId.toHex());
        });

        it('should create NamespaceMetadataTransaction', async () => {
            const metaDataService = new MetadataTransactionService(metadataRepository);

            const updateValue = newValue + 'delta';
            const transaction = await metaDataService.createMetadataTransaction(
                deadline,
                networkType,
                MetadataType.Namespace,
                targetAccount.publicAccount,
                key,
                updateValue,
                targetAccount.publicAccount,
                namespaceId,
            ).toPromise() as NamespaceMetadataTransaction;

            expect(transaction.type).to.be.equal(TransactionType.NAMESPACE_METADATA);
            expect(transaction.scopedMetadataKey.toHex()).to.be.equal(key.toHex());
            expect(transaction.valueSizeDelta).to.be.equal(5);
            expect(transaction.value).to.be.equals( Convert.decodeHex(
                Convert.xor(Convert.utf8ToUint8(newValue), Convert.utf8ToUint8(updateValue))));
            expect(transaction.targetPublicKey).to.be.equal(targetAccount.publicKey);
            expect(transaction.targetNamespaceId.toHex()).to.be.equal(namespaceId.toHex());
        });
    });

    describe('Announce transaction through service', () => {

        it('should create MosaicMetadataTransaction and announce', async () => {
            const metaDataService = new MetadataTransactionService(metadataRepository);

            const transaction = await metaDataService.createMetadataTransaction(
                deadline,
                networkType,
                MetadataType.Mosaic,
                targetAccount.publicAccount,
                key,
                newValue + 'delta',
                targetAccount.publicAccount,
                mosaicId,
                helper.maxFee,
            ).toPromise();
            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [transaction.toAggregate(targetAccount.publicAccount)],
                networkType,
                [],
                helper.maxFee,
            );
            const signedTransaction = aggregateTransaction.signWith(targetAccount, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('Announce transaction through service with delta size increase', () => {

        it('should create MosaicMetadataTransaction and announce', () => {
            const metaDataService = new MetadataTransactionService(metadataRepository);

            return metaDataService.createMetadataTransaction(
                deadline,
                networkType,
                MetadataType.Mosaic,
                targetAccount.publicAccount,
                key,
                newValue + 'delta' + 'extra delta',
                targetAccount.publicAccount,
                mosaicId,
                helper.maxFee,
            ).toPromise().then((transaction: MosaicMetadataTransaction) => {
                const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                    [transaction.toAggregate(targetAccount.publicAccount)],
                    networkType,
                    [],
                    helper.maxFee,
                );
                const signedTransaction = aggregateTransaction.signWith(targetAccount, generationHash);
                return helper.announce(signedTransaction);
            });
        });
    });

    describe('Announce transaction through service with delta size decrease', () => {

        it('should create MosaicMetadataTransaction and announce', async () => {
            const metaDataService = new MetadataTransactionService(metadataRepository);

            return metaDataService.createMetadataTransaction(
                deadline,
                networkType,
                MetadataType.Mosaic,
                targetAccount.publicAccount,
                key,
                newValue,
                targetAccount.publicAccount,
                mosaicId,
            ).toPromise().then((transaction: MosaicMetadataTransaction) => {
                const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                    [transaction.toAggregate(targetAccount.publicAccount)],
                    networkType,
                    [],
                    helper.maxFee,
                );
                const signedTransaction = aggregateTransaction.signWith(targetAccount, generationHash);
                return helper.announce(signedTransaction);
            });
        });
    });
});
