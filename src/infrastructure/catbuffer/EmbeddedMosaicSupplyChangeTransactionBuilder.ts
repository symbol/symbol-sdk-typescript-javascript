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

import { AmountDto } from './AmountDto';
import { EmbeddedTransactionBuilder } from './EmbeddedTransactionBuilder';
import { EntityTypeDto } from './EntityTypeDto';
import { GeneratorUtils } from './GeneratorUtils';
import { KeyDto } from './KeyDto';
import { MosaicSupplyChangeActionDto } from './MosaicSupplyChangeActionDto';
import { MosaicSupplyChangeTransactionBodyBuilder } from './MosaicSupplyChangeTransactionBodyBuilder';
import { NetworkTypeDto } from './NetworkTypeDto';
import { UnresolvedMosaicIdDto } from './UnresolvedMosaicIdDto';

/** Binary layout for an embedded mosaic supply change transaction. */
export class EmbeddedMosaicSupplyChangeTransactionBuilder extends EmbeddedTransactionBuilder {
    /** Mosaic supply change transaction body. */
    mosaicSupplyChangeTransactionBody: MosaicSupplyChangeTransactionBodyBuilder;

    /**
     * Constructor.
     *
     * @param signerPublicKey Entity signer's public key.
     * @param version Entity version.
     * @param network Entity network.
     * @param type Entity type.
     * @param mosaicId Affected mosaic identifier.
     * @param delta Change amount.
     * @param action Supply change action.
     */
    // tslint:disable-next-line: max-line-length
    public constructor(signerPublicKey: KeyDto,  version: number,  network: NetworkTypeDto,  type: EntityTypeDto,  mosaicId: UnresolvedMosaicIdDto,  delta: AmountDto,  action: MosaicSupplyChangeActionDto) {
        super(signerPublicKey, version, network, type);
        this.mosaicSupplyChangeTransactionBody = new MosaicSupplyChangeTransactionBodyBuilder(mosaicId, delta, action);
    }

    /**
     * Creates an instance of EmbeddedMosaicSupplyChangeTransactionBuilder from binary payload.
     *
     * @param payload Byte payload to use to serialize the object.
     * @return Instance of EmbeddedMosaicSupplyChangeTransactionBuilder.
     */
    public static loadFromBinary(payload: Uint8Array): EmbeddedMosaicSupplyChangeTransactionBuilder {
        const byteArray = Array.from(payload);
        const superObject = EmbeddedTransactionBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, superObject.getSize());
        // tslint:disable-next-line: max-line-length
        const mosaicSupplyChangeTransactionBody = MosaicSupplyChangeTransactionBodyBuilder.loadFromBinary(Uint8Array.from(byteArray));
        byteArray.splice(0, mosaicSupplyChangeTransactionBody.getSize());
        // tslint:disable-next-line: max-line-length
        return new EmbeddedMosaicSupplyChangeTransactionBuilder(superObject.signerPublicKey, superObject.version, superObject.network, superObject.type, mosaicSupplyChangeTransactionBody.mosaicId, mosaicSupplyChangeTransactionBody.delta, mosaicSupplyChangeTransactionBody.action);
    }

    /**
     * Gets affected mosaic identifier.
     *
     * @return Affected mosaic identifier.
     */
    public getMosaicId(): UnresolvedMosaicIdDto {
        return this.mosaicSupplyChangeTransactionBody.getMosaicId();
    }

    /**
     * Gets change amount.
     *
     * @return Change amount.
     */
    public getDelta(): AmountDto {
        return this.mosaicSupplyChangeTransactionBody.getDelta();
    }

    /**
     * Gets supply change action.
     *
     * @return Supply change action.
     */
    public getAction(): MosaicSupplyChangeActionDto {
        return this.mosaicSupplyChangeTransactionBody.getAction();
    }

    /**
     * Gets the size of the object.
     *
     * @return Size in bytes.
     */
    public getSize(): number {
        let size: number = super.getSize();
        size += this.mosaicSupplyChangeTransactionBody.getSize();
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
        const mosaicSupplyChangeTransactionBodyBytes = this.mosaicSupplyChangeTransactionBody.serialize();
        newArray = GeneratorUtils.concatTypedArrays(newArray, mosaicSupplyChangeTransactionBodyBytes);
        return newArray;
    }
}
