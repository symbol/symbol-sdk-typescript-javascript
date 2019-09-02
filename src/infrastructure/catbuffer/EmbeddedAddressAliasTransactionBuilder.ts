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

import { AddressAliasTransactionBodyBuilder } from './AddressAliasTransactionBodyBuilder';
import { AddressDto } from './AddressDto';
import { AliasActionDto } from './AliasActionDto';
import { EmbeddedTransactionBuilder } from './EmbeddedTransactionBuilder';
import { EntityTypeDto } from './EntityTypeDto';
import { GeneratorUtils } from './GeneratorUtils';
import { KeyDto } from './KeyDto';
import { NamespaceIdDto } from './NamespaceIdDto';

/** Binary layout for an embedded address alias transaction. */
export class EmbeddedAddressAliasTransactionBuilder extends EmbeddedTransactionBuilder {
    /** Address alias transaction body. */
    addressAliasTransactionBody: AddressAliasTransactionBodyBuilder;

    /**
     * Constructor.
     *
     * @param signer Entity signer's public key.
     * @param version Entity version.
     * @param type Entity type.
     * @param aliasAction Alias action.
     * @param namespaceId Identifier of the namespace that will become an alias.
     * @param address Aliased address.
     */
    // tslint:disable-next-line: max-line-length
    public constructor(signer: KeyDto,  version: number,  type: EntityTypeDto,  aliasAction: AliasActionDto,  namespaceId: NamespaceIdDto,  address: AddressDto) {
        super(signer, version, type);
        this.addressAliasTransactionBody = new AddressAliasTransactionBodyBuilder(aliasAction, namespaceId, address);
    }

    /**
     * Creates an instance of EmbeddedAddressAliasTransactionBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of EmbeddedAddressAliasTransactionBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): EmbeddedAddressAliasTransactionBuilder {
        const byteArray = Array.from(payload);
        const superObject = EmbeddedTransactionBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, superObject.getSize());
        const addressAliasTransactionBody = AddressAliasTransactionBodyBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, addressAliasTransactionBody.getSize());
        // tslint:disable-next-line: max-line-length
        return new EmbeddedAddressAliasTransactionBuilder(superObject.signer, superObject.version, superObject.type, addressAliasTransactionBody.aliasAction, addressAliasTransactionBody.namespaceId, addressAliasTransactionBody.address);
    }

    /**
     * Gets alias action.
     *
     * @return Alias action.
     */
    public getAliasAction(): AliasActionDto {
        return this.addressAliasTransactionBody.getAliasAction();
    }

    /**
     * Gets identifier of the namespace that will become an alias.
     *
     * @return Identifier of the namespace that will become an alias.
     */
    public getNamespaceId(): NamespaceIdDto {
        return this.addressAliasTransactionBody.getNamespaceId();
    }

    /**
     * Gets aliased address.
     *
     * @return Aliased address.
     */
    public getAddress(): AddressDto {
        return this.addressAliasTransactionBody.getAddress();
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size: number = super.getSize();
        size += this.addressAliasTransactionBody.getSize();
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
        const addressAliasTransactionBodyBytes = this.addressAliasTransactionBody.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, addressAliasTransactionBodyBytes);
        return newArray;
    }
}
