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
 * @module transactions/MosaicAddressRestrictionTransaction
 */
import { TransactionType } from '../../model/transaction/TransactionType';
import MosaicAddressRestrictionTransactionBufferPackage from '../buffers/MosaicAddressRestrictionTransactionBuffer';
import MosaicAddressRestrictionTransactionSchema from '../schemas/MosaicAddressRestrictionTransactionSchema';
import { VerifiableTransaction } from './VerifiableTransaction';

import {flatbuffers} from 'flatbuffers';
import { RawAddress } from '../../core/format';

const {
    MosaicAddressRestrictionTransactionBuffer,
} = MosaicAddressRestrictionTransactionBufferPackage.Buffers;

export default class MosaicAddressRestrictionTransaction extends VerifiableTransaction {
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
    restrictionKey: any;
    targetAddress: any;
    previousRestrictionValue: any;
    newRestrictionValue: any;
    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType.MOSAIC_ADDRESS_RESTRICTION;
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

    addTargetAddress(targetAddress) {
        this.targetAddress = RawAddress.stringToAddress(targetAddress);
        return this;
    }

    addPreviousRestrictionValue(previousRestrictionValue) {
        this.previousRestrictionValue = previousRestrictionValue;
        return this;
    }

    addNewRestrictionValue(newRestrictionValue) {
        this.newRestrictionValue = newRestrictionValue;
        return this;
    }

    addMosaicId(mosaicId) {
        this.mosaicId = mosaicId;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);

        // Create vectors
        const signatureVector = MosaicAddressRestrictionTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = MosaicAddressRestrictionTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = MosaicAddressRestrictionTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = MosaicAddressRestrictionTransactionBuffer
            .createFeeVector(builder, this.maxFee);
        const mosaicIdVector = MosaicAddressRestrictionTransactionBuffer
            .createMosaicIdVector(builder, this.mosaicId);
        const restrictionKeyVector = MosaicAddressRestrictionTransactionBuffer
            .createRestrictionKeyVector(builder, this.restrictionKey);
        const targetAddressVector = MosaicAddressRestrictionTransactionBuffer
            .createTargetAddressVector(builder, this.targetAddress);
        const previousRestrictionValueVector = MosaicAddressRestrictionTransactionBuffer
            .createPreviousRestrictionValueVector(builder, this.previousRestrictionValue);
        const newRestrictionValueVector = MosaicAddressRestrictionTransactionBuffer
            .createNewRestrictionValueVector(builder, this.newRestrictionValue);

        MosaicAddressRestrictionTransactionBuffer.startMosaicAddressRestrictionTransactionBuffer(builder);
        MosaicAddressRestrictionTransactionBuffer.addSize(builder, 169);
        MosaicAddressRestrictionTransactionBuffer.addSignature(builder, signatureVector);
        MosaicAddressRestrictionTransactionBuffer.addSigner(builder, signerVector);
        MosaicAddressRestrictionTransactionBuffer.addVersion(builder, this.version);
        MosaicAddressRestrictionTransactionBuffer.addType(builder, this.type);
        MosaicAddressRestrictionTransactionBuffer.addFee(builder, feeVector);
        MosaicAddressRestrictionTransactionBuffer.addDeadline(builder, deadlineVector);
        MosaicAddressRestrictionTransactionBuffer.addMosaicId(builder, mosaicIdVector);
        MosaicAddressRestrictionTransactionBuffer.addRestrictionKey(builder, restrictionKeyVector);
        MosaicAddressRestrictionTransactionBuffer.addTargetAddress(builder, targetAddressVector);
        MosaicAddressRestrictionTransactionBuffer.addPreviousRestrictionValue(builder, previousRestrictionValueVector);
        MosaicAddressRestrictionTransactionBuffer.addNewRestrictionValue(builder, newRestrictionValueVector);

        // Calculate size

        const codedMosaicAddressRestriction =
            MosaicAddressRestrictionTransactionBuffer.endMosaicAddressRestrictionTransactionBuffer(builder);
        builder.finish(codedMosaicAddressRestriction);

        const bytes = builder.asUint8Array();

        const schema = MosaicAddressRestrictionTransactionSchema;
        return new MosaicAddressRestrictionTransaction(bytes, schema);
    }
}
