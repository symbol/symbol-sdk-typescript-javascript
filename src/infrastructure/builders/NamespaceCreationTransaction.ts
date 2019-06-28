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
 * @module transactions/NamespaceCreationTransaction
 */
import { Convert as convert } from '../../core/format';
import * as NamespaceCreationTransactionBufferPackage from '../buffers/NamespaceCreationTransactionBuffer';
import NamespaceCreationTransactionSchema from '../schemas/NamespaceCreationTransactionSchema';
import { VerifiableTransaction } from './VerifiableTransaction';

const {
    NamespaceCreationTransactionBuffer,
} = NamespaceCreationTransactionBufferPackage.default.Buffers;

const {
    flatbuffers,
} = require('flatbuffers');

export default class NamespaceCreationTransaction extends VerifiableTransaction {
    constructor(bytes) {
        super(bytes, NamespaceCreationTransactionSchema);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class Builder {
    fee: any;
    version: any;
    type: any;
    deadline: any;
    namespaceType: any;
    duration: any;
    parentId: any;
    namespaceId: any;
    namespaceName: any;
    constructor() {
        this.fee = [0, 0];
        this.version = 36865;
        this.type = 0x414e;
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

    addNamespaceType(namespaceType) {
        this.namespaceType = namespaceType;
        return this;
    }

    addDuration(duration) {
        this.duration = duration;
        return this;
    }

    addParentId(parentId) {
        this.parentId = parentId;
        return this;
    }

    addNamespaceId(namespaceId) {
        this.namespaceId = namespaceId;
        return this;
    }

    addNamespaceName(namespaceName) {
        this.namespaceName = namespaceName;
        return this;
    }

    build() {
        const builder = new flatbuffers.Builder(1);

        const namespaceNameLength = convert.utf8ToHex(this.namespaceName).length / 2;

        // create vectors
        const signatureVector = NamespaceCreationTransactionBuffer
            .createSignatureVector(builder, Array(...Array(64)).map(Number.prototype.valueOf, 0));
        const signerVector = NamespaceCreationTransactionBuffer
            .createSignerVector(builder, Array(...Array(32)).map(Number.prototype.valueOf, 0));
        const deadlineVector = NamespaceCreationTransactionBuffer
            .createDeadlineVector(builder, this.deadline);
        const feeVector = NamespaceCreationTransactionBuffer
            .createFeeVector(builder, this.fee);
        const parentIdVector = 1 === this.namespaceType ? this.parentId : this.duration;
        const durationParentIdVector = NamespaceCreationTransactionBuffer
            .createDurationParentIdVector(builder, parentIdVector);
        const namespaceIdVector = NamespaceCreationTransactionBuffer
            .createNamespaceIdVector(builder, this.namespaceId);

        const name = builder.createString(this.namespaceName);

        NamespaceCreationTransactionBuffer.startNamespaceCreationTransactionBuffer(builder);
        NamespaceCreationTransactionBuffer.addSize(builder, 138 + namespaceNameLength);
        NamespaceCreationTransactionBuffer.addSignature(builder, signatureVector);
        NamespaceCreationTransactionBuffer.addSigner(builder, signerVector);
        NamespaceCreationTransactionBuffer.addVersion(builder, this.version);
        NamespaceCreationTransactionBuffer.addType(builder, this.type);
        NamespaceCreationTransactionBuffer.addFee(builder, feeVector);
        NamespaceCreationTransactionBuffer.addDeadline(builder, deadlineVector);
        NamespaceCreationTransactionBuffer.addNamespaceType(builder, this.namespaceType);
        NamespaceCreationTransactionBuffer.addDurationParentId(builder, durationParentIdVector);
        NamespaceCreationTransactionBuffer.addNamespaceId(builder, namespaceIdVector);
        NamespaceCreationTransactionBuffer.addNamespaceNameSize(builder, namespaceNameLength);
        NamespaceCreationTransactionBuffer.addNamespaceName(builder, name);

        // Calculate size
        const codedNamespace = NamespaceCreationTransactionBuffer.endNamespaceCreationTransactionBuffer(builder);
        builder.finish(codedNamespace);

        const bytes = builder.asUint8Array();
        return new NamespaceCreationTransaction(bytes);
    }
}
