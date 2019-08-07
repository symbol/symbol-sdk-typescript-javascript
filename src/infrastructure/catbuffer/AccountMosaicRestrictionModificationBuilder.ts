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
import { AccountRestrictionModificationBuilder } from './AccountRestrictionModificationBuilder';
import { GeneratorUtils } from './GeneratorUtils';
import { UnresolvedMosaicIdDto } from './UnresolvedMosaicIdDto';

/** Account mosaic restriction modification. */
export class AccountMosaicRestrictionModificationBuilder extends AccountRestrictionModificationBuilder {
    /** Mosaic identifier restriction value. */
    value: UnresolvedMosaicIdDto;

    /**
     * Constructor.
     *
     * @param modificationAction Modification action.
     * @param value Mosaic identifier restriction value.
     */
    public constructor(modificationAction: AccountRestrictionModificationActionDto,  value: UnresolvedMosaicIdDto) {
        super(modificationAction);
        this.value = value;
    }

    /**
     * Creates an instance of AccountMosaicRestrictionModificationBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of AccountMosaicRestrictionModificationBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): AccountMosaicRestrictionModificationBuilder {
        const byteArray = Array.from(payload);
        const superObject = AccountRestrictionModificationBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, superObject.getSize());
        const value = UnresolvedMosaicIdDto.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, value.getSize());
        return new AccountMosaicRestrictionModificationBuilder(superObject.modificationAction, value);
    }

    /**
     * Gets mosaic identifier restriction value.
     *
     * @return Mosaic identifier restriction value.
     */
    public getValue(): UnresolvedMosaicIdDto {
        return this.value;
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size: number = super.getSize();
        size += this.value.getSize();
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
        const valueBytes = this.value.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, valueBytes);
        return newArray;
    }
}
