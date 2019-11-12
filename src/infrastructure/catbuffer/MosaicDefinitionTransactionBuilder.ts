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
import { BlockDurationDto } from './BlockDurationDto';
import { EntityTypeDto } from './EntityTypeDto';
import { GeneratorUtils } from './GeneratorUtils';
import { KeyDto } from './KeyDto';
import { MosaicDefinitionTransactionBodyBuilder } from './MosaicDefinitionTransactionBodyBuilder';
import { MosaicIdDto } from './MosaicIdDto';
import { MosaicNonceDto } from './MosaicNonceDto';
import { NetworkTypeDto } from './NetworkTypeDto';
import { SignatureDto } from './SignatureDto';
import { TimestampDto } from './TimestampDto';
import { TransactionBuilder } from './TransactionBuilder';

/** Binary layout for a non-embedded mosaic definition transaction. */
export class MosaicDefinitionTransactionBuilder extends TransactionBuilder {
    /** Mosaic definition transaction body. */
    mosaicDefinitionTransactionBody: MosaicDefinitionTransactionBodyBuilder;

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
     * @param id Mosaic identifier.
     * @param duration Mosaic duration.
     * @param nonce Mosaic nonce.
     * @param flags Mosaic flags.
     * @param divisibility Mosaic divisibility.
     */
    // tslint:disable-next-line: max-line-length
    public constructor(signature: SignatureDto,  signerPublicKey: KeyDto,  version: number,  network: NetworkTypeDto,  type: EntityTypeDto,  fee: AmountDto,  deadline: TimestampDto,  id: MosaicIdDto,  duration: BlockDurationDto,  nonce: MosaicNonceDto,  flags: number,  divisibility: number) {
        super(signature, signerPublicKey, version, network, type, fee, deadline);
        // tslint:disable-next-line: max-line-length
        this.mosaicDefinitionTransactionBody = new MosaicDefinitionTransactionBodyBuilder(id, duration, nonce, flags, divisibility);
    }

    /**
     * Creates an instance of MosaicDefinitionTransactionBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of MosaicDefinitionTransactionBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): MosaicDefinitionTransactionBuilder {
        const byteArray = Array.from(payload);
        const superObject = TransactionBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, superObject.getSize());
        // tslint:disable-next-line: max-line-length
        const mosaicDefinitionTransactionBody = MosaicDefinitionTransactionBodyBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, mosaicDefinitionTransactionBody.getSize());
        // tslint:disable-next-line: max-line-length
        return new MosaicDefinitionTransactionBuilder(superObject.signature, superObject.signerPublicKey, superObject.version, superObject.network, superObject.type, superObject.fee, superObject.deadline, mosaicDefinitionTransactionBody.id, mosaicDefinitionTransactionBody.duration, mosaicDefinitionTransactionBody.nonce, mosaicDefinitionTransactionBody.flags, mosaicDefinitionTransactionBody.divisibility);
    }

    /**
     * Gets mosaic identifier.
     *
     * @return Mosaic identifier.
     */
    public getId(): MosaicIdDto {
        return this.mosaicDefinitionTransactionBody.getId();
    }

    /**
     * Gets mosaic duration.
     *
     * @return Mosaic duration.
     */
    public getDuration(): BlockDurationDto {
        return this.mosaicDefinitionTransactionBody.getDuration();
    }

    /**
     * Gets mosaic nonce.
     *
     * @return Mosaic nonce.
     */
    public getNonce(): MosaicNonceDto {
        return this.mosaicDefinitionTransactionBody.getNonce();
    }

    /**
     * Gets mosaic flags.
     *
     * @return Mosaic flags.
     */
    public getFlags(): number {
        return this.mosaicDefinitionTransactionBody.getFlags();
    }

    /**
     * Gets mosaic divisibility.
     *
     * @return Mosaic divisibility.
     */
    public getDivisibility(): number {
        return this.mosaicDefinitionTransactionBody.getDivisibility();
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size: number = super.getSize();
        size += this.mosaicDefinitionTransactionBody.getSize();
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
        const mosaicDefinitionTransactionBodyBytes = this.mosaicDefinitionTransactionBody.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, mosaicDefinitionTransactionBodyBytes);
        return newArray;
    }
}
