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
import { KeyDto } from './KeyDto';
import { NamespaceIdDto } from './NamespaceIdDto';
import { NamespaceRegistrationTransactionBodyBuilder } from './NamespaceRegistrationTransactionBodyBuilder';
import { NamespaceRegistrationTypeDto } from './NamespaceRegistrationTypeDto';

/** Binary layout for an embedded namespace registration transaction. */
export class EmbeddedNamespaceRegistrationTransactionBuilder extends EmbeddedTransactionBuilder {
    /** Namespace registration transaction body. */
    namespaceRegistrationTransactionBody: NamespaceRegistrationTransactionBodyBuilder;

    /**
     * Constructor.
     *
     * @param signer Entity signer's public key.
     * @param version Entity version.
     * @param type Entity type.
     * @param duration Namespace duration.
     * @param parentId Parent namespace identifier.
     * @param id Namespace identifier.
     * @param name Namespace name.
     */
    // tslint:disable-next-line: max-line-length
    public constructor(signer: KeyDto,  version: number,  type: EntityTypeDto,  id: NamespaceIdDto,  name: Uint8Array,  duration?: BlockDurationDto,  parentId?: NamespaceIdDto) {
        super(signer, version, type);
        if ((duration && parentId) || (!duration && !parentId)) {
            throw new Error('Invalid conditional parameters');
        }
        // tslint:disable-next-line: max-line-length
        this.namespaceRegistrationTransactionBody = new NamespaceRegistrationTransactionBodyBuilder(id, name, duration, parentId);
    }

    /**
     * Creates an instance of EmbeddedNamespaceRegistrationTransactionBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of EmbeddedNamespaceRegistrationTransactionBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): EmbeddedNamespaceRegistrationTransactionBuilder {
        const byteArray = Array.from(payload);
        const superObject = EmbeddedTransactionBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, superObject.getSize());
        // tslint:disable-next-line: max-line-length
        const namespaceRegistrationTransactionBody = NamespaceRegistrationTransactionBodyBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, namespaceRegistrationTransactionBody.getSize());
        // tslint:disable-next-line: max-line-length
        return new EmbeddedNamespaceRegistrationTransactionBuilder(superObject.signer, superObject.version, superObject.type, namespaceRegistrationTransactionBody.id, namespaceRegistrationTransactionBody.name, namespaceRegistrationTransactionBody.duration, namespaceRegistrationTransactionBody.parentId);
    }

    /**
     * Gets namespace registration type.
     *
     * @return Namespace registration type.
     */
    public getRegistrationType(): NamespaceRegistrationTypeDto {
        return this.namespaceRegistrationTransactionBody.getRegistrationType();
    }

    /**
     * Gets namespace duration.
     *
     * @return Namespace duration.
     */
    public getDuration(): BlockDurationDto | undefined {
        return this.namespaceRegistrationTransactionBody.getDuration();
    }

    /**
     * Gets parent namespace identifier.
     *
     * @return Parent namespace identifier.
     */
    public getParentId(): NamespaceIdDto | undefined {
        return this.namespaceRegistrationTransactionBody.getParentId();
    }

    /**
     * Gets namespace identifier.
     *
     * @return Namespace identifier.
     */
    public getId(): NamespaceIdDto {
        return this.namespaceRegistrationTransactionBody.getId();
    }

    /**
     * Gets namespace name.
     *
     * @return Namespace name.
     */
    public getName(): Uint8Array {
        return this.namespaceRegistrationTransactionBody.getName();
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size: number = super.getSize();
        size += this.namespaceRegistrationTransactionBody.getSize();
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
        const namespaceRegistrationTransactionBodyBytes = this.namespaceRegistrationTransactionBody.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, namespaceRegistrationTransactionBodyBytes);
        return newArray;
    }
}
