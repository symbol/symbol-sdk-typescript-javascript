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
 * @module transactions/MosaicGlobalRestrictionTransaction
 */
import { TransactionType } from '../../model/transaction/TransactionType';
import MosaicGlobalRestrictionTransactionBufferPackage from '../buffers/MosaicGlobalRestrictionTransactionBuffer';
import MosaicGlobalRestrictionTransactionSchema from '../schemas/MosaicGlobalRestrictionTransactionSchema';
import { VerifiableTransaction } from './VerifiableTransaction';

import {flatbuffers} from 'flatbuffers';

const {
    MosaicGlobalRestrictionTransactionBuffer,
} = MosaicGlobalRestrictionTransactionBufferPackage.Buffers;

export default class MosaicGlobalRestrictionTransaction extends VerifiableTransaction {
    constructor(bytes, schema) {
        super(bytes, schema);
    }
}
// tslint:disable-next-line: max-classes-per-file
export class Builder {
    maxFee: any;
    version: any;
    type: any;
    deadline: any;
    mosaicId: any;
    referenceMosaicId: any;
    restrictionKey: any;
    previousRestrictionValue: any;
    previousRestrictionType: any;
    newRestrictionValue: any;
    newRestrictionType: any;
    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType.MOSAIC_GLOBAL_RESTRICTION;
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

    addRestrictionKey(restrictionKey) {
        this.restrictionKey = restrictionKey;
        return this;
    }

    addPreviousRestrictionValue(previousRestrictionValue) {
        this.previousRestrictionValue = previousRestrictionValue;
        return this;
    }

    addPreviousRestrictionType(previousRestrictionType) {
        this.previousRestrictionType = previousRestrictionType;
        return this;
    }

    addNewRestrictionValue(newRestrictionValue) {
        this.newRestrictionValue = newRestrictionValue;
        return this;
    }

    addNewRestrictionType(newRestrictionType) {
        this.newRestrictionType = newRestrictionType;
        return this;
    }

    addMosaicId(mosaicId) {
        this.mosaicId = mosaicId;
        return this;
    }

    addReferenceMosaicId(referenceMosaicId) {
        this.referenceMosaicId = referenceMosaicId;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);

        // Create vectors
        const signatureVector = MosaicGlobalRestrictionTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = MosaicGlobalRestrictionTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = MosaicGlobalRestrictionTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = MosaicGlobalRestrictionTransactionBuffer
            .createFeeVector(builder, this.maxFee);
        const mosaicIdVector = MosaicGlobalRestrictionTransactionBuffer
            .createMosaicIdVector(builder, this.mosaicId);
        const referenceMosaicIdVector = MosaicGlobalRestrictionTransactionBuffer
            .createReferenceMosaicIdVector(builder, this.referenceMosaicId);
        const restrictionKeyVector = MosaicGlobalRestrictionTransactionBuffer
            .createRestrictionKeyVector(builder, this.restrictionKey);
        const previousRestrictionValueVector = MosaicGlobalRestrictionTransactionBuffer
            .createPreviousRestrictionValueVector(builder, this.previousRestrictionValue);
        const newRestrictionValueVector = MosaicGlobalRestrictionTransactionBuffer
            .createNewRestrictionValueVector(builder, this.newRestrictionValue);

        MosaicGlobalRestrictionTransactionBuffer.startMosaicGlobalRestrictionTransactionBuffer(builder);
        MosaicGlobalRestrictionTransactionBuffer.addSize(builder, 162);
        MosaicGlobalRestrictionTransactionBuffer.addSignature(builder, signatureVector);
        MosaicGlobalRestrictionTransactionBuffer.addSigner(builder, signerVector);
        MosaicGlobalRestrictionTransactionBuffer.addVersion(builder, this.version);
        MosaicGlobalRestrictionTransactionBuffer.addType(builder, this.type);
        MosaicGlobalRestrictionTransactionBuffer.addFee(builder, feeVector);
        MosaicGlobalRestrictionTransactionBuffer.addDeadline(builder, deadlineVector);
        MosaicGlobalRestrictionTransactionBuffer.addMosaicId(builder, mosaicIdVector);
        MosaicGlobalRestrictionTransactionBuffer.addReferenceMosaicId(builder, referenceMosaicIdVector);
        MosaicGlobalRestrictionTransactionBuffer.addRestrictionKey(builder, restrictionKeyVector);
        MosaicGlobalRestrictionTransactionBuffer.addPreviousRestrictionValue(builder, previousRestrictionValueVector);
        MosaicGlobalRestrictionTransactionBuffer.addPreviousRestrictionType(builder, this.previousRestrictionType);
        MosaicGlobalRestrictionTransactionBuffer.addNewRestrictionValue(builder, newRestrictionValueVector);
        MosaicGlobalRestrictionTransactionBuffer.addNewRestrictionType(builder, this.newRestrictionType);

        // Calculate size

        const codedMosaicGlobalRestriction =
            MosaicGlobalRestrictionTransactionBuffer.endMosaicGlobalRestrictionTransactionBuffer(builder);
        builder.finish(codedMosaicGlobalRestriction);

        const bytes = builder.asUint8Array();

        const schema = MosaicGlobalRestrictionTransactionSchema;
        return new MosaicGlobalRestrictionTransaction(bytes, schema);
    }
}
