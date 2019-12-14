import { expect } from 'chai';
import { KeyGenerator } from '../../src/core/format/KeyGenerator';
import { RestrictionMosaicRepository } from '../../src/infrastructure/RestrictionMosaicRepository';
import { Account } from '../../src/model/account/Account';
import { NetworkType } from '../../src/model/blockchain/NetworkType';
import { MosaicFlags } from '../../src/model/mosaic/MosaicFlags';
import { MosaicId } from '../../src/model/mosaic/MosaicId';
import { MosaicNonce } from '../../src/model/mosaic/MosaicNonce';
import { MosaicRestrictionType } from '../../src/model/restriction/MosaicRestrictionType';
import { AggregateTransaction } from '../../src/model/transaction/AggregateTransaction';
import { Deadline } from '../../src/model/transaction/Deadline';
import { MosaicAddressRestrictionTransaction } from '../../src/model/transaction/MosaicAddressRestrictionTransaction';
import { MosaicDefinitionTransaction } from '../../src/model/transaction/MosaicDefinitionTransaction';
import { MosaicGlobalRestrictionTransaction } from '../../src/model/transaction/MosaicGlobalRestrictionTransaction';
import { TransactionType } from '../../src/model/transaction/TransactionType';
import { UInt64 } from '../../src/model/UInt64';
import { MosaicRestrictionTransactionService } from '../../src/service/MosaicRestrictionTransactionService';
import { IntegrationTestHelper } from "../infrastructure/IntegrationTestHelper";

describe('MosaicRestrictionTransactionService', () => {
    const deadline = Deadline.create();
    const key = KeyGenerator.generateUInt64Key('TestKey');
    let targetAccount: Account;
    let account: Account;
    let restrictionRepository: RestrictionMosaicRepository;
    let mosaicId: MosaicId;
    let generationHash: string;
    let helper = new IntegrationTestHelper();
    let networkType: NetworkType;

    before(() => {
        return helper.start().then(() => {
            targetAccount = helper.account;
            generationHash = helper.generationHash;
            networkType = helper.networkType;
            restrictionRepository = helper.repositoryFactory.createRestrictionMosaicRepository();
        });
    });

    before(() => {
        return helper.listener.open();
    });

    after(() => {
        helper.listener.close();
    });
    afterEach((done) => {
        // cold down
        setTimeout(done, 200);
    });

    /**
     * =========================
     * Setup test data
     * =========================
     */

    describe('MosaicDefinitionTransaction', () => {

        it('standalone', () => {
            const nonce = MosaicNonce.createRandom();
            mosaicId = MosaicId.createFromNonce(nonce, account.publicAccount);
            const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
                Deadline.create(),
                nonce,
                mosaicId,
                MosaicFlags.create(true, true, true),
                3,
                UInt64.fromUint(1000),
                networkType, helper.maxFee
            );
            const signedTransaction = mosaicDefinitionTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    describe('MosaicGlobalRestrictionTransaction - with referenceMosaicId', () => {

        it('standalone', () => {
            const mosaicGlobalRestrictionTransaction = MosaicGlobalRestrictionTransaction.create(
                Deadline.create(),
                mosaicId,
                key,
                UInt64.fromUint(0),
                MosaicRestrictionType.NONE,
                UInt64.fromUint(0),
                MosaicRestrictionType.GE,
                networkType,
                undefined,
                helper.maxFee
            );
            const signedTransaction = mosaicGlobalRestrictionTransaction.signWith(account, generationHash)
            return helper.announce(signedTransaction);
        });
    });

    describe('MosaicAddressRestrictionTransaction', () => {

        it('aggregate', () => {
            const mosaicAddressRestrictionTransaction = MosaicAddressRestrictionTransaction.create(
                Deadline.create(),
                mosaicId,
                key,
                targetAccount.address,
                UInt64.fromUint(2),
                networkType,
                helper.maxFee
            );
            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [mosaicAddressRestrictionTransaction.toAggregate(account.publicAccount)],
                networkType,
                [], helper.maxFee
            );
            const signedTransaction = aggregateTransaction.signWith(account, generationHash);
            return helper.announce(signedTransaction);
        });
    });

    /**
     * =========================
     * Test
     * =========================
     */
    describe('Test new services', () => {
        it('should create MosaicGlobalRestrictionTransaction', (done) => {
            const service = new MosaicRestrictionTransactionService(restrictionRepository);

            return service.createMosaicGlobalRestrictionTransaction(
                deadline,
                networkType,
                mosaicId,
                key,
                '1',
                MosaicRestrictionType.GE, undefined, helper.maxFee
            ).subscribe((transaction: MosaicGlobalRestrictionTransaction) => {
                expect(transaction.type).to.be.equal(TransactionType.MOSAIC_GLOBAL_RESTRICTION);
                expect(transaction.previousRestrictionValue.toString()).to.be.equal('0');
                expect(transaction.previousRestrictionType).to.be.equal(MosaicRestrictionType.GE);
                expect(transaction.newRestrictionValue.toString()).to.be.equal('1');
                expect(transaction.newRestrictionType).to.be.equal(MosaicRestrictionType.GE);
                expect(transaction.restrictionKey.toHex()).to.be.equal(key.toHex());
                done();
            });
        });
        it('should create MosaicAddressRestrictionTransaction', (done) => {
            const service = new MosaicRestrictionTransactionService(restrictionRepository);

            return service.createMosaicAddressRestrictionTransaction(
                deadline,
                networkType,
                mosaicId,
                key,
                targetAccount.address,
                '3',
                helper.maxFee
            ).subscribe((transaction: MosaicAddressRestrictionTransaction) => {
                expect(transaction.type).to.be.equal(TransactionType.MOSAIC_ADDRESS_RESTRICTION);
                expect(transaction.previousRestrictionValue.toString()).to.be.equal('2');
                expect(transaction.newRestrictionValue.toString()).to.be.equal('3');
                expect(transaction.targetAddressToString()).to.be.equal(targetAccount.address.plain());
                expect(transaction.restrictionKey.toHex()).to.be.equal(key.toHex());
                done();
            });
        });
    });

    describe('Announce MosaicGlobalRestriction through service', () => {

        it('should create MosaicGlobalRestriction and announce', (done) => {
            const service = new MosaicRestrictionTransactionService(restrictionRepository);
            service.createMosaicGlobalRestrictionTransaction(
                deadline,
                networkType,
                mosaicId,
                key,
                '1',
                MosaicRestrictionType.GE, undefined, helper.maxFee
            ).subscribe((transaction: MosaicGlobalRestrictionTransaction) => {
                const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                    [transaction.toAggregate(account.publicAccount)],
                    networkType,
                    [],
                    helper.maxFee
                );
                const signedTransaction = aggregateTransaction.signWith(account, generationHash);
                helper.announce(signedTransaction).then(() => {
                    done();
                });
            });
        });
    });

    describe('Announce MosaicAddressRestriction through service', () => {

        it('should create MosaicAddressRestriction and announce', (done) => {
            const service = new MosaicRestrictionTransactionService(restrictionRepository);

            return service.createMosaicAddressRestrictionTransaction(
                deadline,
                networkType,
                mosaicId,
                key,
                targetAccount.address,
                '3',
                helper.maxFee
            ).subscribe((transaction: MosaicAddressRestrictionTransaction) => {
                const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                    [transaction.toAggregate(account.publicAccount)],
                    networkType,
                    [],
                    helper.maxFee
                );
                const signedTransaction = aggregateTransaction.signWith(account, generationHash);
                helper.announce(signedTransaction).then(() => {
                    done();
                });
            });
        });
    });
});
