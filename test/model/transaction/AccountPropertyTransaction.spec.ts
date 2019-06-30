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
import { PropertyModificationType } from '../../../src/model/account/PropertyModificationType';
import { PropertyType } from '../../../src/model/account/PropertyType';
import {NetworkType} from '../../../src/model/blockchain/NetworkType';
import {MosaicId} from '../../../src/model/mosaic/MosaicId';
import { AccountRestrictionModification } from '../../../src/model/transaction/AccountRestrictionModification';
import {AccountRestrictionTransaction} from '../../../src/model/transaction/AccountRestrictionTransaction';
import {Deadline} from '../../../src/model/transaction/Deadline';
import { TransactionType } from '../../../src/model/transaction/TransactionType';
import {UInt64} from '../../../src/model/UInt64';
import {TestingAccount} from '../../conf/conf.spec';

describe('AccountRestrictionTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    before(() => {
        account = TestingAccount;
    });
    it('should create address property filter', () => {
        const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressPropertyFilter = AccountRestrictionModification.createForAddress(
            PropertyModificationType.Add,
            address,
        );
        expect(addressPropertyFilter.modificationType).to.be.equal(PropertyModificationType.Add);
        expect(addressPropertyFilter.value).to.be.equal(address.plain());
    });

    it('should create mosaic property filter', () => {
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicPropertyFilter = AccountRestrictionModification.createForMosaic(
            PropertyModificationType.Add,
            mosaicId,
        );
        expect(mosaicPropertyFilter.modificationType).to.be.equal(PropertyModificationType.Add);
        expect(mosaicPropertyFilter.value[0]).to.be.equal(mosaicId.id.lower);
        expect(mosaicPropertyFilter.value[1]).to.be.equal(mosaicId.id.higher);
    });

    it('should create entity type property filter', () => {
        const entityType = TransactionType.ADDRESS_ALIAS;
        const entityTypePropertyFilter = AccountRestrictionModification.createForEntityType(
            PropertyModificationType.Add,
            entityType,
        );
        expect(entityTypePropertyFilter.modificationType).to.be.equal(PropertyModificationType.Add);
        expect(entityTypePropertyFilter.value).to.be.equal(entityType);
    });

    describe('size', () => {
        it('should return 148 for AccountAddressRestrictionModificationTransaction transaction byte size with 1 modification', () => {
            const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
            const addressPropertyFilter = AccountRestrictionModification.createForAddress(
                PropertyModificationType.Add,
                address,
            );
            const addressPropertyTransaction = AccountRestrictionTransaction.createAddressPropertyModificationTransaction(
                Deadline.create(),
                PropertyType.AllowAddress,
                [addressPropertyFilter],
                NetworkType.MIJIN_TEST,
            );

            expect(addressPropertyTransaction.size).to.be.equal(148);
        });

        it('should return 131 for AccountMosaicRestrictionModificationTransaction transaction byte size with 1 modification', () => {
            const mosaicId = new MosaicId([2262289484, 3405110546]);
            const mosaicPropertyFilter = AccountRestrictionModification.createForMosaic(
                PropertyModificationType.Add,
                mosaicId,
            );
            const mosaicPropertyTransaction = AccountRestrictionTransaction.createMosaicPropertyModificationTransaction(
                Deadline.create(),
                PropertyType.AllowMosaic,
                [mosaicPropertyFilter],
                NetworkType.MIJIN_TEST,
            );
            expect(mosaicPropertyTransaction.size).to.be.equal(131);
        });

        it('should return 125 for AccountOperationRestrictionModificationTransaction transaction byte size with 1 modification', () => {
            const entityType = TransactionType.ADDRESS_ALIAS;
            const entityTypePropertyFilter = AccountRestrictionModification.createForEntityType(
                PropertyModificationType.Add,
                entityType,
            );
            const entityTypePropertyTransaction = AccountRestrictionTransaction.createEntityTypePropertyModificationTransaction(
                Deadline.create(),
                PropertyType.AllowTransaction,
                [entityTypePropertyFilter],
                NetworkType.MIJIN_TEST,
            );
            expect(entityTypePropertyTransaction.size).to.be.equal(125);
        });
    });

    it('should default maxFee field be set to 0', () => {
        const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressPropertyFilter = AccountRestrictionModification.createForAddress(
            PropertyModificationType.Add,
            address,
        );
        const addressPropertyTransaction = AccountRestrictionTransaction.createAddressPropertyModificationTransaction(
            Deadline.create(),
            PropertyType.AllowAddress,
            [addressPropertyFilter],
            NetworkType.MIJIN_TEST,
        );

        expect(addressPropertyTransaction.maxFee.higher).to.be.equal(0);
        expect(addressPropertyTransaction.maxFee.lower).to.be.equal(0);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressPropertyFilter = AccountRestrictionModification.createForAddress(
            PropertyModificationType.Add,
            address,
        );
        const addressPropertyTransaction = AccountRestrictionTransaction.createAddressPropertyModificationTransaction(
            Deadline.create(),
            PropertyType.AllowAddress,
            [addressPropertyFilter],
            NetworkType.MIJIN_TEST,
            new UInt64([1, 0]),
        );

        expect(addressPropertyTransaction.maxFee.higher).to.be.equal(0);
        expect(addressPropertyTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should create address property transaction', () => {

        const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressPropertyFilter = AccountRestrictionModification.createForAddress(
            PropertyModificationType.Add,
            address,
        );
        const addressPropertyTransaction = AccountRestrictionTransaction.createAddressPropertyModificationTransaction(
            Deadline.create(),
            PropertyType.AllowAddress,
            [addressPropertyFilter],
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = addressPropertyTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            240,
            signedTransaction.payload.length,
        )).to.be.equal('0101009050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142');

    });

    it('should throw exception when create address property transaction with wrong type', () => {

        const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressPropertyFilter = AccountRestrictionModification.createForAddress(
            PropertyModificationType.Add,
            address,
        );

        expect(() => {
            AccountRestrictionTransaction.createAddressPropertyModificationTransaction(
                Deadline.create(),
                PropertyType.Sentinel,
                [addressPropertyFilter],
                NetworkType.MIJIN_TEST,
            );
         }).to.throw(Error, 'Property type is not allowed.');

    });

    it('should create mosaic property transaction', () => {

        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicPropertyFilter = AccountRestrictionModification.createForMosaic(
            PropertyModificationType.Add,
            mosaicId,
        );
        const mosaicPropertyTransaction = AccountRestrictionTransaction.createMosaicPropertyModificationTransaction(
            Deadline.create(),
            PropertyType.AllowMosaic,
            [mosaicPropertyFilter],
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = mosaicPropertyTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            240,
            signedTransaction.payload.length,
        )).to.be.equal('0201004CCCD78612DDF5CA');

    });

    it('should throw exception when create mosaic property transaction with wrong type', () => {

        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicPropertyFilter = AccountRestrictionModification.createForMosaic(
            PropertyModificationType.Add,
            mosaicId,
        );

        expect(() => {
            AccountRestrictionTransaction.createMosaicPropertyModificationTransaction(
                Deadline.create(),
                PropertyType.Sentinel,
                [mosaicPropertyFilter],
                NetworkType.MIJIN_TEST,
            );
         }).to.throw(Error, 'Property type is not allowed.');

    });

    it('should create entity type property transaction', () => {

        const entityType = TransactionType.ADDRESS_ALIAS;
        const entityTypePropertyFilter = AccountRestrictionModification.createForEntityType(
            PropertyModificationType.Add,
            entityType,
        );
        const entityTypePropertyTransaction = AccountRestrictionTransaction.createEntityTypePropertyModificationTransaction(
            Deadline.create(),
            PropertyType.AllowTransaction,
            [entityTypePropertyFilter],
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = entityTypePropertyTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            240,
            signedTransaction.payload.length,
        )).to.be.equal('0401004E42');

    });
});
