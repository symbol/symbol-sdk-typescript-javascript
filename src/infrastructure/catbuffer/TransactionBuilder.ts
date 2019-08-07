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
import { EntityTypeDto } from './EntityTypeDto';
import { GeneratorUtils } from './GeneratorUtils';
import { KeyDto } from './KeyDto';
import { SignatureDto } from './SignatureDto';
import { TimestampDto } from './TimestampDto';

/** Binary layout for a transaction. */
export class TransactionBuilder {
    /** Entity size. */
    size = 0;
    /** Entity signature. */
    signature: SignatureDto;
    /** Entity signer's public key. */
    signer: KeyDto;
    /** Entity version. */
    version: number;
    /** Entity type. */
    type: EntityTypeDto;
    /** Transaction fee. */
    fee: AmountDto;
    /** Transaction deadline. */
    deadline: TimestampDto;

    /**
     * Constructor.
     *
     * @param signature Entity signature.
     * @param signer Entity signer's public key.
     * @param version Entity version.
     * @param type Entity type.
     * @param fee Transaction fee.
     * @param deadline Transaction deadline.
     */
    // tslint:disable-next-line: max-line-length
    public constructor(signature: SignatureDto,  signer: KeyDto,  version: number,  type: EntityTypeDto,  fee: AmountDto,  deadline: TimestampDto) {
        this.signature = signature;
        this.signer = signer;
        this.version = version;
        this.type = type;
        this.fee = fee;
        this.deadline = deadline;
    }

    /**
     * Creates an instance of TransactionBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of TransactionBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): TransactionBuilder {
        const byteArray = Array.from(payload);
        const size = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 4));
        byteArray.splice(0, 4);
        const signature = SignatureDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, signature.getSize());
        const signer = KeyDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, signer.getSize());
        const version = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 2));
        byteArray.splice(0, 2);
        const type = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 2));
        byteArray.splice(0, 2);
        const fee = AmountDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, fee.getSize());
        const deadline = TimestampDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, deadline.getSize());
        return new TransactionBuilder(signature, signer, version, type, fee, deadline);
    }

    /**
     * Gets entity signature.
     *
     * @return Entity signature.
     */
    public getSignature(): SignatureDto {
        return this.signature;
    }

    /**
     * Gets entity signer's public key.
     *
     * @return Entity signer's public key.
     */
    public getSigner(): KeyDto {
        return this.signer;
    }

    /**
     * Gets entity version.
     *
     * @return Entity version.
     */
    public getVersion(): number {
        return this.version;
    }

    /**
     * Gets entity type.
     *
     * @return Entity type.
     */
    public getType(): EntityTypeDto {
        return this.type;
    }

    /**
     * Gets transaction fee..
     *
     * @return Transaction fee.
     */
    public getFee(): AmountDto {
        return this.fee;
    }

    /**
     * Gets transaction deadline.
     *
     * @return Transaction deadline.
     */
    public getDeadline(): TimestampDto {
        return this.deadline;
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size = 0;
        size += 4; // size
        size += this.signature.getSize();
        size += this.signer.getSize();
        size += 2; // version
        size += 2; // type
        size += this.fee.getSize();
        size += this.deadline.getSize();
        return size;
    }

    /**
     * Serializes an object to bytes.
     *
     * @return Serialized bytes.
     */
    public serialize(): Uint8Array {
        let newArray = Uint8Array.from([]);
        const sizeBytes = GeneratorUtils.uintToBuffer(this.getSize(), 4);
        newArray = GeneratorUtils.concatTypedArrays(newArray, sizeBytes);
        const signatureBytes = this.signature.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, signatureBytes);
        const signerBytes = this.signer.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, signerBytes);
        const versionBytes = GeneratorUtils.uintToBuffer(this.getVersion(), 2);
        newArray = GeneratorUtils.concatTypedArrays(newArray, versionBytes);
        const typeBytes = GeneratorUtils.uintToBuffer(this.type, 2);
        newArray = GeneratorUtils.concatTypedArrays(newArray, typeBytes);
        const feeBytes = this.fee.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, feeBytes);
        const deadlineBytes = this.deadline.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, deadlineBytes);
        return newArray;
    }
}
