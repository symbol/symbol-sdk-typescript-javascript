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
import {ChronoUnit} from 'js-joda';
import {TransactionHttp} from '../../src/infrastructure/TransactionHttp';
import {Account} from '../../src/model/account/Account';
import {Address} from '../../src/model/account/Address';
import { PublicAccount } from '../../src/model/account/PublicAccount';
import {NetworkType} from '../../src/model/blockchain/NetworkType';
import { Mosaic } from '../../src/model/mosaic/Mosaic';
import { MosaicId } from '../../src/model/mosaic/MosaicId';
import {NetworkCurrencyMosaic} from '../../src/model/mosaic/NetworkCurrencyMosaic';
import {AggregateTransaction} from '../../src/model/transaction/AggregateTransaction';
import {CosignatureTransaction} from '../../src/model/transaction/CosignatureTransaction';
import {Deadline} from '../../src/model/transaction/Deadline';
import { LockFundsTransaction } from '../../src/model/transaction/LockFundsTransaction';
import { ModifyMultisigAccountTransaction } from '../../src/model/transaction/ModifyMultisigAccountTransaction';
import { MultisigCosignatoryModification } from '../../src/model/transaction/MultisigCosignatoryModification';
import { MultisigCosignatoryModificationType } from '../../src/model/transaction/MultisigCosignatoryModificationType';
import {PlainMessage} from '../../src/model/transaction/PlainMessage';
import { SignedTransaction } from '../../src/model/transaction/SignedTransaction';
import {TransferTransaction} from '../../src/model/transaction/TransferTransaction';
import {UInt64} from '../../src/model/UInt64';

export class TransactionUtils {

    public static createAndAnnounce(signer: Account,
                                    recipient: Address,
                                    transactionHttp: TransactionHttp,
                                    mosaic: Mosaic[] = []) {
        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            recipient,
            mosaic,
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );
        const signedTransaction = signer.sign(transferTransaction);
        transactionHttp.announce(signedTransaction);
    }

    public static announceAggregateBoundedTransaction(signedTransaction: SignedTransaction,
                                                      transactionHttp: TransactionHttp) {
        transactionHttp.announceAggregateBonded(signedTransaction);
    }

    public static createSignedAggregatedBondTransaction(aggregatedTo: Account,
                                                        signer: Account,
                                                        recipient: Address) {

        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            recipient,
            [],
            PlainMessage.create('test-message'),
            NetworkType.MIJIN_TEST,
        );

        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(2, ChronoUnit.MINUTES),
            [transferTransaction.toAggregate(aggregatedTo.publicAccount)],
            NetworkType.MIJIN_TEST,
            [],
        );
        return signer.sign(aggregateTransaction);
    }

    public static createHashLockTransactionAndAnnounce(signedAggregatedTransaction: SignedTransaction,
                                                       signer: Account,
                                                       mosaicId: MosaicId,
                                                       transactionHttp: TransactionHttp) {
        const lockFundsTransaction = LockFundsTransaction.create(
            Deadline.create(),
            new Mosaic(mosaicId, UInt64.fromUint(10 * Math.pow(10, NetworkCurrencyMosaic.DIVISIBILITY))),
            UInt64.fromUint(1000),
            signedAggregatedTransaction,
            NetworkType.MIJIN_TEST,
        );
        const signedLockFundsTransaction = signer.sign(lockFundsTransaction);
        transactionHttp.announce(signedLockFundsTransaction);
    }

    public static cosignTransaction(transaction: AggregateTransaction,
                                    account: Account,
                                    transactionHttp: TransactionHttp) {
        const cosignatureTransaction = CosignatureTransaction.create(transaction);
        const cosignatureSignedTransaction = account.signCosignatureTransaction(cosignatureTransaction);
        transactionHttp.announceAggregateBondedCosignature(cosignatureSignedTransaction);
    }

    public static createModifyMultisigAccountTransaction( account: Account,
                                                          transactionHttp: TransactionHttp) {
        const modifyMultisig = ModifyMultisigAccountTransaction.create(
            Deadline.create(),
            2,
            1,
            [new MultisigCosignatoryModification(
                MultisigCosignatoryModificationType.Add,
                PublicAccount.createFromPublicKey(account.publicKey, NetworkType.MIJIN_TEST),
            )],
            NetworkType.MIJIN_TEST,
        );
        const signedTransaction = account.sign(modifyMultisig);
        transactionHttp.announce(signedTransaction);
    }
}
