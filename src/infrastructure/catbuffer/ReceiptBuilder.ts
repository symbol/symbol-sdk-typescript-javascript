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
import { ReceiptTypeDto } from './ReceiptTypeDto';

/** Binary layout for a receipt entity. */
export class ReceiptBuilder {
    /** Entity size. */
    size = 0;
    /** Receipt version. */
    version: number;
    /** Receipt type. */
    type: ReceiptTypeDto;

    /**
     * Constructor.
     *
     * @param version Receipt version.
     * @param type Receipt type.
     */
    public constructor(version: number,  type: ReceiptTypeDto) {
        this.version = version;
        this.type = type;
    }

    /**
     * Creates an instance of ReceiptBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of ReceiptBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): ReceiptBuilder {
        const byteArray = Array.from(payload);
        const size = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 4));
        byteArray.splice(0, 4);
        const version = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 2));
        byteArray.splice(0, 2);
        const type = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 2));
        byteArray.splice(0, 2);
        return new ReceiptBuilder(version, type);
    }

    /**
     * Gets receipt version.
     *
     * @return Receipt version.
     */
    public getVersion(): number {
        return this.version;
    }

    /**
     * Gets receipt type.
     *
     * @return Receipt type.
     */
    public getType(): ReceiptTypeDto {
        return this.type;
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size = 0;
        size += 4; // size
        size += 2; // version
        size += 2; // type
        return size;
    }

    /**
     * Serializes an object to bytes.
     *
     * @return Serialized bytes.
     */
    public serialize(): Uint8Array {
        let newArray = Uint8Array.from([]);
        const versionBytes = GeneratorUtils.uintToBuffer(this.getVersion(), 2);
        newArray = GeneratorUtils.concatTypedArrays(newArray, versionBytes);
        const typeBytes = GeneratorUtils.uintToBuffer(this.type, 2);
        newArray = GeneratorUtils.concatTypedArrays(newArray, typeBytes);
        return newArray;
    }
}
