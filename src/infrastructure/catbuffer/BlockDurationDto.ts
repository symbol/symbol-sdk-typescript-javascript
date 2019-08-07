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

/** Block duration. */
export class BlockDurationDto {
    /** Block duration. */
    blockDuration: number[];

    /**
     * Constructor.
     *
     * @param blockDuration Block duration.
     */
     constructor(blockDuration: number[]) {
        this.blockDuration = blockDuration;
    }

    /**
     * Creates an instance of BlockDurationDto from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of BlockDurationDto.
     */
    public static loadFromBinary(payload: Uint8Array): BlockDurationDto {
        const byteArray = Array.from(payload);
        const blockDuration = GeneratorUtils.bufferToUint64(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 8));
        byteArray.splice(0, 8);
        return new BlockDurationDto(blockDuration);
    }

    /**
     * Gets Block duration.
     *
     * @return Block duration.
     */
    public getBlockDuration(): number[] {
        return this.blockDuration;
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        return 8;
    }

    /**
     * Serializes an object to bytes.
     *
     * @return Serialized bytes.
     */
    public serialize(): Uint8Array {
        let newArray = Uint8Array.from([]);
        const blockDurationBytes = GeneratorUtils.uint64ToBuffer(this.getBlockDuration());
        newArray = GeneratorUtils.concatTypedArrays(newArray, blockDurationBytes);
        return newArray;
    }
}
