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

import {deepEqual} from 'assert';
import {expect} from 'chai';
import {TransactionStatusError} from '../../../src/model/transaction/TransactionStatusError';
import {Deadline} from '../../../src/model/transaction/Deadline';
import { UInt64 } from '../../../src/model/UInt64';
import {Address} from "../../../src/model/account/Address";

describe('TransactionStatusError', () => {

    it('should createComplete an TransactionStatusError object', () => {
        const statusInfoErrorDTO = {
            address: Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC'),
            deadline: '1010',
            hash: 'transaction-hash',
            status: 'error-message',
        };
        const transactionStatusError = new TransactionStatusError(
            statusInfoErrorDTO.address,
            statusInfoErrorDTO.hash,
            statusInfoErrorDTO.status,
            Deadline.createFromDTO(statusInfoErrorDTO.deadline));

        expect(transactionStatusError.address).to.be.equal(statusInfoErrorDTO.address);
        expect(transactionStatusError.hash).to.be.equal(statusInfoErrorDTO.hash);
        expect(transactionStatusError.status).to.be.equal(statusInfoErrorDTO.status);
        deepEqual(transactionStatusError.deadline.toDTO(), UInt64.fromNumericString(statusInfoErrorDTO.deadline).toDTO());
    });
});
