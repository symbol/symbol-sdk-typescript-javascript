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

import { expect } from 'chai';
import { ChronoUnit } from 'js-joda';
import {of as observableOf} from 'rxjs';
import {deepEqual, instance, mock, when} from 'ts-mockito';
import { AccountHttp } from '../../src/infrastructure/AccountHttp';
import { Account } from '../../src/model/account/Account';
import { Address } from '../../src/model/account/Address';
import { MultisigAccountGraphInfo } from '../../src/model/account/MultisigAccountGraphInfo';
import { MultisigAccountInfo } from '../../src/model/account/MultisigAccountInfo';
import {NetworkType} from '../../src/model/blockchain/NetworkType';
import { AggregateTransaction } from '../../src/model/transaction/AggregateTransaction';
import { Deadline } from '../../src/model/transaction/Deadline';
import { PlainMessage } from '../../src/model/transaction/PlainMessage';
import { TransferTransaction } from '../../src/model/transaction/TransferTransaction';
import { AggregatedTransactionService } from '../../src/service/AggregatedTransactionService';

/**
 * For multi level multisig scenario visit: https://github.com/nemtech/nem2-docs/issues/10
 */
describe('AggregatedTransactionService', () => {
    let aggregatedTransactionService: AggregatedTransactionService;

    /**
     *  Multisig2 Account:	SBROWP-7YMG2M-K45RO6-Q7ZPK7-G7GXWQ-JK5VNQ-OSUX
     *  Public Key:	    5E628EA59818D97AA4118780D9A88C5512FCE7A21C195E1574727EFCE5DF7C0D
     *  Private Key:	22A1D67F8519D1A45BD7116600BB6E857786E816FE0B45E4C5B9FFF3D64BC177
     *
     *
     * Multisig1 Account:	SAK32M-5JQ43R-WYHWEH-WRBCW4-RXERT2-DLASGL-EANS
     * Public Key:	BFDF2610C5666A626434FE12FB4A9D896D2B9B033F5F84CCEABE82E043A6307E
     * Private Key:	8B0622C2CCFC5CCC5A74B500163E3C68F3AD3643DB12932FC931143EAC67280D
     */

     /**
      * Test accounts:
      * Multisig1 (1/1): Account2, Account3
      * Multisig2 (2/1): Account1, Multisig1
      * Stranger Account: Account4
      */

    const account1 = Account.createFromPrivateKey('82DB2528834C9926F0FCCE042466B24A266F5B685CB66D2869AF6648C043E950',
                        NetworkType.MIJIN_TEST);
    const multisig1 = Account.createFromPrivateKey('8B0622C2CCFC5CCC5A74B500163E3C68F3AD3643DB12932FC931143EAC67280D',
                        NetworkType.MIJIN_TEST);
    const multisig2 = Account.createFromPrivateKey('22A1D67F8519D1A45BD7116600BB6E857786E816FE0B45E4C5B9FFF3D64BC177',
                        NetworkType.MIJIN_TEST);

    const account2 = Account.createFromPrivateKey('A4D410270E01CECDCDEADCDE32EC79C8D9CDEA4DCD426CB1EB666EFEF148FBCE',
                        NetworkType.MIJIN_TEST);
    const account3 = Account.createFromPrivateKey('336AB45EE65A6AFFC0E7ADC5342F91E34BACA0B901A1D9C876FA25A1E590077E',
                        NetworkType.MIJIN_TEST);

    const account4 = Account.createFromPrivateKey('4D8B3756592532753344E11E2B7541317BCCFBBCF4444274CDBF359D2C4AE0F1',
                        NetworkType.MIJIN_TEST);
    before(() => {
        const mockedAccountHttp = mock(AccountHttp);

        when(mockedAccountHttp.getMultisigAccountInfo(deepEqual(account1.address)))
            .thenReturn(observableOf(givenAccount1Info()));
        when(mockedAccountHttp.getMultisigAccountInfo(deepEqual(account4.address)))
            .thenReturn(observableOf(givenAccount4Info()));
        when(mockedAccountHttp.getMultisigAccountInfo(deepEqual(multisig2.address)))
            .thenReturn(observableOf(givenMultisig2AccountInfo()));
        when(mockedAccountHttp.getMultisigAccountGraphInfo(deepEqual(multisig2.address)))
            .thenReturn(observableOf(givenMultisig2AccountGraphInfo()));

        const accountHttp = instance(mockedAccountHttp);
        aggregatedTransactionService = new AggregatedTransactionService(accountHttp);
    });

    it('should return isComplete: true for aggregated complete transaction - 2 levels Multisig', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(1, ChronoUnit.HOURS),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [transferTransaction.toAggregate(multisig2.publicAccount)],
            NetworkType.MIJIN_TEST,
            []);

        const signedTransaction = aggregateTransaction.signTransactionWithCosignatories(account1, [account2]);
        aggregatedTransactionService.isComplete(signedTransaction).toPromise().then((isComplete) => {
            expect(isComplete).to.be.true;
        });
    });

    it('should return  isComplete: false for aggregated complete transaction - 2 levels Multisig', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(1, ChronoUnit.HOURS),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [transferTransaction.toAggregate(multisig2.publicAccount)],
            NetworkType.MIJIN_TEST,
            []);

        const signedTransaction = aggregateTransaction.signTransactionWithCosignatories(account1, []);
        aggregatedTransactionService.isComplete(signedTransaction).toPromise().then((isComplete) => {
            expect(isComplete).to.be.false;
        });
    });

    it('should return  isComplete: false for aggregated complete transaction - 2 levels Multisig', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(1, ChronoUnit.HOURS),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [transferTransaction.toAggregate(multisig2.publicAccount)],
            NetworkType.MIJIN_TEST,
            []);

        const signedTransaction = aggregateTransaction.signTransactionWithCosignatories(account1, [account4]);
        aggregatedTransactionService.isComplete(signedTransaction).toPromise().then((isComplete) => {
            expect(isComplete).to.be.false;
        });
    });

    it('should return correct isComplete status for aggregated complete transaction - 2 levels Multisig, multi inner transaction', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(1, ChronoUnit.HOURS),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        const transferTransaction2 = TransferTransaction.create(
            Deadline.create(1, ChronoUnit.HOURS),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [transferTransaction.toAggregate(multisig2.publicAccount),
             transferTransaction.toAggregate(account4.publicAccount)],
            NetworkType.MIJIN_TEST,
            []);

        const signedTransaction = aggregateTransaction.signTransactionWithCosignatories(account1, [account2]);
        aggregatedTransactionService.isComplete(signedTransaction).toPromise().then((isComplete) => {
            expect(isComplete).to.be.true;
        });
    });

    it('should return correct isComplete status for aggregated complete transaction - none multisig', () => {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(1, ChronoUnit.HOURS),
            Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            [],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [transferTransaction.toAggregate(account4.publicAccount)],
            NetworkType.MIJIN_TEST,
            []);

        const signedTransaction = aggregateTransaction.signWith(account1);
        aggregatedTransactionService.isComplete(signedTransaction).toPromise().then((isComplete) => {
            expect(isComplete).to.be.true;
        });
    });

    function givenMultisig2AccountInfo(): MultisigAccountInfo {
        return new MultisigAccountInfo(multisig2.publicAccount,
                2, 1,
                [multisig1.publicAccount,
                 account1.publicAccount],
                [],
        );
    }

    function givenAccount1Info(): MultisigAccountInfo {
        return new MultisigAccountInfo(account1.publicAccount,
                0, 0,
                [],
                [multisig2.publicAccount],
        );
    }
    function givenAccount4Info(): MultisigAccountInfo {
        return new MultisigAccountInfo(account4.publicAccount,
                0, 0,
                [],
                [],
        );
    }

    function givenMultisig2AccountGraphInfo(): MultisigAccountGraphInfo {
        const map = new Map<number, MultisigAccountInfo[]>();
        map.set(0, [new MultisigAccountInfo(multisig2.publicAccount,
                            2, 1,
                            [multisig1.publicAccount,
                            account1.publicAccount],
                            [],
                    )])
           .set(1, [new MultisigAccountInfo(multisig1.publicAccount,
                            1, 1,
                            [account2.publicAccount, account3.publicAccount],
                            [multisig2.publicAccount],
                    )]);

        return new MultisigAccountGraphInfo(map);
    }

});
