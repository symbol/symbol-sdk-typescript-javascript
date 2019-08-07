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

import { CosignatoryModificationBuilder } from './CosignatoryModificationBuilder';
import { GeneratorUtils } from './GeneratorUtils';

/** Binary layout for a multisig account modification transaction. */
export class MultisigAccountModificationTransactionBodyBuilder {
    /** Relative change of the minimal number of cosignatories required when removing an account. */
    minRemovalDelta: number;
    /** Relative change of the minimal number of cosignatories required when approving a transaction. */
    minApprovalDelta: number;
    /** Attached cosignatory modifications. */
    modifications: CosignatoryModificationBuilder[];

    /**
     * Constructor.
     *
     * @param minRemovalDelta Relative change of the minimal number of cosignatories required when removing an account.
     * @param minApprovalDelta Relative change of the minimal number of cosignatories required when approving a transaction.
     * @param modifications Attached cosignatory modifications.
     */
    // tslint:disable-next-line: max-line-length
    public constructor(minRemovalDelta: number,  minApprovalDelta: number,  modifications: CosignatoryModificationBuilder[]) {
        this.minRemovalDelta = minRemovalDelta;
        this.minApprovalDelta = minApprovalDelta;
        this.modifications = modifications;
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
        const modificationsCount = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 1));
        byteArray.splice(0, 1);
        const modifications: CosignatoryModificationBuilder[] = [];
        for (let i = 0; i < modificationsCount; i++) {
            const item = CosignatoryModificationBuilder.loadFromBinary(Uint8Array.from(byteArray));
            modifications.push(item);
            byteArray.splice(0, item.getSize());
        }
        return new MultisigAccountModificationTransactionBodyBuilder(minRemovalDelta, minApprovalDelta, modifications);
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
     * Gets attached cosignatory modifications.
     *
     * @return Attached cosignatory modifications.
     */
    public getModifications(): CosignatoryModificationBuilder[] {
        return this.modifications;
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
        size += 1; // modificationsCount
        this.modifications.forEach((o) => size += o.getSize());
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
        const modificationsCountBytes = GeneratorUtils.uintToBuffer(this.modifications.length, 1);
        newArray = GeneratorUtils.concatTypedArrays(newArray, modificationsCountBytes);
        this.modifications.forEach((item) => {
            const modificationsBytes = item.serialize();
            newArray = GeneratorUtils.concatTypedArrays(newArray, modificationsBytes);
        });
        return newArray;
    }
}
