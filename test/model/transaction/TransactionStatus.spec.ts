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

import { deepEqual } from 'assert';
import { expect } from 'chai';
import { TransactionStatusTypeEnum } from 'nem2-sdk-openapi-typescript-node-client';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { TransactionStatus } from '../../../src/model/transaction/TransactionStatus';
import { UInt64 } from '../../../src/model/UInt64';

describe('TransactionStatus', () => {
    it('should createComplete TransactionStatus object', () => {
        const transactionStatusDTO = {
            deadline: Deadline.createFromDTO('1'),
            group: 'confirmed',
            hash: '18C036C20B32348D63684E09A13128A2C18F6A75650D3A5FB43853D716E5E219',
            height: new UInt64([1, 0]),
            code: TransactionStatusTypeEnum.Success,
        };

        const transactionStatus = new TransactionStatus(
            transactionStatusDTO.group,
            transactionStatusDTO.hash,
            transactionStatusDTO.deadline,
            transactionStatusDTO.code.toString(),
            transactionStatusDTO.height,
        );

        expect(transactionStatus.group).to.be.equal(transactionStatusDTO.group);
        expect(transactionStatus.code).to.be.equal(transactionStatusDTO.code);
        expect(transactionStatus.hash).to.be.equal(transactionStatusDTO.hash);
        deepEqual(transactionStatus.deadline, transactionStatusDTO.deadline);
        deepEqual(transactionStatus.height, transactionStatusDTO.height);
    });
});
