/*
 * Copyright 2019 NEM
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
import { PlainMessage } from '../../src/model/message/PlainMessage';
import { AggregateTransaction } from '../../src/model/transaction/AggregateTransaction';
import { CosignatoryModificationAction } from '../../src/model/transaction/CosignatoryModificationAction';
import { Deadline } from '../../src/model/transaction/Deadline';
import { MultisigAccountModificationTransaction } from '../../src/model/transaction/MultisigAccountModificationTransaction';
import { MultisigCosignatoryModification } from '../../src/model/transaction/MultisigCosignatoryModification';
import { TransferTransaction } from '../../src/model/transaction/TransferTransaction';
import { AggregateTransactionService } from '../../src/service/AggregateTransactionService';

/**
 * For multi level multisig scenario visit: https://github.com/nemtech/nem2-docs/issues/10
 */
describe('AggregateTransactionService', () => {
    let aggregateTransactionService: AggregateTransactionService;

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
      * Multisig3 (2/2): Account2, Account3
      * Stranger Account: Account4
      */

    const account1 = Account.createFromPrivateKey('82DB2528834C9926F0FCCE042466B24A266F5B685CB66D2869AF6648C043E950',
                        NetworkType.MIJIN_TEST);
    const multisig1 = Account.createFromPrivateKey('8B0622C2CCFC5CCC5A74B500163E3C68F3AD3643DB12932FC931143EAC67280D',
                        NetworkType.MIJIN_TEST);
    const multisig2 = Account.createFromPrivateKey('22A1D67F8519D1A45BD7116600BB6E857786E816FE0B45E4C5B9FFF3D64BC177',
                        NetworkType.MIJIN_TEST);

    const multisig3 = Account.createFromPrivateKey('5E7812AB0E709ABC45466034E1A209099F6A12C4698748A63CDCAA9B0DDE1DBD',
                        NetworkType.MIJIN_TEST);
    const account2 = Account.createFromPrivateKey('A4D410270E01CECDCDEADCDE32EC79C8D9CDEA4DCD426CB1EB666EFEF148FBCE',
                        NetworkType.MIJIN_TEST);
    const account3 = Account.createFromPrivateKey('336AB45EE65A6AFFC0E7ADC5342F91E34BACA0B901A1D9C876FA25A1E590077E',
                        NetworkType.MIJIN_TEST);

    const account4 = Account.createFromPrivateKey('4D8B3756592532753344E11E2B7541317BCCFBBCF4444274CDBF359D2C4AE0F1',
                        NetworkType.MIJIN_TEST);
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';

    before(() => {
        const mockedAccountHttp = mock(AccountHttp);

        when(mockedAccountHttp.getMultisigAccountInfo(deepEqual(account1.address)))
            .thenReturn(observableOf(givenAccount1Info()));
        when(mockedAccountHttp.getMultisigAccountInfo(deepEqual(account4.address)))
            .thenReturn(observableOf(givenAccount4Info()));
        when(mockedAccountHttp.getMultisigAccountInfo(deepEqual(multisig2.address)))
            .thenReturn(observableOf(givenMultisig2AccountInfo()));
        when(mockedAccountHttp.getMultisigAccountInfo(deepEqual(multisig3.address)))
            .thenReturn(observableOf(givenMultisig3AccountInfo()));
        when(mockedAccountHttp.getMultisigAccountGraphInfo(deepEqual(multisig2.address)))
            .thenReturn(observableOf(givenMultisig2AccountGraphInfo()));
        when(mockedAccountHttp.getMultisigAccountGraphInfo(deepEqual(multisig3.address)))
            .thenReturn(observableOf(givenMultisig3AccountGraphInfo()));
        when(mockedAccountHttp.getMultisigAccountInfo(deepEqual(account2.address)))
            .thenReturn(observableOf(givenAccount2Info()));
        when(mockedAccountHttp.getMultisigAccountInfo(deepEqual(account3.address)))
            .thenReturn(observableOf(givenAccount3Info()));

        const accountHttp = instance(mockedAccountHttp);
        aggregateTransactionService = new AggregateTransactionService(accountHttp);
    });

    it('should return isComplete: true for aggregated complete transaction - 2 levels Multisig', () => {
        /**
         * MLMA
         * Alice (account1): normal account
         * Bob (multisig2) - Multisig 2-1 (account1 && multisig1)
         * Charles (multisig1) - Multisig 1-1 (account2 || account3)
         * Given signatories: Account1 && Account4
         * Expecting complete as Bob needs 2 signatures (account1 && (account2 || account3))
         */
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

        const signedTransaction = aggregateTransaction.signTransactionWithCosignatories(account1, [account2], generationHash);
        aggregateTransactionService.isComplete(signedTransaction).toPromise().then((isComplete) => {
            expect(isComplete).to.be.true;
        });
    });

    it('should return  isComplete: false for aggregated complete transaction - 2 levels Multisig', () => {
        /**
         * MLMA
         * Alice (account1): normal account
         * Bob (multisig2) - Multisig 2-1 (account1 && multisig1)
         * Charles (multisig1) - Multisig 1-1 (account2 || account3)
         * Given signatories: Account1 && Account4
         * Expecting incomplete as Bob needs 2 signatures (account1 && (account2 || account3)) but only got account1
         */
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

        const signedTransaction = aggregateTransaction.signTransactionWithCosignatories(account1, [], generationHash);
        aggregateTransactionService.isComplete(signedTransaction).toPromise().then((isComplete) => {
            expect(isComplete).to.be.false;
        });
    });

    it('should return  isComplete: false for aggregated complete transaction - 2 levels Multisig', () => {
        /**
         * MLMA
         * Alice (account1): normal account
         * Bob (multisig2) - Multisig 2-1 (account1 && multisig1)
         * Charles (multisig1) - Multisig 1-1 (account2 || account3)
         * Given signatories: Account1 && Account4
         * Expecting incomplete as Bob needs 2 signatures (account1 && (account2 || account3)) but got account4
         */
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

        const signedTransaction = aggregateTransaction.signTransactionWithCosignatories(account1, [account4], generationHash);
        aggregateTransactionService.isComplete(signedTransaction).toPromise().then((isComplete) => {
            expect(isComplete).to.be.false;
        });
    });

    it('should return correct isComplete status for aggregated complete transaction - 2 levels Multisig, multi inner transaction', () => {
        /**
         * MLMA - with multiple transaction
         * Alice (account1): normal account
         * Bob (multisig2) - Multisig 2-1 (account1 && multisig1)
         * Charles (multisig1) - Multisig 1-1 (account2 || account3)
         * An extra inner transaction to account4 (just to increase the complexity)
         * Given signatories: Account1 && Account4
         * Expecting incomplete as Bob needs 2 signatures (account1 && (account2 || account3))
         */
        const transferTransaction = TransferTransaction.create(
            Deadline.create(1, ChronoUnit.HOURS),
            account2.address,
            [],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        const transferTransaction2 = TransferTransaction.create(
            Deadline.create(1, ChronoUnit.HOURS),
            account2.address,
            [],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [transferTransaction.toAggregate(multisig2.publicAccount),
             transferTransaction2.toAggregate(account4.publicAccount)],
            NetworkType.MIJIN_TEST,
            []);
        const signedTransaction = aggregateTransaction.signTransactionWithCosignatories(account1, [account4], generationHash);
        aggregateTransactionService.isComplete(signedTransaction).toPromise().then((isComplete) => {
            expect(isComplete).to.be.false;
        });
    });

    it('should return correct isComplete status for aggregated complete transaction - 2 levels Multisig, multi inner transaction', () => {
        /**
         * MLMA - with multiple transaction
         * Alice (account1): normal account
         * Bob (multisig2) - Multisig 2-1 (account1 && multisig1)
         * Charles (multisig1) - Multisig 1-1 (account2 || account3)
         * An extra inner transaction to account4 (just to increase the complexity)
         * Given signatories: Account1 && Account4 && Account2
         * Expecting complete
         */
        const transferTransaction = TransferTransaction.create(
            Deadline.create(1, ChronoUnit.HOURS),
            account2.address,
            [],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        const transferTransaction2 = TransferTransaction.create(
            Deadline.create(1, ChronoUnit.HOURS),
            account2.address,
            [],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [transferTransaction.toAggregate(multisig2.publicAccount),
             transferTransaction2.toAggregate(account4.publicAccount)],
            NetworkType.MIJIN_TEST,
            []);
        const signedTransaction = aggregateTransaction.signTransactionWithCosignatories(account1, [account4, account2], generationHash);
        aggregateTransactionService.isComplete(signedTransaction).toPromise().then((isComplete) => {
            expect(isComplete).to.be.true;
        });
    });

    it('should use minRemoval for multisig account validation if inner transaction is modify multisig remove', () => {
        /**
         * If the inner transaction is issued to a multisig account
         * and the inner transaction itself is a ModifyMultiSigAccountTransaction - Removal
         * The validator should use minRemoval value rather than minApproval value
         * to determine if the act is complete or not
         */
        const modifyMultisigTransaction = MultisigAccountModificationTransaction.create(
            Deadline.create(1, ChronoUnit.HOURS),
            1,
            1,
            [],
            [account1.publicAccount],
            NetworkType.MIJIN_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [modifyMultisigTransaction.toAggregate(multisig2.publicAccount)],
            NetworkType.MIJIN_TEST,
            []);
        const signedTransaction = aggregateTransaction.signWith(account2, generationHash);
        aggregateTransactionService.isComplete(signedTransaction).toPromise().then((isComplete) => {
            expect(isComplete).to.be.true;
        });
    });

    it('should return correct isComplete status (false) for aggregated complete transaction - none multisig', () => {
        /**
         * If the inner transaction is issued to a multisig account
         * and the inner transaction itself is a ModifyMultiSigAccountTransaction - Removal
         * The validator should use minRemoval value rather than minApproval value
         * to determine if the act is complete or not
         */
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

        const signedTransaction = aggregateTransaction.signWith(account1, generationHash);
        aggregateTransactionService.isComplete(signedTransaction).toPromise().then((isComplete) => {
            expect(isComplete).to.be.false;
        });
    });

    it('should return correct isComplete status (true) for aggregated complete transaction - none multisig', () => {
        /**
         * ACT
         * Alice (account1): normal account
         * Bob (account4) - normal account
         * Alice initiate the transaction
         * Bob sign
         */
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

        const signedTransaction = aggregateTransaction.signWith(account4, generationHash);
        aggregateTransactionService.isComplete(signedTransaction).toPromise().then((isComplete) => {
            expect(isComplete).to.be.true;
        });
    });

    it('should return correct isComplete status TRUE - multiple normal account', () => {
        /**
         * ACT
         * Alice: account1
         * Bog: account4
         * An escrow contract is signed by all the participants (normal accounts)
         * Given Alice defined the following escrow contract:
         * | sender | recipient | type          | data |
         * | Alice  | Bob       | send-an-asset | 1 concert.ticket |
         * | Bob    | Alice     | send-an-asset | 20 euros |
         * And Bob signs the contract
         * And Alice signs the contract
         * Then the contract should appear as complete
         */
        const transferTransaction = TransferTransaction.create(
            Deadline.create(1, ChronoUnit.HOURS),
            account1.address,
            [],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        const transferTransaction2 = TransferTransaction.create(
            Deadline.create(1, ChronoUnit.HOURS),
            account4.address,
            [],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [transferTransaction.toAggregate(account4.publicAccount),
             transferTransaction2.toAggregate(account1.publicAccount)],
            NetworkType.MIJIN_TEST,
            []);

        const signedTransaction = aggregateTransaction.signTransactionWithCosignatories(account1, [account4], generationHash);
        aggregateTransactionService.isComplete(signedTransaction).toPromise().then((isComplete) => {
            expect(isComplete).to.be.true;
        });
    });

    it('should return correct isComplete status FALSE - multiple normal account', () => {
        /**
         * ACT
         * Alice: account1
         * Bog: account4
         * An escrow contract is signed by all the participants (normal accounts)
         * Given Alice defined the following escrow contract:
         * | sender | recipient | type          | data |
         * | Alice  | Bob       | send-an-asset | 1 concert.ticket |
         * | Bob    | Alice     | send-an-asset | 20 euros |
         * And Alice signs the contract
         * Then the contract should appear as incomplete
         */
        const transferTransaction = TransferTransaction.create(
            Deadline.create(1, ChronoUnit.HOURS),
            account1.address,
            [],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        const transferTransaction2 = TransferTransaction.create(
            Deadline.create(1, ChronoUnit.HOURS),
            account4.address,
            [],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [transferTransaction.toAggregate(account4.publicAccount),
             transferTransaction2.toAggregate(account1.publicAccount)],
            NetworkType.MIJIN_TEST,
            []);

        const signedTransaction = aggregateTransaction.signTransactionWithCosignatories(account1, [], generationHash);
        aggregateTransactionService.isComplete(signedTransaction).toPromise().then((isComplete) => {
            expect(isComplete).to.be.false;
        });
    });

    it('should return correct isComplete status TRUE - multisig Single Level', () => {
        /**
         * ACT - Multisig single level
         * Alice (account1): initiate an transfer to Bob
         * Bob (multisig3): is a 2/2 multisig account (account2 && account3)
         */
        const transferTransaction = TransferTransaction.create(
            Deadline.create(1, ChronoUnit.HOURS),
            account4.address,
            [],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [transferTransaction.toAggregate(multisig3.publicAccount)],
            NetworkType.MIJIN_TEST,
            []);

        const signedTransaction = aggregateTransaction.signTransactionWithCosignatories(account2, [account3], generationHash);
        aggregateTransactionService.isComplete(signedTransaction).toPromise().then((isComplete) => {
            expect(isComplete).to.be.true;
        });
    });

    it('should return correct isComplete status FALSE - multisig Single Level', () => {
        /**
         * ACT - Multisig single level
         * Alice (account1): initiate an transfer to Bob
         * Bob (multisig3): is a 2/2 multisig account (account2 && account3)
         */
        const transferTransaction = TransferTransaction.create(
            Deadline.create(1, ChronoUnit.HOURS),
            account4.address,
            [],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [transferTransaction.toAggregate(multisig3.publicAccount)],
            NetworkType.MIJIN_TEST,
            []);

        const signedTransaction = aggregateTransaction.signTransactionWithCosignatories(account2, [], generationHash);
        aggregateTransactionService.isComplete(signedTransaction).toPromise().then((isComplete) => {
            expect(isComplete).to.be.false;
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
    function givenMultisig3AccountInfo(): MultisigAccountInfo {
        return new MultisigAccountInfo(multisig3.publicAccount,
                2, 2,
                [account2.publicAccount,
                 account3.publicAccount],
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
    function givenAccount2Info(): MultisigAccountInfo {
        return new MultisigAccountInfo(account2.publicAccount,
                0, 0,
                [],
                [multisig2.publicAccount,
                 multisig3.publicAccount],
        );
    }
    function givenAccount3Info(): MultisigAccountInfo {
        return new MultisigAccountInfo(account3.publicAccount,
                0, 0,
                [],
                [multisig2.publicAccount,
                 multisig3.publicAccount],
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

    function givenMultisig3AccountGraphInfo(): MultisigAccountGraphInfo {
        const map = new Map<number, MultisigAccountInfo[]>();
        map.set(0, [new MultisigAccountInfo(multisig3.publicAccount,
                            2, 2,
                            [account2.publicAccount,
                            account3.publicAccount],
                            [],
                    )]);

        return new MultisigAccountGraphInfo(map);
    }

});
