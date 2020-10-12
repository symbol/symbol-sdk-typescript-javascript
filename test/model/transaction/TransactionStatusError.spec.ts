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
import { Address } from '../../../src/model/account/Address';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { TransactionStatusError } from '../../../src/model/transaction/TransactionStatusError';
import { UInt64 } from '../../../src/model/UInt64';

describe('TransactionStatusError', () => {
    it('should createComplete an TransactionStatusError object', () => {
        const statusInfoErrorDTO = {
            address: Address.createFromRawAddress('QATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA367I6OQ'),
            deadline: '1010',
            hash: 'transaction-hash',
            code: 'error-message',
        };
        const transactionStatusError = new TransactionStatusError(
            statusInfoErrorDTO.address,
            statusInfoErrorDTO.hash,
            statusInfoErrorDTO.code,
            Deadline.createFromDTO(statusInfoErrorDTO.deadline),
        );

        expect(transactionStatusError.address).to.be.equal(statusInfoErrorDTO.address);
        expect(transactionStatusError.hash).to.be.equal(statusInfoErrorDTO.hash);
        expect(transactionStatusError.code).to.be.equal(statusInfoErrorDTO.code);
        deepEqual(transactionStatusError.deadline.toDTO(), UInt64.fromNumericString(statusInfoErrorDTO.deadline).toDTO());
    });
});
