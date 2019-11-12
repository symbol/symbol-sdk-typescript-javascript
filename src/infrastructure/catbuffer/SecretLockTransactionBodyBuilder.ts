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
import { Hash256Dto } from './Hash256Dto';
import { LockHashAlgorithmDto } from './LockHashAlgorithmDto';
import { UnresolvedAddressDto } from './UnresolvedAddressDto';
import { UnresolvedMosaicBuilder } from './UnresolvedMosaicBuilder';

/** Binary layout for a secret lock transaction. */
export class SecretLockTransactionBodyBuilder {
    /** Secret. */
    secret: Hash256Dto;
    /** Locked mosaic. */
    mosaic: UnresolvedMosaicBuilder;
    /** Number of blocks for which a lock should be valid. */
    duration: BlockDurationDto;
    /** Hash algorithm. */
    hashAlgorithm: LockHashAlgorithmDto;
    /** Locked mosaic recipient address. */
    recipientAddress: UnresolvedAddressDto;

    /**
     * Constructor.
     *
     * @param secret Secret.
     * @param mosaic Locked mosaic.
     * @param duration Number of blocks for which a lock should be valid.
     * @param hashAlgorithm Hash algorithm.
     * @param recipientAddress Locked mosaic recipient address.
     */
    // tslint:disable-next-line: max-line-length
    public constructor(secret: Hash256Dto,  mosaic: UnresolvedMosaicBuilder,  duration: BlockDurationDto,  hashAlgorithm: LockHashAlgorithmDto,  recipientAddress: UnresolvedAddressDto) {
        this.secret = secret;
        this.mosaic = mosaic;
        this.duration = duration;
        this.hashAlgorithm = hashAlgorithm;
        this.recipientAddress = recipientAddress;
    }

    /**
     * Creates an instance of SecretLockTransactionBodyBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of SecretLockTransactionBodyBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): SecretLockTransactionBodyBuilder {
        const byteArray = Array.from(payload);
        const secret = Hash256Dto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, secret.getSize());
        const mosaic = UnresolvedMosaicBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, mosaic.getSize());
        const duration = BlockDurationDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, duration.getSize());
        const hashAlgorithm = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 1));
        byteArray.splice(0, 1);
        const recipientAddress = UnresolvedAddressDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, recipientAddress.getSize());
        return new SecretLockTransactionBodyBuilder(secret, mosaic, duration, hashAlgorithm, recipientAddress);
    }

    /**
     * Gets secret.
     *
     * @return Secret.
     */
    public getSecret(): Hash256Dto {
        return this.secret;
    }

    /**
     * Gets locked mosaic.
     *
     * @return Locked mosaic.
     */
    public getMosaic(): UnresolvedMosaicBuilder {
        return this.mosaic;
    }

    /**
     * Gets number of blocks for which a lock should be valid.
     *
     * @return Number of blocks for which a lock should be valid.
     */
    public getDuration(): BlockDurationDto {
        return this.duration;
    }

    /**
     * Gets hash algorithm.
     *
     * @return Hash algorithm.
     */
    public getHashAlgorithm(): LockHashAlgorithmDto {
        return this.hashAlgorithm;
    }

    /**
     * Gets locked mosaic recipient address.
     *
     * @return Locked mosaic recipient address.
     */
    public getRecipientAddress(): UnresolvedAddressDto {
        return this.recipientAddress;
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size = 0;
        size += this.secret.getSize();
        size += this.mosaic.getSize();
        size += this.duration.getSize();
        size += 1; // hashAlgorithm
        size += this.recipientAddress.getSize();
        return size;
    }

    /**
     * Serializes an object to bytes.
     *
     * @return Serialized bytes.
     */
    public serialize(): Uint8Array {
        let newArray = Uint8Array.from([]);
        const secretBytes = this.secret.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, secretBytes);
        const mosaicBytes = this.mosaic.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, mosaicBytes);
        const durationBytes = this.duration.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, durationBytes);
        const hashAlgorithmBytes = GeneratorUtils.uintToBuffer(this.hashAlgorithm, 1);
        newArray = GeneratorUtils.concatTypedArrays(newArray, hashAlgorithmBytes);
        const recipientAddressBytes = this.recipientAddress.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, recipientAddressBytes);
        return newArray;
    }
}
