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
import {expect} from 'chai';
import * as CryptoJS from 'crypto-js';
import {ChronoUnit} from 'js-joda';
import {keccak_256, sha3_256} from 'js-sha3';
import {convert, nacl_catapult} from 'nem2-library';
import {AccountHttp} from '../../src/infrastructure/AccountHttp';
import {Listener} from '../../src/infrastructure/Listener';
import {TransactionHttp} from '../../src/infrastructure/TransactionHttp';
import {Account} from '../../src/model/account/Account';
import {Address} from '../../src/model/account/Address';
import {PublicAccount} from '../../src/model/account/PublicAccount';
import {NetworkType} from '../../src/model/blockchain/NetworkType';
import {MosaicId} from '../../src/model/mosaic/MosaicId';
import {MosaicNonce} from '../../src/model/mosaic/MosaicNonce';
import {MosaicProperties} from '../../src/model/mosaic/MosaicProperties';
import {MosaicSupplyType} from '../../src/model/mosaic/MosaicSupplyType';
import {NetworkCurrencyMosaic} from '../../src/model/mosaic/NetworkCurrencyMosaic';
import {AggregateTransaction} from '../../src/model/transaction/AggregateTransaction';
import {CosignatureSignedTransaction} from '../../src/model/transaction/CosignatureSignedTransaction';
import {CosignatureTransaction} from '../../src/model/transaction/CosignatureTransaction';
import {Deadline} from '../../src/model/transaction/Deadline';
import {HashType} from '../../src/model/transaction/HashType';
import {LockFundsTransaction} from '../../src/model/transaction/LockFundsTransaction';
import {ModifyMultisigAccountTransaction} from '../../src/model/transaction/ModifyMultisigAccountTransaction';
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
    let testAccountNoBalance: Account;
    let transactionHttp: TransactionHttp;
    let multisigAccount: Account;
    let cosignAccount1: Account;
    let mosaicId: MosaicId;
    let accountHttp: AccountHttp;
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
            testAccountNoBalance = Account.createFromPrivateKey(json.testAccountNoBalance.privateKey, NetworkType.MIJIN_TEST);
            multisigAccount = Account.createFromPrivateKey(json.multisigAccount.privateKey, NetworkType.MIJIN_TEST);
            cosignAccount1 = Account.createFromPrivateKey(json.cosignatoryAccount.privateKey, NetworkType.MIJIN_TEST);
            mosaicId = new MosaicId(json.testMosaicId);
            transactionHash = json.testTransaction.transactionHash;
            transactionId = json.testTransaction.transactionId;
            accountHttp = new AccountHttp(json.apiUrl);
            transactionHttp = new TransactionHttp(json.apiUrl);
            done();
        });
    });

    // describe('TransferTransaction', () => {
    //     let listener: Listener;
    //     before (() => {
    //         listener = new Listener(config.apiUrl);
    //         return listener.open();
    //     });
    //     after(() => {
    //         return listener.close();
    //     });

    //     it('standalone', (done) => {
    //         const transferTransaction = TransferTransaction.create(
    //             Deadline.create(),
    //             account2.address,
    //             [NetworkCurrencyMosaic.createAbsolute(1)],
    //             PlainMessage.create('test-message'),
    //             NetworkType.MIJIN_TEST,
    //         );
    //         const signedTransaction = transferTransaction.signWith(account);

    //         listener.confirmed(account.address).subscribe((transaction: Transaction) => {
    //             done();
    //         });
    //         transactionHttp.announce(signedTransaction);
    //     });
    // });
    // describe('TransferTransaction', () => {
    //     let listener: Listener;
    //     before (() => {
    //         listener = new Listener(config.apiUrl);
    //         return listener.open();
    //     });
    //     after(() => {
    //         return listener.close();
    //     });
    //     it('aggregate', (done) => {
    //         const transferTransaction = TransferTransaction.create(
    //             Deadline.create(),
    //             account2.address,
    //             [NetworkCurrencyMosaic.createAbsolute(1)],
    //             PlainMessage.create('test-message'),
    //             NetworkType.MIJIN_TEST,
    //         );
    //         const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
    //             [transferTransaction.toAggregate(account.publicAccount)],
    //             NetworkType.MIJIN_TEST,
    //             [],
    //         );
    //         const signedTransaction = aggregateTransaction.signWith(account);
    //         listener.confirmed(account.address).subscribe((transaction: Transaction) => {
    //             done();
    //         });
    //         transactionHttp.announce(signedTransaction);
    //     });
    // });

    // describe('RegisterNamespaceTransaction', () => {
    //     let listener: Listener;
    //     before (() => {
    //         listener = new Listener(config.apiUrl);
    //         return listener.open();
    //     });
    //     after(() => {
    //         return listener.close();
    //     });
    //     it('standalone', (done) => {
    //         namespaceName = 'root-test-namespace-' + Math.floor(Math.random() * 10000);
    //         const registerNamespaceTransaction = RegisterNamespaceTransaction.createRootNamespace(
    //             Deadline.create(),
    //             namespaceName,
    //             UInt64.fromUint(1000),
    //             NetworkType.MIJIN_TEST,
    //         );
    //         const signedTransaction = registerNamespaceTransaction.signWith(account);
    //         listener.confirmed(account.address).subscribe((transaction: Transaction) => {
    //             done();
    //         });
    //         transactionHttp.announce(signedTransaction);
    //     });
    // });
    // describe('RegisterNamespaceTransaction', () => {
    //     let listener: Listener;
    //     before (() => {
    //         listener = new Listener(config.apiUrl);
    //         return listener.open();
    //     });
    //     after(() => {
    //         return listener.close();
    //     });
    //     it('aggregate', (done) => {
    //         const registerNamespaceTransaction = RegisterNamespaceTransaction.createRootNamespace(
    //             Deadline.create(),
    //             'root-test-namespace-' + Math.floor(Math.random() * 10000),
    //             UInt64.fromUint(1000),
    //             NetworkType.MIJIN_TEST,
    //         );
    //         const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
    //             [registerNamespaceTransaction.toAggregate(account.publicAccount)],
    //             NetworkType.MIJIN_TEST,
    //             []);
    //         const signedTransaction = aggregateTransaction.signWith(account);
    //         listener.confirmed(account.address).subscribe((transaction: Transaction) => {
    //             done();
    //         });
    //         transactionHttp.announce(signedTransaction);
    //     });
    // });
    // describe('MosaicDefinitionTransaction', () => {
    //     let listener: Listener;
    //     before (() => {
    //         listener = new Listener(config.apiUrl);
    //         return listener.open();
    //     });
    //     after(() => {
    //         return listener.close();
    //     });
    //     it('standalone', (done) => {
    //         const nonce = MosaicNonce.createRandom();
    //         const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
    //             Deadline.create(),
    //             nonce,
    //             MosaicId.createFromNonce(nonce, account.publicAccount),
    //             MosaicProperties.create({
    //                 supplyMutable: true,
    //                 transferable: true,
    //                 levyMutable: true,
    //                 divisibility: 3,
    //             }),
    //             NetworkType.MIJIN_TEST,
    //         );
    //         const signedTransaction = mosaicDefinitionTransaction.signWith(account);
    //         listener.confirmed(account.address).subscribe((transaction: Transaction) => {
    //             done();
    //         });
    //         transactionHttp.announce(signedTransaction);
    //     });
    // });
    // describe('MosaicDefinitionTransaction', () => {
    //     let listener: Listener;
    //     before (() => {
    //         listener = new Listener(config.apiUrl);
    //         return listener.open();
    //     });
    //     after(() => {
    //         return listener.close();
    //     });
    //     it('aggregate', (done) => {
    //         const nonce = MosaicNonce.createRandom();
    //         const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
    //             Deadline.create(),
    //             nonce,
    //             MosaicId.createFromNonce(nonce, account.publicAccount),
    //             MosaicProperties.create({
    //                 supplyMutable: true,
    //                 transferable: true,
    //                 levyMutable: true,
    //                 divisibility: 3,
    //             }),
    //             NetworkType.MIJIN_TEST,
    //         );
    //         const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
    //             [mosaicDefinitionTransaction.toAggregate(account.publicAccount)],
    //             NetworkType.MIJIN_TEST,
    //             []);
    //         const signedTransaction = aggregateTransaction.signWith(account);
    //         listener.confirmed(account.address).subscribe((transaction: Transaction) => {
    //             done();
    //         });
    //         transactionHttp.announce(signedTransaction);
    //     });
    // });
    // describe('MosaicSupplyChangeTransaction', () => {
    //     let listener: Listener;
    //     before (() => {
    //         listener = new Listener(config.apiUrl);
    //         return listener.open();
    //     });
    //     after(() => {
    //         return listener.close();
    //     });
    //     it('standalone', (done) => {
    //         const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
    //             Deadline.create(),
    //             mosaicId,
    //             MosaicSupplyType.Increase,
    //             UInt64.fromUint(10),
    //             NetworkType.MIJIN_TEST,
    //         );
    //         const signedTransaction = mosaicSupplyChangeTransaction.signWith(account);
    //         listener.confirmed(account.address).subscribe((transaction: Transaction) => {
    //             done();
    //         });
    //         transactionHttp.announce(signedTransaction);
    //     });
    // });
    // describe('MosaicSupplyChangeTransaction', () => {
    //     let listener: Listener;
    //     before (() => {
    //         listener = new Listener(config.apiUrl);
    //         return listener.open();
    //     });
    //     after(() => {
    //         return listener.close();
    //     });
    //     it('aggregate', (done) => {
    //         const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
    //             Deadline.create(),
    //             mosaicId,
    //             MosaicSupplyType.Increase,
    //             UInt64.fromUint(10),
    //             NetworkType.MIJIN_TEST,
    //         );
    //         const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(),
    //             [mosaicSupplyChangeTransaction.toAggregate(account.publicAccount)],
    //             NetworkType.MIJIN_TEST,
    //             []);
    //         const signedTransaction = aggregateTransaction.signWith(account);
    //         listener.confirmed(account.address).subscribe((transaction: Transaction) => {
    //             done();
    //         });
    //         transactionHttp.announce(signedTransaction);
    //     });
    // });

    // describe('LockFundsTransaction', () => {
    //     let listener: Listener;
    //     before (() => {
    //         listener = new Listener(config.apiUrl);
    //         return listener.open();
    //     });
    //     after(() => {
    //         return listener.close();
    //     });
    //     it('standalone', (done) => {
    //         const aggregateTransaction = AggregateTransaction.createBonded(
    //             Deadline.create(),
    //             [],
    //             NetworkType.MIJIN_TEST,
    //             [],
    //         );
    //         const signedTransaction = account.sign(aggregateTransaction);

    //         const lockFundsTransaction = LockFundsTransaction.create(Deadline.create(),
    //             NetworkCurrencyMosaic.createRelative(10),
    //             UInt64.fromUint(10000),
    //             signedTransaction,
    //             NetworkType.MIJIN_TEST);

    //         listener.confirmed(account.address).subscribe((transaction: Transaction) => {
    //             done();
    //         });
    //         transactionHttp.announce(lockFundsTransaction.signWith(account));
    //     });
    // });
    // describe('LockFundsTransaction', () => {
    //     let listener: Listener;
    //     before (() => {
    //         listener = new Listener(config.apiUrl);
    //         return listener.open();
    //     });
    //     after(() => {
    //         return listener.close();
    //     });
    //     it('aggregate', (done) => {
    //         const aggregateTransaction = AggregateTransaction.createBonded(
    //             Deadline.create(),
    //             [],
    //             NetworkType.MIJIN_TEST,
    //             [],
    //         );
    //         const signedTransaction = account.sign(aggregateTransaction);
    //         const lockFundsTransaction = LockFundsTransaction.create(Deadline.create(),
    //             NetworkCurrencyMosaic.createRelative(10),
    //             UInt64.fromUint(10),
    //             signedTransaction,
    //             NetworkType.MIJIN_TEST);
    //         const aggregateLockFundsTransaction = AggregateTransaction.createComplete(Deadline.create(),
    //             [lockFundsTransaction.toAggregate(account.publicAccount)],
    //             NetworkType.MIJIN_TEST,
    //             []);
    //         listener.confirmed(account.address).subscribe((transaction: Transaction) => {
    //             done();
    //         });
    //         transactionHttp.announce(aggregateLockFundsTransaction.signWith(account));
    //     });
    // });

    describe('aggregate complete tx', () => {
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
            const signedTx = signerAccount.sign(aggTx);
            transactionHttp.announce(signedTx)
                .subscribe((transactionAnnounceResponse) => {
                    expect(transactionAnnounceResponse.message)
                        .to.be.equal('packet 9 was pushed to the network via /transaction');
                    done();
                });
        });
    });

    describe('announceSync', () => {
        it('should return insufficient balance error', (done) => {
            const aggregateTransaction = AggregateTransaction.createBonded(
                            Deadline.create(),
                            [],
                            NetworkType.MIJIN_TEST,
                            [],
                        );
            const signedTransaction = account.sign(aggregateTransaction);

            const lockFundsTransaction = LockFundsTransaction.create(Deadline.create(),
                NetworkCurrencyMosaic.createAbsolute(0),
                UInt64.fromUint(10000),
                signedTransaction,
                NetworkType.MIJIN_TEST);

            transactionHttp
                .announceSync(lockFundsTransaction.signWith(account))
                .subscribe((shouldNotBeCalled) => {
                    throw new Error('should not be called');
                }, (err) => {
                    expect(err.status).to.be.equal('Failure_LockHash_Invalid_Mosaic_Amount');
                    done();
                });
        });
    });

    // it('ModifyMultisigAccountTransaction with cosignatories', (done) => {
    //     const modifyMultisigAccountTransaction = ModifyMultisigAccountTransaction.create(
    //         Deadline.create(),
    //         0,
    //         0,
    //         [new MultisigCosignatoryModification(
    //             MultisigCosignatoryModificationType.Add,
    //             PublicAccount.createFromPublicKey('B0F93CBEE49EEB9953C6F3985B15A4F238E205584D8F924C621CBE4D7AC6EC24',
    //                 NetworkType.MIJIN_TEST),
    //         )],
    //         NetworkType.MIJIN_TEST,
    //     );
    //     const aggregateTransaction = AggregateTransaction.createBonded(Deadline.create(20, ChronoUnit.MINUTES),
    //         [modifyMultisigAccountTransaction.toAggregate(MultisigAccount.publicAccount)],
    //         NetworkType.MIJIN_TEST,
    //         []);

    //     const signedTransaction = CosignatoryAccount.signTransactionWithCosignatories(
    //         aggregateTransaction,
    //         [Cosignatory2Account],
    //     );

    //     const lockFundsTransaction = LockFundsTransaction.create(Deadline.create(),
    //         NetworkCurrencyMosaic.createRelative(10),
    //         UInt64.fromUint(10000),
    //         signedTransaction,
    //         NetworkType.MIJIN_TEST);

    //     setTimeout(() => {
    //         transactionHttp.announce(lockFundsTransaction.signWith(CosignatoryAccount));
    //     }, 1000);

    //     validateTransactionAnnounceCorrectly(CosignatoryAccount.address, () => {
    //         validatePartialTransactionAnnounceCorrectly(CosignatoryAccount.address, done);
    //         setTimeout(() => {
    //             transactionHttp.announceAggregateBonded(signedTransaction);
    //         }, 1000);
    //     });
    // });

    //     it('CosignatureTransaction', (done) => {
    //         const transferTransaction = TransferTransaction.create(
    //             Deadline.create(),
    //             Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
    //             [NetworkCurrencyMosaic.createRelative(1)],
    //             PlainMessage.create('test-message'),
    //             NetworkType.MIJIN_TEST,
    //         );
    //         const aggregateTransaction = AggregateTransaction.createBonded(
    //             Deadline.create(2, ChronoUnit.MINUTES),
    //             [transferTransaction.toAggregate(MultisigAccount.publicAccount)],
    //             NetworkType.MIJIN_TEST,
    //             []);
    //         const signedTransaction = aggregateTransaction.signWith(
    //             CosignatoryAccount,
    //         );

    //         const lockFundsTransaction = LockFundsTransaction.create(Deadline.create(),
    //             NetworkCurrencyMosaic.createRelative(10),
    //             UInt64.fromUint(10000),
    //             signedTransaction,
    //             NetworkType.MIJIN_TEST);

    //         setTimeout(() => {
    //             transactionHttp.announce(lockFundsTransaction.signWith(CosignatoryAccount));
    //         }, 1000);

    //         validateTransactionAnnounceCorrectly(CosignatoryAccount.address, () => {
    //             setTimeout(() => {
    //                 transactionHttp.announceAggregateBonded(signedTransaction);
    //             }, 1000);

    //             validateCosignaturePartialTransactionAnnounceCorrectly(CosignatoryAccount.address, Cosignatory2Account.publicKey, done);
    //             validatePartialTransactionAnnounceCorrectly(CosignatoryAccount.address, () => {
    //                 accountHttp.aggregateBondedTransactions(CosignatoryAccount.publicAccount).subscribe((transactions) => {
    //                     const partialTransaction = transactions[0];
    //                     const cosignatureTransaction = CosignatureTransaction.create(partialTransaction);
    //                     const cosignatureSignedTransaction = Cosignatory2Account.signCosignatureTransaction(cosignatureTransaction);
    //                     transactionHttp.announceAggregateBondedCosignature(cosignatureSignedTransaction);
    //                 });
    //             });
    //         });
    //     });

    //     describe('SecretLockTransaction', () => {
    //         describe('HashType: Op_Sha3_256', () => {
    //             it('standalone', (done) => {
    //                 const secretLockTransaction = SecretLockTransaction.create(
    //                     Deadline.create(),
    //                     NetworkCurrencyMosaic.createAbsolute(10),
    //                     UInt64.fromUint(100),
    //                     HashType.Op_Sha3_256,
    //                     sha3_256.create().update(nacl_catapult.randomBytes(20)).hex(),
    //                     Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL'),
    //                     NetworkType.MIJIN_TEST,
    //                 );
    //                 validateTransactionAnnounceCorrectly(account.address, done);
    //                 transactionHttp.announce(secretLockTransaction.signWith(account));
    //             });

    //             it('aggregate', (done) => {
    //                 const secretLockTransaction = SecretLockTransaction.create(
    //                     Deadline.create(),
    //                     NetworkCurrencyMosaic.createAbsolute(10),
    //                     UInt64.fromUint(100),
    //                     HashType.Op_Sha3_256,
    //                     sha3_256.create().update(nacl_catapult.randomBytes(20)).hex(),
    //                     Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL'),
    //                     NetworkType.MIJIN_TEST,
    //                 );
    //                 const aggregateSecretLockTransaction = AggregateTransaction.createComplete(Deadline.create(),
    //                     [secretLockTransaction.toAggregate(account.publicAccount)],
    //                     NetworkType.MIJIN_TEST,
    //                     []);
    //                 validateTransactionAnnounceCorrectly(account.address, done);
    //                 transactionHttp.announce(aggregateSecretLockTransaction.signWith(account));
    //             });
    //         });
    //         describe('HashType: Keccak_256', () => {
    //             it('standalone', (done) => {
    //                 const secretLockTransaction = SecretLockTransaction.create(
    //                     Deadline.create(),
    //                     NetworkCurrencyMosaic.createAbsolute(10),
    //                     UInt64.fromUint(100),
    //                     HashType.Op_Keccak_256,
    //                     sha3_256.create().update(nacl_catapult.randomBytes(20)).hex(),
    //                     Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL'),
    //                     NetworkType.MIJIN_TEST,
    //                 );
    //                 validateTransactionAnnounceCorrectly(account.address, done);
    //                 transactionHttp.announce(secretLockTransaction.signWith(account));
    //             });

    //             it('aggregate', (done) => {
    //                 const secretLockTransaction = SecretLockTransaction.create(
    //                     Deadline.create(),
    //                     NetworkCurrencyMosaic.createAbsolute(10),
    //                     UInt64.fromUint(100),
    //                     HashType.Op_Keccak_256,
    //                     sha3_256.create().update(nacl_catapult.randomBytes(20)).hex(),
    //                     Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL'),
    //                     NetworkType.MIJIN_TEST,
    //                 );
    //                 const aggregateSecretLockTransaction = AggregateTransaction.createComplete(Deadline.create(),
    //                     [secretLockTransaction.toAggregate(account.publicAccount)],
    //                     NetworkType.MIJIN_TEST,
    //                     []);
    //                 validateTransactionAnnounceCorrectly(account.address, done);
    //                 transactionHttp.announce(aggregateSecretLockTransaction.signWith(account));
    //             });
    //         });
    //         describe('HashType: Op_Hash_160', () => {
    //             it('standalone', (done) => {
    //                 const secretLockTransaction = SecretLockTransaction.create(
    //                     Deadline.create(),
    //                     NetworkCurrencyMosaic.createAbsolute(10),
    //                     UInt64.fromUint(100),
    //                     HashType.Op_Hash_160,
    //                     sha3_256.create().update(nacl_catapult.randomBytes(20)).hex(),
    //                     Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL'),
    //                     NetworkType.MIJIN_TEST,
    //                 );
    //                 validateTransactionAnnounceCorrectly(account.address, done);
    //                 transactionHttp.announce(secretLockTransaction.signWith(account));
    //             });

    //             it('aggregate', (done) => {
    //                 const secretLockTransaction = SecretLockTransaction.create(
    //                     Deadline.create(),
    //                     NetworkCurrencyMosaic.createAbsolute(10),
    //                     UInt64.fromUint(100),
    //                     HashType.Op_Hash_160,
    //                     sha3_256.create().update(nacl_catapult.randomBytes(20)).hex(),
    //                     Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL'),
    //                     NetworkType.MIJIN_TEST,
    //                 );
    //                 const aggregateSecretLockTransaction = AggregateTransaction.createComplete(Deadline.create(),
    //                     [secretLockTransaction.toAggregate(account.publicAccount)],
    //                     NetworkType.MIJIN_TEST,
    //                     []);
    //                 validateTransactionAnnounceCorrectly(account.address, done);
    //                 transactionHttp.announce(aggregateSecretLockTransaction.signWith(account));
    //             });
    //         });
    //         describe('HashType: Op_Hash_256', () => {
    //             it('standalone', (done) => {
    //                 const secretLockTransaction = SecretLockTransaction.create(
    //                     Deadline.create(),
    //                     NetworkCurrencyMosaic.createAbsolute(10),
    //                     UInt64.fromUint(100),
    //                     HashType.Op_Hash_256,
    //                     sha3_256.create().update(nacl_catapult.randomBytes(20)).hex(),
    //                     Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL'),
    //                     NetworkType.MIJIN_TEST,
    //                 );
    //                 validateTransactionAnnounceCorrectly(account.address, done);
    //                 transactionHttp.announce(secretLockTransaction.signWith(account));
    //             });

    //             it('aggregate', (done) => {
    //                 const secretLockTransaction = SecretLockTransaction.create(
    //                     Deadline.create(),
    //                     NetworkCurrencyMosaic.createAbsolute(10),
    //                     UInt64.fromUint(100),
    //                     HashType.Op_Hash_256,
    //                     sha3_256.create().update(nacl_catapult.randomBytes(20)).hex(),
    //                     Address.createFromRawAddress('SDBDG4IT43MPCW2W4CBBCSJJT42AYALQN7A4VVWL'),
    //                     NetworkType.MIJIN_TEST,
    //                 );
    //                 const aggregateSecretLockTransaction = AggregateTransaction.createComplete(Deadline.create(),
    //                     [secretLockTransaction.toAggregate(account.publicAccount)],
    //                     NetworkType.MIJIN_TEST,
    //                     []);
    //                 validateTransactionAnnounceCorrectly(account.address, done);
    //                 transactionHttp.announce(aggregateSecretLockTransaction.signWith(account));
    //             });
    //         });
    //     });
    //     describe('SecretProofTransaction', () => {
    //         describe('HashType: Op_Sha3_256', () => {
    //             it('standalone', (done) => {
    //                 const secretSeed = nacl_catapult.randomBytes(20);
    //                 const secret = sha3_256.create().update(secretSeed).hex();
    //                 const proof = convert.uint8ToHex(secretSeed);
    //                 const secretLockTransaction = SecretLockTransaction.create(
    //                     Deadline.create(),
    //                     NetworkCurrencyMosaic.createAbsolute(10),
    //                     UInt64.fromUint(100),
    //                     HashType.Op_Sha3_256,
    //                     secret,
    //                     account2.address,
    //                     NetworkType.MIJIN_TEST,
    //                 );
    //                 validateTransactionAnnounceCorrectly(account.address, () => {
    //                     const secretProofTransaction = SecretProofTransaction.create(
    //                         Deadline.create(),
    //                         HashType.Op_Sha3_256,
    //                         secret,
    //                         proof,
    //                         NetworkType.MIJIN_TEST,
    //                     );
    //                     validateTransactionAnnounceCorrectly(account2.address, done);
    //                     transactionHttp.announce(secretProofTransaction.signWith(account2));
    //                 });
    //                 transactionHttp.announce(secretLockTransaction.signWith(account));
    //             });

    //             it('aggregate', (done) => {
    //                 const secretSeed = nacl_catapult.randomBytes(20);
    //                 const secret = sha3_256.create().update(secretSeed).hex();
    //                 const proof = convert.uint8ToHex(secretSeed);
    //                 const secretLockTransaction = SecretLockTransaction.create(
    //                     Deadline.create(),
    //                     NetworkCurrencyMosaic.createAbsolute(10),
    //                     UInt64.fromUint(100),
    //                     HashType.Op_Sha3_256,
    //                     secret,
    //                     account2.address,
    //                     NetworkType.MIJIN_TEST,
    //                 );
    //                 validateTransactionAnnounceCorrectly(account.address, () => {
    //                     const secretProofTransaction = SecretProofTransaction.create(
    //                         Deadline.create(),
    //                         HashType.Op_Sha3_256,
    //                         secret,
    //                         proof,
    //                         NetworkType.MIJIN_TEST,
    //                     );
    //                     const aggregateSecretProofTransaction = AggregateTransaction.createComplete(Deadline.create(),
    //                         [secretProofTransaction.toAggregate(account2.publicAccount)],
    //                         NetworkType.MIJIN_TEST,
    //                         []);
    //                     validateTransactionAnnounceCorrectly(account2.address, done);
    //                     transactionHttp.announce(aggregateSecretProofTransaction.signWith(account2));
    //                 });
    //                 transactionHttp.announce(secretLockTransaction.signWith(account));
    //             });
    //         });
    //     });
    //     describe('HashType: Op_Keccak_256', () => {
    //         it('standalone', (done) => {
    //             const secretSeed = nacl_catapult.randomBytes(20);
    //             const secret = keccak_256.create().update(secretSeed).hex();
    //             const proof = convert.uint8ToHex(secretSeed);
    //             const secretLockTransaction = SecretLockTransaction.create(
    //                 Deadline.create(),
    //                 NetworkCurrencyMosaic.createAbsolute(10),
    //                 UInt64.fromUint(100),
    //                 HashType.Op_Keccak_256,
    //                 secret,
    //                 account2.address,
    //                 NetworkType.MIJIN_TEST,
    //             );
    //             validateTransactionAnnounceCorrectly(account.address, () => {
    //                 const secretProofTransaction = SecretProofTransaction.create(
    //                     Deadline.create(),
    //                     HashType.Op_Keccak_256,
    //                     secret,
    //                     proof,
    //                     NetworkType.MIJIN_TEST,
    //                 );
    //                 validateTransactionAnnounceCorrectly(account2.address, done);
    //                 transactionHttp.announce(secretProofTransaction.signWith(account2));
    //             });
    //             transactionHttp.announce(secretLockTransaction.signWith(account));
    //         });

    //         it('aggregate', (done) => {
    //             const secretSeed = nacl_catapult.randomBytes(20);
    //             const secret = keccak_256.create().update(secretSeed).hex();
    //             const proof = convert.uint8ToHex(secretSeed);
    //             const secretLockTransaction = SecretLockTransaction.create(
    //                 Deadline.create(),
    //                 NetworkCurrencyMosaic.createAbsolute(10),
    //                 UInt64.fromUint(100),
    //                 HashType.Op_Keccak_256,
    //                 secret,
    //                 account2.address,
    //                 NetworkType.MIJIN_TEST,
    //             );
    //             validateTransactionAnnounceCorrectly(account.address, () => {
    //                 const secretProofTransaction = SecretProofTransaction.create(
    //                     Deadline.create(),
    //                     HashType.Op_Keccak_256,
    //                     secret,
    //                     proof,
    //                     NetworkType.MIJIN_TEST,
    //                 );
    //                 const aggregateSecretProofTransaction = AggregateTransaction.createComplete(Deadline.create(),
    //                     [secretProofTransaction.toAggregate(account2.publicAccount)],
    //                     NetworkType.MIJIN_TEST,
    //                     []);
    //                 validateTransactionAnnounceCorrectly(account2.address, done);
    //                 transactionHttp.announce(aggregateSecretProofTransaction.signWith(account2));
    //             });
    //             transactionHttp.announce(secretLockTransaction.signWith(account));
    //         });
    //     });
    //     describe('HashType: Op_Hash_160', () => {
    //         it('standalone', (done) => {
    //             const secretSeed = String.fromCharCode.apply(null, nacl_catapult.randomBytes(20));
    //             const secret = CryptoJS.RIPEMD160(CryptoJS.SHA256(secretSeed).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex);
    //             const proof = convert.uint8ToHex(secretSeed);
    //             const secretLockTransaction = SecretLockTransaction.create(
    //                 Deadline.create(),
    //                 NetworkCurrencyMosaic.createAbsolute(10),
    //                 UInt64.fromUint(100),
    //                 HashType.Op_Hash_160,
    //                 secret,
    //                 account2.address,
    //                 NetworkType.MIJIN_TEST,
    //             );
    //             validateTransactionAnnounceCorrectly(account.address, () => {
    //                 const secretProofTransaction = SecretProofTransaction.create(
    //                     Deadline.create(),
    //                     HashType.Op_Hash_160,
    //                     secret,
    //                     proof,
    //                     NetworkType.MIJIN_TEST,
    //                 );
    //                 validateTransactionAnnounceCorrectly(account2.address, done);
    //                 transactionHttp.announce(secretProofTransaction.signWith(account2));
    //             });
    //             transactionHttp.announce(secretLockTransaction.signWith(account));
    //         });

    //         it('aggregate', (done) => {
    //             const secretSeed = String.fromCharCode.apply(null, nacl_catapult.randomBytes(20));
    //             const secret = CryptoJS.RIPEMD160(CryptoJS.SHA256(secretSeed).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex);
    //             const proof = convert.uint8ToHex(secretSeed);
    //             const secretLockTransaction = SecretLockTransaction.create(
    //                 Deadline.create(),
    //                 NetworkCurrencyMosaic.createAbsolute(10),
    //                 UInt64.fromUint(100),
    //                 HashType.Op_Hash_160,
    //                 secret,
    //                 account2.address,
    //                 NetworkType.MIJIN_TEST,
    //             );
    //             validateTransactionAnnounceCorrectly(account.address, () => {
    //                 const secretProofTransaction = SecretProofTransaction.create(
    //                     Deadline.create(),
    //                     HashType.Op_Hash_160,
    //                     secret,
    //                     proof,
    //                     NetworkType.MIJIN_TEST,
    //                 );
    //                 const aggregateSecretProofTransaction = AggregateTransaction.createComplete(Deadline.create(),
    //                     [secretProofTransaction.toAggregate(account2.publicAccount)],
    //                     NetworkType.MIJIN_TEST,
    //                     []);
    //                 validateTransactionAnnounceCorrectly(account2.address, done);
    //                 transactionHttp.announce(aggregateSecretProofTransaction.signWith(account2));
    //             });
    //             transactionHttp.announce(secretLockTransaction.signWith(account));
    //         });
    //     });
    //     describe('HashType: Op_Hash_256', () => {
    //         it('standalone', (done) => {
    //             const secretSeed = String.fromCharCode.apply(null, nacl_catapult.randomBytes(20));
    //             const secret = CryptoJS.SHA256(CryptoJS.SHA256(secretSeed).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex);
    //             const proof = convert.uint8ToHex(secretSeed);
    //             const secretLockTransaction = SecretLockTransaction.create(
    //                 Deadline.create(),
    //                 NetworkCurrencyMosaic.createAbsolute(10),
    //                 UInt64.fromUint(100),
    //                 HashType.Op_Hash_256,
    //                 secret,
    //                 account2.address,
    //                 NetworkType.MIJIN_TEST,
    //             );
    //             validateTransactionAnnounceCorrectly(account.address, () => {
    //                 const secretProofTransaction = SecretProofTransaction.create(
    //                     Deadline.create(),
    //                     HashType.Op_Hash_256,
    //                     secret,
    //                     proof,
    //                     NetworkType.MIJIN_TEST,
    //                 );
    //                 validateTransactionAnnounceCorrectly(account2.address, done);
    //                 transactionHttp.announce(secretProofTransaction.signWith(account2));
    //             });
    //             transactionHttp.announce(secretLockTransaction.signWith(account));
    //         });

    //         it('aggregate', (done) => {
    //             const secretSeed = String.fromCharCode.apply(null, nacl_catapult.randomBytes(20));
    //             const secret = CryptoJS.SHA256(CryptoJS.SHA256(secretSeed).toString(CryptoJS.enc.Hex)).toString(CryptoJS.enc.Hex);
    //             const proof = convert.uint8ToHex(secretSeed);
    //             const secretLockTransaction = SecretLockTransaction.create(
    //                 Deadline.create(),
    //                 NetworkCurrencyMosaic.createAbsolute(10),
    //                 UInt64.fromUint(100),
    //                 HashType.Op_Hash_256,
    //                 secret,
    //                 account2.address,
    //                 NetworkType.MIJIN_TEST,
    //             );
    //             validateTransactionAnnounceCorrectly(account.address, () => {
    //                 const secretProofTransaction = SecretProofTransaction.create(
    //                     Deadline.create(),
    //                     HashType.Op_Hash_256,
    //                     secret,
    //                     proof,
    //                     NetworkType.MIJIN_TEST,
    //                 );
    //                 const aggregateSecretProofTransaction = AggregateTransaction.createComplete(Deadline.create(),
    //                     [secretProofTransaction.toAggregate(account2.publicAccount)],
    //                     NetworkType.MIJIN_TEST,
    //                     []);
    //                 validateTransactionAnnounceCorrectly(account2.address, done);
    //                 transactionHttp.announce(aggregateSecretProofTransaction.signWith(account2));
    //             });
    //             transactionHttp.announce(secretLockTransaction.signWith(account));
    //         });
    //     });
    // });

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
            const signedTransaction = transferTransaction.signWith(account);
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
            const signedTransaction = aggregateTransaction.signWith(
                cosignAccount1,
            );
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
});
