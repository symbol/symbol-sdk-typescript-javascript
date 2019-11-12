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

import { AccountAddressRestrictionTransactionBodyBuilder } from './AccountAddressRestrictionTransactionBodyBuilder';
import { EmbeddedTransactionBuilder } from './EmbeddedTransactionBuilder';
import { EntityTypeDto } from './EntityTypeDto';
import { GeneratorUtils } from './GeneratorUtils';
import { KeyDto } from './KeyDto';
import { NetworkTypeDto } from './NetworkTypeDto';
import { UnresolvedAddressDto } from './UnresolvedAddressDto';

/** Binary layout for an embedded account address restriction transaction. */
export class EmbeddedAccountAddressRestrictionTransactionBuilder extends EmbeddedTransactionBuilder {
    /** Account address restriction transaction body. */
    accountAddressRestrictionTransactionBody: AccountAddressRestrictionTransactionBodyBuilder;

    /**
     * Constructor.
     *
     * @param signerPublicKey Entity signer's public key.
     * @param version Entity version.
     * @param network Entity network.
     * @param type Entity type.
     * @param restrictionFlags Account restriction flags.
     * @param restrictionAdditions Account restriction additions.
     * @param restrictionDeletions Account restriction deletions.
     */
    // tslint:disable-next-line: max-line-length
    public constructor(signerPublicKey: KeyDto,  version: number,  network: NetworkTypeDto,  type: EntityTypeDto,  restrictionFlags: number,  restrictionAdditions: UnresolvedAddressDto[],  restrictionDeletions: UnresolvedAddressDto[]) {
        super(signerPublicKey, version, network, type);
        // tslint:disable-next-line: max-line-length
        this.accountAddressRestrictionTransactionBody = new AccountAddressRestrictionTransactionBodyBuilder(restrictionFlags, restrictionAdditions, restrictionDeletions);
    }

    /**
     * Creates an instance of EmbeddedAccountAddressRestrictionTransactionBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of EmbeddedAccountAddressRestrictionTransactionBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): EmbeddedAccountAddressRestrictionTransactionBuilder {
        const byteArray = Array.from(payload);
        const superObject = EmbeddedTransactionBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, superObject.getSize());
        // tslint:disable-next-line: max-line-length
        const accountAddressRestrictionTransactionBody = AccountAddressRestrictionTransactionBodyBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, accountAddressRestrictionTransactionBody.getSize());
        // tslint:disable-next-line: max-line-length
        return new EmbeddedAccountAddressRestrictionTransactionBuilder(superObject.signerPublicKey, superObject.version, superObject.network, superObject.type, accountAddressRestrictionTransactionBody.restrictionFlags, accountAddressRestrictionTransactionBody.restrictionAdditions, accountAddressRestrictionTransactionBody.restrictionDeletions);
    }

    /**
     * Gets account restriction flags.
     *
     * @return Account restriction flags.
     */
    public getRestrictionFlags(): number {
        return this.accountAddressRestrictionTransactionBody.getRestrictionFlags();
    }

    /**
     * Gets reserved padding to align restrictionAdditions on 8-byte boundary.
     *
     * @return Reserved padding to align restrictionAdditions on 8-byte boundary.
     */
    public getAccountRestrictionTransactionBody_Reserved1(): number {
        return this.accountAddressRestrictionTransactionBody.getAccountRestrictionTransactionBody_Reserved1();
    }

    /**
     * Gets account restriction additions.
     *
     * @return Account restriction additions.
     */
    public getRestrictionAdditions(): UnresolvedAddressDto[] {
        return this.accountAddressRestrictionTransactionBody.getRestrictionAdditions();
    }

    /**
     * Gets account restriction deletions.
     *
     * @return Account restriction deletions.
     */
    public getRestrictionDeletions(): UnresolvedAddressDto[] {
        return this.accountAddressRestrictionTransactionBody.getRestrictionDeletions();
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size: number = super.getSize();
        size += this.accountAddressRestrictionTransactionBody.getSize();
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
        const accountAddressRestrictionTransactionBodyBytes = this.accountAddressRestrictionTransactionBody.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, accountAddressRestrictionTransactionBodyBytes);
        return newArray;
    }
}
