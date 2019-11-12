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
import { MosaicSupplyChangeActionDto } from './MosaicSupplyChangeActionDto';
import { UnresolvedMosaicIdDto } from './UnresolvedMosaicIdDto';

/** Binary layout for a mosaic supply change transaction. */
export class MosaicSupplyChangeTransactionBodyBuilder {
    /** Affected mosaic identifier. */
    mosaicId: UnresolvedMosaicIdDto;
    /** Change amount. */
    delta: AmountDto;
    /** Supply change action. */
    action: MosaicSupplyChangeActionDto;

    /**
     * Constructor.
     *
     * @param mosaicId Affected mosaic identifier.
     * @param delta Change amount.
     * @param action Supply change action.
     */
    public constructor(mosaicId: UnresolvedMosaicIdDto,  delta: AmountDto,  action: MosaicSupplyChangeActionDto) {
        this.mosaicId = mosaicId;
        this.delta = delta;
        this.action = action;
    }

    /**
     * Creates an instance of MosaicSupplyChangeTransactionBodyBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of MosaicSupplyChangeTransactionBodyBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): MosaicSupplyChangeTransactionBodyBuilder {
        const byteArray = Array.from(payload);
        const mosaicId = UnresolvedMosaicIdDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, mosaicId.getSize());
        const delta = AmountDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, delta.getSize());
        const action = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 1));
        byteArray.splice(0, 1);
        return new MosaicSupplyChangeTransactionBodyBuilder(mosaicId, delta, action);
    }

    /**
     * Gets affected mosaic identifier.
     *
     * @return Affected mosaic identifier.
     */
    public getMosaicId(): UnresolvedMosaicIdDto {
        return this.mosaicId;
    }

    /**
     * Gets change amount.
     *
     * @return Change amount.
     */
    public getDelta(): AmountDto {
        return this.delta;
    }

    /**
     * Gets supply change action.
     *
     * @return Supply change action.
     */
    public getAction(): MosaicSupplyChangeActionDto {
        return this.action;
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size = 0;
        size += this.mosaicId.getSize();
        size += this.delta.getSize();
        size += 1; // action
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
        const deltaBytes = this.delta.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, deltaBytes);
        const actionBytes = GeneratorUtils.uintToBuffer(this.action, 1);
        newArray = GeneratorUtils.concatTypedArrays(newArray, actionBytes);
        return newArray;
    }
}
