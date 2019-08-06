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
import { TransactionType } from '../../model/transaction/TransactionType';
import MosaicAliasTransactionBufferPackage from '../buffers/MosaicAliasTransactionBuffer';
import MosaicAliasTransactionSchema from '../schemas/MosaicAliasTransactionSchema';
import { VerifiableTransaction } from './VerifiableTransaction';

const {
    MosaicAliasTransactionBuffer,
} = MosaicAliasTransactionBufferPackage.Buffers;

import {flatbuffers} from 'flatbuffers';

/**
 * @module transactions/MosaicAliasTransaction
 */
export default class MosaicAliasTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, MosaicAliasTransactionSchema);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class Builder {
    maxFee: any;
    version: any;
    type: any;
    deadline: any;
    mosaicId: any;
    aliasAction: any;
    namespaceId: any;
    constructor() {
        this.maxFee = [0, 0];
        this.type = TransactionType.MOSAIC_ALIAS;
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

    addAliasAction(aliasAction) {
        this.aliasAction = aliasAction;
        return this;
    }

    addNamespaceId(namespaceId) {
        this.namespaceId = namespaceId;
        return this;
    }

    addMosaicId(mosaicId) {
        this.mosaicId = mosaicId;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);

        // Create vectors
        const signatureVector = MosaicAliasTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = MosaicAliasTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = MosaicAliasTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = MosaicAliasTransactionBuffer
            .createFeeVector(builder, this.maxFee);
        const namespaceIdVector = MosaicAliasTransactionBuffer
            .createNamespaceIdVector(builder, this.namespaceId);
        const mosaicIdVector = MosaicAliasTransactionBuffer
            .createMosaicIdVector(builder, this.mosaicId);

        MosaicAliasTransactionBuffer.startMosaicAliasTransactionBuffer(builder);
        MosaicAliasTransactionBuffer.addSize(builder, 137);
        MosaicAliasTransactionBuffer.addSignature(builder, signatureVector);
        MosaicAliasTransactionBuffer.addSigner(builder, signerVector);
        MosaicAliasTransactionBuffer.addVersion(builder, this.version);
        MosaicAliasTransactionBuffer.addType(builder, this.type);
        MosaicAliasTransactionBuffer.addFee(builder, feeVector);
        MosaicAliasTransactionBuffer.addDeadline(builder, deadlineVector);
        MosaicAliasTransactionBuffer.addAliasAction(builder, this.aliasAction);
        MosaicAliasTransactionBuffer.addNamespaceId(builder, namespaceIdVector);
        MosaicAliasTransactionBuffer.addMosaicId(builder, mosaicIdVector);

        // Calculate size
        const codedMosaicChangeSupply = MosaicAliasTransactionBuffer.endMosaicAliasTransactionBuffer(builder);
        builder.finish(codedMosaicChangeSupply);

        const bytes = builder.asUint8Array();

        return new MosaicAliasTransaction(bytes);
    }
}
