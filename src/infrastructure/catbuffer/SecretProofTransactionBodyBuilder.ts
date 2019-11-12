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
import { Hash256Dto } from './Hash256Dto';
import { LockHashAlgorithmDto } from './LockHashAlgorithmDto';
import { UnresolvedAddressDto } from './UnresolvedAddressDto';

/** Binary layout for a secret proof transaction. */
export class SecretProofTransactionBodyBuilder {
    /** Secret. */
    secret: Hash256Dto;
    /** Hash algorithm. */
    hashAlgorithm: LockHashAlgorithmDto;
    /** Locked mosaic recipient address. */
    recipientAddress: UnresolvedAddressDto;
    /** Proof data. */
    proof: Uint8Array;

    /**
     * Constructor.
     *
     * @param secret Secret.
     * @param hashAlgorithm Hash algorithm.
     * @param recipientAddress Locked mosaic recipient address.
     * @param proof Proof data.
     */
    // tslint:disable-next-line: max-line-length
    public constructor(secret: Hash256Dto,  hashAlgorithm: LockHashAlgorithmDto,  recipientAddress: UnresolvedAddressDto,  proof: Uint8Array) {
        this.secret = secret;
        this.hashAlgorithm = hashAlgorithm;
        this.recipientAddress = recipientAddress;
        this.proof = proof;
    }

    /**
     * Creates an instance of SecretProofTransactionBodyBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of SecretProofTransactionBodyBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): SecretProofTransactionBodyBuilder {
        const byteArray = Array.from(payload);
        const secret = Hash256Dto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, secret.getSize());
        const proofSize = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 2));
        byteArray.splice(0, 2);
        const hashAlgorithm = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 1));
        byteArray.splice(0, 1);
        const recipientAddress = UnresolvedAddressDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, recipientAddress.getSize());
        const proof = GeneratorUtils.getBytes(Uint8Array.from(byteArray), proofSize);
        byteArray.splice(0, proofSize);
        return new SecretProofTransactionBodyBuilder(secret, hashAlgorithm, recipientAddress, proof);
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
     * Gets proof data.
     *
     * @return Proof data.
     */
    public getProof(): Uint8Array {
        return this.proof;
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size = 0;
        size += this.secret.getSize();
        size += 2; // proofSize
        size += 1; // hashAlgorithm
        size += this.recipientAddress.getSize();
        size += this.proof.length;
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
        const proofSizeBytes = GeneratorUtils.uintToBuffer(this.proof.length, 2);
        newArray = GeneratorUtils.concatTypedArrays(newArray, proofSizeBytes);
        const hashAlgorithmBytes = GeneratorUtils.uintToBuffer(this.hashAlgorithm, 1);
        newArray = GeneratorUtils.concatTypedArrays(newArray, hashAlgorithmBytes);
        const recipientAddressBytes = this.recipientAddress.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, recipientAddressBytes);
        newArray = GeneratorUtils.concatTypedArrays(newArray, this.proof);
        return newArray;
    }
}
