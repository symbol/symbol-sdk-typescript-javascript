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
    signerPublicKey: KeyDto;
    /** Cosigner signature. */
    signature: SignatureDto;

    /**
     * Constructor.
     *
     * @param signerPublicKey Cosigner public key.
     * @param signature Cosigner signature.
     */
    public constructor(signerPublicKey: KeyDto,  signature: SignatureDto) {
        this.signerPublicKey = signerPublicKey;
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
        const signerPublicKey = KeyDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, signerPublicKey.getSize());
        const signature = SignatureDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, signature.getSize());
        return new CosignatureBuilder(signerPublicKey, signature);
    }

    /**
     * Gets cosigner public key.
     *
     * @return Cosigner public key.
     */
    public getSignerPublicKey(): KeyDto {
        return this.signerPublicKey;
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
        size += this.signerPublicKey.getSize();
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
        const signerPublicKeyBytes = this.signerPublicKey.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, signerPublicKeyBytes);
        const signatureBytes = this.signature.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, signatureBytes);
        return newArray;
    }
}
