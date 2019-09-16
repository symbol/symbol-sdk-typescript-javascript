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
import { EmbeddedTransactionBuilder } from './EmbeddedTransactionBuilder';
import { EntityTypeDto } from './EntityTypeDto';
import { GeneratorUtils } from './GeneratorUtils';
import { Hash256Dto } from './Hash256Dto';
import { KeyDto } from './KeyDto';
import { LockHashAlgorithmDto } from './LockHashAlgorithmDto';
import { SecretLockTransactionBodyBuilder } from './SecretLockTransactionBodyBuilder';
import { UnresolvedAddressDto } from './UnresolvedAddressDto';
import { UnresolvedMosaicBuilder } from './UnresolvedMosaicBuilder';

/** Binary layout for an embedded secret lock transaction. */
export class EmbeddedSecretLockTransactionBuilder extends EmbeddedTransactionBuilder {
    /** Secret lock transaction body. */
    secretLockTransactionBody: SecretLockTransactionBodyBuilder;

    /**
     * Constructor.
     *
     * @param signerPublicKey Entity signer's public key.
     * @param version Entity version.
     * @param type Entity type.
     * @param mosaic Locked mosaic.
     * @param duration Number of blocks for which a lock should be valid.
     * @param hashAlgorithm Hash algorithm.
     * @param secret Secret.
     * @param recipientAddress Locked mosaic recipient address.
     */
    // tslint:disable-next-line: max-line-length
    public constructor(signerPublicKey: KeyDto,  version: number,  type: EntityTypeDto,  mosaic: UnresolvedMosaicBuilder,  duration: BlockDurationDto,  hashAlgorithm: LockHashAlgorithmDto,  secret: Hash256Dto,  recipientAddress: UnresolvedAddressDto) {
        super(signerPublicKey, version, type);
        // tslint:disable-next-line: max-line-length
        this.secretLockTransactionBody = new SecretLockTransactionBodyBuilder(mosaic, duration, hashAlgorithm, secret, recipientAddress);
    }

    /**
     * Creates an instance of EmbeddedSecretLockTransactionBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of EmbeddedSecretLockTransactionBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): EmbeddedSecretLockTransactionBuilder {
        const byteArray = Array.from(payload);
        const superObject = EmbeddedTransactionBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, superObject.getSize());
        const secretLockTransactionBody = SecretLockTransactionBodyBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, secretLockTransactionBody.getSize());
        // tslint:disable-next-line: max-line-length
        return new EmbeddedSecretLockTransactionBuilder(superObject.signerPublicKey, superObject.version, superObject.type, secretLockTransactionBody.mosaic, secretLockTransactionBody.duration, secretLockTransactionBody.hashAlgorithm, secretLockTransactionBody.secret, secretLockTransactionBody.recipientAddress);
    }

    /**
     * Gets locked mosaic.
     *
     * @return Locked mosaic.
     */
    public getMosaic(): UnresolvedMosaicBuilder {
        return this.secretLockTransactionBody.getMosaic();
    }

    /**
     * Gets number of blocks for which a lock should be valid.
     *
     * @return Number of blocks for which a lock should be valid.
     */
    public getDuration(): BlockDurationDto {
        return this.secretLockTransactionBody.getDuration();
    }

    /**
     * Gets hash algorithm.
     *
     * @return Hash algorithm.
     */
    public getHashAlgorithm(): LockHashAlgorithmDto {
        return this.secretLockTransactionBody.getHashAlgorithm();
    }

    /**
     * Gets secret.
     *
     * @return Secret.
     */
    public getSecret(): Hash256Dto {
        return this.secretLockTransactionBody.getSecret();
    }

    /**
     * Gets locked mosaic recipient address.
     *
     * @return Locked mosaic recipient address.
     */
    public getRecipientAddress(): UnresolvedAddressDto {
        return this.secretLockTransactionBody.getRecipientAddress();
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size: number = super.getSize();
        size += this.secretLockTransactionBody.getSize();
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
        const secretLockTransactionBodyBytes = this.secretLockTransactionBody.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, secretLockTransactionBodyBytes);
        return newArray;
    }
}
