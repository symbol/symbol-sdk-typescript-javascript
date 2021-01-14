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

import { expect } from 'chai';
import { Convert } from '../../../src/core/format';
import { Account } from '../../../src/model/account/Account';
import { Address } from '../../../src/model/account/Address';
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import { NamespaceId } from '../../../src/model/namespace/NamespaceId';
import { NetworkType } from '../../../src/model/network/NetworkType';
import { AccountRestrictionModificationAction } from '../../../src/model/restriction/AccountRestrictionModificationAction';
import { AddressRestrictionFlag } from '../../../src/model/restriction/AddressRestrictionFlag';
import { MosaicRestrictionFlag } from '../../../src/model/restriction/MosaicRestrictionFlag';
import { OperationRestrictionFlag } from '../../../src/model/restriction/OperationRestrictionFlag';
import { AccountRestrictionModification } from '../../../src/model/transaction/AccountRestrictionModification';
import { AccountRestrictionTransaction } from '../../../src/model/transaction/AccountRestrictionTransaction';
import { Deadline } from '../../../src/model/transaction/Deadline';
import { TransactionType } from '../../../src/model/transaction/TransactionType';
import { UInt64 } from '../../../src/model/UInt64';
import { TestingAccount } from '../../conf/conf.spec';

describe('AccountRestrictionTransaction', () => {
    let account: Account;
    const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';
    const epochAdjustment = 1573430400;
    before(() => {
        account = TestingAccount;
    });
    it('should create address restriction filter', () => {
        const address = Address.createFromRawAddress('VATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA35C4KNQ');
        const addressRestrictionFilter = AccountRestrictionModification.createForAddress(AccountRestrictionModificationAction.Add, address);
        expect(addressRestrictionFilter.modificationAction).to.be.equal(AccountRestrictionModificationAction.Add);
        expect(addressRestrictionFilter.value).to.be.equal(address.plain());
    });

    it('should create mosaic restriction filter', () => {
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicRestrictionFilter = AccountRestrictionModification.createForMosaic(AccountRestrictionModificationAction.Add, mosaicId);
        expect(mosaicRestrictionFilter.modificationAction).to.be.equal(AccountRestrictionModificationAction.Add);
        expect(mosaicRestrictionFilter.value[0]).to.be.equal(mosaicId.id.lower);
        expect(mosaicRestrictionFilter.value[1]).to.be.equal(mosaicId.id.higher);
    });

    it('should create operation restriction filter', () => {
        const operation = TransactionType.ADDRESS_ALIAS;
        const operationRestrictionFilter = AccountRestrictionModification.createForOperation(
            AccountRestrictionModificationAction.Add,
            operation,
        );
        expect(operationRestrictionFilter.modificationAction).to.be.equal(AccountRestrictionModificationAction.Add);
        expect(operationRestrictionFilter.value).to.be.equal(operation);
    });

    describe('size', () => {
        it('should return 160 for AccountAddressRestrictionTransaction transaction byte size with 1 modification', () => {
            const address = Address.createFromRawAddress('VATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA35C4KNQ');
            const addressRestrictionTransaction = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
                Deadline.create(epochAdjustment),
                AddressRestrictionFlag.AllowIncomingAddress,
                [address],
                [],
                NetworkType.PRIVATE_TEST,
            );

            expect(Convert.hexToUint8(addressRestrictionTransaction.serialize()).length).to.be.equal(addressRestrictionTransaction.size);
            expect(addressRestrictionTransaction.size).to.be.equal(160);
        });

        it('should return 144 for AccountMosaicRestrictionTransaction transaction byte size with 1 modification', () => {
            const mosaicId = new MosaicId([2262289484, 3405110546]);
            const mosaicRestrictionTransaction = AccountRestrictionTransaction.createMosaicRestrictionModificationTransaction(
                Deadline.create(epochAdjustment),
                MosaicRestrictionFlag.AllowMosaic,
                [mosaicId],
                [],
                NetworkType.PRIVATE_TEST,
            );
            expect(mosaicRestrictionTransaction.size).to.be.equal(144);
        });
        it('should set payload size', () => {
            const mosaicId = new MosaicId([2262289484, 3405110546]);
            const mosaicRestrictionTransaction = AccountRestrictionTransaction.createMosaicRestrictionModificationTransaction(
                Deadline.create(epochAdjustment),
                MosaicRestrictionFlag.AllowMosaic,
                [mosaicId],
                [],
                NetworkType.PRIVATE_TEST,
            );
            expect(mosaicRestrictionTransaction.setPayloadSize(10).size).to.be.equal(10);
        });
    });

    it('should return 138 for AccountOperationRestrictionTransaction transaction byte size with 1 modification', () => {
        const operation = TransactionType.ADDRESS_ALIAS;
        const operationRestrictionTransaction = AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(
            Deadline.create(epochAdjustment),
            OperationRestrictionFlag.AllowOutgoingTransactionType,
            [operation],
            [],
            NetworkType.PRIVATE_TEST,
        );
        expect(operationRestrictionTransaction.size).to.be.equal(138);
    });

    it('should default maxFee field be set to 0', () => {
        const address = Address.createFromRawAddress('VATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA35C4KNQ');
        const addressRestrictionTransaction = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
            Deadline.create(epochAdjustment),
            AddressRestrictionFlag.AllowIncomingAddress,
            [address],
            [],
            NetworkType.PRIVATE_TEST,
        );

        expect(addressRestrictionTransaction.maxFee.higher).to.be.equal(0);
        expect(addressRestrictionTransaction.maxFee.lower).to.be.equal(0);
    });

    it('should filled maxFee override transaction maxFee', () => {
        const address = Address.createFromRawAddress('VATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA35C4KNQ');
        const addressRestrictionTransaction = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
            Deadline.create(epochAdjustment),
            AddressRestrictionFlag.AllowIncomingAddress,
            [address],
            [],
            NetworkType.PRIVATE_TEST,
            new UInt64([1, 0]),
        );

        expect(addressRestrictionTransaction.maxFee.higher).to.be.equal(0);
        expect(addressRestrictionTransaction.maxFee.lower).to.be.equal(1);
    });

    it('should create allow incmoing address restriction transaction', () => {
        const address = Address.createFromRawAddress('VATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA35C4KNQ');
        const addressRestrictionTransaction = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
            Deadline.create(epochAdjustment),
            AddressRestrictionFlag.AllowIncomingAddress,
            [address],
            [],
            NetworkType.PRIVATE_TEST,
        );

        const signedTransaction = addressRestrictionTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '0100010000000000A826D27E1D0A26CA4E316F901E23E55C8711DB20DF45C536',
        );
    });

    it('should create mosaic restriction transaction', () => {
        const mosaicId = new MosaicId([2262289484, 3405110546]);
        const mosaicRestrictionTransaction = AccountRestrictionTransaction.createMosaicRestrictionModificationTransaction(
            Deadline.create(epochAdjustment),
            MosaicRestrictionFlag.AllowMosaic,
            [mosaicId],
            [],
            NetworkType.PRIVATE_TEST,
        );

        const signedTransaction = mosaicRestrictionTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal('02000100000000004CCCD78612DDF5CA');
    });

    it('should create operation restriction transaction', () => {
        const operation = TransactionType.ADDRESS_ALIAS;
        const operationRestrictionTransaction = AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(
            Deadline.create(epochAdjustment),
            OperationRestrictionFlag.AllowOutgoingTransactionType,
            [operation],
            [],
            NetworkType.PRIVATE_TEST,
        );

        const signedTransaction = operationRestrictionTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal('04400100000000004E42');
    });

    it('should create outgoing address restriction transaction', () => {
        const address = Address.createFromRawAddress('VATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA35C4KNQ');
        let addressRestrictionTransaction = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
            Deadline.create(epochAdjustment),
            AddressRestrictionFlag.AllowOutgoingAddress,
            [address],
            [],
            NetworkType.PRIVATE_TEST,
        );

        let signedTransaction = addressRestrictionTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '0140010000000000A826D27E1D0A26CA4E316F901E23E55C8711DB20DF45C536',
        );

        addressRestrictionTransaction = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
            Deadline.create(epochAdjustment),
            AddressRestrictionFlag.BlockOutgoingAddress,
            [address],
            [],
            NetworkType.PRIVATE_TEST,
        );

        signedTransaction = addressRestrictionTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal(
            '01C0010000000000A826D27E1D0A26CA4E316F901E23E55C8711DB20DF45C536',
        );
    });

    it('should create outgoing operation restriction transaction', () => {
        const operation = TransactionType.ADDRESS_ALIAS;
        let operationRestrictionTransaction = AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(
            Deadline.create(epochAdjustment),
            OperationRestrictionFlag.AllowOutgoingTransactionType,
            [operation],
            [],
            NetworkType.PRIVATE_TEST,
        );

        let signedTransaction = operationRestrictionTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal('04400100000000004E42');

        operationRestrictionTransaction = AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(
            Deadline.create(epochAdjustment),
            OperationRestrictionFlag.BlockOutgoingTransactionType,
            [operation],
            [],
            NetworkType.PRIVATE_TEST,
        );

        signedTransaction = operationRestrictionTransaction.signWith(account, generationHash);

        expect(signedTransaction.payload.substring(256, signedTransaction.payload.length)).to.be.equal('04C00100000000004E42');
    });

    it('Notify Account', () => {
        const address = Address.createFromRawAddress('VATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA35C4KNQ');
        const tx = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
            Deadline.create(epochAdjustment),
            AddressRestrictionFlag.AllowOutgoingAddress,
            [address],
            [],
            NetworkType.PRIVATE_TEST,
        );
        let canNotify = tx.shouldNotifyAccount(address, []);
        expect(canNotify).to.be.true;

        canNotify = tx.shouldNotifyAccount(Address.createFromRawAddress('VDR6EW2WBHJQDYMNGFX2UBZHMMZC5PGL22BHJVI'), []);
        expect(canNotify).to.be.false;

        Object.assign(tx, { signer: account.publicAccount });
        expect(tx.shouldNotifyAccount(account.address, [])).to.be.true;

        const txDeletion = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
            Deadline.create(epochAdjustment),
            AddressRestrictionFlag.AllowOutgoingAddress,
            [],
            [address],
            NetworkType.PRIVATE_TEST,
        );
        let canNotifyDeletion = txDeletion.shouldNotifyAccount(address, []);
        expect(canNotifyDeletion).to.be.true;

        canNotifyDeletion = txDeletion.shouldNotifyAccount(Address.createFromRawAddress('VDR6EW2WBHJQDYMNGFX2UBZHMMZC5PGL22BHJVI'), []);
        expect(canNotifyDeletion).to.be.false;

        Object.assign(txDeletion, { signer: account.publicAccount });
        expect(txDeletion.shouldNotifyAccount(account.address, [])).to.be.true;
    });

    it('Notify Account with alias', () => {
        const alias = new NamespaceId('test');
        const wrongAlias = new NamespaceId('wrong');
        const tx = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
            Deadline.create(epochAdjustment),
            AddressRestrictionFlag.AllowOutgoingAddress,
            [alias],
            [],
            NetworkType.PRIVATE_TEST,
        );
        let canNotify = tx.shouldNotifyAccount(account.address, [alias]);
        expect(canNotify).to.be.true;

        canNotify = tx.shouldNotifyAccount(Address.createFromRawAddress('VATNE7Q5BITMUTRRN6IB4I7FLSDRDWZA35C4KNQ'), [wrongAlias]);
        expect(canNotify).to.be.false;

        Object.assign(tx, { signer: account.publicAccount });
        expect(tx.shouldNotifyAccount(account.address, [])).to.be.true;

        const txDeletion = AccountRestrictionTransaction.createAddressRestrictionModificationTransaction(
            Deadline.create(epochAdjustment),
            AddressRestrictionFlag.AllowOutgoingAddress,
            [],
            [alias],
            NetworkType.PRIVATE_TEST,
        );
        let canNotifyDeletion = txDeletion.shouldNotifyAccount(account.address, [alias]);
        expect(canNotifyDeletion).to.be.true;

        canNotifyDeletion = txDeletion.shouldNotifyAccount(Address.createFromRawAddress('VDR6EW2WBHJQDYMNGFX2UBZHMMZC5PGL22BHJVI'), [
            wrongAlias,
        ]);
        expect(canNotifyDeletion).to.be.false;

        Object.assign(txDeletion, { signer: account.publicAccount });
        expect(txDeletion.shouldNotifyAccount(account.address, [])).to.be.true;
    });
});
