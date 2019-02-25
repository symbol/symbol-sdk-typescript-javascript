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
import {AliasActionType} from '../../../src/model/namespace/AliasActionType';
import {NamespaceId} from '../../../src/model/namespace/NamespaceId';
import {AddressAliasTransaction} from '../../../src/model/transaction/AddressAliasTransaction';
import {Deadline} from '../../../src/model/transaction/Deadline';
import {UInt64} from '../../../src/model/UInt64';
import {TestingAccount} from '../../conf/conf.spec';

describe('AddressAliasTransaction', () => {
    let account: Account;

    before(() => {
        account = TestingAccount;
    });

    it('should createComplete an AddressAliasTransaction object and sign it', () => {
        const namespaceId = new NamespaceId([33347626, 3779697293]);
        const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressAliasTransaction = AddressAliasTransaction.create(
            Deadline.create(),
            AliasActionType.Link,
            namespaceId,
            address,
            NetworkType.MIJIN_TEST,
        );

        expect(addressAliasTransaction.actionType).to.be.equal(AliasActionType.Link);
        expect(addressAliasTransaction.namespaceId.id.lower).to.be.equal(33347626);
        expect(addressAliasTransaction.namespaceId.id.higher).to.be.equal(3779697293);
        expect(addressAliasTransaction.address.plain()).to.be.equal('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');

        const signedTransaction = addressAliasTransaction.signWith(account);

        expect(signedTransaction.payload.substring(
            240,
            signedTransaction.payload.length,
        )).to.be.equal('002AD8FC018D9A49E19050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142');

    });
});
