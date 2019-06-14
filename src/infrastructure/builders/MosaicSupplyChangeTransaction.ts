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
import MosaicSupplyChangeTransactionBufferPackage from '../buffers/MosaicSupplyChangeTransactionBuffer';
import MosaicSupplyChangeTransactionSchema from '../schemas/MosaicSupplyChangeTransactionSchema';
import { VerifiableTransaction } from './VerifiableTransaction';

const {
    MosaicSupplyChangeTransactionBuffer,
} = MosaicSupplyChangeTransactionBufferPackage.Buffers;

const {
    flatbuffers,
} = require('flatbuffers');

/**
 * @module transactions/MosaicSupplyChangeTransaction
 */
export default class MosaicSupplyChangeTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, MosaicSupplyChangeTransactionSchema);
    }
}
// tslint:disable-next-line:max-classes-per-file
export class Builder {
    fee: any;
    version: any;
    type: any;
    deadline: any;
    mosaicId: any;
    direction: any;
    delta: any;
    constructor() {
        this.fee = [0, 0];
        this.version = 36867;
        this.type = 0x424d;
    }

    addFee(fee) {
        this.fee = fee;
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

    addMosaicId(mosaicId) {
        this.mosaicId = mosaicId;
        return this;
    }

    addDirection(direction) {
        this.direction = direction;
        return this;
    }

    addDelta(delta) {
        this.delta = delta;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);

        // Create vectors
        const signatureVector = MosaicSupplyChangeTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = MosaicSupplyChangeTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = MosaicSupplyChangeTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = MosaicSupplyChangeTransactionBuffer
            .createFeeVector(builder, this.fee);
        const mosaicIdVector = MosaicSupplyChangeTransactionBuffer
            .createFeeVector(builder, this.mosaicId);
        const deltaVector = MosaicSupplyChangeTransactionBuffer
            .createFeeVector(builder, this.delta);

        MosaicSupplyChangeTransactionBuffer.startMosaicSupplyChangeTransactionBuffer(builder);
        MosaicSupplyChangeTransactionBuffer.addSize(builder, 137);
        MosaicSupplyChangeTransactionBuffer.addSignature(builder, signatureVector);
        MosaicSupplyChangeTransactionBuffer.addSigner(builder, signerVector);
        MosaicSupplyChangeTransactionBuffer.addVersion(builder, this.version);
        MosaicSupplyChangeTransactionBuffer.addType(builder, this.type);
        MosaicSupplyChangeTransactionBuffer.addFee(builder, feeVector);
        MosaicSupplyChangeTransactionBuffer.addDeadline(builder, deadlineVector);
        MosaicSupplyChangeTransactionBuffer.addMosaicId(builder, mosaicIdVector);
        MosaicSupplyChangeTransactionBuffer.addDirection(builder, this.direction);
        MosaicSupplyChangeTransactionBuffer.addDelta(builder, deltaVector);

        // Calculate size
        const codedMosaicChangeSupply = MosaicSupplyChangeTransactionBuffer.endMosaicSupplyChangeTransactionBuffer(builder);
        builder.finish(codedMosaicChangeSupply);

        const bytes = builder.asUint8Array();
        return new MosaicSupplyChangeTransaction(bytes);
    }
}
