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

import { CosignatoryModificationActionDto } from './CosignatoryModificationActionDto';
import { GeneratorUtils } from './GeneratorUtils';
import { KeyDto } from './KeyDto';

/** Binary layout for a cosignatory modification. */
export class CosignatoryModificationBuilder {
    /** Modification action. */
    modificationAction: CosignatoryModificationActionDto;
    /** Cosignatory account public key. */
    cosignatoryPublicKey: KeyDto;

    /**
     * Constructor.
     *
     * @param modificationAction Modification action.
     * @param cosignatoryPublicKey Cosignatory account public key.
     */
    public constructor(modificationAction: CosignatoryModificationActionDto,  cosignatoryPublicKey: KeyDto) {
        this.modificationAction = modificationAction;
        this.cosignatoryPublicKey = cosignatoryPublicKey;
    }

    /**
     * Creates an instance of CosignatoryModificationBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of CosignatoryModificationBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): CosignatoryModificationBuilder {
        const byteArray = Array.from(payload);
        const modificationAction = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 1));
        byteArray.splice(0, 1);
        const cosignatoryPublicKey = KeyDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, cosignatoryPublicKey.getSize());
        return new CosignatoryModificationBuilder(modificationAction, cosignatoryPublicKey);
    }

    /**
     * Gets modification action.
     *
     * @return Modification action.
     */
    public getModificationAction(): CosignatoryModificationActionDto {
        return this.modificationAction;
    }

    /**
     * Gets cosignatory account public key.
     *
     * @return Cosignatory account public key.
     */
    public getCosignatoryPublicKey(): KeyDto {
        return this.cosignatoryPublicKey;
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size = 0;
        size += 1; // modificationAction
        size += this.cosignatoryPublicKey.getSize();
        return size;
    }

    /**
     * Serializes an object to bytes.
     *
     * @return Serialized bytes.
     */
    public serialize(): Uint8Array {
        let newArray = Uint8Array.from([]);
        const modificationActionBytes = GeneratorUtils.uintToBuffer(this.modificationAction, 1);
        newArray = GeneratorUtils.concatTypedArrays(newArray, modificationActionBytes);
        const cosignatoryPublicKeyBytes = this.cosignatoryPublicKey.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, cosignatoryPublicKeyBytes);
        return newArray;
    }
}
