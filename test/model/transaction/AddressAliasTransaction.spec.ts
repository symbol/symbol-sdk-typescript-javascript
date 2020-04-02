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
import {Convert} from '../../../src/core/format';
import {Account} from '../../../src/model/account/Account';
import {Address} from '../../../src/model/account/Address';
import {MosaicId} from '../../../src/model/mosaic/MosaicId';
import {AliasAction} from '../../../src/model/namespace/AliasAction';
import {NamespaceId} from '../../../src/model/namespace/NamespaceId';
import {NetworkType} from '../../../src/model/network/NetworkType';
import {AddressAliasTransaction} from '../../../src/model/transaction/AddressAliasTransaction';
import {Deadline} from '../../../src/model/transaction/Deadline';
import {TestingAccount} from '../../conf/conf.spec';

describe('AddressAliasTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = TestingAccount;
    });

    it('should default maxFee field be set to 0', () => {
        const namespaceId = new NamespaceId(BigInt('0xE1499A8D01FCD82A'));
        const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressAliasTransaction = AddressAliasTransaction.create(
            Deadline.create(),
            AliasAction.Link,
            namespaceId,
            address,
            NetworkType.MIJIN_TEST,
        );

        expect(addressAliasTransaction.maxFee).to.be.equal(BigInt(0));
    });

    it('should filled maxFee override transaction maxFee', () => {
        const namespaceId = new NamespaceId(BigInt('0xE1499A8D01FCD82A'));
        const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressAliasTransaction = AddressAliasTransaction.create(
            Deadline.create(),
            AliasAction.Link,
            namespaceId,
            address,
            NetworkType.MIJIN_TEST,
            BigInt(1),
        );

        expect(addressAliasTransaction.maxFee).to.be.equal(BigInt(1));
    });

    it('should createComplete an AddressAliasTransaction object and sign it', () => {
        const namespaceId = new NamespaceId(BigInt('0xE1499A8D01FCD82A'));
        const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressAliasTransaction = AddressAliasTransaction.create(
            Deadline.create(),
            AliasAction.Link,
            namespaceId,
            address,
            NetworkType.MIJIN_TEST,
        );

        expect(addressAliasTransaction.aliasAction).to.be.equal(AliasAction.Link);
        expect(addressAliasTransaction.namespaceId.id).to.be.equal(BigInt('0xE1499A8D01FCD82A'));
        expect(addressAliasTransaction.address.plain()).to.be.equal('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');

        const signedTransaction = addressAliasTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            256,
            signedTransaction.payload.length,
        )).to.be.equal('2AD8FC018D9A49E19050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E14201');

    });

    describe('size', () => {
        it('should return 162 for AggregateTransaction byte size with TransferTransaction with 1 mosaic and message NEM', () => {
            const namespaceId = new NamespaceId(BigInt('0xE1499A8D01FCD82A'));
            const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
            const addressAliasTransaction = AddressAliasTransaction.create(
                Deadline.create(),
                AliasAction.Link,
                namespaceId,
                address,
                NetworkType.MIJIN_TEST,
            );
            expect(Convert.hexToUint8(addressAliasTransaction.serialize()).length).to.be.equal(addressAliasTransaction.size);
            expect(addressAliasTransaction.size).to.be.equal(162);
        });
    });

    it('Test set maxFee using multiplier', () => {
        const namespaceId = new NamespaceId(BigInt('0xE1499A8D01FCD82A'));
        const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressAliasTransaction = AddressAliasTransaction.create(
            Deadline.create(),
            AliasAction.Link,
            namespaceId,
            address,
            NetworkType.MIJIN_TEST,
        ).setMaxFee(2);
​
        expect(addressAliasTransaction.maxFee).to.be.equal(BigInt(324));
    });
});
