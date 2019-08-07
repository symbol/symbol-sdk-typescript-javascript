/*
 * Copyright 2019 NEM
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
import {Account} from '../../../src/model/account/Account';
import {Address} from '../../../src/model/account/Address';
import {NetworkType} from '../../../src/model/blockchain/NetworkType';
import {MosaicId} from '../../../src/model/mosaic/MosaicId';
import {AliasAction} from '../../../src/model/namespace/AliasAction';
import {NamespaceId} from '../../../src/model/namespace/NamespaceId';
import {AddressAliasTransaction} from '../../../src/model/transaction/AddressAliasTransaction';
import {Deadline} from '../../../src/model/transaction/Deadline';
import {UInt64} from '../../../src/model/UInt64';
import {TestingAccount} from '../../conf/conf.spec';

describe('AddressAliasTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = TestingAccount;
    });

    it('should default maxFee field be set to 0', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressAliasTransaction = AddressAliasTransaction.create(
            Deadline.create(),
            AliasAction.Link,
            namespaceId,
            address,
            NetworkType.MIJIN_TEST,
        );

        expect(addressAliasTransaction.maxFee.higher).to.be.equal(0);
        expect(addressAliasTransaction.maxFee.lower).to.be.equal(0);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressAliasTransaction = AddressAliasTransaction.create(
            Deadline.create(),
            AliasAction.Link,
            namespaceId,
            address,
            NetworkType.MIJIN_TEST,
            new UInt64([1, 0])
        );

        expect(addressAliasTransaction.maxFee.higher).to.be.equal(0);
        expect(addressAliasTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should createComplete an AddressAliasTransaction object and sign it', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressAliasTransaction = AddressAliasTransaction.create(
            Deadline.create(),
            AliasAction.Link,
            namespaceId,
            address,
            NetworkType.MIJIN_TEST,
        );

        expect(addressAliasTransaction.aliasAction).to.be.equal(AliasAction.Link);
        expect(addressAliasTransaction.namespaceId.id.lower).to.be.equal(33347626);
        expect(addressAliasTransaction.namespaceId.id.higher).to.be.equal(3779697293);
        expect(addressAliasTransaction.address.plain()).to.be.equal('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');

        const signedTransaction = addressAliasTransaction.signWithCatbuffer(account, generationHash);

        expect(signedTransaction.payload.substring(
            240,
            signedTransaction.payload.length,
        )).to.be.equal('002AD8FC018D9A49E19050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142');

    });

    describe('size', () => {
        it('should return 154 for AggregateTransaction byte size with TransferTransaction with 1 mosaic and message NEM', () => {
            const namespaceId = new NamespaceId([33347626, 3779697293]);
            const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
            const addressAliasTransaction = AddressAliasTransaction.create(
                Deadline.create(),
                AliasAction.Link,
                namespaceId,
                address,
                NetworkType.MIJIN_TEST,
            );
            expect(addressAliasTransaction.size).to.be.equal(154);
        });
    });
});
