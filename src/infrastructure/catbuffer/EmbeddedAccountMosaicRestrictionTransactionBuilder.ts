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
import { AccountMosaicRestrictionTransactionBodyBuilder } from './AccountMosaicRestrictionTransactionBodyBuilder';
import { AccountRestrictionTypeDto } from './AccountRestrictionTypeDto';
import { EmbeddedTransactionBuilder } from './EmbeddedTransactionBuilder';
import { EntityTypeDto } from './EntityTypeDto';
import { GeneratorUtils } from './GeneratorUtils';
import { KeyDto } from './KeyDto';

/** Binary layout for an embedded account mosaic restriction transaction. */
export class EmbeddedAccountMosaicRestrictionTransactionBuilder extends EmbeddedTransactionBuilder {
    /** Account mosaic restriction transaction body. */
    accountMosaicRestrictionTransactionBody: AccountMosaicRestrictionTransactionBodyBuilder;

    /**
     * Constructor.
     *
     * @param signer Entity signer's public key.
     * @param version Entity version.
     * @param type Entity type.
     * @param restrictionType Account restriction type.
     * @param modifications Account restriction modifications.
     */
    // tslint:disable-next-line: max-line-length
    public constructor(signer: KeyDto,  version: number,  type: EntityTypeDto,  restrictionType: AccountRestrictionTypeDto,  modifications: AccountMosaicRestrictionModificationBuilder[]) {
        super(signer, version, type);
        // tslint:disable-next-line: max-line-length
        this.accountMosaicRestrictionTransactionBody = new AccountMosaicRestrictionTransactionBodyBuilder(restrictionType, modifications);
    }

    /**
     * Creates an instance of EmbeddedAccountMosaicRestrictionTransactionBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of EmbeddedAccountMosaicRestrictionTransactionBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): EmbeddedAccountMosaicRestrictionTransactionBuilder {
        const byteArray = Array.from(payload);
        const superObject = EmbeddedTransactionBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, superObject.getSize());
        // tslint:disable-next-line: max-line-length
        const accountMosaicRestrictionTransactionBody = AccountMosaicRestrictionTransactionBodyBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, accountMosaicRestrictionTransactionBody.getSize());
        // tslint:disable-next-line: max-line-length
        return new EmbeddedAccountMosaicRestrictionTransactionBuilder(superObject.signer, superObject.version, superObject.type, accountMosaicRestrictionTransactionBody.restrictionType, accountMosaicRestrictionTransactionBody.modifications);
    }

    /**
     * Gets account restriction type.
     *
     * @return Account restriction type.
     */
    public getRestrictionType(): AccountRestrictionTypeDto {
        return this.accountMosaicRestrictionTransactionBody.getRestrictionType();
    }

    /**
     * Gets account restriction modifications.
     *
     * @return Account restriction modifications.
     */
    public getModifications(): AccountMosaicRestrictionModificationBuilder[] {
        return this.accountMosaicRestrictionTransactionBody.getModifications();
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size: number = super.getSize();
        size += this.accountMosaicRestrictionTransactionBody.getSize();
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
        const accountMosaicRestrictionTransactionBodyBytes = this.accountMosaicRestrictionTransactionBody.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, accountMosaicRestrictionTransactionBodyBytes);
        return newArray;
    }
}
