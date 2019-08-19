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

/** Cosignature attached to an aggregate transaction. */
export class CosignatureBuilder {
    /** Cosigner public key. */
    signer: KeyDto;
    /** Cosigner signature. */
    signature: SignatureDto;

    /**
     * Constructor.
     *
     * @param signer Cosigner public key.
     * @param signature Cosigner signature.
     */
    public constructor(signer: KeyDto,  signature: SignatureDto) {
        this.signer = signer;
        this.signature = signature;
    }

    /**
     * Creates an instance of CosignatureBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of CosignatureBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): CosignatureBuilder {
        const byteArray = Array.from(payload);
        const signer = KeyDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, signer.getSize());
        const signature = SignatureDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, signature.getSize());
        return new CosignatureBuilder(signer, signature);
    }

    /**
     * Gets cosigner public key.
     *
     * @return Cosigner public key.
     */
    public getSigner(): KeyDto {
        return this.signer;
    }

    /**
     * Gets cosigner signature.
     *
     * @return Cosigner signature.
     */
    public getSignature(): SignatureDto {
        return this.signature;
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size = 0;
        size += this.signer.getSize();
        size += this.signature.getSize();
        return size;
    }

    /**
     * Serializes an object to bytes.
     *
     * @return Serialized bytes.
     */
    public serialize(): Uint8Array {
        let newArray = Uint8Array.from([]);
        const signerBytes = this.signer.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, signerBytes);
        const signatureBytes = this.signature.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, signatureBytes);
        return newArray;
    }
}
