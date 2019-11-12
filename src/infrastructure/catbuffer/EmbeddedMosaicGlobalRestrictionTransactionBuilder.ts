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

import { EmbeddedTransactionBuilder } from './EmbeddedTransactionBuilder';
import { EntityTypeDto } from './EntityTypeDto';
import { GeneratorUtils } from './GeneratorUtils';
import { KeyDto } from './KeyDto';
import { MosaicGlobalRestrictionTransactionBodyBuilder } from './MosaicGlobalRestrictionTransactionBodyBuilder';
import { MosaicRestrictionTypeDto } from './MosaicRestrictionTypeDto';
import { NetworkTypeDto } from './NetworkTypeDto';
import { UnresolvedMosaicIdDto } from './UnresolvedMosaicIdDto';

/** Binary layout for an embedded mosaic global restriction transaction. */
export class EmbeddedMosaicGlobalRestrictionTransactionBuilder extends EmbeddedTransactionBuilder {
    /** Mosaic global restriction transaction body. */
    mosaicGlobalRestrictionTransactionBody: MosaicGlobalRestrictionTransactionBodyBuilder;

    /**
     * Constructor.
     *
     * @param signerPublicKey Entity signer's public key.
     * @param version Entity version.
     * @param network Entity network.
     * @param type Entity type.
     * @param mosaicId Identifier of the mosaic being restricted.
     * @param referenceMosaicId Identifier of the mosaic providing the restriction key.
     * @param restrictionKey Restriction key relative to the reference mosaic identifier.
     * @param previousRestrictionValue Previous restriction value.
     * @param newRestrictionValue New restriction value.
     * @param previousRestrictionType Previous restriction type.
     * @param newRestrictionType New restriction type.
     */
    // tslint:disable-next-line: max-line-length
    public constructor(signerPublicKey: KeyDto,  version: number,  network: NetworkTypeDto,  type: EntityTypeDto,  mosaicId: UnresolvedMosaicIdDto,  referenceMosaicId: UnresolvedMosaicIdDto,  restrictionKey: number[],  previousRestrictionValue: number[],  newRestrictionValue: number[],  previousRestrictionType: MosaicRestrictionTypeDto,  newRestrictionType: MosaicRestrictionTypeDto) {
        super(signerPublicKey, version, network, type);
        // tslint:disable-next-line: max-line-length
        this.mosaicGlobalRestrictionTransactionBody = new MosaicGlobalRestrictionTransactionBodyBuilder(mosaicId, referenceMosaicId, restrictionKey, previousRestrictionValue, newRestrictionValue, previousRestrictionType, newRestrictionType);
    }

    /**
     * Creates an instance of EmbeddedMosaicGlobalRestrictionTransactionBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of EmbeddedMosaicGlobalRestrictionTransactionBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): EmbeddedMosaicGlobalRestrictionTransactionBuilder {
        const byteArray = Array.from(payload);
        const superObject = EmbeddedTransactionBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, superObject.getSize());
        // tslint:disable-next-line: max-line-length
        const mosaicGlobalRestrictionTransactionBody = MosaicGlobalRestrictionTransactionBodyBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, mosaicGlobalRestrictionTransactionBody.getSize());
        // tslint:disable-next-line: max-line-length
        return new EmbeddedMosaicGlobalRestrictionTransactionBuilder(superObject.signerPublicKey, superObject.version, superObject.network, superObject.type, mosaicGlobalRestrictionTransactionBody.mosaicId, mosaicGlobalRestrictionTransactionBody.referenceMosaicId, mosaicGlobalRestrictionTransactionBody.restrictionKey, mosaicGlobalRestrictionTransactionBody.previousRestrictionValue, mosaicGlobalRestrictionTransactionBody.newRestrictionValue, mosaicGlobalRestrictionTransactionBody.previousRestrictionType, mosaicGlobalRestrictionTransactionBody.newRestrictionType);
    }

    /**
     * Gets identifier of the mosaic being restricted.
     *
     * @return Identifier of the mosaic being restricted.
     */
    public getMosaicId(): UnresolvedMosaicIdDto {
        return this.mosaicGlobalRestrictionTransactionBody.getMosaicId();
    }

    /**
     * Gets identifier of the mosaic providing the restriction key.
     *
     * @return Identifier of the mosaic providing the restriction key.
     */
    public getReferenceMosaicId(): UnresolvedMosaicIdDto {
        return this.mosaicGlobalRestrictionTransactionBody.getReferenceMosaicId();
    }

    /**
     * Gets restriction key relative to the reference mosaic identifier.
     *
     * @return Restriction key relative to the reference mosaic identifier.
     */
    public getRestrictionKey(): number[] {
        return this.mosaicGlobalRestrictionTransactionBody.getRestrictionKey();
    }

    /**
     * Gets previous restriction value.
     *
     * @return Previous restriction value.
     */
    public getPreviousRestrictionValue(): number[] {
        return this.mosaicGlobalRestrictionTransactionBody.getPreviousRestrictionValue();
    }

    /**
     * Gets new restriction value.
     *
     * @return New restriction value.
     */
    public getNewRestrictionValue(): number[] {
        return this.mosaicGlobalRestrictionTransactionBody.getNewRestrictionValue();
    }

    /**
     * Gets previous restriction type.
     *
     * @return Previous restriction type.
     */
    public getPreviousRestrictionType(): MosaicRestrictionTypeDto {
        return this.mosaicGlobalRestrictionTransactionBody.getPreviousRestrictionType();
    }

    /**
     * Gets new restriction type.
     *
     * @return New restriction type.
     */
    public getNewRestrictionType(): MosaicRestrictionTypeDto {
        return this.mosaicGlobalRestrictionTransactionBody.getNewRestrictionType();
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size: number = super.getSize();
        size += this.mosaicGlobalRestrictionTransactionBody.getSize();
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
        const mosaicGlobalRestrictionTransactionBodyBytes = this.mosaicGlobalRestrictionTransactionBody.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, mosaicGlobalRestrictionTransactionBodyBytes);
        return newArray;
    }
}
