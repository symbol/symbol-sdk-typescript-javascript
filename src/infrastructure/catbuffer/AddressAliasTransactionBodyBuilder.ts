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

import { AddressDto } from './AddressDto';
import { AliasActionDto } from './AliasActionDto';
import { GeneratorUtils } from './GeneratorUtils';
import { NamespaceIdDto } from './NamespaceIdDto';

/** Binary layout for an address alias transaction. */
export class AddressAliasTransactionBodyBuilder {
    /** Identifier of the namespace that will become an alias. */
    namespaceId: NamespaceIdDto;
    /** Aliased address. */
    address: AddressDto;
    /** Alias action. */
    aliasAction: AliasActionDto;

    /**
     * Constructor.
     *
     * @param namespaceId Identifier of the namespace that will become an alias.
     * @param address Aliased address.
     * @param aliasAction Alias action.
     */
    public constructor(namespaceId: NamespaceIdDto,  address: AddressDto,  aliasAction: AliasActionDto) {
        this.namespaceId = namespaceId;
        this.address = address;
        this.aliasAction = aliasAction;
    }

    /**
     * Creates an instance of AddressAliasTransactionBodyBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of AddressAliasTransactionBodyBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): AddressAliasTransactionBodyBuilder {
        const byteArray = Array.from(payload);
        const namespaceId = NamespaceIdDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, namespaceId.getSize());
        const address = AddressDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, address.getSize());
        const aliasAction = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 1));
        byteArray.splice(0, 1);
        return new AddressAliasTransactionBodyBuilder(namespaceId, address, aliasAction);
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
     * Gets aliased address.
     *
     * @return Aliased address.
     */
    public getAddress(): AddressDto {
        return this.address;
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
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size = 0;
        size += this.namespaceId.getSize();
        size += this.address.getSize();
        size += 1; // aliasAction
        return size;
    }

    /**
     * Serializes an object to bytes.
     *
     * @return Serialized bytes.
     */
    public serialize(): Uint8Array {
        let newArray = Uint8Array.from([]);
        const namespaceIdBytes = this.namespaceId.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, namespaceIdBytes);
        const addressBytes = this.address.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, addressBytes);
        const aliasActionBytes = GeneratorUtils.uintToBuffer(this.aliasAction, 1);
        newArray = GeneratorUtils.concatTypedArrays(newArray, aliasActionBytes);
        return newArray;
    }
}
