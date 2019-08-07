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

import { AccountMosaicRestrictionModificationBuilder } from './AccountMosaicRestrictionModificationBuilder';
import { AccountRestrictionTypeDto } from './AccountRestrictionTypeDto';
import { GeneratorUtils } from './GeneratorUtils';

/** Binary layout for an account mosaic restriction transaction. */
export class AccountMosaicRestrictionTransactionBodyBuilder {
    /** Account restriction type. */
    restrictionType: AccountRestrictionTypeDto;
    /** Account restriction modifications. */
    modifications: AccountMosaicRestrictionModificationBuilder[];

    /**
     * Constructor.
     *
     * @param restrictionType Account restriction type.
     * @param modifications Account restriction modifications.
     */
    // tslint:disable-next-line: max-line-length
    public constructor(restrictionType: AccountRestrictionTypeDto,  modifications: AccountMosaicRestrictionModificationBuilder[]) {
        this.restrictionType = restrictionType;
        this.modifications = modifications;
    }

    /**
     * Creates an instance of AccountMosaicRestrictionTransactionBodyBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of AccountMosaicRestrictionTransactionBodyBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): AccountMosaicRestrictionTransactionBodyBuilder {
        const byteArray = Array.from(payload);
        const restrictionType = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 1));
        byteArray.splice(0, 1);
        const modificationsCount = GeneratorUtils.bufferToUint(GeneratorUtils.getBytes(Uint8Array.from(byteArray), 1));
        byteArray.splice(0, 1);
        const modifications: AccountMosaicRestrictionModificationBuilder[] = [];
        for (let i = 0; i < modificationsCount; i++) {
            const item = AccountMosaicRestrictionModificationBuilder.loadFromBinary(Uint8Array.from(byteArray));
            modifications.push(item);
            byteArray.splice(0, item.getSize());
        }
        return new AccountMosaicRestrictionTransactionBodyBuilder(restrictionType, modifications);
    }

    /**
     * Gets account restriction type.
     *
     * @return Account restriction type.
     */
    public getRestrictionType(): AccountRestrictionTypeDto {
        return this.restrictionType;
    }

    /**
     * Gets account restriction modifications.
     *
     * @return Account restriction modifications.
     */
    public getModifications(): AccountMosaicRestrictionModificationBuilder[] {
        return this.modifications;
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size = 0;
        size += 1; // restrictionType
        size += 1; // modificationsCount
        this.modifications.forEach((o) => size += o.getSize());
        return size;
    }

    /**
     * Serializes an object to bytes.
     *
     * @return Serialized bytes.
     */
    public serialize(): Uint8Array {
        let newArray = Uint8Array.from([]);
        const restrictionTypeBytes = GeneratorUtils.uintToBuffer(this.restrictionType, 1);
        newArray = GeneratorUtils.concatTypedArrays(newArray, restrictionTypeBytes);
        const modificationsCountBytes = GeneratorUtils.uintToBuffer(this.modifications.length, 1);
        newArray = GeneratorUtils.concatTypedArrays(newArray, modificationsCountBytes);
        this.modifications.forEach((item) => {
            const modificationsBytes = item.serialize();
            newArray = GeneratorUtils.concatTypedArrays(newArray, modificationsBytes);
        });
        return newArray;
    }
}
