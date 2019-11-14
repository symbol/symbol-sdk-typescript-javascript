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

import { BlockDurationDto } from './BlockDurationDto';
import { GeneratorUtils } from './GeneratorUtils';
import { MosaicIdDto } from './MosaicIdDto';
import { MosaicNonceDto } from './MosaicNonceDto';

/** Binary layout for a mosaic definition transaction. */
export class MosaicDefinitionTransactionBodyBuilder {
    /** Mosaic identifier. */
    id: MosaicIdDto;
    /** Mosaic duration. */
    duration: BlockDurationDto;
    /** Mosaic nonce. */
    nonce: MosaicNonceDto;
    /** Mosaic flags. */
    flags: number;
    /** Mosaic divisibility. */
    divisibility: number;

    /**
     * Constructor.
     *
     * @param id Mosaic identifier.
     * @param duration Mosaic duration.
     * @param nonce Mosaic nonce.
     * @param flags Mosaic flags.
     * @param divisibility Mosaic divisibility.
     */
    // tslint:disable-next-line: max-line-length
    public constructor(id: MosaicIdDto,  duration: BlockDurationDto,  nonce: MosaicNonceDto,  flags: number,  divisibility: number) {
        this.id = id;
        this.duration = duration;
        this.nonce = nonce;
        this.flags = flags;
        this.divisibility = divisibility;
    }

    /**
     * Creates an instance of MosaicDefinitionTransactionBodyBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of MosaicDefinitionTransactionBodyBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): MosaicDefinitionTransactionBodyBuilder {
        const byteArray = Array.from(payload);
        const id = MosaicIdDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, id.getSize());
        const duration = BlockDurationDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, duration.getSize());
        const nonce = MosaicNonceDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, nonce.getSize());
        const flags = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 1));
        byteArray.splice(0, 1);
        const divisibility = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 1));
        byteArray.splice(0, 1);
        return new MosaicDefinitionTransactionBodyBuilder(id, duration, nonce, flags, divisibility);
    }

    /**
     * Gets mosaic identifier.
     *
     * @return Mosaic identifier.
     */
    public getId(): MosaicIdDto {
        return this.id;
    }

    /**
     * Gets mosaic duration.
     *
     * @return Mosaic duration.
     */
    public getDuration(): BlockDurationDto {
        return this.duration;
    }

    /**
     * Gets mosaic nonce.
     *
     * @return Mosaic nonce.
     */
    public getNonce(): MosaicNonceDto {
        return this.nonce;
    }

    /**
     * Gets mosaic flags.
     *
     * @return Mosaic flags.
     */
    public getFlags(): number {
        return this.flags;
    }

    /**
     * Gets mosaic divisibility.
     *
     * @return Mosaic divisibility.
     */
    public getDivisibility(): number {
        return this.divisibility;
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size = 0;
        size += this.id.getSize();
        size += this.duration.getSize();
        size += this.nonce.getSize();
        size += 1; // flags
        size += 1; // divisibility
        return size;
    }

    /**
     * Serializes an object to bytes.
     *
     * @return Serialized bytes.
     */
    public serialize(): Uint8Array {
        let newArray = Uint8Array.from([]);
        const idBytes = this.id.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, idBytes);
        const durationBytes = this.duration.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, durationBytes);
        const nonceBytes = this.nonce.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, nonceBytes);
        const flagsBytes = GeneratorUtils.uintToBuffer(this.getFlags(), 1);
        newArray = GeneratorUtils.concatTypedArrays(newArray, flagsBytes);
        const divisibilityBytes = GeneratorUtils.uintToBuffer(this.getDivisibility(), 1);
        newArray = GeneratorUtils.concatTypedArrays(newArray, divisibilityBytes);
        return newArray;
    }
}
