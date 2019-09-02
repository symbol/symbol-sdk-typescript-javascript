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

import { CosignatureBuilder } from './CosignatureBuilder';
import { GeneratorUtils } from './GeneratorUtils';
import { Hash256Dto } from './Hash256Dto';
import { KeyDto } from './KeyDto';
import { SignatureDto } from './SignatureDto';

/** Cosignature detached from an aggregate transaction. */
export class DetachedCosignatureBuilder extends CosignatureBuilder {
    /** Hash of the aggregate transaction that is signed by this cosignature. */
    parentHash: Hash256Dto;

    /**
     * Constructor.
     *
     * @param signerPublicKey Cosigner public key.
     * @param signature Cosigner signature.
     * @param parentHash Hash of the aggregate transaction that is signed by this cosignature.
     */
    public constructor(signerPublicKey: KeyDto,  signature: SignatureDto,  parentHash: Hash256Dto) {
        super(signerPublicKey, signature);
        this.parentHash = parentHash;
    }

    /**
     * Creates an instance of DetachedCosignatureBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of DetachedCosignatureBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): DetachedCosignatureBuilder {
        const byteArray = Array.from(payload);
        const superObject = CosignatureBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, superObject.getSize());
        const parentHash = Hash256Dto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, parentHash.getSize());
        return new DetachedCosignatureBuilder(superObject.signerPublicKey, superObject.signature, parentHash);
    }

    /**
     * Gets hash of the aggregate transaction that is signed by this cosignature.
     *
     * @return Hash of the aggregate transaction that is signed by this cosignature.
     */
    public getParentHash(): Hash256Dto {
        return this.parentHash;
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size: number = super.getSize();
        size += this.parentHash.getSize();
        return size;
    }

    /**
     * Serializes an object to bytes.
     *
     * @return Serialized bytes.
     */
    public serialize(): Uint8Array {
        let newArray = Uint8Array.from([]);
        const superBytes = super.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, superBytes);
        const parentHashBytes = this.parentHash.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, parentHashBytes);
        return newArray;
    }
}
