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
import {AccountHttp} from '../../src/infrastructure/AccountHttp';
import {QueryParams} from '../../src/infrastructure/QueryParams';
import {Address} from '../../src/model/account/Address';
import {PublicAccount} from '../../src/model/account/PublicAccount';
import {NetworkType} from '../../src/model/blockchain/NetworkType';

import {APIUrl} from '../conf/conf.spec';

describe('AccountHttp', () => {
    const accountAddress = Address.createFromRawAddress('SDRDGFTDLLCB67D4HPGIMIHPNSRYRJRT7DOBGWZY');
    const accountPublicKey = '1026D70E1954775749C6811084D6450A3184D977383F0E4282CD47118AF37755';
    const publicAccount = PublicAccount.createFromPublicKey('846B4439154579A5903B1459C9CF69CB8153F6D0110A7A0ED61DE29AE4810BF2',
        NetworkType.MIJIN_TEST);
    const multisigPublicAccount = PublicAccount.createFromPublicKey('B694186EE4AB0558CA4AFCFDD43B42114AE71094F5A1FC4A913FE9971CACD21D',
        NetworkType.MIJIN_TEST);

    const accountHttp = new AccountHttp(APIUrl);

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
                expect(transactions.length).to.be.equal(10);
                done();
            });
        });
        it('should call outgoingTransactions successfully pageSize 11', (done) => {
            accountHttp.outgoingTransactions(publicAccount, new QueryParams(22)).subscribe((transactions) => {
                expect(transactions.length).to.be.equal(22);
                nextId = transactions[10].transactionInfo!.id;
                lastId = transactions[11].transactionInfo!.id;
                done();
            });
        });

        it('should call outgoingTransactions successfully pageSize 11 and next id', (done) => {
            accountHttp.outgoingTransactions(publicAccount, new QueryParams(11, nextId)).subscribe((transactions) => {
                expect(transactions.length).to.be.equal(11);
                expect(transactions[0].transactionInfo!.id).to.be.equal(lastId);
                done();
            });
        });
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
