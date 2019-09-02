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

import { AccountMetadataTransactionBodyBuilder } from './AccountMetadataTransactionBodyBuilder';
import { EmbeddedTransactionBuilder } from './EmbeddedTransactionBuilder';
import { EntityTypeDto } from './EntityTypeDto';
import { GeneratorUtils } from './GeneratorUtils';
import { KeyDto } from './KeyDto';

/** Binary layout for an embedded account metadata transaction. */
export class EmbeddedAccountMetadataTransactionBuilder extends EmbeddedTransactionBuilder {
    /** Account metadata transaction body. */
    accountMetadataTransactionBody: AccountMetadataTransactionBodyBuilder;

    /**
     * Constructor.
     *
     * @param signer Entity signer's public key.
     * @param version Entity version.
     * @param type Entity type.
     * @param targetPublicKey Metadata target public key.
     * @param scopedMetadataKey Metadata key scoped to source, target and type.
     * @param valueSizeDelta Change in value size in bytes.
     * @param value Difference between existing value and new value.
     * @note when there is no existing value, new value is same this value.
     * @note when there is an existing value, new value is calculated as xor(previous-value, value).
     */
    // tslint:disable-next-line: max-line-length
    public constructor(signer: KeyDto,  version: number,  type: EntityTypeDto,  targetPublicKey: KeyDto,  scopedMetadataKey: number[],  valueSizeDelta: number,  value: Uint8Array) {
        super(signer, version, type);
        // tslint:disable-next-line: max-line-length
        this.accountMetadataTransactionBody = new AccountMetadataTransactionBodyBuilder(targetPublicKey, scopedMetadataKey, valueSizeDelta, value);
    }

    /**
     * Creates an instance of EmbeddedAccountMetadataTransactionBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of EmbeddedAccountMetadataTransactionBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): EmbeddedAccountMetadataTransactionBuilder {
        const byteArray = Array.from(payload);
        const superObject = EmbeddedTransactionBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, superObject.getSize());
        const accountMetadataTransactionBody = AccountMetadataTransactionBodyBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, accountMetadataTransactionBody.getSize());
        // tslint:disable-next-line: max-line-length
        return new EmbeddedAccountMetadataTransactionBuilder(superObject.signer, superObject.version, superObject.type, accountMetadataTransactionBody.targetPublicKey, accountMetadataTransactionBody.scopedMetadataKey, accountMetadataTransactionBody.valueSizeDelta, accountMetadataTransactionBody.value);
    }

    /**
     * Gets metadata target public key.
     *
     * @return Metadata target public key.
     */
    public getTargetPublicKey(): KeyDto {
        return this.accountMetadataTransactionBody.getTargetPublicKey();
    }

    /**
     * Gets metadata key scoped to source, target and type.
     *
     * @return Metadata key scoped to source, target and type.
     */
    public getScopedMetadataKey(): number[] {
        return this.accountMetadataTransactionBody.getScopedMetadataKey();
    }

    /**
     * Gets change in value size in bytes.
     *
     * @return Change in value size in bytes.
     */
    public getValueSizeDelta(): number {
        return this.accountMetadataTransactionBody.getValueSizeDelta();
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
        return this.accountMetadataTransactionBody.getValue();
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size: number = super.getSize();
        size += this.accountMetadataTransactionBody.getSize();
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
        const accountMetadataTransactionBodyBytes = this.accountMetadataTransactionBody.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, accountMetadataTransactionBodyBytes);
        return newArray;
    }
}
