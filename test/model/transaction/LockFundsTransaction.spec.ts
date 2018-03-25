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
import {NetworkType} from '../../../src/model/blockchain/NetworkType';
import {XEM} from '../../../src/model/mosaic/XEM';
import {AggregateTransaction} from '../../../src/model/transaction/AggregateTransaction';
import {Deadline} from '../../../src/model/transaction/Deadline';
import {LockFundsTransaction} from '../../../src/model/transaction/LockFundsTransaction';
import {UInt64} from '../../../src/model/UInt64';
import {TestingAccount} from '../../conf/conf.spec';

describe('LockFundsTransaction', () => {
    const account = TestingAccount;
    it('creation with an aggregate bonded tx', () => {
        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(),
            [],
            NetworkType.MIJIN_TEST,
            [],
        );
        const signedTransaction = account.sign(aggregateTransaction);
        const transaction = LockFundsTransaction.create(Deadline.create(),
            XEM.createRelative(10),
            UInt64.fromUint(10),
            signedTransaction,
            NetworkType.MIJIN_TEST);
        expect(transaction.mosaic.id).to.be.equal(XEM.MOSAIC_ID);
        expect(transaction.mosaic.amount.compact()).to.be.equal(10000000);
        expect(transaction.hash).to.be.equal(signedTransaction.hash);
    });

    it('should throw exception if it is not a aggregate bonded tx', () => {
        const aggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(),
            [],
            NetworkType.MIJIN_TEST,
            [],
        );
        const signedTransaction = account.sign(aggregateTransaction);
        expect(() => {
            LockFundsTransaction.create(Deadline.create(),
                XEM.createRelative(10),
                UInt64.fromUint(10),
                signedTransaction,
                NetworkType.MIJIN_TEST);
        }).to.throw(Error);
    });
});
