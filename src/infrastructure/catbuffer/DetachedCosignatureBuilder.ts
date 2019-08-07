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
import { KeyDto } from './KeyDto';
import { SignatureDto } from './SignatureDto';
import { CosignatureBuilder } from './CosignatureBuilder';
import { Hash256Dto } from './Hash256Dto';

/** a detached cosignature. */
export class DetachedCosignatureBuilder extends CosignatureBuilder {
    /** hash of the corresponding parent. */
    parentHash: Hash256Dto;

    /**
     * Constructor.
     *
     * @param signer cosigner public key.
     * @param signature cosigner signature.
     * @param parentHash hash of the corresponding parent.
     */
    public constructor(signer: KeyDto, signature: SignatureDto, parentHash: Hash256Dto) {
        super(signer, signature);
        this.parentHash = parentHash;
    }

    /**
     * loadFromBinary - Create an instance of DetachedCosignatureBuilder from a stream.
     *
     * @param payload Byte to use to serialize the object.
     * @return An instance of DetachedCosignatureBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): DetachedCosignatureBuilder {
        const byteArray = Array.from(payload);
        const signer = KeyDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, signer.getSize());
        const signature = SignatureDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, signature.getSize());
        const parentHash = Hash256Dto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, parentHash.getSize());
        return new DetachedCosignatureBuilder(signer, signature, parentHash);
    }

    /**
     * Get hash of the corresponding parent.
     *
     * @return hash of the corresponding parent.
     */
    public getParentHash(): Hash256Dto {
        return this.parentHash;
    }

    /**
     * Get the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size = super.getSize();
        size += this.parentHash.getSize();
        return size;
    }

    /**
     * Serialize the object to bytes.
     *
     * @return Serialized bytes.
     */
    public serialize(): Uint8Array {
        let newArray = Uint8Array.from([]);
        const signerBytes = this.signer.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, signerBytes);
        const signatureBytes = this.signature.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, signatureBytes);
        const parentHashBytes = this.parentHash.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, parentHashBytes);
        return newArray;
    }
}
