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
import { NamespaceIdDto } from './NamespaceIdDto';
import { ReceiptBuilder } from './ReceiptBuilder';
import { ReceiptTypeDto } from './ReceiptTypeDto';

/** Binary layout for a namespace expiry receipt. */
export class NamespaceExpiryReceiptBuilder extends ReceiptBuilder {
    /** Expiring namespace id. */
    artifactId: NamespaceIdDto;

    /**
     * Constructor.
     *
     * @param version Receipt version.
     * @param type Receipt type.
     * @param artifactId Expiring namespace id.
     */
    public constructor(version: number,  type: ReceiptTypeDto,  artifactId: NamespaceIdDto) {
        super(version, type);
        this.artifactId = artifactId;
    }

    /**
     * Creates an instance of NamespaceExpiryReceiptBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of NamespaceExpiryReceiptBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): NamespaceExpiryReceiptBuilder {
        const byteArray = Array.from(payload);
        const superObject = ReceiptBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, superObject.getSize());
        const artifactId = NamespaceIdDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, artifactId.getSize());
        return new NamespaceExpiryReceiptBuilder(superObject.version, superObject.type, artifactId);
    }

    /**
     * Gets expiring namespace id.
     *
     * @return Expiring namespace id.
     */
    public getArtifactId(): NamespaceIdDto {
        return this.artifactId;
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size: number = super.getSize();
        size += this.artifactId.getSize();
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
        const artifactIdBytes = this.artifactId.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, artifactIdBytes);
        return newArray;
    }
}
