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

import {TransactionHttp} from '../../src/infrastructure/TransactionHttp';
import {Address} from '../../src/model/account/Address';
import {NetworkType} from '../../src/model/blockchain/NetworkType';
import {AggregateTransaction} from '../../src/model/transaction/AggregateTransaction';
import {Deadline} from '../../src/model/transaction/Deadline';
import {PlainMessage} from '../../src/model/transaction/PlainMessage';
import {TransferTransaction} from '../../src/model/transaction/TransferTransaction';
import {UInt64} from '../../src/model/UInt64';
import {NIS2_URL, TestingAccount} from '../conf/conf.spec';

describe('TransactionHttp', () => {
    const account = TestingAccount;
    it('should return an error when a non aggregate transaction bonded is announced via announceAggregateBonded method', () => {
        const tx = TransferTransaction.create(
            Deadline.create(),
            new UInt64([0, 0]),
            Address.createFromRawAddress('SAGY2PTFX4T2XYKYXTJXYCTQRP3FESQH5MEQI2RQ'),
            [],
            PlainMessage.create('Hi'),
            NetworkType.MIJIN_TEST,
        );
        const aggTx = AggregateTransaction.createComplete(
            Deadline.create(),
            new UInt64([0, 0]),
            [
                tx.toAggregate(account.publicAccount),
            ],
            NetworkType.MIJIN_TEST,
            [],
        );

        const signedTx = account.sign(aggTx);
        const trnsHttp = new TransactionHttp(NIS2_URL);
        return trnsHttp.announceAggregateBonded(signedTx)
            .toPromise()
            .then(() => {
                throw new Error('Should be called');
            })
            .catch((reason) => {
                expect(reason.toString()).to.be.equal('Only Transaction Type 0x4241 is allowed for announce aggregate bonded');
            });
    });
});
