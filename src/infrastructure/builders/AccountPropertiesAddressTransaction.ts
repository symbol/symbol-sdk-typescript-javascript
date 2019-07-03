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

/**
 * @module transactions/AccountPropertiesAddressTransaction
 */
import { RawAddress as address } from '../../core/format';
import { TransactionType } from '../../model/transaction/TransactionType';
import AccountPropertiesAddressTransactionBufferPackage from '../buffers/AccountPropertiesAddressTransactionBuffer';
import AccountPropertiesAddressModificationTransactionSchema from '../schemas/AccountPropertiesAddressModificationTransactionSchema';
import { VerifiableTransaction } from './VerifiableTransaction';
const {
    AccountPropertiesAddressTransactionBuffer,
    PropertyAddressModificationBuffer,
} = AccountPropertiesAddressTransactionBufferPackage.Buffers;

import {flatbuffers} from 'flatbuffers';

export default class AccountPropertiesAddressTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, AccountPropertiesAddressModificationTransactionSchema);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class Builder {
    maxFee: any;
    version: any;
    type: any;
    deadline: any;
    propertyType: any;
    modifications: any;
    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType.MODIFY_ACCOUNT_PROPERTY_ADDRESS;
    }

    addFee(maxFee) {
        this.maxFee = maxFee;
        return this;
    }

    addVersion(version) {
        this.version = version;
        return this;
    }

    addType(type) {
        this.type = type;
        return this;
    }

    addDeadline(deadline) {
        this.deadline = deadline;
        return this;
    }

    addPropertyType(propertyType) {
        this.propertyType = propertyType;
        return this;
    }

    addModifications(modifications) {
        this.modifications = modifications;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);

        // Create modifications
        const modificationsArray: any = [];
        this.modifications.forEach((modification) => {
            const addressModificationVector = PropertyAddressModificationBuffer
                .createValueVector(builder, address.stringToAddress(modification.value));
            PropertyAddressModificationBuffer.startPropertyAddressModificationBuffer(builder);
            PropertyAddressModificationBuffer.addModificationType(builder, modification.type);
            PropertyAddressModificationBuffer.addValue(builder, addressModificationVector);
            modificationsArray.push(PropertyAddressModificationBuffer.endPropertyAddressModificationBuffer(builder));
        });

        // Create vectors
        const signatureVector = AccountPropertiesAddressTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = AccountPropertiesAddressTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = AccountPropertiesAddressTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = AccountPropertiesAddressTransactionBuffer
            .createFeeVector(builder, this.maxFee);
        const modificationVector = AccountPropertiesAddressTransactionBuffer
            .createModificationsVector(builder, modificationsArray);

        AccountPropertiesAddressTransactionBuffer.startAccountPropertiesAddressTransactionBuffer(builder);
        AccountPropertiesAddressTransactionBuffer.addSize(builder, 122 + (26 * this.modifications.length));
        AccountPropertiesAddressTransactionBuffer.addSignature(builder, signatureVector);
        AccountPropertiesAddressTransactionBuffer.addSigner(builder, signerVector);
        AccountPropertiesAddressTransactionBuffer.addVersion(builder, this.version);
        AccountPropertiesAddressTransactionBuffer.addType(builder, this.type);
        AccountPropertiesAddressTransactionBuffer.addFee(builder, feeVector);
        AccountPropertiesAddressTransactionBuffer.addDeadline(builder, deadlineVector);
        AccountPropertiesAddressTransactionBuffer.addPropertyType(builder, this.propertyType);
        AccountPropertiesAddressTransactionBuffer.addModificationCount(builder, this.modifications.length);
        AccountPropertiesAddressTransactionBuffer.addModifications(builder, modificationVector);

        // Calculate size
        const codedAccountPropertiesAddress =
            AccountPropertiesAddressTransactionBuffer.endAccountPropertiesAddressTransactionBuffer(builder);
        builder.finish(codedAccountPropertiesAddress);

        const bytes = builder.asUint8Array();

        return new AccountPropertiesAddressTransaction(bytes);
    }
}
