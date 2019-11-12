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
import { MosaicRestrictionTypeDto } from './MosaicRestrictionTypeDto';
import { UnresolvedMosaicIdDto } from './UnresolvedMosaicIdDto';

/** Binary layout for a mosaic global restriction transaction. */
export class MosaicGlobalRestrictionTransactionBodyBuilder {
    /** Identifier of the mosaic being restricted. */
    mosaicId: UnresolvedMosaicIdDto;
    /** Identifier of the mosaic providing the restriction key. */
    referenceMosaicId: UnresolvedMosaicIdDto;
    /** Restriction key relative to the reference mosaic identifier. */
    restrictionKey: number[];
    /** Previous restriction value. */
    previousRestrictionValue: number[];
    /** New restriction value. */
    newRestrictionValue: number[];
    /** Previous restriction type. */
    previousRestrictionType: MosaicRestrictionTypeDto;
    /** New restriction type. */
    newRestrictionType: MosaicRestrictionTypeDto;

    /**
     * Constructor.
     *
     * @param mosaicId Identifier of the mosaic being restricted.
     * @param referenceMosaicId Identifier of the mosaic providing the restriction key.
     * @param restrictionKey Restriction key relative to the reference mosaic identifier.
     * @param previousRestrictionValue Previous restriction value.
     * @param newRestrictionValue New restriction value.
     * @param previousRestrictionType Previous restriction type.
     * @param newRestrictionType New restriction type.
     */
    // tslint:disable-next-line: max-line-length
    public constructor(mosaicId: UnresolvedMosaicIdDto,  referenceMosaicId: UnresolvedMosaicIdDto,  restrictionKey: number[],  previousRestrictionValue: number[],  newRestrictionValue: number[],  previousRestrictionType: MosaicRestrictionTypeDto,  newRestrictionType: MosaicRestrictionTypeDto) {
        this.mosaicId = mosaicId;
        this.referenceMosaicId = referenceMosaicId;
        this.restrictionKey = restrictionKey;
        this.previousRestrictionValue = previousRestrictionValue;
        this.newRestrictionValue = newRestrictionValue;
        this.previousRestrictionType = previousRestrictionType;
        this.newRestrictionType = newRestrictionType;
    }

    /**
     * Creates an instance of MosaicGlobalRestrictionTransactionBodyBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of MosaicGlobalRestrictionTransactionBodyBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): MosaicGlobalRestrictionTransactionBodyBuilder {
        const byteArray = Array.from(payload);
        const mosaicId = UnresolvedMosaicIdDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, mosaicId.getSize());
        const referenceMosaicId = UnresolvedMosaicIdDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, referenceMosaicId.getSize());
        const restrictionKey = GeneratorUtils.bufferToUint64(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 8));
        byteArray.splice(0, 8);
        const previousRestrictionValue = GeneratorUtils.bufferToUint64(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 8));
        byteArray.splice(0, 8);
        const newRestrictionValue = GeneratorUtils.bufferToUint64(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 8));
        byteArray.splice(0, 8);
        const previousRestrictionType = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 1));
        byteArray.splice(0, 1);
        const newRestrictionType = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 1));
        byteArray.splice(0, 1);
        // tslint:disable-next-line: max-line-length
        return new MosaicGlobalRestrictionTransactionBodyBuilder(mosaicId, referenceMosaicId, restrictionKey, previousRestrictionValue, newRestrictionValue, previousRestrictionType, newRestrictionType);
    }

    /**
     * Gets identifier of the mosaic being restricted.
     *
     * @return Identifier of the mosaic being restricted.
     */
    public getMosaicId(): UnresolvedMosaicIdDto {
        return this.mosaicId;
    }

    /**
     * Gets identifier of the mosaic providing the restriction key.
     *
     * @return Identifier of the mosaic providing the restriction key.
     */
    public getReferenceMosaicId(): UnresolvedMosaicIdDto {
        return this.referenceMosaicId;
    }

    /**
     * Gets restriction key relative to the reference mosaic identifier.
     *
     * @return Restriction key relative to the reference mosaic identifier.
     */
    public getRestrictionKey(): number[] {
        return this.restrictionKey;
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
     * Gets previous restriction type.
     *
     * @return Previous restriction type.
     */
    public getPreviousRestrictionType(): MosaicRestrictionTypeDto {
        return this.previousRestrictionType;
    }

    /**
     * Gets new restriction type.
     *
     * @return New restriction type.
     */
    public getNewRestrictionType(): MosaicRestrictionTypeDto {
        return this.newRestrictionType;
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size = 0;
        size += this.mosaicId.getSize();
        size += this.referenceMosaicId.getSize();
        size += 8; // restrictionKey
        size += 8; // previousRestrictionValue
        size += 8; // newRestrictionValue
        size += 1; // previousRestrictionType
        size += 1; // newRestrictionType
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
        const referenceMosaicIdBytes = this.referenceMosaicId.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, referenceMosaicIdBytes);
        const restrictionKeyBytes = GeneratorUtils.uint64ToBuffer(this.getRestrictionKey());
        newArray = GeneratorUtils.concatTypedArrays(newArray, restrictionKeyBytes);
        const previousRestrictionValueBytes = GeneratorUtils.uint64ToBuffer(this.getPreviousRestrictionValue());
        newArray = GeneratorUtils.concatTypedArrays(newArray, previousRestrictionValueBytes);
        const newRestrictionValueBytes = GeneratorUtils.uint64ToBuffer(this.getNewRestrictionValue());
        newArray = GeneratorUtils.concatTypedArrays(newArray, newRestrictionValueBytes);
        const previousRestrictionTypeBytes = GeneratorUtils.uintToBuffer(this.previousRestrictionType, 1);
        newArray = GeneratorUtils.concatTypedArrays(newArray, previousRestrictionTypeBytes);
        const newRestrictionTypeBytes = GeneratorUtils.uintToBuffer(this.newRestrictionType, 1);
        newArray = GeneratorUtils.concatTypedArrays(newArray, newRestrictionTypeBytes);
        return newArray;
    }
}
