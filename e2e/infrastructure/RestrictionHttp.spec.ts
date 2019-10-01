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

import {deepEqual} from 'assert';
import {assert} from 'chai';
import {AccountHttp} from '../../src/infrastructure/AccountHttp';
import { Listener, TransactionHttp } from '../../src/infrastructure/infrastructure';
import { RestrictionHttp } from '../../src/infrastructure/RestrictionHttp';
import { Account } from '../../src/model/account/Account';
import {Address} from '../../src/model/account/Address';
import {PublicAccount} from '../../src/model/account/PublicAccount';
import {NetworkType} from '../../src/model/blockchain/NetworkType';
import { MosaicFlags } from '../../src/model/mosaic/MosaicFlags';
import { MosaicId } from '../../src/model/mosaic/MosaicId';
import { MosaicNonce } from '../../src/model/mosaic/MosaicNonce';
import { AccountRestrictionModificationAction } from '../../src/model/restriction/AccountRestrictionModificationAction';
import { AccountRestrictionType } from '../../src/model/restriction/AccountRestrictionType';
import { MosaicRestrictionEntryType } from '../../src/model/restriction/MosaicRestrictionEntryType';
import { MosaicRestrictionType } from '../../src/model/restriction/MosaicRestrictionType';
import { AccountRestrictionModification } from '../../src/model/transaction/AccountRestrictionModification';
import { AccountRestrictionTransaction } from '../../src/model/transaction/AccountRestrictionTransaction';
import { AggregateTransaction } from '../../src/model/transaction/AggregateTransaction';
import { Deadline } from '../../src/model/transaction/Deadline';
import { MosaicAddressRestrictionTransaction } from '../../src/model/transaction/MosaicAddressRestrictionTransaction';
import { MosaicDefinitionTransaction } from '../../src/model/transaction/MosaicDefinitionTransaction';
import { MosaicGlobalRestrictionTransaction } from '../../src/model/transaction/MosaicGlobalRestrictionTransaction';
import { Transaction } from '../../src/model/transaction/Transaction';
import { UInt64 } from '../../src/model/UInt64';

describe('RestrictionHttp', () => {
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
    let accountHttp: AccountHttp;
    let restrictionHttp: RestrictionHttp;
    let transactionHttp: TransactionHttp;
    let mosaicId: MosaicId;
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
            accountHttp = new AccountHttp(json.apiUrl);
            transactionHttp = new TransactionHttp(json.apiUrl);
            restrictionHttp = new RestrictionHttp(json.apiUrl);
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

    describe('Setup Test AccountAddressRestriction', () => {
        let listener: Listener;
        before (() => {
            listener = new Listener(config.apiUrl);
            return listener.open();
        });
        after(() => {
            return listener.close();
        });

        it('Announce AccountRestrictionTransaction', (done) => {
            const addressPropertyFilter = AccountRestrictionModification.createForAddress(
                AccountRestrictionModificationAction.Add,
                account3.address,
            );
            const addressModification = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
                Deadline.create(),
                AccountRestrictionType.AllowIncomingAddress,
                [addressPropertyFilter],
                NetworkType.MIJIN_TEST,
            );
            const signedTransaction = addressModification.signWith(account, generationHash);
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
                UInt64.fromUint(60641),
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
                UInt64.fromUint(60641),
                account3.address,
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
     * Tests
     * =========================
     */

    describe('getAccountRestrictions', () => {
        it('should call getAccountRestrictions successfully', (done) => {
            setTimeout(() => {
                restrictionHttp.getAccountRestrictions(accountAddress).subscribe((accountRestrictions) => {
                    deepEqual(accountRestrictions.accountRestrictions.address, accountAddress);
                    done();
                });
            }, 1000);
        });
    });

    describe('getAccountRestrictionsFromAccounts', () => {
        it('should call getAccountRestrictionsFromAccounts successfully', (done) => {
            setTimeout(() => {
                restrictionHttp.getAccountRestrictionsFromAccounts([accountAddress]).subscribe((accountRestrictions) => {
                    deepEqual(accountRestrictions[0]!.accountRestrictions.address, accountAddress);
                    done();
                });
            }, 1000);
        });
    });

    describe('getMosaicAddressRestriction', () => {
        it('should call getMosaicAddressRestriction successfully', (done) => {
            setTimeout(() => {
                restrictionHttp.getMosaicAddressRestriction(mosaicId, accountAddress).subscribe((mosaicRestriction) => {
                    deepEqual(mosaicRestriction.mosaicId.toHex(), mosaicId.toHex());
                    deepEqual(mosaicRestriction.entryType, MosaicRestrictionEntryType.ADDRESS);
                    deepEqual(mosaicRestriction.targetAddress.plain(), accountAddress.plain());
                    deepEqual(mosaicRestriction.restrictions[0].get(UInt64.fromUint(60641).toHex()), UInt64.fromUint(2).toString());
                    done();
                });
            }, 1000);
        });
    });

    describe('getMosaicAddressRestrictions', () => {
        it('should call getMosaicAddressRestrictions successfully', (done) => {
            setTimeout(() => {
                restrictionHttp.getMosaicAddressRestrictions(mosaicId, [accountAddress]).subscribe((mosaicRestriction) => {
                    deepEqual(mosaicRestriction[0].mosaicId.toHex(), mosaicId.toHex());
                    deepEqual(mosaicRestriction[0].entryType, MosaicRestrictionEntryType.ADDRESS);
                    deepEqual(mosaicRestriction[0].targetAddress.plain(), accountAddress.plain());
                    deepEqual(mosaicRestriction[0].restrictions[0].get(UInt64.fromUint(60641).toHex()), UInt64.fromUint(2).toString());
                    done();
                });
            }, 1000);
        });
    });

    describe('getMosaicGlobalRestriction', () => {
        it('should call getMosaicGlobalRestriction successfully', (done) => {
            setTimeout(() => {
                restrictionHttp.getMosaicGlobalRestriction(mosaicId).subscribe((mosaicRestriction) => {
                    deepEqual(mosaicRestriction.mosaicId.toHex(), mosaicId.toHex());
                    deepEqual(mosaicRestriction.entryType, MosaicRestrictionEntryType.GLOBAL);
                    deepEqual(mosaicRestriction.restrictions[0].get(UInt64.fromUint(60641).toHex()), UInt64.fromUint(2).toString());
                    done();
                });
            }, 1000);
        });
    });

    describe('getMosaicGlobalRestrictions', () => {
        it('should call getMosaicGlobalRestrictions successfully', (done) => {
            setTimeout(() => {
                restrictionHttp.getMosaicGlobalRestrictions([mosaicId]).subscribe((mosaicRestriction) => {
                    deepEqual(mosaicRestriction[0].mosaicId.toHex(), mosaicId.toHex());
                    deepEqual(mosaicRestriction[0].entryType, MosaicRestrictionEntryType.GLOBAL);
                    deepEqual(mosaicRestriction[0].restrictions[0].get(UInt64.fromUint(60641).toHex()), UInt64.fromUint(2).toString());
                    done();
                });
            }, 1000);
        });
    });
});
