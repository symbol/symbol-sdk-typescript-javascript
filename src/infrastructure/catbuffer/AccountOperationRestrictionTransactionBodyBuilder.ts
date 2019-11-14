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

/** Binary layout for an account operation restriction transaction. */
export class AccountOperationRestrictionTransactionBodyBuilder {
    /** Account restriction flags. */
    restrictionFlags: number;
    /** Reserved padding to align restrictionAdditions on 8-byte boundary. */
    accountRestrictionTransactionBody_Reserved1: number;
    /** Account restriction additions. */
    restrictionAdditions: number[];
    /** Account restriction deletions. */
    restrictionDeletions: number[];

    /**
     * Constructor.
     *
     * @param restrictionFlags Account restriction flags.
     * @param restrictionAdditions Account restriction additions.
     * @param restrictionDeletions Account restriction deletions.
     */
    public constructor(restrictionFlags: number,  restrictionAdditions: number[],  restrictionDeletions: number[]) {
        this.restrictionFlags = restrictionFlags;
        this.accountRestrictionTransactionBody_Reserved1 = 0;
        this.restrictionAdditions = restrictionAdditions;
        this.restrictionDeletions = restrictionDeletions;
    }

    /**
     * Creates an instance of AccountOperationRestrictionTransactionBodyBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of AccountOperationRestrictionTransactionBodyBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): AccountOperationRestrictionTransactionBodyBuilder {
        const byteArray = Array.from(payload);
        const restrictionFlags = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 2));
        byteArray.splice(0, 2);
        const restrictionAdditionsCount = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 1));
        byteArray.splice(0, 1);
        const restrictionDeletionsCount = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 1));
        byteArray.splice(0, 1);
        // tslint:disable-next-line: max-line-length
        const accountRestrictionTransactionBody_Reserved1 = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 4));
        byteArray.splice(0, 4);
        const restrictionAdditions: number[] = [];
        for (let i = 0; i < restrictionAdditionsCount; i++) {
            const item = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 2));
            restrictionAdditions.push(item);
            byteArray.splice(0, 2);
        }
        const restrictionDeletions: number[] = [];
        for (let i = 0; i < restrictionDeletionsCount; i++) {
            const item = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 2));
            restrictionDeletions.push(item);
            byteArray.splice(0, 2);
        }
        // tslint:disable-next-line: max-line-length
        return new AccountOperationRestrictionTransactionBodyBuilder(restrictionFlags, restrictionAdditions, restrictionDeletions);
    }

    /**
     * Gets account restriction flags.
     *
     * @return Account restriction flags.
     */
    public getRestrictionFlags(): number {
        return this.restrictionFlags;
    }

    /**
     * Gets reserved padding to align restrictionAdditions on 8-byte boundary.
     *
     * @return Reserved padding to align restrictionAdditions on 8-byte boundary.
     */
    public getAccountRestrictionTransactionBody_Reserved1(): number {
        return this.accountRestrictionTransactionBody_Reserved1;
    }

    /**
     * Gets account restriction additions.
     *
     * @return Account restriction additions.
     */
    public getRestrictionAdditions(): number[] {
        return this.restrictionAdditions;
    }

    /**
     * Gets account restriction deletions.
     *
     * @return Account restriction deletions.
     */
    public getRestrictionDeletions(): number[] {
        return this.restrictionDeletions;
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size = 0;
        size += 2; // restrictionFlags
        size += 1; // restrictionAdditionsCount
        size += 1; // restrictionDeletionsCount
        size += 4; // accountRestrictionTransactionBody_Reserved1
        this.restrictionAdditions.forEach(() => size += 2);
        this.restrictionDeletions.forEach(() => size += 2);
        return size;
    }

    /**
     * Serializes an object to bytes.
     *
     * @return Serialized bytes.
     */
    public serialize(): Uint8Array {
        let newArray = Uint8Array.from([]);
        const restrictionFlagsBytes = GeneratorUtils.uintToBuffer(this.getRestrictionFlags(), 2);
        newArray = GeneratorUtils.concatTypedArrays(newArray, restrictionFlagsBytes);
        const restrictionAdditionsCountBytes = GeneratorUtils.uintToBuffer(this.restrictionAdditions.length, 1);
        newArray = GeneratorUtils.concatTypedArrays(newArray, restrictionAdditionsCountBytes);
        const restrictionDeletionsCountBytes = GeneratorUtils.uintToBuffer(this.restrictionDeletions.length, 1);
        newArray = GeneratorUtils.concatTypedArrays(newArray, restrictionDeletionsCountBytes);
        // tslint:disable-next-line: max-line-length
        const accountRestrictionTransactionBody_Reserved1Bytes = GeneratorUtils.uintToBuffer(this.getAccountRestrictionTransactionBody_Reserved1(), 4);
        newArray = GeneratorUtils.concatTypedArrays(newArray, accountRestrictionTransactionBody_Reserved1Bytes);
        this.restrictionAdditions.forEach((item) => {
            const restrictionAdditionsBytes = GeneratorUtils.uintToBuffer(item, 2);
            newArray = GeneratorUtils.concatTypedArrays(newArray, restrictionAdditionsBytes);
        });
        this.restrictionDeletions.forEach((item) => {
            const restrictionDeletionsBytes = GeneratorUtils.uintToBuffer(item, 2);
            newArray = GeneratorUtils.concatTypedArrays(newArray, restrictionDeletionsBytes);
        });
        return newArray;
    }
}
