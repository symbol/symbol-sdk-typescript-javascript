/*
 * Copyright 2018 NEM
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
 * @module transactions/HashLockTransaction
 */
import * as HashLockTransactionBufferPackage from '../buffers/HashLockTransactionBuffer';
import * as convert from '../format/Convert';
import HashLockTransactionSchema from '../schema/HashLockTransactionSchema';
import { VerifiableTransaction } from './VerifiableTransaction';

const {
    flatbuffers,
} = require('flatbuffers');

const {
    HashLockTransactionBuffer,
} = HashLockTransactionBufferPackage.default.Buffers;

export default class HashLockTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, HashLockTransactionSchema);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class Builder {
    fee: any;
    version: any;
    type: any;
    deadline: any;
    mosaicId: any;
    mosaicAmount: any;
    duration: any;
    hash: any;
    constructor() {
        this.fee = [0, 0];
        this.version = 36867;
        this.type = 0x414C;
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

    addMosaicAmount(mosaicAmount) {
        this.mosaicAmount = mosaicAmount;
        return this;
    }

    addDuration(duration) {
        this.duration = duration;
        return this;
    }

    addHash(hash) {
        this.hash = hash;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);

        // Create vectors
        const signatureVector = HashLockTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = HashLockTransactionBuffer.createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = HashLockTransactionBuffer.createDeadlineVector(builder, this.deadline);
        const feeVector = HashLockTransactionBuffer.createFeeVector(builder, this.fee);
        const mosaicIdVector = HashLockTransactionBuffer.createMosaicIdVector(builder, this.mosaicId);
        const mosaicAmountVector = HashLockTransactionBuffer.createMosaicAmountVector(builder, this.mosaicAmount);
        const durationVector = HashLockTransactionBuffer.createDurationVector(builder, this.duration);
        const byteHash = convert.hexToUint8(this.hash);
        const hashVector = HashLockTransactionBuffer.createHashVector(builder, byteHash);

        HashLockTransactionBuffer.startHashLockTransactionBuffer(builder);
        HashLockTransactionBuffer.addSize(builder, 176);
        HashLockTransactionBuffer.addSignature(builder, signatureVector);
        HashLockTransactionBuffer.addSigner(builder, signerVector);
        HashLockTransactionBuffer.addVersion(builder, this.version);
        HashLockTransactionBuffer.addType(builder, this.type);
        HashLockTransactionBuffer.addFee(builder, feeVector);
        HashLockTransactionBuffer.addDeadline(builder, deadlineVector);
        HashLockTransactionBuffer.addMosaicId(builder, mosaicIdVector);
        HashLockTransactionBuffer.addMosaicAmount(builder, mosaicAmountVector);
        HashLockTransactionBuffer.addDuration(builder, durationVector);
        HashLockTransactionBuffer.addHash(builder, hashVector);

        const codedHashLock = HashLockTransactionBuffer.endHashLockTransactionBuffer(builder);
        builder.finish(codedHashLock);

        const bytes = builder.asUint8Array();
        return new HashLockTransaction(bytes);
    }
}
