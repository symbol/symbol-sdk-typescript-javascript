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
import { Duration } from 'js-joda';
import { Convert } from '../../../src/core/format';
import { NetworkCurrencyLocal } from '../../../src/model/mosaic/NetworkCurrencyLocal';
import { NetworkType } from '../../../src/model/network/NetworkType';
import { AggregateTransaction } from '../../../src/model/transaction/AggregateTransaction';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { HashLockTransaction } from '../../../src/model/transaction/HashLockTransaction';
import { UInt64 } from '../../../src/model/UInt64';
import { TestingAccount } from '../../conf/conf.spec';

describe('HashLockTransaction', () => {
    const account = TestingAccount;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    const epochAdjustment = Duration.ofSeconds(1573430400);
    it('creation with an aggregate bonded tx', () => {
        const aggregateTransaction = AggregateTransaction.createBonded(Deadline.create(epochAdjustment), [], NetworkType.MIJIN_TEST, []);
        const signedTransaction = account.sign(aggregateTransaction, generationHash);
        const transaction = HashLockTransaction.create(
            Deadline.create(epochAdjustment),
            NetworkCurrencyLocal.createRelative(10),
            UInt64.fromUint(10),
            signedTransaction,
            NetworkType.MIJIN_TEST,
        );
        expect(transaction.mosaic.id).to.be.equal(NetworkCurrencyLocal.NAMESPACE_ID);
        expect(transaction.mosaic.amount.compact()).to.be.equal(10000000);
        expect(transaction.hash).to.be.equal(signedTransaction.hash);
        expect(Convert.hexToUint8(transaction.serialize()).length).to.be.equal(transaction.size);
    });

    it('should throw exception if it is not a aggregate bonded tx', () => {
        const aggregateTransaction = AggregateTransaction.createComplete(Deadline.create(epochAdjustment), [], NetworkType.MIJIN_TEST, []);
        const signedTransaction = account.sign(aggregateTransaction, generationHash);
        expect(() => {
            HashLockTransaction.create(
                Deadline.create(epochAdjustment),
                NetworkCurrencyLocal.createRelative(10),
                UInt64.fromUint(10),
                signedTransaction,
                NetworkType.MIJIN_TEST,
            );
        }).to.throw(Error);
    });

    it('Notify Account', () => {
        const aggregateTransaction = AggregateTransaction.createBonded(Deadline.create(epochAdjustment), [], NetworkType.MIJIN_TEST, []);
        const signedTransaction = account.sign(aggregateTransaction, generationHash);
        const tx = HashLockTransaction.create(
            Deadline.create(epochAdjustment),
            NetworkCurrencyLocal.createRelative(10),
            UInt64.fromUint(10),
            signedTransaction,
            NetworkType.MIJIN_TEST,
        );

        Object.assign(tx, { signer: account.publicAccount });
        expect(tx.shouldNotifyAccount(account.address)).to.be.true;
    });
});
