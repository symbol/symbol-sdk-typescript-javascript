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

import { EntityTypeDto } from './EntityTypeDto';
import { GeneratorUtils } from './GeneratorUtils';
import { KeyDto } from './KeyDto';

/** Binary layout for an embedded transaction. */
export class EmbeddedTransactionBuilder {
    /** Entity size. */
    size = 0;
    /** Entity signer's public key. */
    signerPublicKey: KeyDto;
    /** Entity version. */
    version: number;
    /** Entity type. */
    type: EntityTypeDto;

    /**
     * Constructor.
     *
     * @param signerPublicKey Entity signer's public key.
     * @param version Entity version.
     * @param type Entity type.
     */
    public constructor(signerPublicKey: KeyDto,  version: number,  type: EntityTypeDto) {
        this.signerPublicKey = signerPublicKey;
        this.version = version;
        this.type = type;
    }

    /**
     * Creates an instance of EmbeddedTransactionBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of EmbeddedTransactionBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): EmbeddedTransactionBuilder {
        const byteArray = Array.from(payload);
        const size = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 4));
        byteArray.splice(0, 4);
        const signerPublicKey = KeyDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, signerPublicKey.getSize());
        const version = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 2));
        byteArray.splice(0, 2);
        const type = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 2));
        byteArray.splice(0, 2);
        return new EmbeddedTransactionBuilder(signerPublicKey, version, type);
    }

    /**
     * Gets entity signer's public key.
     *
     * @return Entity signer's public key.
     */
    public getSignerPublicKey(): KeyDto {
        return this.signerPublicKey;
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
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size = 0;
        size += 4; // size
        size += this.signerPublicKey.getSize();
        size += 2; // version
        size += 2; // type
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
        const signerPublicKeyBytes = this.signerPublicKey.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, signerPublicKeyBytes);
        const versionBytes = GeneratorUtils.uintToBuffer(this.getVersion(), 2);
        newArray = GeneratorUtils.concatTypedArrays(newArray, versionBytes);
        const typeBytes = GeneratorUtils.uintToBuffer(this.type, 2);
        newArray = GeneratorUtils.concatTypedArrays(newArray, typeBytes);
        return newArray;
    }
}
