/*
 * Copyright 2020 NEM
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
import { Order, TransactionGroupSubsetEnum } from 'symbol-openapi-typescript-node-client';
import { TransactionSearchCriteria } from '../../src/infrastructure/TransactionSearchCriteria';
import { TestingAccount } from '../conf/conf.spec';
import { UInt64, TransactionType, Address } from '../../src/model/model';
import { deepEqual } from 'assert';

describe('TransactionSearchCriteria', () => {
    const account = TestingAccount;

    it('should create TransactionSearchCriteria', () => {
        const criteria = new TransactionSearchCriteria()
            .buildOrder(Order.Asc)
            .buildPageNumber(1)
            .buildPageSize(1)
            .buildAddress(account.address)
            .buildEmbedded(true)
            .buildGroup(TransactionGroupSubsetEnum.Confirmed)
            .buildHeight(UInt64.fromUint(1))
            .buildId('12345')
            .buildOffset('6789')
            .buildRecipientAddress(account.address)
            .buildSignerPublicKey(account.publicKey)
            .buildTransactionTypes([TransactionType.ACCOUNT_ADDRESS_RESTRICTION]);

        expect(criteria.getOrder().valueOf()).to.be.equal('asc');
        expect(criteria.getPageNumber()).to.be.equal(1);
        expect(criteria.getPageSize()).to.be.equal(1);
        expect(criteria.getAddress()).to.be.equal(account.address.plain());
        expect(criteria.getEmbedded()).to.be.equal(true);
        expect(criteria.getGroup()).to.be.equal(TransactionGroupSubsetEnum.Confirmed);
        expect(criteria.getHeight()).to.be.equal('1');
        expect(criteria.getId()).to.be.equal('12345');
        expect(criteria.getOffset()).to.be.equal('6789');
        expect(criteria.getRecipientAddress()).to.be.equal(account.address.plain());
        expect(criteria.getSignerPublicKey()).to.be.equal(account.publicKey);
        deepEqual(criteria.getTransactionTypes(), [TransactionType.ACCOUNT_ADDRESS_RESTRICTION]);

        const address = Address.createFromRawAddress('MCTVW23D2MN5VE4AQ4TZIDZENGNOZXPRPR72DYSX');
        criteria.setOrder(Order.Desc);
        criteria.setPageNumber(2);
        criteria.setPageSize(2);
        criteria.setAddress(address);
        criteria.setEmbedded(false);
        criteria.setGroup(TransactionGroupSubsetEnum.Unconfirmed);
        criteria.setHeight(UInt64.fromUint(2));
        criteria.setId('aaa');
        criteria.setOffset('bbb');
        criteria.setRecipientAddress(address);
        criteria.setSignerPublicKey('publicKey');
        criteria.setTransactionTypes([TransactionType.TRANSFER]);

        expect(criteria.getOrder().valueOf()).to.be.equal('desc');
        expect(criteria.getPageNumber()).to.be.equal(2);
        expect(criteria.getPageSize()).to.be.equal(2);
        expect(criteria.getAddress()).to.be.equal(address.plain());
        expect(criteria.getEmbedded()).to.be.equal(false);
        expect(criteria.getGroup()).to.be.equal(TransactionGroupSubsetEnum.Unconfirmed);
        expect(criteria.getHeight()).to.be.equal('2');
        expect(criteria.getId()).to.be.equal('aaa');
        expect(criteria.getOffset()).to.be.equal('bbb');
        expect(criteria.getRecipientAddress()).to.be.equal(address.plain());
        expect(criteria.getSignerPublicKey()).to.be.equal('publicKey');
        deepEqual(criteria.getTransactionTypes(), [TransactionType.TRANSFER]);
    });

    it('should create TransactionSearchCriteria - default', () => {
        const criteria = new TransactionSearchCriteria();

        expect(criteria.getOrder().valueOf()).to.be.equal('desc');
        expect(criteria.getPageNumber()).to.be.equal(1);
        expect(criteria.getPageSize()).to.be.equal(10);
        expect(criteria.getAddress()).to.be.undefined;
        expect(criteria.getEmbedded()).to.be.undefined;
        expect(criteria.getGroup()).to.be.undefined;
        expect(criteria.getHeight()).to.be.undefined;
        expect(criteria.getId()).to.be.undefined;
        expect(criteria.getOffset()).to.be.undefined;
        expect(criteria.getRecipientAddress()).to.be.undefined;
        expect(criteria.getSignerPublicKey()).to.be.undefined;
        expect(criteria.getTransactionTypes()).to.be.undefined;
    });
});
