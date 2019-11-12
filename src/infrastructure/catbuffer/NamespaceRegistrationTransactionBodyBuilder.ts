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
import { GeneratorUtils } from './GeneratorUtils';
import { NamespaceIdDto } from './NamespaceIdDto';
import { NamespaceRegistrationTypeDto } from './NamespaceRegistrationTypeDto';

/** Binary layout for a namespace registration transaction. */
export class NamespaceRegistrationTransactionBodyBuilder {
    /** Namespace duration. */
    duration?: BlockDurationDto;
    /** Parent namespace identifier. */
    parentId?: NamespaceIdDto;
    /** Namespace identifier. */
    id: NamespaceIdDto;
    /** Namespace registration type. */
    registrationType: NamespaceRegistrationTypeDto;
    /** Namespace name. */
    name: Uint8Array;

    /**
     * Constructor.
     *
     * @param duration Namespace duration.
     * @param parentId Parent namespace identifier.
     * @param id Namespace identifier.
     * @param name Namespace name.
     */
    public constructor(id: NamespaceIdDto,  name: Uint8Array,  duration?: BlockDurationDto,  parentId?: NamespaceIdDto) {
        if ((duration && parentId) || (!duration && !parentId)) {
            throw new Error('Invalid conditional parameters');
        }
        this.duration = duration;
        this.parentId = parentId;
        this.id = id;
        this.name = name;
        if (duration) {
            this.registrationType = NamespaceRegistrationTypeDto.ROOT;
        }
        if (parentId) {
            this.registrationType = NamespaceRegistrationTypeDto.CHILD;
        }
    }

    /**
     * Creates an instance of NamespaceRegistrationTransactionBodyBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of NamespaceRegistrationTransactionBodyBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): NamespaceRegistrationTransactionBodyBuilder {
        const byteArray = Array.from(payload);
        const registrationTypeConditionBytes = Uint8Array.from(byteArray.slice(0, 8));
        byteArray.splice(0, 8);
        const id = NamespaceIdDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, id.getSize());
        const registrationType = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 1));
        byteArray.splice(0, 1);
        const nameSize = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 1));
        byteArray.splice(0, 1);
        const name = GeneratorUtils.getBytes(Uint8Array.from(byteArray), nameSize);
        byteArray.splice(0, nameSize);
        let duration;
        if (registrationType === NamespaceRegistrationTypeDto.ROOT) {
            duration = BlockDurationDto.loadFromBinary(registrationTypeConditionBytes);
        }
        let parentId;
        if (registrationType === NamespaceRegistrationTypeDto.CHILD) {
            parentId = NamespaceIdDto.loadFromBinary(registrationTypeConditionBytes);
        }
        return new NamespaceRegistrationTransactionBodyBuilder(id, name, duration, parentId);
    }

    /**
     * Gets namespace duration.
     *
     * @return Namespace duration.
     */
    public getDuration(): BlockDurationDto | undefined {
        if (this.registrationType !== NamespaceRegistrationTypeDto.ROOT) {
            throw new Error('registrationType is not set to ROOT.');
        }
        return this.duration;
    }

    /**
     * Gets parent namespace identifier.
     *
     * @return Parent namespace identifier.
     */
    public getParentId(): NamespaceIdDto | undefined {
        if (this.registrationType !== NamespaceRegistrationTypeDto.CHILD) {
            throw new Error('registrationType is not set to CHILD.');
        }
        return this.parentId;
    }

    /**
     * Gets namespace identifier.
     *
     * @return Namespace identifier.
     */
    public getId(): NamespaceIdDto {
        return this.id;
    }

    /**
     * Gets namespace registration type.
     *
     * @return Namespace registration type.
     */
    public getRegistrationType(): NamespaceRegistrationTypeDto {
        return this.registrationType;
    }

    /**
     * Gets namespace name.
     *
     * @return Namespace name.
     */
    public getName(): Uint8Array {
        return this.name;
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size = 0;
        if (this.registrationType === NamespaceRegistrationTypeDto.ROOT) {
            size += this.duration!.getSize();
        }
        if (this.registrationType === NamespaceRegistrationTypeDto.CHILD) {
            size += this.parentId!.getSize();
        }
        size += this.id.getSize();
        size += 1; // registrationType
        size += 1; // nameSize
        size += this.name.length;
        return size;
    }

    /**
     * Serializes an object to bytes.
     *
     * @return Serialized bytes.
     */
    public serialize(): Uint8Array {
        let newArray = Uint8Array.from([]);
        if (this.registrationType === NamespaceRegistrationTypeDto.ROOT) {
            const durationBytes = this.duration!.serialize();
            newArray = GeneratorUtils.concatTypedArrays(newArray, durationBytes);
        }
        if (this.registrationType === NamespaceRegistrationTypeDto.CHILD) {
            const parentIdBytes = this.parentId!.serialize();
            newArray = GeneratorUtils.concatTypedArrays(newArray, parentIdBytes);
        }
        const idBytes = this.id.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, idBytes);
        const registrationTypeBytes = GeneratorUtils.uintToBuffer(this.registrationType, 1);
        newArray = GeneratorUtils.concatTypedArrays(newArray, registrationTypeBytes);
        const nameSizeBytes = GeneratorUtils.uintToBuffer(this.name.length, 1);
        newArray = GeneratorUtils.concatTypedArrays(newArray, nameSizeBytes);
        newArray = GeneratorUtils.concatTypedArrays(newArray, this.name);
        return newArray;
    }
}
