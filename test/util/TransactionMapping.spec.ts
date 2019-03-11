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
import { Account } from '../../src/model/account/Account';
import { Address } from '../../src/model/account/Address';
import { PropertyModificationType } from '../../src/model/account/PropertyModificationType';
import { PropertyType } from '../../src/model/account/PropertyType';
import { NetworkType } from '../../src/model/blockchain/NetworkType';
import { ModifyAccountPropertyAddressTransaction } from '../../src/model/model';
import { AccountPropertyTransaction } from '../../src/model/transaction/AccountPropertyTransaction';
import { Deadline } from '../../src/model/transaction/Deadline';
import { TransactionMapping } from '../../src/util/util';
import { TestingAccount } from '../conf/conf.spec';

describe('TransactionMapping', () => {
    let account: Account;

    before(() => {
        account = TestingAccount;
    });

    it('should create AccountPropertyAddressTransaction', () => {
        const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressPropertyFilter = AccountPropertyTransaction.createAddressFilter(
            PropertyModificationType.Add,
            address,
        );
        const addressPropertyTransaction = AccountPropertyTransaction.createAddressPropertyModificationTransaction(
            Deadline.create(),
            PropertyType.AllowAddress,
            [addressPropertyFilter],
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = addressPropertyTransaction.signWith(account);

        const transaction = TransactionMapping.createFromBinary(signedTransaction.payload) as ModifyAccountPropertyAddressTransaction;

        console.log('TTTTTT', transaction);

        expect(transaction.propertyType).to.be.equal(PropertyType.AllowAddress);
    });
});
