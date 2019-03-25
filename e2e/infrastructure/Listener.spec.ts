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
import { AccountHttp } from '../../src/infrastructure/AccountHttp';
import { Listener } from '../../src/infrastructure/Listener';
import { Address } from '../../src/model/account/Address';
import * as conf from '../conf/conf.spec';
import {
    APIUrl, Cosignatory2Account, Cosignatory3Account, CosignatoryAccount, MultisigAccount,
    TestingAccount,
} from '../conf/conf.spec';
import { TransactionUtils } from './TransactionUtils';

describe('Listener', () => {
    let account;
    let multisigAccount;
    let listener: Listener;

    before(() => {
        account = TestingAccount;
        multisigAccount = MultisigAccount;
        listener = new Listener(APIUrl);
        return listener.open();
    });

    after(() => {
        listener.close();
    });

    it('newBlock', (done) => {
        listener.newBlock()
            .toPromise()
            .then((res) => {
                done();
            });

        TransactionUtils.createAndAnnounce();
    });

    it('confirmedTransactionsGiven address signer', (done) => {
        listener.confirmed(account.address)
            .toPromise()
            .then((res) => {
                done();
            });

        TransactionUtils.createAndAnnounce();
    });

    it('confirmedTransactionsGiven address recipient', (done) => {
        const recipientAddress = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        listener.confirmed(recipientAddress)
            .toPromise()
            .then((res) => {
                done();
            });

        TransactionUtils.createAndAnnounce();
    });

    it('unconfirmedTransactionsAdded', (done) => {
        listener.unconfirmedAdded(account.address)
            .toPromise()
            .then((res) => {
                done();
            });

        setTimeout(() => {
            TransactionUtils.createAndAnnounce();
        }, 1000);
    });

    it('unconfirmedTransactionsRemoved', (done) => {
        listener.unconfirmedRemoved(account.address)
            .toPromise()
            .then((res) => {
                done();
            });

        setTimeout(() => {
            TransactionUtils.createAndAnnounce();
        }, 1000);
    });

    it('aggregateBondedTransactionsAdded', (done) => {
        listener.aggregateBondedAdded(multisigAccount.address)
            .toPromise()
            .then((res) => {
                done();
            });

        setTimeout(() => {
            TransactionUtils.createAggregateBoundedTransactionAndAnnounce();
        }, 1000);
    });

    it('aggregateBondedTransactionsRemoved', (done) => {
        listener.aggregateBondedRemoved(multisigAccount.address)
            .toPromise()
            .then((res) => {
                done();
            });

        setTimeout(() => {
            TransactionUtils.createAggregateBoundedTransactionAndAnnounce();
            setTimeout(() => {
                new AccountHttp(conf.APIUrl).aggregateBondedTransactions(CosignatoryAccount.publicAccount).subscribe((transactions) => {
                    const transactionToCosign = transactions[0];
                    TransactionUtils.cosignTransaction(transactionToCosign, Cosignatory2Account);
                    TransactionUtils.cosignTransaction(transactionToCosign, Cosignatory3Account);
                });
            }, 2000);
        }, 1000);
    });

    it('cosignatureAdded', (done) => {
        listener.cosignatureAdded(multisigAccount.address)
            .toPromise()
            .then((res) => {
                done();
            });

        setTimeout(() => {
            TransactionUtils.createAggregateBoundedTransactionAndAnnounce();
            setTimeout(() => {
                new AccountHttp(conf.APIUrl).aggregateBondedTransactions(CosignatoryAccount.publicAccount).subscribe((transactions) => {
                    const transactionToCosign = transactions[0];
                    TransactionUtils.cosignTransaction(transactionToCosign, Cosignatory2Account);
                });
            }, 1000);
        }, 1000);
    });

    it('transactionStatusGiven', (done) => {
        listener.status(account.address)
            .toPromise()
            .then((res) => {
                done();
            });

        setTimeout(() => {
            TransactionUtils.createAndAnnounceWithInsufficientBalance();
        }, 1000);
    });

    it('multisigAccountAdded', (done) => {
        listener.multisigAccountAdded(account.address)
            .toPromise()
            .then((res) => {
                done();
            });

        setTimeout(() => {
            TransactionUtils.createModifyMultisigAccountTransaction(account);
        }, 1000);
    });
});
