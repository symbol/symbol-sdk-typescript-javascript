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

/** Hash512. */
export class Hash512Dto {
    /** Hash512. */
    hash512: Uint8Array;

    /**
     * Constructor.
     *
     * @param hash512 Hash512.
     */
     constructor(hash512: Uint8Array) {
        this.hash512 = hash512;
    }

    /**
     * Creates an instance of Hash512Dto from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of Hash512Dto.
     */
    public static loadFromBinary(payload: Uint8Array): Hash512Dto {
        const byteArray = Array.from(payload);
        const hash512 = GeneratorUtils.getBytes(Uint8Array.from(byteArray), 64);
        byteArray.splice(0, 64);
        return new Hash512Dto(hash512);
    }

    /**
     * Gets Hash512.
     *
     * @return Hash512.
     */
    public getHash512(): Uint8Array {
        return this.hash512;
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        return 64;
    }

    /**
     * Serializes an object to bytes.
     *
     * @return Serialized bytes.
     */
    public serialize(): Uint8Array {
        let newArray = Uint8Array.from([]);
        newArray = GeneratorUtils.concatTypedArrays(newArray, this.hash512);
        return newArray;
    }
}
