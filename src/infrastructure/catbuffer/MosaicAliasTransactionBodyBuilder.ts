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

import { AliasActionDto } from './AliasActionDto';
import { GeneratorUtils } from './GeneratorUtils';
import { MosaicIdDto } from './MosaicIdDto';
import { NamespaceIdDto } from './NamespaceIdDto';

/** Binary layout for an mosaic alias transaction. */
export class MosaicAliasTransactionBodyBuilder {
    /** Alias action. */
    aliasAction: AliasActionDto;
    /** Identifier of the namespace that will become an alias. */
    namespaceId: NamespaceIdDto;
    /** Aliased mosaic identifier. */
    mosaicId: MosaicIdDto;

    /**
     * Constructor.
     *
     * @param aliasAction Alias action.
     * @param namespaceId Identifier of the namespace that will become an alias.
     * @param mosaicId Aliased mosaic identifier.
     */
    public constructor(aliasAction: AliasActionDto,  namespaceId: NamespaceIdDto,  mosaicId: MosaicIdDto) {
        this.aliasAction = aliasAction;
        this.namespaceId = namespaceId;
        this.mosaicId = mosaicId;
    }

    /**
     * Creates an instance of MosaicAliasTransactionBodyBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of MosaicAliasTransactionBodyBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): MosaicAliasTransactionBodyBuilder {
        const byteArray = Array.from(payload);
        const aliasAction = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 1));
        byteArray.splice(0, 1);
        const namespaceId = NamespaceIdDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, namespaceId.getSize());
        const mosaicId = MosaicIdDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, mosaicId.getSize());
        return new MosaicAliasTransactionBodyBuilder(aliasAction, namespaceId, mosaicId);
    }

    /**
     * Gets alias action.
     *
     * @return Alias action.
     */
    public getAliasAction(): AliasActionDto {
        return this.aliasAction;
    }

    /**
     * Gets identifier of the namespace that will become an alias.
     *
     * @return Identifier of the namespace that will become an alias.
     */
    public getNamespaceId(): NamespaceIdDto {
        return this.namespaceId;
    }

    /**
     * Gets aliased mosaic identifier.
     *
     * @return Aliased mosaic identifier.
     */
    public getMosaicId(): MosaicIdDto {
        return this.mosaicId;
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size = 0;
        size += 1; // aliasAction
        size += this.namespaceId.getSize();
        size += this.mosaicId.getSize();
        return size;
    }

    /**
     * Serializes an object to bytes.
     *
     * @return Serialized bytes.
     */
    public serialize(): Uint8Array {
        let newArray = Uint8Array.from([]);
        const aliasActionBytes = GeneratorUtils.uintToBuffer(this.aliasAction, 1);
        newArray = GeneratorUtils.concatTypedArrays(newArray, aliasActionBytes);
        const namespaceIdBytes = this.namespaceId.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, namespaceIdBytes);
        const mosaicIdBytes = this.mosaicId.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, mosaicIdBytes);
        return newArray;
    }
}
