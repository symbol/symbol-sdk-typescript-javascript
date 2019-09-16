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
import { AmountDto } from './AmountDto';
import { EntityTypeDto } from './EntityTypeDto';
import { GeneratorUtils } from './GeneratorUtils';
import { KeyDto } from './KeyDto';
import { SignatureDto } from './SignatureDto';
import { TimestampDto } from './TimestampDto';
import { TransactionBuilder } from './TransactionBuilder';

/** Binary layout for a non-embedded account mosaic restriction transaction. */
export class AccountMosaicRestrictionTransactionBuilder extends TransactionBuilder {
    /** Account mosaic restriction transaction body. */
    accountMosaicRestrictionTransactionBody: AccountMosaicRestrictionTransactionBodyBuilder;

    /**
     * Constructor.
     *
     * @param signature Entity signature.
     * @param signerPublicKey Entity signer's public key.
     * @param version Entity version.
     * @param type Entity type.
     * @param fee Transaction fee.
     * @param deadline Transaction deadline.
     * @param restrictionType Account restriction type.
     * @param modifications Account restriction modifications.
     */
    // tslint:disable-next-line: max-line-length
    public constructor(signature: SignatureDto,  signerPublicKey: KeyDto,  version: number,  type: EntityTypeDto,  fee: AmountDto,  deadline: TimestampDto,  restrictionType: AccountRestrictionTypeDto,  modifications: AccountMosaicRestrictionModificationBuilder[]) {
        super(signature, signerPublicKey, version, type, fee, deadline);
        // tslint:disable-next-line: max-line-length
        this.accountMosaicRestrictionTransactionBody = new AccountMosaicRestrictionTransactionBodyBuilder(restrictionType, modifications);
    }

    /**
     * Creates an instance of AccountMosaicRestrictionTransactionBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of AccountMosaicRestrictionTransactionBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): AccountMosaicRestrictionTransactionBuilder {
        const byteArray = Array.from(payload);
        const superObject = TransactionBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, superObject.getSize());
        // tslint:disable-next-line: max-line-length
        const accountMosaicRestrictionTransactionBody = AccountMosaicRestrictionTransactionBodyBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, accountMosaicRestrictionTransactionBody.getSize());
        // tslint:disable-next-line: max-line-length
        return new AccountMosaicRestrictionTransactionBuilder(superObject.signature, superObject.signerPublicKey, superObject.version, superObject.type, superObject.fee, superObject.deadline, accountMosaicRestrictionTransactionBody.restrictionType, accountMosaicRestrictionTransactionBody.modifications);
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
