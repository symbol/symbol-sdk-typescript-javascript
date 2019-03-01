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
import { PropertyModificationType, PropertyType } from '../../../src/model/model';
import {MosaicId} from '../../../src/model/mosaic/MosaicId';
import {AccountPropertyTransaction} from '../../../src/model/transaction/AccountPropertyTransaction';
import {Deadline} from '../../../src/model/transaction/Deadline';
import { TransactionTypeEnum } from '../../../src/model/transaction/TransactionTypeEnum';
import {TestingAccount} from '../../conf/conf.spec';

describe('AccountPropertyTransaction', () => {
    let account: Account;

    before(() => {
        account = TestingAccount;
    });
    it('should create address property filter', () => {
        const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressPropertyFilter = AccountPropertyTransaction.createAddressFilter(
            PropertyModificationType.Add,
            address,
        );
        expect(addressPropertyFilter.modificationType).to.be.equal(PropertyModificationType.Add);
        expect(addressPropertyFilter.value).to.be.equal(address.plain());
    });

    it('should create mosaic property filter', () => {
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicPropertyFilter = AccountPropertyTransaction.createMosaicFilter(
            PropertyModificationType.Add,
            mosaicId,
        );
        expect(mosaicPropertyFilter.modificationType).to.be.equal(PropertyModificationType.Add);
        expect(mosaicPropertyFilter.value[0]).to.be.equal(mosaicId.id.lower);
        expect(mosaicPropertyFilter.value[1]).to.be.equal(mosaicId.id.higher);
    });

    it('should create entity type property filter', () => {
        const entityType = TransactionTypeEnum.ADDRESS_ALIAS;
        const entityTypePropertyFilter = AccountPropertyTransaction.createEntityTypeFilter(
            PropertyModificationType.Add,
            entityType,
        );
        expect(entityTypePropertyFilter.modificationType).to.be.equal(PropertyModificationType.Add);
        expect(entityTypePropertyFilter.value).to.be.equal(entityType);
    });

    it('should throw exception when entity type property filter passed in wrong type', () => {
        const entityType = -99;
        expect(() => {
            const filter = AccountPropertyTransaction.createEntityTypeFilter(
                 PropertyModificationType.Add,
                 entityType,
             );
         }).to.throw(Error, 'Not a transaction type');
    });

    it('should create address property transaction', () => {

        const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressPropertyFilter = AccountPropertyTransaction.createAddressFilter(
            PropertyModificationType.Add,
            address,
        );
        const addressPropertyTransaction = AccountPropertyTransaction.createAddressProertyModificationTransaction(
            Deadline.create(),
            PropertyType.AllowAddress,
            [addressPropertyFilter],
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = addressPropertyTransaction.signWith(account);

        expect(signedTransaction.payload.substring(
            240,
            signedTransaction.payload.length,
        )).to.be.equal('0101009050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142');

    });

    it('should throw exception when create address property transaction with wrong type', () => {

        const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressPropertyFilter = AccountPropertyTransaction.createAddressFilter(
            PropertyModificationType.Add,
            address,
        );

        expect(() => {
            AccountPropertyTransaction.createAddressProertyModificationTransaction(
                Deadline.create(),
                PropertyType.Sentinel,
                [addressPropertyFilter],
                NetworkType.MIJIN_TEST,
            );
         }).to.throw(Error, 'Property type is not allowed.');

    });

    it('should create mosaic property transaction', () => {

        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicPropertyFilter = AccountPropertyTransaction.createMosaicFilter(
            PropertyModificationType.Add,
            mosaicId,
        );
        const mosaicPropertyTransaction = AccountPropertyTransaction.createMosaicProertyModificationTransaction(
            Deadline.create(),
            PropertyType.AllowMosaic,
            [mosaicPropertyFilter],
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = mosaicPropertyTransaction.signWith(account);

        expect(signedTransaction.payload.substring(
            240,
            signedTransaction.payload.length,
        )).to.be.equal('0201004CCCD78612DDF5CA');

    });

    it('should throw exception when create mosaic property transaction with wrong type', () => {

        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicPropertyFilter = AccountPropertyTransaction.createMosaicFilter(
            PropertyModificationType.Add,
            mosaicId,
        );

        expect(() => {
            AccountPropertyTransaction.createMosaicProertyModificationTransaction(
                Deadline.create(),
                PropertyType.Sentinel,
                [mosaicPropertyFilter],
                NetworkType.MIJIN_TEST,
            );
         }).to.throw(Error, 'Property type is not allowed.');

    });

    it('should create entity type property transaction', () => {

        const entityType = TransactionTypeEnum.ADDRESS_ALIAS;
        const entityTypePropertyFilter = AccountPropertyTransaction.createEntityTypeFilter(
            PropertyModificationType.Add,
            entityType,
        );
        const entityTypePropertyTransaction = AccountPropertyTransaction.createEntityTypePropertyModificationTransaction(
            Deadline.create(),
            PropertyType.AllowTransaction,
            [entityTypePropertyFilter],
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = entityTypePropertyTransaction.signWith(account);

        expect(signedTransaction.payload.substring(
            240,
            signedTransaction.payload.length,
        )).to.be.equal('0401004E42');

    });

    it('should throw exception when create entity type property transaction with wrong type', () => {

        const entityType = TransactionTypeEnum.ADDRESS_ALIAS;
        const entityTypePropertyFilter = AccountPropertyTransaction.createEntityTypeFilter(
            PropertyModificationType.Add,
            entityType,
        );

        expect(() => {
            AccountPropertyTransaction.createEntityTypePropertyModificationTransaction(
                Deadline.create(),
                PropertyType.Sentinel,
                [entityTypePropertyFilter],
                NetworkType.MIJIN_TEST,
            );
         }).to.throw(Error, 'Property type is not allowed.');

    });
});
