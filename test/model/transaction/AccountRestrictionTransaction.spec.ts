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
import { AccountRestrictionType } from '../../../src/model/account/AccountRestrictionType';
import {Address} from '../../../src/model/account/Address';
import { RestrictionModificationType } from '../../../src/model/account/RestrictionModificationType';
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
    it('should create address restriction filter', () => {
        const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressRestrictionFilter = AccountRestrictionModification.createForAddress(
            RestrictionModificationType.Add,
            address,
        );
        expect(addressRestrictionFilter.modificationType).to.be.equal(RestrictionModificationType.Add);
        expect(addressRestrictionFilter.value).to.be.equal(address.plain());
    });

    it('should create mosaic restriction filter', () => {
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicRestrictionFilter = AccountRestrictionModification.createForMosaic(
            RestrictionModificationType.Add,
            mosaicId,
        );
        expect(mosaicRestrictionFilter.modificationType).to.be.equal(RestrictionModificationType.Add);
        expect(mosaicRestrictionFilter.value[0]).to.be.equal(mosaicId.id.lower);
        expect(mosaicRestrictionFilter.value[1]).to.be.equal(mosaicId.id.higher);
    });

    it('should create operation restriction filter', () => {
        const operation = TransactionType.ADDRESS_ALIAS;
        const operationRestrictionFilter = AccountRestrictionModification.createForOperation(
            RestrictionModificationType.Add,
            operation,
        );
        expect(operationRestrictionFilter.modificationType).to.be.equal(RestrictionModificationType.Add);
        expect(operationRestrictionFilter.value).to.be.equal(operation);
    });

    describe('size', () => {
        it('should return 148 for AccountAddressRestrictionTransaction transaction byte size with 1 modification', () => {
            const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
            const addressRestrictionFilter = AccountRestrictionModification.createForAddress(
                RestrictionModificationType.Add,
                address,
            );
            const addressRestrictionTransaction = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
                Deadline.create(),
                AccountRestrictionType.AllowIncomingAddress,
                [addressRestrictionFilter],
                NetworkType.MIJIN_TEST,
            );

            expect(addressRestrictionTransaction.size).to.be.equal(148);
        });

        it('should return 131 for AccountMosaicRestrictionTransaction transaction byte size with 1 modification', () => {
            const mosaicId = new MosaicId([2262289484, 3405110546]);
            const mosaicRestrictionFilter = AccountRestrictionModification.createForMosaic(
                RestrictionModificationType.Add,
                mosaicId,
            );
            const mosaicRestrictionTransaction = AccountRestrictionTransaction.createMosaicRestrictionModificationTransaction(
                Deadline.create(),
                AccountRestrictionType.AllowMosaic,
                [mosaicRestrictionFilter],
                NetworkType.MIJIN_TEST,
            );
            expect(mosaicRestrictionTransaction.size).to.be.equal(131);
        });

        it('should return 125 for AccountOperationRestrictionTransaction transaction byte size with 1 modification', () => {
            const operation = TransactionType.ADDRESS_ALIAS;
            const operationRestrictionFilter = AccountRestrictionModification.createForOperation(
                RestrictionModificationType.Add,
                operation,
            );
            const operationRestrictionTransaction = AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(
                Deadline.create(),
                AccountRestrictionType.AllowIncomingTransactionType,
                [operationRestrictionFilter],
                NetworkType.MIJIN_TEST,
            );
            expect(operationRestrictionTransaction.size).to.be.equal(125);
        });
    });

    it('should default maxFee field be set to 0', () => {
        const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressRestrictionFilter = AccountRestrictionModification.createForAddress(
            RestrictionModificationType.Add,
            address,
        );
        const addressRestrictionTransaction = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
            Deadline.create(),
            AccountRestrictionType.AllowIncomingAddress,
            [addressRestrictionFilter],
            NetworkType.MIJIN_TEST,
        );

        expect(addressRestrictionTransaction.maxFee.higher).to.be.equal(0);
        expect(addressRestrictionTransaction.maxFee.lower).to.be.equal(0);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressRestrictionFilter = AccountRestrictionModification.createForAddress(
            RestrictionModificationType.Add,
            address,
        );
        const addressRestrictionTransaction = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
            Deadline.create(),
            AccountRestrictionType.AllowIncomingAddress,
            [addressRestrictionFilter],
            NetworkType.MIJIN_TEST,
            new UInt64([1, 0]),
        );

        expect(addressRestrictionTransaction.maxFee.higher).to.be.equal(0);
        expect(addressRestrictionTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should create allow incmoing address restriction transaction', () => {

        const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressRestrictionFilter = AccountRestrictionModification.createForAddress(
            RestrictionModificationType.Add,
            address,
        );
        const addressRestrictionTransaction = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
            Deadline.create(),
            AccountRestrictionType.AllowIncomingAddress,
            [addressRestrictionFilter],
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = addressRestrictionTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            240,
            signedTransaction.payload.length,
        )).to.be.equal('0101009050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142');

    });

    it('should throw exception when create address restriction transaction with wrong type', () => {

        const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressRestrictionFilter = AccountRestrictionModification.createForAddress(
            RestrictionModificationType.Add,
            address,
        );

        const invalidType = [AccountRestrictionType.AllowIncomingTransactionType,
                             AccountRestrictionType.AllowMosaic,
                             AccountRestrictionType.AllowOutgoingTransactionType,
                             AccountRestrictionType.BlockIncomingTransactionType,
                             AccountRestrictionType.BlockMosaic,
                             AccountRestrictionType.BlockOutgoingTransactionType,
                             AccountRestrictionType.Sentinel,
                            ];
        invalidType.forEach((type) => {
            expect(() => {
                AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
                    Deadline.create(),
                    type,
                    [addressRestrictionFilter],
                    NetworkType.MIJIN_TEST,
                );
             }).to.throw(Error, 'Restriction type is not allowed.');
        });
    });

    it('should create mosaic restriction transaction', () => {

        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicRestrictionFilter = AccountRestrictionModification.createForMosaic(
            RestrictionModificationType.Add,
            mosaicId,
        );
        const mosaicRestrictionTransaction = AccountRestrictionTransaction.createMosaicRestrictionModificationTransaction(
            Deadline.create(),
            AccountRestrictionType.AllowMosaic,
            [mosaicRestrictionFilter],
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = mosaicRestrictionTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            240,
            signedTransaction.payload.length,
        )).to.be.equal('0201004CCCD78612DDF5CA');

    });

    it('should throw exception when create account mosaic restriction transaction with wrong type', () => {

        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicRestrictionFilter = AccountRestrictionModification.createForMosaic(
            RestrictionModificationType.Add,
            mosaicId,
        );

        const invalidType = [AccountRestrictionType.AllowIncomingTransactionType,
                             AccountRestrictionType.AllowIncomingAddress,
                             AccountRestrictionType.AllowOutgoingTransactionType,
                             AccountRestrictionType.BlockIncomingTransactionType,
                             AccountRestrictionType.AllowOutgoingAddress,
                             AccountRestrictionType.BlockOutgoingTransactionType,
                             AccountRestrictionType.BlockIncomingAddress,
                             AccountRestrictionType.BlockOutgoingAddress,
                             AccountRestrictionType.Sentinel,
                            ];
        invalidType.forEach((type) => {
            expect(() => {
                AccountRestrictionTransaction.createMosaicRestrictionModificationTransaction(
                    Deadline.create(),
                    type,
                    [mosaicRestrictionFilter],
                    NetworkType.MIJIN_TEST,
                );
             }).to.throw(Error, 'Restriction type is not allowed.');
        });
    });

    it('should create operation restriction transaction', () => {

        const operation = TransactionType.ADDRESS_ALIAS;
        const operationRestrictionFilter = AccountRestrictionModification.createForOperation(
            RestrictionModificationType.Add,
            operation,
        );
        const operationRestrictionTransaction = AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(
            Deadline.create(),
            AccountRestrictionType.AllowIncomingTransactionType,
            [operationRestrictionFilter],
            NetworkType.MIJIN_TEST,
        );

        const signedTransaction = operationRestrictionTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            240,
            signedTransaction.payload.length,
        )).to.be.equal('0401004E42');

    });

    it('should throw exception when create account operation restriction transaction with wrong type', () => {

        const operation = TransactionType.ADDRESS_ALIAS;
        const operationRestrictionFilter = AccountRestrictionModification.createForOperation(
            RestrictionModificationType.Add,
            operation,
        );

        const invalidType = [AccountRestrictionType.AllowIncomingAddress,
                             AccountRestrictionType.AllowMosaic,
                             AccountRestrictionType.BlockMosaic,
                             AccountRestrictionType.AllowOutgoingAddress,
                             AccountRestrictionType.BlockIncomingAddress,
                             AccountRestrictionType.BlockOutgoingAddress,
                             AccountRestrictionType.Sentinel,
                            ];
        invalidType.forEach((type) => {
            expect(() => {
                AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(
                    Deadline.create(),
                    type,
                    [operationRestrictionFilter],
                    NetworkType.MIJIN_TEST,
                );
             }).to.throw(Error, 'Restriction type is not allowed.');
        });
    });

    it('should create outgoing address restriction transaction', () => {

        const address = Address.createFromRawAddress('SBILTA367K2LX2FEXG5TFWAS7GEFYAGY7QLFBYKC');
        const addressRestrictionFilter = AccountRestrictionModification.createForAddress(
            RestrictionModificationType.Add,
            address,
        );
        let addressRestrictionTransaction = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
            Deadline.create(),
            AccountRestrictionType.AllowOutgoingAddress,
            [addressRestrictionFilter],
            NetworkType.MIJIN_TEST,
        );

        let signedTransaction = addressRestrictionTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            240,
            signedTransaction.payload.length,
        )).to.be.equal('4101009050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142');

        addressRestrictionTransaction = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
            Deadline.create(),
            AccountRestrictionType.BlockOutgoingAddress,
            [addressRestrictionFilter],
            NetworkType.MIJIN_TEST,
        );

        signedTransaction = addressRestrictionTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            240,
            signedTransaction.payload.length,
        )).to.be.equal('C101009050B9837EFAB4BBE8A4B9BB32D812F9885C00D8FC1650E142');

    });

    it('should create outgoing operation restriction transaction', () => {

        const operation = TransactionType.ADDRESS_ALIAS;
        const operationRestrictionFilter = AccountRestrictionModification.createForOperation(
            RestrictionModificationType.Add,
            operation,
        );
        let operationRestrictionTransaction = AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(
            Deadline.create(),
            AccountRestrictionType.AllowOutgoingTransactionType,
            [operationRestrictionFilter],
            NetworkType.MIJIN_TEST,
        );

        let signedTransaction = operationRestrictionTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            240,
            signedTransaction.payload.length,
        )).to.be.equal('4401004E42');

        operationRestrictionTransaction = AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(
            Deadline.create(),
            AccountRestrictionType.BlockOutgoingTransactionType,
            [operationRestrictionFilter],
            NetworkType.MIJIN_TEST,
        );

        signedTransaction = operationRestrictionTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(
            240,
            signedTransaction.payload.length,
        )).to.be.equal('C401004E42');

    });
});
