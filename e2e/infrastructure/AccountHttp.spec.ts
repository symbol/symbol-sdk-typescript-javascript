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
import {expect} from 'chai';
import {AccountHttp} from '../../src/infrastructure/AccountHttp';
import {QueryParams} from '../../src/infrastructure/QueryParams';
import {Address} from '../../src/model/account/Address';
import {PublicAccount} from '../../src/model/account/PublicAccount';
import {NetworkType} from '../../src/model/blockchain/NetworkType';

describe('AccountHttp', () => {
    let accountAddress: Address;
    let accountPublicKey: string;
    let publicAccount: PublicAccount;
    let multisigPublicAccount: PublicAccount;
    let accountHttp: AccountHttp;

    before((done) => {
        const path = require('path');
        require('fs').readFile(path.resolve(__dirname, '../conf/network.conf'), (err, data) => {
            if (err) {
                throw err;
            }
            const json = JSON.parse(data);

            accountAddress = Address.createFromRawAddress(json.testAccount.address);
            accountPublicKey = json.testAccount.publicKey;
            publicAccount = PublicAccount.createFromPublicKey(json.testAccount.publicKey, NetworkType.MIJIN_TEST);
            multisigPublicAccount = PublicAccount.createFromPublicKey(json.multisigAccount.publicKey, NetworkType.MIJIN_TEST);

            accountHttp = new AccountHttp(json.apiUrl);
            done();
        });
    });

    describe('getAccountInfo', () => {
        it('should return account data given a NEM Address', (done) => {
            accountHttp.getAccountInfo(accountAddress)
                .subscribe((accountInfo) => {
                    expect(accountInfo.publicKey).to.be.equal(accountPublicKey);
                    done();
                });
        });
    });

    describe('getAccountsInfo', () => {
        it('should return account data given a NEM Address', (done) => {
            accountHttp.getAccountsInfo([accountAddress])
                .subscribe((accountsInfo) => {
                    expect(accountsInfo[0].publicKey).to.be.equal(accountPublicKey);
                    done();
                });
        });
    });

    describe('getMultisigAccountInfo', () => {
        it('should call getMultisigAccountInfo successfully', (done) => {
            accountHttp.getMultisigAccountInfo(multisigPublicAccount.address).subscribe((multisigAccountInfo) => {
                expect(multisigAccountInfo.account.publicKey).to.be.equal(multisigPublicAccount.publicKey);
                done();
            });
        });
    });

    describe('getAccountProperty', () => {
        it('should call getAccountProperty successfully', (done) => {
            accountHttp.getAccountProperty(accountAddress).subscribe((accountProperty) => {
                deepEqual(accountProperty.accountProperties.address, accountAddress);
                done();
            });
        });
    });

    describe('getAccountProperties', () => {
        it('should call getAccountProperties successfully', (done) => {
            accountHttp.getAccountProperties([accountAddress]).subscribe((accountProperties) => {
                deepEqual(accountProperties[0]!.accountProperties.address, accountAddress);
                done();
            });
        });
    });
    describe('getMultisigAccountGraphInfo', () => {
        it('should call getMultisigAccountGraphInfo successfully', (done) => {
            accountHttp.getMultisigAccountGraphInfo(multisigPublicAccount.address).subscribe((multisigAccountGraphInfo) => {
                expect(multisigAccountGraphInfo.multisigAccounts.get(0)![0].account.publicKey).to.be.equal(multisigPublicAccount.publicKey);
                done();
            });
        });
    });

    describe('incomingTransactions', () => {
        it('should call incomingTransactions successfully', (done) => {
            accountHttp.incomingTransactions(publicAccount).subscribe((transactions) => {
                expect(transactions.length).to.be.greaterThan(0);
                done();
            });
        });
    });

    describe('outgoingTransactions', () => {
        let nextId: string;
        let lastId: string;

        it('should call outgoingTransactions successfully', (done) => {
            accountHttp.outgoingTransactions(publicAccount).subscribe((transactions) => {
                expect(transactions.length).to.be.greaterThan(0);
                done();
            });
        });
        // it('should call outgoingTransactions successfully pageSize 11', (done) => {
        //     accountHttp.outgoingTransactions(publicAccount, new QueryParams(22)).subscribe((transactions) => {
        //         expect(transactions.length).to.be.equal(2);
        //         nextId = transactions[10].transactionInfo!.id;
        //         lastId = transactions[11].transactionInfo!.id;
        //         done();
        //     });
        // });

        // it('should call outgoingTransactions successfully pageSize 11 and next id', (done) => {
        //     accountHttp.outgoingTransactions(publicAccount, new QueryParams(11, nextId)).subscribe((transactions) => {
        //         expect(transactions.length).to.be.equal(2);
        //         expect(transactions[0].transactionInfo!.id).to.be.equal(lastId);
        //         done();
        //     });
        // });
    });

    describe('aggregateBondedTransactions', () => {
        it('should call aggregateBondedTransactions successfully', (done) => {
            accountHttp.aggregateBondedTransactions(publicAccount).subscribe((transactions) => {
                expect(transactions.length).to.be.equal(0);
                done();
            });
        });
    });

    describe('transactions', () => {
        it('should call transactions successfully', (done) => {
            accountHttp.transactions(publicAccount).subscribe((transactions) => {
                expect(transactions.length).to.be.greaterThan(0);
                done();
            });
        });
    });

    describe('unconfirmedTransactions', () => {
        it('should call unconfirmedTransactions successfully', (done) => {
            accountHttp.unconfirmedTransactions(publicAccount).subscribe((transactions) => {
                expect(transactions.length).to.be.equal(0);
                done();
            });
        });
    });
});
