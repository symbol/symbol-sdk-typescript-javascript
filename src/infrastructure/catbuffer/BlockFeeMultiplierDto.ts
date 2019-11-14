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

/** Block fee multiplier. */
export class BlockFeeMultiplierDto {
    /** Block fee multiplier. */
    blockFeeMultiplier: number;

    /**
     * Constructor.
     *
     * @param blockFeeMultiplier Block fee multiplier.
     */
     constructor(blockFeeMultiplier: number) {
        this.blockFeeMultiplier = blockFeeMultiplier;
    }

    /**
     * Creates an instance of BlockFeeMultiplierDto from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of BlockFeeMultiplierDto.
     */
    public static loadFromBinary(payload: Uint8Array): BlockFeeMultiplierDto {
        const byteArray = Array.from(payload);
        const blockFeeMultiplier = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 4));
        byteArray.splice(0, 4);
        return new BlockFeeMultiplierDto(blockFeeMultiplier);
    }

    /**
     * Gets Block fee multiplier.
     *
     * @return Block fee multiplier.
     */
    public getBlockFeeMultiplier(): number {
        return this.blockFeeMultiplier;
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        return 4;
    }

    /**
     * Serializes an object to bytes.
     *
     * @return Serialized bytes.
     */
    public serialize(): Uint8Array {
        let newArray = Uint8Array.from([]);
        const blockFeeMultiplierBytes = GeneratorUtils.uintToBuffer(this.getBlockFeeMultiplier(), 4);
        newArray = GeneratorUtils.concatTypedArrays(newArray, blockFeeMultiplierBytes);
        return newArray;
    }
}
