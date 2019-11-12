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
import { NetworkTypeDto } from './NetworkTypeDto';

/** Binary layout for an embedded transaction. */
export class EmbeddedTransactionBuilder {
    /** Entity size. */
    size = 0;
    /** Reserved padding to align end of EmbeddedTransactionHeader on 8-byte boundary. */
    embeddedTransactionHeader_Reserved1: number;
    /** Entity signer's public key. */
    signerPublicKey: KeyDto;
    /** Reserved padding to align end of EntityBody on 8-byte boundary. */
    entityBody_Reserved1: number;
    /** Entity version. */
    version: number;
    /** Entity network. */
    network: NetworkTypeDto;
    /** Entity type. */
    type: EntityTypeDto;

    /**
     * Constructor.
     *
     * @param signerPublicKey Entity signer's public key.
     * @param version Entity version.
     * @param network Entity network.
     * @param type Entity type.
     */
    public constructor(signerPublicKey: KeyDto,  version: number,  network: NetworkTypeDto,  type: EntityTypeDto) {
        this.embeddedTransactionHeader_Reserved1 = 0;
        this.signerPublicKey = signerPublicKey;
        this.entityBody_Reserved1 = 0;
        this.version = version;
        this.network = network;
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
        // tslint:disable-next-line: max-line-length
        const embeddedTransactionHeader_Reserved1 = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 4));
        byteArray.splice(0, 4);
        const signerPublicKey = KeyDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, signerPublicKey.getSize());
        const entityBody_Reserved1 = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 4));
        byteArray.splice(0, 4);
        const version = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 1));
        byteArray.splice(0, 1);
        const network = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 1));
        byteArray.splice(0, 1);
        const type = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 2));
        byteArray.splice(0, 2);
        return new EmbeddedTransactionBuilder(signerPublicKey, version, network, type);
    }

    /**
     * Gets reserved padding to align end of EmbeddedTransactionHeader on 8-byte boundary.
     *
     * @return Reserved padding to align end of EmbeddedTransactionHeader on 8-byte boundary.
     */
    public getEmbeddedTransactionHeader_Reserved1(): number {
        return this.embeddedTransactionHeader_Reserved1;
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
     * Gets reserved padding to align end of EntityBody on 8-byte boundary.
     *
     * @return Reserved padding to align end of EntityBody on 8-byte boundary.
     */
    public getEntityBody_Reserved1(): number {
        return this.entityBody_Reserved1;
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
     * Gets entity network.
     *
     * @return Entity network.
     */
    public getNetwork(): NetworkTypeDto {
        return this.network;
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
        size += 4; // embeddedTransactionHeader_Reserved1
        size += this.signerPublicKey.getSize();
        size += 4; // entityBody_Reserved1
        size += 1; // version
        size += 1; // network
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
        // tslint:disable-next-line: max-line-length
        const embeddedTransactionHeader_Reserved1Bytes = GeneratorUtils.uintToBuffer(this.getEmbeddedTransactionHeader_Reserved1(), 4);
        newArray = GeneratorUtils.concatTypedArrays(newArray, embeddedTransactionHeader_Reserved1Bytes);
        const signerPublicKeyBytes = this.signerPublicKey.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, signerPublicKeyBytes);
        const entityBody_Reserved1Bytes = GeneratorUtils.uintToBuffer(this.getEntityBody_Reserved1(), 4);
        newArray = GeneratorUtils.concatTypedArrays(newArray, entityBody_Reserved1Bytes);
        const versionBytes = GeneratorUtils.uintToBuffer(this.getVersion(), 1);
        newArray = GeneratorUtils.concatTypedArrays(newArray, versionBytes);
        const networkBytes = GeneratorUtils.uintToBuffer(this.network, 1);
        newArray = GeneratorUtils.concatTypedArrays(newArray, networkBytes);
        const typeBytes = GeneratorUtils.uintToBuffer(this.type, 2);
        newArray = GeneratorUtils.concatTypedArrays(newArray, typeBytes);
        return newArray;
    }
}
