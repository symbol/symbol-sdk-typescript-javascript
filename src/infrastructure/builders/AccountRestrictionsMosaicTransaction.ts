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
 * @module transactions/AccountRestrictionsMosaicTransaction
 */
import { TransactionType } from '../../model/transaction/TransactionType';
import AccountRestrictionsMosaicTransactionBufferPackage from '../buffers/AccountRestrictionsMosaicTransactionBuffer';
import AccountRestrictionsMosaicModificationTransactionSchema from '../schemas/AccountRestrictionsMosaicModificationTransactionSchema';
import { VerifiableTransaction } from './VerifiableTransaction';

const {
    AccountRestrictionsMosaicTransactionBuffer,
    RestrictionMosaicModificationBuffer,
} = AccountRestrictionsMosaicTransactionBufferPackage.Buffers;

import {flatbuffers} from 'flatbuffers';

export default class AccountRestrictionsMosaicTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, AccountRestrictionsMosaicModificationTransactionSchema);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class Builder {
    maxFee: any;
    version: any;
    type: any;
    deadline: any;
    restrictionType: any;
    modifications: any;
    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType.MODIFY_ACCOUNT_RESTRICTION_MOSAIC;
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

    addRestrictionType(restrictionType) {
        this.restrictionType = restrictionType;
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
            const addressModificationVector = RestrictionMosaicModificationBuffer
                .createValueVector(builder, modification.value);
            RestrictionMosaicModificationBuffer.startRestrictionMosaicModificationBuffer(builder);
            RestrictionMosaicModificationBuffer.addModificationType(builder, modification.type);
            RestrictionMosaicModificationBuffer.addValue(builder, addressModificationVector);
            modificationsArray.push(RestrictionMosaicModificationBuffer.endRestrictionMosaicModificationBuffer(builder));
        });

        // Create vectors
        const signatureVector = AccountRestrictionsMosaicTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = AccountRestrictionsMosaicTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = AccountRestrictionsMosaicTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = AccountRestrictionsMosaicTransactionBuffer
            .createFeeVector(builder, this.maxFee);
        const modificationVector = AccountRestrictionsMosaicTransactionBuffer
            .createModificationsVector(builder, modificationsArray);

        AccountRestrictionsMosaicTransactionBuffer.startAccountRestrictionsMosaicTransactionBuffer(builder);
        AccountRestrictionsMosaicTransactionBuffer.addSize(builder, 122 + (9 * this.modifications.length));
        AccountRestrictionsMosaicTransactionBuffer.addSignature(builder, signatureVector);
        AccountRestrictionsMosaicTransactionBuffer.addSigner(builder, signerVector);
        AccountRestrictionsMosaicTransactionBuffer.addVersion(builder, this.version);
        AccountRestrictionsMosaicTransactionBuffer.addType(builder, this.type);
        AccountRestrictionsMosaicTransactionBuffer.addFee(builder, feeVector);
        AccountRestrictionsMosaicTransactionBuffer.addDeadline(builder, deadlineVector);
        AccountRestrictionsMosaicTransactionBuffer.addRestrictionType(builder, this.restrictionType);
        AccountRestrictionsMosaicTransactionBuffer.addModificationCount(builder, this.modifications.length);
        AccountRestrictionsMosaicTransactionBuffer.addModifications(builder, modificationVector);

        // Calculate size
        const codedAccountRestrictionsMosaic = AccountRestrictionsMosaicTransactionBuffer.endAccountRestrictionsMosaicTransactionBuffer(builder);
        builder.finish(codedAccountRestrictionsMosaic);

        const bytes = builder.asUint8Array();

        return new AccountRestrictionsMosaicTransaction(bytes);
    }
}
