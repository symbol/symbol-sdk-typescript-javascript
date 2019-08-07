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
import { UnresolvedAddressDto } from './UnresolvedAddressDto';
import { UnresolvedMosaicIdDto } from './UnresolvedMosaicIdDto';

/** Binary layout for a mosaic address restriction transaction. */
export class MosaicAddressRestrictionTransactionBodyBuilder {
    /** Identifier of the mosaic to which the restriction applies. */
    mosaicId: UnresolvedMosaicIdDto;
    /** Restriction key. */
    restrictionKey: number[];
    /** Address being restricted. */
    targetAddress: UnresolvedAddressDto;
    /** Previous restriction value. */
    previousRestrictionValue: number[];
    /** New restriction value. */
    newRestrictionValue: number[];

    /**
     * Constructor.
     *
     * @param mosaicId Identifier of the mosaic to which the restriction applies.
     * @param restrictionKey Restriction key.
     * @param targetAddress Address being restricted.
     * @param previousRestrictionValue Previous restriction value.
     * @param newRestrictionValue New restriction value.
     */
    // tslint:disable-next-line: max-line-length
    public constructor(mosaicId: UnresolvedMosaicIdDto,  restrictionKey: number[],  targetAddress: UnresolvedAddressDto,  previousRestrictionValue: number[],  newRestrictionValue: number[]) {
        this.mosaicId = mosaicId;
        this.restrictionKey = restrictionKey;
        this.targetAddress = targetAddress;
        this.previousRestrictionValue = previousRestrictionValue;
        this.newRestrictionValue = newRestrictionValue;
    }

    /**
     * Creates an instance of MosaicAddressRestrictionTransactionBodyBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of MosaicAddressRestrictionTransactionBodyBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): MosaicAddressRestrictionTransactionBodyBuilder {
        const byteArray = Array.from(payload);
        const mosaicId = UnresolvedMosaicIdDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, mosaicId.getSize());
        const restrictionKey = GeneratorUtils.bufferToUint64(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 8));
        byteArray.splice(0, 8);
        const targetAddress = UnresolvedAddressDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, targetAddress.getSize());
        const previousRestrictionValue = GeneratorUtils.bufferToUint64(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 8));
        byteArray.splice(0, 8);
        const newRestrictionValue = GeneratorUtils.bufferToUint64(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 8));
        byteArray.splice(0, 8);
        // tslint:disable-next-line: max-line-length
        return new MosaicAddressRestrictionTransactionBodyBuilder(mosaicId, restrictionKey, targetAddress, previousRestrictionValue, newRestrictionValue);
    }

    /**
     * Gets identifier of the mosaic to which the restriction applies.
     *
     * @return Identifier of the mosaic to which the restriction applies.
     */
    public getMosaicId(): UnresolvedMosaicIdDto {
        return this.mosaicId;
    }

    /**
     * Gets restriction key.
     *
     * @return Restriction key.
     */
    public getRestrictionKey(): number[] {
        return this.restrictionKey;
    }

    /**
     * Gets address being restricted.
     *
     * @return Address being restricted.
     */
    public getTargetAddress(): UnresolvedAddressDto {
        return this.targetAddress;
    }

    /**
     * Gets previous restriction value.
     *
     * @return Previous restriction value.
     */
    public getPreviousRestrictionValue(): number[] {
        return this.previousRestrictionValue;
    }

    /**
     * Gets new restriction value.
     *
     * @return New restriction value.
     */
    public getNewRestrictionValue(): number[] {
        return this.newRestrictionValue;
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size = 0;
        size += this.mosaicId.getSize();
        size += 8; // restrictionKey
        size += this.targetAddress.getSize();
        size += 8; // previousRestrictionValue
        size += 8; // newRestrictionValue
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
        const restrictionKeyBytes = GeneratorUtils.uint64ToBuffer(this.getRestrictionKey());
        newArray = GeneratorUtils.concatTypedArrays(newArray, restrictionKeyBytes);
        const targetAddressBytes = this.targetAddress.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, targetAddressBytes);
        const previousRestrictionValueBytes = GeneratorUtils.uint64ToBuffer(this.getPreviousRestrictionValue());
        newArray = GeneratorUtils.concatTypedArrays(newArray, previousRestrictionValueBytes);
        const newRestrictionValueBytes = GeneratorUtils.uint64ToBuffer(this.getNewRestrictionValue());
        newArray = GeneratorUtils.concatTypedArrays(newArray, newRestrictionValueBytes);
        return newArray;
    }
}
