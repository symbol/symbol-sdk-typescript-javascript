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
import http = require('http');
import {
    BlockRoutesApi,
    TransactionRoutesApi,
    TransactionStateTypeEnum,
    TransactionStatusDTO,
    TransactionStatusTypeEnum,
} from 'symbol-openapi-typescript-node-client';
import { deepEqual, instance, mock, when } from 'ts-mockito';

import { TransactionHttp } from '../../src/infrastructure/TransactionHttp';
import { Address } from '../../src/model/account/Address';
import { PlainMessage } from '../../src/model/message/PlainMessage';
import { NetworkType } from '../../src/model/network/NetworkType';
import { AggregateTransaction } from '../../src/model/transaction/AggregateTransaction';
import { Deadline } from '../../src/model/transaction/Deadline';
import { TransferTransaction } from '../../src/model/transaction/TransferTransaction';
import { NIS2_URL, TestingAccount } from '../conf/conf.spec';

describe('TransactionHttp', () => {
    const account = TestingAccount;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    it('should return an error when a non aggregate transaction bonded is announced via announceAggregateBonded method', () => {
        const tx = TransferTransaction.create(
            Deadline.create(),
            Address.createFromRawAddress('SAGY2PTFX4T2XYKYXTJXYCTQRP3FESQH5MEQI2RQ'),
            [],
            PlainMessage.create('Hi'),
            NetworkType.MIJIN_TEST,
        );
        const aggTx = AggregateTransaction.createComplete(
            Deadline.create(),
            [
                tx.toAggregate(account.publicAccount),
            ],
            NetworkType.MIJIN_TEST,
            [],
        );

        const signedTx = account.sign(aggTx, generationHash);
        const trnsHttp = new TransactionHttp(NIS2_URL);
        expect(() => {
            trnsHttp.announceAggregateBonded(signedTx)
            .toPromise()
            .then();
        }).to.throw(Error, 'Only Transaction Type 0x4241 is allowed for announce aggregate bonded');
    });

    let clientResponse: http.ClientResponse;
    let transactionRoutesApi: TransactionRoutesApi;
    let transactionHttp: TransactionHttp;
    let blockRoutesApi: BlockRoutesApi;

    before(() => {
        transactionRoutesApi = mock();
        blockRoutesApi = mock();
        clientResponse = mock();
        transactionHttp = new TransactionHttp(NIS2_URL);
        (transactionHttp as object)['transactionRoutesApi'] = instance(transactionRoutesApi);
        (transactionHttp as object)['blockRoutesApi'] = instance(blockRoutesApi);
    });

    it('Test getTransactionStatus method', async () => {
        const hash = 'abc';
        const transactionStatusDTO = new TransactionStatusDTO();
        transactionStatusDTO.code = TransactionStatusTypeEnum.FailureAccountLinkInvalidAction;
        transactionStatusDTO.deadline = '1234';
        transactionStatusDTO.hash = hash;
        transactionStatusDTO.group = TransactionStateTypeEnum.Failed;
        transactionStatusDTO.height = '567';

        when(transactionRoutesApi.getTransactionStatus(deepEqual(hash)))
        .thenReturn(Promise.resolve({response: instance(clientResponse), body: transactionStatusDTO}));

        const transactionStatus = await transactionHttp.getTransactionStatus(hash).toPromise();

        expect(transactionStatus.deadline.toString()).to.be.equal('1234');
        expect(transactionStatus.hash).to.be.equal(hash);
        expect(transactionStatus.code).to.be.equal('Failure_AccountLink_Invalid_Action');
        expect(transactionStatus.group).to.be.equal('failed');
    });

    it('Test getTransactionsStatuses method', async () => {
        const hash = 'abc';
        const transactionStatusDTO = new TransactionStatusDTO();
        transactionStatusDTO.code = TransactionStatusTypeEnum.FailureAccountLinkInvalidAction;
        transactionStatusDTO.deadline = '1234';
        transactionStatusDTO.hash = hash;
        transactionStatusDTO.group = TransactionStateTypeEnum.Failed;
        transactionStatusDTO.height = '567';
        when(transactionRoutesApi.getTransactionsStatuses(deepEqual({hashes: [hash]})))
        .thenReturn(Promise.resolve({response: instance(clientResponse), body: [transactionStatusDTO]}));

        const transactionStatuses = await transactionHttp.getTransactionsStatuses([hash]).toPromise();
        expect(transactionStatuses.length).to.be.equal(1);
        const transactionStatus = transactionStatuses[0];

        expect(transactionStatus.deadline.toString()).to.be.equal('1234');
        expect(transactionStatus.hash).to.be.equal(hash);
        expect(transactionStatus.code).to.be.equal('Failure_AccountLink_Invalid_Action');
        expect(transactionStatus.group).to.be.equal('failed');

    });
});
