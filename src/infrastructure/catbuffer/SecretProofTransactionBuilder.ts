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
import { Hash256Dto } from './Hash256Dto';
import { KeyDto } from './KeyDto';
import { LockHashAlgorithmDto } from './LockHashAlgorithmDto';
import { NetworkTypeDto } from './NetworkTypeDto';
import { SecretProofTransactionBodyBuilder } from './SecretProofTransactionBodyBuilder';
import { SignatureDto } from './SignatureDto';
import { TimestampDto } from './TimestampDto';
import { TransactionBuilder } from './TransactionBuilder';
import { UnresolvedAddressDto } from './UnresolvedAddressDto';

/** Binary layout for a non-embedded secret proof transaction. */
export class SecretProofTransactionBuilder extends TransactionBuilder {
    /** Secret proof transaction body. */
    secretProofTransactionBody: SecretProofTransactionBodyBuilder;

    /**
     * Constructor.
     *
     * @param signature Entity signature.
     * @param signerPublicKey Entity signer's public key.
     * @param version Entity version.
     * @param network Entity network.
     * @param type Entity type.
     * @param fee Transaction fee.
     * @param deadline Transaction deadline.
     * @param secret Secret.
     * @param hashAlgorithm Hash algorithm.
     * @param recipientAddress Locked mosaic recipient address.
     * @param proof Proof data.
     */
    // tslint:disable-next-line: max-line-length
    public constructor(signature: SignatureDto,  signerPublicKey: KeyDto,  version: number,  network: NetworkTypeDto,  type: EntityTypeDto,  fee: AmountDto,  deadline: TimestampDto,  secret: Hash256Dto,  hashAlgorithm: LockHashAlgorithmDto,  recipientAddress: UnresolvedAddressDto,  proof: Uint8Array) {
        super(signature, signerPublicKey, version, network, type, fee, deadline);
        this.secretProofTransactionBody = new SecretProofTransactionBodyBuilder(secret, hashAlgorithm, recipientAddress, proof);
    }

    /**
     * Creates an instance of SecretProofTransactionBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of SecretProofTransactionBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): SecretProofTransactionBuilder {
        const byteArray = Array.from(payload);
        const superObject = TransactionBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, superObject.getSize());
        const secretProofTransactionBody = SecretProofTransactionBodyBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, secretProofTransactionBody.getSize());
        // tslint:disable-next-line: max-line-length
        return new SecretProofTransactionBuilder(superObject.signature, superObject.signerPublicKey, superObject.version, superObject.network, superObject.type, superObject.fee, superObject.deadline, secretProofTransactionBody.secret, secretProofTransactionBody.hashAlgorithm, secretProofTransactionBody.recipientAddress, secretProofTransactionBody.proof);
    }

    /**
     * Gets secret.
     *
     * @return Secret.
     */
    public getSecret(): Hash256Dto {
        return this.secretProofTransactionBody.getSecret();
    }

    /**
     * Gets hash algorithm.
     *
     * @return Hash algorithm.
     */
    public getHashAlgorithm(): LockHashAlgorithmDto {
        return this.secretProofTransactionBody.getHashAlgorithm();
    }

    /**
     * Gets locked mosaic recipient address.
     *
     * @return Locked mosaic recipient address.
     */
    public getRecipientAddress(): UnresolvedAddressDto {
        return this.secretProofTransactionBody.getRecipientAddress();
    }

    /**
     * Gets proof data.
     *
     * @return Proof data.
     */
    public getProof(): Uint8Array {
        return this.secretProofTransactionBody.getProof();
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size: number = super.getSize();
        size += this.secretProofTransactionBody.getSize();
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
        const secretProofTransactionBodyBytes = this.secretProofTransactionBody.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, secretProofTransactionBodyBytes);
        return newArray;
    }
}
