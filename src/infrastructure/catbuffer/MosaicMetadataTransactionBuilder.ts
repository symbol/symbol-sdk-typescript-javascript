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
import { KeyDto } from './KeyDto';
import { MosaicMetadataTransactionBodyBuilder } from './MosaicMetadataTransactionBodyBuilder';
import { SignatureDto } from './SignatureDto';
import { TimestampDto } from './TimestampDto';
import { TransactionBuilder } from './TransactionBuilder';
import { UnresolvedMosaicIdDto } from './UnresolvedMosaicIdDto';

/** Binary layout for a non-embedded mosaic metadata transaction. */
export class MosaicMetadataTransactionBuilder extends TransactionBuilder {
    /** Mosaic metadata transaction body. */
    mosaicMetadataTransactionBody: MosaicMetadataTransactionBodyBuilder;

    /**
     * Constructor.
     *
     * @param signature Entity signature.
     * @param signer Entity signer's public key.
     * @param version Entity version.
     * @param type Entity type.
     * @param fee Transaction fee.
     * @param deadline Transaction deadline.
     * @param targetPublicKey Metadata target public key.
     * @param scopedMetadataKey Metadata key scoped to source, target and type.
     * @param targetMosaicId Target mosaic identifier.
     * @param valueSizeDelta Change in value size in bytes.
     * @param value Difference between existing value and new value.
     * @note when there is no existing value, new value is same this value.
     * @note when there is an existing value, new value is calculated as xor(previous-value, value).
     */
    // tslint:disable-next-line: max-line-length
    public constructor(signature: SignatureDto,  signer: KeyDto,  version: number,  type: EntityTypeDto,  fee: AmountDto,  deadline: TimestampDto,  targetPublicKey: KeyDto,  scopedMetadataKey: number[],  targetMosaicId: UnresolvedMosaicIdDto,  valueSizeDelta: number,  value: Uint8Array) {
        super(signature, signer, version, type, fee, deadline);
        // tslint:disable-next-line: max-line-length
        this.mosaicMetadataTransactionBody = new MosaicMetadataTransactionBodyBuilder(targetPublicKey, scopedMetadataKey, targetMosaicId, valueSizeDelta, value);
    }

    /**
     * Creates an instance of MosaicMetadataTransactionBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of MosaicMetadataTransactionBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): MosaicMetadataTransactionBuilder {
        const byteArray = Array.from(payload);
        const superObject = TransactionBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, superObject.getSize());
        const mosaicMetadataTransactionBody = MosaicMetadataTransactionBodyBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, mosaicMetadataTransactionBody.getSize());
        // tslint:disable-next-line: max-line-length
        return new MosaicMetadataTransactionBuilder(superObject.signature, superObject.signer, superObject.version, superObject.type, superObject.fee, superObject.deadline, mosaicMetadataTransactionBody.targetPublicKey, mosaicMetadataTransactionBody.scopedMetadataKey, mosaicMetadataTransactionBody.targetMosaicId, mosaicMetadataTransactionBody.valueSizeDelta, mosaicMetadataTransactionBody.value);
    }

    /**
     * Gets metadata target public key.
     *
     * @return Metadata target public key.
     */
    public getTargetPublicKey(): KeyDto {
        return this.mosaicMetadataTransactionBody.getTargetPublicKey();
    }

    /**
     * Gets metadata key scoped to source, target and type.
     *
     * @return Metadata key scoped to source, target and type.
     */
    public getScopedMetadataKey(): number[] {
        return this.mosaicMetadataTransactionBody.getScopedMetadataKey();
    }

    /**
     * Gets target mosaic identifier.
     *
     * @return Target mosaic identifier.
     */
    public getTargetMosaicId(): UnresolvedMosaicIdDto {
        return this.mosaicMetadataTransactionBody.getTargetMosaicId();
    }

    /**
     * Gets change in value size in bytes.
     *
     * @return Change in value size in bytes.
     */
    public getValueSizeDelta(): number {
        return this.mosaicMetadataTransactionBody.getValueSizeDelta();
    }

    /**
     * Gets difference between existing value and new value.
     * @note when there is no existing value, new value is same this value.
     * @note when there is an existing value, new value is calculated as xor(previous-value, value).
     *
     * @return Difference between existing value and new value.
     * @note when there is no existing value, new value is same this value.
     * @note when there is an existing value, new value is calculated as xor(previous-value, value).
     */
    public getValue(): Uint8Array {
        return this.mosaicMetadataTransactionBody.getValue();
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size: number = super.getSize();
        size += this.mosaicMetadataTransactionBody.getSize();
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
        const mosaicMetadataTransactionBodyBytes = this.mosaicMetadataTransactionBody.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, mosaicMetadataTransactionBodyBytes);
        return newArray;
    }
}
