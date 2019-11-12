// tslint:disable: jsdoc-format
/**
*** Copyright (c) 2016-present,
*** Jaguar0625, gimre, BloodyRookie, Tech Bureau, Corp. All rights reserved.
***
*** This file is part of Catapult.
***
*** Catapult is free software: you can redistribute it and/or modify
*** it under the terms of the GNU Lesser General Public License as published by
*** the Free Software Foundation, either version 3 of the License, or
*** (at your option) any later version.
***
*** Catapult is distributed in the hope that it will be useful,
*** but WITHOUT ANY WARRANTY; without even the implied warranty of
*** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
*** GNU Lesser General Public License for more details.
***
*** You should have received a copy of the GNU Lesser General Public License
*** along with Catapult. If not, see <http://www.gnu.org/licenses/>.
**/

import { GeneratorUtils } from './GeneratorUtils';
import { KeyDto } from './KeyDto';

/** Binary layout for a multisig account modification transaction. */
export class MultisigAccountModificationTransactionBodyBuilder {
    /** Relative change of the minimal number of cosignatories required when removing an account. */
    minRemovalDelta: number;
    /** Relative change of the minimal number of cosignatories required when approving a transaction. */
    minApprovalDelta: number;
    /** Reserved padding to align publicKeyAdditions on 8-byte boundary. */
    multisigAccountModificationTransactionBody_Reserved1: number;
    /** Cosignatory public key additions. */
    publicKeyAdditions: KeyDto[];
    /** Cosignatory public key deletions. */
    publicKeyDeletions: KeyDto[];

    /**
     * Constructor.
     *
     * @param minRemovalDelta Relative change of the minimal number of cosignatories required when removing an account.
     * @param minApprovalDelta Relative change of the minimal number of cosignatories required when approving a transaction.
     * @param publicKeyAdditions Cosignatory public key additions.
     * @param publicKeyDeletions Cosignatory public key deletions.
     */
    // tslint:disable-next-line: max-line-length
    public constructor(minRemovalDelta: number,  minApprovalDelta: number,  publicKeyAdditions: KeyDto[],  publicKeyDeletions: KeyDto[]) {
        this.minRemovalDelta = minRemovalDelta;
        this.minApprovalDelta = minApprovalDelta;
        this.multisigAccountModificationTransactionBody_Reserved1 = 0;
        this.publicKeyAdditions = publicKeyAdditions;
        this.publicKeyDeletions = publicKeyDeletions;
    }

    /**
     * Creates an instance of MultisigAccountModificationTransactionBodyBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of MultisigAccountModificationTransactionBodyBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): MultisigAccountModificationTransactionBodyBuilder {
        const byteArray = Array.from(payload);
        const minRemovalDelta = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 1));
        byteArray.splice(0, 1);
        const minApprovalDelta = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 1));
        byteArray.splice(0, 1);
        const publicKeyAdditionsCount = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 1));
        byteArray.splice(0, 1);
        const publicKeyDeletionsCount = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 1));
        byteArray.splice(0, 1);
        // tslint:disable-next-line: max-line-length
        const multisigAccountModificationTransactionBody_Reserved1 = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 4));
        byteArray.splice(0, 4);
        const publicKeyAdditions: KeyDto[] = [];
        for (let i = 0; i < publicKeyAdditionsCount; i++) {
            const item = KeyDto.loadFromBinary(Uint8Array.from(byteArray));
            publicKeyAdditions.push(item);
            byteArray.splice(0, item.getSize());
        }
        const publicKeyDeletions: KeyDto[] = [];
        for (let i = 0; i < publicKeyDeletionsCount; i++) {
            const item = KeyDto.loadFromBinary(Uint8Array.from(byteArray));
            publicKeyDeletions.push(item);
            byteArray.splice(0, item.getSize());
        }
        // tslint:disable-next-line: max-line-length
        return new MultisigAccountModificationTransactionBodyBuilder(minRemovalDelta, minApprovalDelta, publicKeyAdditions, publicKeyDeletions);
    }

    /**
     * Gets relative change of the minimal number of cosignatories required when removing an account.
     *
     * @return Relative change of the minimal number of cosignatories required when removing an account.
     */
    public getMinRemovalDelta(): number {
        return this.minRemovalDelta;
    }

    /**
     * Gets relative change of the minimal number of cosignatories required when approving a transaction.
     *
     * @return Relative change of the minimal number of cosignatories required when approving a transaction.
     */
    public getMinApprovalDelta(): number {
        return this.minApprovalDelta;
    }

    /**
     * Gets reserved padding to align publicKeyAdditions on 8-byte boundary.
     *
     * @return Reserved padding to align publicKeyAdditions on 8-byte boundary.
     */
    public getMultisigAccountModificationTransactionBody_Reserved1(): number {
        return this.multisigAccountModificationTransactionBody_Reserved1;
    }

    /**
     * Gets cosignatory public key additions.
     *
     * @return Cosignatory public key additions.
     */
    public getPublicKeyAdditions(): KeyDto[] {
        return this.publicKeyAdditions;
    }

    /**
     * Gets cosignatory public key deletions.
     *
     * @return Cosignatory public key deletions.
     */
    public getPublicKeyDeletions(): KeyDto[] {
        return this.publicKeyDeletions;
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size = 0;
        size += 1; // minRemovalDelta
        size += 1; // minApprovalDelta
        size += 1; // publicKeyAdditionsCount
        size += 1; // publicKeyDeletionsCount
        size += 4; // multisigAccountModificationTransactionBody_Reserved1
        this.publicKeyAdditions.forEach((o) => size += o.getSize());
        this.publicKeyDeletions.forEach((o) => size += o.getSize());
        return size;
    }

    /**
     * Serializes an object to bytes.
     *
     * @return Serialized bytes.
     */
    public serialize(): Uint8Array {
        let newArray = Uint8Array.from([]);
        const minRemovalDeltaBytes = GeneratorUtils.uintToBuffer(this.getMinRemovalDelta(), 1);
        newArray = GeneratorUtils.concatTypedArrays(newArray, minRemovalDeltaBytes);
        const minApprovalDeltaBytes = GeneratorUtils.uintToBuffer(this.getMinApprovalDelta(), 1);
        newArray = GeneratorUtils.concatTypedArrays(newArray, minApprovalDeltaBytes);
        const publicKeyAdditionsCountBytes = GeneratorUtils.uintToBuffer(this.publicKeyAdditions.length, 1);
        newArray = GeneratorUtils.concatTypedArrays(newArray, publicKeyAdditionsCountBytes);
        const publicKeyDeletionsCountBytes = GeneratorUtils.uintToBuffer(this.publicKeyDeletions.length, 1);
        newArray = GeneratorUtils.concatTypedArrays(newArray, publicKeyDeletionsCountBytes);
        // tslint:disable-next-line: max-line-length
        const multisigAccountModificationTransactionBody_Reserved1Bytes = GeneratorUtils.uintToBuffer(this.getMultisigAccountModificationTransactionBody_Reserved1(), 4);
        newArray = GeneratorUtils.concatTypedArrays(newArray, multisigAccountModificationTransactionBody_Reserved1Bytes);
        this.publicKeyAdditions.forEach((item) => {
            const publicKeyAdditionsBytes = item.serialize();
            newArray = GeneratorUtils.concatTypedArrays(newArray, publicKeyAdditionsBytes);
        });
        this.publicKeyDeletions.forEach((item) => {
            const publicKeyDeletionsBytes = item.serialize();
            newArray = GeneratorUtils.concatTypedArrays(newArray, publicKeyDeletionsBytes);
        });
        return newArray;
    }
}
