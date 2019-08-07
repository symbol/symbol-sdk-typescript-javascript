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

import { AmountDto } from './AmountDto';
import { GeneratorUtils } from './GeneratorUtils';
import { MosaicIdDto } from './MosaicIdDto';

/** Binary layout for a mosaic. */
export class MosaicBuilder {
    /** Mosaic identifier. */
    mosaicId: MosaicIdDto;
    /** Mosaic amount. */
    amount: AmountDto;

    /**
     * Constructor.
     *
     * @param mosaicId Mosaic identifier.
     * @param amount Mosaic amount.
     */
    public constructor(mosaicId: MosaicIdDto,  amount: AmountDto) {
        this.mosaicId = mosaicId;
        this.amount = amount;
    }

    /**
     * Creates an instance of MosaicBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of MosaicBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): MosaicBuilder {
        const byteArray = Array.from(payload);
        const mosaicId = MosaicIdDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, mosaicId.getSize());
        const amount = AmountDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, amount.getSize());
        return new MosaicBuilder(mosaicId, amount);
    }

    /**
     * Gets mosaic identifier.
     *
     * @return Mosaic identifier.
     */
    public getMosaicId(): MosaicIdDto {
        return this.mosaicId;
    }

    /**
     * Gets mosaic amount.
     *
     * @return Mosaic amount.
     */
    public getAmount(): AmountDto {
        return this.amount;
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size = 0;
        size += this.mosaicId.getSize();
        size += this.amount.getSize();
        return size;
    }

    /**
     * Serializes an object to bytes.
     *
     * @return Serialized bytes.
     */
    public serialize(): Uint8Array {
        let newArray = Uint8Array.from([]);
        const mosaicIdBytes = this.mosaicId.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, mosaicIdBytes);
        const amountBytes = this.amount.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, amountBytes);
        return newArray;
    }
}
