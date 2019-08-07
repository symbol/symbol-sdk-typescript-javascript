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

import { CosignatoryModificationBuilder } from './CosignatoryModificationBuilder';
import { EmbeddedTransactionBuilder } from './EmbeddedTransactionBuilder';
import { EntityTypeDto } from './EntityTypeDto';
import { GeneratorUtils } from './GeneratorUtils';
import { KeyDto } from './KeyDto';
import { MultisigAccountModificationTransactionBodyBuilder } from './MultisigAccountModificationTransactionBodyBuilder';

/** Binary layout for an embedded multisig account modification transaction. */
export class EmbeddedMultisigAccountModificationTransactionBuilder extends EmbeddedTransactionBuilder {
    /** Multisig account modification transaction body. */
    multisigAccountModificationTransactionBody: MultisigAccountModificationTransactionBodyBuilder;

    /**
     * Constructor.
     *
     * @param signer Entity signer's public key.
     * @param version Entity version.
     * @param type Entity type.
     * @param minRemovalDelta Relative change of the minimal number of cosignatories required when removing an account.
     * @param minApprovalDelta Relative change of the minimal number of cosignatories required when approving a transaction.
     * @param modifications Attached cosignatory modifications.
     */
    // tslint:disable-next-line: max-line-length
    public constructor(signer: KeyDto,  version: number,  type: EntityTypeDto,  minRemovalDelta: number,  minApprovalDelta: number,  modifications: CosignatoryModificationBuilder[]) {
        super(signer, version, type);
        // tslint:disable-next-line: max-line-length
        this.multisigAccountModificationTransactionBody = new MultisigAccountModificationTransactionBodyBuilder(minRemovalDelta, minApprovalDelta, modifications);
    }

    /**
     * Creates an instance of EmbeddedMultisigAccountModificationTransactionBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of EmbeddedMultisigAccountModificationTransactionBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): EmbeddedMultisigAccountModificationTransactionBuilder {
        const byteArray = Array.from(payload);
        const superObject = EmbeddedTransactionBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, superObject.getSize());
        // tslint:disable-next-line: max-line-length
        const multisigAccountModificationTransactionBody = MultisigAccountModificationTransactionBodyBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, multisigAccountModificationTransactionBody.getSize());
        // tslint:disable-next-line: max-line-length
        return new EmbeddedMultisigAccountModificationTransactionBuilder(superObject.signer, superObject.version, superObject.type, multisigAccountModificationTransactionBody.minRemovalDelta, multisigAccountModificationTransactionBody.minApprovalDelta, multisigAccountModificationTransactionBody.modifications);
    }

    /**
     * Gets relative change of the minimal number of cosignatories required when removing an account.
     *
     * @return Relative change of the minimal number of cosignatories required when removing an account.
     */
    public getMinRemovalDelta(): number {
        return this.multisigAccountModificationTransactionBody.getMinRemovalDelta();
    }

    /**
     * Gets relative change of the minimal number of cosignatories required when approving a transaction.
     *
     * @return Relative change of the minimal number of cosignatories required when approving a transaction.
     */
    public getMinApprovalDelta(): number {
        return this.multisigAccountModificationTransactionBody.getMinApprovalDelta();
    }

    /**
     * Gets attached cosignatory modifications.
     *
     * @return Attached cosignatory modifications.
     */
    public getModifications(): CosignatoryModificationBuilder[] {
        return this.multisigAccountModificationTransactionBody.getModifications();
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size: number = super.getSize();
        size += this.multisigAccountModificationTransactionBody.getSize();
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
        const multisigAccountModificationTransactionBodyBytes = this.multisigAccountModificationTransactionBody.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, multisigAccountModificationTransactionBodyBytes);
        return newArray;
    }
}
