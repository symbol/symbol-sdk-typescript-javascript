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
    TransactionGroupEnum,
    TransactionStatusDTO,
    TransactionStatusEnum,
    TransactionStatusRoutesApi,
} from 'symbol-openapi-typescript-node-client';
import { deepEqual, instance, mock, when } from 'ts-mockito';

import { NIS2_URL } from '../conf/conf.spec';
import { TransactionStatusHttp } from '../../src/infrastructure/TransactionStatusHttp';

describe('TransactionStatusHttp', () => {
    let clientResponse: http.ClientResponse;
    let transactionStatusRoutesApi: TransactionStatusRoutesApi;
    let transactionStatusHttp: TransactionStatusHttp;

    before(() => {
        transactionStatusRoutesApi = mock();
        clientResponse = mock();
        transactionStatusHttp = new TransactionStatusHttp(NIS2_URL);
        (transactionStatusHttp as object)['transactionStatusRoutesApi'] = instance(transactionStatusRoutesApi);
    });

    it('Test getTransactionStatus method', async () => {
        const hash = 'abc';
        const transactionStatusDTO = new TransactionStatusDTO();
        transactionStatusDTO.code = TransactionStatusEnum.FailureAccountLinkInconsistentUnlinkData;
        transactionStatusDTO.deadline = '1234';
        transactionStatusDTO.hash = hash;
        transactionStatusDTO.group = TransactionGroupEnum.Failed;
        transactionStatusDTO.height = '567';

        when(transactionStatusRoutesApi.getTransactionStatus(deepEqual(hash))).thenReturn(
            Promise.resolve({ response: instance(clientResponse), body: transactionStatusDTO }),
        );

        const transactionStatus = await transactionStatusHttp.getTransactionStatus(hash).toPromise();

        expect(transactionStatus.deadline.toString()).to.be.equal('1234');
        expect(transactionStatus.hash).to.be.equal(hash);
        expect(transactionStatus.code).to.be.equal('Failure_AccountLink_Inconsistent_Unlink_Data');
        expect(transactionStatus.group).to.be.equal('failed');
    });

    it('Test getTransactionsStatuses method', async () => {
        const hash = 'abc';
        const transactionStatusDTO = new TransactionStatusDTO();
        transactionStatusDTO.code = TransactionStatusEnum.FailureAccountLinkInconsistentUnlinkData;
        transactionStatusDTO.deadline = '1234';
        transactionStatusDTO.hash = hash;
        transactionStatusDTO.group = TransactionGroupEnum.Failed;
        transactionStatusDTO.height = '567';
        when(transactionStatusRoutesApi.getTransactionStatuses(deepEqual({ hashes: [hash] }))).thenReturn(
            Promise.resolve({ response: instance(clientResponse), body: [transactionStatusDTO] }),
        );

        const transactionStatuses = await transactionStatusHttp.getTransactionStatuses([hash]).toPromise();
        expect(transactionStatuses.length).to.be.equal(1);
        const transactionStatus = transactionStatuses[0];

        expect(transactionStatus.deadline.toString()).to.be.equal('1234');
        expect(transactionStatus.hash).to.be.equal(hash);
        expect(transactionStatus.code).to.be.equal('Failure_AccountLink_Inconsistent_Unlink_Data');
        expect(transactionStatus.group).to.be.equal('failed');
    });
});
