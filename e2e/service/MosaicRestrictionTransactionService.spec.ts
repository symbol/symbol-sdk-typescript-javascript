import { assert, expect } from 'chai';
import { Listener } from '../../src/infrastructure/Listener';
import { RestrictionHttp } from '../../src/infrastructure/RestrictionHttp';
import { TransactionHttp } from '../../src/infrastructure/TransactionHttp';
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

describe('MosaicRestrictionTransactionService', () => {
    const deadline = Deadline.create();
    const key = '9876543';
    let targetAccount: Account;
    let account: Account;
    let restrictionHttp: RestrictionHttp;
    let transactionHttp: TransactionHttp;
    let mosaicId: MosaicId;
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
            account = Account.createFromPrivateKey(json.testAccount.privateKey, NetworkType.MIJIN_TEST);
            targetAccount = Account.createFromPrivateKey(json.testAccount3.privateKey, NetworkType.MIJIN_TEST);
            generationHash = json.generationHash;
            restrictionHttp = new RestrictionHttp(json.apiUrl);
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
                done();
            });
            transactionHttp.announce(signedTransaction);
        });
    });

    describe('MosaicGlobalRestrictionTransaction - with referenceMosaicId', () => {
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
                UInt64.fromNumericString(key),
                UInt64.fromUint(0),
                MosaicRestrictionType.NONE,
                UInt64.fromUint(0),
                MosaicRestrictionType.GE,
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = mosaicGlobalRestrictionTransaction.signWith(account, generationHash);

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
                UInt64.fromNumericString(key),
                targetAccount.address,
                UInt64.fromUint(2),
                NetworkType.MIJIN_TEST,
            );
            const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                [mosaicAddressRestrictionTransaction.toAggregate(account.publicAccount)],
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
     * Test
     * =========================
     */
    describe('Test new services', () => {
        it('should create MosaicGlobalRestrictionTransaction', (done) => {
            const service = new MosaicRestrictionTransactionService(restrictionHttp);

            return service.createMosaicGlobalRestrictionTransaction(
                    deadline,
                    NetworkType.MIJIN_TEST,
                    mosaicId,
                    key,
                    '1',
                    MosaicRestrictionType.GE,
                ).subscribe((transaction: MosaicGlobalRestrictionTransaction) => {
                    expect(transaction.type).to.be.equal(TransactionType.MOSAIC_GLOBAL_RESTRICTION);
                    expect(transaction.previousRestrictionValue.toString()).to.be.equal('0');
                    expect(transaction.previousRestrictionType).to.be.equal(MosaicRestrictionType.GE);
                    expect(transaction.newRestrictionValue.toString()).to.be.equal('1');
                    expect(transaction.newRestrictionType).to.be.equal(MosaicRestrictionType.GE);
                    expect(transaction.restrictionKey.toString()).to.be.equal(key);
                    done();
            });
        });
        it('should create MosaicAddressRestrictionTransaction', (done) => {
            const service = new MosaicRestrictionTransactionService(restrictionHttp);

            return service.createMosaicAddressRestrictionTransaction(
                    deadline,
                    NetworkType.MIJIN_TEST,
                    mosaicId,
                    key,
                    targetAccount.address,
                    '3',
                ).subscribe((transaction: MosaicAddressRestrictionTransaction) => {
                    expect(transaction.type).to.be.equal(TransactionType.MOSAIC_ADDRESS_RESTRICTION);
                    expect(transaction.previousRestrictionValue.toString()).to.be.equal('2');
                    expect(transaction.newRestrictionValue.toString()).to.be.equal('3');
                    expect(transaction.targetAddress.plain()).to.be.equal(targetAccount.address.plain());
                    expect(transaction.restrictionKey.toString()).to.be.equal(key);
                    done();
            });
        });
    });

    describe('Announce MosaicGlobalRestriction through service', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('should create MosaicGlobalRestriction and announce', (done) => {
            const service = new MosaicRestrictionTransactionService(restrictionHttp);

            return service.createMosaicGlobalRestrictionTransaction(
                            deadline,
                            NetworkType.MIJIN_TEST,
                            mosaicId,
                            key,
                            '1',
                            MosaicRestrictionType.GE,
            ).subscribe((transaction: MosaicGlobalRestrictionTransaction) => {
                    const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                        [transaction.toAggregate(account.publicAccount)],
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
    });

    describe('Announce MosaicAddressRestriction through service', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });
        it('should create MosaicAddressRestriction and announce', (done) => {
            const service = new MosaicRestrictionTransactionService(restrictionHttp);

            return service.createMosaicAddressRestrictionTransaction(
                            deadline,
                            NetworkType.MIJIN_TEST,
                            mosaicId,
                            key,
                            targetAccount.address,
                            '3',
            ).subscribe((transaction: MosaicAddressRestrictionTransaction) => {
                    const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
                        [transaction.toAggregate(account.publicAccount)],
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
    });
});
