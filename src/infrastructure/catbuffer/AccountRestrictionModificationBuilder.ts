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

import { AccountRestrictionModificationActionDto } from './AccountRestrictionModificationActionDto';
import { GeneratorUtils } from './GeneratorUtils';

/** Account restriction basic modification. */
export class AccountRestrictionModificationBuilder {
    /** Modification action. */
    modificationAction: AccountRestrictionModificationActionDto;

    /**
     * Constructor.
     *
     * @param modificationAction Modification action.
     */
    public constructor(modificationAction: AccountRestrictionModificationActionDto) {
        this.modificationAction = modificationAction;
    }

    /**
     * Creates an instance of AccountRestrictionModificationBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of AccountRestrictionModificationBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): AccountRestrictionModificationBuilder {
        const byteArray = Array.from(payload);
        const modificationAction = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 1));
        byteArray.splice(0, 1);
        return new AccountRestrictionModificationBuilder(modificationAction);
    }

    /**
     * Gets modification action.
     *
     * @return Modification action.
     */
    public getModificationAction(): AccountRestrictionModificationActionDto {
        return this.modificationAction;
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size = 0;
        size += 1; // modificationAction
        return size;
    }

    /**
     * Serializes an object to bytes.
     *
     * @return Serialized bytes.
     */
    public serialize(): Uint8Array {
        let newArray = Uint8Array.from([]);
        const modificationActionBytes = GeneratorUtils.uintToBuffer(this.modificationAction, 1);
        newArray = GeneratorUtils.concatTypedArrays(newArray, modificationActionBytes);
        return newArray;
    }
}
